import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

function getMetaplex(): Metaplex {
  const secret = process.env.CREATOR_PRIVATE_KEY;
  if (!secret) throw new Error("CREATOR_PRIVATE_KEY env var is required");

  // Create a fresh instance each time to avoid stale blockhashes
  // after long-running operations (e.g. AI image generation)
  const connection = new Connection(
    process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    "confirmed"
  );
  const creator = Keypair.fromSecretKey(bs58.decode(secret));
  return Metaplex.make(connection).use(keypairIdentity(creator));
}

const MAX_MINT_RETRIES = 3;
const MAX_VERIFY_RETRIES = 6;
const VERIFY_INITIAL_DELAY_MS = 500;

function isAccountNotFoundError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("was not found at the provided address") ||
    msg.includes("AccountNotFoundError")
  );
}

export async function mintNft(params: {
  name: string;
  metadataUri: string;
  ownerAddress: string;
  collectionMintAddress: string;
}): Promise<{ mintAddress: string; txSignature: string }> {
  const owner = new PublicKey(params.ownerAddress);
  const collectionMint = new PublicKey(params.collectionMintAddress);

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_MINT_RETRIES; attempt++) {
    // Fresh Metaplex instance each attempt for a fresh blockhash
    const metaplex = getMetaplex();

    let created;
    try {
      created = await metaplex.nfts().create({
        uri: params.metadataUri,
        name: params.name,
        sellerFeeBasisPoints: 0,
        tokenOwner: owner,
        collection: collectionMint,
      });
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isBlockhashError =
        msg.includes("block height exceeded") ||
        msg.includes("Blockhash not found") ||
        msg.includes("BlockhashNotFound");

      if (isBlockhashError && attempt < MAX_MINT_RETRIES) {
        console.log(`NFT mint attempt ${attempt} failed (blockhash expired), retrying...`);
        continue;
      }

      throw err;
    }

    const { nft, response } = created;

    // Create succeeded — the NFT exists on-chain. Verify collection membership,
    // retrying on AccountNotFoundError while the new mint account propagates
    // to the RPC used for the read.
    for (let vAttempt = 1; vAttempt <= MAX_VERIFY_RETRIES; vAttempt++) {
      try {
        await metaplex.nfts().verifyCollection({
          mintAddress: nft.address,
          collectionMintAddress: collectionMint,
        });
        break;
      } catch (err: unknown) {
        if (isAccountNotFoundError(err) && vAttempt < MAX_VERIFY_RETRIES) {
          const delay = VERIFY_INITIAL_DELAY_MS * 2 ** (vAttempt - 1);
          console.log(
            `verifyCollection attempt ${vAttempt} failed (mint account not visible yet), retrying in ${delay}ms...`
          );
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        throw err;
      }
    }

    return {
      mintAddress: nft.address.toBase58(),
      txSignature: response.signature,
    };
  }

  throw lastError;
}

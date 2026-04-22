import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import {
  Connection,
  Keypair,
  PublicKey,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import bs58 from "bs58";

function getMetaplex(): Metaplex {
  const secret = process.env.CREATOR_PRIVATE_KEY;
  if (!secret) throw new Error("CREATOR_PRIVATE_KEY env var is required");

  const connection = new Connection(
    process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 120_000,
    }
  );
  const creator = Keypair.fromSecretKey(bs58.decode(secret));

  const metaplex = Metaplex.make(connection).use(keypairIdentity(creator));

  // Add priority fees so transactions land faster
  const originalSendAndConfirm = metaplex
    .rpc()
    .sendAndConfirmTransaction.bind(metaplex.rpc());

  metaplex.rpc().sendAndConfirmTransaction = async (
    transaction,
    sendOptions,
    confirmOptions
  ) => {
    // Prepend priority fee instructions
    if ("instructions" in transaction) {
      transaction.instructions.unshift(
        ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50_000 })
      );
    }

    return originalSendAndConfirm(transaction, sendOptions, confirmOptions);
  };

  return metaplex;
}

const MAX_MINT_RETRIES = 3;

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
    try {
      const metaplex = getMetaplex();

      const { nft, response } = await metaplex.nfts().create({
        uri: params.metadataUri,
        name: params.name,
        sellerFeeBasisPoints: 0,
        tokenOwner: owner,
        collection: collectionMint,
      });

      await metaplex.nfts().verifyCollection({
        mintAddress: nft.address,
        collectionMintAddress: collectionMint,
      });

      return {
        mintAddress: nft.address.toBase58(),
        txSignature: response.signature,
      };
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isRetryable =
        msg.includes("block height exceeded") ||
        msg.includes("Blockhash not found") ||
        msg.includes("BlockhashNotFound") ||
        msg.includes("Transaction was not confirmed");

      if (isRetryable && attempt < MAX_MINT_RETRIES) {
        console.log(
          `NFT mint attempt ${attempt}/${MAX_MINT_RETRIES} failed, retrying...`
        );
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

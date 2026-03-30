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

export async function mintNft(params: {
  name: string;
  metadataUri: string;
  ownerAddress: string;
  collectionMintAddress: string;
}): Promise<{ mintAddress: string; txSignature: string }> {
  const metaplex = getMetaplex();
  const owner = new PublicKey(params.ownerAddress);
  const collectionMint = new PublicKey(params.collectionMintAddress);

  const { nft, response } = await metaplex.nfts().create({
    uri: params.metadataUri,
    name: params.name,
    sellerFeeBasisPoints: 0,
    tokenOwner: owner,
    collection: collectionMint,
  });

  // Verify collection membership (creator is collection authority)
  await metaplex.nfts().verifyCollection({
    mintAddress: nft.address,
    collectionMintAddress: collectionMint,
  });

  return {
    mintAddress: nft.address.toBase58(),
    txSignature: response.signature,
  };
}

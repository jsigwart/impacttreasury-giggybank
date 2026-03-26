import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection(
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
  "confirmed"
);

function getCreatorKeypair(): Keypair {
  const secret = process.env.CREATOR_PRIVATE_KEY;
  if (!secret) throw new Error("CREATOR_PRIVATE_KEY env var is required");
  return Keypair.fromSecretKey(bs58.decode(secret));
}

const creator = getCreatorKeypair();
const metaplex = Metaplex.make(connection).use(keypairIdentity(creator));

export async function mintNft(params: {
  name: string;
  metadataUri: string;
  ownerAddress: string;
  collectionMintAddress: string;
}): Promise<{ mintAddress: string; txSignature: string }> {
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

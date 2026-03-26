import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const connection = new Connection(
    process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  const secret = process.env.CREATOR_PRIVATE_KEY;
  if (!secret) throw new Error("CREATOR_PRIVATE_KEY required");
  const creator = Keypair.fromSecretKey(bs58.decode(secret));

  console.log("Creator wallet:", creator.publicKey.toBase58());

  const metaplex = Metaplex.make(connection).use(keypairIdentity(creator));

  console.log("Creating collection NFT...");
  const { nft } = await metaplex.nfts().create({
    name: "GiggyBank Honoraries",
    uri: "", // Will update with proper metadata URI if needed
    sellerFeeBasisPoints: 0,
    isCollection: true,
  });

  console.log("Collection NFT created!");
  console.log("COLLECTION_MINT_ADDRESS=" + nft.address.toBase58());
  console.log("\nAdd this to your .env.local file.");
}

main().catch(console.error);

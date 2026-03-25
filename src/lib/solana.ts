import { Connection, PublicKey } from "@solana/web3.js";
import { config } from "@/giggybank.config";
import { supabase } from "@/lib/supabase";

const TREASURY_WALLET = new PublicKey(config.treasury.wallet);
const TOKEN_MINT = new PublicKey(config.token.address);

// SPL Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

const connection = new Connection(
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
  "confirmed"
);

/**
 * Verify that a Solana transaction signature represents a valid token payment
 * to the treasury wallet, and that it hasn't been redeemed before.
 *
 * Returns the payer's wallet address on success, or throws on failure.
 */
export async function verifyPaymentTransaction(
  txSignature: string
): Promise<string> {
  // 1. Check if this signature was already redeemed
  const { data: existing } = await supabase
    .from("redeemed_transactions")
    .select("tx_signature")
    .eq("tx_signature", txSignature)
    .single();

  if (existing) {
    throw new Error("This transaction has already been used.");
  }

  // 2. Fetch the confirmed transaction from Solana
  const tx = await connection.getParsedTransaction(txSignature, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed",
  });

  if (!tx) {
    throw new Error(
      "Transaction not found. It may not be confirmed yet — please wait and retry."
    );
  }

  if (tx.meta?.err) {
    throw new Error("Transaction failed on-chain.");
  }

  // 3. Look for a token transfer to the treasury in the transaction instructions
  const instructions = tx.transaction.message.instructions;
  let payerWallet: string | null = null;

  for (const ix of instructions) {
    if (!("parsed" in ix)) continue;
    const parsed = ix as {
      program: string;
      programId: PublicKey;
      parsed: {
        type: string;
        info: {
          authority?: string;
          source?: string;
          destination?: string;
          mint?: string;
          amount?: string;
          tokenAmount?: { amount: string };
        };
      };
    };

    if (parsed.program !== "spl-token") continue;

    const info = parsed.parsed?.info;
    if (!info) continue;

    // Check transfer or transferChecked instructions
    const isTransfer =
      parsed.parsed.type === "transfer" ||
      parsed.parsed.type === "transferChecked";

    if (!isTransfer) continue;

    // For transferChecked, verify the mint matches our token
    if (parsed.parsed.type === "transferChecked" && info.mint) {
      if (info.mint !== TOKEN_MINT.toBase58()) continue;
    }

    // Verify destination is the treasury's associated token account
    // We check the post-token-balances to confirm the treasury received tokens
    if (info.authority) {
      payerWallet = info.authority;
    }
  }

  // Also verify via post-token balances that treasury received the correct token
  const postBalances = tx.meta?.postTokenBalances || [];
  const preBalances = tx.meta?.preTokenBalances || [];

  let treasuryReceived = false;

  for (const post of postBalances) {
    if (
      post.owner === TREASURY_WALLET.toBase58() &&
      post.mint === TOKEN_MINT.toBase58()
    ) {
      // Find matching pre-balance to confirm an increase
      const pre = preBalances.find(
        (p) =>
          p.accountIndex === post.accountIndex &&
          p.owner === TREASURY_WALLET.toBase58()
      );
      const preAmount = BigInt(pre?.uiTokenAmount?.amount || "0");
      const postAmount = BigInt(post.uiTokenAmount?.amount || "0");

      if (postAmount > preAmount) {
        treasuryReceived = true;
      }
    }
  }

  if (!treasuryReceived) {
    throw new Error(
      "Transaction does not contain a valid token payment to the treasury."
    );
  }

  if (!payerWallet) {
    // Fall back to the fee payer as the wallet address
    payerWallet =
      tx.transaction.message.accountKeys[0]?.pubkey?.toBase58() || "";
  }

  // 4. Mark this transaction as redeemed
  await supabase
    .from("redeemed_transactions")
    .insert({ tx_signature: txSignature, wallet: payerWallet });

  return payerWallet;
}

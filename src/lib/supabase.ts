import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getOrCreateUser(externalId: string) {
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("external_id", externalId)
    .single();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("users")
    .insert({ external_id: externalId })
    .select()
    .single();

  if (error) throw new Error(`Failed to create user: ${error.message}`);
  return created;
}

export async function saveGeneration(params: {
  userId: string;
  prompt: string;
  basePrompt: string;
  sourceUrl: string;
  referenceImages: string[];
  resultUrl: string;
  type: string;
}): Promise<string> {
  const { data, error } = await supabase
    .from("generations")
    .insert({
      user_id: params.userId,
      prompt: params.prompt,
      base_prompt: params.basePrompt,
      source_url: params.sourceUrl,
      reference_images: params.referenceImages,
      result_url: params.resultUrl,
      type: params.type,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to save generation: ${error.message}`);
  return data.id;
}

export async function getDefaultPrompts() {
  const { data, error } = await supabase
    .from("default_prompts")
    .select("*")
    .single();

  if (error || !data) {
    return {
      image:
        "Generate a high-quality stylized image based on the provided inputs.",
    };
  }

  return data as { image: string };
}

export async function getNextMintNumber(): Promise<number> {
  const { count } = await supabase
    .from("nft_mints")
    .select("*", { count: "exact", head: true });
  return (count ?? 0) + 1;
}

export async function saveMintRecord(params: {
  generationId: string;
  mintAddress: string;
  ownerWallet: string;
  metadataUri: string;
  imageUrl: string;
  txSignature: string;
  mintNumber: number;
}) {
  const { error } = await supabase.from("nft_mints").insert({
    generation_id: params.generationId,
    mint_address: params.mintAddress,
    owner_wallet: params.ownerWallet,
    metadata_uri: params.metadataUri,
    image_url: params.imageUrl,
    tx_signature: params.txSignature,
    mint_number: params.mintNumber,
  });
  if (error) throw new Error(`Failed to save mint record: ${error.message}`);
}

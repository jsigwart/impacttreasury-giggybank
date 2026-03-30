import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 20,
});

export { sql };

export async function getOrCreateUser(externalId: string) {
  const [existing] = await sql`
    SELECT * FROM users WHERE external_id = ${externalId}
  `;

  if (existing) return existing;

  const [created] = await sql`
    INSERT INTO users (external_id) VALUES (${externalId})
    RETURNING *
  `;

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
  const [data] = await sql`
    INSERT INTO generations (user_id, prompt, base_prompt, source_url, reference_images, result_url, type)
    VALUES (
      ${params.userId},
      ${params.prompt},
      ${params.basePrompt},
      ${params.sourceUrl},
      ${params.referenceImages},
      ${params.resultUrl},
      ${params.type}
    )
    RETURNING id
  `;

  return data.id;
}

export async function getDefaultPrompts() {
  const [data] = await sql`
    SELECT * FROM default_prompts LIMIT 1
  `;

  if (!data) {
    return {
      image:
        "Generate a high-quality stylized image based on the provided inputs.",
    };
  }

  return data as { image: string };
}

export async function getNextMintNumber(): Promise<number> {
  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM nft_mints
  `;
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
  await sql`
    INSERT INTO nft_mints (generation_id, mint_address, owner_wallet, metadata_uri, image_url, tx_signature, mint_number)
    VALUES (
      ${params.generationId},
      ${params.mintAddress},
      ${params.ownerWallet},
      ${params.metadataUri},
      ${params.imageUrl},
      ${params.txSignature},
      ${params.mintNumber}
    )
  `;
}

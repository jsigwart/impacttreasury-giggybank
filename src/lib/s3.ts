import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const BUCKET = process.env.AWS_S3_BUCKET!;

export const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getS3Object(key: string) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const response = await s3.send(command);

  const bodyBytes = await response.Body!.transformToByteArray();
  const body = Buffer.from(bodyBytes);
  const contentType = response.ContentType ?? "image/png";

  return { body, contentType };
}

import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
import path from "path";
import {
  saveGeneration,
  getDefaultPrompts,
  getNextMintNumber,
  saveMintRecord,
} from "@/lib/db";
import { s3, BUCKET, getS3Object, getPublicUrl } from "@/lib/s3";
import { verifyPaymentTransaction } from "@/lib/solana";
import { mintNft } from "@/lib/metaplex";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceImage, txSignature, walletAddress } =
      await request.json();

    // DEVNET TESTING: skip payment verification
    // TODO: Remove this block and restore payment verification before going to production
    const DEVNET_TESTING = process.env.SOLANA_RPC_URL?.includes("devnet");
    let payerWallet: string;

    if (DEVNET_TESTING) {
      // Use the wallet address passed from the client
      payerWallet = walletAddress || "6mtski33htLBvSpsiMDsQYkEXeTvN1NcvCoKqs1iPQXJ";
    } else {
      if (!txSignature) {
        return NextResponse.json(
          { error: "Payment transaction signature is required" },
          { status: 403 }
        );
      }

      // Verify the Solana payment transaction on-chain
      try {
        payerWallet = await verifyPaymentTransaction(txSignature);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Transaction verification failed";
        return NextResponse.json({ error: message }, { status: 403 });
      }
    }

    if (!referenceImage) {
      return NextResponse.json(
        { error: "A reference image is required" },
        { status: 400 }
      );
    }

    // Get default prompt from database
    const defaultPrompts = await getDefaultPrompts();

    // Load logo.png as the base image
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoBuffer = await readFile(logoPath);
    const logoBase64 = logoBuffer.toString("base64");

    // Decode the user's reference image
    let refBase64: string;
    let refMimeType: string;

    if (referenceImage.startsWith("data:")) {
      const matches = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          { error: "Invalid reference image format" },
          { status: 400 }
        );
      }
      refMimeType = matches[1];
      refBase64 = matches[2];
    } else if (referenceImage.startsWith("s3:")) {
      const s3Key = referenceImage.slice(3);
      const s3Obj = await getS3Object(s3Key);
      refBase64 = s3Obj.body.toString("base64");
      refMimeType = s3Obj.contentType;
    } else {
      const imagePath = path.join(process.cwd(), "public", referenceImage);
      const imageBuffer = await readFile(imagePath);
      refBase64 = imageBuffer.toString("base64");
      refMimeType = referenceImage.endsWith(".png")
        ? "image/png"
        : "image/jpeg";
    }

    const parts = [
      // 1. The logo — this is what gets transformed
      {
        inlineData: {
          mimeType: "image/png",
          data: logoBase64,
        },
      },
      // 2. The user's reference — drives the style/traits
      {
        inlineData: {
          mimeType: refMimeType,
          data: refBase64,
        },
      },
      // 3. Instruction
      {
        text: `${defaultPrompts.image} The first image is the base logo. The second image is a reference.
Analyze the visual traits, style, texture, color palette, and aesthetic of the reference image,
then re-render the logo from the first image applying those traits to it.
Keep the logo's core shape and structure intact — only transform its appearance to match the reference's style.
${prompt ? `Additional instructions: ${prompt}` : ""}`.trim(),
      },
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini error:", JSON.stringify(errorData, null, 2));
      return NextResponse.json(
        {
          error: errorData?.error?.message || "AI generation failed",
          details: errorData,
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const responseParts = data.candidates?.[0]?.content?.parts || [];

    let imageData = null;
    for (const part of responseParts) {
      if (part.inlineData) {
        imageData = {
          mimeType: part.inlineData.mimeType,
          data: part.inlineData.data,
        };
        break;
      }
    }

    if (!imageData) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    // Upload image to S3
    const mintNumber = await getNextMintNumber();
    const imageKey = `generations/honorary-${mintNumber}.png`;
    const buffer = Buffer.from(imageData.data, "base64");

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: imageKey,
        Body: buffer,
        ContentType: imageData.mimeType,
      })
    );

    const generationId = await saveGeneration({
      userId: payerWallet,
      prompt: prompt ?? "",
      basePrompt: defaultPrompts.image,
      sourceUrl: referenceImage,
      referenceImages: [referenceImage],
      resultUrl: imageKey,
      type: "image",
    });

    // Mint NFT on-chain
    let mintAddress: string | undefined;
    let mintError: string | undefined;

    const collectionMintAddress = process.env.COLLECTION_MINT_ADDRESS;
    if (collectionMintAddress) {
      try {
        const imageUrl = getPublicUrl(imageKey);
        const nftName = `GiggyBank Honorary #${mintNumber}`;

        // Upload NFT metadata JSON to S3
        const metadataKey = `generations/honorary-${mintNumber}-metadata.json`;
        const metadata = {
          name: nftName,
          symbol: "GIGGY",
          description: "An honorary PFP minted with $GIGGYBANK",
          image: imageUrl,
          attributes: [
            { trait_type: "Mint Number", value: String(mintNumber) },
          ],
          properties: {
            files: [{ uri: imageUrl, type: "image/png" }],
            category: "image",
          },
        };

        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: metadataKey,
            Body: JSON.stringify(metadata),
            ContentType: "application/json",
          })
        );

        const metadataUri = getPublicUrl(metadataKey);

        const result = await mintNft({
          name: nftName,
          metadataUri,
          ownerAddress: payerWallet,
          collectionMintAddress,
        });

        mintAddress = result.mintAddress;

        await saveMintRecord({
          generationId,
          mintAddress: result.mintAddress,
          ownerWallet: payerWallet,
          metadataUri,
          imageUrl,
          txSignature: result.txSignature,
          mintNumber,
        });
      } catch (err) {
        console.error("NFT minting failed:", err);
        mintError =
          err instanceof Error ? err.message : "NFT minting failed";
      }
    }

    return NextResponse.json({
      success: true,
      image: imageData,
      mintAddress,
      mintError,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

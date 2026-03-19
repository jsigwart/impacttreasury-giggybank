import { NextRequest, NextResponse } from 'next/server'
import {
  generateImage,
  generateCampaignBanner,
  enhancePfpImage,
} from '@/lib/nano-banana'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    switch (action) {
      case 'generate': {
        const { prompt, referenceImage, aspectRatio } = body
        if (!prompt || typeof prompt !== 'string') {
          return NextResponse.json(
            { error: 'A text prompt is required' },
            { status: 400 }
          )
        }
        const result = await generateImage({ prompt, referenceImage, aspectRatio })
        return NextResponse.json(result)
      }

      case 'campaign-banner': {
        const { title, campaignType, description } = body
        if (!title || !campaignType) {
          return NextResponse.json(
            { error: 'title and campaignType are required' },
            { status: 400 }
          )
        }
        const result = await generateCampaignBanner(title, campaignType, description)
        return NextResponse.json(result)
      }

      case 'enhance-pfp': {
        const { imageDataUri, style } = body
        if (!imageDataUri) {
          return NextResponse.json(
            { error: 'imageDataUri is required' },
            { status: 400 }
          )
        }
        const result = await enhancePfpImage(imageDataUri, style)
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Use "generate", "campaign-banner", or "enhance-pfp".` },
          { status: 400 }
        )
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    const status = message.includes('GEMINI_API_KEY') ? 500 : 502
    return NextResponse.json({ error: message }, { status })
  }
}

# Gemini API Setup (Nano Banana Image Generation)

GiggyBank uses the Gemini API (Nano Banana) for AI-powered image generation — campaign banners, PFP enhancements, and promotional visuals.

---

## 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **Get API Key** in the left sidebar
4. Click **Create API key** and select or create a Google Cloud project
5. Copy the generated API key

> **Note:** New accounts receive free credits. See [Gemini API pricing](https://ai.google.dev/pricing) for current limits.

---

## 2. Configure the Environment Variable

Add the key to your `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

The key is used **server-side only** (in the `/api/nano-banana` route) and is never exposed to the browser.

---

## 3. API Endpoints

The integration exposes a single API route at `POST /api/nano-banana` with three actions:

### Generate an image from a prompt

```json
{
  "action": "generate",
  "prompt": "A vibrant celebration banner with green confetti",
  "aspectRatio": "16:9"
}
```

### Generate a campaign banner

```json
{
  "action": "campaign-banner",
  "title": "DoorDash High-Tip Drop #12",
  "campaignType": "high_tip_drop",
  "description": "$200 tip to a delivery driver in Austin, TX"
}
```

### Enhance a PFP image

```json
{
  "action": "enhance-pfp",
  "imageDataUri": "data:image/png;base64,...",
  "style": "watercolor"
}
```

All endpoints return:

```json
{
  "imageDataUri": "data:image/png;base64,...",
  "textResponse": "optional model commentary"
}
```

---

## 4. Model Details

The integration uses `gemini-2.0-flash-exp` which supports multimodal input/output (text + images). This model is part of Google's Nano Banana family of image generation capabilities.

Key capabilities:
- **Text-to-image** — generate images from natural language prompts
- **Image editing** — modify existing images with text instructions
- **Reference-guided generation** — provide a reference image alongside a prompt

---

## 5. Rate Limits

Free tier limits (as of early 2026):
- 15 requests per minute
- 1,500 requests per day

For production use, enable billing in your Google Cloud project to increase limits.

---

## 6. Troubleshooting

| Issue | Solution |
|-------|----------|
| `GEMINI_API_KEY environment variable is not set` | Add the key to `.env.local` and restart the dev server |
| `403 Forbidden` | Verify the API key is valid and the Generative Language API is enabled in your GCP project |
| `429 Too Many Requests` | You've hit rate limits — wait or enable billing for higher quotas |
| No image in response | Some prompts may not produce images — try rephrasing or simplifying the prompt |

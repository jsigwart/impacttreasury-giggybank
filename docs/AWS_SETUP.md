# AWS S3 Setup (Image Hosting)

GiggyBank uses AWS S3 to host campaign images — receipts, banners, PFP composites, and generated Nano Banana images.

---

## 1. Create an S3 Bucket

1. Go to the [S3 Console](https://s3.console.aws.amazon.com/s3/)
2. Click **Create bucket**
3. Settings:
   - **Bucket name:** e.g. `giggybank-images`
   - **Region:** `us-east-1` (or your preferred region)
   - **Object Ownership:** ACLs disabled
   - **Block Public Access:** Uncheck "Block all public access" (images need to be publicly readable)
   - Acknowledge the public access warning
4. Click **Create bucket**

---

## 2. Set a Bucket Policy for Public Read

Go to your bucket → **Permissions** → **Bucket policy** and add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::giggybank-images/*"
    }
  ]
}
```

Replace `giggybank-images` with your actual bucket name.

---

## 3. Create an IAM User for API Access

1. Go to [IAM Console](https://console.aws.amazon.com/iam/) → **Users** → **Create user**
2. **User name:** e.g. `giggybank-s3-uploader`
3. **Permissions:** Attach the policy below (create as a custom policy)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::giggybank-images/*"
    }
  ]
}
```

4. Go to the user → **Security credentials** → **Create access key**
5. Select **Application running outside AWS**
6. Copy the **Access Key ID** and **Secret Access Key**

---

## 4. Configure Environment Variables

Add these to your `.env.local` file:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=giggybank-images
```

---

## 5. Recommended Bucket Structure

```
giggybank-images/
├── campaigns/          # Campaign receipt images and banners
│   ├── receipts/       # Upload receipts (proof of delivery/tip)
│   └── banners/        # Generated campaign banners (Nano Banana)
├── pfp/                # Minted PFP composites
│   ├── originals/      # User-uploaded originals
│   └── composites/     # Final composited honorary PFPs
└── misc/               # Other project images
```

---

## 6. Optional: CloudFront CDN

For faster global image delivery, add a CloudFront distribution in front of your S3 bucket:

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Create a distribution with your S3 bucket as the origin
3. Use the CloudFront URL (e.g. `https://d1234abcd.cloudfront.net`) instead of the raw S3 URL

---

## 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| `AccessDenied` on upload | Verify IAM user has `s3:PutObject` permission on the correct bucket ARN |
| Images not publicly accessible | Check the bucket policy allows `s3:GetObject` for `Principal: "*"` |
| `NoSuchBucket` | Verify `AWS_S3_BUCKET` matches the exact bucket name |
| Slow image loads | Consider adding CloudFront (see section 6) |
| `InvalidAccessKeyId` | Regenerate the access key in IAM and update `.env.local` |

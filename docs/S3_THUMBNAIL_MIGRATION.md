# S3 Thumbnail Storage Migration Guide

This guide covers migrating thumbnail storage from local filesystem to S3-compatible storage (Tigris).

## Overview

Thumbnails are now stored in S3-compatible storage instead of the local filesystem. This provides:

- **Scalability**: No filesystem limits
- **Performance**: CDN-backed delivery
- **Reliability**: Redundant storage
- **Cost-effectiveness**: Free egress with Tigris

## Architecture

### Storage Structure

```
S3 Bucket: sveltesociety-thumbnails/
├── yt/                          # YouTube thumbnails
│   └── {videoId}/
│       └── thumbnail.jpg
├── gh/                          # GitHub library thumbnails
│   └── {owner}/{repo}/
│       └── thumbnail.{ext}
└── og/                          # Generated OG images
    └── {slug}.png
```

### Feature Flag

All S3 functionality is controlled by the `USE_S3_THUMBNAILS` environment variable:

- `false` (default): Uses local filesystem storage
- `true`: Uses S3 storage

This allows for gradual rollout and easy rollback if needed.

## Setup

### 1. Create Tigris Bucket

1. Sign up for [Tigris](https://www.tigrisdata.com/)
2. Create a new bucket (e.g., `sveltesociety-thumbnails`)
3. Configure public read access for the bucket
4. (Optional) Set up a custom domain with CDN

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
# S3-compatible storage for thumbnails (Tigris)
S3_THUMBNAILS_ENDPOINT=https://fly.storage.tigris.dev
S3_THUMBNAILS_BUCKET=sveltesociety-thumbnails
S3_THUMBNAILS_ACCESS_KEY=tid_xxx
S3_THUMBNAILS_SECRET_KEY=tsec_xxx
S3_THUMBNAILS_PUBLIC_URL=https://thumbnails.yourdomain.com
USE_S3_THUMBNAILS=true  # Enable S3 storage
```

**Environment Variable Descriptions:**

- `S3_THUMBNAILS_ENDPOINT`: Tigris endpoint URL (use Fly.io region for best performance)
- `S3_THUMBNAILS_BUCKET`: Your bucket name
- `S3_THUMBNAILS_ACCESS_KEY`: Tigris access key ID
- `S3_THUMBNAILS_SECRET_KEY`: Tigris secret access key
- `S3_THUMBNAILS_PUBLIC_URL`: Public URL for accessing thumbnails (custom domain or Tigris public URL)
- `USE_S3_THUMBNAILS`: Feature flag to enable/disable S3 storage

### 3. Test Configuration

Test that S3 is properly configured:

```bash
# Run dry-run migration to test credentials
bun run s3:migrate:dry-run
```

If successful, you'll see a summary of files that would be migrated.

## Migration Process

### Step 1: Dry Run

First, run a dry-run to see what will be migrated:

```bash
bun run s3:migrate:dry-run
```

This will:

- Scan local filesystem for thumbnails
- Check S3 configuration
- Show what would be uploaded
- Show what database records would be updated
- **Make no actual changes**

### Step 2: Migrate Existing Thumbnails

Once you've verified the dry-run output, run the actual migration:

```bash
bun run s3:migrate
```

Or with skip-existing flag (useful for re-runs):

```bash
bun run s3:migrate -- --skip-existing
```

The script will:

1. Upload all local thumbnails to S3
2. Update database `metadata.thumbnail` fields with S3 URLs
3. Display progress and summary

**Migration Stats Example:**

```
📂 Scanning for thumbnails...
Found 150 thumbnail files:
  - YouTube: 50
  - GitHub: 80
  - OG Images: 20

☁️  Uploading to S3...
  Uploading: yt/abc123/thumbnail.jpg... ✅
  ...

Upload Summary:
  ✅ Success: 150
  ❌ Failed: 0

💾 Updating database...
Database Update Summary:
  ✅ Updated: 150

✨ Migration Complete!
```

### Step 3: Enable S3 in Production

Update your production environment variables:

```bash
USE_S3_THUMBNAILS=true
```

Deploy the updated environment configuration. New thumbnails will now be stored in S3.

### Step 4: Verify

1. Import a new YouTube video or GitHub library
2. Check that the thumbnail is uploaded to S3
3. Verify the `metadata.thumbnail` field contains an S3 URL (e.g., `https://thumbnails.yourdomain.com/yt/{id}/thumbnail.jpg`)
4. Check that thumbnails load correctly on the frontend

### Step 5: Clean Up (After 1 Week)

After verifying everything works correctly for ~1 week:

1. **Optional**: Archive local thumbnail files

   ```bash
   tar -czf thumbnail-backup.tar.gz .state_directory/files/
   ```

2. **Optional**: Remove local files
   ```bash
   rm -rf .state_directory/files/yt/
   rm -rf .state_directory/files/gh/
   rm -rf .state_directory/files/og/
   ```

Keep the backup for at least 30 days in case you need to rollback.

## Rollback Procedure

If you need to rollback to local filesystem storage:

1. **Set feature flag to false:**

   ```bash
   USE_S3_THUMBNAILS=false
   ```

2. **Restore local files from backup** (if deleted):

   ```bash
   tar -xzf thumbnail-backup.tar.gz
   ```

3. **Revert database URLs** (if needed):

   ```sql
   UPDATE content
   SET metadata = json_set(
     metadata,
     '$.thumbnail',
     replace(json_extract(metadata, '$.thumbnail'), '${S3_PUBLIC_URL}', '/files')
   )
   WHERE json_extract(metadata, '$.thumbnail') LIKE '${S3_PUBLIC_URL}%';
   ```

4. **Deploy** the updated environment configuration

## Component Behavior

### With S3 Enabled (`USE_S3_THUMBNAILS=true`)

- **YouTube Importer**: Uploads to `yt/{videoId}/thumbnail.jpg`, stores S3 URL in DB
- **GitHub Importer**: Uploads to `gh/{owner}/{repo}/thumbnail.{ext}`, stores S3 URL in DB
- **OG Image Generator**: Uploads to `og/{slug}.png` after generation
- **Files Endpoint**: Refreshes stale GitHub thumbnails (>14 days) and uploads to S3

### With S3 Disabled (`USE_S3_THUMBNAILS=false`)

- **YouTube Importer**: Saves to `.state_directory/files/yt/`, stores local path in DB
- **GitHub Importer**: Saves to `.state_directory/files/gh/`, stores local path in DB
- **OG Image Generator**: Only caches to local filesystem
- **Files Endpoint**: Serves from local filesystem, refreshes GitHub thumbnails locally

## Monitoring

### Check S3 Storage Usage

```bash
# List all objects in bucket
bun run scripts/check-s3-usage.ts  # TODO: Create this script if needed
```

### Database Verification

Check that all thumbnails are using S3 URLs:

```sql
-- Count thumbnails by storage type
SELECT
  CASE
    WHEN json_extract(metadata, '$.thumbnail') LIKE 'https://%' THEN 'S3'
    WHEN json_extract(metadata, '$.thumbnail') LIKE '/files/%' THEN 'Local'
    ELSE 'Other'
  END as storage_type,
  COUNT(*) as count
FROM content
WHERE json_extract(metadata, '$.thumbnail') IS NOT NULL
GROUP BY storage_type;
```

## Troubleshooting

### Issue: Migration script fails with "S3 not configured"

**Solution**: Verify all required environment variables are set in `.env`:

```bash
grep S3_THUMBNAILS .env
```

### Issue: Thumbnails not loading after migration

**Possible causes:**

1. S3 bucket doesn't have public read access
2. `S3_THUMBNAILS_PUBLIC_URL` doesn't match actual public URL
3. CORS configuration needed for custom domain

**Solution**: Test direct S3 URL access:

```bash
curl -I https://thumbnails.yourdomain.com/yt/abc123/thumbnail.jpg
```

### Issue: New thumbnails still using local storage

**Solution**: Check that `USE_S3_THUMBNAILS=true` is set in production environment.

### Issue: Database update failed for some records

**Solution**: Re-run migration with `--skip-existing` flag:

```bash
bun run s3:migrate -- --skip-existing
```

## Performance Considerations

### CDN Caching

Configure your CDN (if using custom domain) with:

- **Cache-Control**: `public, max-age=31536000` (1 year)
- **Edge caching**: Enabled
- **Origin shield**: Optional for high traffic

### Image Optimization

Thumbnails are served directly from S3. For additional optimization, consider:

1. Using Cloudflare Images (if using Cloudflare CDN)
2. Keeping the existing `wsrv.nl` CDN integration (already implemented)

### Cost Estimation (Tigris)

**Example calculation** (10K thumbnails, 1M views/month):

- Storage (500MB): $0.015/GB = ~$0.01/month
- Operations: ~$0.20/month
- Egress: $0 (free with Tigris)
- **Total: ~$0.21/month**

Compare to local storage:

- Storage: Free (but limited by disk space)
- Scaling: Manual server upgrades needed
- Bandwidth: Included in hosting costs

## Support

For issues with:

- **Migration script**: Check logs and file permissions
- **S3 configuration**: Verify Tigris dashboard settings
- **Database updates**: Check database logs and backup before re-running

## Related Files

- **S3 Service**: `src/lib/server/services/s3-storage.ts`
- **Migration Script**: `scripts/migrate-thumbnails-to-s3.ts`
- **YouTube Importer**: `src/lib/server/services/importers/youtube.ts`
- **GitHub Importer**: `src/lib/server/services/importers/github.ts`
- **OG Image Generator**: `src/routes/og-image/[slug]/+server.ts`
- **Files Endpoint**: `src/routes/files/[...path]/+server.ts`

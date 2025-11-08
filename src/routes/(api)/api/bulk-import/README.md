# Bulk Import API

The bulk import endpoint allows you to import multiple YouTube videos or GitHub repositories (including monorepo packages) in a single request.

## Authentication

The endpoint supports two authentication methods:

### 1. User Authentication (via web session)

- Requires logged-in user with admin or moderator role
- Used when accessing via the web interface

### 2. API Key Authentication

- Set `BULK_IMPORT_API_KEY` environment variable
- Include key in `Authorization` header as Bearer token
- Useful for automated scripts and CI/CD pipelines

## Usage

### Endpoint

```
POST /api/bulk-import
```

### Headers (for API key auth)

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Request Body

```json
{
	"urls": [
		"https://www.youtube.com/watch?v=VIDEO_ID",
		"https://github.com/owner/repo",
		"https://github.com/owner/repo/tree/main/packages/kit",
		"VIDEO_ID",
		"owner/repo",
		"owner/repo/packages/kit"
	],
	"options": {
		"skipExisting": true,
		"batchSize": 5
	}
}
```

### Response

```json
{
	"success": true,
	"summary": {
		"total": 4,
		"successful": 3,
		"failed": 0,
		"skipped": 1,
		"byType": {
			"youtube": 2,
			"github": 2
		}
	},
	"results": [
		{
			"url": "https://www.youtube.com/watch?v=VIDEO_ID",
			"success": true,
			"contentId": "abc123",
			"type": "youtube"
		}
	]
}
```

## Example Script

```bash
#!/bin/bash

# Set your API key
API_KEY="your-secret-key"

# Import multiple URLs
curl -X POST https://sveltesociety.dev/api/bulk-import \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://www.youtube.com/watch?v=8KuO4r5CHjM",
      "https://github.com/sveltejs/svelte",
      "https://github.com/sveltejs/kit"
    ]
  }'
```

## Monorepo Support

The API now supports importing individual packages from monorepos. You can specify a package path in the following formats:

### Supported Formats

1. **Full GitHub URL with path:**
   ```
   https://github.com/sveltejs/kit/tree/main/packages/kit
   ```

2. **Short format (owner/repo/path):**
   ```
   sveltejs/kit/packages/kit
   ```

3. **Traditional format (for non-monorepos):**
   ```
   sveltejs/kit
   ```

### How It Works

- If a package path is provided, the importer will:
  - Fetch `package.json` from the specified directory
  - Look for a README in that directory (falls back to root README)
  - Use the package name and description from `package.json`
  - Create a unique external ID: `owner/repo/path`
  - Link to the package subdirectory on GitHub

### Example

```bash
curl -X POST https://sveltesociety.dev/api/bulk-import \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "sveltejs/kit/packages/kit",
      "sveltejs/kit/packages/adapter-auto",
      "sveltejs/kit/packages/adapter-node"
    ]
  }'
```

## Limits

- Maximum 50 URLs per request
- Batch size: 1-10 (default: 5)
- 1 second delay between batches to avoid rate limiting

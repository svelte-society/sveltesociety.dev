# Default OG Image Requirements

## Required File
`og-default.png` - Default Open Graph image for social sharing

## Specifications
- **Dimensions:** 1200x630 pixels (required for optimal display)
- **Format:** PNG or JPG
- **File size:** < 200KB (recommended for fast loading)
- **Content:** Should include:
  - Svelte Society branding/logo
  - Site name: "Svelte Society"
  - Tagline or description
  - Clean, professional design
  - High contrast for readability

## Usage
This image is used as the fallback for:
- Homepage social sharing
- Category pages
- Static pages (about, terms, privacy)
- Any page without content-specific OG image

## How to Create
1. Use a design tool (Figma, Canva, Photoshop, etc.)
2. Create a 1200x630px canvas
3. Add Svelte Society branding
4. Export as PNG
5. Optimize file size (TinyPNG, ImageOptim, etc.)
6. Save as `static/og-default.png`

## Design Guidelines
- Use brand colors (Svelte orange: #FF3E00)
- Keep text large and readable
- Consider how it looks when cropped (some platforms crop differently)
- Test on Facebook Sharing Debugger and Twitter Card Validator
- Ensure it looks good at different sizes

## Temporary Solution
Until the branded OG image is created, the favicon will be used as a fallback.
Social media platforms will still show the meta tags correctly, but without
a large preview image.

## Next Steps (Phase 11-12)
After the default image is in place, we'll implement dynamic OG image generation
for content pages using @vercel/og or similar tools.

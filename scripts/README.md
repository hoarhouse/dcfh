# DCF Hungary Translation Generator

Automated translation script that converts English translations into Italian, Spanish, and Hungarian.

## Prerequisites

- Node.js installed (v14 or higher)
- Internet connection (to access LibreTranslate API)

## Installation

1. Navigate to scripts directory:
```bash
cd scripts
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Generate All Translations

From the `/scripts` directory, run:
```bash
npm run translate
```

This will:
- Read `/translations/en.json`
- Translate all content to Italian, Spanish, and Hungarian
- Save to `/translations/it.json`, `/translations/es.json`, `/translations/hu.json`
- Show progress as it translates

## Expected Output

```
============================================================
🚀 DCF Hungary - Automated Translation Generator
============================================================

This script will translate en.json into Italian, Spanish, and Hungarian
using the LibreTranslate API (free public instance).

⏱️  This may take several minutes depending on content size...

============================================================
🌍 Generating Italian translations (IT)...
============================================================

✅ Loaded English translations from: ../translations/en.json
📊 Found 2 top-level sections

   Processing section: nav
   Translating: "Home"
   Translating: "Blog"
   ...

✅ Italian translations saved to: ../translations/it.json

[Continues for Spanish and Hungarian...]

============================================================
✅ ALL TRANSLATIONS GENERATED SUCCESSFULLY!
============================================================
⏱️  Total time: 45.23 seconds

📁 Generated files:
   - translations/it.json (Italian)
   - translations/es.json (Spanish)
   - translations/hu.json (Hungarian)

🎉 You can now test all languages on your website!
```

## When to Run This Script

Run this script whenever you:
- Add new content to `en.json`
- Update existing English translations
- Need to regenerate all translations from scratch

## Notes

- Uses LibreTranslate free public API (no API key required)
- Includes 500ms delay between translations to avoid rate limiting
- Falls back to English text if translation fails
- Preserves JSON structure and formatting

## Troubleshooting

**Issue**: `fetch is not defined`
- **Solution**: Make sure you ran `npm install` in the scripts directory

**Issue**: Translation fails or returns English text
- **Solution**: LibreTranslate public API may be temporarily unavailable. Wait a few minutes and try again.

**Issue**: Rate limiting errors
- **Solution**: The script includes automatic delays. If still occurring, increase the delay in `translateText()` function.
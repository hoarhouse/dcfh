import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LibreTranslate API endpoint (free public instance)
const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

// Language mappings
const LANGUAGES = {
    it: 'Italian',
    es: 'Spanish',
    hu: 'Hungarian'
};

/**
 * Translate text using LibreTranslate API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (it, es, hu)
 * @returns {Promise<string>} Translated text
 */
async function translateText(text, targetLang) {
    try {
        const response = await fetch(LIBRETRANSLATE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: targetLang,
                format: 'text'
            })
        });

        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status}`);
        }

        const data = await response.json();
        return data.translatedText;
        
    } catch (error) {
        console.error(`❌ Translation failed for "${text.substring(0, 50)}...":`, error.message);
        return text; // Return original text if translation fails
    }
}

/**
 * Recursively translate all string values in an object
 * @param {Object} obj - Object to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} Translated object
 */
async function translateObject(obj, targetLang) {
    const translated = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            // Translate string value
            console.log(`   Translating: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);
            translated[key] = await translateText(value, targetLang);
            
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } else if (typeof value === 'object' && value !== null) {
            // Recursively translate nested objects
            console.log(`   Processing section: ${key}`);
            translated[key] = await translateObject(value, targetLang);
            
        } else {
            // Keep non-string, non-object values as-is
            translated[key] = value;
        }
    }
    
    return translated;
}

/**
 * Generate translations for a specific language
 * @param {string} targetLang - Target language code (it, es, hu)
 */
async function generateTranslationsForLanguage(targetLang) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🌍 Generating ${LANGUAGES[targetLang]} translations (${targetLang.toUpperCase()})...`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
        // Read English translations
        const enPath = path.join(__dirname, '../translations/en.json');
        const enContent = fs.readFileSync(enPath, 'utf8');
        const enTranslations = JSON.parse(enContent);
        
        console.log(`✅ Loaded English translations from: ${enPath}`);
        console.log(`📊 Found ${Object.keys(enTranslations).length} top-level sections\n`);
        
        // Translate all content
        const translatedContent = await translateObject(enTranslations, targetLang);
        
        // Write translated content to file
        const targetPath = path.join(__dirname, `../translations/${targetLang}.json`);
        fs.writeFileSync(
            targetPath,
            JSON.stringify(translatedContent, null, 2),
            'utf8'
        );
        
        console.log(`\n✅ ${LANGUAGES[targetLang]} translations saved to: ${targetPath}`);
        
    } catch (error) {
        console.error(`\n❌ Failed to generate ${LANGUAGES[targetLang]} translations:`, error.message);
        throw error;
    }
}

/**
 * Main function - Generate all translations
 */
async function generateAllTranslations() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 DCF Hungary - Automated Translation Generator');
    console.log('='.repeat(60));
    console.log('\nThis script will translate en.json into Italian, Spanish, and Hungarian');
    console.log('using the LibreTranslate API (free public instance).\n');
    console.log('⏱️  This may take several minutes depending on content size...\n');
    
    const startTime = Date.now();
    
    try {
        // Generate translations for each language sequentially
        for (const lang of Object.keys(LANGUAGES)) {
            await generateTranslationsForLanguage(lang);
        }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ ALL TRANSLATIONS GENERATED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log(`⏱️  Total time: ${duration} seconds\n`);
        console.log('📁 Generated files:');
        console.log('   - translations/it.json (Italian)');
        console.log('   - translations/es.json (Spanish)');
        console.log('   - translations/hu.json (Hungarian)\n');
        console.log('🎉 You can now test all languages on your website!\n');
        
    } catch (error) {
        console.error('\n❌ Translation generation failed:', error.message);
        process.exit(1);
    }
}

// Run the script
generateAllTranslations();
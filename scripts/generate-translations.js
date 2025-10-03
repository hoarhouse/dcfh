import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple translation API endpoints
const TRANSLATION_APIS = [
    {
        name: 'LibreTranslate',
        url: 'https://libretranslate.com/translate',
        format: (text, target) => ({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: target,
                format: 'text'
            })
        }),
        extract: (data) => data.translatedText
    },
    {
        name: 'LibreTranslate Mirror',
        url: 'https://translate.argosopentech.com/translate',
        format: (text, target) => ({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: target,
                format: 'text'
            })
        }),
        extract: (data) => data.translatedText
    }
];

const LANGUAGES = {
    it: 'Italian',
    es: 'Spanish',
    hu: 'Hungarian'
};

let successCount = 0;
let failCount = 0;
let currentAPI = 0;

/**
 * Translate text using available APIs with fallback
 */
async function translateText(text, targetLang, retries = 3) {
    // Skip empty text
    if (!text || text.trim() === '') {
        return text;
    }

    for (let attempt = 0; attempt < retries; attempt++) {
        const api = TRANSLATION_APIS[currentAPI % TRANSLATION_APIS.length];
        
        try {
            console.log(`   [${api.name}] Translating: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`);
            
            const response = await fetch(api.url, api.format(text, targetLang));

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const translated = api.extract(data);
            
            if (translated && translated !== text) {
                successCount++;
                console.log(`   ✅ Success: "${translated.substring(0, 60)}${translated.length > 60 ? '...' : ''}"`);
                
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                return translated;
            }
            
        } catch (error) {
            console.error(`   ❌ Attempt ${attempt + 1} failed with ${api.name}: ${error.message}`);
            
            if (attempt < retries - 1) {
                // Try next API
                currentAPI++;
                console.log(`   🔄 Switching to ${TRANSLATION_APIS[currentAPI % TRANSLATION_APIS.length].name}...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    
    // All attempts failed
    failCount++;
    console.error(`   ⚠️  All translation attempts failed, keeping English: "${text.substring(0, 60)}..."`);
    return text; // Return original English text
}

/**
 * Recursively translate all string values in an object
 */
async function translateObject(obj, targetLang, path = '') {
    const translated = {};
    
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
            console.log(`\n📍 Translating: ${currentPath}`);
            translated[key] = await translateText(value, targetLang);
            
        } else if (typeof value === 'object' && value !== null) {
            console.log(`\n📂 Processing section: ${currentPath}`);
            translated[key] = await translateObject(value, targetLang, currentPath);
            
        } else {
            translated[key] = value;
        }
    }
    
    return translated;
}

/**
 * Generate translations for a specific language
 */
async function generateTranslationsForLanguage(targetLang) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🌍 Generating ${LANGUAGES[targetLang]} translations (${targetLang.toUpperCase()})`);
    console.log(`${'='.repeat(70)}\n`);
    
    // Reset counters
    successCount = 0;
    failCount = 0;
    currentAPI = 0;
    
    try {
        const enPath = path.join(__dirname, '../translations/en.json');
        const enContent = fs.readFileSync(enPath, 'utf8');
        const enTranslations = JSON.parse(enContent);
        
        console.log(`✅ Loaded English translations`);
        console.log(`📊 Found ${Object.keys(enTranslations).length} top-level sections`);
        
        const translatedContent = await translateObject(enTranslations, targetLang);
        
        const targetPath = path.join(__dirname, `../translations/${targetLang}.json`);
        fs.writeFileSync(
            targetPath,
            JSON.stringify(translatedContent, null, 2),
            'utf8'
        );
        
        console.log(`\n${'='.repeat(70)}`);
        console.log(`✅ ${LANGUAGES[targetLang]} translations completed!`);
        console.log(`📊 Success: ${successCount} | Failed (kept English): ${failCount}`);
        console.log(`💾 Saved to: ${targetPath}`);
        console.log(`${'='.repeat(70)}`);
        
        return { success: successCount, failed: failCount };
        
    } catch (error) {
        console.error(`\n❌ Failed to generate ${LANGUAGES[targetLang]} translations:`, error);
        throw error;
    }
}

/**
 * Main function
 */
async function generateAllTranslations() {
    console.log('\n' + '='.repeat(70));
    console.log('🚀 DCF Hungary - Automated Translation Generator (Enhanced)');
    console.log('='.repeat(70));
    console.log('\n⚡ Features:');
    console.log('   • Multiple API fallback strategy');
    console.log('   • Automatic retry on failure');
    console.log('   • Progress tracking');
    console.log('   • Keeps English text if translation fails\n');
    console.log('⏱️  This may take 5-10 minutes depending on API availability...\n');
    
    const startTime = Date.now();
    const results = {};
    
    try {
        for (const lang of Object.keys(LANGUAGES)) {
            results[lang] = await generateTranslationsForLanguage(lang);
            
            // Longer pause between languages
            if (Object.keys(results).length < Object.keys(LANGUAGES).length) {
                console.log('\n⏸️  Pausing 5 seconds before next language...\n');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0);
        const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
        
        console.log('\n' + '='.repeat(70));
        console.log('✅ TRANSLATION GENERATION COMPLETE!');
        console.log('='.repeat(70));
        console.log(`⏱️  Total time: ${duration} seconds`);
        console.log(`📊 Total translations: ${totalSuccess} successful, ${totalFailed} kept as English`);
        console.log('\n📁 Generated files:');
        console.log('   - translations/it.json (Italian)');
        console.log('   - translations/es.json (Spanish)');
        console.log('   - translations/hu.json (Hungarian)\n');
        
        if (totalFailed > 0) {
            console.log('⚠️  NOTE: Some translations failed and kept English text.');
            console.log('   You can manually edit the JSON files or try running again later.\n');
        } else {
            console.log('🎉 All translations successful! Test on your website now!\n');
        }
        
    } catch (error) {
        console.error('\n❌ Translation generation failed:', error.message);
        console.log('\n💡 TIP: Translation APIs may be temporarily unavailable.');
        console.log('   Try running the script again in a few minutes.\n');
        process.exit(1);
    }
}

generateAllTranslations();
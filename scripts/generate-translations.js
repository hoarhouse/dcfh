import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Cloud Translation API
const GOOGLE_TRANSLATE_API = 'https://translation.googleapis.com/language/translate/v2';
const API_KEY = 'AIzaSyCEmkwxwJhw1Gcq_CIi0OBekHyuNCC-32URE'; // Chris will replace this

const LANGUAGES = {
    it: 'Italian',
    es: 'Spanish',
    hu: 'Hungarian'
};

async function translateText(text, targetLang) {
    if (!text || text.trim() === '') {
        return text;
    }

    try {
        const url = `${GOOGLE_TRANSLATE_API}?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: targetLang,
                format: 'text'
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HTTP ${response.status}: ${error}`);
        }

        const data = await response.json();
        const translated = data.data.translations[0].translatedText;
        
        console.log(`   ✅ "${text.substring(0, 50)}..." → "${translated.substring(0, 50)}..."`);
        
        return translated;
        
    } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        return text;
    }
}

async function translateObject(obj, targetLang, path = '') {
    const translated = {};
    
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
            console.log(`\n📍 ${currentPath}`);
            translated[key] = await translateText(value, targetLang);
            
        } else if (typeof value === 'object' && value !== null) {
            console.log(`\n📂 Section: ${currentPath}`);
            translated[key] = await translateObject(value, targetLang, currentPath);
            
        } else {
            translated[key] = value;
        }
    }
    
    return translated;
}

async function generateTranslationsForLanguage(targetLang) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🌍 Translating to ${LANGUAGES[targetLang]} (${targetLang.toUpperCase()})`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
        const enPath = path.join(__dirname, '../translations/en.json');
        const enContent = fs.readFileSync(enPath, 'utf8');
        const enTranslations = JSON.parse(enContent);
        
        const translatedContent = await translateObject(enTranslations, targetLang);
        
        const targetPath = path.join(__dirname, `../translations/${targetLang}.json`);
        fs.writeFileSync(
            targetPath,
            JSON.stringify(translatedContent, null, 2),
            'utf8'
        );
        
        console.log(`\n✅ Saved: ${targetPath}`);
        
    } catch (error) {
        console.error(`\n❌ Failed:`, error);
        throw error;
    }
}

async function generateAllTranslations() {
    console.log('\n🚀 DCF Hungary - Google Translate API Generator\n');
    
    const startTime = Date.now();
    
    try {
        for (const lang of Object.keys(LANGUAGES)) {
            await generateTranslationsForLanguage(lang);
        }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log(`\n${'='.repeat(60)}`);
        console.log('✅ ALL TRANSLATIONS COMPLETE!');
        console.log(`⏱️  Time: ${duration} seconds`);
        console.log('='.repeat(60));
        console.log('\n📁 Files created:');
        console.log('   - translations/it.json');
        console.log('   - translations/es.json');
        console.log('   - translations/hu.json\n');
        
    } catch (error) {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    }
}

generateAllTranslations();
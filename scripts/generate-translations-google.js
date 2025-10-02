import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual translations for demonstration
// In production, you could use Google Translate API, DeepL, or other services
const MANUAL_TRANSLATIONS = {
    it: {
        // Navigation
        "Home": "Casa",
        "Blog": "Blog",
        "About Us": "Chi Siamo",
        "Initiatives": "Iniziative",
        "Contact": "Contatto",
        "Donate": "Dona",
        "Resources": "Risorse",
        "About": "Chi Siamo",
        
        // Hero section
        "DCF Prepares to Launch Ethical AI Portal": "DCF Si Prepara a Lanciare il Portale di IA Etica",
        "Read Full Story": "Leggi la Storia Completa",
        
        // Add more translations as needed
    },
    es: {
        // Navigation
        "Home": "Inicio",
        "Blog": "Blog",
        "About Us": "Acerca de Nosotros",
        "Initiatives": "Iniciativas",
        "Contact": "Contacto",
        "Donate": "Donar",
        "Resources": "Recursos",
        "About": "Acerca de",
        
        // Hero section
        "DCF Prepares to Launch Ethical AI Portal": "DCF Se Prepara para Lanzar el Portal de IA Ética",
        "Read Full Story": "Leer Historia Completa",
        
        // Add more translations as needed
    },
    hu: {
        // Navigation
        "Home": "Főoldal",
        "Blog": "Blog",
        "About Us": "Rólunk",
        "Initiatives": "Kezdeményezések",
        "Contact": "Kapcsolat",
        "Donate": "Adományozás",
        "Resources": "Források",
        "About": "Rólunk",
        
        // Hero section
        "DCF Prepares to Launch Ethical AI Portal": "A DCF Felkészül az Etikus AI Portál Elindítására",
        "Read Full Story": "Teljes Történet Olvasása",
        
        // Add more translations as needed
    }
};

/**
 * Translate text using manual translations or fallback
 */
function translateText(text, targetLang) {
    const translations = MANUAL_TRANSLATIONS[targetLang] || {};
    
    // Check if we have a manual translation
    if (translations[text]) {
        return translations[text];
    }
    
    // For longer texts, try to find partial matches or return original
    // In production, this would call a translation API
    console.warn(`   ⚠️  No translation found for: "${text.substring(0, 50)}..." - using original`);
    return text;
}

/**
 * Recursively translate all string values in an object
 */
function translateObject(obj, targetLang) {
    const translated = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            // Translate string value
            console.log(`   Translating: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);
            translated[key] = translateText(value, targetLang);
            
        } else if (typeof value === 'object' && value !== null) {
            // Recursively translate nested objects
            console.log(`   Processing section: ${key}`);
            translated[key] = translateObject(value, targetLang);
            
        } else {
            // Keep non-string, non-object values as-is
            translated[key] = value;
        }
    }
    
    return translated;
}

/**
 * Generate translations for a specific language
 */
function generateTranslationsForLanguage(targetLang) {
    const languageNames = {
        it: 'Italian',
        es: 'Spanish',
        hu: 'Hungarian'
    };
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🌍 Generating ${languageNames[targetLang]} translations (${targetLang.toUpperCase()})...`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
        // Read English translations
        const enPath = path.join(__dirname, '../translations/en.json');
        const enContent = fs.readFileSync(enPath, 'utf8');
        const enTranslations = JSON.parse(enContent);
        
        console.log(`✅ Loaded English translations from: ${enPath}`);
        console.log(`📊 Found ${Object.keys(enTranslations).length} top-level sections\n`);
        
        // Translate all content
        const translatedContent = translateObject(enTranslations, targetLang);
        
        // Write translated content to file
        const targetPath = path.join(__dirname, `../translations/${targetLang}.json`);
        fs.writeFileSync(
            targetPath,
            JSON.stringify(translatedContent, null, 2),
            'utf8'
        );
        
        console.log(`\n✅ ${languageNames[targetLang]} translations saved to: ${targetPath}`);
        
    } catch (error) {
        console.error(`\n❌ Failed to generate ${languageNames[targetLang]} translations:`, error.message);
        throw error;
    }
}

/**
 * Main function - Generate all translations
 */
function generateAllTranslations() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 DCF Hungary - Manual Translation Generator');
    console.log('='.repeat(60));
    console.log('\nThis script uses manual translations for demonstration.');
    console.log('For production, integrate with Google Translate API or DeepL.\n');
    
    const startTime = Date.now();
    
    try {
        // Generate translations for each language
        ['it', 'es', 'hu'].forEach(lang => {
            generateTranslationsForLanguage(lang);
        });
        
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
        console.log('📝 Note: These are manual translations. For automated translation,');
        console.log('   consider using Google Translate API or DeepL API.\n');
        
    } catch (error) {
        console.error('\n❌ Translation generation failed:', error.message);
        process.exit(1);
    }
}

// Run the script
generateAllTranslations();
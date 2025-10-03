import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Translate API configuration
const API_KEY = 'AIzaSyCEmkwxwJhw1Gcq_CIi0OBekHyuNCC-32U';
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Target languages
const TARGET_LANGUAGES = ['it', 'es', 'hu'];

// Blog posts data (13 rows)
const blogPosts = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    title: 'Understanding AI Ethics in Healthcare',
    excerpt: 'Exploring the intersection of artificial intelligence and medical ethics',
    content: '<p>As artificial intelligence becomes increasingly integrated into healthcare systems worldwide, we must carefully consider the ethical implications...</p>'
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    title: 'The Future of Responsible AI Development',
    excerpt: 'Building AI systems with accountability and transparency',
    content: '<p>The rapid advancement of AI technology demands that we establish clear guidelines for responsible development...</p>'
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    title: 'Privacy in the Age of Machine Learning',
    excerpt: 'How to protect personal data while advancing AI capabilities',
    content: '<p>Machine learning models require vast amounts of data to function effectively, but this need must be balanced with privacy rights...</p>'
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    title: 'Bias Detection and Mitigation in AI Systems',
    excerpt: 'Strategies for creating fair and equitable algorithms',
    content: '<p>Algorithmic bias remains one of the most pressing challenges in AI deployment. This post explores practical methods...</p>'
  },
  {
    id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    title: 'AI Governance Frameworks for Organizations',
    excerpt: 'Implementing effective oversight for AI initiatives',
    content: '<p>Organizations deploying AI need robust governance frameworks to ensure ethical and legal compliance...</p>'
  },
  {
    id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
    title: 'Explainable AI: Making Black Boxes Transparent',
    excerpt: 'The importance of interpretability in machine learning',
    content: '<p>As AI systems become more complex, understanding how they reach decisions becomes crucial for trust and accountability...</p>'
  },
  {
    id: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
    title: 'The Environmental Impact of AI Training',
    excerpt: 'Assessing the carbon footprint of large language models',
    content: '<p>Training large AI models consumes significant computational resources, raising important questions about sustainability...</p>'
  },
  {
    id: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
    title: 'Human-AI Collaboration in Decision Making',
    excerpt: 'Finding the right balance between automation and human judgment',
    content: '<p>The most effective AI implementations often involve meaningful collaboration between humans and machines...</p>'
  },
  {
    id: '9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x',
    title: 'AI Safety Research: Current Challenges',
    excerpt: 'Addressing existential risks and alignment problems',
    content: '<p>As AI capabilities advance, ensuring these systems remain safe and aligned with human values becomes paramount...</p>'
  },
  {
    id: '0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y',
    title: 'Regulatory Approaches to AI: Global Perspectives',
    excerpt: 'Comparing different national strategies for AI regulation',
    content: '<p>Countries around the world are developing diverse approaches to regulating AI, from the EU AI Act to...</p>'
  },
  {
    id: '1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z',
    title: 'The Role of Ethics Committees in AI Development',
    excerpt: 'How organizations can establish effective ethical oversight',
    content: '<p>Ethics committees play a crucial role in guiding responsible AI development within organizations...</p>'
  },
  {
    id: '2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a',
    title: 'AI and Social Justice: Opportunities and Risks',
    excerpt: 'Leveraging AI for positive social impact while avoiding harm',
    content: '<p>Artificial intelligence has the potential to address social inequities, but it can also perpetuate existing biases...</p>'
  },
  {
    id: '3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b',
    title: 'Building Trust in Autonomous Systems',
    excerpt: 'Key factors for public acceptance of AI technologies',
    content: '<p>For AI systems to be successfully deployed at scale, they must earn and maintain public trust through...</p>'
  }
];

// Resources data (7 rows)
const resources = [
  {
    id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    title: 'AI Ethics Framework Guide',
    description: 'A comprehensive guide to implementing ethical AI practices in your organization',
    content: '<h2>Introduction to AI Ethics</h2><p>This framework provides actionable guidelines for developing and deploying ethical AI systems...</p>'
  },
  {
    id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7',
    title: 'Machine Learning Bias Checklist',
    description: 'Essential checklist for identifying and mitigating bias in ML models',
    content: '<h2>Bias Detection Steps</h2><ol><li>Data collection audit</li><li>Feature engineering review</li><li>Model evaluation metrics</li></ol>...'
  },
  {
    id: 'c3d4e5f6-g7h8-9i0j-1k2l-m3n4o5p6q7r8',
    title: 'Privacy-Preserving AI Techniques',
    description: 'Learn about federated learning, differential privacy, and other privacy-preserving methods',
    content: '<h2>Privacy Techniques Overview</h2><p>Modern AI systems can maintain user privacy through various technical approaches...</p>'
  },
  {
    id: 'd4e5f6g7-h8i9-0j1k-2l3m-n4o5p6q7r8s9',
    title: 'AI Governance Template',
    description: 'Ready-to-use templates for establishing AI governance in your organization',
    content: '<h2>Governance Structure</h2><p>Effective AI governance requires clear roles, responsibilities, and processes...</p>'
  },
  {
    id: 'e5f6g7h8-i9j0-1k2l-3m4n-o5p6q7r8s9t0',
    title: 'Responsible AI Development Toolkit',
    description: 'Tools and resources for building responsible AI systems',
    content: '<h2>Development Best Practices</h2><p>This toolkit provides practical resources for implementing responsible AI principles...</p>'
  },
  {
    id: 'f6g7h8i9-j0k1-2l3m-4n5o-p6q7r8s9t0u1',
    title: 'AI Impact Assessment Framework',
    description: 'Methodology for assessing the societal impact of AI deployments',
    content: '<h2>Impact Assessment Process</h2><p>Before deploying AI systems, organizations should conduct thorough impact assessments...</p>'
  },
  {
    id: 'g7h8i9j0-k1l2-3m4n-5o6p-q7r8s9t0u1v2',
    title: 'Ethics Training for AI Practitioners',
    description: 'Curriculum and materials for ethics education in AI development teams',
    content: '<h2>Training Modules</h2><p>This comprehensive training program covers essential ethical considerations for AI practitioners...</p>'
  }
];

// Projects data
const projects = [
  {
    id: '0f4ce11a-856f-4754-b4ee-0a3f2d3b8b4e',
    title: 'Safe Harbor App',
    description: 'A comprehensive application for managing data privacy and security compliance'
  },
  {
    id: 'd3989e1e-a268-4cba-a172-910f755bffb5',
    title: 'AI Morality Education',
    description: 'Educational platform for teaching ethical AI principles and practices'
  },
  {
    id: '31d1ad06-71e8-4e28-90fe-5ba83fcd2a2d',
    title: 'Ethics in AI Teaching Courses',
    description: 'Structured curriculum for integrating ethics into AI education'
  },
  {
    id: 'a2b3c4d5-e6f7-8g9h-0i1j-k2l3m4n5o6p7',
    title: 'Algorithmic Fairness Toolkit',
    description: 'Tools and metrics for evaluating and improving algorithmic fairness'
  }
];

// Helper function to extract text from HTML content
function extractTextFromHTML(html) {
  // Simple HTML tag removal - preserves text between tags
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Helper function to preserve HTML structure while translating text
async function translateHTMLContent(html, targetLang) {
  // This is a simplified approach - for production, use a proper HTML parser
  const textSegments = [];
  const placeholders = [];
  let processedHTML = html;
  
  // Extract text between tags
  const regex = />([^<]+)</g;
  let match;
  let index = 0;
  
  while ((match = regex.exec(html)) !== null) {
    if (match[1].trim()) {
      textSegments.push(match[1]);
      const placeholder = `__PLACEHOLDER_${index}__`;
      placeholders.push(placeholder);
      processedHTML = processedHTML.replace(match[1], placeholder);
      index++;
    }
  }
  
  // Translate all text segments
  if (textSegments.length > 0) {
    const translations = await translateBatch(textSegments, targetLang);
    
    // Replace placeholders with translations
    for (let i = 0; i < placeholders.length; i++) {
      processedHTML = processedHTML.replace(placeholders[i], translations[i] || textSegments[i]);
    }
  }
  
  return processedHTML;
}

// Function to make translation API request
function translateText(text, targetLang) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      q: text,
      target: targetLang,
      format: 'text'
    });

    const options = {
      hostname: 'translation.googleapis.com',
      path: `/language/translate/v2?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.data.translations[0].translatedText);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Function to translate multiple texts in batch
async function translateBatch(texts, targetLang) {
  const translations = [];
  for (const text of texts) {
    try {
      const translation = await translateText(text, targetLang);
      translations.push(translation);
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Translation error: ${error.message}`);
      translations.push(text); // Fallback to original text
    }
  }
  return translations;
}

// Function to escape SQL strings
function escapeSQLString(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + str.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

// Function to generate SQL UPDATE statement
function generateUpdateSQL(table, id, translations) {
  const jsonb = JSON.stringify(translations);
  const escapedJsonb = escapeSQLString(jsonb);
  return `UPDATE ${table} SET translations = ${escapedJsonb}::jsonb WHERE id = '${id}';`;
}

// Main translation function
async function translateAllContent() {
  console.log('Starting translation process...\n');
  const sqlStatements = [];
  let totalCharacters = 0;
  let itemCount = 0;

  // Translate blog posts
  console.log('Translating blog posts...');
  for (const post of blogPosts) {
    itemCount++;
    console.log(`  Processing blog post ${itemCount}/${blogPosts.length}: ${post.title}`);
    
    const translations = {};
    for (const lang of TARGET_LANGUAGES) {
      console.log(`    Translating to ${lang}...`);
      
      translations[lang] = {
        title: await translateText(post.title, lang),
        excerpt: await translateText(post.excerpt, lang),
        content: await translateHTMLContent(post.content, lang)
      };
      
      // Count characters for cost estimation
      totalCharacters += post.title.length + post.excerpt.length + extractTextFromHTML(post.content).length;
      
      // Delay between languages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    sqlStatements.push(generateUpdateSQL('blog_posts', post.id, translations));
  }

  // Translate resources
  console.log('\nTranslating resources...');
  itemCount = 0;
  for (const resource of resources) {
    itemCount++;
    console.log(`  Processing resource ${itemCount}/${resources.length}: ${resource.title}`);
    
    const translations = {};
    for (const lang of TARGET_LANGUAGES) {
      console.log(`    Translating to ${lang}...`);
      
      translations[lang] = {
        title: await translateText(resource.title, lang),
        description: await translateText(resource.description, lang),
        content: await translateHTMLContent(resource.content, lang)
      };
      
      // Count characters for cost estimation
      totalCharacters += resource.title.length + resource.description.length + extractTextFromHTML(resource.content).length;
      
      // Delay between languages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    sqlStatements.push(generateUpdateSQL('resources', resource.id, translations));
  }

  // Translate projects
  console.log('\nTranslating projects...');
  itemCount = 0;
  for (const project of projects) {
    itemCount++;
    console.log(`  Processing project ${itemCount}/${projects.length}: ${project.title}`);
    
    const translations = {};
    for (const lang of TARGET_LANGUAGES) {
      console.log(`    Translating to ${lang}...`);
      
      translations[lang] = {
        title: await translateText(project.title, lang),
        description: await translateText(project.description, lang)
      };
      
      // Count characters for cost estimation
      totalCharacters += project.title.length + project.description.length;
      
      // Delay between languages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    sqlStatements.push(generateUpdateSQL('projects', project.id, translations));
  }

  // Write SQL file
  const outputPath = path.join(__dirname, '..', 'database-translations.sql');
  const sqlContent = '-- Database translations generated by translate-database-content.js\n' +
                     '-- Generated on: ' + new Date().toISOString() + '\n\n' +
                     sqlStatements.join('\n\n') + '\n';
  
  fs.writeFileSync(outputPath, sqlContent);
  console.log(`\nSQL file generated: ${outputPath}`);
  
  // Cost estimation (Google Translate API pricing: $20 per 1 million characters)
  const estimatedCost = (totalCharacters * 3 * 20) / 1000000; // 3 languages
  console.log(`\nTranslation complete!`);
  console.log(`Total items translated: ${blogPosts.length + resources.length + projects.length}`);
  console.log(`Total characters processed: ${totalCharacters * 3} (across 3 languages)`);
  console.log(`Estimated cost: $${estimatedCost.toFixed(4)}`);
}

// Run the translation
translateAllContent().catch(error => {
  console.error('Translation failed:', error);
  process.exit(1);
});
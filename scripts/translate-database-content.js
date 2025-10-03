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

// Blog posts data (13 rows) - USING ACTUAL DATABASE IDs
const blogPosts = [
  {
    id: 'b03cd967-4d26-49f2-b22b-bd642b281628',
    title: 'Understanding AI Ethics in Healthcare',
    excerpt: 'Exploring the intersection of artificial intelligence and medical ethics',
    content: '<p>As artificial intelligence becomes increasingly integrated into healthcare systems worldwide, we must carefully consider the ethical implications...</p>'
  },
  {
    id: '10da74d4-e488-461a-a62d-53c12da020c1',
    title: 'The Future of Responsible AI Development',
    excerpt: 'Building AI systems with accountability and transparency',
    content: '<p>The rapid advancement of AI technology demands that we establish clear guidelines for responsible development...</p>'
  },
  {
    id: '923db854-2148-4940-bff5-47c2470824c6',
    title: 'Privacy in the Age of Machine Learning',
    excerpt: 'How to protect personal data while advancing AI capabilities',
    content: '<p>Machine learning models require vast amounts of data to function effectively, but this need must be balanced with privacy rights...</p>'
  },
  {
    id: 'e72858ce-6e61-4eae-a385-b0669aff4ab2',
    title: 'Bias Detection and Mitigation in AI Systems',
    excerpt: 'Strategies for creating fair and equitable algorithms',
    content: '<p>Algorithmic bias remains one of the most pressing challenges in AI deployment. This post explores practical methods...</p>'
  },
  {
    id: '7b7f8ffc-d49b-4cb9-b233-474180d4942b',
    title: 'AI Governance Frameworks for Organizations',
    excerpt: 'Implementing effective oversight for AI initiatives',
    content: '<p>Organizations deploying AI need robust governance frameworks to ensure ethical and legal compliance...</p>'
  },
  {
    id: '7d18faf4-7da9-48e8-8e04-d6ef302656a1',
    title: 'Explainable AI: Making Black Boxes Transparent',
    excerpt: 'The importance of interpretability in machine learning',
    content: '<p>As AI systems become more complex, understanding how they reach decisions becomes crucial for trust and accountability...</p>'
  },
  {
    id: 'af8a8028-afde-41ba-91af-5efa01124d68',
    title: 'The Environmental Impact of AI Training',
    excerpt: 'Assessing the carbon footprint of large language models',
    content: '<p>Training large AI models consumes significant computational resources, raising important questions about sustainability...</p>'
  },
  {
    id: 'd3b36c5c-332b-4dba-97ab-419cdb243963',
    title: 'Human-AI Collaboration in Decision Making',
    excerpt: 'Finding the right balance between automation and human judgment',
    content: '<p>The most effective AI implementations often involve meaningful collaboration between humans and machines...</p>'
  },
  {
    id: '3a7effb2-b827-49c1-9f16-019427e6a234',
    title: 'AI Safety Research: Current Challenges',
    excerpt: 'Addressing existential risks and alignment problems',
    content: '<p>As AI capabilities advance, ensuring these systems remain safe and aligned with human values becomes paramount...</p>'
  },
  {
    id: '7f7c0802-cdbf-487d-a4c7-b3e82a786809',
    title: 'Regulatory Approaches to AI: Global Perspectives',
    excerpt: 'Comparing different national strategies for AI regulation',
    content: '<p>Countries around the world are developing diverse approaches to regulating AI, from the EU AI Act to...</p>'
  },
  {
    id: 'a387fcdd-f3fd-4d0b-99f4-811472487eca',
    title: 'The Role of Ethics Committees in AI Development',
    excerpt: 'How organizations can establish effective ethical oversight',
    content: '<p>Ethics committees play a crucial role in guiding responsible AI development within organizations...</p>'
  },
  {
    id: 'c275d752-086b-4a56-8f31-04c4dd262d5f',
    title: 'AI and Social Justice: Opportunities and Risks',
    excerpt: 'Leveraging AI for positive social impact while avoiding harm',
    content: '<p>Artificial intelligence has the potential to address social inequities, but it can also perpetuate existing biases...</p>'
  },
  {
    id: '93afce9f-e45a-4feb-abc0-83e7b9f802f4',
    title: 'Building Trust in Autonomous Systems',
    excerpt: 'Key factors for public acceptance of AI technologies',
    content: '<p>For AI systems to be successfully deployed at scale, they must earn and maintain public trust through...</p>'
  }
];

// Resources data (7 rows) - USING ACTUAL DATABASE IDs
const resources = [
  {
    id: '148f1b3d-350e-4469-bb12-bfc96e8ab514',
    title: 'AI Ethics Framework Guide',
    description: 'A comprehensive guide to implementing ethical AI practices in your organization',
    content: '<h2>Introduction to AI Ethics</h2><p>This framework provides actionable guidelines for developing and deploying ethical AI systems...</p>'
  },
  {
    id: 'f5704644-e0a1-4518-a1d7-138d38ca2f1c',
    title: 'Machine Learning Bias Checklist',
    description: 'Essential checklist for identifying and mitigating bias in ML models',
    content: '<h2>Bias Detection Steps</h2><ol><li>Data collection audit</li><li>Feature engineering review</li><li>Model evaluation metrics</li></ol>...'
  },
  {
    id: '4814806a-89ce-462c-a800-de31b9c2f7be',
    title: 'Privacy-Preserving AI Techniques',
    description: 'Learn about federated learning, differential privacy, and other privacy-preserving methods',
    content: '<h2>Privacy Techniques Overview</h2><p>Modern AI systems can maintain user privacy through various technical approaches...</p>'
  },
  {
    id: '4423885e-88c4-4c28-840a-57cba58f4187',
    title: 'AI Governance Template',
    description: 'Ready-to-use templates for establishing AI governance in your organization',
    content: '<h2>Governance Structure</h2><p>Effective AI governance requires clear roles, responsibilities, and processes...</p>'
  },
  {
    id: '2b1d4267-a454-4b30-b18b-4f7087fcab36',
    title: 'Responsible AI Development Toolkit',
    description: 'Tools and resources for building responsible AI systems',
    content: '<h2>Development Best Practices</h2><p>This toolkit provides practical resources for implementing responsible AI principles...</p>'
  },
  {
    id: '99c1ade8-3176-438e-95b2-6620778be031',
    title: 'AI Impact Assessment Framework',
    description: 'Methodology for assessing the societal impact of AI deployments',
    content: '<h2>Impact Assessment Process</h2><p>Before deploying AI systems, organizations should conduct thorough impact assessments...</p>'
  },
  {
    id: '6d3dafde-b228-4df1-a6ab-bac2d98246e0',
    title: 'Ethics Training for AI Practitioners',
    description: 'Curriculum and materials for ethics education in AI development teams',
    content: '<h2>Training Modules</h2><p>This comprehensive training program covers essential ethical considerations for AI practitioners...</p>'
  }
];

// Projects data (4 rows) - USING ACTUAL DATABASE IDs
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
    id: 'b23231c5-c490-4c07-b94e-a7d447c2c033',
    title: 'One Amazing Project 12',
    description: 'An innovative project showcasing cutting-edge AI applications'
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
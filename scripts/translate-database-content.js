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
    content: '<p>As artificial intelligence becomes increasingly integrated into healthcare systems worldwide, we must carefully consider the ethical implications of these powerful technologies. The healthcare sector presents unique challenges for AI implementation, as decisions made by these systems can directly impact patient lives and wellbeing.</p><p>One of the primary concerns is the issue of algorithmic bias in diagnostic systems. Studies have shown that AI models trained on datasets that lack diversity can perpetuate and even amplify existing healthcare disparities. For instance, skin cancer detection algorithms have demonstrated lower accuracy rates for patients with darker skin tones, primarily due to underrepresentation in training data.</p><p>Privacy and data security represent another critical dimension of AI ethics in healthcare. Patient medical records contain highly sensitive information, and the use of this data to train AI models raises important questions about consent, ownership, and protection. Healthcare organizations must balance the potential benefits of AI-driven insights with the fundamental right to patient privacy.</p><p>The question of accountability in AI-assisted medical decisions also demands careful consideration. When an AI system contributes to a diagnosis or treatment recommendation, determining liability in cases of adverse outcomes becomes complex. This challenge requires clear frameworks that define the roles and responsibilities of healthcare providers, technology developers, and institutions.</p><p>Moving forward, the healthcare industry must establish robust ethical guidelines for AI deployment. This includes ensuring transparency in algorithmic decision-making, maintaining human oversight of critical decisions, and continuously monitoring systems for bias and errors. Only through thoughtful implementation can we harness the transformative potential of AI while upholding the fundamental principles of medical ethics.</p>'
  },
  {
    id: '10da74d4-e488-461a-a62d-53c12da020c1',
    title: 'The Future of Responsible AI Development',
    excerpt: 'Building AI systems with accountability and transparency',
    content: '<p>The rapid advancement of AI technology demands that we establish clear guidelines for responsible development. As artificial intelligence systems become more sophisticated and autonomous, the need for comprehensive accountability frameworks has never been more critical.</p><p>Transparency stands as a cornerstone of responsible AI development. Organizations must be able to explain how their AI systems make decisions, particularly in high-stakes applications such as criminal justice, financial services, and healthcare. This transparency extends beyond technical documentation to include clear communication with stakeholders about the capabilities and limitations of AI systems.</p><p>Accountability mechanisms must be built into AI systems from the ground up. This includes establishing clear chains of responsibility, implementing robust audit trails, and creating processes for addressing errors or unintended consequences. Development teams should include diverse perspectives to identify potential blind spots and ensure that systems are designed with all users in mind.</p><p>The concept of AI governance has emerged as a critical framework for managing these responsibilities. Effective governance structures include ethics review boards, regular impact assessments, and continuous monitoring of deployed systems. These mechanisms help organizations identify and address issues before they cause harm.</p><p>Looking ahead, the future of responsible AI development will require ongoing collaboration between technologists, ethicists, policymakers, and civil society. By working together to establish and maintain high standards for AI development, we can ensure that these powerful technologies serve the common good while minimizing potential harms.</p>'
  },
  {
    id: '923db854-2148-4940-bff5-47c2470824c6',
    title: 'Privacy in the Age of Machine Learning',
    excerpt: 'How to protect personal data while advancing AI capabilities',
    content: '<p>Machine learning models require vast amounts of data to function effectively, but this need must be balanced with privacy rights and data protection regulations. The tension between data utility and privacy protection represents one of the most significant challenges in modern AI development.</p><p>Privacy-preserving techniques have emerged as essential tools for responsible data use. Differential privacy adds carefully calibrated noise to datasets, allowing models to learn patterns while protecting individual privacy. Federated learning enables models to train on distributed data without centralizing sensitive information. These approaches demonstrate that privacy and utility need not be mutually exclusive.</p><p>The implementation of regulations like GDPR and CCPA has fundamentally changed how organizations approach data collection and processing. AI developers must now consider privacy by design, building protection measures into systems from the earliest stages of development. This includes minimizing data collection, implementing strong encryption, and providing users with meaningful control over their information.</p><p>Synthetic data generation offers another promising avenue for privacy protection. By creating artificial datasets that preserve statistical properties while containing no real individual information, organizations can develop and test AI systems without exposing sensitive data. However, ensuring that synthetic data accurately represents real-world distributions remains an ongoing challenge.</p><p>As we move forward, the AI community must continue to innovate in privacy-preserving technologies while advocating for strong data protection standards. Only through this dual approach can we build machine learning systems that respect individual privacy while delivering valuable insights and capabilities.</p>'
  },
  {
    id: 'e72858ce-6e61-4eae-a385-b0669aff4ab2',
    title: 'Bias Detection and Mitigation in AI Systems',
    excerpt: 'Strategies for creating fair and equitable algorithms',
    content: '<p>Algorithmic bias remains one of the most pressing challenges in AI deployment. This post explores practical methods for detecting and mitigating bias in AI systems, from data collection through model deployment and monitoring.</p><p>Bias in AI systems often originates in training data that reflects historical inequalities or lacks representative diversity. For example, facial recognition systems trained primarily on images of light-skinned individuals have shown significantly higher error rates for people with darker skin tones. Similarly, resume screening algorithms have been found to discriminate against women when trained on historical hiring data from male-dominated fields.</p><p>Detection strategies must be comprehensive and ongoing. This includes statistical analysis of model outputs across different demographic groups, adversarial testing to identify edge cases, and regular audits by independent third parties. Organizations should establish clear metrics for fairness and regularly evaluate their systems against these benchmarks.</p><p>Mitigation techniques vary depending on the source and nature of bias. Data augmentation can help address representation gaps, while algorithmic debiasing techniques can adjust model weights to reduce discriminatory patterns. Post-processing methods can modify outputs to ensure equitable treatment across groups. However, each approach involves tradeoffs that must be carefully considered.</p><p>Creating truly fair AI systems requires more than technical solutions. It demands diverse teams, inclusive design processes, and ongoing engagement with affected communities. By combining technical rigor with social awareness, we can work toward AI systems that promote equity rather than perpetuating discrimination.</p>'
  },
  {
    id: '7b7f8ffc-d49b-4cb9-b233-474180d4942b',
    title: 'AI Governance Frameworks for Organizations',
    excerpt: 'Implementing effective oversight for AI initiatives',
    content: '<p>Organizations deploying AI need robust governance frameworks to ensure ethical and legal compliance. Effective AI governance encompasses policies, procedures, and organizational structures that guide the responsible development and deployment of artificial intelligence systems.</p><p>A comprehensive AI governance framework begins with clear policies that define acceptable use cases, ethical principles, and decision-making processes. These policies should address key issues such as data privacy, algorithmic transparency, human oversight requirements, and procedures for handling errors or adverse outcomes. Regular updates ensure policies remain relevant as technology and regulations evolve.</p><p>Organizational structure plays a crucial role in effective governance. Many leading organizations have established AI ethics boards or committees that include diverse stakeholders from technical, legal, ethical, and business domains. These bodies review high-risk AI projects, provide guidance on ethical dilemmas, and ensure alignment with organizational values and regulatory requirements.</p><p>Risk assessment and management form another critical component of AI governance. Organizations must develop processes for identifying, evaluating, and mitigating risks associated with AI systems. This includes technical risks such as model failures, as well as broader societal risks such as job displacement or privacy violations.</p><p>Successful AI governance requires a culture of responsibility throughout the organization. This means investing in training programs, establishing clear accountability structures, and creating channels for raising concerns. By embedding governance into the organizational fabric, companies can ensure that AI development remains aligned with ethical principles and business objectives.</p>'
  },
  {
    id: '7d18faf4-7da9-48e8-8e04-d6ef302656a1',
    title: 'Explainable AI: Making Black Boxes Transparent',
    excerpt: 'The importance of interpretability in machine learning',
    content: '<p>As AI systems become more complex, understanding how they reach decisions becomes crucial for trust and accountability. The black box nature of many machine learning models, particularly deep neural networks, poses significant challenges for transparency and trust.</p><p>Explainable AI (XAI) encompasses a range of techniques designed to make AI decision-making more interpretable. These methods include feature importance analysis, which identifies the input variables that most strongly influence predictions, and local interpretable model-agnostic explanations (LIME), which explain individual predictions by approximating complex models with simpler, interpretable ones.</p><p>Different stakeholders require different levels and types of explanations. Data scientists may need detailed technical explanations of model behavior, while end users might benefit from simpler, more intuitive explanations. Regulatory bodies may require yet another form of explanation that demonstrates compliance with legal requirements. Effective XAI systems must cater to these diverse needs.</p><p>The trade-off between model performance and interpretability remains a central challenge. Simple, highly interpretable models like decision trees may sacrifice accuracy compared to complex neural networks. However, recent advances in XAI are narrowing this gap, developing techniques that maintain high performance while providing meaningful explanations.</p><p>As AI systems take on more critical roles in society, the demand for explainability will only grow. Organizations must prioritize interpretability in their AI development processes, viewing it not as an optional feature but as a fundamental requirement for responsible AI deployment.</p>'
  },
  {
    id: 'af8a8028-afde-41ba-91af-5efa01124d68',
    title: 'The Environmental Impact of AI Training',
    excerpt: 'Assessing the carbon footprint of large language models',
    content: '<p>Training large AI models consumes significant computational resources, raising important questions about sustainability and environmental responsibility. As models grow in size and complexity, their carbon footprint has become an increasingly urgent concern for the AI community.</p><p>The environmental impact of AI training is substantial. Training a single large language model can emit as much carbon as several cars over their entire lifetimes. The energy consumption comes not only from the training process itself but also from cooling systems required for data centers and the manufacturing of specialized hardware like GPUs and TPUs.</p><p>Several strategies can help reduce the environmental impact of AI. Model efficiency techniques such as pruning, quantization, and knowledge distillation can achieve similar performance with smaller, less resource-intensive models. Researchers are also exploring more efficient training algorithms that require fewer iterations to converge.</p><p>The choice of energy sources for data centers plays a crucial role in determining the carbon footprint of AI training. Organizations that prioritize renewable energy sources for their computing infrastructure can significantly reduce their environmental impact. Some companies have committed to carbon neutrality or even carbon negativity in their AI operations.</p><p>Moving forward, the AI community must balance the pursuit of more powerful models with environmental responsibility. This includes developing standardized metrics for measuring and reporting the environmental impact of AI systems, investing in green computing infrastructure, and prioritizing research into more efficient algorithms and architectures.</p>'
  },
  {
    id: 'd3b36c5c-332b-4dba-97ab-419cdb243963',
    title: 'Human-AI Collaboration in Decision Making',
    excerpt: 'Finding the right balance between automation and human judgment',
    content: '<p>The most effective AI implementations often involve meaningful collaboration between humans and machines, leveraging the unique strengths of both to achieve better outcomes than either could accomplish alone. This human-AI partnership represents the future of intelligent systems in many domains.</p><p>In medical diagnosis, AI systems can process vast amounts of medical literature and patient data to identify patterns that might escape human notice. However, physicians bring contextual understanding, empathy, and the ability to consider factors that may not be captured in data. The combination of AI analysis and human judgment has shown superior results in detecting diseases like cancer compared to either alone.</p><p>The design of human-AI interfaces critically influences the effectiveness of collaboration. Systems must present information in ways that augment human decision-making without overwhelming users or creating over-reliance on automated recommendations. This includes providing confidence scores, explaining reasoning, and highlighting areas of uncertainty.</p><p>Trust calibration represents a key challenge in human-AI collaboration. Users must understand both the capabilities and limitations of AI systems to use them effectively. Over-trust can lead to blind acceptance of erroneous recommendations, while under-trust results in missed opportunities to benefit from AI assistance.</p><p>As we advance toward more sophisticated AI systems, the focus must shift from replacing human intelligence to augmenting it. This requires interdisciplinary collaboration between technologists, domain experts, and human factors researchers to create systems that truly enhance human capabilities while maintaining human agency and control.</p>'
  },
  {
    id: '3a7effb2-b827-49c1-9f16-019427e6a234',
    title: 'AI Safety Research: Current Challenges',
    excerpt: 'Addressing existential risks and alignment problems',
    content: '<p>As AI capabilities advance, ensuring these systems remain safe and aligned with human values becomes paramount. AI safety research addresses both near-term risks from current systems and long-term challenges that may arise as AI becomes more powerful and autonomous.</p><p>Current safety challenges include robustness to adversarial inputs, where small, intentional perturbations to input data can cause AI systems to make catastrophic errors. Researchers are developing techniques for training more robust models and detecting adversarial attacks. Distribution shift, where AI systems encounter data different from their training distribution, represents another critical safety concern requiring ongoing research.</p><p>The alignment problem focuses on ensuring that AI systems pursue objectives that truly reflect human values and intentions. This becomes increasingly complex as systems become more capable of long-term planning and autonomous action. Misalignment between stated objectives and true human values could lead to unintended and potentially harmful consequences.</p><p>Research into interpretability and verification provides crucial tools for AI safety. By understanding how AI systems make decisions and formally verifying their behavior under different conditions, we can identify and address potential safety issues before deployment. This includes developing mathematical frameworks for reasoning about AI behavior and creating testing environments that can reveal edge cases and failure modes.</p><p>The AI safety community emphasizes the importance of proactive research, addressing potential risks before they manifest rather than reacting to problems after they occur. This forward-thinking approach requires collaboration between AI researchers, ethicists, policymakers, and other stakeholders to ensure that safety considerations are integrated into AI development from the earliest stages.</p>'
  },
  {
    id: '7f7c0802-cdbf-487d-a4c7-b3e82a786809',
    title: 'Regulatory Approaches to AI: Global Perspectives',
    excerpt: 'Comparing different national strategies for AI regulation',
    content: '<p>Countries around the world are developing diverse approaches to regulating AI, from the EU AI Act to sector-specific guidelines in the United States. These varied regulatory frameworks reflect different cultural values, legal traditions, and priorities in addressing AI risks and opportunities.</p><p>The European Union has taken a comprehensive, risk-based approach with the AI Act, which categorizes AI systems based on their potential impact and imposes requirements accordingly. High-risk applications face stringent requirements for transparency, human oversight, and safety, while lower-risk systems face fewer restrictions. This framework aims to protect fundamental rights while fostering innovation.</p><p>The United States has pursued a more decentralized approach, with sector-specific agencies developing guidelines relevant to their domains. This includes FDA guidance for AI in medical devices, NHTSA frameworks for autonomous vehicles, and financial regulators addressing AI in banking and insurance. This approach allows for specialized expertise but may create challenges for cross-sector applications.</p><p>Asian countries have developed their own distinctive approaches. China has introduced regulations focusing on algorithmic recommendations and deep synthesis technologies, while Singapore has developed a model AI governance framework that emphasizes innovation-friendly self-regulation. Japan has promoted society 5.0, integrating AI governance into broader digital transformation initiatives.</p><p>International coordination on AI regulation remains a work in progress. Organizations like the OECD, G7, and UN are working to develop common principles and standards. However, differences in values, economic priorities, and security concerns continue to challenge efforts at global harmonization. The evolution of AI regulation will likely require ongoing dialogue and adaptation as technology and its impacts continue to evolve.</p>'
  },
  {
    id: 'a387fcdd-f3fd-4d0b-99f4-811472487eca',
    title: 'The Role of Ethics Committees in AI Development',
    excerpt: 'How organizations can establish effective ethical oversight',
    content: '<p>Ethics committees play a crucial role in guiding responsible AI development within organizations, providing oversight, guidance, and accountability for AI initiatives. These multidisciplinary bodies bring together diverse perspectives to address complex ethical challenges that arise in AI development and deployment.</p><p>Effective AI ethics committees require careful composition to ensure diverse viewpoints and expertise. Members typically include technologists who understand AI capabilities and limitations, ethicists who can identify moral implications, legal experts familiar with regulatory requirements, and representatives from affected communities. This diversity helps identify blind spots and ensures comprehensive evaluation of AI projects.</p><p>The scope of ethics committee responsibilities varies but often includes reviewing high-risk AI projects before deployment, developing ethical guidelines and best practices, investigating incidents or concerns, and providing ongoing guidance to development teams. Committees may also play a role in educating the broader organization about AI ethics and fostering a culture of responsible innovation.</p><p>For ethics committees to be effective, they need genuine authority and independence within the organization. This includes the power to halt or modify projects that pose ethical risks, direct access to senior leadership, and protection from retaliation for committee members who raise concerns. Without these safeguards, ethics committees risk becoming mere rubber stamps rather than meaningful oversight bodies.</p><p>The success of AI ethics committees depends on their integration into organizational processes and culture. This means establishing clear procedures for when and how projects are reviewed, creating channels for employees to raise ethical concerns, and ensuring that committee recommendations are taken seriously and implemented. By embedding ethical consideration into the development lifecycle, organizations can proactively address challenges rather than reacting to problems after they arise.</p>'
  },
  {
    id: 'c275d752-086b-4a56-8f31-04c4dd262d5f',
    title: 'AI and Social Justice: Opportunities and Risks',
    excerpt: 'Leveraging AI for positive social impact while avoiding harm',
    content: '<p>Artificial intelligence has the potential to address social inequities, but it can also perpetuate existing biases and create new forms of discrimination. The relationship between AI and social justice requires careful consideration of both opportunities and risks to ensure technology serves as a force for equity rather than oppression.</p><p>AI can be a powerful tool for advancing social justice. Machine learning algorithms can help identify discrimination in lending, hiring, and criminal justice, revealing patterns of bias that might otherwise go unnoticed. AI-powered translation services can break down language barriers, improving access to education, healthcare, and economic opportunities. Predictive models can help allocate resources more efficiently to underserved communities.</p><p>However, AI systems can also amplify existing inequalities. Facial recognition technology has shown higher error rates for women and people of color, leading to false arrests and wrongful accusations. Predictive policing algorithms trained on historical arrest data can perpetuate racial profiling. Automated hiring systems may discriminate against certain groups based on proxies for protected characteristics.</p><p>Achieving AI for social good requires intentional design and implementation. This includes ensuring diverse representation in development teams, engaging with affected communities throughout the design process, and conducting thorough impact assessments that consider effects on different demographic groups. Organizations must also establish mechanisms for accountability and redress when AI systems cause harm.</p><p>The path forward requires collaboration between technologists, social justice advocates, policymakers, and communities. By centering equity in AI development and deployment, we can work toward systems that reduce rather than reinforce social inequalities. This demands ongoing vigilance, continuous evaluation, and a commitment to justice that goes beyond technical solutions to address systemic issues.</p>'
  },
  {
    id: '93afce9f-e45a-4feb-abc0-83e7b9f802f4',
    title: 'Building Trust in Autonomous Systems',
    excerpt: 'Key factors for public acceptance of AI technologies',
    content: '<p>For AI systems to be successfully deployed at scale, they must earn and maintain public trust through transparency, reliability, and demonstrated benefit to society. Trust in autonomous systems is not given but earned through consistent performance, clear communication, and respect for human values and autonomy.</p><p>Transparency forms the foundation of trust in AI systems. Users need to understand what AI systems do, how they make decisions, and what their limitations are. This goes beyond technical documentation to include clear, accessible communication about system capabilities, data usage, and potential risks. Organizations deploying AI must be forthcoming about both successes and failures.</p><p>Reliability and consistency are crucial for building confidence in autonomous systems. AI must perform predictably across different contexts and user groups, with clear mechanisms for handling edge cases and failures. This includes graceful degradation when systems encounter situations outside their training distribution and clear communication when human intervention is needed.</p><p>User control and agency significantly influence trust. People are more likely to trust AI systems that respect their autonomy, provide meaningful options for human override, and allow users to understand and influence how their data is used. This includes providing opt-out mechanisms, explaining decision processes, and ensuring that AI augments rather than replaces human judgment in critical decisions.</p><p>Building lasting trust requires ongoing engagement with users and stakeholders. This means actively soliciting feedback, responding to concerns, and continuously improving systems based on real-world experience. Trust can be quickly lost through failures or misuse, making it essential for organizations to maintain high standards and respond quickly and transparently when issues arise. Only through sustained commitment to trustworthiness can AI systems achieve the broad acceptance necessary for positive societal impact.</p>'
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
#!/usr/bin/env python3
"""
Build AI Privacy & Surveillance FAQ
"""

with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'AI Privacy & Surveillance: Catholic Teaching - DCF')
html = html.replace('[150-160 character description with target keywords]', 
'Catholic Church teaching on AI privacy, surveillance, and data ethics. Vatican guidance on protecting human dignity and privacy rights in the digital age.')    
# === HERO SECTION ===
html = html.replace('🤖', '👁️')
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   '<h1 class="page-title">AI Privacy & Surveillance: Catholic Teaching</h1>')
html = html.replace('<p class="page-subtitle">[Brief description of what this FAQ covers - keep compelling and scannable]</p>',
                   '<p class="page-subtitle">How much should tech companies and governments know about us? Vatican guidance on privacy rights in the AI age</p>')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#basics">Understanding AI Surveillance (5 questions)</a></li>
                <li><a href="#vatican">Vatican Teaching on Privacy (5 questions)</a></li>
                <li><a href="#tech">Tech Companies & Your Data (5 questions)</a></li>
                <li><a href="#government">Government Surveillance & Social Credit (5 questions)</a></li>
                <li><a href="#action">Protecting Yourself & What Should Happen (5 questions)</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
faq_content = """
        <!-- Understanding AI Surveillance -->
        <div class="faq-section" id="basics">
            <h2>Understanding AI Surveillance</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is AI surveillance?</h3>
                <p class="faq-answer">AI surveillance refers to the use of artificial intelligence systems to monitor, track, analyze, and predict human behavior at scale. This includes facial recognition cameras that identify people in public spaces, algorithms that analyze your online activity to build detailed profiles, systems that monitor employee productivity, predictive policing tools that forecast where crimes might occur, and social credit systems that score citizens based on behavior. Unlike traditional surveillance which required human operators, AI enables automated, persistent, and comprehensive monitoring of millions of people simultaneously—creating unprecedented capacity for both corporate and government intrusion into private life.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How much data do tech companies actually collect about me?</h3>
                <p class="faq-answer">More than most people realize. Tech companies collect vast amounts of data: every search query, every website visited, every video watched, every purchase made, your precise location throughout the day, who you communicate with and what you say, what time you wake up and go to sleep, what you read and for how long, your political views, your health concerns, your relationship status, and even predictions about your future behavior. This data is aggregated, analyzed by AI, and used to build detailed psychological profiles. The Vatican calls this "surveillance capitalism"—treating human experience as raw material for profit without meaningful consent or understanding from those being surveilled.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What is facial recognition and why does the Vatican worry about it?</h3>
                <p class="faq-answer">Facial recognition uses AI to identify individuals by analyzing their facial features captured by cameras. It's increasingly deployed in public spaces, stores, airports, and even churches. The Vatican worries because it enables mass surveillance without consent—you cannot opt out of being identified in public. It creates a society where anonymity becomes impossible, where all movement is tracked and recorded, where dissent can be chilled by the knowledge that you're always being watched and identified. The technology also exhibits significant bias, misidentifying people of color at much higher rates, leading to false accusations and wrongful arrests. The Church argues this violates human dignity and the right to privacy.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What are social credit systems?</h3>
                <p class="faq-answer">Social credit systems use AI to monitor citizens' behavior and assign scores that determine access to services, opportunities, and rights. China's system is the most developed, tracking everything from jaywalking to online speech to social connections, then using AI to calculate trustworthiness scores that affect ability to buy plane tickets, get loans, attend certain schools, or secure employment. Similar systems are emerging elsewhere in different forms—algorithms that determine credit scores, insurance rates, job opportunities, and housing access based on behavioral data. The Vatican condemns these systems as fundamentally incompatible with human dignity because they treat people as objects to be measured and controlled rather than moral agents with intrinsic worth.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How is AI surveillance different from traditional surveillance?</h3>
                <p class="faq-answer">Traditional surveillance required human operators watching specific targets—it was limited by cost, manpower, and practical constraints. AI surveillance is automated, continuous, comprehensive, and scalable. It can monitor billions of people simultaneously, analyze patterns humans would never detect, make predictions about future behavior, and operate persistently without fatigue. Traditional surveillance required specific suspicion to justify targeting someone; AI surveillance presumes everyone is worth monitoring and analyzing all the time. The Vatican argues this shift from targeted monitoring to universal surveillance fundamentally changes the relationship between individuals, corporations, and governments—creating what Pope Francis calls "a culture of constant vigilance" incompatible with human freedom and dignity.</p>
            </div>
        </div>

        <!-- Vatican Teaching -->
        <div class="faq-section" id="vatican">
            <h2>Vatican Teaching on Privacy</h2>

            <div class="faq-item">
                <h3 class="faq-question">Does the Catholic Church recognize a right to privacy?</h3>
                <p class="faq-answer">Yes, absolutely. Catholic Social Teaching holds that privacy is essential to human dignity. The Church teaches that persons have a right to a private sphere where they can develop relationships, form opinions, and live without constant observation or judgment. This right derives from human dignity—we are not mere objects to be analyzed but subjects with interior lives deserving respect and protection. The Catechism of the Catholic Church explicitly affirms respect for privacy, and Vatican documents on communications technology have consistently defended privacy rights against both government and corporate intrusion. In the digital age, the Vatican argues, this ancient right faces new threats requiring new protections.</p>
                
                <div class="vatican-quote">
                    "Everyone has the right to protection from arbitrary or unlawful interference with privacy, family, home or correspondence."
                    <cite>— Catechism of the Catholic Church, citing Universal Declaration of Human Rights</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What has Pope Francis said about digital surveillance?</h3>
                <p class="faq-answer">Pope Francis has repeatedly warned about the dangers of surveillance technology and what he calls "algorithms of control." In his 2024 message on AI and peace, he expressed deep concern about systems that monitor and manipulate people without their knowledge or consent. He's particularly worried about surveillance being used to suppress dissent, control populations, and treat humans as objects for manipulation rather than persons deserving dignity. The Pope has called for international agreements to protect privacy rights in the digital age, arguing that unchecked surveillance power—whether wielded by corporations or governments—threatens fundamental human freedoms and creates conditions for totalitarian control.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why does the Vatican call it "surveillance capitalism"?</h3>
                <p class="faq-answer">The Vatican adopted this term from scholar Shoshana Zuboff to describe how tech companies treat human experience as free raw material for profit. Companies monitor everything you do online (and increasingly offline), use AI to analyze this data and predict your behavior, then sell these predictions to advertisers and others who want to influence you. You're not the customer—you're the product being sold. The Church sees this as a fundamental violation of human dignity: people are being reduced to data points, manipulated without consent, and treated as resources to be mined rather than persons to be respected. The Vatican argues this model is morally wrong regardless of its profitability.</p>
                
                <div class="vatican-quote">
                    "The human person must not be reduced to data. Every individual has a right to privacy and to not be constantly monitored and manipulated."
                    <cite>— Pope Francis, Message for World Communications Day (2023)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What does "Antiqua et Nova" say about privacy?</h3>
                <p class="faq-answer">The Vatican's January 2025 document "Antiqua et Nova" dedicates substantial attention to AI surveillance and privacy. It argues that constant monitoring fundamentally changes human behavior—when people know they're always being watched and analyzed, they self-censor, conform, and lose the freedom necessary for authentic human development. The document warns that AI surveillance creates unprecedented power imbalances: those who control surveillance systems gain godlike knowledge of human behavior while those being surveilled become transparent and vulnerable. The Church calls for strong legal protections for privacy, meaningful consent requirements, and strict limits on both corporate and government surveillance powers.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does privacy relate to human dignity?</h3>
                <p class="faq-answer">Catholic teaching views privacy as essential to human dignity in several ways. First, privacy protects the interior life—our thoughts, beliefs, and relationships that should not be subject to constant external scrutiny. Second, privacy enables freedom—people cannot freely develop, experiment, make mistakes, or dissent when every action is monitored and recorded. Third, privacy recognizes that humans are not merely objects to be observed and analyzed but subjects with rights that deserve respect. When AI systems subject us to constant surveillance, analysis, and manipulation, they treat us as things rather than persons. The Vatican argues this violates the fundamental Christian understanding that every human being bears God's image and possesses inalienable dignity.</p>
            </div>
        </div>

        <!-- Tech Companies -->
        <div class="faq-section" id="tech">
            <h2>Tech Companies & Your Data</h2>

            <div class="faq-item">
                <h3 class="faq-question">Why do tech companies want so much data about me?</h3>
                <p class="faq-answer">Data is the raw material for AI systems, and the business model of major tech companies depends on collecting, analyzing, and monetizing your data. More data means better predictions about your behavior, which means more effective targeted advertising, which generates billions in revenue. Companies use AI to analyze your data and create detailed profiles predicting what you'll buy, watch, click, or believe. These predictions are sold to advertisers and others who want to influence you. The Vatican argues this creates a dangerous system where companies have strong financial incentives to collect as much data as possible while users have little understanding of what's collected or how it's used—creating fundamental power imbalances incompatible with human dignity.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Do I really consent to data collection when I click "I agree"?</h3>
                <p class="faq-answer">Not meaningfully, according to the Vatican. Terms of service agreements are deliberately written to be long, complex, and incomprehensible—studies show it would take 76 workdays per year to read all the privacy policies you encounter. Companies know nobody reads these documents, yet they claim your clicking "agree" constitutes informed consent. The Church argues this is a legal fiction that violates real consent requirements. Meaningful consent requires understanding what you're agreeing to, genuine choice about alternatives, and ability to withhold consent without suffering major consequences. When privacy policies are intentionally opaque and refusing means losing access to essential services, real consent doesn't exist. The Vatican calls for much stricter requirements for genuine informed consent in data collection.</p>
                
                <div class="case-study">
                    <h3>Real-World Example: Facebook's Data Practices</h3>
                    <p><strong>What Happened:</strong> In 2018, it was revealed that Cambridge Analytica harvested data from 87 million Facebook users without consent, using it for political targeting in elections worldwide.</p>
                    <p><strong>The Consent Illusion:</strong> While users had technically agreed to Facebook's terms of service, they had no idea their data would be used this way. The terms were vague enough to permit practices users would never knowingly authorize.</p>
                    <p><strong>The Vatican's Point:</strong> This illustrates how current "consent" frameworks don't provide meaningful protection. Real consent requires understanding and meaningful choice—conditions that don't exist when tech companies deliberately obscure their data practices in incomprehensible legal documents.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Can't I just avoid services that collect my data?</h3>
                <p class="faq-answer">Not practically, the Vatican acknowledges. Major tech platforms have become essential infrastructure for modern life—you need email to apply for jobs, social media to maintain relationships, smartphones to access services, search engines to find information. Saying "just don't use them" is like saying "just don't use electricity" or "just don't use roads." The Church argues that when companies control essential infrastructure, they cannot be allowed to exploit this power to collect unlimited data without meaningful consent or oversight. Just as we regulate other essential services—utilities, telecommunications, transportation—to protect the public interest, the Vatican calls for regulation of tech platforms to protect privacy rights rather than forcing individuals to choose between participation in modern society or protecting their dignity.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about data breaches and security?</h3>
                <p class="faq-answer">This adds another dimension to the Vatican's privacy concerns. Tech companies collect massive amounts of sensitive data, then frequently fail to protect it adequately. Major breaches have exposed billions of people's personal information—medical records, financial data, private messages, intimate photos, location history. Once this data is stolen, it can be used for identity theft, blackmail, harassment, or manipulation for years or decades. The Church argues that companies collecting extensive data have moral obligations to protect it with the highest security standards, and should be held liable when they fail. But the deeper point is that data that doesn't exist can't be breached—the best protection is not collecting unnecessary data in the first place.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Should tech companies be allowed to sell my data?</h3>
                <p class="faq-answer">No, according to Vatican teaching. Selling personal data treats human beings as commodities—their experiences, relationships, and intimate details become products to be bought and sold without meaningful consent. The Church argues this violates human dignity fundamentally. People should not be reduced to data points in corporate profit calculations. While companies claim they sell "anonymized" data or predictions rather than raw data, the Vatican points out these distinctions are largely meaningless—modern AI can re-identify individuals from supposedly anonymous datasets, and selling predictions about someone's behavior is still commodifying that person. The Church calls for strict regulations prohibiting sale of personal data without explicit, informed, revocable consent—and questions whether such sales should be permitted at all.</p>
            </div>
        </div>

        <!-- Government Surveillance -->
        <div class="faq-section" id="government">
            <h2>Government Surveillance & Social Credit</h2>

            <div class="faq-item">
                <h3 class="faq-question">When is government surveillance justified?</h3>
                <p class="faq-answer">Catholic teaching allows limited government surveillance under strict conditions: there must be genuine necessity (serious threats to public safety or national security), proportionality (surveillance must be narrowly targeted, not mass collection), proper authority and oversight (judicial warrants, not unilateral executive action), and accountability (mechanisms to prevent abuse and provide redress when rights are violated). The Church distinguishes between targeted surveillance of specific suspects based on evidence—which may be necessary for security—and mass surveillance of entire populations, which the Vatican argues is never justified because it treats all citizens as suspects, chills legitimate dissent, and creates conditions for totalitarian control. AI-powered mass surveillance fails these basic moral requirements.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What's wrong with "if you have nothing to hide, you have nothing to fear"?</h3>
                <p class="faq-answer">The Vatican strongly rejects this argument. First, it assumes governments and those operating surveillance systems will always act justly and never abuse power—an assumption history repeatedly disproves. Second, it conflates privacy with secrecy—having an interior life, personal relationships, and freedom from constant observation doesn't mean you're hiding wrongdoing. Third, "nothing to hide" depends on who's judging and under what standards—political speech that's legal today might be criminalized tomorrow. Fourth, it gives governments and corporations godlike knowledge of human behavior that no fallible human institution should possess. The Church teaches that privacy is a right, not something you must earn by proving innocence. Mass surveillance inverts this: it presumes everyone is suspect until proven otherwise.</p>
                
                <div class="vatican-quote">
                    "Privacy is not about having something to hide. It is about having something to protect: human dignity and freedom."
                    <cite>— Pontifical Academy for Life Statement on Privacy (2019)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What does the Vatican say about China's social credit system?</h3>
                <p class="faq-answer">The Holy See has condemned China's social credit system as fundamentally incompatible with human dignity. The system uses AI to monitor citizens constantly, scoring them based on behavior ranging from jaywalking to online speech to social connections, then using these scores to determine access to education, employment, travel, and other opportunities. The Vatican argues this treats people as objects to be measured and controlled rather than persons with intrinsic dignity deserving respect regardless of "social credit scores." It creates a system of algorithmic control that extends government power into every aspect of life, punishes dissent, and reduces human worth to a number calculated by opaque algorithms. The Church warns that similar systems are emerging in democracies through corporate scoring systems and algorithmic decision-making.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Can facial recognition be used ethically by police?</h3>
                <p class="faq-answer">The Vatican expresses deep skepticism. While limited use with strict safeguards might be permissible in narrow circumstances (identifying specific suspects with warrants), the technology's current deployment raises serious moral concerns. Facial recognition exhibits significant racial bias, leading to false arrests of innocent people, particularly people of color. It enables mass surveillance without consent or judicial oversight. It can be used to track protesters, suppress dissent, and chill legitimate exercise of political rights. Most troubling, once deployed, the technology tends to expand beyond initial narrow purposes to enable comprehensive population monitoring. The Church argues that given these dangers, many jurisdictions should ban facial recognition by police entirely, following cities like San Francisco that have done so.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about surveillance "for our safety"?</h3>
                <p class="faq-answer">The Vatican acknowledges that security is a legitimate government function but warns against trading fundamental rights for promised safety. History shows that surveillance powers granted for security purposes tend to be abused for political control, with marginalized communities bearing the greatest harm. AI surveillance hasn't been proven effective at preventing terrorism or serious crime—it generates massive false positives while missing genuine threats. Meanwhile, it creates very real harms: chilling free speech and assembly, enabling discrimination, creating infrastructure for totalitarian control, and undermining the trust between citizens and government essential for democracy. The Church teaches that security measures must be proportionate, targeted, and respectful of human rights—blanket surveillance of entire populations fails these tests even when justified as protecting safety.</p>
            </div>
        </div>

        <!-- Protection & Action -->
        <div class="faq-section" id="action">
            <h2>Protecting Yourself & What Should Happen</h2>

            <div class="faq-item">
                <h3 class="faq-question">How can I protect my privacy from AI surveillance?</h3>
                <p class="faq-answer">Individual actions help but are insufficient without systemic change, the Vatican acknowledges. You can: use privacy-focused browsers and search engines (Firefox, DuckDuckGo instead of Chrome and Google), enable privacy settings on devices and apps, use end-to-end encrypted messaging (Signal), minimize social media sharing, use VPNs when possible, regularly delete cookies and browsing history, be skeptical about "free" services that profit from your data, and read privacy policies when possible. However, the Church emphasizes that individual responsibility cannot substitute for corporate and government accountability—you shouldn't need a computer science degree to protect basic rights. Strong privacy laws and regulations are essential.</p>
                
                <div class="case-study">
                    <h3>Practical Privacy Steps</h3>
                    <p><strong>Browser & Search:</strong> Switch to Firefox browser with privacy extensions. Use DuckDuckGo or Startpage instead of Google search.</p>
                    <p><strong>Messaging:</strong> Use Signal for private conversations instead of regular SMS or social media messaging.</p>
                    <p><strong>Social Media:</strong> Limit what you post publicly. Review privacy settings regularly. Consider whether you need accounts on all platforms.</p>
                    <p><strong>Devices:</strong> Disable location tracking when not needed. Review app permissions—does your flashlight app really need access to your contacts?</p>
                    <p><strong>Awareness:</strong> Understand that convenience often comes at the cost of privacy. Make informed trade-offs rather than blindly accepting defaults.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What laws should protect privacy in the AI age?</h3>
                <p class="faq-answer">The Vatican calls for comprehensive privacy legislation similar to Europe's GDPR but stronger. Key requirements should include: meaningful informed consent for data collection, strict limits on what data can be collected and how long it can be retained, prohibition on selling personal data without explicit consent, right to access and delete your data, algorithmic transparency and explainability, strong penalties for violations, and prohibition on discriminatory uses of AI. Importantly, the Church argues that privacy should be the default—companies should need affirmative permission to collect data, not hide behind incomprehensible terms of service. Additionally, certain uses should be banned entirely: social credit systems, mass facial recognition surveillance, and algorithmic manipulation that exploits psychological vulnerabilities.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Should facial recognition be banned?</h3>
                <p class="faq-answer">Yes, for most uses, according to growing consensus including Vatican-aligned organizations. The technology's dangers outweigh its benefits: it enables mass surveillance without consent, exhibits severe racial bias leading to wrongful accusations, chills legitimate political activity and dissent, and creates infrastructure that authoritarian governments exploit. Several cities and jurisdictions have banned government use of facial recognition, and the Vatican supports these prohibitions. Limited exceptions might exist for extremely narrow purposes with robust safeguards, but the Church argues the burden should be on those wanting to use the technology to prove necessity and proportionality—not on citizens to prove why they deserve privacy. The default should be prohibition, not permissive deployment.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What role should Catholics play in fighting surveillance?</h3>
                <p class="faq-answer">Active and vocal, the Vatican teaches. Catholics should educate themselves about surveillance technologies and privacy rights, support organizations working for privacy protections, contact elected representatives demanding strong privacy laws, oppose facial recognition and social credit systems when deployed locally, and choose privacy-respecting alternatives when possible. Catholic institutions—universities, hospitals, dioceses, schools—should adopt strong privacy protections for those they serve, refuse to deploy surveillance technologies that violate dignity, and divest from companies whose business models depend on surveillance capitalism. The Church calls privacy protection a matter of justice requiring political engagement, not merely personal choices about which apps to use.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Is there hope for privacy in the AI age?</h3>
                <p class="faq-answer">Yes, but only if we act, the Vatican teaches. Privacy isn't inevitably doomed by technology—surveillance is a choice, not a necessity. Alternative business models exist that don't depend on surveillance capitalism. Strong privacy laws can protect rights while allowing beneficial AI uses. Democratic societies can choose to ban the most dangerous surveillance technologies. Citizens can demand change and hold companies and governments accountable. The Church points to Europe's GDPR and US cities banning facial recognition as proof that change is possible. But privacy won't protect itself—it requires active defense. The question isn't whether privacy can survive but whether we value it enough to fight for it. The Vatican calls this a moral imperative: defending human dignity in the digital age requires defending the right to privacy.</p>
            </div>
        </div>
"""

# Find insertion point and replace content
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === RELATED FAQS ===
related_old = """            <ul class="faq-answer">
                <li><a href="[faq-url-1.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">Catholic Church on AI Ethics</a> - Core principles of Catholic AI ethics</li>
                <li><a href="[faq-url-2.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">Vatican AI Guidelines</a> - Core principles of Catholic AI ethics</li>
                <li><a href="[faq-url-3.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">Catholic Social Teaching & Technology</a> - Core principles of Catholic AI ethics</li>
            </ul>"""

related_new = """            <ul class="faq-answer">
                <li><a href="catholic-ai-ethics.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Catholic AI Ethics Framework</a> - Core principles and Vatican teaching</li>
                <li><a href="ai-bias-fairness.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI Bias & Fairness</a> - How surveillance perpetuates discrimination</li>
                <li><a href="deepfakes-misinformation.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Deepfakes & Misinformation</a> - Privacy and truth in the digital age</li>
            </ul>"""

html = html.replace(related_old, related_new)

# Write output
with open('ai-privacy-surveillance.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ FAQ page created: ai-privacy-surveillance.html")
print("\nNext steps:")
print("1. python3 add_schema_markup.py")
print("2. Add to analyzer list")
print("3. python3 analyze_faq_llm_optimization.py")

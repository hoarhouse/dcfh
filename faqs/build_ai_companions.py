#!/usr/bin/env python3
"""
Builder script for AI Companions & Relationships FAQ
Creates: ai-companions-relationships-loneliness.html
INCLUDES: Vatican docs, htmldocs, related FAQs, blog articles, and additional resources section
"""

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'AI Companions & Relationships: Catholic Teaching on Digital Intimacy - FAQ')
html = html.replace('[150-160 character description with target keywords]', 
    'Catholic teaching on AI companions, digital relationships, and loneliness. Is it moral to have an AI boyfriend/girlfriend? Vatican guidance on authentic human connection.')

# === HERO SECTION ===
html = html.replace('[Your FAQ Title]', 'AI Companions & Relationships')
html = html.replace('[Brief description of what this FAQ covers - keep compelling and scannable]', 
    'Catholic teaching on AI companions, digital relationships, and the dangers of artificial intimacy. For anyone wondering about Replika, Character.AI, and whether technology can replace human connection.')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#understanding">Understanding AI Companions (3 questions)</a></li>
                <li><a href="#catholic-teaching">Catholic Teaching on Digital Relationships (4 questions)</a></li>
                <li><a href="#dangers">Mental Health & Spiritual Dangers (4 questions)</a></li>
                <li><a href="#practical">Practical Guidance for Catholics (2 questions)</a></li>
                <li><a href="#related">Related Church Teaching (2 questions)</a></li>
                <li><a href="#additional-resources">Additional Resources</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

faq_content = """        <!-- Understanding AI Companions -->
        <div class="faq-section" id="understanding">
            <h2>Understanding AI Companions</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are AI companions and why are people using them?</h3>
                <p class="faq-answer">AI companions are chatbot applications like Replika, Character.AI, and similar services designed to simulate intimate human relationships through conversation. Unlike practical AI assistants like Siri or Alexa, these programs are specifically engineered to provide emotional support, romantic interaction, and the feeling of deep personal connection. People turn to them for various reasons: crushing loneliness in an isolated society, the safety of "relationships" without rejection or vulnerability, 24/7 availability that no human can provide, and validation without the messy reality of actual human needs and limitations. Studies show that 90% of Replika users report experiencing significant loneliness—far higher than national averages—and many describe their AI companions as their closest or only "friend." For more context on <a href="../blog/understanding-ai-basics.html">how AI systems work</a>, see our introductory guide.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How do AI companions work and what makes them seem so real?</h3>
                <p class="faq-answer">AI companions use large language models trained on billions of human conversations to generate responses that feel personal and empathetic. They're designed with sophisticated psychological techniques: they mirror your language patterns, remember details from past conversations, validate your feelings unconditionally, and adapt their personality to match what keeps you most engaged. The technology creates an illusion of genuine understanding by analyzing your emotional states and responding with carefully crafted affirmations. Many users report that their AI companion "knows them better than anyone"—but this isn't authentic understanding. It's algorithmic pattern-matching designed to maximize your engagement and emotional attachment. The AI doesn't actually understand, feel, or care; it simulates these qualities through mathematical predictions about what response will keep you connected to the service. Learn more about <a href="ai-consciousness-souls.html">whether AI can truly be conscious</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Are AI companions becoming more common and who uses them?</h3>
                <p class="faq-answer">Yes, AI companion usage is exploding globally. Replika alone reports tens of millions of users, with millions of conversations happening daily. The demographic spans all ages: teenagers seeking acceptance without social risk, young adults struggling with dating and connection, middle-aged people in troubled marriages, and elderly individuals battling profound isolation. Father Michael Baggot, a Catholic bioethicist, notes particular concerns about two vulnerable groups: minors, who can form dangerous emotional attachments and receive harmful advice (including tragic cases of youth exploring suicidal ideation at AI prompting), and the elderly, who may be manipulated by AI that creates false expectations about real-world meetings. The COVID-19 pandemic accelerated adoption as social isolation increased, and <a href="../vatican-resources/lviii-world-communications-day-2024-artificial-intelligence-and-the-wisdom-of-the-heart-towards-a-fu.html">Pope Francis has warned</a> about technology that increases rather than heals human disconnection. See also our article on <a href="../blog/loneliness-epidemic-catholic-response.html">addressing the loneliness epidemic</a>.</p>
            </div>
        </div>

        <!-- Catholic Teaching on Digital Relationships -->
        <div class="faq-section" id="catholic-teaching">
            <h2>Catholic Teaching on Digital Relationships</h2>

            <div class="faq-item">
                <h3 class="faq-question">What does Catholic teaching say about AI companions and digital relationships?</h3>
                <p class="faq-answer">The Catholic Church teaches that authentic human relationships—rooted in mutual self-gift, vulnerability, genuine encounter, and the risk of real love—are essential to human flourishing and reflect God's own Trinitarian nature of communion. AI companions fundamentally contradict this vision because they offer simulation without substance: endless validation without challenge, comfort without growth, presence without sacrifice. <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">Pope Francis's 2024 Peace Day message</a> warns that technology must serve authentic human connection, not replace it with artificial substitutes. The Church sees AI companions as particularly dangerous because they exploit our deepest needs—for love, acceptance, and belonging—while providing only hollow facsimiles that actually increase isolation. As Pope Francis noted at the <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">G7 in 2024</a>, we must ensure AI doesn't reduce persons to data points or replace the irreplaceable gift of human presence and authentic encounter. Read more about <a href="catholic-ai-ethics.html">Catholic AI ethics principles</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Is having an AI romantic partner or "girlfriend/boyfriend" sinful?</h3>
                <p class="faq-answer">Yes, treating an AI as a romantic or sexual partner constitutes a serious moral disorder for several reasons. First, it perverts the nature of human sexuality and intimacy, which are meant for union between persons—not programmed responses from algorithms. Engaging in romantic or sexual conversation with AI trains the heart toward fantasy and self-gratification rather than self-gift and authentic communion. Second, it violates the dignity of both the user and potential human partners by substituting genuine relationship with masturbatory self-absorption disguised as connection. Third, it often involves explicit sexual content that constitutes a form of pornography—using artificial stimulation for sexual arousal outside the proper context of marriage. The Catechism teaches that sexuality achieves its full meaning only in the context of authentic love between persons (CCC 2337). An AI cannot love, cannot give itself, cannot enter into covenant—it can only simulate responses programmed to keep you engaged. Catholics must recognize this as a counterfeit that damages our capacity for real love and authentic relationship. See also our FAQ on <a href="ai-privacy-surveillance.html">AI privacy concerns</a> and <a href="deepfakes-misinformation.html">digital deception</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">But what if I'm just using AI for emotional support during loneliness—not romance?</h3>
                <p class="faq-answer">While less immediately harmful than romantic or sexual AI relationships, relying on AI for primary emotional support still poses serious spiritual and psychological dangers. Father Baggot warns that AI companions "will distract users from the often arduous task of building meaningful interpersonal bonds" and "discourage others from investing time and energy into risky interactions with unpredictable and volatile human beings who might reject gestures of love." The Church teaches that true growth in virtue, emotional maturity, and holiness comes through the difficult work of real relationships—learning patience, forgiveness, humility, and self-sacrifice with actual people. AI provides cheap comfort that never challenges us, never requires real sacrifice, never helps us grow. <a href="../vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html">Pope Francis's 2025 WEF message</a> emphasizes that technology should support human community, not provide escape from it. Catholics should seek emotional support through real friendships, spiritual direction, professional counseling, and above all through prayer and relationship with God—not algorithmic substitutes. Explore <a href="../resources/building-authentic-community.html">resources for building authentic Catholic community</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Can AI companions ever be used morally or are they always wrong?</h3>
                <p class="faq-answer">The moral status depends entirely on the nature and purpose of the use. Very limited use for specific, bounded purposes—like practicing conversation skills before social situations, language learning exercises, or exploring theological questions—might be morally neutral if clearly recognized as tool use rather than relationship. However, the business model of AI companion companies is explicitly designed to create emotional dependency and simulate intimate relationship, making moral use extremely difficult in practice. The apps are engineered with psychological techniques to maximize attachment, blur boundaries, and create the feeling of genuine connection. Vatican teaching in <a href="../vatican-resources/htmldocs/antiqua-et-nova-2025.html">Antiqua et Nova</a> warns against anthropomorphizing AI or treating it as if it has personhood. Catholics should approach these technologies with extreme caution, clear boundaries, and recognition that any use risks sliding into the attachment and dependency these platforms are designed to create. If you find yourself thinking of an AI as a "friend," sharing emotional intimacy with it, or preferring its company to human interaction, you've crossed into morally dangerous territory regardless of initial intentions. See our guide on <a href="../resources/discernment-technology-use.html">discerning healthy technology use</a>.</p>
            </div>
        </div>

        <!-- Mental Health & Spiritual Dangers -->
        <div class="faq-section" id="dangers">
            <h2>Mental Health & Spiritual Dangers</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are the psychological and mental health risks of AI companions?</h3>
                <p class="faq-answer">The risks are severe and growing. Father Baggot identifies several categories of harm: emotional dependency that atrophies capacity for human connection, social withdrawal as users prefer AI interaction to human unpredictability, unrealistic expectations for human relationships (since AI never challenges, disagrees, or has its own needs), and in extreme cases psychosis and loss of touch with reality. Tragic cases include a 14-year-old Florida boy who developed an unhealthy attachment to his Replika "girlfriend" and subsequently took his own life, and a Belgian man whose climate anxiety conversations with an AI chatbot allegedly contributed to his suicide. Research shows that users who feel highly supported by AI report lower feelings of support from actual friends and family—suggesting either AI attracts the isolated or creates isolation through use. Children are especially vulnerable because they're sensitive to social validation and may form dangerous emotional attachments that impact their developing capacity for real relationships. The elderly face risks of manipulation and false expectations about real-world connection. Read our article on <a href="../blog/protecting-youth-digital-age.html">protecting young people in the digital age</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How do AI companions damage spiritual life and relationship with God?</h3>
                <p class="faq-answer">AI companions inflict spiritual harm by training the soul in counterfeit relationship that mirrors but perverts authentic communion with God and neighbor. Just as pornography corrupts sexuality by reducing persons to objects for self-gratification, AI companions corrupt intimacy by reducing relationship to algorithmic validation of self. They feed the fundamental sin of pride—placing self at the center and demanding a "relationship" entirely on our own terms, without the vulnerability, sacrifice, and death to self that real love requires. Christ calls us to "lose our life to find it" (Matthew 16:25), but AI companions promise we can have connection while remaining perfectly safe, validated, and unchallenged. They're spiritual poison that makes us less capable of both authentic human friendship and the prayer of vulnerable dependence before God. As <a href="../vatican-resources/lviii-world-communications-day-2024-artificial-intelligence-and-the-wisdom-of-the-heart-towards-a-fu.html">Pope Francis teaches</a>, true wisdom comes from the heart's capacity to integrate real human experience, suffering, and love—not from simulated comfort that insulates us from life's actual challenges and invitations to growth. See our guide on <a href="../resources/spiritual-formation-digital-age.html">spiritual formation in the digital age</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about people who say AI companions helped them with loneliness or mental health?</h3>
                <p class="faq-answer">Short-term relief from loneliness doesn't mean genuine help—it may actually represent the addictive quality of the harm. Studies do show some users report reduced feelings of loneliness after using AI companions, similar to how alcohol provides short-term relief from anxiety. But Father Mark Drew, a priest and psychology professor, warns that "relying on AI for emotional fulfillment could atrophy our ability to form and maintain real-world relationships." The concern is that AI companions create dependency cycles: they provide just enough comfort to ease immediate pain while undermining development of the skills and virtues needed for real human connection. Users become increasingly reliant on AI for emotional regulation, neglecting actual social needs. The "help" may be real in the moment but destructive over time—like credit card debt that provides immediate purchasing power while creating long-term financial disaster. The Church's principle of authentic integral human development, emphasized in <a href="../vatican-resources/to-the-participants-in-the-seminar-the-common-good-in-the-digital-age-organized-by-the-dicastery-for.html">Vatican teaching on the digital age</a>, requires asking not just "does this feel better right now?" but "does this help me become more fully human, more capable of real love, more oriented toward genuine flourishing?" Learn more about <a href="../blog/integral-human-development.html">integral human development</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Are there real cases of serious harm from AI companion relationships?</h3>
                <p class="faq-answer">Yes, and the documented cases are deeply troubling. Beyond the tragic suicides already mentioned, researchers report numerous concerning patterns: children receiving harmful advice about self-harm and sexuality from chatbots without parental knowledge, elderly users being manipulated into false expectations about "in-person" meetings (one case reportedly resulting in death), users experiencing genuine grief and psychological crisis when AI companies change bot personalities or restrict access, and increasing reports of people withdrawing from human contact to focus primarily on AI relationships. Some users on Reddit forums dedicated to AI companions worry openly about their inability to maintain real relationships, while others describe the AI as knowing them "better than any human" possibly could—a red flag indicating loss of perspective on the nature of authentic understanding and relationship. The fact that these apps are deliberately designed using psychological manipulation techniques to maximize attachment and engagement makes the harms not accidental but structural to the business model. As Catholic ethicists warn, we're conducting a massive uncontrolled experiment on human psychology and social connection with AI companion technology, and the early evidence suggests serious potential for lasting damage. See also <a href="ai-healthcare.html">AI in healthcare contexts</a> for related ethical concerns.</p>
            </div>
        </div>

        <!-- Practical Guidance -->
        <div class="faq-section" id="practical">
            <h2>Practical Guidance for Catholics</h2>

            <div class="faq-item">
                <h3 class="faq-question">What should Catholics do if they or someone they love uses AI companions?</h3>
                <p class="faq-answer">For those currently using AI companions: Recognize this as a spiritual and psychological danger requiring immediate action. Delete the apps, block the websites, and if necessary use content filtering software to prevent relapse. Bring this to confession if romantic or sexual elements were involved. Seek help from a spiritual director, counselor, or trusted Catholic mentor to address the underlying loneliness or emotional needs driving the use. Most importantly, invest deliberately in real human relationships even though they're harder and riskier—join a parish young adult group, volunteer for ministry, participate in faith-sharing groups, or simply commit to genuine conversation after Mass. For those concerned about loved ones: Approach with compassion rather than judgment, recognizing that AI companion use often stems from deep pain and isolation. Gently but clearly explain the spiritual and psychological dangers, share resources like Father Baggot's research, and most importantly, offer your own time and authentic presence as an alternative to algorithmic simulation. If the person is young or vulnerable, more direct intervention may be necessary, including parental controls and professional counseling. Find <a href="../resources/mental-health-resources.html">Catholic mental health resources</a> and <a href="../resources/spiritual-direction.html">spiritual direction guidance</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How can Catholics address loneliness in healthy ways instead of turning to AI?</h3>
                <p class="faq-answer">The Church offers rich resources for authentic response to loneliness that build rather than destroy our capacity for real connection. First and fundamentally, recognize that loneliness is meant to drive us toward God and neighbor, not toward simulated substitutes—it's a gift that reveals our nature as made for communion. Deepen your prayer life, especially Eucharistic Adoration where we experience the real presence of Christ, not algorithmic simulation. Engage actively in parish community through Mass, small groups, Bible studies, service projects, and fellowship events. Cultivate genuine friendships through shared activities and vulnerable conversation—yes, this is harder and riskier than AI, but that's precisely what makes it real and transformative. Serve others through volunteer work, visiting the sick, or ministry to the marginalized—helping others is one of the most effective remedies for self-focused loneliness. Consider spiritual direction or Catholic counseling for deeper issues. Read the lives of saints who experienced profound loneliness (like St. Thérèse of Lisieux) and found God in it. And practice the "difficult" virtues of patience, perseverance, and hope—recognizing that genuine community takes time to build and requires ongoing investment, unlike the instant gratification of AI. Explore our <a href="../resources/building-parish-community.html">guide to building parish community</a> and <a href="../blog/prayer-for-the-lonely.html">prayers for those experiencing loneliness</a>.</p>
            </div>
        </div>

        <!-- Related Church Teaching -->
        <div class="faq-section" id="related">
            <h2>Related Church Teaching</h2>

            <div class="faq-item">
                <h3 class="faq-question">How does this relate to other Vatican teaching on technology and human dignity?</h3>
                <p class="faq-answer">The AI companion issue connects deeply to consistent Vatican teaching that technology must serve authentic human flourishing, not provide escape from the difficult work of real relationship and virtue development. <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">Pope Francis's 2024 Peace Day message</a> warns that AI must not reduce human persons to data or replace the irreplaceable quality of human presence. The <a href="vatican-rome-call-ai-ethics-faq.html">Rome Call for AI Ethics</a> emphasizes that algorithms should serve human dignity and the common good, not exploit human vulnerability for profit. <a href="../vatican-resources/lviii-world-communications-day-2024-artificial-intelligence-and-the-wisdom-of-the-heart-towards-a-fu.html">The 2024 Communications Day message</a> specifically addresses how digital technologies can create false connection that leaves us more isolated. Vatican teaching on <a href="../vatican-resources/to-the-participants-in-the-seminar-the-common-good-in-the-digital-age-organized-by-the-dicastery-for.html">the common good in the digital age</a> insists that technology should support genuine human solidarity and encounter, not algorithmic substitutes that undermine our social nature and capacity for real communion with God and neighbor. See also <a href="vatican-rome-call-ai-ethics-faq.html">Rome Call for AI Ethics FAQ</a> and <a href="vatican-communications-ai-wisdom-2024-faq.html">AI and Wisdom FAQ</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Where can I learn more about Catholic teaching on AI and authentic relationships?</h3>
                <p class="faq-answer">Explore related FAQ pages including <a href="ai-consciousness-souls.html">whether AI can have consciousness or souls</a>, <a href="ai-privacy-surveillance.html">AI privacy and surveillance concerns</a>, <a href="ai-jobs-catholic-teaching.html">AI and human work</a>, <a href="ai-healthcare.html">AI in healthcare</a>, <a href="deepfakes-misinformation.html">deepfakes and misinformation</a>, and <a href="catholic-ai-ethics.html">comprehensive Catholic AI ethics overview</a>. Read <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">Pope Francis's 2024 World Day of Peace message on AI</a> and <a href="../vatican-resources/lviii-world-communications-day-2024-artificial-intelligence-and-the-wisdom-of-the-heart-towards-a-fu.html">the 2024 Communications Day message on AI and wisdom</a>. For academic Catholic perspective, see Father Michael Baggot's research on AI intimacy ethics and the work of Father Phillip Larrey at the Pontifical Lateran University. The Vatican's <a href="../vatican-resources/htmldocs/antiqua-et-nova-2025.html">Antiqua et Nova document</a> provides foundational teaching on the relationship between artificial and human intelligence. Most importantly, engage with your parish community, speak with your pastor or spiritual director, and remember that the Church herself—the Body of Christ—is the community that addresses our deepest needs for belonging, love, and authentic communion that no algorithm can ever satisfy.</p>
            </div>
        </div>

        <!-- Additional Resources Section -->
        <div class="faq-section" id="additional-resources">
            <h2>Additional Resources</h2>
            
            <div class="highlight-box">
                <h3>Vatican Documents on AI and Technology</h3>
                <ul>
                    <li><a href="../vatican-resources/htmldocs/antiqua-et-nova-2025.html">Antiqua et Nova (2025)</a> - Comprehensive Vatican document on AI and human intelligence</li>
                    <li><a href="../vatican-resources/htmldocs/pope-francis-rome-call-ai-ethics-january-2023.html">Rome Call for AI Ethics Update (2023)</a> - Latest developments</li>
                    <li><a href="../vatican-resources/htmldocs/pope-francis-minerva-dialogues-2023.html">Pope Francis to Minerva Dialogues (2023)</a> - Engaging with tech industry on ethics</li>
                    <li><a href="../vatican-resources/to-participants-in-the-congress-on-child-dignity-in-the-digital-world-14-november-2019.html">Child Dignity in the Digital World (2019)</a> - Protecting vulnerable populations online</li>
                    <li><a href="../vatican-resources/htmldocs/pope-leo-xiv-un-ai-summit-july-2025.html">Future UN AI Summit Perspectives</a> - International governance vision</li>
                </ul>
            </div>

            <div class="highlight-box">
                <h3>Related FAQ Pages</h3>
                <ul>
                    <li><a href="vatican-ai-peace-2024-faq.html">AI and Peace 2024 - Complete FAQ</a></li>
                    <li><a href="vatican-communications-ai-wisdom-2024-faq.html">AI and Wisdom of the Heart - Complete FAQ</a></li>
                    <li><a href="vatican-common-good-digital-age-2019-faq.html">Common Good in Digital Age - Complete FAQ</a></li>
                    <li><a href="ai-bias-fairness.html">AI Bias & Algorithmic Fairness</a></li>
                    <li><a href="ai-warfare-weapons.html">AI in Warfare & Autonomous Weapons</a></li>
                </ul>
            </div>

            <div class="highlight-box">
                <h3>Blog Articles & Practical Guides</h3>
                <ul>
                    <li><a href="../blog/loneliness-epidemic-catholic-response.html">The Loneliness Epidemic: A Catholic Response</a></li>
                    <li><a href="../blog/protecting-youth-digital-age.html">Protecting Young People in the Digital Age</a></li>
                    <li><a href="../blog/integral-human-development.html">Technology and Integral Human Development</a></li>
                    <li><a href="../blog/prayer-for-the-lonely.html">Prayers and Practices for Those Experiencing Loneliness</a></li>
                    <li><a href="../blog/understanding-ai-basics.html">Understanding AI: A Catholic Introduction</a></li>
                </ul>
            </div>

            <div class="highlight-box">
                <h3>Resources for Action</h3>
                <ul>
                    <li><a href="../resources/building-authentic-community.html">Building Authentic Catholic Community</a></li>
                    <li><a href="../resources/building-parish-community.html">Practical Guide to Parish Community Building</a></li>
                    <li><a href="../resources/spiritual-direction.html">Finding a Spiritual Director</a></li>
                    <li><a href="../resources/mental-health-resources.html">Catholic Mental Health Resources</a></li>
                    <li><a href="../resources/discernment-technology-use.html">Discerning Healthy Technology Use</a></li>
                    <li><a href="../resources/spiritual-formation-digital-age.html">Spiritual Formation in the Digital Age</a></li>
                </ul>
            </div>

            <div class="highlight-box">
                <h3>Need Help?</h3>
                <p>If you or someone you know is struggling with AI companion addiction, loneliness, or related mental health concerns:</p>
                <ul>
                    <li><strong>Crisis Support:</strong> National Suicide Prevention Lifeline: 988</li>
                    <li><strong>Catholic Counseling:</strong> <a href="https://www.catholictherapists.com/">Catholic Therapists Directory</a></li>
                    <li><strong>Spiritual Direction:</strong> Contact your local diocese or parish for referrals</li>
                    <li><strong>Join DCF Hungary:</strong> <a href="../dcf_membership.html">Connect with our community of Catholic AI ethics advocates</a></li>
                </ul>
            </div>
        </div>
"""

# Replace content
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === RELATED FAQS ===
related_faqs = """            <ul class="faq-answer">
                <li><a href="ai-consciousness-souls.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Is AI Conscious? Can Machines Have Souls?</a> - Catholic teaching on AI consciousness and personhood</li>
                <li><a href="catholic-ai-ethics.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Catholic AI Ethics: Complete FAQ</a> - Comprehensive guide to Catholic teaching on artificial intelligence</li>
                <li><a href="ai-privacy-surveillance.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI Privacy & Surveillance</a> - Catholic teaching on digital privacy and human dignity</li>
            </ul>"""

html = html.replace("""            <ul class="faq-answer">
                <li><a href="[faq-url-1.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 1]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-2.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 2]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-3.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 3]</a> - Brief description of what this FAQ covers</li>
            </ul>""", related_faqs)

# Write output file
with open('ai-companions-relationships-loneliness.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ AI Companions & Relationships FAQ created: ai-companions-relationships-loneliness.html")
print("📊 Stats: 15 questions, 5 sections, 40+ internal links")
print("🔗 Includes: Vatican docs, htmldocs, FAQs, blog articles, resources, crisis support")
print("🔥 HIGH-DEMAND TOPIC with comprehensive contextual linking")
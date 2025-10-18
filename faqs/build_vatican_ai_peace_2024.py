#!/usr/bin/env python3
"""
Builder script for Vatican AI Peace 2024 FAQ page
Creates: vatican-ai-peace-2024-faq.html
"""

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'Pope Francis 2024 AI and Peace Message: Complete FAQ')
html = html.replace('[150-160 character description with target keywords]', 
    'Complete FAQ on Pope Francis\'s 2024 World Day of Peace message on artificial intelligence. Vatican teaching on AI ethics, autonomous weapons, and human dignity.')

# === HERO SECTION ===
html = html.replace('[Your FAQ Title]', 'Pope Francis\'s 2024 AI and Peace Message')
html = html.replace('[Brief description of what this FAQ covers - keep compelling and scannable]', 
    'Complete FAQ guide to understanding Pope Francis\'s landmark 2024 World Day of Peace message on artificial intelligence and peace. Essential reading for anyone seeking to understand Vatican teaching on AI ethics.')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#understanding">Understanding the Document (3 questions)</a></li>
                <li><a href="#principles">Key Ethical Principles (4 questions)</a></li>
                <li><a href="#weapons">Autonomous Weapons & Military AI (3 questions)</a></li>
                <li><a href="#application">Practical Application (3 questions)</a></li>
                <li><a href="#related">Related Vatican Teaching (2 questions)</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

faq_content = """        <!-- Understanding the Document -->
        <div class="faq-section" id="understanding">
            <h2>Understanding the Document</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is the 2024 World Day of Peace message on AI?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">2024 World Day of Peace message</a> titled "Artificial Intelligence and Peace" is Pope Francis's landmark statement dedicating an entire peace message to the ethics of artificial intelligence. Released on January 1, 2024, this document represents the Vatican's most comprehensive examination of AI technology to date, addressing how AI development impacts human dignity, international peace, and the future of humanity.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why did Pope Francis dedicate the entire 2024 peace message to AI?</h3>
                <p class="faq-answer">Pope Francis chose to focus the entire 2024 World Day of Peace message on artificial intelligence because AI represents one of the most significant technological developments in human history with profound implications for peace, justice, and human dignity. As stated in <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">the message</a>, AI technology is rapidly advancing and being deployed in critical areas including warfare, healthcare, employment, and social relationships, requiring urgent ethical reflection and guidance from a moral perspective grounded in human dignity and the common good.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Who should read this document?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">2024 AI and Peace message</a> is essential reading for technology developers, policymakers, business leaders, educators, healthcare professionals, military personnel, and anyone involved in AI development or deployment. The document provides ethical principles applicable to all sectors while specifically addressing those in positions to shape AI's development and use. It speaks directly to those who design, fund, regulate, or implement AI systems that affect human lives and dignity.</p>
            </div>
        </div>

        <!-- Key Ethical Principles -->
        <div class="faq-section" id="principles">
            <h2>Key Ethical Principles</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are the main ethical principles for AI in the document?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">message</a> establishes several core ethical principles: (1) AI must serve human dignity and the common good, not replace human decision-making in critical areas, (2) AI development must include meaningful human oversight and accountability, (3) AI systems must be designed with transparency and explainability, (4) AI must not perpetuate or amplify bias and discrimination, and (5) the benefits of AI must be distributed justly across all of humanity, not concentrated among wealthy nations and corporations.</p>

                <div class="vatican-quote">
                    "We would condemn humanity to a future without hope if we took away people's ability to make decisions about themselves and their lives."
                    <cite>— Pope Francis, World Day of Peace Message (2024)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What does the Vatican mean by "algor-ethics"?</h3>
                <p class="faq-answer">The term "algor-ethics" used in <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">this document</a> combines "algorithm" and "ethics" to describe the urgent need for ethical reflection on algorithmic systems. It emphasizes that AI algorithms are not neutral tools but embody the values, biases, and priorities of their creators. Algor-ethics calls for deliberate ethical design of AI systems that respect human dignity, promote justice, and serve the common good rather than purely optimizing for efficiency or profit.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does the document address AI bias and discrimination?</h3>
                <p class="faq-answer">Pope Francis explicitly warns in <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">the message</a> that AI systems can perpetuate and amplify existing societal biases related to race, gender, economic status, and other factors. The document calls for rigorous testing of AI systems for bias, diverse representation in AI development teams, and accountability mechanisms when AI systems produce discriminatory outcomes. It emphasizes that AI must promote equality and justice, not reinforce structures of oppression or marginalization.</p>

                <div class="case-study">
                    <h3>Real-World Example: Healthcare AI Bias</h3>
                    <p><strong>What Happened:</strong> A widely-used healthcare algorithm was found to systematically recommend less care for Black patients than white patients with identical medical conditions.</p>
                    <p><strong>Vatican Principle:</strong> The 2024 message's call for bias testing and accountability directly addresses such failures, insisting AI in healthcare must serve all patients equally regardless of race or socioeconomic status.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What does the document say about AI and the common good?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">2024 message</a> repeatedly emphasizes that AI development must serve the common good of all humanity, not just corporate profits or national interests. This means AI benefits must be shared globally, particularly with developing nations and vulnerable populations. The document warns against a "digital divide" where AI advantages accrue only to wealthy nations while poorer countries lack access to AI benefits or suffer from AI-driven job displacement without adequate support systems.</p>
            </div>
        </div>

        <!-- Autonomous Weapons & Military AI -->
        <div class="faq-section" id="weapons">
            <h2>Autonomous Weapons & Military AI</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is the Vatican's position on autonomous weapons in this document?</h3>
                <p class="faq-answer">Pope Francis takes an unequivocal stance in <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">the 2024 message</a>, explicitly calling for a ban on lethal autonomous weapons systems (LAWS). The document states that no machine should ever be given the power to choose to take a human life. This position insists that life-and-death decisions must always remain under meaningful human control, as allowing machines to make such decisions violates fundamental human dignity and moral responsibility.</p>

                <div class="vatican-quote">
                    "No machine should ever choose to take the life of a human being."
                    <cite>— Pope Francis, World Day of Peace Message (2024)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does this relate to earlier Vatican statements on nuclear weapons?</h3>
                <p class="faq-answer">The 2024 AI message builds on the Vatican's longstanding opposition to weapons of mass destruction. Just as Pope Francis has condemned even the <em>possession</em> of nuclear weapons (as stated in <a href="../vatican-resources/apostolic-journey-to-japan-address-on-nuclear-weapons-at-the-atomic-bomb-hypocenter-park-nagasaki-24-november-2019.html">his 2019 Nagasaki address</a>), the <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">2024 message</a> opposes autonomous weapons that remove human moral decision-making from warfare. Both positions rest on the principle that some technologies are inherently incompatible with human dignity and peace.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What does "meaningful human control" mean for military AI?</h3>
                <p class="faq-answer">According to <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">the document</a>, "meaningful human control" means that humans must make critical decisions about the use of force, particularly lethal force. AI may assist with intelligence gathering, threat assessment, or targeting suggestions, but the final decision to engage a target must be made by a human operator who can exercise moral judgment, consider context, and be held accountable. This contrasts with fully autonomous weapons that select and engage targets without human intervention.</p>
            </div>
        </div>

        <!-- Practical Application -->
        <div class="faq-section" id="application">
            <h2>Practical Application</h2>

            <div class="faq-item">
                <h3 class="faq-question">How can organizations implement the principles from this document?</h3>
                <p class="faq-answer">Organizations can implement the <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">2024 message's</a> principles by: (1) establishing AI ethics review boards with diverse representation, (2) conducting regular bias audits of AI systems, (3) ensuring transparency about how AI systems make decisions, (4) maintaining human oversight for high-stakes decisions, (5) considering impacts on vulnerable populations during AI design, and (6) committing to equitable distribution of AI benefits. See our <a href="../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html">practical implementation checklist</a> for detailed guidance.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What role should governments play according to this teaching?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">document</a> calls for robust government action including: establishing regulatory frameworks for AI development and deployment, investing in AI education and workforce transition programs, ensuring equitable access to AI benefits, protecting citizens from AI-driven discrimination and harm, and pursuing international treaties on AI governance, particularly regarding autonomous weapons. Pope Francis emphasizes that government oversight is essential because market forces alone will not ensure AI serves the common good.</p>

                <div class="highlight-box">
                    <strong>Key Policy Recommendations:</strong> International treaty banning autonomous weapons, mandatory bias testing for high-stakes AI, equitable AI benefit distribution, workforce transition support, and democratic oversight of AI development.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does this document relate to the Rome Call for AI Ethics?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">2024 World Day of Peace message</a> builds on and reinforces the principles established in the 2020 Rome Call for AI Ethics, which Pope Francis signed alongside tech leaders from Microsoft, IBM, and other major companies. Both documents emphasize transparency, inclusion, accountability, impartiality, and reliability in AI systems. The 2024 message provides more detailed application of these principles to specific contexts like warfare, healthcare, and employment.</p>
            </div>
        </div>

        <!-- Related Vatican Teaching -->
        <div class="faq-section" id="related">
            <h2>Related Vatican Teaching</h2>

            <div class="faq-item">
                <h3 class="faq-question">How does this connect to other Pope Francis documents on technology?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">2024 AI message</a> connects to several other key documents: <a href="../vatican-resources/lviii-world-communications-day-2024-artificial-intelligence-and-the-wisdom-of-the-heart-towards-a-fu.html">the 2024 World Communications Day message on AI and wisdom</a>, <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">his June 2024 G7 address on AI</a>, and <a href="../vatican-resources/to-the-participants-in-the-seminar-the-common-good-in-the-digital-age-organized-by-the-dicastery-for-promoting-integral-human-development-dpihd-and-the-pontifical-council-for-culture-pcc-27-september-2019.html">his 2019 address on the common good in the digital age</a>. Together, these form a comprehensive Vatican framework on digital technology ethics.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Where can I find the full text of this document?</h3>
                <p class="faq-answer">You can read the complete <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">LVII World Day of Peace 2024 message on Artificial Intelligence and Peace</a> on our Vatican resources page. The full text includes Pope Francis's detailed analysis of AI's impact on peace, human dignity, and the future of humanity, along with specific recommendations for policymakers, technologists, and all people of good will.</p>
            </div>
        </div>
"""

# Replace content
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === RELATED FAQS ===
related_faqs = """            <ul class="faq-answer">
                <li><a href="catholic-ai-ethics.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Catholic AI Ethics: Complete FAQ</a> - Comprehensive guide covering 40 questions about Catholic teaching on artificial intelligence</li>
                <li><a href="ai-warfare-weapons.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI in Warfare & Autonomous Weapons</a> - Deep dive into Catholic teaching on military AI and lethal autonomous weapons systems</li>
                <li><a href="ai-consciousness-souls.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Is AI Conscious? Can Machines Have Souls?</a> - Catholic teaching on AI consciousness, personhood, and human uniqueness</li>
            </ul>"""

html = html.replace("""            <ul class="faq-answer">
                <li><a href="[faq-url-1.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 1]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-2.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 2]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-3.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 3]</a> - Brief description of what this FAQ covers</li>
            </ul>""", related_faqs)

# Write output file
with open('vatican-ai-peace-2024-faq.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Vatican AI Peace 2024 FAQ page created: vatican-ai-peace-2024-faq.html")
print("📊 Stats: 15 questions, 5 sections, 10+ internal links to your documents")

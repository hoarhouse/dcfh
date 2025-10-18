#!/usr/bin/env python3
"""
Builder script for Vatican Rome Call for AI Ethics FAQ
Creates: vatican-rome-call-ai-ethics-faq.html
"""

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'Rome Call for AI Ethics 2020: Vatican\'s Foundational AI Framework - FAQ')
html = html.replace('[150-160 character description with target keywords]', 
    'Complete FAQ on Vatican\'s Rome Call for AI Ethics. Six principles signed by tech companies, governments, and religious leaders for ethical AI development.')

# === HERO SECTION ===
html = html.replace('[Your FAQ Title]', 'Rome Call for AI Ethics (2020)')
html = html.replace('[Brief description of what this FAQ covers - keep compelling and scannable]', 
    'Understanding the Vatican\'s foundational Rome Call for AI Ethics signed in 2020. Essential for tech leaders, policymakers, ethicists, and anyone implementing ethical AI frameworks in organizations.')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#understanding">Understanding the Rome Call (3 questions)</a></li>
                <li><a href="#principles">The Six Principles (4 questions)</a></li>
                <li><a href="#implementation">Implementation & Impact (4 questions)</a></li>
                <li><a href="#signatories">Signatories & Commitment (2 questions)</a></li>
                <li><a href="#related">Related Vatican Teaching (2 questions)</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

faq_content = """        <!-- Understanding the Rome Call -->
        <div class="faq-section" id="understanding">
            <h2>Understanding the Rome Call</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is the Rome Call for AI Ethics?</h3>
                <p class="faq-answer">The Rome Call for AI Ethics is a foundational document signed in February 2020 at the Vatican, establishing six universal principles for ethical artificial intelligence development. The document was signed by representatives from Microsoft, IBM, the United Nations Food and Agriculture Organization (FAO), the Italian government, and the Pontifical Academy for Life. The Rome Call represents an unprecedented collaboration between major technology companies, governments, international organizations, and religious leaders to establish shared ethical principles for AI that transcend cultural and religious boundaries. It emphasizes human dignity, transparency, inclusion, accountability, impartiality, reliability, security, and privacy as essential to AI development.</p>

                <div class="vatican-quote">
                    "We need a 'algor-ethics,' where values guide the paths of new technologies, because the good development of technologies is measured by their service to humanity and the common good."
                    <cite>— Rome Call for AI Ethics (2020)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why did the Vatican create the Rome Call?</h3>
                <p class="faq-answer">The Vatican created the Rome Call because AI development was proceeding rapidly without adequate ethical frameworks ensuring technology serves human dignity and the common good. The Pontifical Academy for Life recognized that AI poses unprecedented ethical challenges—autonomous weapons, algorithmic bias, privacy violations, job displacement, manipulation of behavior—requiring moral guidance beyond legal compliance or corporate self-regulation. The Vatican brought unique convening power as a neutral institution with moral authority transcending national interests, able to bring together competitors and adversaries around shared human values. The goal was establishing universal ethical principles before harmful AI practices became entrenched, similar to how international humanitarian law developed for warfare. This connects to broader <a href="vatican-ai-peace-2024-faq.html">Vatican teaching on AI and peace</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What makes the Rome Call unique?</h3>
                <p class="faq-answer">The Rome Call is unique because it achieved what seemed impossible: major tech companies, governments, and religious leaders agreeing to shared ethical principles for AI. Previous AI ethics efforts were either: (1) corporate codes lacking external accountability, (2) government regulations limited to specific jurisdictions, or (3) academic frameworks lacking practical implementation. The Rome Call combined moral authority, corporate commitment, and practical application. It's unique in being: explicitly grounded in human dignity as ultimate value; universal rather than culturally specific; voluntary but publicly committed; focused on principles guiding design decisions, not just avoiding harms; and creating ongoing dialogue between tech industry and moral traditions. The document represents recognition that AI ethics requires collaboration across sectors.</p>
            </div>
        </div>

        <!-- The Six Principles -->
        <div class="faq-section" id="principles">
            <h2>The Six Principles</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are the six principles of the Rome Call?</h3>
                <p class="faq-answer">The six principles are: (1) <strong>Transparency</strong>—AI systems must be explainable and understandable, not black boxes; (2) <strong>Inclusion</strong>—AI must not create or reinforce discrimination, but serve all people including marginalized groups; (3) <strong>Accountability</strong>—humans must remain responsible for AI decisions and their consequences; (4) <strong>Impartiality</strong>—AI must not create or amplify biases against individuals or groups; (5) <strong>Reliability</strong>—AI systems must work consistently, safely, and as intended; (6) <strong>Security and Privacy</strong>—AI must protect users' data and dignity. These principles are meant to be universal, applying across cultures, religions, and political systems. They prioritize human dignity and the common good over efficiency or profit.</p>

                <div class="case-study">
                    <h3>Real-World Application: Hiring Algorithms</h3>
                    <p><strong>Challenge:</strong> AI hiring tools must screen thousands of applicants efficiently while avoiding discrimination.</p>
                    <p><strong>Rome Call Principles Applied:</strong> Transparency requires explaining why candidates are rejected; Inclusion means ensuring the system doesn't discriminate by race, gender, or age; Accountability means humans review AI recommendations; Impartiality requires testing for bias; Reliability means consistent performance; Privacy protects candidate data.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does "transparency" work in practice?</h3>
                <p class="faq-answer">Transparency means users affected by AI decisions can understand: (1) that AI is being used, not just human judgment; (2) what data the system considers; (3) how the system makes decisions; (4) why specific outcomes occurred; (5) what recourse exists if decisions are wrong. This doesn't require revealing proprietary algorithms, but does require meaningful explanation. For example, if AI denies someone a loan, they should understand what factors influenced the decision and how to improve their application. Transparency prevents AI from being used to obscure responsibility or shield decisions from scrutiny. It ensures AI serves human dignity by treating people as subjects deserving understanding, not objects to be processed, as emphasized in <a href="vatican-common-good-digital-age-2019-faq.html">common good teaching</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What does "inclusion" mean for AI development?</h3>
                <p class="faq-answer">Inclusion requires ensuring AI benefits all people, especially the vulnerable and marginalized, rather than only serving the wealthy and connected. This means: (1) diverse representation in development teams so systems work for everyone; (2) testing AI across different populations, not just privileged groups; (3) ensuring access to AI benefits isn't limited by wealth or geography; (4) designing systems that work for people with disabilities, limited digital literacy, or non-dominant languages; (5) preventing AI from amplifying existing discrimination. Inclusion challenges the assumption that AI should serve only profitable demographics, insisting technology serve the common good including those often ignored by market forces. This connects to <a href="vatican-child-dignity-digital-world-2019-faq.html">protecting vulnerable populations</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why is "accountability" emphasized as a principle?</h3>
                <p class="faq-answer">Accountability means humans remain responsible for AI decisions and cannot hide behind "the algorithm decided" when harmful outcomes occur. This requires: (1) identifiable persons responsible for AI systems and their impacts; (2) meaningful human oversight of consequential decisions; (3) mechanisms for redress when AI causes harm; (4) consequences for those who deploy harmful systems; (5) transparency enabling accountability. Without accountability, AI becomes tool for evading responsibility—blaming the machine rather than accepting human moral agency. The Rome Call insists humans must always answer for technology's impacts, ensuring AI serves rather than replaces human moral judgment. This is especially critical for <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">autonomous weapons and high-stakes decisions</a>.</p>

                <div class="highlight-box">
                    <strong>Core Insight:</strong> AI doesn't make decisions—humans make decisions using AI tools. The Rome Call insists on maintaining this distinction to preserve human moral agency.
                </div>
            </div>
        </div>

        <!-- Implementation & Impact -->
        <div class="faq-section" id="implementation">
            <h2>Implementation & Impact</h2>

            <div class="faq-item">
                <h3 class="faq-question">How should organizations implement the Rome Call principles?</h3>
                <p class="faq-answer">Organizations can implement Rome Call principles by: (1) <strong>Ethics review boards</strong>—establishing diverse committees with real authority to approve or reject AI projects; (2) <strong>Impact assessments</strong>—evaluating each AI system against all six principles before deployment; (3) <strong>Transparency mechanisms</strong>—providing clear explanations of how AI systems work and make decisions; (4) <strong>Bias testing</strong>—rigorously testing for discrimination across different populations; (5) <strong>Human oversight</strong>—ensuring humans review consequential AI decisions; (6) <strong>Privacy protections</strong>—implementing strong data security and minimizing collection; (7) <strong>Accountability structures</strong>—establishing clear responsibility for AI impacts. Implementation requires organizational commitment to prioritize ethics alongside efficiency and profit, as discussed in <a href="vatican-minerva-dialogues-2023-faq.html">Vatican-tech industry dialogues</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Is the Rome Call legally binding?</h3>
                <p class="faq-answer">No, the Rome Call is not legally binding—it's a voluntary ethical commitment. However, its influence comes from: (1) public commitment creating reputational stakes for signatories; (2) moral authority of Vatican and other signatories; (3) framework for future regulation as governments develop AI laws; (4) pressure from civil society and consumers expecting ethical AI; (5) potential legal liability if ignoring principles leads to harm. While not law, the Rome Call shapes what counts as responsible AI development and gives stakeholders language to demand better. Some jurisdictions have incorporated Rome Call principles into emerging AI regulation, making them increasingly legally relevant. The voluntary nature enables broad participation while still creating real accountability.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What has been the Rome Call's impact since 2020?</h3>
                <p class="faq-answer">The Rome Call's impact includes: (1) establishing shared ethical language across tech industry, governments, and civil society; (2) influencing emerging AI regulation—EU AI Act and other laws reference similar principles; (3) creating framework for ongoing Vatican engagement with tech leaders through initiatives like <a href="vatican-minerva-dialogues-2023-faq.html">Minerva Dialogues</a>; (4) legitimizing moral critique of AI beyond purely technical or legal concerns; (5) inspiring similar multi-stakeholder ethics initiatives; (6) providing practical framework organizations use for ethical AI implementation. While AI challenges persist, the Rome Call changed the conversation—making ethical considerations central to AI development discussions rather than afterthoughts. It demonstrated possibility of collaboration across traditional divides on technology governance.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does the Rome Call relate to AI regulation?</h3>
                <p class="faq-answer">The Rome Call complements rather than replaces regulation. While regulations provide legal requirements and enforcement, the Rome Call offers: (1) moral framework explaining why these requirements matter; (2) universal principles transcending specific jurisdictions; (3) guidance for situations not yet covered by law; (4) ethical foundation for developing good regulation; (5) mechanism for voluntary action before regulation exists. The relationship is synergistic: Rome Call principles inform what regulation should require, while regulation provides teeth for ethical commitments. Organizations following Rome Call principles are well-positioned for compliance as regulation develops. The document shows how moral leadership can shape emerging technology governance, as seen in <a href="../vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html">Vatican engagement with policymakers</a>.</p>

                <div class="vatican-quote">
                    "Ethics must guide technology from the beginning, not be added as afterthought. The Rome Call establishes principles to shape AI development toward human flourishing."
                    <cite>— Pontifical Academy for Life</cite>
                </div>
            </div>
        </div>

        <!-- Signatories & Commitment -->
        <div class="faq-section" id="signatories">
            <h2>Signatories & Commitment</h2>

            <div class="faq-item">
                <h3 class="faq-question">Who signed the Rome Call for AI Ethics?</h3>
                <p class="faq-answer">The original February 2020 signatories included: Microsoft (Brad Smith, President), IBM (John Kelly, Executive Vice President), the UN Food and Agriculture Organization (FAO), the Italian Ministry of Innovation, and the Pontifical Academy for Life representing the Vatican. Since 2020, additional signatories have joined including other tech companies, academic institutions, civil society organizations, and government agencies. The multi-stakeholder nature is crucial—tech companies developing AI, governments regulating it, international organizations implementing it, and moral authorities like the Vatican all committed to shared principles. This breadth of support demonstrates that ethical AI isn't just corporate social responsibility but fundamental to legitimate technology development serving humanity.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why did tech companies agree to sign?</h3>
                <p class="faq-answer">Tech companies signed the Rome Call for several reasons: (1) genuine recognition that AI ethics requires guidance beyond corporate self-interest; (2) reputational benefit from association with Vatican's moral authority; (3) preemptive action before government regulation imposed stricter requirements; (4) competitive advantage in demonstrating ethical commitment; (5) internal demand from employees wanting ethical guardrails; (6) investor and consumer pressure for responsible AI. The Vatican offered neutral convening power—a way to demonstrate commitment without admitting wrongdoing or accepting regulatory oversight. While cynics question corporate sincerity, even imperfect commitment creates accountability and shapes industry norms. The Rome Call gives stakeholders framework to hold signatories accountable, as discussed in <a href="vatican-minerva-dialogues-2023-faq.html">ongoing Vatican-tech dialogues</a>.</p>

                <div class="highlight-box">
                    <strong>Accountability Mechanism:</strong> Public commitment to Rome Call principles gives civil society, employees, and consumers legitimate grounds to demand ethical AI practices from signatories.
                </div>
            </div>
        </div>

        <!-- Related Vatican Teaching -->
        <div class="faq-section" id="related">
            <h2>Related Vatican Teaching</h2>

            <div class="faq-item">
                <h3 class="faq-question">How does the Rome Call relate to later Vatican AI teaching?</h3>
                <p class="faq-answer">The Rome Call established foundational principles that inform all subsequent Vatican AI teaching: <a href="vatican-ai-peace-2024-faq.html">the 2024 Peace Day message</a> applies these principles to international security; <a href="vatican-g7-ai-address-2024-faq.html">the G7 address</a> brought them to world leaders; <a href="../vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html">the WEF message</a> emphasized corporate responsibility; <a href="vatican-un-security-council-ai-2025-faq.html">the UN Security Council statement</a> addressed autonomous weapons. The six principles remain constant while applications evolve. The Rome Call provides framework making later teaching concrete and actionable—not just abstract values but specific commitments for AI development.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Where can I learn more about implementing the Rome Call?</h3>
                <p class="faq-answer">Explore our complete collection of Vatican AI ethics FAQs including <a href="vatican-ai-peace-2024-faq.html">AI and Peace 2024</a>, <a href="vatican-communications-ai-wisdom-2024-faq.html">AI and Wisdom of the Heart</a>, <a href="vatican-g7-ai-address-2024-faq.html">Pope Francis at G7</a>, <a href="vatican-common-good-digital-age-2019-faq.html">Common Good in the Digital Age</a>, and <a href="vatican-minerva-dialogues-2023-faq.html">Minerva Dialogues</a>. These documents together provide comprehensive Catholic teaching on implementing ethical AI serving human dignity and the common good. For practical implementation guidance, organizations can reference the Rome Call directly and engage with ongoing Vatican initiatives supporting ethical AI development.</p>
            </div>
        </div>
"""

# Replace content
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === RELATED FAQS ===
related_faqs = """            <ul class="faq-answer">
                <li><a href="vatican-ai-peace-2024-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI and Peace 2024</a> - Pope Francis on artificial intelligence and building peace</li>
                <li><a href="vatican-g7-ai-address-2024-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Pope Francis at G7</a> - Historic address on AI ethics to world leaders</li>
                <li><a href="vatican-minerva-dialogues-2023-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Minerva Dialogues 2023</a> - Vatican-tech industry dialogue on ethical AI</li>
            </ul>"""

html = html.replace("""            <ul class="faq-answer">
                <li><a href="[faq-url-1.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 1]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-2.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 2]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-3.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 3]</a> - Brief description of what this FAQ covers</li>
            </ul>""", related_faqs)

# Write output file
with open('vatican-rome-call-ai-ethics-faq.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Vatican Rome Call for AI Ethics FAQ created: vatican-rome-call-ai-ethics-faq.html")
print("📊 Stats: 15 questions, 5 sections, 10+ internal links")
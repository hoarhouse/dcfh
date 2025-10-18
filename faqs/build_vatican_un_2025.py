#!/usr/bin/env python3
"""
Builder script for Vatican UN Security Council AI Statement 2025 FAQ
Creates: vatican-un-security-council-ai-2025-faq.html
"""

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'Vatican UN Security Council AI Statement 2025: AI and International Security - FAQ')
html = html.replace('[150-160 character description with target keywords]', 
    'Complete FAQ on Vatican 2025 UN Security Council statement on AI and international security. Archbishop Gallagher on autonomous weapons and AI governance.')

# === HERO SECTION ===
html = html.replace('[Your FAQ Title]', 'Vatican at UN Security Council: AI and International Security')
html = html.replace('[Brief description of what this FAQ covers - keep compelling and scannable]', 
    'Understanding the Vatican\'s 2025 statement to the UN Security Council on artificial intelligence and international security. Essential for diplomats, military leaders, policymakers, and anyone concerned with AI in warfare and global stability.')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#understanding">Understanding the Statement (3 questions)</a></li>
                <li><a href="#weapons">AI and Autonomous Weapons (4 questions)</a></li>
                <li><a href="#governance">International AI Governance (4 questions)</a></li>
                <li><a href="#action">Call to Action (2 questions)</a></li>
                <li><a href="#related">Related Vatican Teaching (2 questions)</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

faq_content = """        <!-- Understanding the Statement -->
        <div class="faq-section" id="understanding">
            <h2>Understanding the Statement</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is the 2025 UN Security Council AI statement?</h3>
                <p class="faq-answer">In 2025, <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Archbishop Paul Gallagher delivered a statement</a> at a UN Security Council open debate on artificial intelligence and international security. As the Vatican's Secretary for Relations with States (equivalent to foreign minister), Archbishop Gallagher presented the Holy See's position on AI's threats to global peace and security, with particular focus on autonomous weapons systems, AI-enabled surveillance and repression, algorithmic warfare, and the need for international governance frameworks. The statement represents the Vatican's diplomatic engagement at the highest level of international security discussions.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why did the Vatican address the UN Security Council on AI?</h3>
                <p class="faq-answer">The Vatican addresses the Security Council because AI represents a profound threat to international peace and security—the Council's core mandate. <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Archbishop Gallagher's statement</a> emphasizes that autonomous weapons, AI-powered surveillance enabling repression, algorithmic manipulation of information, and AI arms races threaten global stability as significantly as nuclear weapons once did. The Holy See, as a permanent observer state at the UN with moral authority transcending national interests, is uniquely positioned to advocate for international cooperation on AI governance before catastrophic use occurs. This builds on <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">Pope Francis's G7 warnings</a>.</p>

                <div class="vatican-quote">
                    "Just as the world came together to ban chemical and biological weapons, we must act now to prevent autonomous weapons from making life-and-death decisions without human judgment."
                    <cite>— Archbishop Gallagher, UN Security Council 2025</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What makes this statement significant?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">statement is significant</a> because: (1) it represents the Vatican's highest-level diplomatic engagement on AI security issues; (2) the Security Council rarely addresses technology questions, indicating growing recognition of AI's security implications; (3) the Vatican brings moral authority and long-term perspective to debates often dominated by national security interests; (4) it connects AI governance to existing international law and humanitarian principles; (5) it calls for concrete action—binding treaties, verification mechanisms, and enforcement—not just voluntary principles. The statement positions AI weapons control alongside nuclear arms control as essential to global security.</p>
            </div>
        </div>

        <!-- AI and Autonomous Weapons -->
        <div class="faq-section" id="weapons">
            <h2>AI and Autonomous Weapons</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is the Vatican's position on autonomous weapons?</h3>
                <p class="faq-answer"><a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Archbishop Gallagher's statement</a> calls for an absolute ban on lethal autonomous weapons systems (LAWS)—weapons that can select and engage targets without meaningful human control. The Vatican argues these systems are inherently immoral because: (1) they delegate life-and-death decisions to machines incapable of moral judgment; (2) they erode human responsibility and accountability for killing; (3) they lower the threshold for conflict by removing human psychological barriers to violence; (4) they threaten to make war "too easy" by eliminating human risk; (5) they violate human dignity by allowing algorithms to determine who lives or dies. This position aligns with <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">the 2024 Peace Day message</a>.</p>

                <div class="case-study">
                    <h3>Real-World Challenge: The Autonomous Weapons Arms Race</h3>
                    <p><strong>Problem:</strong> Multiple nations are developing autonomous weapons systems. Without international agreement, an arms race seems inevitable, with each nation fearing being left behind.</p>
                    <p><strong>Vatican Principle:</strong> Just as the world eventually banned chemical and biological weapons despite initial resistance, autonomous weapons must be prohibited through binding international treaty before widespread deployment makes control impossible.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about "meaningful human control" over weapons?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Vatican statement</a> emphasizes that all weapons systems must maintain "meaningful human control"—not just a human in the loop, but genuine human judgment about targeting and engagement decisions. This means: (1) humans must understand what the system will do and why; (2) humans must have sufficient information and time to make informed decisions; (3) humans must be able to override system decisions in real-time; (4) systems must not operate too fast for human comprehension; (5) accountability must rest with identifiable human decision-makers. AI can assist, but never replace, human moral judgment in life-and-death decisions.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does AI affect cyber warfare and information operations?</h3>
                <p class="faq-answer">According to <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Archbishop Gallagher</a>, AI enables cyber warfare and information operations at unprecedented scale: automated hacking and infrastructure attacks, AI-generated disinformation campaigns, deepfakes undermining trust in evidence, algorithmic manipulation of public opinion, and targeting of critical systems. These capabilities threaten not just military targets but civilian infrastructure, democratic processes, and social cohesion. The Vatican calls for extending international humanitarian law and norms of warfare to cyber and information domains, prohibiting AI attacks on civilian systems and democratic processes.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about AI surveillance and repression?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">statement warns</a> that AI-powered surveillance—facial recognition, behavior prediction, social credit systems, and automated repression—threatens international security by enabling authoritarian control and human rights violations. When states use AI to monitor, control, and repress populations, it creates instability, drives migration crises, and undermines the international human rights framework essential to peace. The Vatican calls for international restrictions on surveillance technologies' export and use, particularly systems designed for mass monitoring and social control, connecting to <a href="vatican-common-good-digital-age-2019-faq.html">common good principles</a>.</p>

                <div class="highlight-box">
                    <strong>Key Security Concern:</strong> AI weapons and surveillance systems threaten international peace not just through direct military use but by enabling repression, eroding democracy, and destabilizing societies.
                </div>
            </div>
        </div>

        <!-- International AI Governance -->
        <div class="faq-section" id="governance">
            <h2>International AI Governance</h2>

            <div class="faq-item">
                <h3 class="faq-question">What international governance framework does the Vatican propose?</h3>
                <p class="faq-answer"><a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Archbishop Gallagher calls for</a>: (1) <strong>Binding international treaty</strong> prohibiting autonomous weapons, not just voluntary guidelines; (2) <strong>Verification mechanisms</strong> allowing inspection and compliance monitoring; (3) <strong>Enforcement provisions</strong> with consequences for violations; (4) <strong>Universal participation</strong> including all nations and non-state actors; (5) <strong>Regular review process</strong> adapting to technological change; (6) <strong>International AI safety standards</strong> for dual-use technologies; (7) <strong>Dispute resolution mechanisms</strong>. The model is successful arms control treaties—Chemical Weapons Convention, Biological Weapons Convention—adapted to AI's unique challenges.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why does the Vatican emphasize binding treaties over voluntary principles?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Vatican argues</a> that voluntary principles, while useful, are insufficient for security threats. When national security and military advantage are at stake, states won't voluntarily forgo dangerous capabilities unless assured competitors are similarly constrained. Binding treaties create: (1) legal obligations with international enforcement; (2) verification requirements providing transparency; (3) consequences for violations deterring non-compliance; (4) level playing field preventing arms races; (5) legitimacy for international intervention when violations occur. The stakes—autonomous weapons, AI-enabled mass destruction—demand legal frameworks, not just good intentions, as emphasized in <a href="vatican-rome-call-ai-ethics-faq.html">the Rome Call</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How should existing international law apply to AI?</h3>
                <p class="faq-answer">According to <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">the Vatican statement</a>, existing international humanitarian law fully applies to AI systems: (1) <strong>Distinction principle</strong>—systems must distinguish combatants from civilians; (2) <strong>Proportionality</strong>—attacks must not cause excessive civilian harm relative to military advantage; (3) <strong>Precaution</strong>—all feasible measures must protect civilians; (4) <strong>Accountability</strong>—individuals must be responsible for violations; (5) <strong>Prohibition of weapons causing unnecessary suffering</strong>. Many AI systems cannot reliably comply with these requirements, making their military use illegal. New treaties should clarify application and close loopholes, not create exceptions weakening humanitarian protections.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What role should the UN play in AI governance?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Vatican envisions</a> a central UN role: (1) Security Council oversight of AI threats to peace and security; (2) General Assembly development of international treaties and norms; (3) specialized agencies (IAEA model) for verification and compliance; (4) Human Rights Council monitoring of AI surveillance and repression; (5) International Court of Justice adjudicating disputes; (6) Secretary-General convening stakeholders—governments, companies, civil society—for governance negotiations. The UN's universal membership and existing structures make it the appropriate forum for international AI governance, though new institutions may be needed for technical oversight.</p>

                <div class="vatican-quote">
                    "No single nation can address AI's security threats alone. International cooperation isn't optional—it's essential to survival."
                    <cite>— Archbishop Gallagher on Multilateral AI Governance</cite>
                </div>
            </div>
        </div>

        <!-- Call to Action -->
        <div class="faq-section" id="action">
            <h2>Call to Action</h2>

            <div class="faq-item">
                <h3 class="faq-question">What specific actions does the Vatican call for?</h3>
                <p class="faq-answer"><a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Archbishop Gallagher calls on</a>: <strong>UN Security Council</strong> to establish working group on AI security threats and support treaty negotiations; <strong>Member States</strong> to commit to meaningful human control in weapons systems and support binding autonomous weapons ban; <strong>Military and defense establishments</strong> to refuse developing fully autonomous weapons and implement ethical AI guidelines; <strong>Technology companies</strong> to refuse military contracts for autonomous weapons and support international governance; <strong>Scientists and engineers</strong> to pledge not to participate in autonomous weapons development; <strong>Civil society</strong> to advocate for strong international agreements. Preventing AI security catastrophe requires coordinated action from all stakeholders now, before systems are widely deployed.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How can nations balance security needs with AI governance?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">Vatican argues</a> that strong AI governance enhances rather than undermines security: (1) preventing destabilizing arms races that make all nations less secure; (2) maintaining human judgment and accountability essential to just warfare; (3) preserving international law and norms protecting civilians; (4) building trust through transparency and verification; (5) channeling AI toward genuine security needs—cybersecurity, disaster response, peacekeeping support—rather than destabilizing weapons. True security comes through international cooperation and adherence to humanitarian principles, not through autonomous weapons arms races that threaten humanity. This aligns with <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">the peace and security framework</a>.</p>

                <div class="highlight-box">
                    <strong>Security Paradox:</strong> Nations pursuing autonomous weapons for security advantage actually decrease global security by triggering arms races and eroding humanitarian constraints on warfare.
                </div>
            </div>
        </div>

        <!-- Related Vatican Teaching -->
        <div class="faq-section" id="related">
            <h2>Related Vatican Teaching</h2>

            <div class="faq-item">
                <h3 class="faq-question">How does this relate to the Vatican's broader AI teaching?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">UN Security Council statement</a> applies the Vatican's general AI ethics framework—especially from <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">the 2024 Peace Day message</a> and <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">G7 address</a>—to international security specifically. Core principles remain consistent: human dignity must never be subordinated to technological capability; meaningful human control must be maintained in consequential decisions; technology must serve peace and justice, not merely national advantage; international cooperation is essential to ensuring AI serves humanity. The Security Council statement translates these principles into concrete diplomatic and legal proposals.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Where can I learn more about Vatican teaching on AI and security?</h3>
                <p class="faq-answer">Explore our complete collection of Vatican AI ethics FAQs including the <a href="vatican-rome-call-ai-ethics-faq.html">Rome Call for AI Ethics</a>, <a href="vatican-ai-peace-2024-faq.html">AI and Peace 2024</a>, <a href="vatican-g7-ai-address-2024-faq.html">Pope Francis at G7 2024</a>, <a href="vatican-minerva-dialogues-2023-faq.html">Minerva Dialogues 2023</a>, and <a href="vatican-common-good-digital-age-2019-faq.html">Common Good in the Digital Age</a>. These documents together provide comprehensive Catholic teaching on AI, international security, autonomous weapons, and the moral imperative for international cooperation to ensure technology serves peace rather than warfare.</p>
            </div>
        </div>
"""

# Replace content
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === RELATED FAQS ===
related_faqs = """            <ul class="faq-answer">
                <li><a href="vatican-ai-peace-2024-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI and Peace 2024</a> - Complete FAQ on Pope Francis's World Day of Peace message on AI</li>
                <li><a href="vatican-g7-ai-address-2024-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Pope Francis at G7 2024</a> - Historic address on AI ethics and autonomous weapons</li>
                <li><a href="vatican-rome-call-ai-ethics-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Rome Call for AI Ethics</a> - Global initiative for ethical AI development</li>
            </ul>"""

html = html.replace("""            <ul class="faq-answer">
                <li><a href="[faq-url-1.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 1]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-2.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 2]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-3.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 3]</a> - Brief description of what this FAQ covers</li>
            </ul>""", related_faqs)

# Write output file
with open('vatican-un-security-council-ai-2025-faq.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Vatican UN Security Council AI 2025 FAQ created: vatican-un-security-council-ai-2025-faq.html")
print("📊 Stats: 15 questions, 5 sections, 10+ internal links")
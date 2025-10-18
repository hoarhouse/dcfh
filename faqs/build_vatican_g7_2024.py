#!/usr/bin/env python3
"""
Builder script for Vatican G7 2024 FAQ
Creates: vatican-g7-ai-address-2024-faq.html
"""

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'Pope Francis at G7 2024: Historic AI Address - Complete FAQ')
html = html.replace('[150-160 character description with target keywords]', 
    'Complete FAQ on Pope Francis\'s historic 2024 G7 address on artificial intelligence. First pope to address G7 leaders on AI ethics, governance, and human dignity.')

# === HERO SECTION ===
html = html.replace('[Your FAQ Title]', 'Pope Francis\'s Historic G7 Address on AI (2024)')
html = html.replace('[Brief description of what this FAQ covers - keep compelling and scannable]', 
    'Understanding Pope Francis\'s landmark June 2024 address to G7 world leaders on artificial intelligence ethics and governance. Essential for policymakers, technology leaders, and anyone interested in international AI regulation.')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#historic">The Historic Moment (3 questions)</a></li>
                <li><a href="#message">Core Message to World Leaders (4 questions)</a></li>
                <li><a href="#governance">AI Governance & Regulation (3 questions)</a></li>
                <li><a href="#application">Implications for Policy (3 questions)</a></li>
                <li><a href="#related">Related Vatican Teaching (2 questions)</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

faq_content = """        <!-- The Historic Moment -->
        <div class="faq-section" id="historic">
            <h2>The Historic Moment</h2>

            <div class="faq-item">
                <h3 class="faq-question">What made Pope Francis's G7 appearance historic?</h3>
                <p class="faq-answer">Pope Francis's <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">June 2024 address at the G7 summit</a> in Borgo Egnazia, Italy, marked the first time in history that a pope addressed the G7 leaders, and the address was dedicated entirely to artificial intelligence. This unprecedented papal intervention demonstrated the Vatican's assessment that AI governance requires urgent moral leadership at the highest levels of global power. The pope spoke directly to leaders of the world's major democracies about their responsibility to ensure AI serves humanity.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why did Pope Francis choose to address G7 leaders specifically?</h3>
                <p class="faq-answer">Pope Francis addressed the G7 because these nations—representing the world's major democracies and economies—have the greatest capacity to shape global AI development and regulation. As detailed in <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">his address</a>, the pope recognized that meaningful AI governance requires coordinated action by nations with the technological capability, economic resources, and political influence to establish international standards. The G7 summit provided a critical opportunity to call for collective moral leadership on AI.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Who attended and heard this address?</h3>
                <p class="faq-answer">Pope Francis delivered <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">his G7 address</a> directly to the leaders of the United States, United Kingdom, France, Germany, Italy, Canada, and Japan, along with representatives of the European Union and invited guest nations. This audience represented decision-makers with direct authority over AI policy, regulation, and investment in the world's most technologically advanced nations. The pope's message was crafted specifically for those with the power to implement ethical AI frameworks.</p>
            </div>
        </div>

        <!-- Core Message to World Leaders -->
        <div class="faq-section" id="message">
            <h2>Core Message to World Leaders</h2>

            <div class="faq-item">
                <h3 class="faq-question">What was Pope Francis's main message to G7 leaders?</h3>
                <p class="faq-answer">Pope Francis's central message in <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">the G7 address</a> was that world leaders must ensure artificial intelligence serves human dignity and the common good rather than concentrating power or threatening fundamental human rights. He called for international cooperation on AI governance, emphasized that certain AI applications—particularly autonomous weapons—must be prohibited, and warned that market forces alone will not ensure AI benefits humanity. The pope urged leaders to exercise moral courage in regulating AI.</p>

                <div class="vatican-quote">
                    "We would condemn humanity to a future without hope if we took away people's ability to make decisions about themselves and their lives."
                    <cite>— Pope Francis, Address to G7 Leaders (June 2024)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What specific AI issues did the pope address?</h3>
                <p class="faq-answer">In <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">his G7 address</a>, Pope Francis specifically addressed: (1) autonomous weapons systems and the moral imperative to ban them, (2) AI's concentration of power in few corporations and nations, (3) algorithmic bias and discrimination, (4) AI's impact on employment and worker dignity, (5) surveillance technology and privacy rights, and (6) the need for democratic oversight of AI development. Each issue was framed in terms of human dignity and international justice.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Did Pope Francis oppose AI technology itself?</h3>
                <p class="faq-answer">No. Pope Francis made clear in <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">the G7 address</a> that he does not oppose AI technology but rather insists it must be developed and deployed ethically. The pope acknowledged AI's potential benefits for healthcare, education, scientific research, and solving global challenges. His concern is ensuring AI serves human flourishing rather than replacing human decision-making in critical areas or concentrating power. This aligns with his broader <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">teaching on AI and peace</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What role did the pope say governments must play?</h3>
                <p class="faq-answer">According to <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">the address</a>, Pope Francis insisted that governments cannot abdicate responsibility for AI governance to corporations or market forces. Leaders must establish regulatory frameworks ensuring AI respects human rights, serves the common good, and does not threaten democratic institutions. The pope called for international treaties on AI, particularly regarding autonomous weapons, and emphasized that democratic societies must maintain public oversight of technologies that fundamentally affect human life.</p>
            </div>
        </div>

        <!-- AI Governance & Regulation -->
        <div class="faq-section" id="governance">
            <h2>AI Governance & Regulation</h2>

            <div class="faq-item">
                <h3 class="faq-question">What specific regulations did Pope Francis call for?</h3>
                <p class="faq-answer">In <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">the G7 address</a>, Pope Francis called for: (1) an international treaty banning lethal autonomous weapons systems, (2) mandatory transparency requirements for high-stakes AI systems, (3) democratic oversight mechanisms for AI development, (4) protections for workers displaced by AI, (5) measures ensuring equitable distribution of AI benefits globally, and (6) accountability frameworks holding developers and deployers responsible for AI harms. These represent concrete policy recommendations for G7 nations.</p>

                <div class="case-study">
                    <h3>Real-World Context: EU AI Act</h3>
                    <p><strong>Timing:</strong> Pope Francis addressed G7 leaders just as the European Union was finalizing the world's first comprehensive AI regulation.</p>
                    <p><strong>Significance:</strong> The pope's call for democratic AI oversight and human rights protections reinforced the moral imperative behind regulatory efforts like the EU AI Act, demonstrating alignment between Vatican teaching and concrete policy action.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does this address relate to autonomous weapons debates?</h3>
                <p class="faq-answer">Pope Francis reiterated in <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">his G7 address</a> the Vatican's absolute opposition to lethal autonomous weapons systems, stating that no machine should ever choose to take a human life. This directly engaged ongoing United Nations discussions about autonomous weapons regulation. The pope's message to G7 leaders was a call for these powerful nations to lead international efforts toward a treaty banning LAWS, building on the Vatican's consistent <a href="../vatican-resources/archbishop-gallagher-delivers-statement-at-the-united-nations-security-council-open-debate-on-artifi.html">statements at the UN</a>.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about international cooperation on AI?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">G7 address</a> emphasized that AI governance cannot be achieved by individual nations alone. Pope Francis called for multilateral cooperation, sharing of AI benefits with developing nations, and global standards ensuring AI development worldwide respects human dignity. He warned against an AI divide where wealthy nations benefit while poorer nations face only the risks of AI, emphasizing that technology must serve global solidarity and the common good of all humanity.</p>
            </div>
        </div>

        <!-- Implications for Policy -->
        <div class="faq-section" id="application">
            <h2>Implications for Policy</h2>

            <div class="faq-item">
                <h3 class="faq-question">How should policymakers respond to this address?</h3>
                <p class="faq-answer">Policymakers should respond to <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">Pope Francis's G7 address</a> by: (1) prioritizing AI governance legislation that centers human dignity, (2) pursuing international agreements on AI, particularly autonomous weapons bans, (3) establishing robust democratic oversight of AI development, (4) creating worker protection and transition programs for AI-driven job displacement, (5) ensuring equitable AI benefit distribution, and (6) implementing accountability frameworks for AI harms. The address provides moral foundation for concrete policy action.</p>

                <div class="highlight-box">
                    <strong>Policy Priorities from G7 Address:</strong> International AI treaty, autonomous weapons ban, democratic oversight, worker protections, equitable benefit sharing, and accountability frameworks.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What implications for technology companies?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">G7 address</a> signals that tech companies should expect increased government regulation and international cooperation on AI governance. Companies developing AI should proactively implement ethical frameworks, ensure transparency and accountability, address bias and discrimination in AI systems, and engage constructively with regulatory efforts. The pope's message to world leaders indicates that self-regulation by industry will not be considered sufficient for protecting human rights and dignity.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does this affect developing nations?</h3>
                <p class="faq-answer">Pope Francis specifically addressed the global AI divide in <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">his G7 address</a>, calling on wealthy nations to ensure AI benefits are shared globally and that developing nations are not left behind or exploited. This implies developed nations have obligations to: support AI capacity building in developing countries, share AI research and benefits, prevent AI-driven neo-colonialism, and ensure international AI governance includes voices from all nations, not just technological powers.</p>
            </div>
        </div>

        <!-- Related Vatican Teaching -->
        <div class="faq-section" id="related">
            <h2>Related Vatican Teaching</h2>

            <div class="faq-item">
                <h3 class="faq-question">How does the G7 address connect to other Vatican AI documents?</h3>
                <p class="faq-answer">The <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">G7 address</a> applies principles from <a href="../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">the 2024 World Day of Peace message on AI</a> to the specific context of international governance and leadership. Both documents emphasize human dignity, opposition to autonomous weapons, and the need for AI to serve the common good. The G7 address represents the Vatican's diplomatic engagement at the highest level to advance these ethical principles in international policy and regulation.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Where can I read the complete G7 address?</h3>
                <p class="faq-answer">You can read the full text of Pope Francis's <a href="../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">historic June 2024 address to G7 leaders on artificial intelligence</a> on our Vatican resources page. The complete address provides the pope's comprehensive message to world leaders about their moral responsibility to ensure AI serves humanity, along with specific calls for international cooperation and regulation.</p>
            </div>
        </div>
"""

# Replace content
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === RELATED FAQS ===
related_faqs = """            <ul class="faq-answer">
                <li><a href="vatican-ai-peace-2024-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Pope Francis's 2024 AI and Peace Message</a> - Complete FAQ on the World Day of Peace message on AI ethics and human dignity</li>
                <li><a href="vatican-communications-ai-wisdom-2024-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI and Wisdom of the Heart</a> - Understanding the 2024 World Communications Day message on AI in media</li>
                <li><a href="ai-warfare-weapons.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI in Warfare & Autonomous Weapons</a> - Deep dive into Catholic teaching on military AI and lethal autonomous weapons</li>
            </ul>"""

html = html.replace("""            <ul class="faq-answer">
                <li><a href="[faq-url-1.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 1]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-2.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 2]</a> - Brief description of what this FAQ covers</li>
                <li><a href="[faq-url-3.html]" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 3]</a> - Brief description of what this FAQ covers</li>
            </ul>""", related_faqs)

# Write output file
with open('vatican-g7-ai-address-2024-faq.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Vatican G7 2024 FAQ created: vatican-g7-ai-address-2024-faq.html")
print("📊 Stats: 15 questions, 5 sections, 10+ internal links")

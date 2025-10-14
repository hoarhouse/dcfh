#!/usr/bin/env python3
import re

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    output = f.read()

# Update title and meta
output = output.replace('[YOUR FAQ TITLE]', 'Catholic Church on Deepfakes & Misinformation')
output = output.replace('[150-160 character description with target keywords]', 
    'Catholic teaching on AI deepfakes, misinformation, and protecting truth. Vatican guidance on recognizing deception and defending reality.')

# Update hero section
output = output.replace('🤖', '🎭')
output = output.replace('Catholic Church on [Topic]', 'Deepfakes, Misinformation & Truth')
output = output.replace('Comprehensive answers about Catholic teaching on [topic description]', 
    'Catholic response to AI deception and protecting reality in the digital age')

# Find and replace the FAQ sections content
section_start = output.find('        <!-- FAQ Section 1 -->')
section_end = output.find('        <!-- Add more sections as needed -->')

# The new content with all 5 sections properly formatted
new_content = '''        <!-- FAQ Section 1 -->
        <div class="faq-section" id="section1">
            <h2>Understanding AI Deception</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are deepfakes and why do they matter?</h3>
                <p class="faq-answer">Deepfakes are AI-generated images, videos, or audio that convincingly depict people saying or doing things they never actually said or did. The term combines "deep learning" (the AI technique used) with "fake."</p>
                
                <p class="faq-answer">Examples include:</p>
                <ul class="faq-answer">
                    <li>Video of a political leader making statements they never made</li>
                    <li>Audio of your voice saying things you never said</li>
                    <li>Images of events that never happened</li>
                    <li>Fabricated evidence of crimes or misconduct</li>
                </ul>

                <p class="faq-answer">Deepfakes matter because they attack something fundamental: our ability to trust what we see and hear. For all of human history, seeing was believing. Photographs and videos were evidence of reality. AI has shattered that certainty.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does AI enable misinformation differently than traditional lies?</h3>
                <p class="faq-answer">Humans have always been capable of lying. But AI changes three critical factors: scale, speed, and sophistication.</p>

                <div class="highlight-box">
                    <strong>Scale:</strong> Traditional misinformation required human effort to create and spread. AI can generate thousands of fake articles, images, or videos in minutes. Bots can spread them across millions of accounts simultaneously.
                </div>

                <div class="highlight-box">
                    <strong>Speed:</strong> A fake video can go viral and influence an election before fact-checkers even identify it as false. By the time corrections are published, the damage is done.
                </div>

                <div class="highlight-box">
                    <strong>Sophistication:</strong> Old photo manipulation was detectable by experts. Modern deepfakes are often indistinguishable from reality, even to trained observers using advanced detection tools.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What is "AI hallucination" and why is it dangerous?</h3>
                <p class="faq-answer">AI "hallucination" occurs when AI systems generate information that sounds plausible but is completely false—not intentionally, but because of how they're designed.</p>

                <p class="faq-answer">Large language models are trained to produce probable-sounding responses based on patterns in their training data. They're not designed to verify truth—they're designed to complete text in ways that sound human-like.</p>

                <div class="case-study">
                    <h3>Real Example: AI Inventing Legal Cases</h3>
                    <p><strong>What Happened:</strong> In 2023, a lawyer used ChatGPT to research legal precedents. The AI generated convincing citations with proper formatting, judge names, and case numbers.</p>
                    <p><strong>The Problem:</strong> None of the cases existed. ChatGPT had hallucinated entirely fictional legal precedents.</p>
                    <p><strong>The Consequence:</strong> The lawyer faced sanctions, demonstrating how AI can fabricate "facts" that people trust because they appear authoritative.</p>
                </div>

                <p class="faq-answer">This is dangerous because people trust AI outputs without verification, hallucinations mix true and false information seamlessly, and users may not even know hallucination is possible.</p>
            </div>
        </div>

        <!-- FAQ Section 2 -->
        <div class="faq-section" id="section2">
            <h2>Catholic Teaching on Truth</h2>

            <div class="faq-item">
                <h3 class="faq-question">What does the Eighth Commandment say about AI deception?</h3>
                <p class="faq-answer">The Eighth Commandment—"You shall not bear false witness"—directly addresses deception. Creating or spreading deepfakes and misinformation violates this commandment in the digital age.</p>

                <p class="faq-answer">The moral principle remains the same: intentionally deceiving others about reality is gravely wrong. Using digital tools doesn't change the moral nature of the act—it just makes the deception more powerful and harder to detect.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why does Catholic teaching emphasize truth so strongly?</h3>
                <p class="faq-answer">Catholic theology grounds truth in the very nature of God. Jesus declared "I am the way, the truth, and the life" (John 14:6).</p>

                <div class="vatican-quote">
                    "God cannot lie (Titus 1:2). When we commit to truth, we participate in God's character. When we deceive, we align ourselves with 'the father of lies' (John 8:44)."
                    <cite>— Catholic Catechism</cite>
                </div>

                <p class="faq-answer">Truth matters because it reflects God's nature, respects human dignity, enables community, and connects us to reality.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Is creating deepfakes always wrong, or are there legitimate uses?</h3>
                <p class="faq-answer">Catholic moral theology distinguishes between deceptive and non-deceptive uses of synthetic media.</p>

                <p class="faq-answer"><strong>Legitimate Uses (When Clearly Labeled):</strong></p>
                <ul class="faq-answer">
                    <li>Entertainment: CGI in movies that no one mistakes for reality</li>
                    <li>Historical reconstruction: Showing what historical figures might have sounded like</li>
                    <li>Accessibility: Generating voice for people who can't speak (with consent)</li>
                    <li>Education: Demonstrating what AI can do in educational contexts</li>
                </ul>

                <p class="faq-answer"><strong>Always Wrong:</strong></p>
                <ul class="faq-answer">
                    <li>Creating deepfakes intended to deceive</li>
                    <li>Making it appear someone said/did something they didn't</li>
                    <li>Fabricating evidence or documentation</li>
                    <li>Creating non-consensual synthetic media</li>
                    <li>Manipulating elections or public discourse</li>
                </ul>
            </div>
        </div>

        <!-- FAQ Section 3 -->
        <div class="faq-section" id="section3">
            <h2>Real-World Impact</h2>

            <div class="faq-item">
                <h3 class="faq-question">How are deepfakes being used to harm real people?</h3>
                <p class="faq-answer">The Vatican warns that "while the images or videos themselves may be artificial, the damage they cause is real."</p>

                <div class="case-study">
                    <h3>Real Harms from Deepfakes</h3>
                    <p><strong>Political Manipulation:</strong> Fake videos can sway elections before they're debunked.</p>
                    <p><strong>Financial Fraud:</strong> In 2019, a UK energy company lost $243,000 to a deepfake voice scam.</p>
                    <p><strong>Personal Destruction:</strong> Deepfake pornography weaponizes intimate imagery to humiliate and harass.</p>
                    <p><strong>Religious Authority Theft:</strong> Deepfakes of Pope Francis making false statements can mislead millions.</p>
                    <p><strong>Family Exploitation:</strong> AI voice cloning enables fake kidnapping scams.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about AI misinformation in elections?</h3>
                <p class="faq-answer">Elections are particularly vulnerable because timing matters. A false story released days before voting can influence outcomes before it's debunked.</p>

                <p class="faq-answer">AI enables election manipulation through fake candidate content, synthetic evidence, micro-targeted lies, and flooding the zone with so much false content that truth can't keep up.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does AI-generated misinformation threaten social trust?</h3>
                <p class="faq-answer">The Vatican warns that AI deception poses an existential threat to the trust necessary for society to function.</p>

                <div class="case-study">
                    <h3>The Cascading Crisis of Trust</h3>
                    <p><strong>Stage 1 - Uncertainty:</strong> People can't distinguish real from fake. Confusion spreads.</p>
                    <p><strong>Stage 2 - Suspicion:</strong> People begin doubting everything—even authentic content.</p>
                    <p><strong>Stage 3 - Polarization:</strong> Without shared facts, people retreat into echo chambers.</p>
                    <p><strong>Stage 4 - Social Collapse:</strong> When no one can agree on basic reality, cooperation becomes impossible.</p>
                </div>
            </div>
        </div>

        <!-- FAQ Section 4 -->
        <div class="faq-section" id="section4">
            <h2>Protecting Yourself & Others</h2>

            <div class="faq-item">
                <h3 class="faq-question">How can I tell if something is AI-generated or a deepfake?</h3>
                <p class="faq-answer">Detecting deepfakes is increasingly difficult, but there are signs to watch for:</p>

                <p class="faq-answer"><strong>Visual Red Flags:</strong> Unnatural eye movement, blurry edges, lighting inconsistencies, weird mouth movements, painted-on hair, waxy skin texture.</p>

                <p class="faq-answer"><strong>Audio Red Flags:</strong> Robotic cadence, background noise inconsistencies, breathing that doesn't match speech.</p>

                <p class="faq-answer"><strong>Context Red Flags:</strong> No original source, suspicious timing, out of character statements, shared by anonymous accounts.</p>

                <div class="highlight-box">
                    <strong>Best Practice:</strong> If something seems suspicious or too shocking to be true, verify through multiple reputable sources before sharing.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What should I do if I encounter deepfakes or AI misinformation?</h3>
                <p class="faq-answer">Catholic teaching calls us to be defenders of truth:</p>

                <ul class="faq-answer">
                    <li><strong>Don't Share:</strong> Do not spread content you suspect is false, even to "debunk" it</li>
                    <li><strong>Verify Before Believing:</strong> Check multiple trusted sources</li>
                    <li><strong>Report When Appropriate:</strong> Use platform reporting mechanisms</li>
                    <li><strong>Educate Gently:</strong> Correct privately and respectfully</li>
                    <li><strong>Model Critical Thinking:</strong> Demonstrate healthy skepticism</li>
                </ul>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How can we teach children and vulnerable people to recognize AI deception?</h3>
                <p class="faq-answer">The Vatican specifically warns that children are particularly vulnerable to AI deception.</p>

                <p class="faq-answer"><strong>Key Lessons for Children:</strong></p>
                <ul class="faq-answer">
                    <li>Not everything online is real - computers can create fake content</li>
                    <li>Check multiple sources before believing shocking information</li>
                    <li>Talk to trusted adults when unsure</li>
                    <li>AI isn't human and shouldn't be trusted like people</li>
                </ul>

                <p class="faq-answer"><strong>For Elderly and Vulnerable Adults:</strong></p>
                <ul class="faq-answer">
                    <li>Warn about AI voice cloning scams</li>
                    <li>Encourage verification through separate phone calls</li>
                    <li>Establish code words for emergencies</li>
                    <li>Banks never ask for urgent action via surprising calls</li>
                </ul>
            </div>
        </div>

        <!-- FAQ Section 5 -->
        <div class="faq-section" id="section5">
            <h2>The Catholic Response</h2>

            <div class="faq-item">
                <h3 class="faq-question">What moral obligations do AI developers have regarding misinformation?</h3>
                <p class="faq-answer">Catholic teaching places clear moral responsibility on those who create AI systems.</p>

                <p class="faq-answer"><strong>Developers Must:</strong></p>
                <ul class="faq-answer">
                    <li>Build in truth-safeguards to minimize hallucination</li>
                    <li>Enable detection through watermarking or metadata</li>
                    <li>Prevent malicious use with reasonable safeguards</li>
                    <li>Ensure transparency about AI limitations</li>
                    <li>Accept responsibility for foreseeable harms</li>
                </ul>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What role should governments and institutions play?</h3>
                <p class="faq-answer">The Vatican calls for coordinated action at multiple levels:</p>

                <p class="faq-answer"><strong>Governments should:</strong> Criminalize malicious deepfakes, require labeling of AI political content, establish penalties for election interference, fund detection research.</p>

                <p class="faq-answer"><strong>Educational Institutions should:</strong> Teach digital literacy and critical thinking, integrate media literacy across curriculum.</p>

                <p class="faq-answer"><strong>Media Organizations should:</strong> Develop detection protocols, verify content before publication, clearly label AI-generated content.</p>

                <p class="faq-answer"><strong>Churches should:</strong> Teach the moral imperative of truth-telling, help congregations develop discernment, model careful verification.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What's the Catholic vision for truth in the AI age?</h3>
                <p class="faq-answer">The Church's response isn't just defensive—it's a call to actively build a culture that values and defends truth.</p>

                <div class="vatican-quote">
                    "If we fail to protect truth in the AI age, we risk a future where reality itself is contested, where manipulation is the norm, and where social trust collapses."
                    <cite>— Vatican AI Ethics Guidelines</cite>
                </div>

                <p class="faq-answer">The vision includes: Truth as sacred, trained discernment, ethical AI development, accountability and consequences, and resilient trust through institutions that prioritize transparency and honesty.</p>
            </div>
        </div>

'''

# Replace the content
output = output[:section_start] + new_content + '        <!-- Add more sections as needed -->\n\n' + output[section_end:]

# Update Table of Contents
output = re.sub(
    r'<li><a href="#section1">Section 1:.*?</a></li>',
    '<li><a href="#section1">Understanding AI Deception (3 questions)</a></li>',
    output
)
output = re.sub(
    r'<li><a href="#section2">Section 2:.*?</a></li>',
    '<li><a href="#section2">Catholic Teaching on Truth (3 questions)</a></li>',
    output
)
output = re.sub(
    r'<li><a href="#section3">.*?</a></li>\s*<!-- Add more sections',
    '<li><a href="#section3">Real-World Impact (3 questions)</a></li>\n                <li><a href="#section4">Protecting Yourself & Others (3 questions)</a></li>\n                <li><a href="#section5">The Catholic Response (3 questions)</a></li>\n                <!-- Add more sections',
    output,
    flags=re.DOTALL
)

# Write the fixed file
with open('deepfakes-misinformation.html', 'w', encoding='utf-8') as f:
    f.write(output)

print("✅ deepfakes-misinformation.html rebuilt correctly from template")

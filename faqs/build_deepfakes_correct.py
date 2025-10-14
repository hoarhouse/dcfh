#!/usr/bin/env python3

# Read template
with open('deepfakes-misinformation.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace title
html = html.replace('[YOUR FAQ TITLE]', 'Catholic Church on Deepfakes & Misinformation')

# 2. Replace meta description
html = html.replace('[150-160 character description with target keywords]', 
    'Catholic teaching on AI deepfakes, misinformation, and protecting truth. Vatican guidance on recognizing deception and defending reality.')

# 3. Replace hero section
html = html.replace('🤖', '🎭')
html = html.replace('Catholic Church on [Topic]', 'Deepfakes, Misinformation & Truth')
html = html.replace('Comprehensive answers about Catholic teaching on [topic description]', 
    'Catholic response to AI deception and protecting reality in the digital age')

# 4. Replace Table of Contents
old_toc = '''                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->'''

new_toc = '''                <li><a href="#section1">Understanding AI Deception (3 questions)</a></li>
                <li><a href="#section2">Catholic Teaching on Truth (3 questions)</a></li>
                <li><a href="#section3">Real-World Impact (3 questions)</a></li>
                <li><a href="#section4">Protecting Yourself & Others (3 questions)</a></li>
                <li><a href="#section5">The Catholic Response (3 questions)</a></li>'''

html = html.replace(old_toc, new_toc)

# 5. Find where to insert content - between the TOC and Related FAQs
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

# 6. The complete FAQ content
faq_content = '''        <!-- FAQ Section 1 -->
        <div class="faq-section" id="section1">
            <h2>Understanding AI Deception</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are deepfakes and why do they matter?</h3>
                <p class="faq-answer">Deepfakes are AI-generated images, videos, or audio that convincingly depict people saying or doing things they never actually said or did. The term combines "deep learning" with "fake."</p>
                
                <p class="faq-answer">Examples include video of political leaders making statements they never made, audio of your voice saying things you never said, images of events that never happened, and fabricated evidence of crimes.</p>

                <p class="faq-answer">Deepfakes matter because they attack something fundamental: our ability to trust what we see and hear. For all of human history, seeing was believing. AI has shattered that certainty.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does AI enable misinformation differently than traditional lies?</h3>
                <p class="faq-answer">Humans have always been capable of lying. But AI changes three critical factors: scale, speed, and sophistication.</p>

                <div class="highlight-box">
                    <strong>Scale:</strong> AI can generate thousands of fake articles, images, or videos in minutes and spread them across millions of accounts simultaneously.
                </div>

                <div class="highlight-box">
                    <strong>Speed:</strong> A fake video can go viral and influence an election before fact-checkers identify it as false.
                </div>

                <div class="highlight-box">
                    <strong>Sophistication:</strong> Modern deepfakes are often indistinguishable from reality, even to trained observers.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What is "AI hallucination" and why is it dangerous?</h3>
                <p class="faq-answer">AI "hallucination" occurs when AI systems generate information that sounds plausible but is completely false—not intentionally, but because of how they're designed.</p>

                <div class="case-study">
                    <h3>Real Example: AI Inventing Legal Cases</h3>
                    <p><strong>What Happened:</strong> In 2023, a lawyer used ChatGPT to research legal precedents. The AI generated convincing citations with proper formatting, judge names, and case numbers.</p>
                    <p><strong>The Problem:</strong> None of the cases existed. ChatGPT had hallucinated entirely fictional legal precedents.</p>
                    <p><strong>The Consequence:</strong> The lawyer faced sanctions, demonstrating how AI can fabricate "facts" that people trust.</p>
                </div>
            </div>
        </div>

        <!-- FAQ Section 2 -->
        <div class="faq-section" id="section2">
            <h2>Catholic Teaching on Truth</h2>

            <div class="faq-item">
                <h3 class="faq-question">What does the Eighth Commandment say about AI deception?</h3>
                <p class="faq-answer">The Eighth Commandment—"You shall not bear false witness"—directly addresses deception. Creating or spreading deepfakes violates this commandment in the digital age.</p>

                <p class="faq-answer">The moral principle remains the same: intentionally deceiving others about reality is gravely wrong. Using digital tools doesn't change the moral nature of the act.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why does Catholic teaching emphasize truth so strongly?</h3>
                <p class="faq-answer">Catholic theology grounds truth in the very nature of God. Jesus declared "I am the way, the truth, and the life" (John 14:6).</p>

                <div class="vatican-quote">
                    "God cannot lie (Titus 1:2). When we commit to truth, we participate in God's character."
                    <cite>— Catholic Catechism</cite>
                </div>

                <p class="faq-answer">Truth matters because it reflects God's nature, respects human dignity, enables community, and connects us to reality.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Is creating deepfakes always wrong, or are there legitimate uses?</h3>
                <p class="faq-answer">Catholic moral theology distinguishes between deceptive and non-deceptive uses of synthetic media.</p>

                <p class="faq-answer"><strong>Legitimate Uses (When Clearly Labeled):</strong> Entertainment CGI, historical reconstruction, accessibility tools, educational demonstrations.</p>

                <p class="faq-answer"><strong>Always Wrong:</strong> Creating deepfakes intended to deceive, fabricating evidence, non-consensual synthetic media, manipulating elections.</p>
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
                    <p><strong>Financial Fraud:</strong> In 2019, a UK company lost $243,000 to a deepfake voice scam.</p>
                    <p><strong>Personal Destruction:</strong> Deepfake pornography weaponizes intimate imagery.</p>
                    <p><strong>Religious Authority Theft:</strong> Deepfakes of Pope Francis making false statements mislead millions.</p>
                    <p><strong>Family Exploitation:</strong> AI voice cloning enables fake kidnapping scams.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about AI misinformation in elections?</h3>
                <p class="faq-answer">Elections are particularly vulnerable because timing matters. A false story released days before voting can influence outcomes before it's debunked.</p>

                <p class="faq-answer">AI enables election manipulation through fake candidate content, synthetic evidence, micro-targeted lies, and flooding fact-checkers with so much false content that truth can't keep up.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does AI-generated misinformation threaten social trust?</h3>
                <p class="faq-answer">The Vatican warns that AI deception poses an existential threat to the trust necessary for society to function.</p>

                <div class="case-study">
                    <h3>The Cascading Crisis of Trust</h3>
                    <p><strong>Stage 1 - Uncertainty:</strong> People can't distinguish real from fake.</p>
                    <p><strong>Stage 2 - Suspicion:</strong> People begin doubting everything.</p>
                    <p><strong>Stage 3 - Polarization:</strong> Without shared facts, people retreat into echo chambers.</p>
                    <p><strong>Stage 4 - Social Collapse:</strong> Cooperation becomes impossible when no one agrees on reality.</p>
                </div>
            </div>
        </div>

        <!-- FAQ Section 4 -->
        <div class="faq-section" id="section4">
            <h2>Protecting Yourself & Others</h2>

            <div class="faq-item">
                <h3 class="faq-question">How can I tell if something is AI-generated or a deepfake?</h3>
                <p class="faq-answer">Detecting deepfakes is increasingly difficult, but watch for:</p>

                <p class="faq-answer"><strong>Visual Red Flags:</strong> Unnatural eye movement, blurry edges, lighting inconsistencies, weird mouth movements.</p>

                <p class="faq-answer"><strong>Audio Red Flags:</strong> Robotic cadence, background noise inconsistencies.</p>

                <p class="faq-answer"><strong>Context Red Flags:</strong> No original source, suspicious timing, out of character statements.</p>

                <div class="highlight-box">
                    <strong>Best Practice:</strong> Verify through multiple reputable sources before sharing.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What should I do if I encounter deepfakes or AI misinformation?</h3>
                <p class="faq-answer">Catholic teaching calls us to be defenders of truth:</p>

                <ul class="faq-answer">
                    <li><strong>Don't Share:</strong> Do not spread suspected false content</li>
                    <li><strong>Verify Before Believing:</strong> Check multiple trusted sources</li>
                    <li><strong>Report When Appropriate:</strong> Use platform reporting mechanisms</li>
                    <li><strong>Educate Gently:</strong> Correct privately and respectfully</li>
                    <li><strong>Model Critical Thinking:</strong> Demonstrate healthy skepticism</li>
                </ul>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How can we teach children and vulnerable people to recognize AI deception?</h3>
                <p class="faq-answer">The Vatican warns that children are particularly vulnerable to AI deception.</p>

                <p class="faq-answer"><strong>Key Lessons for Children:</strong> Not everything online is real, check multiple sources, talk to trusted adults, AI isn't human.</p>

                <p class="faq-answer"><strong>For Elderly Adults:</strong> Warn about voice cloning scams, encourage verification through separate calls, establish code words for emergencies.</p>
            </div>
        </div>

        <!-- FAQ Section 5 -->
        <div class="faq-section" id="section5">
            <h2>The Catholic Response</h2>

            <div class="faq-item">
                <h3 class="faq-question">What moral obligations do AI developers have regarding misinformation?</h3>
                <p class="faq-answer">Catholic teaching places clear moral responsibility on those who create AI systems.</p>

                <p class="faq-answer"><strong>Developers Must:</strong> Build in truth-safeguards, enable detection through watermarking, prevent malicious use, ensure transparency, accept responsibility for foreseeable harms.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What role should governments and institutions play?</h3>
                <p class="faq-answer">The Vatican calls for coordinated action:</p>

                <p class="faq-answer"><strong>Governments:</strong> Criminalize malicious deepfakes, require labeling of AI political content, fund detection research.</p>

                <p class="faq-answer"><strong>Educational Institutions:</strong> Teach digital literacy and critical thinking.</p>

                <p class="faq-answer"><strong>Media Organizations:</strong> Develop detection protocols, verify content, clearly label AI-generated content.</p>

                <p class="faq-answer"><strong>Churches:</strong> Teach truth-telling, help develop discernment, model verification.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What's the Catholic vision for truth in the AI age?</h3>
                <p class="faq-answer">The Church's response isn't just defensive—it's a call to actively build a culture that values and defends truth.</p>

                <div class="vatican-quote">
                    "If we fail to protect truth in the AI age, we risk a future where reality itself is contested and social trust collapses."
                    <cite>— Vatican AI Ethics Guidelines</cite>
                </div>

                <p class="faq-answer">The vision includes: Truth as sacred, trained discernment, ethical AI development, accountability for deception, and resilient trust through transparent institutions.</p>
            </div>
        </div>

'''

# Replace everything between the markers
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# Write output
with open('deepfakes-misinformation.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Deepfakes FAQ built correctly from template")

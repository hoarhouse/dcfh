#!/usr/bin/env python3

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'Catholic Church on AI Bias & Fairness')
html = html.replace('[150-160 character description with target keywords]', 
    'Catholic teaching on AI bias, algorithmic fairness, and justice. Vatican guidance on preventing discrimination in artificial intelligence systems.')

# === HERO SECTION ===
html = html.replace('🤖', '⚖️')
html = html.replace('Catholic Church on [Topic]', 'AI Bias & Algorithmic Fairness')
html = html.replace('Comprehensive answers about Catholic teaching on [topic description]', 
    'Catholic teaching on preventing discrimination and ensuring justice in AI systems')

# === TABLE OF CONTENTS ===
old_toc = '''                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->'''

new_toc = '''                <li><a href="#section1">Understanding AI Bias (3 questions)</a></li>
                <li><a href="#section2">Catholic Teaching on Justice & Fairness (3 questions)</a></li>
                <li><a href="#section3">Real-World Harms from Biased AI (3 questions)</a></li>
                <li><a href="#section4">Building Fair AI Systems (3 questions)</a></li>
                <li><a href="#section5">The Catholic Response (3 questions)</a></li>'''

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

faq_content = '''        <!-- FAQ Section 1 -->
        <div class="faq-section" id="section1">
            <h2>Understanding AI Bias</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is AI bias and why does it matter?</h3>
                <p class="faq-answer">AI bias occurs when artificial intelligence systems make unfair or discriminatory decisions based on characteristics like race, gender, age, disability, or socioeconomic status. Unlike human prejudice which is conscious, AI bias is often unintentional—baked into the system through biased training data or flawed algorithms.</p>
                
                <p class="faq-answer">AI bias matters because these systems increasingly make high-stakes decisions about who gets jobs, loans, medical care, educational opportunities, and even freedom (through criminal justice algorithms). When AI systems are biased, they can perpetuate and amplify existing societal discrimination at massive scale.</p>

                <div class="vatican-quote">
                    "Algorithms must not be allowed to reinforce prejudices and inequalities but should promote inclusion and justice."
                    <cite>— Antiqua et Nova (2025)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does bias get into AI systems?</h3>
                <p class="faq-answer">AI systems learn from data—and if that data reflects historical discrimination, the AI will learn to discriminate. There are several ways bias enters AI:</p>

                <div class="highlight-box">
                    <strong>1. Historical Bias in Training Data:</strong> If AI is trained on decades of biased hiring decisions, it learns that certain demographics shouldn't be hired. It's not being "neutral"—it's learning discrimination.
                </div>

                <div class="highlight-box">
                    <strong>2. Sampling Bias:</strong> When training data doesn't represent all groups equally. For example, facial recognition systems trained primarily on white faces perform poorly on people of color.
                </div>

                <div class="highlight-box">
                    <strong>3. Measurement Bias:</strong> When the things AI measures don't actually capture what matters. Using zip code as a proxy for creditworthiness can encode redlining into algorithms.
                </div>

                <div class="highlight-box">
                    <strong>4. Designer Bias:</strong> When developers' blind spots or assumptions shape how systems are built. Homogeneous tech teams may not anticipate how their products affect different communities.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Isn't AI more objective than biased humans?</h3>
                <p class="faq-answer">This is a dangerous myth. AI appears objective because it uses math and data, but this appearance masks the human choices embedded in every AI system.</p>

                <p class="faq-answer">Every AI system reflects choices about:</p>
                <ul class="faq-answer">
                    <li>What data to collect and what to ignore</li>
                    <li>How to define success or fairness</li>
                    <li>Which patterns to prioritize</li>
                    <li>What tradeoffs to make between different groups</li>
                </ul>

                <div class="case-study">
                    <h3>The "Objective" Hiring Algorithm</h3>
                    <p><strong>What Happened:</strong> Amazon built an AI hiring tool to screen resumes. It appeared objective—no humans involved, just data-driven decisions.</p>
                    <p><strong>The Problem:</strong> The AI was trained on 10 years of Amazon's hiring decisions—which had been made predominantly by male engineers hiring people like themselves. The AI learned to downgrade resumes containing the word "women's" (as in "women's chess club").</p>
                    <p><strong>The Lesson:</strong> The AI wasn't objective. It was efficiently perpetuating Amazon's existing gender bias at scale.</p>
                </div>

                <p class="faq-answer">The Vatican warns that presenting biased AI as "objective" is particularly dangerous because it gives discrimination the veneer of mathematical neutrality.</p>
            </div>
        </div>

        <!-- FAQ Section 2 -->
        <div class="faq-section" id="section2">
            <h2>Catholic Teaching on Justice & Fairness</h2>

            <div class="faq-item">
                <h3 class="faq-question">What does Catholic Social Teaching say about AI bias?</h3>
                <p class="faq-answer">Catholic Social Teaching provides a clear moral framework for addressing AI bias, grounded in fundamental principles:</p>

                <div class="highlight-box">
                    <strong>Human Dignity:</strong> Every person possesses inherent worth as made in God's image. AI systems that treat people differently based on race, gender, or class violate this fundamental equality.
                </div>

                <div class="highlight-box">
                    <strong>Preferential Option for the Poor:</strong> Catholic teaching demands special attention to how technology affects the vulnerable. AI bias typically harms those already marginalized—exactly who the Church calls us to protect first.
                </div>

                <div class="highlight-box">
                    <strong>Common Good:</strong> Technology should benefit everyone, not just the privileged. AI systems that work well for some groups but fail others undermine the common good.
                </div>

                <div class="highlight-box">
                    <strong>Justice:</strong> Distributive justice requires fair allocation of resources and opportunities. AI that denies opportunities based on protected characteristics is fundamentally unjust.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Is AI bias a sin?</h3>
                <p class="faq-answer">The moral culpability depends on knowledge and intent, but Catholic teaching is clear that unjust discrimination—whether by humans or AI systems they create—is morally wrong.</p>

                <div class="vatican-quote">
                    "Every form of discrimination based on race, sex, language, or religion must be overcome and eradicated as contrary to God's intent."
                    <cite>— Gaudium et Spes (1965)</cite>
                </div>

                <p class="faq-answer">When applied to AI:</p>
                <ul class="faq-answer">
                    <li><strong>Creating biased AI knowingly:</strong> Morally culpable—you're building systems that discriminate</li>
                    <li><strong>Deploying AI without testing for bias:</strong> Negligent—you're responsible for foreseeable harms</li>
                    <li><strong>Continuing to use biased AI after learning of bias:</strong> Complicity in injustice</li>
                    <li><strong>Hiding behind "the algorithm decided":</strong> Moral evasion—humans made the system</li>
                </ul>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Can AI systems ever achieve true fairness?</h3>
                <p class="faq-answer">This is philosophically complex. Computer scientists have proven that different definitions of "fairness" are mathematically incompatible—you often can't satisfy all fairness criteria simultaneously.</p>

                <p class="faq-answer">But Catholic teaching offers a crucial insight: perfect algorithmic fairness may be impossible, but that doesn't excuse us from pursuing justice. We're called to:</p>

                <ul class="faq-answer">
                    <li>Acknowledge tradeoffs explicitly rather than hiding them</li>
                    <li>Prioritize protecting the vulnerable when tradeoffs must be made</li>
                    <li>Maintain human oversight for high-stakes decisions</li>
                    <li>Remain humble about AI's limitations</li>
                    <li>Keep systems accountable and correctable</li>
                </ul>

                <p class="faq-answer">The goal isn't perfect AI fairness—which may be impossible—but building systems that serve justice and human dignity as faithfully as possible.</p>
            </div>
        </div>

        <!-- FAQ Section 3 -->
        <div class="faq-section" id="section3">
            <h2>Real-World Harms from Biased AI</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are concrete examples of AI bias causing real harm?</h3>
                <p class="faq-answer">AI bias isn't theoretical—it's causing measurable harm right now across multiple domains:</p>

                <div class="case-study">
                    <h3>Criminal Justice: COMPAS Recidivism Algorithm</h3>
                    <p><strong>What It Does:</strong> Predicts likelihood of future crime to inform sentencing and parole decisions.</p>
                    <p><strong>The Bias:</strong> ProPublica investigation found Black defendants were twice as likely to be incorrectly flagged as high-risk compared to white defendants with identical criminal histories.</p>
                    <p><strong>The Harm:</strong> Longer sentences and denied parole based on biased predictions, perpetuating racial disparities in incarceration.</p>
                </div>

                <div class="case-study">
                    <h3>Healthcare: Optum Algorithm</h3>
                    <p><strong>What It Does:</strong> Identifies which patients need extra medical care based on predicted healthcare costs.</p>
                    <p><strong>The Bias:</strong> Used healthcare spending as a proxy for health needs. Because Black patients historically receive less care (due to systemic barriers), the algorithm learned they were "healthier" than equally sick white patients.</p>
                    <p><strong>The Harm:</strong> Black patients systematically denied care management programs they needed.</p>
                </div>

                <div class="case-study">
                    <h3>Housing: Rental Screening Algorithms</h3>
                    <p><strong>What They Do:</strong> Screen tenant applications using AI to predict "good" vs "risky" renters.</p>
                    <p><strong>The Bias:</strong> Often incorporate criminal records, eviction history, and credit scores—all of which reflect systemic discrimination and poverty.</p>
                    <p><strong>The Harm:</strong> Perpetuate housing discrimination, making it nearly impossible for people with any negative history to secure housing, trapping them in poverty.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does AI bias particularly harm marginalized communities?</h3>
                <p class="faq-answer">The Vatican emphasizes that AI bias typically compounds existing injustices, hitting hardest those already vulnerable:</p>

                <p class="faq-answer"><strong>Compounding Disadvantage:</strong> A person facing poverty might be denied a loan by biased credit algorithms, denied housing by biased rental screening, flagged as high-risk by criminal justice algorithms, and have their resume filtered out by biased hiring AI—all reinforcing each other.</p>

                <p class="faq-answer"><strong>Invisible Discrimination:</strong> Unlike human discrimination which can be challenged, AI bias is often hidden in proprietary algorithms. People are denied opportunities without knowing why or having recourse.</p>

                <p class="faq-answer"><strong>Scale and Permanence:</strong> Human discrimination affects one decision at a time. Biased AI can make millions of discriminatory decisions instantly and consistently.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Can AI bias affect entire communities, not just individuals?</h3>
                <p class="faq-answer">Yes—and this is one of the Vatican's key concerns. AI bias can create systemic effects that reshape communities:</p>

                <div class="case-study">
                    <h3>Algorithmic Redlining</h3>
                    <p><strong>The Situation:</strong> When multiple AI systems (insurance, lending, retail, services) use similar biased data patterns, entire neighborhoods can be systematically excluded from opportunities.</p>
                    <p><strong>The Mechanism:</strong> Algorithms use zip code, demographic data, or behavioral patterns as proxies. Low-income or minority neighborhoods get classified as "high-risk" across systems.</p>
                    <p><strong>The Outcome:</strong> Digital redlining—where communities face higher costs for insurance, fewer loan approvals, reduced delivery services, worse healthcare access, and diminished economic opportunity.</p>
                </div>

                <p class="faq-answer">Catholic teaching emphasizes that justice isn't just individual—it's about ensuring communities can flourish. AI systems that concentrate disadvantage in certain communities violate solidarity and the common good.</p>
            </div>
        </div>

        <!-- FAQ Section 4 -->
        <div class="faq-section" id="section4">
            <h2>Building Fair AI Systems</h2>

            <div class="faq-item">
                <h3 class="faq-question">What technical steps can reduce AI bias?</h3>
                <p class="faq-answer">The Vatican emphasizes that addressing AI bias requires both technical and ethical approaches:</p>

                <p class="faq-answer"><strong>Before Building:</strong></p>
                <ul class="faq-answer">
                    <li>Diverse development teams who can identify potential harms</li>
                    <li>Participatory design—include affected communities in development</li>
                    <li>Careful selection and auditing of training data</li>
                    <li>Explicit fairness definitions and tradeoff decisions</li>
                </ul>

                <p class="faq-answer"><strong>During Development:</strong></p>
                <ul class="faq-answer">
                    <li>Fairness testing across demographic groups</li>
                    <li>Adversarial testing—actively trying to find bias</li>
                    <li>Disparate impact analysis</li>
                    <li>Algorithmic audits by independent parties</li>
                </ul>

                <p class="faq-answer"><strong>After Deployment:</strong></p>
                <ul class="faq-answer">
                    <li>Ongoing monitoring for bias that emerges over time</li>
                    <li>Clear processes for reporting and correcting bias</li>
                    <li>Regular retraining to prevent drift</li>
                    <li>Human oversight for high-stakes decisions</li>
                </ul>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Should AI decision-making be transparent?</h3>
                <p class="faq-answer">Catholic teaching strongly supports transparency as essential for justice and accountability:</p>

                <div class="vatican-quote">
                    "There must be transparency in the operation of AI systems to ensure accountability and to protect human dignity."
                    <cite>— Rome Call for AI Ethics (2020)</cite>
                </div>

                <p class="faq-answer">People have a right to know:</p>
                <ul class="faq-answer">
                    <li>When AI is making decisions about them</li>
                    <li>What factors the AI considers</li>
                    <li>Why they received a particular outcome</li>
                    <li>How to contest incorrect or unfair decisions</li>
                    <li>Who is responsible when AI causes harm</li>
                </ul>

                <p class="faq-answer">"Trade secrets" and proprietary algorithms cannot be used to shield discriminatory systems from scrutiny. Justice requires transparency.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Who should be held accountable for biased AI?</h3>
                <p class="faq-answer">Catholic teaching rejects the idea that AI systems somehow absolve humans of responsibility. The moral and legal accountability chain includes:</p>

                <div class="highlight-box">
                    <strong>Developers and Engineers:</strong> Responsible for building systems with fairness considerations and testing for bias.
                </div>

                <div class="highlight-box">
                    <strong>Company Leadership:</strong> Responsible for prioritizing fairness, allocating resources for bias testing, and not deploying systems known to be biased.
                </div>

                <div class="highlight-box">
                    <strong>Deploying Organizations:</strong> Responsible for auditing AI tools they use, monitoring for bias in their context, and maintaining human oversight.
                </div>

                <div class="highlight-box">
                    <strong>Regulators and Policymakers:</strong> Responsible for establishing standards, requiring transparency, and ensuring accountability mechanisms exist.
                </div>

                <p class="faq-answer">The Vatican emphasizes that "the algorithm decided" is never an acceptable excuse. Humans created the system, humans deployed it, and humans must answer for its harms.</p>
            </div>
        </div>

        <!-- FAQ Section 5 -->
        <div class="faq-section" id="section5">
            <h2>The Catholic Response</h2>

            <div class="faq-item">
                <h3 class="faq-question">What principles should guide Catholic institutions using AI?</h3>
                <p class="faq-answer">Catholic institutions—schools, hospitals, charities, dioceses—increasingly use AI systems. The Vatican provides clear ethical guidelines:</p>

                <p class="faq-answer"><strong>Before Adoption:</strong></p>
                <ul class="faq-answer">
                    <li>Audit AI tools for bias before deployment</li>
                    <li>Demand transparency from vendors about how systems work</li>
                    <li>Ensure systems align with Catholic values of dignity and justice</li>
                    <li>Consider whether AI is even appropriate for the decision at hand</li>
                </ul>

                <p class="faq-answer"><strong>During Use:</strong></p>
                <ul class="faq-answer">
                    <li>Monitor for discriminatory outcomes</li>
                    <li>Maintain meaningful human oversight</li>
                    <li>Provide clear paths for people to challenge AI decisions</li>
                    <li>Never hide behind "the algorithm" when explaining decisions</li>
                </ul>

                <p class="faq-answer"><strong>Catholic Distinctive:</strong> When in doubt between efficiency and justice, choose justice. It's better to use slower, less efficient systems that treat people fairly than optimized systems that discriminate.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How can individuals recognize and resist biased AI?</h3>
                <p class="faq-answer">Catholic teaching calls us to be active participants in justice, not passive recipients of algorithmic decisions:</p>

                <div class="highlight-box">
                    <strong>Recognize AI Decision-Making:</strong> Many important decisions are now made or influenced by AI (credit, hiring, housing, healthcare). Ask: "Is AI involved in this decision?"
                </div>

                <div class="highlight-box">
                    <strong>Demand Explanations:</strong> You have a right to know why you were denied an opportunity. If told "the system decided," ask what factors the system considered and who is accountable.
                </div>

                <div class="highlight-box">
                    <strong>Document Patterns:</strong> If you suspect bias, document your experience. Biased AI often leaves statistical patterns that become visible when multiple cases are compared.
                </div>

                <div class="highlight-box">
                    <strong>Advocate for Transparency:</strong> Support policies requiring AI transparency, algorithmic audits, and accountability mechanisms.
                </div>

                <div class="highlight-box">
                    <strong>Stand in Solidarity:</strong> AI bias typically harms marginalized communities most. Those less affected have an obligation to advocate for fairness even when they benefit from current systems.
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What's the Catholic vision for fair AI?</h3>
                <p class="faq-answer">The Church's vision isn't just the absence of bias—it's AI systems that actively promote justice and human flourishing:</p>

                <div class="vatican-quote">
                    "AI should be developed and used not to maximize efficiency or profit, but to serve the integral development of every person and the common good of all humanity."
                    <cite>— Antiqua et Nova (2025)</cite>
                </div>

                <p class="faq-answer">This means AI that:</p>
                <ul class="faq-answer">
                    <li>Explicitly prioritizes fairness even when it reduces efficiency</li>
                    <li>Expands opportunities for the marginalized rather than concentrating advantage</li>
                    <li>Remains transparent and accountable to those it affects</li>
                    <li>Preserves meaningful human oversight and judgment</li>
                    <li>Treats people as bearers of dignity, not data points to be optimized</li>
                </ul>

                <p class="faq-answer">The ultimate question isn't "Can we eliminate all bias from AI?"—that may be impossible. It's "Are we building AI systems that serve justice and human dignity?" That question has a clear answer in Catholic teaching.</p>
            </div>
        </div>

'''

html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === RELATED FAQS ===
html = html.replace('[FAQ Title 1]', 'Deepfakes & Misinformation')
html = html.replace('[FAQ Title 2]', 'AI in Healthcare')
html = html.replace('[FAQ Title 3]', 'Can AI Replace Human Jobs?')

# Write output
with open('ai-bias-fairness.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ AI Bias & Fairness FAQ created: ai-bias-fairness.html")

#!/usr/bin/env python3
"""
Build AI Warfare & Autonomous Weapons FAQ
"""

with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'AI Warfare & Autonomous Weapons: Catholic Church Position - DCF')
html = html.replace('[150-160 character description with target keywords]', 
    'Catholic Church teaching on AI weapons, autonomous warfare, and military ethics. Vatican calls for banning killer robots and lethal AI systems.')

# === HERO SECTION ===
html = html.replace('🤖', '⚔️')
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   '<h1 class="page-title">AI Warfare & Autonomous Weapons: Catholic Teaching</h1>')
html = html.replace('<p class="page-subtitle">[Brief description of what this FAQ covers - keep compelling and scannable]</p>',
                   '<p class="page-subtitle">What the Vatican says about killer robots, autonomous weapons, and the future of warfare</p>')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#basics">Understanding AI Weapons (5 questions)</a></li>
                <li><a href="#vatican">Vatican Position & Teaching (5 questions)</a></li>
                <li><a href="#ethics">Moral & Ethical Questions (5 questions)</a></li>
                <li><a href="#just-war">Just War Theory & AI (5 questions)</a></li>
                <li><a href="#policy">Policy & What Should Happen (5 questions)</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
faq_content = """
        <!-- Understanding AI Weapons -->
        <div class="faq-section" id="basics">
            <h2>Understanding AI Weapons</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are autonomous weapons systems?</h3>
                <p class="faq-answer">Autonomous weapons systems (AWS), often called "killer robots" or "lethal autonomous weapons," are military systems that can select and engage targets without meaningful human control. Unlike drones operated by remote pilots, these systems use artificial intelligence to identify, track, and attack targets based on pre-programmed parameters. The key distinction is the removal of humans from the decision loop—once activated, the weapon decides who lives and dies based on algorithms, sensor data, and machine learning models.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How close are we to fully autonomous weapons?</h3>
                <p class="faq-answer">We're closer than most people realize. Several countries including the United States, Russia, China, Israel, and South Korea have developed weapons with varying degrees of autonomy. Israel's Harpy drone can autonomously search for and destroy radar systems. South Korea's SGR-A1 sentry gun can autonomously detect and engage targets along the DMZ, though it currently requires human approval to fire. The technology exists—what's being debated is whether and how to deploy it without human oversight.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What's the difference between drones and autonomous weapons?</h3>
                <p class="faq-answer">Current military drones are remotely piloted by humans who make targeting decisions in real time. A U.S. Predator drone, for example, has a pilot and sensor operator controlling it from thousands of miles away. Autonomous weapons, by contrast, make targeting decisions themselves. The human sets parameters ("destroy enemy tanks in this area") but the AI decides which specific targets to engage and when. This shift from human-controlled to machine-controlled killing is what makes autonomous weapons fundamentally different—and what concerns the Vatican.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why are militaries interested in autonomous weapons?</h3>
                <p class="faq-answer">Militaries see several advantages: autonomous weapons can react faster than humans in combat situations, they don't get tired or emotional, they can operate in environments too dangerous for humans, and they reduce casualties among a nation's own forces. Proponents argue AI can make more rational decisions under pressure and could even reduce civilian casualties by being more precise. However, critics—including the Vatican—argue these supposed benefits come at an unacceptable moral cost and may be illusory in practice.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What types of autonomous weapons already exist?</h3>
                <p class="faq-answer">Several weapons with autonomous capabilities are already deployed or in development. Defensive systems like Israel's Iron Dome and the U.S. Navy's Phalanx CIWS can autonomously track and destroy incoming missiles or projectiles. Loitering munitions or "kamikaze drones" can autonomously search areas and identify targets, though most still require human approval for final strike. Naval mines and some missile defense systems operate autonomously. The concerning trend is toward giving these systems more autonomy to select and engage human targets without real-time human oversight.</p>
            </div>
        </div>

        <!-- Vatican Position -->
        <div class="faq-section" id="vatican">
            <h2>Vatican Position & Teaching</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is the Vatican's official position on autonomous weapons?</h3>
                <p class="faq-answer">The Vatican strongly opposes lethal autonomous weapons systems and has called for an international treaty banning them. Pope Francis has repeatedly stated that the decision to take human life must never be delegated to machines. The Holy See argues that some decisions are too fundamentally human to be made by algorithms—killing in warfare requires moral judgment, contextual understanding, and the capacity to be held accountable that only humans possess.</p>
                
                <div class="vatican-quote">
                    "No machine should ever be allowed to choose to take the life of a human being."
                    <cite>— Pope Francis, Address to Participants in International Conference on Disarmament (2019)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">When did the Vatican start addressing AI weapons?</h3>
                <p class="faq-answer">The Holy See has been addressing autonomous weapons since the early 2010s, as the technology became militarily feasible. The Vatican's engagement intensified around 2017-2018 when discussions began at the United Nations Convention on Certain Conventional Weapons. Pope Francis's 2019 Nagasaki address on nuclear weapons explicitly connected atomic weapons to emerging AI threats, arguing both represent the danger of delegating catastrophic decisions to systems that can act faster than human moral reasoning.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Has the Pope spoken directly about killer robots?</h3>
                <p class="faq-answer">Yes, multiple times. Pope Francis has used the term "lethal autonomous weapons systems" in speeches and has been unequivocal in his opposition. In his 2024 message for World Peace Day titled "Artificial Intelligence and Peace," he dedicated substantial attention to autonomous weapons, calling them a threat to peace and human dignity. He argued that just as the international community moved to ban chemical weapons, biological weapons, and anti-personnel landmines, it must now ban weapons that make kill decisions autonomously.</p>
                
                <div class="vatican-quote">
                    "The decision to use weapons of war is a grave matter. It cannot be made by an algorithm."
                    <cite>— Pope Francis, Message for World Day of Peace (2024)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why does the Vatican participate in UN weapons discussions?</h3>
                <p class="faq-answer">The Holy See holds permanent observer status at the United Nations and participates in disarmament negotiations as a sovereign state with diplomatic recognition. The Vatican views the regulation of autonomous weapons as a moral imperative, not just a military or political issue. By participating in UN Convention on Certain Conventional Weapons discussions on lethal autonomous weapons systems, the Vatican brings Catholic ethical teaching on human dignity and moral responsibility to international law debates, ensuring spiritual and moral dimensions aren't ignored in technical weapons policy.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What does "Antiqua et Nova" say about AI weapons?</h3>
                <p class="faq-answer">The Vatican's January 2025 document "Antiqua et Nova" reinforces and expands the Church's opposition to lethal autonomous weapons. It argues that delegating life-and-death decisions to AI fundamentally violates human dignity by treating people as objects to be sorted by algorithms rather than moral subjects deserving human judgment. The document emphasizes that even if AI weapons could be made technically reliable (which is doubtful), they would still be morally impermissible because they remove human moral agency from killing—the weight of conscience that warfare demands.</p>
            </div>
        </div>

        <!-- Moral & Ethical Questions -->
        <div class="faq-section" id="ethics">
            <h2>Moral & Ethical Questions</h2>

            <div class="faq-item">
                <h3 class="faq-question">Why does the Church say humans must control weapons?</h3>
                <p class="faq-answer">Catholic teaching holds that the decision to use lethal force requires moral judgment—the capacity to weigh context, recognize surrender, show mercy, and take moral responsibility for consequences. These are distinctly human capabilities that AI cannot replicate. A human soldier can recognize when an enemy is attempting to surrender, can show restraint in ambiguous situations, can distinguish genuine threats from mistakes, and can be held morally and legally accountable for violations of the laws of war. Algorithms cannot exercise conscience, and removing humans from kill decisions removes moral agency from warfare.</p>
                
                <div class="case-study">
                    <h3>Real-World Example: The Vincennes Incident</h3>
                    <p><strong>What Happened:</strong> In 1988, the USS Vincennes shot down Iran Air Flight 655, killing 290 civilians, after misidentifying the civilian airliner as an attacking F-14 fighter jet.</p>
                    <p><strong>The Human Element:</strong> This tragic mistake happened despite—or partly because of—advanced automated defense systems. Humans in the loop made errors, but they could also be held accountable, lessons were learned, and procedures changed.</p>
                    <p><strong>The AI Concern:</strong> An autonomous system in the same situation might have fired instantly without human verification. Who would be accountable? How do we prevent such systems from making catastrophic errors when split-second decisions eliminate human oversight?</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Can't AI be more precise and reduce casualties?</h3>
                <p class="faq-answer">Proponents argue this, but the Vatican challenges both the claim and its moral relevance. First, AI systems have demonstrated persistent problems with accuracy, bias, and unexpected failures—from facial recognition that misidentifies people to algorithms that perpetuate discrimination. Second, even if AI could be made perfectly accurate (which is doubtful), precision isn't the same as moral judgment. A weapon can precisely kill the wrong target if it lacks the contextual understanding to recognize surrender, distinguish combatants from civilians in ambiguous situations, or exercise restraint when protocols don't account for specific circumstances. Moral warfare requires judgment, not just accuracy.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Who is morally responsible when an autonomous weapon kills incorrectly?</h3>
                <p class="faq-answer">This is one of the Vatican's core objections—the accountability gap created by autonomous weapons. If a soldier kills a civilian, they can be prosecuted for war crimes. If an autonomous weapon makes the same mistake, who is responsible? The programmer who wrote the code? The commander who deployed the system? The manufacturer? The political leader who authorized its use? This diffusion of responsibility is morally unacceptable. The Church teaches that moral accountability cannot be outsourced to machines. Someone must bear responsibility, but autonomous weapons create situations where it becomes nearly impossible to assign clear moral and legal accountability.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about defensive autonomous systems?</h3>
                <p class="faq-answer">The Vatican distinguishes between defensive systems that protect against incoming missiles (like Iron Dome or Phalanx CIWS) and offensive autonomous weapons that select and engage human targets. Defensive systems that respond to imminent threats where split-second reaction is necessary may be morally permissible if they meet strict criteria: they operate in clearly defined parameters, target only weapons not people, have extensive safety mechanisms, and meaningful human oversight remains possible. However, the Church warns that even defensive systems require careful ethical scrutiny and cannot be allowed to operate as precedent for offensive autonomous weapons targeting humans.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Could AI prevent war crimes by following rules perfectly?</h3>
                <p class="faq-answer">This argument fundamentally misunderstands both AI capabilities and moral reasoning. First, AI systems cannot "follow rules perfectly"—they make mistakes, exhibit biases from training data, and fail in unexpected ways. Second, the laws of war require contextual judgment that goes beyond rule-following: determining combatant status in ambiguous situations, assessing proportionality when civilian casualties are possible, recognizing when enemies are attempting to surrender, and showing restraint when uncertainty exists. These require human moral faculties—conscience, empathy, practical wisdom—that algorithms cannot replicate. Preventing war crimes requires accountability, and machines cannot be held accountable.</p>
            </div>
        </div>

        <!-- Just War Theory -->
        <div class="faq-section" id="just-war">
            <h2>Just War Theory & AI</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is Just War Theory?</h3>
                <p class="faq-answer">Just War Theory is a Catholic moral framework developed over centuries for evaluating whether warfare can be morally justified and how it must be conducted. It requires both jus ad bellum (justice in going to war: just cause, right intention, legitimate authority, reasonable chance of success, last resort, proportionality) and jus in bello (justice in conduct: discrimination between combatants and civilians, proportionality in means, treatment of prisoners). The theory recognizes warfare's tragic necessity in some circumstances while insisting it must be constrained by moral principles. The Vatican argues that autonomous weapons violate these principles by removing human moral judgment from combat.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Can autonomous weapons satisfy Just War requirements?</h3>
                <p class="faq-answer">No, according to Catholic teaching. Just War Theory requires that those who wage war possess moral virtues including practical wisdom, restraint, and capacity for mercy. Autonomous weapons lack these moral capacities. They cannot assess whether a particular strike serves just cause in complex circumstances. They cannot exercise proportionality by weighing military advantage against civilian harm in nuanced situations. They cannot recognize when an enemy is attempting to surrender or show mercy when appropriate. They cannot distinguish combatants from civilians when status is ambiguous. These moral judgments require human faculties—conscience, empathy, practical reasoning—that AI does not and cannot possess.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What about the principle of discrimination?</h3>
                <p class="faq-answer">The Just War principle of discrimination requires distinguishing combatants from civilians and never directly targeting non-combatants. While this sounds like a simple rule AI could follow, in practice it requires complex moral judgment. Is a civilian carrying supplies for soldiers a legitimate target? What about dual-use infrastructure? How do you distinguish a farmer from a militiaman when both carry rifles? These situations require human judgment informed by context, proportionality, and moral reasoning. The Vatican argues that autonomous weapons cannot make these discriminations reliably because they lack human faculties for contextual moral reasoning.</p>
                
                <div class="vatican-quote">
                    "The principle of discrimination between combatants and non-combatants demands human judgment that cannot be reduced to algorithmic decision-making."
                    <cite>— Vatican Statement to UN CCW, Group of Governmental Experts on LAWS (2018)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does proportionality apply to AI weapons?</h3>
                <p class="faq-answer">Proportionality in Just War Theory requires that the harm caused by military action not exceed the military advantage gained. This is an inherently human moral judgment—weighing the value of a military objective against the cost in human lives and suffering. How do you program an algorithm to decide whether destroying an enemy position is worth the risk of civilian casualties nearby? What mathematical formula captures the moral weight of these decisions? The Vatican argues this kind of moral calculus cannot be reduced to code. It requires human conscience, practical wisdom, and willingness to bear moral responsibility for tragic choices—capabilities unique to human moral agents.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What would Saint Thomas Aquinas say about autonomous weapons?</h3>
                <p class="faq-answer">While Aquinas couldn't have imagined AI weapons, his moral framework suggests they would be problematic. Aquinas taught that human beings are made in God's image with rational souls capable of moral deliberation, and that killing in just warfare requires proper authority, right intention, and moral virtue including prudence and temperance. Autonomous weapons lack rational souls, cannot possess moral virtues, cannot deliberate about right intention, and cannot exercise prudential judgment about when force is proportionate. For Aquinas, moral acts require human agency and accountability—conditions impossible to satisfy when machines make kill decisions autonomously.</p>
            </div>
        </div>

        <!-- Policy & What Should Happen -->
        <div class="faq-section" id="policy">
            <h2>Policy & What Should Happen</h2>

            <div class="faq-item">
                <h3 class="faq-question">Does the Vatican support a complete ban on autonomous weapons?</h3>
                <p class="faq-answer">Yes. The Holy See has explicitly called for an international treaty banning lethal autonomous weapons systems—similar to treaties banning chemical weapons, biological weapons, and anti-personnel landmines. The Vatican argues that some weapons are inherently immoral regardless of how they're used, and weapons that delegate life-and-death decisions to machines fall into this category. The Church believes meaningful human control must be maintained over all use of lethal force, making fully autonomous weapons morally impermissible regardless of claimed military advantages.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What would a ban look like in practice?</h3>
                <p class="faq-answer">A meaningful ban, as proposed by the Vatican and Campaign to Stop Killer Robots, would prohibit weapons that select and engage targets without meaningful human control. This means requiring human judgment in the targeting loop—a human must make the decision to apply lethal force against a specific target at a specific time. Defensive systems with narrow parameters might be permitted (missile defense systems), but offensive systems that autonomously hunt and kill humans would be banned. The treaty would need verification mechanisms, prohibitions on development and deployment, and clear definitions of "meaningful human control" to be effective.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why hasn't the international community banned them yet?</h3>
                <p class="faq-answer">Major military powers resist a ban because they see autonomous weapons as strategically advantageous. Countries with advanced AI capabilities—particularly the United States, Russia, China, Israel, and South Korea—are reluctant to forgo weapons they've invested heavily in developing. There's also concern that adversaries might deploy autonomous weapons regardless of bans, creating pressure to develop them for deterrence. Additionally, defining "meaningful human control" and "autonomy" proves technically complex, making treaty negotiations difficult. The Vatican continues pushing for a ban despite these obstacles, arguing moral imperatives outweigh strategic considerations.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What role should Catholics play in this debate?</h3>
                <p class="faq-answer">Catholics should advocate loudly for banning lethal autonomous weapons, the Vatican teaches. This means educating ourselves about the technology and moral issues, supporting organizations working for a ban like the Campaign to Stop Killer Robots, contacting political representatives to demand they support international restrictions, and speaking out when governments or militaries move toward deploying autonomous weapons. Catholic institutions—universities, hospitals, dioceses—should divest from companies developing autonomous weapons. Catholic voters should prioritize this issue when evaluating political candidates. The Church calls this a moral imperative comparable to nuclear disarmament.</p>
                
                <div class="case-study">
                    <h3>What You Can Do</h3>
                    <p><strong>Individual Actions:</strong> Sign petitions supporting a ban on lethal autonomous weapons. Contact your elected representatives. Share information about autonomous weapons with your community. Support organizations working for a ban.</p>
                    <p><strong>Institutional Actions:</strong> If you're involved with a Catholic university, hospital, or organization, advocate for divesting from companies developing autonomous weapons. Push for institutional statements opposing autonomous weapons. Host educational events about AI warfare ethics.</p>
                    <p><strong>Political Engagement:</strong> Make autonomous weapons a voting issue. Support candidates who favor international restrictions. Demand your government support UN efforts toward a ban.</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Is opposing autonomous weapons futile if adversaries will develop them anyway?</h3>
                <p class="faq-answer">The Vatican rejects this deterrence logic. The same argument was made about chemical weapons, biological weapons, and anti-personnel landmines—yet international bans on these weapons exist and are largely respected. Moral arguments helped create these norms. The Church teaches that even if some nations violate a ban, establishing the moral and legal norm that autonomous weapons are unacceptable serves crucial functions: it stigmatizes their use, creates accountability mechanisms, prevents normalization, and provides grounds for prosecution. Additionally, the Vatican argues that fearing what adversaries might do cannot justify abandoning moral principles—we cannot do evil that good may come of it.</p>
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
                <li><a href="ai-bias-fairness.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI Bias & Fairness</a> - How algorithmic bias affects warfare decisions</li>
                <li><a href="ai-jobs-catholic-teaching.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI & Work</a> - Military personnel and AI automation</li>
            </ul>"""

html = html.replace(related_old, related_new)

# Write output
with open('ai-warfare-weapons.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ FAQ page created: ai-warfare-weapons.html")
print("\nNext steps:")
print("1. python3 add_schema_markup.py")
print("2. python3 analyze_faq_llm_optimization.py")
print("3. Open in browser to verify")

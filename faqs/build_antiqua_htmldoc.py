#!/usr/bin/env python3
"""Build Antiqua et Nova as first htmldocs format Vatican resource"""

# Start with the navigation/header from existing Vatican resource
with open('../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html', 'r', encoding='utf-8') as f:
    template_lines = f.readlines()

# Find where main content starts
main_start = None
for i, line in enumerate(template_lines):
    if '<main class="main-container">' in line:
        main_start = i
        break

# Keep everything up to main content (nav, header, CSS)
header_section = ''.join(template_lines[:main_start])

# Update metadata in header
header_section = header_section.replace(
    'LVII World Day of Peace 2024 - Artificial Intelligence and Peace',
    'Antiqua et Nova (2025) - AI and Human Intelligence'
)

header_section = header_section.replace(
    "Pope's 2024 World Day of Peace message on peace, justice, and human dignity. Essential Catholic social teaching on building a more peaceful world.",
    "Vatican's comprehensive 2025 document on artificial intelligence and human intelligence. Complete Catholic teaching on AI ethics, human dignity, work, healthcare, education, and warfare."
)

header_section = header_section.replace(
    'lvii-world-day-of-peace-2024-artificial-intelligence-and-peace',
    'antiqua-et-nova-2025'
)

header_section = header_section.replace(
    'Vatican, Catholic Social Teaching, AI Ethics, Pope Francis, Human Dignity, Technology Ethics, Artificial Intelligence, Peace',
    'Antiqua et Nova, Vatican AI Ethics, Catholic Social Teaching, Pope Francis, Human Dignity, Artificial Intelligence, Human Intelligence, AI Warfare, AI Healthcare, AI Education'
)

# Add htmldocs-specific CSS
htmldoc_css = """
        /* HTMLDocs Format Specific Styles */
        .htmldoc-container {
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .htmldoc-header {
            padding: 3rem 0 2rem 0;
            border-bottom: 3px solid #dc3545;
            margin-bottom: 2rem;
        }

        .htmldoc-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #000;
            margin-bottom: 0.5rem;
            line-height: 1.2;
        }

        .htmldoc-subtitle {
            font-size: 1.3rem;
            color: #666;
            margin-bottom: 1rem;
            font-weight: 400;
        }

        .htmldoc-meta {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            color: #666;
            font-size: 0.95rem;
            padding: 1rem 0;
        }

        .htmldoc-meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .htmldoc-intro {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            margin-bottom: 3rem;
            font-size: 1.1rem;
            line-height: 1.8;
        }

        .htmldoc-toc {
            background: white;
            border: 2px solid #e5e5e5;
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 3rem;
        }

        .htmldoc-toc h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #000;
        }

        .htmldoc-toc ul {
            list-style: none;
            padding: 0;
        }

        .htmldoc-toc li {
            padding: 0.75rem 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .htmldoc-toc li:last-child {
            border-bottom: none;
        }

        .htmldoc-toc a {
            color: #333;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }

        .htmldoc-toc a:hover {
            color: #dc3545;
        }

        .htmldoc-section {
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #e5e5e5;
        }

        .htmldoc-section:last-child {
            border-bottom: none;
        }

        .htmldoc-section h2 {
            font-size: 2rem;
            color: #000;
            margin-bottom: 1.5rem;
            font-weight: 700;
        }

        .htmldoc-section h3 {
            font-size: 1.5rem;
            color: #333;
            margin: 2rem 0 1rem 0;
            font-weight: 600;
        }

        .htmldoc-section h4 {
            font-size: 1.2rem;
            color: #444;
            margin: 1.5rem 0 1rem 0;
            font-weight: 600;
        }

        .htmldoc-paragraph {
            font-size: 1.05rem;
            line-height: 1.8;
            color: #333;
            margin-bottom: 1.5rem;
        }

        .htmldoc-blockquote {
            background: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 1.5rem 2rem;
            margin: 2rem 0;
            font-style: italic;
            font-size: 1.1rem;
            color: #444;
        }

        .htmldoc-list {
            margin: 1.5rem 0;
            padding-left: 2rem;
        }

        .htmldoc-list li {
            margin-bottom: 0.75rem;
            line-height: 1.7;
            color: #333;
        }

        .htmldoc-highlight {
            background: #fff3cd;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
            margin: 2rem 0;
        }

        .htmldoc-key-teaching {
            background: #e8f5e8;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            margin: 2rem 0;
        }

        .htmldoc-warning {
            background: #fee;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            margin: 2rem 0;
        }

        .paragraph-number {
            color: #999;
            font-weight: 600;
            margin-right: 0.5rem;
        }

        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #dc3545;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
            transition: all 0.3s ease;
            display: none;
        }

        .back-to-top:hover {
            background: #c82333;
            transform: translateY(-2px);
        }

        .back-to-top.visible {
            display: block;
        }
"""

# Insert the CSS before </style>
header_section = header_section.replace('</style>', htmldoc_css + '\n    </style>')

# Create comprehensive content with full document structure
main_content = '''    <main class="main-container">
        <div class="htmldoc-container">
            <div class="htmldoc-header">
                <h1 class="htmldoc-title">Antiqua et Nova</h1>
                <h2 class="htmldoc-subtitle">Note on the Relationship Between Artificial Intelligence and Human Intelligence</h2>
                <div class="htmldoc-meta">
                    <div class="htmldoc-meta-item">
                        <span>🏛️</span>
                        <span>Dicastery for the Doctrine of the Faith & Dicastery for Culture and Education</span>
                    </div>
                    <div class="htmldoc-meta-item">
                        <span>📅</span>
                        <span>January 28, 2025</span>
                    </div>
                    <div class="htmldoc-meta-item">
                        <span>📄</span>
                        <span>117 Paragraphs</span>
                    </div>
                    <div class="htmldoc-meta-item">
                        <span>⏱️</span>
                        <span>30 min read</span>
                    </div>
                </div>
            </div>

            <div class="htmldoc-intro">
                <p><strong>Antiqua et Nova</strong> ("Ancient and New") is the most comprehensive Vatican document on artificial intelligence to date. Released on the feast of St. Thomas Aquinas, this 117-paragraph teaching addresses the anthropological and ethical challenges raised by AI across all domains of human life: work, healthcare, education, relationships, warfare, and our relationship with God.</p>
                
                <p>Co-issued by two major Vatican dicasteries and approved by Pope Francis on January 14, 2025, this document distills 40+ years of Catholic engagement with AI into a unified ethical framework grounded in human dignity, the common good, and the "wisdom of heart."</p>
            </div>

            <div class="htmldoc-toc">
                <h2>📚 Document Contents</h2>
                <ul>
                    <li><a href="#introduction">I. Introduction - Wisdom Ancient and New</a></li>
                    <li><a href="#what-is-ai">II. What is Artificial Intelligence?</a></li>
                    <li><a href="#human-intelligence">III. Intelligence in the Philosophical and Theological Tradition</a></li>
                    <li><a href="#role-of-ethics">IV. The Role of Ethics in Guiding AI Development and Use</a></li>
                    <li><a href="#specific-questions">V. Specific Questions</a>
                        <ul style="margin-left: 2rem; margin-top: 0.5rem;">
                            <li><a href="#ai-society">→ AI and Society</a></li>
                            <li><a href="#ai-relationships">→ AI and Human Relationships</a></li>
                            <li><a href="#ai-economy">→ AI, the Economy, and Labor</a></li>
                            <li><a href="#ai-healthcare">→ AI and Healthcare</a></li>
                            <li><a href="#ai-education">→ AI and Education</a></li>
                            <li><a href="#ai-misinformation">→ AI, Misinformation, Deepfakes, and Abuse</a></li>
                            <li><a href="#ai-privacy">→ AI, Privacy, and Surveillance</a></li>
                            <li><a href="#ai-environment">→ AI and Protection of Our Common Home</a></li>
                            <li><a href="#ai-warfare">→ AI and Warfare</a></li>
                            <li><a href="#ai-god">→ AI and Our Relationship with God</a></li>
                        </ul>
                    </li>
                    <li><a href="#conclusion">VI. Concluding Reflections - True Wisdom</a></li>
                </ul>
            </div>

            <!-- SECTION I: INTRODUCTION -->
            <div class="htmldoc-section" id="introduction">
                <h2>I. Introduction: Wisdom Ancient and New</h2>
                
                <p class="htmldoc-paragraph"><span class="paragraph-number">§1.</span> With wisdom both ancient and new (cf. Mt. 13:52), we are called to reflect on the current challenges and opportunities posed by scientific and technological advancements, particularly by the recent development of Artificial Intelligence (AI). The Christian tradition regards the gift of intelligence as an essential aspect of how humans are created "in the image of God" (Gen. 1:27).</p>

                <p class="htmldoc-paragraph"><span class="paragraph-number">§2.</span> The Church encourages the advancement of science, technology, the arts, and other forms of human endeavor, viewing them as part of the "collaboration of man and woman with God in perfecting the visible creation." Human abilities and creativity come from God and, when used rightly, glorify God by reflecting his wisdom and goodness.</p>

                <div class="htmldoc-key-teaching">
                    <h4>Key Teaching</h4>
                    <p>"Technological progress is part of God's plan for creation, but people must take responsibility for using technologies like artificial intelligence to help humanity and not harm individuals or groups."</p>
                </div>

                <p class="htmldoc-paragraph"><span class="paragraph-number">§4.</span> There is broad consensus that AI marks a new and significant phase in humanity's engagement with technology, placing it at the heart of what Pope Francis has described as an "epochal change." Its impact is felt globally and in a wide range of areas, including interpersonal relationships, education, work, art, healthcare, law, warfare, and international relations.</p>
            </div>

            <!-- SECTION II: WHAT IS AI -->
            <div class="htmldoc-section" id="what-is-ai">
                <h2>II. What is Artificial Intelligence?</h2>
                
                <p class="htmldoc-paragraph"><span class="paragraph-number">§7.</span> The concept of "intelligence" in AI has evolved over time, drawing on a range of ideas from various disciplines. A significant milestone occurred in 1956 when John McCarthy defined Artificial Intelligence as "that of making a machine behave in ways that would be called intelligent if a human were so behaving."</p>

                <p class="htmldoc-paragraph"><span class="paragraph-number">§8.</span> Since then, AI research has advanced rapidly, leading to the development of complex systems capable of performing highly sophisticated tasks. These "narrow AI" systems are typically designed to handle specific and limited functions, such as translating languages, predicting weather, classifying images, or generating visual content.</p>

                <div class="htmldoc-warning">
                    <h4>Critical Distinction</h4>
                    <p><span class="paragraph-number">§12.</span> <strong>AI's advanced features give it sophisticated abilities to perform tasks, but not the ability to think.</strong> This distinction is crucially important, as the way "intelligence" is defined inevitably shapes how we understand the relationship between human thought and this technology.</p>
                </div>

                <p class="htmldoc-paragraph"><span class="paragraph-number">§35.</span> As Pope Francis observes, "the very use of the word 'intelligence'" in connection with AI "can prove misleading" and risks overlooking what is most precious in the human person. <strong>AI should not be seen as an artificial form of human intelligence but as a product of it.</strong></p>
            </div>

            <!-- SECTION III: HUMAN INTELLIGENCE -->
            <div class="htmldoc-section" id="human-intelligence">
                <h2>III. Intelligence in the Philosophical and Theological Tradition</h2>
                
                <h3>Rationality</h3>
                <p class="htmldoc-paragraph"><span class="paragraph-number">§13.</span> From the dawn of human self-reflection, the mind has played a central role in understanding what it means to be "human." Aristotle observed that "all people by nature desire to know." This knowledge, with its capacity for abstraction that grasps the nature and meaning of things, sets humans apart from the animal world.</p>

                <h3>Embodiment</h3>
                <p class="htmldoc-paragraph"><span class="paragraph-number">§16.</span> Christian thought considers the intellectual faculties of the human person within the framework of an integral anthropology that views the human being as essentially embodied. The entire human person is simultaneously both material and spiritual.</p>

                <div class="htmldoc-blockquote">
                    "The soul is not merely the immaterial 'part' of the person contained within the body, nor is the body an outer shell housing an intangible 'core.' Rather, the entire human person is simultaneously both material and spiritual." (§16)
                </div>

                <h3>Relationality</h3>
                <p class="htmldoc-paragraph"><span class="paragraph-number">§18.</span> Human beings are "ordered by their very nature to interpersonal communion," possessing the capacity to know one another, to give themselves in love, and to enter into communion with others. Human intelligence is not an isolated faculty but is exercised in relationships.</p>

                <h3>An Integral Understanding of Human Intelligence</h3>
                <p class="htmldoc-paragraph"><span class="paragraph-number">§29.</span> A proper understanding of human intelligence cannot be reduced to the mere acquisition of facts or the ability to perform specific tasks. Instead, it involves the person's openness to the ultimate questions of life and reflects an orientation toward the True and the Good.</p>

                <div class="htmldoc-key-teaching">
                    <h4>Essential Teaching on Intelligence</h4>
                    <p>"True intelligence is shaped by divine love, which 'is poured forth in our hearts by the Holy Spirit' (Rom. 5:5). Human intelligence possesses an essential contemplative dimension, an unselfish openness to the True, the Good, and the Beautiful, beyond any utilitarian purpose." (§29)</p>
                </div>

                <h3>The Limits of AI</h3>
                <p class="htmldoc-paragraph"><span class="paragraph-number">§30-34.</span> While AI can perform sophisticated tasks, it remains fundamentally confined to a logical-mathematical framework. Human intelligence, in contrast:</p>
                <ul class="htmldoc-list">
                    <li>Develops organically through physical and psychological growth</li>
                    <li>Is shaped by embodied experiences and social interactions</li>
                    <li>Can exercise moral discernment and establish authentic relationships</li>
                    <li>Possesses the capacity for surprising insights and wisdom from experience</li>
                    <li>Grasps reality in all its dimensions, not just what is measurable</li>
                </ul>

                <div class="htmldoc-warning">
                    <p><span class="paragraph-number">§34.</span> "Drawing an overly close equivalence between human intelligence and AI risks succumbing to a functionalist perspective, where people are valued based on the work they can perform. However, a person's worth does not depend on possessing specific skills but on the person's inherent dignity, grounded in being created in the image of God."</p>
                </div>
            </div>

            <!-- SECTION IV: ROLE OF ETHICS -->
            <div class="htmldoc-section" id="role-of-ethics">
                <h2>IV. The Role of Ethics in Guiding AI Development and Use</h2>
                
                <p class="htmldoc-paragraph"><span class="paragraph-number">§38.</span> We can gratefully acknowledge how technology has "remedied countless evils which used to harm and limit human beings." Nevertheless, not all technological advancements in themselves represent genuine human progress. The Church is particularly opposed to those applications that threaten the sanctity of life or the dignity of the human person.</p>

                <div class="htmldoc-key-teaching">
                    <h4>Moral Responsibility</h4>
                    <p><span class="paragraph-number">§39.</span> "Between a machine and a human being, only the latter is truly a moral agent—a subject of moral responsibility who exercises freedom in his or her decisions and accepts their consequences. Only the human can be sufficiently self-aware to the point of listening and following the voice of conscience, discerning with prudence, and seeking the good that is possible in every situation."</p>
                </div>

                <p class="htmldoc-paragraph"><span class="paragraph-number">§42.</span> The ends and the means used in a given application of AI, as well as the overall vision it incorporates, must all be evaluated to ensure they respect human dignity and promote the common good.</p>

                <h3>Helping Human Freedom and Decision-Making</h3>
                
                <p class="htmldoc-paragraph"><span class="paragraph-number">§44.</span> Since full moral causality belongs only to personal agents, not artificial ones, it is crucial to be able to identify and define who bears responsibility for the processes involved in AI. <strong>Ultimate responsibility for decisions made using AI must rest with human decision-makers.</strong></p>

                <p class="htmldoc-paragraph"><span class="paragraph-number">§46.</span> Those who use AI to accomplish a task create a context in which they are ultimately responsible for the power they have delegated. Algorithms that govern AI should be trustworthy, secure, robust, transparent, and designed to mitigate biases.</p>
            </div>

            <!-- SECTION V: SPECIFIC QUESTIONS -->
            <div class="htmldoc-section" id="specific-questions">
                <h2>V. Specific Questions</h2>
                
                <!-- AI and Society -->
                <div id="ai-society">
                    <h3>AI and Society</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§51.</span> AI could "introduce important innovations in agriculture, education and culture, an improved level of life for entire nations and peoples, and the growth of human fraternity and social friendship," and thus be "used to promote integral human development."</p>

                    <div class="htmldoc-warning">
                        <p><span class="paragraph-number">§52.</span> However, Pope Francis has noted that "evidence to date suggests that digital technologies have increased inequality in our world. Not just differences in material wealth, but also differences in access to political and social influence." AI could perpetuate marginalization, create new forms of poverty, and worsen social inequalities.</p>
                    </div>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§53.</span> The concentration of power over mainstream AI applications in the hands of a few powerful companies raises significant ethical concerns. Such entities possess the capacity to exercise "forms of control as subtle as they are invasive, creating mechanisms for the manipulation of consciences and of the democratic process."</p>
                </div>

                <!-- AI and Human Relationships -->
                <div id="ai-relationships">
                    <h3>AI and Human Relationships</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§58.</span> Authentic human relationships require the richness of being with others in their pain, their pleas, and their joy. Since human intelligence is expressed and enriched also in interpersonal and embodied ways, authentic and spontaneous encounters with others are indispensable for engaging with reality in its fullness.</p>

                    <div class="htmldoc-warning">
                        <p><span class="paragraph-number">§61.</span> <strong>No AI application can genuinely experience empathy.</strong> Emotions cannot be reduced to facial expressions or phrases generated in response to prompts. True empathy requires the ability to listen, recognize another's irreducible uniqueness, and grasp the meaning behind even their silences.</p>
                    </div>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§62.</span> Misrepresenting AI as a person should always be avoided; doing so for fraudulent purposes is a grave ethical violation that could erode social trust. Using AI to deceive in education or human relationships, including sexuality, is immoral.</p>
                </div>

                <!-- AI, the Economy, and Labor -->
                <div id="ai-economy">
                    <h3>AI, the Economy, and Labor</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§67.</span> While AI promises to boost productivity, it frequently forces workers to adapt to the speed and demands of machines rather than machines being designed to support those who work. Current approaches can paradoxically deskill workers, subject them to automated surveillance, and relegate them to rigid and repetitive tasks.</p>

                    <div class="htmldoc-key-teaching">
                        <h4>The Dignity of Work</h4>
                        <p><span class="paragraph-number">§69.</span> "The order of things must be subordinate to the order of persons, and not the other way around. Human work must not only be at the service of profit but at the service of the whole human person, taking into account the person's material needs and the requirements of his or her intellectual, moral, spiritual, and religious life."</p>
                    </div>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§70.</span> Since work is "part of the meaning of life on this earth, a path to growth, human development and personal fulfillment," <strong>the goal should not be that technological progress increasingly replaces human work, for this would be detrimental to humanity—rather, it should promote human labor.</strong></p>
                </div>

                <!-- AI and Healthcare -->
                <div id="ai-healthcare">
                    <h3>AI and Healthcare</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§72.</span> AI seems to hold immense potential in medical applications, such as assisting diagnostic work, facilitating patient-staff relationships, offering new treatments, and expanding access to quality care for isolated or marginalized populations.</p>

                    <div class="htmldoc-warning">
                        <p><span class="paragraph-number">§73.</span> However, if AI is used not to enhance but to replace the relationship between patients and healthcare providers—leaving patients to interact with a machine rather than a human being—it would reduce a crucially important human relational structure. This would risk worsening the loneliness that often accompanies illness.</p>
                    </div>

                    <div class="htmldoc-key-teaching">
                        <p><span class="paragraph-number">§74.</span> <strong>"Decisions regarding patient treatment and the weight of responsibility they entail must always remain with the human person and should never be delegated to AI."</strong></p>
                    </div>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§75.</span> Using AI to determine who should receive treatment based predominantly on economic measures or metrics of efficiency represents a particularly problematic instance of the "technocratic paradigm" that must be rejected.</p>
                </div>

                <!-- AI and Education -->
                <div id="ai-education">
                    <h3>AI and Education</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§79.</span> At the center of education is the indispensable relationship between teacher and student. Teachers do more than convey knowledge; they model essential human qualities and inspire the joy of discovery. Their presence motivates students through both content and care. <strong>The physical presence of a teacher creates a relational dynamic that AI cannot replicate.</strong></p>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§81.</span> The extensive use of AI in education could lead to students' increased reliance on technology, eroding their ability to perform skills independently and worsening their dependence on screens.</p>

                    <div class="htmldoc-highlight">
                        <p><span class="paragraph-number">§82.</span> "Instead of training young people how to amass information and generate quick responses, education should encourage the responsible use of freedom to face issues with good sense and intelligence. Education in the use of AI should aim above all at promoting critical thinking."</p>
                    </div>
                </div>

                <!-- AI, Misinformation, Deepfakes -->
                <div id="ai-misinformation">
                    <h3>AI, Misinformation, Deepfakes, and Abuse</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§86.</span> AI presents a serious risk of generating manipulated content and false information. Such misinformation might occur unintentionally through AI "hallucination," where generative AI yields results that appear real but are not.</p>

                    <div class="htmldoc-warning">
                        <p><span class="paragraph-number">§87.</span> An even more troubling problem lies in the deliberate misuse of AI for manipulation through "deepfake" images, videos, and audio. The danger is particularly evident when used to target or harm others. While the images may be artificial, <strong>the damage they cause is real, leaving "deep scars in the hearts of those who suffer it."</strong></p>
                    </div>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§88.</span> By distorting "our relationship with others and with reality," AI-generated fake media can gradually undermine the foundations of society. When society becomes indifferent to truth, various groups construct their own versions of "facts," weakening the reciprocal ties that underpin social life.</p>
                </div>

                <!-- AI, Privacy, and Surveillance -->
                <div id="ai-privacy">
                    <h3>AI, Privacy, and Surveillance</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§91.</span> The Second Vatican Council included the right "to safeguard privacy" among the fundamental rights "necessary for living a genuinely human life," a right that should be extended to all people on account of their "sublime dignity."</p>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§93.</span> While there can be legitimate uses of AI for surveillance, using it for surveillance aimed at exploiting others, restricting freedom, or benefitting a few at the expense of many is unjustifiable. <strong>The risk of surveillance overreach must be monitored to ensure transparency and public accountability.</strong></p>

                    <div class="htmldoc-warning">
                        <p><span class="paragraph-number">§94.</span> "Fundamental respect for human dignity demands that we refuse to allow the uniqueness of the person to be identified with a set of data. A person's past behavior should not be used to deny him or her the opportunity to change, grow, and contribute to society. We cannot allow algorithms to limit respect for human dignity, or to exclude compassion, mercy, forgiveness, and hope that people can change."</p>
                    </div>
                </div>

                <!-- AI and the Environment -->
                <div id="ai-environment">
                    <h3>AI and the Protection of Our Common Home</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§96.</span> Current AI models and the hardware required to support them consume vast amounts of energy and water, significantly contributing to CO₂ emissions and straining resources. <strong>Words like "the cloud" can give the false impression that data is stored in an intangible realm, detached from the physical world—but AI relies on physical machines, cables, and energy.</strong></p>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§97.</span> A complete understanding of creation recognizes that the value of all created things cannot be reduced to their mere utility. A fully human approach to earth's stewardship rejects the technocratic paradigm and the "myth of progress" that assumes ecological problems will solve themselves through new technology without ethical considerations.</p>
                </div>

                <!-- AI and Warfare -->
                <div id="ai-warfare">
                    <h3>AI and Warfare</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§99.</span> While AI's analytical abilities could help nations seek peace, the "weaponization of Artificial Intelligence" is highly problematic. The ability to conduct military operations through remote control systems has led to a lessened perception of the devastation caused and burden of responsibility.</p>

                    <div class="htmldoc-key-teaching">
                        <h4>Critical Teaching on Autonomous Weapons</h4>
                        <p><span class="paragraph-number">§100.</span> <strong>"Lethal Autonomous Weapon Systems, which are capable of identifying and striking targets without direct human intervention, are a cause for grave ethical concern because they lack the unique human capacity for moral judgment and ethical decision-making."</strong></p>
                        
                        <p><span class="paragraph-number">§100.</span> Pope Francis has urgently called for a reconsideration of the development of these weapons and a prohibition on their use: <strong>"No machine should ever choose to take the life of a human being."</strong></p>
                    </div>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§102.</span> Like any tool, AI is an extension of human power, and while its future capabilities are unpredictable, humanity's past actions provide clear warnings. The atrocities committed throughout history are enough to raise deep concerns about the potential abuses of AI.</p>
                </div>

                <!-- AI and Our Relationship with God -->
                <div id="ai-god">
                    <h3>AI and Our Relationship with God</h3>
                    
                    <p class="htmldoc-paragraph"><span class="paragraph-number">§104.</span> As society drifts away from connection with the transcendent, some are tempted to turn to AI in search of meaning or fulfillment—longings that can only be truly satisfied in communion with God.</p>

                    <div class="htmldoc-warning">
                        <p><span class="paragraph-number">§105.</span> <strong>The presumption of substituting God for an artifact of human making is idolatry.</strong> AI may prove even more seductive than traditional idols because unlike idols that "have mouths but do not speak," AI can speak—or at least gives the illusion of doing so. Yet it is vital to remember that AI is but a pale reflection of humanity, crafted by human minds and sustained through human labor.</p>
                    </div>

                    <p class="htmldoc-paragraph"><span class="paragraph-number">§107.</span> In contrast to AI, human beings "by their interior life, transcend the entire material universe; they experience this deep interiority when they enter into their own heart, where God awaits them, and where they decide their own destiny in the sight of God."</p>
                </div>
            </div>

            <!-- SECTION VI: CONCLUSION -->
            <div class="htmldoc-section" id="conclusion">
                <h2>VI. Concluding Reflections: True Wisdom</h2>
                
                <p class="htmldoc-paragraph"><span class="paragraph-number">§108.</span> Pope Francis emphasized the need for growth in "human responsibility, values, and conscience," proportionate to the growth in technological potential—recognizing that "with an increase in human power comes a broadening of responsibility on the part of individuals and communities."</p>

                <div class="htmldoc-blockquote">
                    "The essential and fundamental question remains whether in the context of this progress man, as man, is becoming truly better—more mature spiritually, more aware of the dignity of his humanity, more responsible, more open to others, especially the neediest and weakest, and readier to give and to aid all." (§109)
                </div>

                <p class="htmldoc-paragraph"><span class="paragraph-number">§112.</span> A further point is the call for renewed appreciation of all that is human. The rapid pace of digitization risks a "digital reductionism," where non-quantifiable aspects of life are set aside. <strong>AI should be used only as a tool to complement human intelligence rather than replace its richness.</strong></p>

                <h3>True Wisdom</h3>
                
                <div class="htmldoc-key-teaching">
                    <p><span class="paragraph-number">§114.</span> <strong>"Only by adopting a spiritual way of viewing reality, only by recovering a wisdom of the heart, can we confront and interpret the newness of our time. This wisdom cannot be sought from machines, but it lets itself be found by those who seek it and be seen by those who love it."</strong></p>
                </div>

                <p class="htmldoc-paragraph"><span class="paragraph-number">§116.</span> Since "a person's perfection is measured not by the information or knowledge they possess, but by the depth of their charity," how we incorporate AI "to include the least of our brothers and sisters, the vulnerable, and those most in need, will be the true measure of our humanity."</p>

                <div class="htmldoc-highlight">
                    <h4>The Document's Final Call</h4>
                    <p><span class="paragraph-number">§117.</span> From the perspective of wisdom, believers will be able to act as moral agents capable of using this technology to promote an authentic vision of the human person and society. This should be done with the understanding that technological progress is part of God's plan for creation—an activity that we are called to order toward the Paschal Mystery of Jesus Christ, in the continual search for the True and the Good.</p>
                </div>
            </div>

            <!-- Document Info & Links -->
            <div class="htmldoc-section">
                <h2>📖 About This Document</h2>
                
                <div class="htmldoc-paragraph">
                    <p><strong>Signed by:</strong></p>
                    <ul class="htmldoc-list">
                        <li>Víctor Manuel Card. Fernández, Prefect of the Dicastery for the Doctrine of the Faith</li>
                        <li>José Card. Tolentino de Mendonça, Prefect of the Dicastery for Culture and Education</li>
                        <li>Msgr. Armando Matteo, Secretary, Doctrinal Section</li>
                        <li>Most Rev. Paul Tighe, Secretary, Culture Section</li>
                    </ul>
                </div>

                <p class="htmldoc-paragraph"><strong>Approved by:</strong> Pope Francis, January 14, 2025</p>
                <p class="htmldoc-paragraph"><strong>Released:</strong> January 28, 2025 (Feast of St. Thomas Aquinas)</p>
                <p class="htmldoc-paragraph"><strong>Official Source:</strong> <a href="https://www.vatican.va/roman_curia/congregations/cfaith/documents/rc_ddf_doc_20250128_antiqua-et-nova_en.html" target="_blank" rel="noopener">Read the complete document at Vatican.va</a></p>
            </div>

            <div class="back-link-section" style="padding: 2rem 0; border-top: 2px solid #e5e5e5; margin-top: 3rem;">
                <a href="../public/dcf_ai_resources.html" class="btn btn-primary">← Back to Vatican Resources</a>
            </div>
        </div>

        <a href="#" class="back-to-top" id="backToTop">↑ Top</a>
    </main>

    <script>
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Smooth scroll for TOC links
        document.querySelectorAll('.htmldoc-toc a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    </script>
'''

# Find footer section
footer_start = None
for i in range(len(template_lines) - 1, len(template_lines) - 500, -1):
    if '</main>' in template_lines[i]:
        footer_start = i + 1
        break

if not footer_start:
    print("❌ Could not find footer")
    exit(1)

footer_section = ''.join(template_lines[footer_start:])

# Combine all parts
full_html = header_section + main_content + footer_section

# Write final file
with open('../vatican-resources/antiqua-et-nova-2025.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

print("✅ Created first htmldocs format Vatican resource")
print("   File: antiqua-et-nova-2025.html")
print("   Format: htmldocs (full HTML document)")
print("   Optimized for: LLM/AI search, human readability, internal linking")

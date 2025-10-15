#!/usr/bin/env python3
"""Add Antiqua et Nova content to the page"""

# Read the template
with open('../vatican-resources/antiqua-et-nova-2025.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the content area (around line 2414-2420)
content_start = None
for i, line in enumerate(lines):
    if '<main class="main-container">' in line:
        content_start = i
        break

if not content_start:
    print("❌ Could not find content area")
    exit(1)

# Create the new content
new_content = '''    <main class="main-container">
        <div class="content-area">
            <div class="document-header">
                <h1>Antiqua et Nova</h1>
                <h2>Note on the Relationship Between Artificial Intelligence and Human Intelligence</h2>
                <p class="document-meta">Dicastery for the Doctrine of the Faith and Dicastery for Culture and Education | January 28, 2025</p>
            </div>

            <div class="document-intro">
                <p><strong>Antiqua et Nova</strong> (Latin for "Ancient and New") is the Vatican's most comprehensive document on artificial intelligence, released January 28, 2025. This landmark 117-paragraph teaching addresses the anthropological and ethical challenges raised by AI across all aspects of human life.</p>
                
                <p>Co-issued by the Dicastery for the Doctrine of the Faith and the Dicastery for Culture and Education, this document provides the Church's definitive framework for understanding AI's impact on human dignity, work, relationships, education, healthcare, warfare, and our relationship with God.</p>
            </div>

            <div class="document-toc">
                <h3>Document Structure</h3>
                <ul>
                    <li><strong>I. Introduction</strong> - The Christian perspective on technological advancement</li>
                    <li><strong>II. What is Artificial Intelligence?</strong> - Understanding AI capabilities and limitations</li>
                    <li><strong>III. Intelligence in the Philosophical and Theological Tradition</strong> - Human intelligence as created in God's image</li>
                    <li><strong>IV. The Role of Ethics in Guiding AI Development</strong> - Moral responsibility and human agency</li>
                    <li><strong>V. Specific Questions</strong> - AI's impact on society, work, healthcare, education, and warfare</li>
                    <li><strong>VI. Concluding Reflections</strong> - The call for wisdom of heart</li>
                </ul>
            </div>

            <div class="key-teachings">
                <h3>Key Teachings from Antiqua et Nova</h3>
                
                <div class="teaching-section">
                    <h4>On Human Intelligence vs. AI</h4>
                    <blockquote>
                        "A proper understanding of human intelligence cannot be reduced to the mere acquisition of facts or the ability to perform specific tasks. Instead, it involves the person's openness to the ultimate questions of life and reflects an orientation toward the True and the Good." (§29)
                    </blockquote>
                    <p>The document emphasizes that while AI can perform sophisticated tasks, it fundamentally differs from human intelligence, which involves embodiment, relationality, and openness to transcendent truth.</p>
                </div>

                <div class="teaching-section">
                    <h4>On AI and Human Dignity</h4>
                    <blockquote>
                        "The intrinsic dignity of each human being and the fraternity that binds us together as members of the one human family must undergird the development of new technologies and serve as indisputable criteria for evaluating them before they are employed." (§50)
                    </blockquote>
                    <p>Human dignity—not efficiency or profit—must be the primary criterion for AI development and deployment.</p>
                </div>

                <div class="teaching-section">
                    <h4>On AI and Work</h4>
                    <blockquote>
                        "Work is not only a means of earning one's daily bread but is also an essential dimension of social life and a means of personal growth, the building of healthy relationships, self-expression and the exchange of gifts." (§69)
                    </blockquote>
                    <p>The document warns against AI eliminating human work and calls for technology that complements rather than replaces human labor.</p>
                </div>

                <div class="teaching-section">
                    <h4>On Autonomous Weapons</h4>
                    <blockquote>
                        "No machine should ever choose to take the life of a human being. Lethal Autonomous Weapon Systems are a cause for grave ethical concern because they lack the unique human capacity for moral judgment and ethical decision-making." (§100)
                    </blockquote>
                    <p>Pope Francis urgently calls for a prohibition on autonomous weapons that can kill without direct human intervention.</p>
                </div>

                <div class="teaching-section">
                    <h4>On AI and Relationships</h4>
                    <blockquote>
                        "Authentic human relationships require the richness of being with others in their pain, their pleas, and their joy. Since human intelligence is expressed and enriched also in interpersonal and embodied ways, authentic and spontaneous encounters with others are indispensable." (§58)
                    </blockquote>
                    <p>AI cannot replace genuine human relationships, which require empathy, presence, and the capacity for authentic encounter.</p>
                </div>

                <div class="teaching-section">
                    <h4>On AI and Truth</h4>
                    <blockquote>
                        "By distorting our relationship with others and with reality, AI-generated fake media can gradually undermine the foundations of society. When society becomes indifferent to the truth, various groups construct their own versions of facts." (§88)
                    </blockquote>
                    <p>The document addresses deepfakes and misinformation as threats to social trust and the common good.</p>
                </div>

                <div class="teaching-section">
                    <h4>On the Wisdom of Heart</h4>
                    <blockquote>
                        "Only by adopting a spiritual way of viewing reality, only by recovering a wisdom of the heart, can we confront and interpret the newness of our time. This wisdom cannot be sought from machines." (§114)
                    </blockquote>
                    <p>The document concludes by calling for a "wisdom of heart" that enables us to use AI in service of human dignity and the common good.</p>
                </div>
            </div>

            <div class="document-themes">
                <h3>Major Themes</h3>
                <ul>
                    <li><strong>Human Dignity:</strong> AI must always respect the inherent worth of every person created in God's image</li>
                    <li><strong>Embodiment:</strong> Human intelligence is inseparable from our bodily existence and lived experience</li>
                    <li><strong>Relationality:</strong> Humans are fundamentally social beings; AI cannot replace authentic relationships</li>
                    <li><strong>Truth:</strong> AI-generated content must not undermine trust in reality and truth</li>
                    <li><strong>Work:</strong> Technology should serve human labor, not replace it</li>
                    <li><strong>Moral Agency:</strong> Only humans can exercise moral judgment and bear responsibility</li>
                    <li><strong>Common Good:</strong> AI development must benefit all, especially the vulnerable</li>
                    <li><strong>Wisdom:</strong> Technical knowledge must be guided by wisdom of heart</li>
                </ul>
            </div>

            <div class="practical-applications">
                <h3>Practical Guidance for Different Audiences</h3>
                
                <h4>For AI Developers</h4>
                <ul>
                    <li>Build truth-safeguards into AI systems</li>
                    <li>Enable detection through watermarking</li>
                    <li>Prevent malicious use</li>
                    <li>Ensure transparency in AI operations</li>
                    <li>Accept responsibility for foreseeable harms</li>
                </ul>

                <h4>For Employers</h4>
                <ul>
                    <li>Use AI to complement human workers, not replace them</li>
                    <li>Respect workers' dignity and agency</li>
                    <li>Avoid subjecting workers to automated surveillance</li>
                    <li>Ensure humans control the pace of work, not machines</li>
                </ul>

                <h4>For Healthcare Providers</h4>
                <ul>
                    <li>Never delegate life-and-death decisions to AI</li>
                    <li>Use AI to enhance, not replace, patient-provider relationships</li>
                    <li>Ensure equitable access to AI-enhanced healthcare</li>
                    <li>Maintain human moral responsibility for patient care</li>
                </ul>

                <h4>For Educators</h4>
                <ul>
                    <li>Teach critical thinking about AI-generated content</li>
                    <li>Foster genuine intellectual development, not just information retrieval</li>
                    <li>Maintain essential teacher-student relationships</li>
                    <li>Help students develop discernment and wisdom</li>
                </ul>

                <h4>For All Users</h4>
                <ul>
                    <li>Verify information before sharing</li>
                    <li>Be aware of AI's limitations and biases</li>
                    <li>Protect privacy and personal data</li>
                    <li>Don't treat AI as a substitute for human relationships</li>
                    <li>Advocate for ethical AI policies</li>
                </ul>
            </div>

            <div class="document-significance">
                <h3>Why Antiqua et Nova Matters</h3>
                <p>This document represents:</p>
                <ul>
                    <li>The Vatican's most comprehensive statement on AI to date</li>
                    <li>40+ years of Church engagement with AI development distilled into one framework</li>
                    <li>Moral guidance that bridges ancient wisdom with emerging technology</li>
                    <li>A call for "wisdom of heart" to guide technological progress</li>
                    <li>Specific ethical principles for AI across all domains of life</li>
                </ul>
                <p>Released on the feast of St. Thomas Aquinas (January 28, 2025), the document intentionally connects classical Christian philosophy with contemporary technological challenges.</p>
            </div>

            <div class="download-section">
                <h3>Access the Full Document</h3>
                <p><strong>Official Vatican Source:</strong> <a href="https://www.vatican.va/roman_curia/congregations/cfaith/documents/rc_ddf_doc_20250128_antiqua-et-nova_en.html" target="_blank" rel="noopener">Read the complete text at Vatican.va</a></p>
                <p class="document-meta">117 paragraphs | Available in English, Italian, Spanish, French, German</p>
            </div>

            <div class="related-resources">
                <h3>Related Vatican Documents</h3>
                <ul>
                    <li><a href="lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html">World Day of Peace 2024: AI and Peace</a></li>
                    <li><a href="lviii-world-communications-day-2024-artificial-intelligence-and-the-wisdom-of-the-heart-towards-a-fu.html">World Communications Day 2024: AI and Wisdom of Heart</a></li>
                    <li><a href="participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html">Pope Francis at G7 Summit on AI</a></li>
                </ul>
            </div>

            <div class="back-link-section">
                <a href="../public/dcf_ai_resources.html" class="back-link">← Back to All Vatican Resources</a>
            </div>
        </div>
    </main>
'''

# Find where to insert (after finding main-container, look for next few lines to replace)
# We'll replace from content_start to the closing </main> tag
main_end = None
for i in range(content_start, min(content_start + 500, len(lines))):
    if '</main>' in lines[i]:
        main_end = i + 1
        break

if not main_end:
    print("❌ Could not find end of main section")
    exit(1)

# Replace the content
new_lines = lines[:content_start] + [new_content + '\n'] + lines[main_end:]

# Write output
with open('../vatican-resources/antiqua-et-nova-2025.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ Added Antiqua et Nova content")
print(f"   Replaced lines {content_start}-{main_end}")

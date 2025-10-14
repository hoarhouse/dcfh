#!/usr/bin/env python3
"""
MASTER FAQ BUILDER TEMPLATE V2.0
Updated with all LLM optimization requirements
Copy this file and customize for each new FAQ topic

REQUIREMENTS CHECKLIST:
✅ Title: 50-60 characters with "Catholic" + "AI" keywords
✅ Meta Description: 150-160 characters with keywords
✅ 15 questions minimum (natural language: what/how/why/can/should)
✅ Answers: 250+ characters each with detail and examples
✅ Vatican citations: 3-5 per page in <vatican-quote> divs
✅ Case studies: 2-4 per page in <case-study> divs
✅ Internal links: 3+ to other FAQ pages
✅ FAQ Schema: Auto-added after build (separate script)
✅ Hero section placeholders: Must be replaced
✅ Every question MUST have <p class="faq-answer"> before any other elements
"""

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ============================================================================
# CONFIGURATION - CUSTOMIZE THESE VALUES
# ============================================================================

TOPIC = "Your Topic Name"  # e.g., "Privacy & Surveillance"
FILENAME = "your-topic-slug.html"  # e.g., "ai-privacy-surveillance.html"
ICON = "🎯"  # Emoji for the topic

# SEO - CRITICAL: Must meet character requirements
TITLE = "AI [Topic]: Catholic Church Teaching - DCF Hungary"  # 50-60 chars
META_DESC = "Catholic Church teaching on AI [topic] and [aspect]. Vatican guidance on [key concepts] and [important points]."  # 150-160 chars

# Display titles
HERO_TITLE = "AI [Topic] & [Aspect]"
HERO_SUBTITLE = "Catholic teaching on [key concept] and [main focus] in [context]"

# Table of Contents - 5 sections with 3 questions each = 15 total
TOC_SECTIONS = [
    ("section1", "Understanding AI [Topic]", 3),
    ("section2", "Catholic Teaching on [Principle]", 3),
    ("section3", "Real-World [Impact/Examples]", 3),
    ("section4", "Protecting [What/Whom]", 3),
    ("section5", "The Catholic Response", 3)
]

# Related FAQs for bottom of page
RELATED_FAQS = [
    "Deepfakes & Misinformation",
    "AI Bias & Fairness", 
    "AI in Healthcare"
]

# ============================================================================
# BUILD FAQ CONTENT - CUSTOMIZE THIS SECTION
# ============================================================================

FAQ_CONTENT = '''        <!-- FAQ Section 1 -->
        <div class="faq-section" id="section1">
            <h2>Understanding AI [Topic]</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is [main concept] and why does it matter?</h3>
                <p class="faq-answer">CRITICAL: This paragraph MUST be 250+ characters. Provide detailed explanation with context, examples, and implications. Explain the core concept clearly, then connect it to Catholic teaching and human dignity. Include specific examples where possible.</p>
                
                <div class="highlight-box">
                    <strong>Key Point:</strong> Important detail that emphasizes a critical aspect
                </div>

                <p class="faq-answer">Continue with additional detail, connecting to real-world applications and Church teaching.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does [technology/system] actually work?</h3>
                <p class="faq-answer">250+ character explanation with technical clarity AND moral implications. Break down complex concepts, use analogies, provide concrete examples.</p>

                <div class="case-study">
                    <h3>Real-World Example: [Title]</h3>
                    <p><strong>What Happened:</strong> Describe specific situation or case</p>
                    <p><strong>The Problem/Impact:</strong> Explain the harm or ethical issue</p>
                    <p><strong>The Lesson:</strong> Connect to Catholic teaching</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Why is [aspect] particularly concerning?</h3>
                <p class="faq-answer">250+ character answer explaining specific concerns, grounded in both facts and Catholic moral framework.</p>
            </div>
        </div>

        <!-- FAQ Section 2 -->
        <div class="faq-section" id="section2">
            <h2>Catholic Teaching on [Principle]</h2>

            <div class="faq-item">
                <h3 class="faq-question">What does Catholic Social Teaching say about [topic]?</h3>
                <p class="faq-answer">250+ character answer explaining CST principles (human dignity, common good, solidarity, subsidiarity, etc.) as they apply to this topic.</p>

                <div class="vatican-quote">
                    "Direct quote from Vatican document that supports the teaching."
                    <cite>— Document Name (Year)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Is [action/technology] morally wrong according to the Church?</h3>
                <p class="faq-answer">250+ character nuanced answer. Explain the moral framework, distinguish between legitimate and illegitimate uses, provide clarity without oversimplifying.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does [principle] apply to modern [technology]?</h3>
                <p class="faq-answer">250+ character answer bridging timeless principles with contemporary challenges.</p>
            </div>
        </div>

        <!-- FAQ Section 3 -->
        <div class="faq-section" id="section3">
            <h2>Real-World [Impact/Harms]</h2>

            <div class="faq-item">
                <h3 class="faq-question">What are concrete examples of [harm/abuse]?</h3>
                <p class="faq-answer">250+ character introduction to real-world cases and documented harms.</p>

                <div class="case-study">
                    <h3>Case Study: [Specific Example]</h3>
                    <p><strong>The Situation:</strong> What happened</p>
                    <p><strong>The Impact:</strong> Who was harmed and how</p>
                    <p><strong>The Catholic Response:</strong> What Church teaching says</p>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How does [issue] affect vulnerable populations?</h3>
                <p class="faq-answer">250+ character answer emphasizing preferential option for the poor and protection of the vulnerable.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Can [technology] be used ethically?</h3>
                <p class="faq-answer">250+ character balanced answer: acknowledge both legitimate uses and serious concerns, provide criteria for ethical use.</p>
            </div>
        </div>

        <!-- FAQ Section 4 -->
        <div class="faq-section" id="section4">
            <h2>Protecting [What/Whom]</h2>

            <div class="faq-item">
                <h3 class="faq-question">How can individuals protect themselves from [threat]?</h3>
                <p class="faq-answer">250+ character practical guidance. Be specific and actionable while connecting to Catholic principles of prudence and self-protection.</p>

                <div class="highlight-box">
                    <strong>Practical Steps:</strong>
                    <ul class="faq-answer">
                        <li>Specific action 1 with brief explanation</li>
                        <li>Specific action 2 with brief explanation</li>
                        <li>Specific action 3 with brief explanation</li>
                    </ul>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What should Catholic institutions do about [issue]?</h3>
                <p class="faq-answer">250+ character guidance for Catholic organizations, schools, hospitals, charities regarding this technology/issue.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">Should there be laws or regulations about [topic]?</h3>
                <p class="faq-answer">250+ character answer on role of government and policy, grounded in CST principles of subsidiarity and the common good.</p>
            </div>
        </div>

        <!-- FAQ Section 5 -->
        <div class="faq-section" id="section5">
            <h2>The Catholic Response</h2>

            <div class="faq-item">
                <h3 class="faq-question">What moral obligations do [developers/companies/users] have?</h3>
                <p class="faq-answer">250+ character answer clearly stating moral responsibilities of different actors in this space.</p>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">How should Catholics think about and engage with [technology]?</h3>
                <p class="faq-answer">250+ character pastoral guidance for faithful Catholics navigating this issue in their daily lives.</p>

                <div class="vatican-quote">
                    "Relevant Vatican quote providing hope and direction."
                    <cite>— Document Name (Year)</cite>
                </div>
            </div>

            <div class="faq-item">
                <h3 class="faq-question">What's the Catholic vision for [topic] in the AI age?</h3>
                <p class="faq-answer">250+ character hopeful conclusion. Not just what to avoid, but what to build toward. Paint a vision of technology serving human flourishing and dignity.</p>
            </div>
        </div>

'''

# ============================================================================
# AUTOMATED REPLACEMENTS - DON'T EDIT BELOW THIS LINE
# ============================================================================

# Meta and SEO
html = html.replace('[YOUR FAQ TITLE]', TITLE)
html = html.replace('[150-160 character description with target keywords]', META_DESC)

# Hero section
html = html.replace('🤖', ICON)
html = html.replace('Catholic Church on [Topic]', HERO_TITLE)
html = html.replace('Comprehensive answers about Catholic teaching on [topic description]', HERO_SUBTITLE)

# CRITICAL: Fix hero page-title/subtitle placeholders
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   f'<h1 class="page-title">{HERO_TITLE}</h1>')
html = html.replace('<p class="page-subtitle">[Brief description of what this FAQ covers - keep compelling and scannable]</p>',
                   f'<p class="page-subtitle">{HERO_SUBTITLE}</p>')

# Table of Contents
toc_html = ""
for section_id, section_name, q_count in TOC_SECTIONS:
    toc_html += f'                <li><a href="#{section_id}">{section_name} ({q_count} questions)</a></li>\n'

old_toc = '''                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->'''

html = html.replace(old_toc, toc_html.rstrip())

# FAQ Content
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')
html = html[:insert_point] + FAQ_CONTENT + '\n' + html[end_point:]

# Related FAQs
html = html.replace('[FAQ Title 1]', RELATED_FAQS[0])
html = html.replace('[FAQ Title 2]', RELATED_FAQS[1])
html = html.replace('[FAQ Title 3]', RELATED_FAQS[2])

# Write output
with open(FILENAME, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ FAQ page created: {FILENAME}")
print(f"\n📋 NEXT STEPS:")
print(f"1. Review {FILENAME} and customize placeholder content")
print(f"2. Ensure all answers are 250+ characters")
print(f"3. Add 3-5 Vatican citations throughout")
print(f"4. Include 2-4 real-world case studies")
print(f"5. Run: python3 add_schema_markup.py")
print(f"6. Verify title length: {len(TITLE)} chars (target: 50-60)")
print(f"7. Verify meta desc length: {len(META_DESC)} chars (target: 150-160)")
print(f"8. Add card to index.html")
print(f"9. Test in browser")
print(f"10. Commit and push")

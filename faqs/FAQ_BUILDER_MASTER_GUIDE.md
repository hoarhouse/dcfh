# FAQ BUILDER MASTER GUIDE
## Complete Guide for Building LLM-Optimized FAQ Pages for DCF Hungary

---

## 1. OVERVIEW

### Purpose of FAQ System
The DCF Hungary FAQ system provides authoritative answers about Catholic Church teaching on AI and technology topics. These pages are optimized for:
- **LLM/AI search discovery** - Structured for machine reading and extraction
- **SEO performance** - Rich snippets and featured answers in search results
- **User navigation** - Clear, scannable format with consistent structure
- **Vatican authority** - Direct links to official Church documents

### File Naming Convention
**REQUIRED FORMAT**: `topic-name-faq.html`
- Must end with `-faq.html` (not just `.html`)
- Use lowercase and hyphens
- Examples:
  - ✅ `ai-healthcare-faq.html`
  - ✅ `vatican-rome-call-ai-ethics-faq.html`
  - ❌ `ai-healthcare.html` (missing -faq)
  - ❌ `AI_Healthcare_FAQ.html` (wrong format)

---

## 2. PREREQUISITES

### Required Files
Before building any FAQ, ensure you have:
1. **`_FAQ_TEMPLATE.html`** - Master template (never modify directly)
2. **`all_faq_pages.txt`** - List of existing FAQs for cross-linking
3. **`all_htmldocs.txt`** - Vatican htmldocs for resource linking
4. **`all_vatican_resources.txt`** - Main Vatican resources for citations

### Tools Needed
- **Python 3.x** - For running builder scripts
- **Text editor** - For content creation
- **Web browser** - For testing

---

## 3. STEP-BY-STEP BUILD PROCESS

### Step 3.1: Plan Your Content
Before coding, prepare:
- **Topic title** (50-60 chars including "FAQ")
- **Meta description** (150-160 chars with keywords)
- **Icon emoji** (e.g., 🎭, ⚕️, ⚖️)
- **Hero subtitle** (one compelling sentence)
- **5 sections** with 3 questions each (15 total)
- **Vatican resources** (4-5 relevant documents)
- **Related FAQs** (3-4 related pages)

### Step 3.2: Create Builder Script
Create `build_[topic]-faq.py`:

```python
#!/usr/bin/env python3
"""
Build [Topic] FAQ page with full LLM optimization
"""

# Read template - ALWAYS start from template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA REPLACEMENTS ===
html = html.replace('[YOUR FAQ TITLE]', 'Your Title Here - FAQ')
html = html.replace('[150-160 character description with target keywords]', 
    'Your meta description with keywords for SEO')

# === HERO SECTION ===
html = html.replace('🤖', '⚕️')  # Your icon
html = html.replace('Catholic Church on [Topic]', 'Your Display Title')
html = html.replace('Comprehensive answers about Catholic teaching on [topic description]', 
    'Your compelling subtitle here')

# === CRITICAL FIX: Hero Page Title/Subtitle ===
# The template has these in TWO places - must replace both!
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   '<h1 class="page-title">Your Display Title</h1>')
html = html.replace('<p class="page-subtitle">[Brief description of what this FAQ covers - keep compelling and scannable]</p>',
                   '<p class="page-subtitle">Your compelling subtitle here</p>')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#understanding">Understanding [Topic] (3 questions)</a></li>
                <li><a href="#ethics">Ethical Implications (3 questions)</a></li>
                <li><a href="#vatican">Vatican Teaching (3 questions)</a></li>
                <li><a href="#practical">Practical Applications (3 questions)</a></li>
                <li><a href="#future">Future Considerations (3 questions)</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
# Find the insertion points
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

# Your complete FAQ content (15 questions, 5 sections)
faq_content = """        <!-- FAQ Section 1 -->
        <div class="faq-section" id="understanding">
            <h2>Understanding [Topic]</h2>

            <div class="faq-item">
                <h3 class="faq-question">What is [specific aspect]?</h3>
                <p class="faq-answer">Your answer must be at least 250 characters long to provide sufficient context for LLMs and search engines. Include specific examples, Church teaching references, and practical implications. This ensures comprehensive understanding.</p>
            </div>

            <!-- Add 2 more questions -->
        </div>

        <!-- Continue with 4 more sections -->
        """

# Replace placeholder content with your actual content
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === ADD STANDARD BOTTOM SECTIONS ===
# These are REQUIRED for all FAQ pages

# Find where to insert (before </main>)
main_close = html.find('</main>')

bottom_sections = """
        <!-- Additional Resources from Vatican Archives -->
        <div class="faq-section" id="additional-resources">
            <h2>📚 Additional Vatican Resources</h2>
            
            <div class="faq-item">
                <h3 class="faq-question">Where can I find more Vatican documents on this topic?</h3>
                <p class="faq-answer">For deeper understanding from official Vatican sources, explore these documents:</p>
                
                <ul class="faq-answer">
                    <li><a href="../vatican-resources/htmldocs/[doc1].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Title 1]</a> - [Description]</li>
                    <li><a href="../vatican-resources/htmldocs/[doc2].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Title 2]</a> - [Description]</li>
                    <li><a href="../vatican-resources/htmldocs/[doc3].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Title 3]</a> - [Description]</li>
                    <li><a href="../vatican-resources/htmldocs/[doc4].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Title 4]</a> - [Description]</li>
                </ul>
                
                <p class="faq-answer">These documents provide official Vatican perspectives, historical context, and theological foundations for understanding AI ethics from a Catholic perspective.</p>
            </div>
        </div>

        <!-- Related FAQs Section -->
        <div class="faq-section" id="related">
            <h2>Related FAQs</h2>
            <p class="faq-answer">Explore these related topics to deepen your understanding:</p>
            
            <ul class="faq-answer">
                <li><a href="[faq1]-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 1]</a> - [Brief description]</li>
                <li><a href="[faq2]-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 2]</a> - [Brief description]</li>
                <li><a href="[faq3]-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title 3]</a> - [Brief description]</li>
            </ul>
        </div>

        <!-- Back Link -->
        <div class="faq-section">
            <a href="https://hoarhouse.github.io/dcfh/faqs/index.html" class="back-link">← Back to All FAQs</a>
        </div>
    """

html = html[:main_close] + bottom_sections + html[main_close:]

# Write output file
output_file = 'your-topic-faq.html'  # Must end with -faq.html!
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ FAQ page created: {output_file}")
```

### Step 3.3: Run and Test
```bash
# Run builder
python3 build_your-topic-faq.py

# Verify structure
grep "dcf-ui.js" your-topic-faq.html  # Should find navigation script
grep "FAQ" your-topic-faq.html | head -3  # Should see title with FAQ

# Open in browser
open your-topic-faq.html
```

---

## 4. CONTENT REQUIREMENTS

### Structure Standards
- **15 questions minimum** (3 per section × 5 sections)
- **5 sections** with clear topics
- **Section IDs** must match TOC links (e.g., `id="understanding"`)

### Question Format
- **Must end with `?`** (required for FAQ schema)
- **Natural language** - Start with: What, How, Why, Can, Should, Does, Is
- **Specific and searchable** - Not generic

Good examples:
- ✅ "What does the Catholic Church teach about AI consciousness?"
- ✅ "How can healthcare providers ensure AI respects human dignity?"
- ❌ "AI Ethics?" (too vague)
- ❌ "The Church's position" (not a question)

### Answer Requirements
**CRITICAL**: Every answer MUST be 250+ characters

```html
<!-- CORRECT: Answer paragraph comes FIRST -->
<div class="faq-item">
    <h3 class="faq-question">Your question here?</h3>
    <p class="faq-answer">Your answer must be at least 250 characters. Include context, examples, Church teaching, and practical implications. This length ensures LLMs and search engines have enough content to understand the topic comprehensively.</p>
    
    <!-- Optional: Add supporting elements AFTER the main answer -->
    <div class="highlight-box">
        <strong>Key Point:</strong> Additional emphasis here
    </div>
</div>

<!-- WRONG: Missing answer paragraph -->
<div class="faq-item">
    <h3 class="faq-question">Your question?</h3>
    <div class="highlight-box">  <!-- Can't start with this -->
        Content here
    </div>
</div>
```

---

## 5. STANDARD BOTTOM SECTIONS (REQUIRED)

Every FAQ page MUST include these three sections at the bottom:

### 5.1: Additional Vatican Resources
```html
<!-- Additional Resources from Vatican Archives -->
<div class="faq-section" id="additional-resources">
    <h2>📚 Additional Vatican Resources</h2>
    
    <div class="faq-item">
        <h3 class="faq-question">Where can I find more Vatican documents on this topic?</h3>
        <p class="faq-answer">For deeper understanding from official Vatican sources, explore these documents:</p>
        
        <ul class="faq-answer">
            <li><a href="../vatican-resources/htmldocs/[filename].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Document Title]</a> - [Brief description]</li>
            <!-- Add 3-4 more documents -->
        </ul>
        
        <p class="faq-answer">These documents provide official Vatican perspectives, historical context, and theological foundations for understanding AI ethics from a Catholic perspective.</p>
    </div>
</div>
```

### 5.2: Related FAQs
```html
<!-- Related FAQs Section -->
<div class="faq-section" id="related">
    <h2>Related FAQs</h2>
    <p class="faq-answer">Explore these related topics to deepen your understanding:</p>
    
    <ul class="faq-answer">
        <li><a href="[faq-file]-faq.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title]</a> - [Brief description]</li>
        <!-- Add 2-3 more FAQs -->
    </ul>
</div>
```

### 5.3: Back Link
```html
<!-- Back Link -->
<div class="faq-section">
    <a href="https://hoarhouse.github.io/dcfh/faqs/index.html" class="back-link">← Back to All FAQs</a>
</div>
```

### Required Style Attributes
All links MUST include: `style="color: #0066cc; text-decoration: none; font-weight: 600;"`

---

## 6. INTELLIGENT LINKING

### Selecting Vatican Documents (from all_htmldocs.txt)
Match documents by topic relevance:

| FAQ Topic | Relevant Vatican Documents |
|-----------|---------------------------|
| AI Consciousness | antiqua-et-nova-2025.html, pope-francis-minerva-dialogues-2023.html |
| AI Bias/Fairness | pope-francis-world-communications-day-2024.html, ethics-in-internet-2002.html |
| AI Warfare | pope-francis-paris-ai-summit-february-2025.html, pope-leo-xiv-un-ai-summit-july-2025.html |
| Digital Privacy | church-and-internet-2002.html, towards-full-presence-social-media-2023.html |
| AI & Work | pope-francis-centesimus-annus-ai-june-2024.html, pope-leo-xiv-cardinals-address-may-2025.html |

### Selecting Related FAQs (from all_faq_pages.txt)
Create logical connections:

| Primary FAQ | Related FAQs |
|------------|--------------|
| ai-healthcare-faq.html | ai-consciousness-souls-faq.html, ai-bias-fairness-faq.html, catholic-ai-ethics-faq.html |
| ai-warfare-weapons-faq.html | ai-consciousness-souls-faq.html, vatican-un-security-council-ai-2025-faq.html |
| ai-companions-relationships-faq.html | ai-consciousness-souls-faq.html, deepfakes-misinformation-faq.html |

### Path Structure
- **Vatican htmldocs**: `../vatican-resources/htmldocs/[filename].html`
- **Vatican resources**: `../vatican-resources/[filename].html`
- **Other FAQs**: `[filename]-faq.html` (same directory)
- **Blog posts**: `../blog/[blog-name]/[post-slug].html`

---

## 7. LLM OPTIMIZATION CHECKLIST (V2.0)

### File & Structure
- [ ] Filename ends with `-faq.html`
- [ ] Title tag includes "FAQ" or "Frequently Asked Questions"
- [ ] Meta description is 150-160 characters
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] All sections have unique IDs

### Content Quality
- [ ] Minimum 15 questions (3 per section)
- [ ] All questions end with `?`
- [ ] All answers are 250+ characters
- [ ] First paragraph uses `<p class="faq-answer">`
- [ ] Natural language questions (what/how/why)

### Linking & Authority
- [ ] 4-5 Vatican resource links
- [ ] 3-4 related FAQ links
- [ ] Back to index link
- [ ] All links use required styling
- [ ] Internal links throughout content (3+ minimum)

### Technical
- [ ] No template placeholders remain
- [ ] Navigation loads from dcf-ui.js
- [ ] Mobile responsive
- [ ] Opens correctly in browser

---

## 8. COMMON MISTAKES & SOLUTIONS

### Mistake #1: Forgetting Hero Replacements
**Problem**: Template has hero title/subtitle in TWO places

**Solution**: Must replace both:
```python
# Replace in <title> tag
html = html.replace('[YOUR FAQ TITLE]', 'Your Title - FAQ')

# ALSO replace in hero section (often forgotten!)
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   '<h1 class="page-title">Your Title</h1>')
html = html.replace('<p class="page-subtitle">[Brief description...]</p>',
                   '<p class="page-subtitle">Your subtitle</p>')
```

### Mistake #2: Answers Too Short
**Problem**: Answers under 250 characters hurt SEO/LLM understanding

**Bad**:
```html
<p class="faq-answer">AI bias is unfair discrimination.</p>
```

**Good**:
```html
<p class="faq-answer">AI bias occurs when artificial intelligence systems make unfair or discriminatory decisions based on protected characteristics like race, gender, age, or socioeconomic status. Unlike human prejudice which can be conscious, AI bias is typically unintentional—embedded through biased training data or flawed algorithms that perpetuate historical discrimination patterns.</p>
```

### Mistake #3: Wrong Filename Format
**Problem**: Missing `-faq` in filename

**Wrong**: `ai-healthcare.html`
**Right**: `ai-healthcare-faq.html`

### Mistake #4: Missing Bottom Sections
**Problem**: Forgetting required Vatican resources and related FAQs

**Solution**: Always include all three bottom sections (Vatican resources, related FAQs, back link)

### Mistake #5: Starting with Non-Answer Elements
**Problem**: Using highlight box or case study before answer paragraph

**Wrong**:
```html
<h3 class="faq-question">What is the issue?</h3>
<div class="highlight-box">  <!-- Can't start with this -->
    Key point here
</div>
```

**Right**:
```html
<h3 class="faq-question">What is the issue?</h3>
<p class="faq-answer">Full explanation of 250+ characters first...</p>
<div class="highlight-box">  <!-- Now you can add this -->
    Key point here
</div>
```

---

## 9. DEPLOYMENT

### Step 9.1: Add to Index
Create script to add your FAQ card to index.html:

```python
#!/usr/bin/env python3
"""Add [Topic] FAQ to index"""

with open('index.html', 'r') as f:
    content = f.read()

# Your FAQ card HTML
new_card = """
            <a href="your-topic-faq.html" class="faq-card">
                <div class="faq-card-icon">⚕️</div>
                <div class="faq-card-content">
                    <h3>Your FAQ Title</h3>
                    <p>Brief description of what this FAQ covers.</p>
                    <span class="faq-count">15 questions</span>
                </div>
            </a>"""

# Insert in appropriate section
# For general FAQs: after <!-- General AI Ethics Topics -->
# For Vatican FAQs: after <!-- Vatican Documents & Teachings -->

marker = '<!-- General AI Ethics Topics -->'
insert_pos = content.find(marker)
# Find the end of the card grid
grid_end = content.find('</div>', insert_pos + len(marker))

# Insert before the closing div
new_content = content[:grid_end] + new_card + '\n' + content[grid_end:]

with open('index.html', 'w') as f:
    f.write(new_content)

print("✅ Added to index")
```

### Step 9.2: Git Commit
```bash
# Stage files
git add your-topic-faq.html index.html

# Commit with descriptive message
git commit -m "Add [Topic] FAQ with 15 questions and Vatican resources"

# Push to repository
git push origin main
```

### Step 9.3: Verify Live
```bash
# Wait 1-2 minutes for GitHub Pages to update
# Then check:
open https://hoarhouse.github.io/dcfh/faqs/your-topic-faq.html
```

---

## 10. APPENDIX

### Complete Working Example Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Healthcare Ethics: Catholic Medical Guide - FAQ</title>
    <meta name="description" content="Catholic teaching on AI in healthcare, medical ethics, patient dignity. Vatican guidance on artificial intelligence in medicine.">
    <!-- Rest of head -->
</head>
<body>
    <!-- Navigation injected by dcf-ui.js -->
    <nav id="main-nav"></nav>
    
    <main class="container">
        <!-- Hero Section -->
        <div class="hero-section">
            <span class="hero-icon">⚕️</span>
            <h1 class="page-title">AI in Healthcare: Catholic Medical Ethics</h1>
            <p class="page-subtitle">Understanding Catholic teaching on artificial intelligence in medicine and patient care</p>
        </div>

        <!-- Table of Contents -->
        <div class="toc-section">
            <h2>Table of Contents</h2>
            <ul class="toc-list">
                <li><a href="#understanding">Understanding AI in Medicine (3 questions)</a></li>
                <!-- 4 more sections -->
            </ul>
        </div>

        <!-- FAQ Sections -->
        <div class="faq-section" id="understanding">
            <h2>Understanding AI in Medicine</h2>
            
            <div class="faq-item">
                <h3 class="faq-question">What is AI's role in healthcare according to Catholic teaching?</h3>
                <p class="faq-answer">The Catholic Church views AI in healthcare as a tool that must serve human dignity and the common good. While AI can enhance diagnostic accuracy and treatment planning, it must never replace the human physician-patient relationship or reduce patients to data points. The Vatican emphasizes that healthcare AI must respect the sanctity of life, maintain human oversight in all medical decisions, and ensure equitable access to benefits regardless of economic status.</p>
            </div>
            <!-- 2 more questions -->
        </div>
        
        <!-- 4 more sections with 3 questions each -->

        <!-- Required Bottom Sections -->
        <!-- Additional Vatican Resources -->
        <div class="faq-section" id="additional-resources">
            <h2>📚 Additional Vatican Resources</h2>
            <!-- Content as shown above -->
        </div>

        <!-- Related FAQs -->
        <div class="faq-section" id="related">
            <h2>Related FAQs</h2>
            <!-- Content as shown above -->
        </div>

        <!-- Back Link -->
        <div class="faq-section">
            <a href="https://hoarhouse.github.io/dcfh/faqs/index.html" class="back-link">← Back to All FAQs</a>
        </div>
    </main>

    <!-- Footer injected by dcf-ui.js -->
    <footer id="main-footer"></footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../js/dcf-core.js"></script>
    <script src="../js/dcf-ui.js"></script>
    <script src="../js/dcf-auth.js"></script>
    <script src="../js/dcf-analytics.js"></script>
    <script src="../js/dcf-init.js"></script>
    <script src="../js/faq-components.js"></script>
</body>
</html>
```

### Quick Reference Card
```
FAQ Build Checklist:
□ Filename: [topic]-faq.html
□ Title: 50-60 chars with "FAQ"
□ Meta: 150-160 chars
□ Icon: Relevant emoji
□ Questions: 15 minimum
□ Sections: 5 with IDs
□ Answers: 250+ chars each
□ Vatican docs: 4-5 links
□ Related FAQs: 3-4 links
□ Back link: To index
□ Test: Opens correctly
□ Commit: With clear message
```

---

## Maintenance Notes

### Updating This Guide
Last updated: October 2024
- Added filename requirements (-faq.html)
- Added standard bottom sections
- Added LLM optimization checklist v2.0
- Consolidated from multiple documents

### Version History
- v2.0: Master guide consolidation
- v1.2: Added bottom sections requirement
- v1.1: Added hero replacement fix
- v1.0: Initial guide

---

*End of FAQ Builder Master Guide*
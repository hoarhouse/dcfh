# HOW TO BUILD AN FAQ PAGE FOR DCF HUNGARY

## CRITICAL RULES - READ FIRST

1. **ALWAYS USE THE TEMPLATE** - `_FAQ_TEMPLATE.html` has ALL correct structure
2. **NEVER hardcode navigation** - Navigation comes from `dcf-ui.js` automatically  
3. **NEVER create from scratch** - Always start with template
4. **USE THE PYTHON BUILDER SCRIPT** - Don't manually edit placeholders

---

## THE CORRECT PROCESS

### STEP 1: Prepare Your Content

Before touching any files, have ready:
- **Topic title** (e.g., "Deepfakes & Misinformation")
- **SEO description** (150-160 chars with keywords)
- **Icon emoji** (e.g., 🎭)
- **Subtitle** (one compelling sentence)
- **5-6 FAQ sections** with questions and answers
- **Section names** for table of contents

### STEP 2: Create the Builder Script

Create `build_[your-topic].py`:
```python
#!/usr/bin/env python3

# Read template - MUST start fresh from template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA REPLACEMENTS ===
html = html.replace('[YOUR FAQ TITLE]', 'Catholic Church on [Your Topic]')
html = html.replace('[150-160 character description with target keywords]', 
    'Your SEO description here')

# === HERO SECTION ===
html = html.replace('🤖', '🎭')  # Your icon
html = html.replace('Catholic Church on [Topic]', 'Your Page Title')
html = html.replace('Comprehensive answers about Catholic teaching on [topic description]', 
    'Your compelling subtitle')

# === TABLE OF CONTENTS ===
old_toc = """                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->"""

new_toc = """                <li><a href="#section1">Your Section 1 (X questions)</a></li>
                <li><a href="#section2">Your Section 2 (X questions)</a></li>
                <li><a href="#section3">Your Section 3 (X questions)</a></li>"""

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
# Find insertion points
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

# Your complete FAQ content
faq_content = """        <!-- FAQ Section 1 -->
        <div class="faq-section" id="section1">
            <h2>Your Section Name</h2>

            <div class="faq-item">
                <h3 class="faq-question">Your question?</h3>
                <p class="faq-answer">Your answer.</p>
            </div>
        </div>
"""

# Replace content between markers
html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# Write to output file
with open('your-topic-name.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ FAQ page created")
```

### STEP 3: Run Builder & Verify
```bash
python3 build_your_topic.py
grep "dcf-ui.js" your-topic.html
open your-topic.html
```

---

## VERIFICATION CHECKLIST

- [ ] Title correct (not placeholder)
- [ ] Nav loads from dcf-ui.js
- [ ] All FAQ sections display
- [ ] No template placeholders remain
- [ ] Mobile responsive

---

## FILE NAMING

Format: `topic-keywords.html` (lowercase, hyphens)

---

## TROUBLESHOOTING
```bash
# Compare with template
diff _FAQ_TEMPLATE.html your-file.html | head -100

# Should only show content changes, not structure
```
# CRITICAL ADDITION TO BUILDER SCRIPTS

## The Hero Section Bug Fix

The template has TWO places where title/subtitle appear:
1. In the `<title>` tag (gets replaced correctly)
2. In the `<h1 class="page-title">` section (NEEDS explicit replacement)

## Updated Builder Script Template

Add these lines to EVERY builder script after the hero icon replacement:
```python
# === FIX HERO SECTION (CRITICAL) ===
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   '<h1 class="page-title">Your Actual Page Title</h1>')

html = html.replace('<p class="page-subtitle">[Brief description of what this FAQ covers - keep compelling and scannable]</p>',
                   '<p class="page-subtitle">Your actual subtitle here</p>')
```

## Full Correct Builder Pattern
```python
#!/usr/bin/env python3

with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'Catholic Church on [Topic]')
html = html.replace('[150-160 character description with target keywords]', 'Your SEO description')

# === HERO SECTION ===
html = html.replace('🤖', '⚖️')  # Icon
html = html.replace('Catholic Church on [Topic]', 'Your Display Title')
html = html.replace('Comprehensive answers about Catholic teaching on [topic description]', 'Your subtitle')

# === FIX HERO PAGE-TITLE/SUBTITLE (CRITICAL) ===
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   '<h1 class="page-title">Your Display Title</h1>')
html = html.replace('<p class="page-subtitle">[Brief description of what this FAQ covers - keep compelling and scannable]</p>',
                   '<p class="page-subtitle">Your subtitle</p>')

# ... rest of script
```

This fix MUST be in every builder script going forward.

---

## UPDATED REQUIREMENTS (V2.0 - Critical for LLM Optimization)

### Mandatory Requirements Checklist

Before building ANY FAQ page, ensure you have:

#### SEO Requirements
- [ ] **Title**: 50-60 characters including "Catholic" + "AI" keywords
- [ ] **Meta Description**: 150-160 characters with target keywords
- [ ] **Hero Title**: Clear, compelling, includes main topic
- [ ] **Hero Subtitle**: One sentence explaining what page covers

#### Content Requirements  
- [ ] **15 Questions Minimum**: 3 per section × 5 sections
- [ ] **Natural Language Questions**: Start with what/how/why/can/should/does/is
- [ ] **Answer Length**: EVERY answer must be 250+ characters
- [ ] **Answer Structure**: EVERY question must have `<p class="faq-answer">` FIRST before any other elements

#### Authority & Examples
- [ ] **Vatican Citations**: 3-5 citations in `<vatican-quote>` divs
- [ ] **Case Studies**: 2-4 real-world examples in `<case-study>` divs  
- [ ] **Highlight Boxes**: Use for key points with `<highlight-box>`

#### Technical Optimization
- [ ] **FAQ Schema**: Will be auto-added by schema script
- [ ] **Internal Links**: 3+ links to other FAQ pages
- [ ] **Semantic Structure**: Proper section divs with IDs

---

## Common Mistakes That Break LLM Optimization

### ❌ MISTAKE #1: Answers Too Short
**Problem**: Answers under 250 characters don't provide enough context for LLMs

**Example of TOO SHORT:**
```html
<p class="faq-answer">AI bias happens when systems discriminate.</p>
```

**Example of GOOD LENGTH:**
```html
<p class="faq-answer">AI bias occurs when artificial intelligence systems make unfair or discriminatory decisions based on characteristics like race, gender, or age. Unlike human prejudice which is conscious, AI bias is often unintentional—baked into systems through biased training data or flawed algorithms. This matters because AI increasingly makes high-stakes decisions about jobs, loans, healthcare, and justice.</p>
```

### ❌ MISTAKE #2: Missing Answer Paragraph
**Problem**: Jumping straight to case study or highlight box without intro paragraph

**WRONG:**
```html
<h3 class="faq-question">What is the problem?</h3>
<div class="case-study">
    ...
</div>
```

**CORRECT:**
```html
<h3 class="faq-question">What is the problem?</h3>
<p class="faq-answer">First explain the core concept in 250+ characters with context and examples...</p>
<div class="case-study">
    ...
</div>
```

### ❌ MISTAKE #3: Forgetting Hero Placeholders
**Problem**: Template has placeholders in TWO places that must BOTH be replaced

**Must Replace:**
1. `<title>[YOUR FAQ TITLE]</title>`
2. `<h1 class="page-title">[Your FAQ Title]</h1>` ← Often forgotten!
3. `<p class="page-subtitle">[Brief description...]</p>` ← Often forgotten!

### ❌ MISTAKE #4: Weak Titles/Descriptions
**Problem**: Not including keywords or wrong character count

**Bad Title** (too short, no keywords): "AI Ethics - DCF" (18 chars)
**Good Title**: "AI Bias & Fairness: Catholic Church Teaching - DCF" (50 chars)

**Bad Meta** (too long): "This is a comprehensive guide about everything you need to know about Catholic Church teaching on artificial intelligence bias, fairness, and algorithmic justice according to Vatican documents..." (190 chars - truncated in search results)
**Good Meta**: "Catholic teaching on AI bias, algorithmic fairness, and justice. Vatican guidance on preventing discrimination in AI systems." (153 chars)

---

## The Correct Build Process

### Step 1: Copy Template V2
```bash
cp MASTER_FAQ_BUILDER_TEMPLATE_V2.py build_your_topic.py
```

### Step 2: Configure Variables
Edit the CONFIGURATION section only:
- Set TOPIC, FILENAME, ICON
- Write TITLE (check: 50-60 chars?)
- Write META_DESC (check: 150-160 chars?)
- Set HERO_TITLE and HERO_SUBTITLE
- Define 5 TOC sections
- List 3 related FAQs

### Step 3: Write Content
Fill in FAQ_CONTENT with your 15 questions:
- **EVERY answer must start with `<p class="faq-answer">` that's 250+ chars**
- Include 3-5 Vatican quotes
- Include 2-4 case studies
- Use highlight boxes for key points

### Step 4: Build
```bash
python3 build_your_topic.py
```

### Step 5: Add Schema
```bash
python3 add_schema_markup.py
```

### Step 6: Verify
```bash
python3 analyze_faq_llm_optimization.py | grep your-topic -A 20
```

Target: 80%+ optimization score

### Step 7: Add to Index
```bash
# Create card addition script
cat > add_your_topic_card.py << 'ENDSCRIPT'
# ... add card code ...
ENDSCRIPT

python3 add_your_topic_card.py
```

### Step 8: Final Check
- Open in browser
- Check nav appears
- Check all 15 questions display
- Check no placeholders remain
- Verify 250+ char answers

### Step 9: Commit
```bash
git add your-topic.html index.html
git commit -m "Add [Topic] FAQ with full LLM optimization"
git push
```

---

## Quick Reference: Answer Length Guide

**Too Short** (avoid): 50-150 characters
- "AI bias happens when systems discriminate based on race or gender."

**Minimum Acceptable**: 250-300 characters  
- "AI bias occurs when artificial intelligence systems make unfair or discriminatory decisions based on characteristics like race, gender, age, or socioeconomic status. Unlike human prejudice which is often conscious, AI bias is typically unintentional—baked into systems through biased training data or flawed algorithm design that reflects historical discrimination."

**Ideal**: 300-500 characters
- Above + additional context, examples, and implications

**Use Multiple Paragraphs**: For complex topics, use 2-3 answer paragraphs with case studies/boxes between them

---


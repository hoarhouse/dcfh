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

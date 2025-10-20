# How to Build an FAQ Page

## LLM Optimization Requirements (MANDATORY - 95%+ Score Required)

### 1. FAQ Schema JSON-LD (15 points)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text (minimum 250 characters)"
      }
    }
  ]
}
```
**Requirement**: Every FAQ must include properly formatted FAQ Schema

### 2. Answer Length Requirements (10 points)
- Minimum: 250 characters per answer
- Recommended: 400-800 characters
- Must provide substantive, comprehensive responses

### 3. Case Studies (15 points)
- Minimum: 2-4 documented real-world examples
- Format: Dedicated section with citations
- Required elements:
  - Organization/Entity name
  - Year of occurrence
  - Specific outcomes/impacts
  - Verified source citation

### 4. Vatican Authority Quotes (15 points)
- Include relevant Vatican document quotes
- Use proper blockquote formatting
- Cite document name and year

### 5. Internal Linking (10 points)
- Minimum 3-5 contextual links to related FAQs
- Links must be relevant and add value
- Use descriptive anchor text

## Case Study Authenticity Policy

### CRITICAL: All Case Studies Must Be:
1. **Verifiable**: Based on documented events with citations
2. **Specific**: Include names, dates, measurable outcomes
3. **Recent**: Preferably within last 5 years
4. **Relevant**: Directly support the FAQ's topic

### Prohibited:
- Hypothetical scenarios
- Generic examples without specifics
- Uncited claims
- Speculation about future events

### Required Format:
```html
<div class="case-study-box">
    <h4>Case Study: [Organization Name] - [Brief Title]</h4>
    <p><strong>Year:</strong> [YYYY]</p>
    <p><strong>Context:</strong> [What happened]</p>
    <p><strong>Outcome:</strong> [Measurable results]</p>
    <p><strong>Source:</strong> <a href="[URL]">[Publication Name]</a></p>
</div>
```

## Validation Functions

### Pre-Build Validation Script
```python
def validate_faq_optimization(file_path):
    """
    Validates FAQ meets LLM optimization requirements
    Returns: (score, missing_elements)
    """
    with open(file_path, 'r') as f:
        content = f.read()
    
    score = 100
    missing = []
    
    # Check FAQ Schema
    if '"@type": "FAQPage"' not in content:
        score -= 15
        missing.append("FAQ Schema JSON-LD")
    
    # Check answer lengths
    import re
    answers = re.findall(r'"text":\s*"([^"]+)"', content)
    short_answers = [a for a in answers if len(a) < 250]
    if short_answers:
        score -= 10
        missing.append(f"{len(short_answers)} answers under 250 chars")
    
    # Check case studies
    case_studies = content.count('class="case-study-box"')
    if case_studies < 2:
        score -= 15
        missing.append(f"Only {case_studies} case studies (need 2-4)")
    
    # Check Vatican quotes
    vatican_quotes = content.count('class="vatican-quote"')
    if vatican_quotes < 1:
        score -= 15
        missing.append("No Vatican authority quotes")
    
    # Check internal links
    internal_links = len(re.findall(r'href="[^"]*-faq\.html"', content))
    if internal_links < 3:
        score -= 10
        missing.append(f"Only {internal_links} internal links (need 3-5)")
    
    return score, missing

def validate_all_faqs():
    """Validate all FAQ files in directory"""
    import glob
    
    files = glob.glob("*-faq.html")
    failed = []
    
    for file in files:
        score, missing = validate_faq_optimization(file)
        if score < 95:
            failed.append({
                'file': file,
                'score': score,
                'missing': missing
            })
    
    if failed:
        print("❌ VALIDATION FAILED:")
        for f in failed:
            print(f"\n{f['file']}: {f['score']}%")
            for m in f['missing']:
                print(f"  - {m}")
        return False
    else:
        print("✅ All FAQs pass LLM optimization (95%+)")
        return True
```

## Pre-Launch Checklist

### Required Before Publishing:
- [ ] Run `python3 analyze_faq_llm_optimization.py` - All files must score 95%+
- [ ] Validate FAQ Schema with Google's Rich Results Test
- [ ] Verify all case studies have working citation links
- [ ] Check all internal links resolve correctly
- [ ] Ensure minimum answer length (250 chars) for all questions
- [ ] Confirm Vatican quotes are properly attributed
- [ ] Test mobile responsiveness
- [ ] Validate HTML structure (header, footer, scripts)

### Build Command Sequence:
```bash
# 1. Validate optimization
python3 analyze_faq_llm_optimization.py

# 2. Check for failed files
if [ $? -ne 0 ]; then
    echo "❌ Build failed: FAQs below 95% optimization"
    exit 1
fi

# 3. Validate HTML structure
for file in *-faq.html; do
    if ! grep -q 'id="main-footer"' "$file"; then
        echo "❌ Missing footer: $file"
        exit 1
    fi
done

# 4. Build successful
echo "✅ All validations passed - ready to publish"
```

## Common Optimization Failures

### Issue: Score Below 95%
**Fix**: Run analyzer to identify missing elements:
```bash
python3 analyze_faq_llm_optimization.py | grep -A 10 "YOUR_FILE"
```

### Issue: Case Studies Rejected
**Fix**: Ensure all case studies are:
- Real events (not hypothetical)
- Include specific organization names
- Have verifiable citations
- Include measurable outcomes

### Issue: FAQ Schema Invalid
**Fix**: Validate with Google's tool:
https://search.google.com/test/rich-results

### Issue: Answer Too Short
**Fix**: Expand answers to be comprehensive:
- Add context and background
- Include multiple perspectives
- Reference Vatican teachings
- Provide practical applications
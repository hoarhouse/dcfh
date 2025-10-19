#!/usr/bin/env python3
import re
import json

def extract_faq_data(filepath):
    """Extract questions and answers for FAQ Schema."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all FAQ items
    pattern = r'<h3 class="faq-question">(.*?)</h3>(.*?)(?=<h3 class="faq-question">|<div class="faq-section"|</div>\s*</div>)'
    matches = re.findall(pattern, content, re.DOTALL)
    
    faq_data = []
    for question_html, answer_section in matches:
        # Clean question
        question = re.sub(r'<[^>]+>', '', question_html).strip()
        
        # Extract answer paragraphs only (not vatican quotes or case studies)
        answer_paras = re.findall(r'<p class="faq-answer">(.*?)</p>', answer_section, re.DOTALL)
        
        # Combine and clean answer text
        answer_text = ' '.join(answer_paras)
        answer_text = re.sub(r'<[^>]+>', '', answer_text)  # Remove HTML tags
        answer_text = re.sub(r'\s+', ' ', answer_text).strip()  # Clean whitespace
        answer_text = answer_text.replace('"', '\\"')  # Escape quotes
        
        # Limit answer length for schema
        if len(answer_text) > 4500:
            answer_text = answer_text[:4497] + "..."
        
        faq_data.append({
            'question': question.replace('"', '\\"'),
            'answer': answer_text
        })
    
    return faq_data

def generate_schema(faq_data):
    """Generate FAQ Schema JSON-LD."""
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    }
    
    for item in faq_data:
        qa = {
            "@type": "Question",
            "name": item['question'],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item['answer']
            }
        }
        schema['mainEntity'].append(qa)
    
    return json.dumps(schema, indent=2, ensure_ascii=False)

# Process vatican-rome-call-ai-ethics-faq.html
faq_data = extract_faq_data('vatican-rome-call-ai-ethics-faq.html')
schema_json = generate_schema(faq_data)

print("FAQ Schema for vatican-rome-call-ai-ethics-faq.html:")
print("-" * 70)
print(f"<script type=\"application/ld+json\">")
print(schema_json)
print("</script>")
print("-" * 70)
print(f"Total questions included: {len(faq_data)}")
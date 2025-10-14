#!/usr/bin/env python3
"""
Add FAQ Schema markup to all FAQ pages for LLM optimization
"""
from bs4 import BeautifulSoup
import json
import os

def extract_faqs_from_page(filename):
    """Extract all Q&A pairs from a page"""
    with open(filename, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    questions = soup.find_all('h3', class_='faq-question')
    
    faq_list = []
    for q in questions:
        question_text = q.text.strip()
        
        # Find the answer(s) following this question
        answer_parts = []
        sibling = q.find_next_sibling()
        while sibling and sibling.name != 'h3':
            if sibling.name == 'p' and 'faq-answer' in sibling.get('class', []):
                answer_parts.append(sibling.text.strip())
            sibling = sibling.find_next_sibling()
        
        answer_text = ' '.join(answer_parts)
        
        if question_text and answer_text:
            faq_list.append({
                "question": question_text,
                "answer": answer_text[:500]  # Limit to 500 chars for schema
            })
    
    return faq_list

def add_schema_to_page(filename):
    """Add FAQ schema markup to a page"""
    print(f"\n🔧 Processing {filename}...")
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if schema already exists
    if 'application/ld+json' in content:
        print(f"   ⏭️  Schema already exists, skipping")
        return
    
    # Extract FAQs
    faqs = extract_faqs_from_page(filename)
    
    if not faqs:
        print(f"   ⚠️  No FAQs found in {filename}")
        return
    
    # Build schema
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    }
    
    for faq in faqs:
        schema["mainEntity"].append({
            "@type": "Question",
            "name": faq["question"],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq["answer"]
            }
        })
    
    # Convert to JSON
    schema_json = json.dumps(schema, indent=2, ensure_ascii=False)
    
    # Create script tag
    schema_script = f'\n    <script type="application/ld+json">\n    {schema_json}\n    </script>'
    
    # Insert before </head>
    content = content.replace('</head>', schema_script + '\n</head>')
    
    # Write back
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"   ✅ Added schema with {len(faqs)} Q&A pairs")

# Process all FAQ files
faq_files = [f for f in os.listdir('.') if f.endswith('.html') 
             and f not in ['_FAQ_TEMPLATE.html', 'index.html']]

print("="*80)
print("ADDING FAQ SCHEMA MARKUP TO ALL PAGES")
print("="*80)

for faq_file in sorted(faq_files):
    add_schema_to_page(faq_file)

print("\n" + "="*80)
print("✅ SCHEMA MARKUP COMPLETE")
print("="*80)

#!/usr/bin/env python3
import re

def analyze_file(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    results = {}
    
    # 1. FAQ Schema
    results['has_schema'] = '<script type="application/ld+json">' in content and '"@type": "FAQPage"' in content
    
    # 2. Question count
    results['questions'] = len(re.findall(r'<h3 class="faq-question">', content))
    
    # 3. Vatican citations
    results['vatican_refs'] = len(re.findall(r'vatican-quote|Pope Francis|Holy Father|Vatican|Catechism|Encyclical|Antiqua et Nova', content, re.IGNORECASE))
    
    # 4. Case studies
    results['case_studies'] = len(re.findall(r'For example|Consider the case|In practice|Real-world scenario|Example:', content, re.IGNORECASE))
    
    # 5. Internal links
    results['internal_links'] = len(re.findall(r'<a href="[^"]*\.html"', content))
    
    # 6. Answer length
    answers = re.findall(r'<p class="faq-answer">(.*?)</p>', content, re.DOTALL)
    if answers:
        results['avg_answer_length'] = int(sum(len(a) for a in answers) / len(answers))
    else:
        results['avg_answer_length'] = 0
    
    # 7. Related FAQs section  
    results['has_related'] = 'Related FAQs' in content or 'Related Questions' in content
    
    # 8. Meta description
    results['has_meta'] = bool(re.search(r'<meta\s+name="description"', content))
    
    # 9. Title has FAQ
    results['has_faq_title'] = bool(re.search(r'<title>.*FAQ.*</title>', content, re.IGNORECASE))
    
    return results

print('=== COMPARISON: 100% FAQ vs 95% FAQ ===')
print()

# Analyze both files
perfect_faq = analyze_file('ai-warfare-weapons-faq.html')
good_faq = analyze_file('ai-healthcare-faq.html')

print('Element                        | ai-warfare (100%) | ai-healthcare (95%)')
print('-' * 75)
print(f'FAQ Schema                     | {"YES" if perfect_faq["has_schema"] else "NO":^17} | {"YES" if good_faq["has_schema"] else "NO":^19}')
print(f'Question count                 | {perfect_faq["questions"]:^17} | {good_faq["questions"]:^19}')
print(f'Vatican citations              | {perfect_faq["vatican_refs"]:^17} | {good_faq["vatican_refs"]:^19}')
print(f'Case studies/examples          | {perfect_faq["case_studies"]:^17} | {good_faq["case_studies"]:^19}')
print(f'Internal links                 | {perfect_faq["internal_links"]:^17} | {good_faq["internal_links"]:^19}')
print(f'Avg answer length (chars)      | {perfect_faq["avg_answer_length"]:^17} | {good_faq["avg_answer_length"]:^19}')
print(f'Related FAQs section           | {"YES" if perfect_faq["has_related"] else "NO":^17} | {"YES" if good_faq["has_related"] else "NO":^19}')
print(f'Meta description               | {"YES" if perfect_faq["has_meta"] else "NO":^17} | {"YES" if good_faq["has_meta"] else "NO":^19}')
print(f'"FAQ" in title                 | {"YES" if perfect_faq["has_faq_title"] else "NO":^17} | {"YES" if good_faq["has_faq_title"] else "NO":^19}')
print()
print('KEY DIFFERENCES:')
print('1. ai-warfare has 3+ case studies (gets full points)')
print('2. ai-warfare has longer answers (269 chars avg vs 156)')
print()
print('WHAT THE 95% FAQ NEEDS:')
print('✗ Add 1 more case study/example to get from 2 → 3+')
print('✗ Expand answers to 250+ chars average (currently 156)')
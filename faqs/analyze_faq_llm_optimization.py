#!/usr/bin/env python3
"""
FAQ LLM Optimization Analyzer
Analyzes FAQ pages for LLM/AI search optimization elements
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple

def analyze_faq(filepath: str) -> Dict:
    """Analyze a single FAQ file for optimization elements"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    results = {
        'filename': os.path.basename(filepath),
        'score': 0,
        'max_score': 100,
        'elements': {}
    }
    
    # 1. Title tag with "FAQ" (10 points)
    if re.search(r'<title>.*FAQ.*</title>', content, re.IGNORECASE):
        results['elements']['title_has_faq'] = True
        results['score'] += 10
    else:
        results['elements']['title_has_faq'] = False
    
    # 2. Meta description (10 points)
    if re.search(r'<meta\s+name="description"', content, re.IGNORECASE):
        results['elements']['has_meta_description'] = True
        results['score'] += 10
    else:
        results['elements']['has_meta_description'] = False
    
    # 3. FAQ Schema markup (15 points)
    if '<script type="application/ld+json">' in content and '"@type": "FAQPage"' in content:
        results['elements']['has_faq_schema'] = True
        results['score'] += 15
    else:
        results['elements']['has_faq_schema'] = False
    
    # 4. Number of questions (15 points for 10+)
    questions = len(re.findall(r'<div class="faq-question">|<h3 class="faq-question">|<h3 class="question">|<summary>|<h2>Q\d+:', content))
    results['elements']['question_count'] = questions
    if questions >= 10:
        results['score'] += 15
    elif questions >= 5:
        results['score'] += 8
    elif questions >= 3:
        results['score'] += 4
    
    # 5. Answer length (10 points for 250+ chars average)
    # Find the FIRST answer paragraph after each question
    faq_items = re.findall(r'<h3 class="faq-question">.*?</h3>\s*<p class="faq-answer">(.*?)</p>', content, re.DOTALL)
    if faq_items:
        # Clean HTML and calculate average
        clean_answers = [re.sub(r'<[^>]+>', '', answer).strip() for answer in faq_items]
        avg_length = sum(len(a) for a in clean_answers) / len(clean_answers) if clean_answers else 0
        results['elements']['avg_answer_length'] = int(avg_length)
        if avg_length >= 250:
            results['score'] += 10
        elif avg_length >= 150:
            results['score'] += 5
    else:
        results['elements']['avg_answer_length'] = 0
    
    # 6. Vatican citations/quotes (10 points)
    vatican_quotes = len(re.findall(r'<div class="vatican-quote">|<blockquote.*?vatican|Pope Francis|Holy Father|Vatican|Catechism|Encyclical', content, re.IGNORECASE))
    results['elements']['vatican_citations'] = vatican_quotes
    if vatican_quotes >= 3:
        results['score'] += 10
    elif vatican_quotes >= 1:
        results['score'] += 5
    
    # 7. Case studies/examples (10 points)
    case_studies = len(re.findall(r'<div class="case-study">|<div class="example">|For example|Consider the case|In practice', content, re.IGNORECASE))
    results['elements']['case_studies'] = case_studies
    if case_studies >= 3:
        results['score'] += 10
    elif case_studies >= 1:
        results['score'] += 5
    
    # 8. Internal links (10 points)
    internal_links = len(re.findall(r'<a href="[^"]*\.html"', content))
    results['elements']['internal_links'] = internal_links
    if internal_links >= 5:
        results['score'] += 10
    elif internal_links >= 2:
        results['score'] += 5
    
    # 9. Proper heading hierarchy (5 points)
    has_h1 = bool(re.search(r'<h1[^>]*>', content))
    has_h2 = bool(re.search(r'<h2[^>]*>', content))
    if has_h1 and has_h2:
        results['elements']['proper_headings'] = True
        results['score'] += 5
    else:
        results['elements']['proper_headings'] = False
    
    # 10. Related FAQs section (5 points)
    if 'Related FAQs' in content or 'Related Questions' in content:
        results['elements']['has_related_faqs'] = True
        results['score'] += 5
    else:
        results['elements']['has_related_faqs'] = False
    
    return results

def main():
    """Analyze all FAQ files"""
    # Get all FAQ files
    faq_files = []
    for file in os.listdir('.'):
        if file.endswith('.html') and ('faq' in file.lower() or file.startswith('vatican-') or file == 'dcf_faq_ai_wisdom.html'):
            faq_files.append(file)
    
    faq_files.sort()
    
    print("\n" + "="*80)
    print("FAQ LLM OPTIMIZATION ANALYSIS REPORT")
    print("="*80)
    
    results = []
    for file in faq_files:
        result = analyze_faq(file)
        results.append(result)
    
    # Sort by score
    results.sort(key=lambda x: x['score'], reverse=True)
    
    # Summary table
    print(f"\n{'File':<50} {'Score':<10} {'Status'}")
    print("-"*80)
    
    perfect_count = 0
    good_count = 0
    needs_work_count = 0
    
    for r in results:
        status = ""
        if r['score'] >= 100:
            status = "✅ PERFECT"
            perfect_count += 1
        elif r['score'] >= 90:
            status = "🟡 GOOD"
            good_count += 1
        elif r['score'] >= 70:
            status = "🟠 NEEDS IMPROVEMENT"
            needs_work_count += 1
        else:
            status = "🔴 NEEDS WORK"
            needs_work_count += 1
        
        print(f"{r['filename']:<50} {r['score']:>3}% {status:>8}")
    
    # Summary stats
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    print(f"Total FAQs analyzed: {len(results)}")
    print(f"Perfect (100%): {perfect_count}")
    print(f"Good (90-99%): {good_count}")
    print(f"Needs Work (<90%): {needs_work_count}")
    print(f"Average score: {sum(r['score'] for r in results) / len(results):.1f}%")
    
    # Detailed breakdown for files scoring less than 100
    print("\n" + "="*80)
    print("DETAILED BREAKDOWN FOR NON-PERFECT FAQs")
    print("="*80)
    
    for r in results:
        if r['score'] < 100:
            print(f"\n📄 {r['filename']} (Score: {r['score']}%)")
            print("-"*40)
            
            # Show what's missing
            missing = []
            if not r['elements'].get('title_has_faq'):
                missing.append("❌ Missing 'FAQ' in title tag (-10 points)")
            if not r['elements'].get('has_meta_description'):
                missing.append("❌ Missing meta description (-10 points)")
            if not r['elements'].get('has_faq_schema'):
                missing.append("❌ Missing FAQ Schema markup (-15 points)")
            
            if r['elements'].get('question_count', 0) < 10:
                missing.append(f"❌ Only {r['elements'].get('question_count', 0)} questions (need 10+ for full points)")
            
            if r['elements'].get('avg_answer_length', 0) < 250:
                missing.append(f"❌ Short answers (avg: {r['elements'].get('avg_answer_length', 0)} chars, need 250+)")
            
            if r['elements'].get('vatican_citations', 0) < 3:
                missing.append(f"❌ Only {r['elements'].get('vatican_citations', 0)} Vatican citations (need 3+)")
            
            if r['elements'].get('case_studies', 0) < 3:
                missing.append(f"❌ Only {r['elements'].get('case_studies', 0)} case studies/examples (need 3+)")
            
            if r['elements'].get('internal_links', 0) < 5:
                missing.append(f"❌ Only {r['elements'].get('internal_links', 0)} internal links (need 5+)")
            
            if not r['elements'].get('proper_headings'):
                missing.append("❌ Missing proper heading hierarchy (-5 points)")
            
            if not r['elements'].get('has_related_faqs'):
                missing.append("❌ Missing Related FAQs section (-5 points)")
            
            for m in missing:
                print(f"  {m}")

if __name__ == "__main__":
    main()
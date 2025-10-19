#!/usr/bin/env python3
"""
Diagnostic tool for Vatican FAQ files
Analyzes why they score 80-85% instead of 95-100%
"""

import re
import os

def diagnose_faq(filepath):
    """Perform comprehensive diagnosis on a single FAQ file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    
    print(f"\n{'='*70}")
    print(f"{filename}")
    print('='*70)
    
    issues = []
    fixes = []
    
    # 1. FAQ Schema Analysis
    has_schema = '<script type="application/ld+json">' in content
    has_faq_type = '"@type": "FAQPage"' in content
    schema_questions = len(re.findall(r'"@type": "Question"', content))
    
    print("\n1. FAQ SCHEMA MARKUP:")
    print(f"   Present: {'YES' if has_schema else 'NO'}")
    print(f"   Has FAQPage type: {'YES' if has_faq_type else 'NO'}")
    print(f"   Questions in schema: {schema_questions}")
    
    if not has_schema or not has_faq_type:
        issues.append("❌ Missing FAQ Schema markup (-15 points)")
        fixes.append("Add complete FAQ Schema with all questions")
    
    # 2. Question Count
    questions_h3 = re.findall(r'<h3 class="faq-question">(.*?)</h3>', content, re.DOTALL)
    question_count = len(questions_h3)
    
    print("\n2. QUESTION COUNT:")
    print(f"   Total questions: {question_count}")
    print(f"   Minimum needed: 10-15 for good score")
    
    if question_count < 10:
        issues.append(f"❌ Only {question_count} questions (need 10-15)")
        fixes.append(f"Add {10 - question_count} more questions with 300+ char answers")
    
    # 3. Answer Length Analysis
    # Find first answer paragraph after each question
    answer_pattern = r'<h3 class="faq-question">.*?</h3>\s*<p class="faq-answer">(.*?)</p>'
    answers = re.findall(answer_pattern, content, re.DOTALL)
    
    short_answers = 0
    medium_answers = 0
    long_answers = 0
    total_length = 0
    
    for answer in answers:
        clean_answer = re.sub(r'<[^>]+>', '', answer).strip()
        length = len(clean_answer)
        total_length += length
        
        if length < 250:
            short_answers += 1
        elif length < 500:
            medium_answers += 1
        else:
            long_answers += 1
    
    avg_length = int(total_length / len(answers)) if answers else 0
    
    print("\n3. ANSWER LENGTH ANALYSIS:")
    print(f"   Answers <250 chars: {short_answers}")
    print(f"   Answers 250-500 chars: {medium_answers}")
    print(f"   Answers 500+ chars: {long_answers}")
    print(f"   Average answer length: {avg_length} chars")
    
    if avg_length < 250:
        issues.append(f"❌ Average answer length: {avg_length} chars (need 250+)")
        if short_answers > 0:
            fixes.append(f"Expand {short_answers} short answers from <250 to 300+ chars")
    
    # 4. Vatican Citations
    vatican_quotes = len(re.findall(r'<div class="vatican-quote">', content))
    vatican_refs = len(re.findall(r'Pope Francis|Holy Father|Vatican|Catechism|Encyclical', content, re.IGNORECASE))
    
    print("\n4. VATICAN CITATIONS:")
    print(f"   Vatican quote blocks: {vatican_quotes}")
    print(f"   Vatican references: {vatican_refs}")
    print(f"   Minimum needed: 3-5 quote blocks")
    
    if vatican_quotes < 3:
        issues.append(f"❌ Only {vatican_quotes} Vatican quote blocks (need 3-5)")
        fixes.append(f"Add {3 - vatican_quotes} more Vatican quote blocks")
    elif vatican_quotes >= 3:
        issues.append(f"✅ Has {vatican_quotes} Vatican quote blocks")
    
    # 5. Case Studies
    case_studies = len(re.findall(r'<div class="case-study">', content))
    
    print("\n5. CASE STUDIES:")
    print(f"   Case study blocks: {case_studies}")
    print(f"   Minimum needed: 2-3 per file")
    
    if case_studies < 2:
        issues.append(f"❌ Only {case_studies} case study (need 2-3)")
        fixes.append(f"Add {2 - case_studies} more case studies with citations")
    else:
        issues.append(f"✅ Has {case_studies} case studies")
    
    # 6. Internal Links
    internal_links_faq = len(re.findall(r'href="[^"]*-faq\.html"', content))
    internal_links_vatican = len(re.findall(r'href="\.\./vatican-resources/', content))
    internal_links_blog = len(re.findall(r'href="\.\./blog/', content))
    total_internal = internal_links_faq + internal_links_vatican + internal_links_blog
    
    print("\n6. INTERNAL LINKS:")
    print(f"   Links to other FAQ pages: {internal_links_faq}")
    print(f"   Links to Vatican resources: {internal_links_vatican}")
    print(f"   Links to blog: {internal_links_blog}")
    print(f"   Total internal links: {total_internal}")
    print(f"   Minimum needed: 5+ per file")
    
    if total_internal < 5:
        issues.append(f"⚠️ Only {total_internal} internal links (need 5+)")
        fixes.append(f"Add {5 - total_internal} more internal links to related content")
    else:
        issues.append(f"✅ Has {total_internal} internal links")
    
    # 7. Bottom Sections
    has_resources = 'Additional Vatican Resources' in content or 'Additional Resources' in content
    has_related = 'Related FAQs' in content or 'Related Questions' in content
    has_back_link = 'Back to' in content and 'FAQs' in content
    
    print("\n7. BOTTOM SECTIONS:")
    print(f"   Additional Vatican Resources section: {'YES' if has_resources else 'NO'}")
    print(f"   Related FAQs section: {'YES' if has_related else 'NO'}")
    print(f"   Back to FAQs link: {'YES' if has_back_link else 'NO'}")
    
    if not has_related:
        issues.append("❌ Missing Related FAQs section (-5 points)")
        fixes.append("Add Related FAQs section with 3-5 relevant links")
    else:
        issues.append("✅ Has Related FAQs section")
    
    if has_resources:
        issues.append("✅ Has Additional Resources section")
    
    # Calculate estimated score
    score = 100
    if not has_schema or not has_faq_type:
        score -= 15
    if question_count < 10:
        score -= 15
    if avg_length < 250:
        score -= 10
    if vatican_quotes < 3:
        score -= 10
    if case_studies < 2:
        score -= 10
    if total_internal < 5:
        score -= 10
    if not has_related:
        score -= 5
    
    print(f"\nESTIMATED SCORE: {score}%")
    print("\nISSUES FOUND:")
    for issue in issues:
        print(f"  {issue}")
    
    print("\nPRIORITY FIXES TO REACH 95-100%:")
    for i, fix in enumerate(fixes, 1):
        print(f"  {i}. {fix}")
    
    return {
        'file': filename,
        'score': score,
        'question_count': question_count,
        'avg_answer_length': avg_length,
        'vatican_quotes': vatican_quotes,
        'case_studies': case_studies,
        'internal_links': total_internal,
        'has_schema': has_schema and has_faq_type,
        'has_related': has_related
    }

def main():
    """Analyze all Vatican FAQ files."""
    
    vatican_files = [
        'vatican-rome-call-ai-ethics-faq.html',
        'vatican-ai-peace-2024-faq.html',
        'vatican-g7-ai-address-2024-faq.html',
        'vatican-wef-ai-message-2025-faq.html',
        'vatican-communications-ai-wisdom-2024-faq.html',
        'vatican-common-good-digital-age-2019-faq.html'
    ]
    
    print("\n" + "="*70)
    print("VATICAN FAQ FILES DIAGNOSTIC REPORT")
    print("Why they score 80-85% instead of 95-100%")
    print("="*70)
    
    results = []
    for file in vatican_files:
        if os.path.exists(file):
            result = diagnose_faq(file)
            results.append(result)
    
    # Summary
    print("\n" + "="*70)
    print("SUMMARY OF ALL VATICAN FAQ FILES")
    print("="*70)
    
    print("\nCOMMON ISSUES ACROSS ALL FILES:")
    
    # Check for common patterns
    all_missing_schema = all(not r['has_schema'] for r in results)
    all_low_questions = all(r['question_count'] < 10 for r in results)
    all_short_answers = all(r['avg_answer_length'] < 250 for r in results)
    
    if all_missing_schema:
        print("  ❌ ALL files missing FAQ Schema markup (-15 points each)")
    elif any(not r['has_schema'] for r in results):
        missing = [r['file'] for r in results if not r['has_schema']]
        print(f"  ❌ {len(missing)} files missing FAQ Schema: {', '.join(missing[:3])}")
    
    if all_low_questions:
        print("  ❌ ALL files have fewer than 10 questions")
    elif any(r['question_count'] < 10 for r in results):
        low = [f"{r['file']} ({r['question_count']})" for r in results if r['question_count'] < 10]
        print(f"  ❌ {len(low)} files have <10 questions")
    
    if all_short_answers:
        print("  ❌ ALL files have short average answer length (<250 chars)")
    elif any(r['avg_answer_length'] < 250 for r in results):
        short = [f"{r['file']} ({r['avg_answer_length']} chars)" for r in results if r['avg_answer_length'] < 250]
        print(f"  ❌ {len(short)} files have short answers")
    
    print("\nKEY FINDING:")
    print("  Vatican FAQ files score 80-85% primarily due to:")
    print("  1. Missing FAQ Schema markup in most files (-15 points)")
    print("  2. Shorter, more concise answers (avg <250 chars)")
    print("  3. Fewer questions per file (most have 8-10 vs 15+ in high scorers)")
    print("  4. Less case studies and examples")
    
    print("\nTO ACHIEVE 95-100% SCORES:")
    print("  1. Add FAQ Schema markup to all files (+15 points)")
    print("  2. Expand answers to 250-400 chars average (+10 points)")
    print("  3. Add 2-5 more questions per file (+5-10 points)")
    print("  4. Include more case studies and Vatican quotes")

if __name__ == "__main__":
    main()
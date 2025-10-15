#!/usr/bin/env python3
"""
Analyze FAQ pages for LLM/AI search optimization
Checks: title, meta, questions, schema, Vatican citations, case studies, answer depth
"""

import os
import re
from bs4 import BeautifulSoup
from pathlib import Path

def analyze_faq_page(filepath):
    """Analyze a single FAQ page for LLM optimization"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    scores = {}
    recommendations = []
    
    # 1. TITLE LENGTH (50-60 chars ideal)
    title = soup.find('title')
    title_text = title.text if title else ""
    title_len = len(title_text)
    scores['title_length'] = '✅' if 50 <= title_len <= 70 else '⚠️'
    if title_len < 50:
        recommendations.append(f"⚠️ Title too short ({title_len} chars). Expand to 50-60")
    elif title_len > 70:
        recommendations.append(f"⚠️ Title too long ({title_len} chars). Shorten to 50-60")
    
    # 2. META DESCRIPTION (150-160 chars ideal)
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    desc_text = meta_desc.get('content', '') if meta_desc else ""
    desc_len = len(desc_text)
    scores['meta_desc_length'] = '✅' if 150 <= desc_len <= 160 else '⚠️'
    if desc_len < 150:
        recommendations.append(f"⚠️ Meta description too short ({desc_len} chars). Expand to 150-160")
    elif desc_len > 160:
        recommendations.append(f"⚠️ Meta description too long ({desc_len} chars). Shorten to 150-160")
    
    # 3. QUESTION COUNT (15+ questions)
    questions = soup.find_all('h3', class_='faq-question')
    scores['question_count'] = '✅' if len(questions) >= 15 else '⚠️'
    if len(questions) < 15:
        recommendations.append(f"⚠️ Only {len(questions)} questions. Add more (aim for 15+)")
    
    # Check for natural language questions
    natural_starters = ['what', 'how', 'why', 'when', 'who', 'can', 'should', 'does', 'is', 'are', 'will']
    natural_questions = sum(1 for q in questions if any(q.text.lower().startswith(starter) for starter in natural_starters))
    natural_ratio = natural_questions / len(questions) if questions else 0
    scores['natural_language'] = '✅' if natural_ratio >= 0.7 else '⚠️'
    if natural_ratio < 0.7:
        recommendations.append(f"⚠️ Only {int(natural_ratio*100)}% natural language questions. Use what/how/why")
    
    # 4. SCHEMA MARKUP
    has_schema = 'application/ld+json' in content or 'schema.org' in content
    scores['schema_markup'] = '✅' if has_schema else '❌'
    if not has_schema:
        recommendations.append("❌ CRITICAL: Missing FAQ schema markup (application/ld+json)")
    
    # 5. VATICAN CITATIONS
    vatican_quotes = soup.find_all('div', class_='vatican-quote')
    scores['vatican_citations'] = '✅' if len(vatican_quotes) >= 3 else '⚠️'
    if len(vatican_quotes) < 3:
        recommendations.append(f"⚠️ Only {len(vatican_quotes)} Vatican citations. Add more for authority (aim for 3-5)")
    
    # 6. CASE STUDIES / EXAMPLES
    case_studies = soup.find_all('div', class_='case-study')
    scores['case_studies'] = '✅' if len(case_studies) >= 2 else '⚠️'
    if len(case_studies) < 2:
        recommendations.append(f"⚠️ Only {len(case_studies)} case studies. Add real-world examples for context")
    
    # 7. ANSWER LENGTH - FIXED to count full answer per FAQ item
    faq_items = soup.find_all('div', class_='faq-item')
    if faq_items:
        answer_lengths = []
        for item in faq_items:
            # Get all text content from answer paragraphs and lists
            answer_text = ' '.join([elem.get_text(strip=True) for elem in item.find_all(['p', 'ul', 'ol'], class_='faq-answer')])
            answer_lengths.append(len(answer_text))
        
        avg_answer_len = sum(answer_lengths) / len(answer_lengths) if answer_lengths else 0
        scores['answer_depth'] = '✅' if avg_answer_len > 250 else '⚠️'
        if avg_answer_len < 250:
            recommendations.append(f"⚠️ Average answer length: {int(avg_answer_len)} chars. Expand for depth (aim for 250+)")
    
    # 8. SEMANTIC HTML
    has_sections = len(soup.find_all('div', class_='faq-section')) > 0
    scores['semantic_structure'] = '✅' if has_sections else '❌'
    if not has_sections:
        recommendations.append("❌ Missing semantic section structure")
    
    # 9. INTERNAL LINKS
    internal_links = soup.find_all('a', href=re.compile(r'^(?!http).*\.html'))
    scores['internal_linking'] = '✅' if len(internal_links) >= 3 else '⚠️'
    if len(internal_links) < 3:
        recommendations.append(f"⚠️ Only {len(internal_links)} internal links. Add more for SEO mesh")
    
    # 10. KEYWORD USAGE
    important_keywords = ['vatican', 'catholic', 'pope', 'church', 'teaching', 'ethics', 'ai', 'artificial intelligence']
    text_lower = content.lower()
    keyword_count = sum(text_lower.count(kw) for kw in important_keywords)
    scores['keyword_usage'] = '✅' if keyword_count >= 20 else '⚠️'
    if keyword_count < 20:
        recommendations.append(f"⚠️ Low keyword density ({keyword_count} occurrences)")
    
    # 11. TABLE OF CONTENTS
    has_toc = bool(soup.find('div', class_='toc'))
    scores['toc'] = '✅' if has_toc else '⚠️'
    if not has_toc:
        recommendations.append("⚠️ Missing table of contents")
    
    # Calculate overall score
    total = len(scores)
    passed = sum(1 for v in scores.values() if v == '✅')
    score_percent = int((passed / total) * 100)
    
    return scores, recommendations, score_percent

def print_analysis(filename, scores, recommendations, score_percent):
    """Print analysis results"""
    print("\n" + "="*80)
    print(f"ANALYZING: {filename}")
    print("="*80)
    print("\nOPTIMIZATION SCORES:")
    print("-"*80)
    
    score_labels = {
        'title_length': 'Title Length',
        'meta_desc_length': 'Meta Desc Length',
        'question_count': 'Question Count',
        'natural_language': 'Natural Language',
        'schema_markup': 'Schema Markup',
        'vatican_citations': 'Vatican Citations',
        'case_studies': 'Case Studies',
        'answer_depth': 'Answer Depth',
        'semantic_structure': 'Semantic Structure',
        'internal_linking': 'Internal Linking',
        'keyword_usage': 'Keyword Usage',
        'toc': 'Toc'
    }
    
    for key, label in score_labels.items():
        print(f"{scores[key]} {label}")
    
    print(f"\n📊 OVERALL SCORE: {score_percent}%")
    
    if recommendations:
        print(f"\n🔧 RECOMMENDATIONS ({len(recommendations)}):")
        print("-"*80)
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec}")
    else:
        print("\n✅ No recommendations - page is well optimized!")

def main():
    print("#"*80)
    print("# LLM/AI SEARCH OPTIMIZATION ANALYSIS")
    print("# Analyzing 6 FAQ pages")
    print("#"*80)
    
    faq_files = [
        'ai-bias-fairness.html',
        'ai-consciousness-souls.html',
        'ai-healthcare.html',
        'ai-jobs-catholic-teaching.html',
        'catholic-ai-ethics.html',
        'deepfakes-misinformation.html'
    ]
    
    results = {}
    
    for filename in faq_files:
        if os.path.exists(filename):
            scores, recommendations, score_percent = analyze_faq_page(filename)
            print_analysis(filename, scores, recommendations, score_percent)
            results[filename] = (score_percent, len(recommendations))
    
    # Summary
    print("\n" + "="*80)
    print("SUMMARY: ALL FAQ PAGES")
    print("="*80)
    print()
    
    sorted_results = sorted(results.items(), key=lambda x: (-x[1][0], x[1][1]))
    for filename, (score, issues) in sorted_results:
        status = "✅"
        print(f"{status} {filename}: {score}% ({issues} issues)")
    
    # Top priorities
    print("\n" + "="*80)
    print("TOP PRIORITY FIXES ACROSS ALL PAGES")
    print("="*80)
    print("\n")
    
    all_issues = {}
    for filename in faq_files:
        if os.path.exists(filename):
            _, recommendations, _ = analyze_faq_page(filename)
            for rec in recommendations:
                issue_type = rec.split(':')[0] if ':' in rec else rec
                if issue_type not in all_issues:
                    all_issues[issue_type] = []
                all_issues[issue_type].append(filename)
    
    for issue, files in all_issues.items():
        print(f"\n{issue}")
        print(f"   Affects: {', '.join(files)}")
    
    print("\n" + "="*80)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Analyze all FAQ pages for LLM/AI search optimization
"""
import os
import re
from bs4 import BeautifulSoup

def analyze_faq(filename):
    """Analyze a single FAQ file for LLM optimization"""
    
    print(f"\n{'='*80}")
    print(f"ANALYZING: {filename}")
    print(f"{'='*80}\n")
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    scores = {}
    recommendations = []
    
    # 1. META TITLE & DESCRIPTION
    title = soup.find('title')
    meta_desc = soup.find('meta', {'name': 'description'})
    
    if title:
        title_text = title.text
        title_len = len(title_text)
        scores['title_length'] = '✅' if 50 <= title_len <= 60 else '⚠️'
        
        if title_len < 50:
            recommendations.append(f"❌ Title too short ({title_len} chars). Expand to 50-60 chars with keywords")
        elif title_len > 60:
            recommendations.append(f"⚠️ Title too long ({title_len} chars). Shorten to 50-60 chars")
        
        # Check for keywords
        if 'Catholic' not in title_text and 'Vatican' not in title_text:
            recommendations.append("❌ Title missing 'Catholic' or 'Vatican' brand keyword")
        if 'AI' not in title_text and 'Artificial Intelligence' not in title_text:
            recommendations.append("❌ Title missing 'AI' keyword")
    else:
        scores['title_length'] = '❌'
        recommendations.append("❌ CRITICAL: Missing <title> tag")
    
    if meta_desc:
        desc_text = meta_desc.get('content', '')
        desc_len = len(desc_text)
        scores['meta_desc_length'] = '✅' if 150 <= desc_len <= 160 else '⚠️'
        
        if desc_len < 150:
            recommendations.append(f"⚠️ Meta description too short ({desc_len} chars). Expand to 150-160")
        elif desc_len > 160:
            recommendations.append(f"⚠️ Meta description too long ({desc_len} chars). Trim to 150-160")
    else:
        scores['meta_desc_length'] = '❌'
        recommendations.append("❌ CRITICAL: Missing meta description")
    
    # 2. QUESTION FORMAT
    questions = soup.find_all('h3', class_='faq-question')
    question_count = len(questions)
    
    scores['question_count'] = '✅' if question_count >= 12 else '⚠️'
    if question_count < 12:
        recommendations.append(f"⚠️ Only {question_count} questions. Aim for 15+ for comprehensive coverage")
    
    # Check question format
    natural_language_qs = 0
    for q in questions:
        q_text = q.text.strip()
        if any(q_text.lower().startswith(word) for word in ['what', 'why', 'how', 'can', 'should', 'does', 'is', 'are', 'will']):
            natural_language_qs += 1
    
    scores['natural_language'] = '✅' if natural_language_qs / question_count > 0.8 else '⚠️'
    if natural_language_qs / question_count <= 0.8:
        recommendations.append(f"⚠️ Only {natural_language_qs}/{question_count} questions use natural language format (what/how/why/etc)")
    
    # 3. STRUCTURED DATA (Schema.org)
    has_schema = 'application/ld+json' in content or 'schema.org' in content
    scores['schema_markup'] = '✅' if has_schema else '❌'
    if not has_schema:
        recommendations.append("❌ CRITICAL: Missing FAQ schema markup (application/ld+json)")
    
    # 4. VATICAN CITATIONS
    vatican_quotes = soup.find_all('div', class_='vatican-quote')
    scores['vatican_citations'] = '✅' if len(vatican_quotes) >= 3 else '⚠️'
    if len(vatican_quotes) < 3:
        recommendations.append(f"⚠️ Only {len(vatican_quotes)} Vatican citations. Add more for authority (aim for 3-5)")
    
    # 5. CASE STUDIES / EXAMPLES
    case_studies = soup.find_all('div', class_='case-study')
    scores['case_studies'] = '✅' if len(case_studies) >= 2 else '⚠️'
    if len(case_studies) < 2:
        recommendations.append(f"⚠️ Only {len(case_studies)} case studies. Add real-world examples for context")
    
    # 6. ANSWER LENGTH
    answers = soup.find_all('p', class_='faq-answer')
    if answers:
        avg_answer_len = sum(len(a.text) for a in answers) / len(answers)
        scores['answer_depth'] = '✅' if avg_answer_len > 200 else '⚠️'
        if avg_answer_len < 200:
            recommendations.append(f"⚠️ Average answer length: {int(avg_answer_len)} chars. Expand for depth (aim for 250+)")
    
    # 7. SEMANTIC HTML
    has_sections = len(soup.find_all('div', class_='faq-section')) > 0
    scores['semantic_structure'] = '✅' if has_sections else '❌'
    if not has_sections:
        recommendations.append("❌ Missing semantic section structure")
    
    # 8. INTERNAL LINKS
    internal_links = soup.find_all('a', href=re.compile(r'^(?!http).*\.html'))
    scores['internal_linking'] = '✅' if len(internal_links) >= 3 else '⚠️'
    if len(internal_links) < 3:
        recommendations.append(f"⚠️ Only {len(internal_links)} internal links. Add more for SEO mesh")
    
    # 9. KEYWORD DENSITY
    body_text = soup.get_text().lower()
    word_count = len(body_text.split())
    
    ai_mentions = body_text.count('ai ') + body_text.count('artificial intelligence')
    catholic_mentions = body_text.count('catholic') + body_text.count('vatican') + body_text.count('church')
    
    scores['keyword_usage'] = '✅' if ai_mentions >= 10 and catholic_mentions >= 10 else '⚠️'
    if ai_mentions < 10:
        recommendations.append(f"⚠️ 'AI' mentioned only {ai_mentions} times. Increase usage for relevance")
    if catholic_mentions < 10:
        recommendations.append(f"⚠️ Catholic keywords mentioned only {catholic_mentions} times. Increase brand presence")
    
    # 10. TABLE OF CONTENTS
    has_toc = soup.find('div', class_='toc') or soup.find('div', class_='table-of-contents')
    scores['toc'] = '✅' if has_toc else '❌'
    if not has_toc:
        recommendations.append("❌ Missing table of contents (helps LLM navigation)")
    
    # PRINT REPORT
    print("OPTIMIZATION SCORES:")
    print("-" * 80)
    for category, score in scores.items():
        print(f"{score} {category.replace('_', ' ').title()}")
    
    overall_score = list(scores.values()).count('✅') / len(scores) * 100
    print(f"\n📊 OVERALL SCORE: {overall_score:.0f}%")
    
    if recommendations:
        print(f"\n🔧 RECOMMENDATIONS ({len(recommendations)}):")
        print("-" * 80)
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec}")
    else:
        print("\n✅ No recommendations - page is well optimized!")
    
    return overall_score, recommendations

# Analyze all FAQ files
faq_files = [f for f in os.listdir('.') if f.endswith('.html') 
             and f not in ['_FAQ_TEMPLATE.html', 'index.html']]

print(f"\n{'#'*80}")
print(f"# LLM/AI SEARCH OPTIMIZATION ANALYSIS")
print(f"# Analyzing {len(faq_files)} FAQ pages")
print(f"{'#'*80}")

results = {}
for faq_file in sorted(faq_files):
    score, recs = analyze_faq(faq_file)
    results[faq_file] = (score, recs)

# SUMMARY
print(f"\n\n{'='*80}")
print("SUMMARY: ALL FAQ PAGES")
print(f"{'='*80}\n")

for faq_file, (score, recs) in sorted(results.items(), key=lambda x: x[1][0], reverse=True):
    status = "✅" if score >= 80 else "⚠️" if score >= 60 else "❌"
    print(f"{status} {faq_file}: {score:.0f}% ({len(recs)} issues)")

print(f"\n{'='*80}")
print("TOP PRIORITY FIXES ACROSS ALL PAGES")
print(f"{'='*80}\n")

# Collect all unique recommendations
all_recs = {}
for faq_file, (score, recs) in results.items():
    for rec in recs:
        # Extract the core issue (remove file-specific numbers)
        core_issue = re.sub(r'\d+', 'X', rec)
        if core_issue not in all_recs:
            all_recs[core_issue] = []
        all_recs[core_issue].append(faq_file)

# Print by frequency
for issue, files in sorted(all_recs.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"\n{issue}")
    print(f"   Affects: {', '.join(files)}")

print("\n" + "="*80)

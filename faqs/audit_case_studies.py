#!/usr/bin/env python3
"""
Case Study Authenticity Audit Tool
Scans FAQ files for case studies and categorizes them by verification status
"""

import re
import os
from pathlib import Path

def extract_case_studies(content):
    """Extract all case studies from HTML content."""
    case_studies = []
    
    # Pattern 1: <div class="case-study">
    pattern1 = r'<div class="case-study">(.*?)</div>'
    matches1 = re.findall(pattern1, content, re.DOTALL | re.IGNORECASE)
    
    # Pattern 2: <div class="case-study"> with nested divs
    pattern2 = r'<div class="case-study">.*?(?=<div class="case-study">|<div class="faq-item">|<div class="faq-section">|</div>\s*</div>)'
    matches2 = re.findall(pattern2, content, re.DOTALL | re.IGNORECASE)
    
    # Pattern 3: Case study headings
    pattern3 = r'<h3>(?:Real-World Example|Case Study|Thought Experiment):(.*?)</h3>(.*?)(?=<h3>|<div class="faq-item">|<div class="case-study">|<div class="vatican-quote">|</div>)'
    matches3 = re.findall(pattern3, content, re.DOTALL | re.IGNORECASE)
    
    # Combine all matches
    for match in matches1:
        case_studies.append(('div', match))
    
    for match in matches2:
        if match and len(match) > 50:  # Filter out small fragments
            case_studies.append(('div-nested', match))
    
    for title, body in matches3:
        case_studies.append(('heading', f"{title}\n{body}"))
    
    # Remove duplicates while preserving order
    seen = set()
    unique_studies = []
    for study_type, study in case_studies:
        study_text = re.sub(r'<[^>]+>', '', study).strip()[:100]  # First 100 chars as key
        if study_text not in seen and len(study_text) > 20:
            seen.add(study_text)
            unique_studies.append((study_type, study))
    
    return unique_studies

def categorize_case_study(study_text):
    """Categorize a case study as VERIFIED, UNCITED, or HYPOTHETICAL."""
    
    # Clean HTML tags for analysis
    clean_text = re.sub(r'<[^>]+>', ' ', study_text)
    clean_text = ' '.join(clean_text.split())
    
    # Keywords indicating real, documented cases
    real_indicators = [
        # Specific companies/organizations
        'Google', 'Microsoft', 'Amazon', 'IBM', 'Facebook', 'Meta', 'Apple', 'OpenAI',
        'Epic Systems', 'Mayo Clinic', 'ProPublica', 'MIT', 'Stanford', 'Harvard',
        'Vatican', 'Pope Francis', 'Pope Leo', 'WHO', 'UN', 'EU',
        
        # Specific years
        r'\b20\d{2}\b',  # Years 2000-2099
        r'\b19\d{2}\b',  # Years 1900-1999
        
        # Specific names
        'Blake Lemoine', 'LaMDA', 'ChatGPT', 'GPT', 'COMPAS', 'HireVue',
        
        # Real events/systems
        'Cambridge Analytica', 'Equifax', 'Target breach', 'Snowden',
        
        # Citations/sources
        'According to', 'reported', 'study', 'research', 'investigation',
        'New York Times', 'Wall Street Journal', 'BBC', 'CNN', 'Reuters',
        
        # Links
        'href=', 'http://', 'https://', '.com', '.org', '.edu'
    ]
    
    # Keywords indicating hypothetical scenarios
    hypothetical_indicators = [
        'Imagine', 'Suppose', 'hypothetical', 'Consider if', 'What if',
        'Let\'s say', 'For instance', 'thought experiment', 'Thought Experiment',
        'could be', 'might be', 'would be', 'Philosopher', 'proposed this scenario',
        'Chinese Room', 'Trolley Problem', 'Ship of Theseus'
    ]
    
    # Keywords indicating vague/generic examples
    vague_indicators = [
        'A company', 'A hospital', 'A school', 'A bank', 'An organization',
        'A Catholic hospital', 'A tech company', 'A startup', 'A government',
        'Some companies', 'Many organizations', 'Various institutions',
        'certain', 'some', 'many', 'various'
    ]
    
    # Check for real indicators
    has_real_indicator = False
    for indicator in real_indicators:
        if isinstance(indicator, str):
            if indicator in clean_text:
                has_real_indicator = True
                break
        else:  # regex pattern
            if re.search(indicator, clean_text):
                has_real_indicator = True
                break
    
    # Check for hypothetical indicators
    has_hypothetical = any(ind in clean_text for ind in hypothetical_indicators)
    
    # Check for vague indicators
    has_vague = any(ind in clean_text for ind in vague_indicators if ind in clean_text[:100])
    
    # Check for citations/links
    has_citation = bool(re.search(r'href=|http://|https://|<cite>|<a ', study_text))
    
    # Categorize
    if has_hypothetical and 'Thought Experiment' in clean_text:
        return "❌ HYPOTHETICAL", "Clearly marked as thought experiment"
    elif has_real_indicator and has_citation:
        return "✅ VERIFIED REAL", "Has source/citation and specific details"
    elif has_real_indicator and not has_citation:
        return "⚠️ REAL BUT UNCITED", "Appears real but missing source link"
    elif has_hypothetical or has_vague:
        return "❌ HYPOTHETICAL/QUESTIONABLE", "Appears made-up or too generic"
    elif has_citation:
        return "✅ VERIFIED REAL", "Has citation/link"
    else:
        return "⚠️ REAL BUT UNCITED", "Needs verification"

def audit_file(filepath):
    """Audit a single FAQ file for case studies."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    case_studies = extract_case_studies(content)
    
    results = {
        'filename': filename,
        'total': len(case_studies),
        'verified': [],
        'uncited': [],
        'hypothetical': []
    }
    
    for study_type, study_content in case_studies:
        category, reason = categorize_case_study(study_content)
        
        # Extract title/summary
        title_match = re.search(r'<h3>(.*?)</h3>', study_content)
        if title_match:
            title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip()
        else:
            # Get first line or first 80 chars
            clean_study = re.sub(r'<[^>]+>', ' ', study_content)
            title = ' '.join(clean_study.split()[:15]) + "..."
        
        study_info = {
            'title': title,
            'reason': reason,
            'content_snippet': study_content[:200]
        }
        
        if "✅" in category:
            results['verified'].append(study_info)
        elif "⚠️" in category:
            results['uncited'].append(study_info)
        else:
            results['hypothetical'].append(study_info)
    
    return results

def main():
    """Run audit on all FAQ files."""
    
    # Get all FAQ files
    faq_files = []
    for file in sorted(os.listdir('.')):
        if file.endswith('.html') and ('faq' in file.lower() or file.startswith('vatican-') or file == 'dcf_faq_ai_wisdom.html'):
            if file not in ['_FAQ_TEMPLATE.html', 'faq_index_reference.html', 'index.html']:
                faq_files.append(file)
    
    print("=" * 80)
    print("CASE STUDY AUTHENTICITY AUDIT REPORT")
    print("=" * 80)
    print()
    
    # Priority files (recently optimized)
    priority_files = [
        'ai-healthcare-faq.html',
        'ai-bias-fairness-faq.html',
        'ai-jobs-workplace-faq.html',
        'ai-privacy-surveillance-faq.html',
        'ai-consciousness-souls-faq.html'
    ]
    
    # Audit priority files first
    print("RECENTLY OPTIMIZED FAQs (Priority Audit)")
    print("-" * 80)
    
    all_results = []
    
    for file in priority_files:
        if file in faq_files:
            results = audit_file(file)
            all_results.append(results)
            print_results(results)
    
    print("\nREMAINING FAQ FILES")
    print("-" * 80)
    
    # Audit remaining files
    for file in faq_files:
        if file not in priority_files:
            results = audit_file(file)
            all_results.append(results)
            print_results(results)
    
    # Summary statistics
    print("\n" + "=" * 80)
    print("SUMMARY STATISTICS")
    print("=" * 80)
    
    total_studies = sum(r['total'] for r in all_results)
    total_verified = sum(len(r['verified']) for r in all_results)
    total_uncited = sum(len(r['uncited']) for r in all_results)
    total_hypothetical = sum(len(r['hypothetical']) for r in all_results)
    
    print(f"Total case studies found: {total_studies}")
    print(f"✅ VERIFIED REAL: {total_verified} ({total_verified*100//total_studies if total_studies else 0}%)")
    print(f"⚠️ REAL BUT UNCITED: {total_uncited} ({total_uncited*100//total_studies if total_studies else 0}%)")
    print(f"❌ HYPOTHETICAL/QUESTIONABLE: {total_hypothetical} ({total_hypothetical*100//total_studies if total_studies else 0}%)")
    
    # Files needing attention
    print("\n" + "=" * 80)
    print("FILES REQUIRING ATTENTION")
    print("=" * 80)
    
    for results in all_results:
        if results['uncited'] or results['hypothetical']:
            print(f"\n📄 {results['filename']}")
            
            if results['uncited']:
                print(f"  ⚠️ NEEDS CITATIONS: {len(results['uncited'])} case studies")
                for study in results['uncited']:
                    print(f"    - {study['title'][:60]}")
            
            if results['hypothetical']:
                print(f"  ❌ NEEDS REPLACEMENT: {len(results['hypothetical'])} hypothetical examples")
                for study in results['hypothetical']:
                    print(f"    - {study['title'][:60]}")

def print_results(results):
    """Print results for a single file."""
    print(f"\n{results['filename']}")
    print(f"  Total case studies: {results['total']}")
    
    if results['total'] == 0:
        print("  No case studies found")
        return
    
    print(f"  ✅ VERIFIED: {len(results['verified'])}")
    for study in results['verified'][:2]:  # Show first 2
        print(f"    - {study['title'][:60]}")
    
    if results['uncited']:
        print(f"  ⚠️ REAL BUT UNCITED: {len(results['uncited'])}")
        for study in results['uncited'][:2]:
            print(f"    - {study['title'][:60]}")
    
    if results['hypothetical']:
        print(f"  ❌ HYPOTHETICAL: {len(results['hypothetical'])}")
        for study in results['hypothetical'][:2]:
            print(f"    - {study['title'][:60]}")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Analyze all FAQ pages for LLM/AI Search optimization
Generates comprehensive SEO score report
"""

import os
import re
from pathlib import Path
from datetime import datetime

class FAQAnalyzer:
    def __init__(self):
        self.results = {}
        self.faq_files = []
        
    def find_faq_files(self):
        """Find all FAQ HTML files"""
        faq_dir = Path('.')
        
        # Get all FAQ files
        for file in faq_dir.glob('*-faq.html'):
            self.faq_files.append(file)
        
        # Add dcf_faq_ai_wisdom.html (doesn't follow naming convention)
        special_file = faq_dir / 'dcf_faq_ai_wisdom.html'
        if special_file.exists():
            self.faq_files.append(special_file)
            
        self.faq_files.sort()
        
    def analyze_filename(self, filepath):
        """Score filename optimization (10% weight)"""
        score = 0
        details = []
        
        filename = filepath.name
        
        # Check for -faq.html suffix (10 points)
        if filename.endswith('-faq.html'):
            score += 10
            details.append("✅ Has -faq.html suffix")
        elif 'faq' in filename.lower():
            score += 5
            details.append("⚠️ Has 'faq' but not -faq.html suffix")
        else:
            details.append("❌ Missing -faq.html suffix")
            
        # Bonus for descriptive slug
        if len(filename) > 15 and '-' in filename:
            details.append("✅ Descriptive slug")
        
        return score, details
        
    def analyze_title(self, content):
        """Score title tag optimization (20% weight)"""
        score = 0
        details = []
        
        # Extract title tag
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
        
        if not title_match:
            details.append("❌ No title tag found")
            return score, details, None
            
        title = title_match.group(1)
        
        # Contains FAQ? (10 points)
        if 'FAQ' in title or 'Frequently Asked' in title:
            score += 10
            details.append("✅ Contains 'FAQ'")
        else:
            details.append("❌ Missing 'FAQ' in title")
            
        # Under 60 characters? (5 points)
        if len(title) <= 60:
            score += 5
            details.append(f"✅ Length: {len(title)} chars (optimal)")
        elif len(title) <= 70:
            score += 3
            details.append(f"⚠️ Length: {len(title)} chars (acceptable)")
        else:
            details.append(f"❌ Length: {len(title)} chars (too long)")
            
        # Includes keywords? (5 points)
        keywords = ['Catholic', 'Church', 'Vatican', 'AI', 'ethics', 'teaching']
        keyword_count = sum(1 for kw in keywords if kw.lower() in title.lower())
        if keyword_count >= 2:
            score += 5
            details.append(f"✅ Contains {keyword_count} keywords")
        elif keyword_count == 1:
            score += 3
            details.append(f"⚠️ Contains only {keyword_count} keyword")
        else:
            details.append("❌ Missing important keywords")
            
        return score, details, title
        
    def analyze_meta_description(self, content):
        """Score meta description optimization (15% weight)"""
        score = 0
        details = []
        
        # Extract meta description
        meta_match = re.search(r'<meta name="description" content="([^"]*)"', content, re.IGNORECASE)
        
        if not meta_match:
            details.append("❌ No meta description found")
            return score, details
            
        description = meta_match.group(1)
        
        # Exists? (5 points)
        score += 5
        details.append("✅ Meta description exists")
        
        # 150-160 characters? (5 points)
        desc_len = len(description)
        if 150 <= desc_len <= 160:
            score += 5
            details.append(f"✅ Length: {desc_len} chars (perfect)")
        elif 140 <= desc_len <= 170:
            score += 3
            details.append(f"⚠️ Length: {desc_len} chars (acceptable)")
        else:
            details.append(f"❌ Length: {desc_len} chars (not optimal)")
            
        # Includes FAQ or questions? (5 points)
        if 'FAQ' in description or 'question' in description.lower() or 'answer' in description.lower():
            score += 5
            details.append("✅ Contains FAQ-related terms")
        else:
            details.append("❌ Missing FAQ-related terms")
            
        return score, details
        
    def analyze_content_structure(self, content):
        """Score content structure optimization (25% weight)"""
        score = 0
        details = []
        
        # Has <h3> questions with "?"? (10 points)
        question_pattern = r'<h3[^>]*class="faq-question"[^>]*>([^<]+)\?</h3>'
        questions = re.findall(question_pattern, content)
        
        if len(questions) >= 10:
            score += 10
            details.append(f"✅ {len(questions)} questions with '?'")
        elif len(questions) >= 5:
            score += 5
            details.append(f"⚠️ Only {len(questions)} questions (need 10+)")
        else:
            details.append(f"❌ Only {len(questions)} questions found")
            
        # Questions are descriptive? (5 points)
        if questions:
            avg_length = sum(len(q) for q in questions) / len(questions)
            if avg_length >= 30:
                score += 5
                details.append(f"✅ Questions are descriptive (avg {avg_length:.0f} chars)")
            else:
                details.append(f"❌ Questions too short (avg {avg_length:.0f} chars)")
                
        # Answers are comprehensive? (5 points)
        answer_pattern = r'<p class="faq-answer">([^<]+)</p>'
        answers = re.findall(answer_pattern, content)
        
        if answers:
            long_answers = sum(1 for a in answers if len(a) >= 250)
            if long_answers >= len(answers) * 0.8:
                score += 5
                details.append(f"✅ {long_answers}/{len(answers)} answers are 250+ chars")
            elif long_answers >= len(answers) * 0.5:
                score += 3
                details.append(f"⚠️ {long_answers}/{len(answers)} answers are 250+ chars")
            else:
                details.append(f"❌ Only {long_answers}/{len(answers)} answers are 250+ chars")
                
        # Has table of contents? (5 points)
        if 'class="toc-section"' in content or 'Table of Contents' in content:
            score += 5
            details.append("✅ Has table of contents")
        else:
            details.append("❌ Missing table of contents")
            
        return score, details, len(questions)
        
    def analyze_internal_linking(self, content):
        """Score internal linking optimization (20% weight)"""
        score = 0
        details = []
        
        # Has "Additional Vatican Resources" section? (5 points)
        if 'id="additional-resources"' in content or 'Additional Vatican Resources' in content:
            score += 5
            details.append("✅ Has Additional Vatican Resources section")
        else:
            details.append("❌ Missing Additional Vatican Resources")
            
        # Has "Related FAQs" section? (5 points)
        if 'id="related"' in content or 'Related FAQs' in content:
            score += 5
            details.append("✅ Has Related FAQs section")
        else:
            details.append("❌ Missing Related FAQs section")
            
        # Links use descriptive anchor text? (5 points)
        bad_anchors = re.findall(r'<a[^>]*>(?:click here|here|link|read more)</a>', content.lower())
        if not bad_anchors:
            score += 5
            details.append("✅ All links use descriptive text")
        else:
            details.append(f"❌ Found {len(bad_anchors)} non-descriptive links")
            
        # Has 4+ internal links? (5 points)
        internal_links = re.findall(r'href="[^"]*\.html"', content)
        link_count = len(internal_links)
        
        if link_count >= 8:
            score += 5
            details.append(f"✅ {link_count} internal links")
        elif link_count >= 4:
            score += 3
            details.append(f"⚠️ {link_count} internal links (good but could add more)")
        else:
            details.append(f"❌ Only {link_count} internal links")
            
        return score, details, link_count
        
    def analyze_semantic_markup(self, content):
        """Score semantic markup optimization (10% weight)"""
        score = 0
        details = []
        
        # Proper heading hierarchy? (5 points)
        has_h1 = bool(re.search(r'<h1[^>]*>', content))
        has_h2 = bool(re.search(r'<h2[^>]*>', content))
        has_h3 = bool(re.search(r'<h3[^>]*>', content))
        
        if has_h1 and has_h2 and has_h3:
            score += 5
            details.append("✅ Proper heading hierarchy (h1→h2→h3)")
        else:
            details.append("❌ Incomplete heading hierarchy")
            
        # Semantic HTML5 elements? (5 points)
        semantic_elements = ['<main', '<nav', '<header', '<footer', '<section', '<article']
        semantic_count = sum(1 for elem in semantic_elements if elem in content)
        
        if semantic_count >= 3:
            score += 5
            details.append(f"✅ Uses {semantic_count} semantic HTML5 elements")
        elif semantic_count >= 1:
            score += 3
            details.append(f"⚠️ Uses only {semantic_count} semantic elements")
        else:
            details.append("❌ Missing semantic HTML5 elements")
            
        # Note about FAQ Schema
        if '"@type": "FAQPage"' in content:
            details.append("✅ Has FAQ Schema markup")
        else:
            details.append("📝 Could add FAQ Schema markup (future enhancement)")
            
        return score, details
        
    def analyze_file(self, filepath):
        """Analyze a single FAQ file"""
        result = {
            'filename': filepath.name,
            'scores': {},
            'details': {},
            'overall_score': 0,
            'title': '',
            'questions': 0,
            'links': 0
        }
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Run all analyses
            score1, details1 = self.analyze_filename(filepath)
            score2, details2, title = self.analyze_title(content)
            score3, details3 = self.analyze_meta_description(content)
            score4, details4, questions = self.analyze_content_structure(content)
            score5, details5, links = self.analyze_internal_linking(content)
            score6, details6 = self.analyze_semantic_markup(content)
            
            # Store results
            result['scores'] = {
                'filename': score1,
                'title': score2,
                'meta': score3,
                'content': score4,
                'linking': score5,
                'semantic': score6
            }
            
            result['details'] = {
                'filename': details1,
                'title': details2,
                'meta': details3,
                'content': details4,
                'linking': details5,
                'semantic': details6
            }
            
            # Calculate weighted overall score
            weights = {
                'filename': 0.10,
                'title': 0.20,
                'meta': 0.15,
                'content': 0.25,
                'linking': 0.20,
                'semantic': 0.10
            }
            
            # Each category is out of different max points
            max_points = {
                'filename': 10,
                'title': 20,
                'meta': 15,
                'content': 25,
                'linking': 20,
                'semantic': 10
            }
            
            overall = 0
            for category, score in result['scores'].items():
                normalized = (score / max_points[category]) * 100
                overall += normalized * weights[category]
                
            result['overall_score'] = round(overall, 1)
            result['title'] = title if title else filepath.name
            result['questions'] = questions
            result['links'] = links
            
        except Exception as e:
            result['error'] = str(e)
            result['overall_score'] = 0
            
        return result
        
    def generate_report(self):
        """Generate the SEO analysis report"""
        report = []
        report.append("# FAQ SEO/LLM Optimization Analysis Report")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        report.append("")
        report.append("---")
        report.append("")
        
        # Individual FAQ analyses
        report.append("## Individual FAQ Analysis")
        report.append("")
        
        all_scores = []
        
        for filepath in self.faq_files:
            result = self.analyze_file(filepath)
            self.results[filepath.name] = result
            all_scores.append((result['overall_score'], filepath.name, result))
            
            report.append(f"### {filepath.name}")
            report.append(f"**Overall Score: {result['overall_score']}/100**")
            report.append("")
            
            # Category scores
            report.append("#### Scores by Category:")
            report.append("| Category | Score | Weight | Details |")
            report.append("|----------|-------|--------|---------|")
            
            categories = [
                ('Filename', 'filename', 10, 10),
                ('Title Tag', 'title', 20, 20),
                ('Meta Description', 'meta', 15, 15),
                ('Content Structure', 'content', 25, 25),
                ('Internal Linking', 'linking', 20, 20),
                ('Semantic Markup', 'semantic', 10, 10)
            ]
            
            for cat_name, cat_key, weight, max_score in categories:
                score = result['scores'].get(cat_key, 0)
                pct = (score / max_score) * 100
                report.append(f"| {cat_name} | {score}/{max_score} ({pct:.0f}%) | {weight}% | See below |")
            
            report.append("")
            report.append("#### Details:")
            
            for category, details in result['details'].items():
                if details:
                    report.append(f"**{category.title()}:**")
                    for detail in details:
                        report.append(f"- {detail}")
                    report.append("")
                    
            if 'error' in result:
                report.append(f"⚠️ **Error analyzing file:** {result['error']}")
                report.append("")
                
            report.append("---")
            report.append("")
            
        # Summary Statistics
        report.append("## Summary Statistics")
        report.append("")
        
        # Sort by score
        all_scores.sort(reverse=True)
        
        # Average score
        if all_scores:
            avg_score = sum(s[0] for s in all_scores) / len(all_scores)
            report.append(f"### Average Score: {avg_score:.1f}/100")
            report.append("")
            
            # Top 5
            report.append("### Top 5 Best Optimized FAQs:")
            for i, (score, name, _) in enumerate(all_scores[:5], 1):
                report.append(f"{i}. **{name}** - {score}/100")
            report.append("")
            
            # Bottom 5
            report.append("### Bottom 5 Needing Improvement:")
            for i, (score, name, _) in enumerate(reversed(all_scores[-5:]), 1):
                report.append(f"{i}. **{name}** - {score}/100")
            report.append("")
            
        # Quick Wins
        report.append("## Quick Wins (Easy Fixes for Big Impact)")
        report.append("")
        
        quick_wins = []
        
        for name, result in self.results.items():
            # Check for easy fixes
            if result['scores'].get('title', 0) < 10:
                if 'FAQ' not in result.get('title', ''):
                    quick_wins.append(f"- **{name}**: Add 'FAQ' to title tag (+10 points)")
                    
            if result['scores'].get('linking', 0) < 10:
                if 'Missing Additional Vatican Resources' in str(result['details'].get('linking', [])):
                    quick_wins.append(f"- **{name}**: Add Vatican Resources section (+5 points)")
                if 'Missing Related FAQs' in str(result['details'].get('linking', [])):
                    quick_wins.append(f"- **{name}**: Add Related FAQs section (+5 points)")
                    
            if result['scores'].get('content', 0) < 15:
                if result.get('questions', 0) < 10:
                    quick_wins.append(f"- **{name}**: Add more questions (has {result.get('questions', 0)}, need 10+)")
                    
        if quick_wins:
            for win in quick_wins[:10]:  # Show top 10 quick wins
                report.append(win)
        else:
            report.append("✅ All FAQs are well-optimized!")
            
        report.append("")
        report.append("---")
        report.append("")
        report.append("## Recommendations")
        report.append("")
        report.append("1. **Immediate Actions:**")
        report.append("   - Add 'FAQ' to any titles missing it")
        report.append("   - Ensure all FAQs have Vatican Resources and Related FAQs sections")
        report.append("   - Expand short answers to 250+ characters")
        report.append("")
        report.append("2. **Future Enhancements:**")
        report.append("   - Implement FAQ Schema markup on all pages")
        report.append("   - Add more internal cross-linking between related topics")
        report.append("   - Consider adding breadcrumb navigation")
        report.append("")
        
        return '\n'.join(report)
        
    def run(self):
        """Run the complete analysis"""
        print("Finding FAQ files...")
        self.find_faq_files()
        print(f"Found {len(self.faq_files)} FAQ files")
        
        print("Analyzing files...")
        report = self.generate_report()
        
        # Save report
        output_file = 'faq_seo_scores.md'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)
            
        print(f"✅ Report saved to {output_file}")
        
        # Show summary
        scores = [self.results[f.name]['overall_score'] for f in self.faq_files if f.name in self.results]
        if scores:
            avg = sum(scores) / len(scores)
            print(f"\n📊 Average SEO Score: {avg:.1f}/100")
            print(f"📈 Highest: {max(scores):.1f}/100")
            print(f"📉 Lowest: {min(scores):.1f}/100")

def main():
    analyzer = FAQAnalyzer()
    analyzer.run()

if __name__ == "__main__":
    main()
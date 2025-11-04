#!/usr/bin/env python3
"""
Recursive LAUNCH_MENU Crawler
Starts from LAUNCH_MENU pages and recursively follows all internal links
Captures the complete accessible site tree
"""

import os
import re
from pathlib import Path
from collections import defaultdict, deque
import json

class RecursiveLaunchCrawler:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.visited = set()
        self.to_visit = deque()
        self.all_pages = set()
        self.page_links = defaultdict(set)
        self.page_dependencies = defaultdict(lambda: {
            'js': set(),
            'css': set(),
            'images': set()
        })
        self.all_dependencies = {
            'javascript': set(),
            'stylesheets': set(),
            'images': set()
        }
        
        # Pages discovered by section
        self.pages_by_section = defaultdict(set)
        
        # Auth/member patterns to avoid
        self.auth_patterns = [
            '/admin/', '/members/', '/auth/',
            'login', 'signin', 'signup', 'dashboard',
            'profile_', '_manage', 'create_', 'edit_',
            'onboarding', 'logout'
        ]
        
        # LAUNCH_MENU starting pages
        self.launch_menu_pages = [
            'index.html',
            'blog/index.html',
            'blog/all_blog_posts.html',
            'initiatives/initiatives_home.html',
            'initiatives/peace/initiative_peace.html',
            'initiatives/education/initiative_education.html',
            'initiatives/health/initiative_health.html',
            'initiatives/research/initiative_research.html',
            'public/dcf_values.html',
            'public/dcf_contact.html',
            'public/dcf_ai_resources.html',
            'public/dcf_articles_library.html',
            'faqs/index.html',
            'people/index.html'
        ]
        
        # Track crawl depth for reporting
        self.page_depth = {}
        self.blocked_pages = set()
        
    def is_accessible_page(self, path):
        """Check if a page should be crawled"""
        path_str = str(path).lower()
        
        # Skip auth/member areas
        for pattern in self.auth_patterns:
            if pattern in path_str:
                return False
        
        # Skip test/backup files
        if any(x in path_str for x in ['test', 'temp_', 'backup', '.bak', 'old']):
            return False
            
        # Allow public pages, blogs, FAQs, vatican resources, initiatives
        return True
    
    def crawl(self):
        """Start recursive crawling from LAUNCH_MENU pages"""
        print("=" * 80)
        print("RECURSIVE LAUNCH_MENU CRAWLER")
        print("=" * 80)
        print(f"\nStarting with {len(self.launch_menu_pages)} LAUNCH_MENU pages...")
        
        # Add all launch menu pages as starting points
        for page in self.launch_menu_pages:
            if (self.base_dir / page).exists():
                self.to_visit.append((page, 0))  # (page, depth)
                self.page_depth[page] = 0
                print(f"  ✓ Added starting point: {page}")
            else:
                print(f"  ✗ Starting page not found: {page}")
        
        print(f"\n{'='*60}")
        print("Beginning recursive crawl...")
        print(f"{'='*60}\n")
        
        pages_crawled = 0
        
        while self.to_visit:
            current, depth = self.to_visit.popleft()
            
            if current in self.visited:
                continue
                
            self.visited.add(current)
            
            # Check if accessible
            if not self.is_accessible_page(current):
                self.blocked_pages.add(current)
                print(f"  [Depth {depth}] ❌ Blocked: {current}")
                continue
                
            full_path = self.base_dir / current
            if not full_path.exists() or not full_path.is_file():
                continue
            
            pages_crawled += 1
            print(f"  [Depth {depth}] Analyzing: {current}")
            
            self.all_pages.add(current)
            self.page_depth[current] = depth
            self.categorize_page(current)
            
            # Analyze the page
            links, deps = self.analyze_page(full_path)
            
            # Store dependencies
            self.page_dependencies[current] = deps
            self.all_dependencies['javascript'].update(deps['js'])
            self.all_dependencies['stylesheets'].update(deps['css'])
            self.all_dependencies['images'].update(deps['images'])
            
            # Add new links to visit (recursive step)
            for link in links:
                if link not in self.visited and self.is_accessible_page(link):
                    if link.endswith('.html'):
                        self.to_visit.append((link, depth + 1))
                        self.page_links[current].add(link)
            
            # Progress indicator
            if pages_crawled % 10 == 0:
                print(f"    → Progress: {pages_crawled} pages analyzed, {len(self.to_visit)} in queue")
                        
        return self.generate_report()
    
    def categorize_page(self, page):
        """Categorize page by section"""
        if page == 'index.html':
            self.pages_by_section['Homepage'].add(page)
        elif page.startswith('blog/'):
            self.pages_by_section['Blog'].add(page)
        elif page.startswith('initiatives/'):
            self.pages_by_section['Initiatives'].add(page)
        elif page.startswith('public/'):
            self.pages_by_section['Public'].add(page)
        elif page.startswith('faqs/'):
            self.pages_by_section['FAQs'].add(page)
        elif page.startswith('vatican-resources/'):
            self.pages_by_section['Vatican Resources'].add(page)
        elif page.startswith('people/'):
            self.pages_by_section['People'].add(page)
        elif page.startswith('events/'):
            self.pages_by_section['Events'].add(page)
        elif page.startswith('projects/'):
            self.pages_by_section['Projects'].add(page)
        elif page.startswith('resources/'):
            self.pages_by_section['Resources'].add(page)
        elif page.startswith('news/'):
            self.pages_by_section['News'].add(page)
        else:
            self.pages_by_section['Other'].add(page)
    
    def analyze_page(self, file_path):
        """Analyze a single HTML page for links and dependencies"""
        links = set()
        deps = {'js': set(), 'css': set(), 'images': set()}
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract href links
            href_patterns = [
                r'<a[^>]*href=["\']([^"\'#]+\.html)["\']',
                r'window\.location\.href=["\']([^"\']+\.html)["\']',
                r'onclick="window\.location\.href=[\'"]([^"\']+\.html)[\'"]"'
            ]
            
            for pattern in href_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    link = match.group(1)
                    
                    # Skip external links
                    if link.startswith('http') or link.startswith('//'):
                        continue
                        
                    # Normalize path
                    normalized = self.normalize_path(link, file_path)
                    if normalized:
                        links.add(normalized)
            
            # Extract JavaScript files
            js_patterns = [r'<script[^>]*src=["\']([^"\']+\.js)["\']']
            for pattern in js_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    js_file = match.group(1)
                    if not js_file.startswith('http'):
                        normalized = self.normalize_path(js_file, file_path)
                        if normalized:
                            deps['js'].add(normalized)
            
            # Extract CSS files
            css_patterns = [r'<link[^>]*href=["\']([^"\']+\.css)["\']']
            for pattern in css_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    css_file = match.group(1)
                    if not css_file.startswith('http'):
                        normalized = self.normalize_path(css_file, file_path)
                        if normalized:
                            deps['css'].add(normalized)
            
            # Extract static images
            img_patterns = [r'<img[^>]*src=["\']([^"\'$]+\.(jpg|jpeg|png|gif|svg|webp))["\']']
            for pattern in img_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    img_file = match.group(1)
                    if not img_file.startswith('http') and '$' not in img_file:
                        normalized = self.normalize_path(img_file, file_path)
                        if normalized:
                            deps['images'].add(normalized)
                            
        except Exception as e:
            print(f"    Error analyzing {file_path}: {e}")
            
        return links, deps
    
    def normalize_path(self, path, current_file):
        """Normalize relative paths"""
        if not path or path.startswith('http') or path.startswith('//'):
            return None
            
        # Remove query strings and fragments
        path = path.split('?')[0].split('#')[0]
        
        # Handle absolute paths
        if path.startswith('/'):
            path = path[1:]
        else:
            # Resolve relative paths
            current_dir = current_file.parent
            resolved = current_dir / path
            try:
                resolved = resolved.resolve()
                path = str(resolved.relative_to(self.base_dir))
            except (ValueError, FileNotFoundError):
                return None
        
        return path.replace('\\', '/')
    
    def generate_report(self):
        """Generate comprehensive report"""
        report = []
        report.append("=" * 80)
        report.append("RECURSIVE LAUNCH_MENU SITE MANIFEST")
        report.append("Complete accessible site tree from LAUNCH_MENU starting points")
        report.append("=" * 80)
        report.append("")
        
        # Summary by section
        report.append("PAGES BY SECTION")
        report.append("-" * 40)
        
        section_order = ['Homepage', 'Blog', 'Initiatives', 'Public', 'FAQs', 
                        'Vatican Resources', 'People', 'Events', 'Projects', 
                        'Resources', 'News', 'Other']
        
        for section in section_order:
            if section in self.pages_by_section:
                pages = self.pages_by_section[section]
                report.append(f"\n{section}: {len(pages)} pages")
                
                # Show sample pages for large sections
                if len(pages) > 10:
                    sample = sorted(pages)[:5]
                    for page in sample:
                        depth = self.page_depth.get(page, '?')
                        report.append(f"  [D{depth}] {page}")
                    report.append(f"  ... and {len(pages) - 5} more")
                else:
                    for page in sorted(pages):
                        depth = self.page_depth.get(page, '?')
                        report.append(f"  [D{depth}] {page}")
        
        report.append("")
        
        # Crawl depth analysis
        report.append("CRAWL DEPTH ANALYSIS")
        report.append("-" * 40)
        depth_counts = defaultdict(int)
        for page, depth in self.page_depth.items():
            depth_counts[depth] += 1
        
        for depth in sorted(depth_counts.keys()):
            report.append(f"  Depth {depth}: {depth_counts[depth]} pages")
        
        report.append("")
        
        # Dependencies
        js_files = sorted(self.all_dependencies['javascript'])
        report.append(f"JAVASCRIPT DEPENDENCIES ({len(js_files)} files)")
        report.append("-" * 40)
        for js in js_files:
            report.append(f"  - {js}")
        report.append("")
        
        css_files = sorted(self.all_dependencies['stylesheets'])
        report.append(f"CSS STYLESHEETS ({len(css_files)} files)")
        report.append("-" * 40)
        for css in css_files:
            report.append(f"  - {css}")
        report.append("")
        
        # Images
        if self.all_dependencies['images']:
            img_files = sorted(self.all_dependencies['images'])
            report.append(f"STATIC IMAGES ({len(img_files)} files)")
            report.append("-" * 40)
            for img in img_files[:10]:
                report.append(f"  - {img}")
            if len(img_files) > 10:
                report.append(f"  ... and {len(img_files) - 10} more")
            report.append("")
        
        # Summary
        report.append("SUMMARY")
        report.append("-" * 40)
        report.append(f"Starting points: {len(self.launch_menu_pages)} LAUNCH_MENU pages")
        report.append(f"Total pages discovered: {len(self.all_pages)}")
        report.append(f"Pages blocked (auth/admin): {len(self.blocked_pages)}")
        report.append(f"Maximum crawl depth: {max(self.page_depth.values()) if self.page_depth else 0}")
        report.append("")
        
        report.append("Section Breakdown:")
        for section in section_order:
            if section in self.pages_by_section:
                count = len(self.pages_by_section[section])
                report.append(f"  {section:20} {count:4} pages")
        
        report.append("")
        report.append(f"Total JavaScript files: {len(js_files)}")
        report.append(f"Total CSS files: {len(css_files)}")
        report.append(f"Total static images: {len(self.all_dependencies['images'])}")
        
        total_files = (len(self.all_pages) + len(js_files) + 
                      len(css_files) + len(self.all_dependencies['images']))
        report.append(f"\nTOTAL FILES IN COMPLETE SITE: {total_files}")
        
        # Growth analysis
        report.append("\nGROWTH FROM LAUNCH_MENU:")
        report.append("-" * 40)
        report.append(f"  LAUNCH_MENU only: {len(self.launch_menu_pages)} pages")
        report.append(f"  After recursive crawl: {len(self.all_pages)} pages")
        report.append(f"  Growth factor: {len(self.all_pages) / len(self.launch_menu_pages):.1f}x")
        
        # Save detailed breakdown
        report.append("\nDETAILED DISCOVERIES:")
        report.append("-" * 40)
        
        # Blog posts discovered
        blog_posts = [p for p in self.pages_by_section.get('Blog', []) 
                     if p not in ['blog/index.html', 'blog/all_blog_posts.html']]
        if blog_posts:
            report.append(f"\nBlog Posts Found: {len(blog_posts)}")
            for post in sorted(blog_posts)[:10]:
                report.append(f"  - {post}")
            if len(blog_posts) > 10:
                report.append(f"  ... and {len(blog_posts) - 10} more")
        
        # FAQs discovered
        faq_pages = [p for p in self.pages_by_section.get('FAQs', []) 
                    if p != 'faqs/index.html']
        if faq_pages:
            report.append(f"\nFAQ Pages Found: {len(faq_pages)}")
            for faq in sorted(faq_pages)[:10]:
                report.append(f"  - {faq}")
            if len(faq_pages) > 10:
                report.append(f"  ... and {len(faq_pages) - 10} more")
        
        # Vatican documents discovered
        vatican_docs = self.pages_by_section.get('Vatican Resources', set())
        if vatican_docs:
            report.append(f"\nVatican Documents Found: {len(vatican_docs)}")
            for doc in sorted(vatican_docs)[:10]:
                report.append(f"  - {doc}")
            if len(vatican_docs) > 10:
                report.append(f"  ... and {len(vatican_docs) - 10} more")
        
        report_text = '\n'.join(report)
        
        # Save report
        with open(self.base_dir / 'RECURSIVE_LAUNCH_MANIFEST.txt', 'w') as f:
            f.write(report_text)
        
        # Save JSON manifest
        json_manifest = {
            'launch_menu_starting_points': self.launch_menu_pages,
            'total_pages_discovered': len(self.all_pages),
            'all_pages': sorted(list(self.all_pages)),
            'pages_by_section': {
                section: sorted(list(pages))
                for section, pages in self.pages_by_section.items()
            },
            'javascript': sorted(list(self.all_dependencies['javascript'])),
            'stylesheets': sorted(list(self.all_dependencies['stylesheets'])),
            'images': sorted(list(self.all_dependencies['images']))[:50],  # Limit for size
            'crawl_depth_analysis': dict(self.page_depth),
            'summary': {
                'starting_points': len(self.launch_menu_pages),
                'total_pages': len(self.all_pages),
                'total_javascript': len(self.all_dependencies['javascript']),
                'total_css': len(self.all_dependencies['stylesheets']),
                'total_images': len(self.all_dependencies['images']),
                'total_files': total_files,
                'max_depth': max(self.page_depth.values()) if self.page_depth else 0,
                'growth_factor': len(self.all_pages) / len(self.launch_menu_pages)
            }
        }
        
        with open(self.base_dir / 'recursive_launch_manifest.json', 'w') as f:
            json.dump(json_manifest, f, indent=2)
        
        print(report_text)
        print("\n✓ Manifest saved to: RECURSIVE_LAUNCH_MANIFEST.txt")
        print("✓ JSON saved to: recursive_launch_manifest.json")
        
        return report_text

if __name__ == "__main__":
    crawler = RecursiveLaunchCrawler('/Users/christopherhoar/Desktop/dcfh')
    crawler.crawl()
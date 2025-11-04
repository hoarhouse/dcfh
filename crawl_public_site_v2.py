#!/usr/bin/env python3
"""
Enhanced Public Website Crawler
Crawls only publicly accessible pages including onclick navigation
"""

import os
import re
from pathlib import Path
from collections import defaultdict
import json

class PublicSiteCrawlerV2:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.visited = set()
        self.to_visit = set()
        self.public_pages = set()
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
        self.blocked_pages = set()
        self.missing_pages = set()
        
    def is_public_page(self, path):
        """Determine if a page should be considered public"""
        path_str = str(path).lower()
        
        # Explicitly public directories/pages
        if any(public in path_str for public in [
            'public/', '/public', '_public',
            'blog/', 'faqs/', 'vatican-resources/',
            'initiatives/', 'people/', 'resources/'
        ]):
            # But exclude member/admin areas within these
            if any(private in path_str for private in [
                'admin', 'manage', 'create', 'edit', 'dashboard',
                'profile', 'messaging', 'notifications'
            ]):
                return False
            return True
            
        # Root level pages are generally public
        if '/' not in str(path):
            # Exclude obvious auth pages
            if any(auth in path_str for auth in [
                'login', 'signup', 'onboarding', 'admin'
            ]):
                return False
            return True
            
        # Member/Admin areas are private
        if any(private in path_str for private in [
            'members/', 'admin/', 'auth/',
            'events/dcf_create', 'events/dcf_manage',
            'projects/dcf_create', 'projects/dcf_manage'
        ]):
            return False
            
        return True
    
    def crawl(self):
        """Start crawling from index.html"""
        print("Starting enhanced public site crawl from index.html...")
        
        # Start with index.html
        index_path = self.base_dir / 'index.html'
        if not index_path.exists():
            print("Error: index.html not found!")
            return None
            
        self.to_visit.add('index.html')
        
        # Add known public pages that might not be directly linked
        additional_public_pages = [
            'public/dcf_ai_resources.html',
            'initiatives/initiatives_home.html',
            'blog/index.html',
            'blog/all_blog_posts.html',
            'people/index.html',
            'faqs/index.html',
            'vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html',
            'public/dcf_articles_library.html',
            'public/dcf_values.html',
            'public/dcf_contact.html',
            'public/dcf_newsletter.html',
            'public/dcf_sitemap.html'
        ]
        
        for page in additional_public_pages:
            if (self.base_dir / page).exists():
                self.to_visit.add(page)
        
        while self.to_visit:
            current = self.to_visit.pop()
            if current in self.visited:
                continue
                
            self.visited.add(current)
            
            # Check if this is a public page
            if not self.is_public_page(current):
                self.blocked_pages.add(current)
                print(f"  Blocked (private): {current}")
                continue
                
            full_path = self.base_dir / current
            if not full_path.exists():
                self.missing_pages.add(current)
                continue
            
            if not full_path.is_file():
                continue
                
            print(f"  Analyzing: {current}")
            self.public_pages.add(current)
            
            # Analyze the page
            links, deps = self.analyze_page(full_path)
            
            # Store dependencies
            self.page_dependencies[current] = deps
            self.all_dependencies['javascript'].update(deps['js'])
            self.all_dependencies['stylesheets'].update(deps['css']) 
            self.all_dependencies['images'].update(deps['images'])
            
            # Add new links to visit
            for link in links:
                if link not in self.visited:
                    self.to_visit.add(link)
                    self.page_links[current].add(link)
                        
        return self.generate_report()
    
    def analyze_page(self, file_path):
        """Analyze a single HTML page for links and dependencies"""
        links = set()
        deps = {'js': set(), 'css': set(), 'images': set()}
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract href links
            href_patterns = [
                r'<a[^>]*href=["\']([^"\'#]+)["\']',
                r'window\.location\.href=["\']([^"\']+)["\']',
                r'onclick="window\.location\.href=[\'"]([^"\']+)[\'"]"'
            ]
            
            for pattern in href_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    link = match.group(1)
                    
                    # Skip external links
                    if link.startswith('http') or link.startswith('//') or link.startswith('mailto:'):
                        continue
                        
                    # Only HTML files
                    if not link.endswith('.html'):
                        continue
                        
                    # Normalize path
                    normalized = self.normalize_path(link, file_path)
                    if normalized and self.is_public_page(normalized):
                        links.add(normalized)
            
            # Extract JavaScript files
            js_patterns = [
                r'<script[^>]*src=["\']([^"\']+\.js)["\']',
            ]
            for pattern in js_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    js_file = match.group(1)
                    if not js_file.startswith('http'):
                        normalized = self.normalize_path(js_file, file_path)
                        if normalized:
                            deps['js'].add(normalized)
            
            # Extract CSS files
            css_patterns = [
                r'<link[^>]*href=["\']([^"\']+\.css)["\']',
            ]
            for pattern in css_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    css_file = match.group(1)
                    if not css_file.startswith('http'):
                        normalized = self.normalize_path(css_file, file_path)
                        if normalized:
                            deps['css'].add(normalized)
            
            # Extract static images (not dynamic ${} references)
            img_patterns = [
                r'<img[^>]*src=["\']([^"\'$]+\.(jpg|jpeg|png|gif|svg|webp))["\']',
                r'background-image:\s*url\(["\']?([^"\'$)]+\.(jpg|jpeg|png|gif|svg|webp))["\']?\)'
            ]
            for pattern in img_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    img_file = match.group(1)
                    if not img_file.startswith('http') and not img_file.startswith('data:'):
                        if '$' not in img_file:  # Skip dynamic references
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
                # Normalize and get relative path
                resolved = resolved.resolve()
                path = str(resolved.relative_to(self.base_dir))
            except (ValueError, FileNotFoundError):
                return None
        
        return path.replace('\\', '/')
    
    def generate_report(self):
        """Generate the public site manifest"""
        report = []
        report.append("=" * 80)
        report.append("PUBLIC LAUNCHSITE MANIFEST - ENHANCED")
        report.append("=" * 80)
        report.append("")
        
        # Public HTML Pages
        report.append(f"PUBLIC HTML PAGES ({len(self.public_pages)} pages)")
        report.append("-" * 40)
        
        # Organize pages by directory
        pages_by_dir = defaultdict(list)
        for page in sorted(self.public_pages):
            if '/' in page:
                dir_name = page.split('/')[0]
                pages_by_dir[dir_name].append(page)
            else:
                pages_by_dir['root'].append(page)
        
        # Root pages first
        if 'root' in pages_by_dir:
            report.append("\n[Root Level]")
            for page in sorted(pages_by_dir['root']):
                report.append(f"  - {page}")
        
        # Then organized by directory
        priority_dirs = ['public', 'blog', 'faqs', 'vatican-resources', 'initiatives', 'people']
        for dir_name in priority_dirs:
            if dir_name in pages_by_dir:
                report.append(f"\n[{dir_name}/] ({len(pages_by_dir[dir_name])} pages)")
                # Show first 10 pages in large directories
                pages = sorted(pages_by_dir[dir_name])
                if len(pages) > 10:
                    for page in pages[:10]:
                        report.append(f"  - {page}")
                    report.append(f"  ... and {len(pages) - 10} more")
                else:
                    for page in pages:
                        report.append(f"  - {page}")
        
        # Other directories
        for dir_name in sorted(pages_by_dir.keys()):
            if dir_name not in priority_dirs + ['root']:
                report.append(f"\n[{dir_name}/] ({len(pages_by_dir[dir_name])} pages)")
                for page in sorted(pages_by_dir[dir_name])[:5]:
                    report.append(f"  - {page}")
                if len(pages_by_dir[dir_name]) > 5:
                    report.append(f"  ... and {len(pages_by_dir[dir_name]) - 5} more")
        
        report.append("")
        
        # JavaScript Dependencies
        js_files = sorted(self.all_dependencies['javascript'])
        report.append(f"JAVASCRIPT DEPENDENCIES ({len(js_files)} files)")
        report.append("-" * 40)
        
        # Identify core JS files
        core_js = ['js/dcf-core.js', 'js/dcf-ui.js', 'js/dcf-auth.js', 
                   'js/dcf-init.js', 'js/dcf-analytics.js']
        
        for js in js_files:
            if any(js.endswith(core) for core in core_js):
                report.append(f"  - {js} **CORE**")
            else:
                report.append(f"  - {js}")
        report.append("")
        
        # CSS Dependencies
        css_files = sorted(self.all_dependencies['stylesheets'])
        report.append(f"CSS STYLESHEETS ({len(css_files)} files)")
        report.append("-" * 40)
        for css in css_files:
            report.append(f"  - {css}")
        report.append("")
        
        # Images
        img_files = sorted(self.all_dependencies['images'])
        if img_files:
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
        report.append(f"Total Public HTML Pages: {len(self.public_pages)}")
        report.append(f"Total JavaScript Files: {len(js_files)}")
        report.append(f"Total CSS Files: {len(css_files)}")
        report.append(f"Total Static Images: {len(img_files)}")
        
        total = len(self.public_pages) + len(js_files) + len(css_files) + len(img_files)
        report.append(f"\nTOTAL PUBLIC FILES NEEDED: {total}")
        report.append("")
        
        # Key Public Sections Summary
        report.append("PUBLIC CONTENT BREAKDOWN")
        report.append("-" * 40)
        for dir_name in ['public', 'blog', 'faqs', 'vatican-resources', 'initiatives']:
            if dir_name in pages_by_dir:
                report.append(f"  {dir_name:20} {len(pages_by_dir[dir_name]):3} pages")
        report.append("")
        
        # Save JSON manifest
        json_manifest = {
            'summary': {
                'total_pages': len(self.public_pages),
                'total_javascript': len(js_files),
                'total_css': len(css_files),
                'total_images': len(img_files),
                'total_files': total
            },
            'public_pages': sorted(list(self.public_pages)),
            'javascript': sorted(list(self.all_dependencies['javascript'])),
            'stylesheets': sorted(list(self.all_dependencies['stylesheets'])),
            'images': sorted(list(self.all_dependencies['images']))[:50],  # Limit to first 50
            'pages_by_section': {
                dir_name: sorted(pages) 
                for dir_name, pages in pages_by_dir.items()
            }
        }
        
        with open(self.base_dir / 'public_launchsite.json', 'w') as f:
            json.dump(json_manifest, f, indent=2)
        
        return '\n'.join(report)

if __name__ == "__main__":
    crawler = PublicSiteCrawlerV2('/Users/christopherhoar/Desktop/dcfh')
    report = crawler.crawl()
    
    if report:
        # Save report
        with open('/Users/christopherhoar/Desktop/dcfh/PUBLIC_LAUNCHSITE_FINAL.txt', 'w') as f:
            f.write(report)
        
        print(report)
        print("\n✓ Public manifest saved to: PUBLIC_LAUNCHSITE_FINAL.txt")
        print("✓ JSON data saved to: public_launchsite.json")
    else:
        print("Error: Could not generate manifest")
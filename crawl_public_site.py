#!/usr/bin/env python3
"""
Public Website Crawler
Crawls only publicly accessible pages starting from index.html
Stops at login/authentication gates
"""

import os
import re
from pathlib import Path
from collections import defaultdict
import json
from urllib.parse import urljoin, urlparse

class PublicSiteCrawler:
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
        
        # Patterns that indicate authentication/member areas
        self.auth_indicators = [
            'login', 'signin', 'sign-in', 'authenticate',
            'member', 'admin', 'dashboard', 'profile',
            'private', 'account', 'settings', 'logout'
        ]
        
    def is_auth_page(self, path):
        """Check if a page is likely an authentication or member-only page"""
        path_str = str(path).lower()
        
        # Check for auth directories
        if any(f'/{indicator}/' in path_str or path_str.startswith(f'{indicator}/') 
               for indicator in ['admin', 'members', 'auth']):
            return True
            
        # Check for auth-related filenames
        if any(indicator in path_str for indicator in self.auth_indicators):
            # Allow public event/project/resource pages
            if any(public in path_str for public in ['_public', 'public/', '/public']):
                return False
            # Check for specific auth pages
            if any(auth_file in path_str for auth_file in [
                'login', 'signin', 'profile_signup', 'user_onboarding',
                'admin_', '_manage', 'dashboard', 'edit_profile',
                'my_connections', 'notifications', 'messaging'
            ]):
                return True
                
        return False
    
    def crawl(self):
        """Start crawling from index.html"""
        print("Starting public site crawl from index.html...")
        
        # Start with index.html
        index_path = self.base_dir / 'index.html'
        if not index_path.exists():
            print("Error: index.html not found!")
            return None
            
        self.to_visit.add('index.html')
        
        while self.to_visit:
            current = self.to_visit.pop()
            if current in self.visited:
                continue
                
            self.visited.add(current)
            
            # Check if this is an auth page
            if self.is_auth_page(current):
                self.blocked_pages.add(current)
                print(f"  Blocked (auth gate): {current}")
                continue
                
            full_path = self.base_dir / current
            if not full_path.exists() or not full_path.is_file():
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
            
            # Add new links to visit (if they're HTML and not auth pages)
            for link in links:
                if link not in self.visited and not self.is_auth_page(link):
                    if link.endswith('.html'):
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
            
            # Extract all href links
            href_pattern = r'<a[^>]*href=["\']([^"\'#]+)["\']'
            for match in re.finditer(href_pattern, content, re.IGNORECASE):
                link = match.group(1)
                
                # Skip external links
                if link.startswith('http') or link.startswith('//') or link.startswith('mailto:'):
                    continue
                    
                # Skip non-HTML links
                if not link.endswith('.html') and not link.endswith('/'):
                    continue
                    
                # Normalize path
                normalized = self.normalize_path(link, file_path)
                if normalized:
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
            
            # Extract images
            img_patterns = [
                r'<img[^>]*src=["\']([^"\']+\.(jpg|jpeg|png|gif|svg|webp))["\']',
            ]
            for pattern in img_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    img_file = match.group(1)
                    if not img_file.startswith('http') and not img_file.startswith('data:'):
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
        report.append("PUBLIC LAUNCHSITE MANIFEST")
        report.append("Starting from: index.html")
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
        for dir_name in sorted(pages_by_dir.keys()):
            if dir_name != 'root':
                report.append(f"\n[{dir_name}/]")
                for page in sorted(pages_by_dir[dir_name]):
                    report.append(f"  - {page}")
        
        report.append("")
        
        # JavaScript Dependencies
        js_files = sorted(self.all_dependencies['javascript'])
        report.append(f"JAVASCRIPT DEPENDENCIES ({len(js_files)} files)")
        report.append("-" * 40)
        
        # Count usage
        js_usage = defaultdict(int)
        for page in self.public_pages:
            for js in self.page_dependencies[page]['js']:
                js_usage[js] += 1
        
        for js in js_files:
            usage = js_usage[js]
            if usage > 5:
                report.append(f"  - {js} (used by {usage} pages) **CORE**")
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
            for img in img_files:
                report.append(f"  - {img}")
            report.append("")
        
        # Blocked Pages (stopped at auth gates)
        if self.blocked_pages:
            report.append(f"BLOCKED AT AUTH GATES ({len(self.blocked_pages)} pages)")
            report.append("-" * 40)
            for page in sorted(self.blocked_pages):
                report.append(f"  - {page}")
            report.append("")
        
        # Summary
        report.append("SUMMARY")
        report.append("-" * 40)
        report.append(f"Total Public HTML Pages: {len(self.public_pages)}")
        report.append(f"Total JavaScript Files: {len(js_files)}")
        report.append(f"Total CSS Files: {len(css_files)}")
        report.append(f"Total Static Images: {len(img_files)}")
        report.append(f"Pages Blocked at Auth: {len(self.blocked_pages)}")
        total = len(self.public_pages) + len(js_files) + len(css_files) + len(img_files)
        report.append(f"TOTAL PUBLIC FILES: {total}")
        report.append("")
        
        # Navigation Structure
        report.append("NAVIGATION STRUCTURE")
        report.append("-" * 40)
        report.append("From index.html, the following pages are directly accessible:")
        if 'index.html' in self.page_links:
            for link in sorted(self.page_links['index.html']):
                report.append(f"  → {link}")
        report.append("")
        
        # Save JSON manifest
        json_manifest = {
            'public_pages': sorted(list(self.public_pages)),
            'javascript': sorted(list(self.all_dependencies['javascript'])),
            'stylesheets': sorted(list(self.all_dependencies['stylesheets'])),
            'images': sorted(list(self.all_dependencies['images'])),
            'blocked_at_auth': sorted(list(self.blocked_pages)),
            'navigation_structure': {
                page: sorted(list(links)) 
                for page, links in self.page_links.items()
            }
        }
        
        with open(self.base_dir / 'public_site_manifest.json', 'w') as f:
            json.dump(json_manifest, f, indent=2)
        
        return '\n'.join(report)

if __name__ == "__main__":
    crawler = PublicSiteCrawler('/Users/christopherhoar/Desktop/dcfh')
    report = crawler.crawl()
    
    if report:
        # Save report
        with open('/Users/christopherhoar/Desktop/dcfh/PUBLIC_LAUNCHSITE_MANIFEST.txt', 'w') as f:
            f.write(report)
        
        print(report)
        print("\n✓ Public manifest saved to: PUBLIC_LAUNCHSITE_MANIFEST.txt")
        print("✓ JSON data saved to: public_site_manifest.json")
    else:
        print("Error: Could not generate manifest")
#!/usr/bin/env python3
"""
Complete Directory Manifest
Includes ALL HTML files from key content directories
"""

import os
import re
from pathlib import Path
from collections import defaultdict
import json

class CompleteDirectoryManifest:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.all_pages = set()
        self.pages_by_section = defaultdict(set)
        self.all_dependencies = {
            'javascript': set(),
            'stylesheets': set(),
            'images': set()
        }
        
        # Directories to fully include
        self.content_directories = {
            'blog': 'Blog Articles',
            'faqs': 'FAQ Pages',
            'vatican-resources': 'Vatican Documents',
            'initiatives': 'Initiatives',
            'public': 'Public Pages',
            'people': 'People Directory',
            'events': 'Events',
            'projects': 'Projects',
            'resources': 'Resources',
            'news': 'News'
        }
        
        # Files to exclude
        self.exclude_patterns = [
            'backup', 'bak', 'test', 'temp_', 'old',
            '_TEMPLATE', 'SAMPLE', 'admin', 'auth',
            'member_', 'profile_', 'create_', 'edit_',
            'manage_', 'dashboard', 'login', 'signup'
        ]
        
    def should_include_file(self, file_path):
        """Check if file should be included"""
        path_str = str(file_path).lower()
        
        # Skip excluded patterns
        for pattern in self.exclude_patterns:
            if pattern in path_str:
                return False
        
        # Skip member/admin directories entirely
        if any(x in path_str for x in ['/admin/', '/members/', '/auth/']):
            return False
            
        return True
    
    def scan_directories(self):
        """Scan all content directories for HTML files"""
        print("=" * 80)
        print("COMPLETE DIRECTORY SCAN")
        print("=" * 80)
        print()
        
        # Always include homepage
        if (self.base_dir / 'index.html').exists():
            self.all_pages.add('index.html')
            self.pages_by_section['Homepage'].add('index.html')
        
        # Scan each content directory
        for dir_name, section_name in self.content_directories.items():
            dir_path = self.base_dir / dir_name
            if not dir_path.exists():
                print(f"⚠️  Directory not found: {dir_name}/")
                continue
            
            print(f"Scanning {dir_name}/...")
            files_found = 0
            
            # Find all HTML files recursively
            for html_file in dir_path.rglob('*.html'):
                if html_file.is_file():
                    rel_path = str(html_file.relative_to(self.base_dir))
                    
                    if self.should_include_file(rel_path):
                        self.all_pages.add(rel_path)
                        self.pages_by_section[section_name].add(rel_path)
                        files_found += 1
            
            print(f"  ✓ Found {files_found} HTML files in {dir_name}/")
        
        # Add LAUNCH_MENU specific pages that might not be in directories
        additional_pages = [
            'sitemap.xml',
            'googlec5fda7e4a2520af5.html'
        ]
        
        for page in additional_pages:
            if (self.base_dir / page).exists():
                self.all_pages.add(page)
                self.pages_by_section['Other'].add(page)
        
        print(f"\n{'='*60}")
        print(f"Total HTML files found: {len(self.all_pages)}")
        print(f"{'='*60}\n")
        
        # Analyze dependencies from a sample page
        self.analyze_dependencies()
        
        return self.generate_report()
    
    def analyze_dependencies(self):
        """Analyze JavaScript and CSS dependencies"""
        # Check a few key pages for consistent dependencies
        sample_pages = [
            'index.html',
            'blog/index.html',
            'faqs/index.html',
            'public/dcf_ai_resources.html'
        ]
        
        for page in sample_pages:
            full_path = self.base_dir / page
            if full_path.exists():
                self.extract_dependencies(full_path)
                break
    
    def extract_dependencies(self, file_path):
        """Extract JS and CSS dependencies from a page"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract JavaScript files
            js_patterns = [r'<script[^>]*src=["\']([^"\']+\.js)["\']']
            for pattern in js_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    js_file = match.group(1)
                    if not js_file.startswith('http'):
                        js_file = self.normalize_path(js_file, file_path)
                        if js_file:
                            self.all_dependencies['javascript'].add(js_file)
            
            # Extract CSS files
            css_patterns = [r'<link[^>]*href=["\']([^"\']+\.css)["\']']
            for pattern in css_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    css_file = match.group(1)
                    if not css_file.startswith('http'):
                        css_file = self.normalize_path(css_file, file_path)
                        if css_file:
                            self.all_dependencies['stylesheets'].add(css_file)
                            
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
    
    def normalize_path(self, path, current_file):
        """Normalize relative paths"""
        if not path or path.startswith('http'):
            return None
            
        path = path.split('?')[0].split('#')[0]
        
        if path.startswith('/'):
            path = path[1:]
        else:
            current_dir = current_file.parent
            try:
                resolved = (current_dir / path).resolve()
                path = str(resolved.relative_to(self.base_dir))
            except:
                return None
        
        return path.replace('\\', '/')
    
    def generate_report(self):
        """Generate comprehensive report"""
        report = []
        report.append("=" * 80)
        report.append("COMPLETE LAUNCHSITE MANIFEST - ALL DIRECTORIES")
        report.append("=" * 80)
        report.append("")
        
        # Summary
        report.append("SUMMARY")
        report.append("-" * 40)
        report.append(f"Total HTML pages: {len(self.all_pages)}")
        report.append("")
        
        # Breakdown by section
        report.append("PAGES BY SECTION")
        report.append("-" * 40)
        
        section_order = ['Homepage', 'Blog Articles', 'Vatican Documents', 'FAQ Pages',
                        'Initiatives', 'Public Pages', 'People Directory', 
                        'Events', 'Projects', 'Resources', 'News', 'Other']
        
        for section in section_order:
            if section in self.pages_by_section:
                pages = self.pages_by_section[section]
                report.append(f"\n{section}: {len(pages)} pages")
                report.append("-" * 30)
                
                # Group by subdirectory for blog
                if section == 'Blog Articles':
                    subdirs = defaultdict(list)
                    for page in sorted(pages):
                        if '/' in page:
                            parts = page.split('/')
                            if len(parts) > 2:  # Has subdirectory
                                subdir = parts[1]
                                subdirs[subdir].append(page)
                            else:
                                subdirs['main'].append(page)
                        else:
                            subdirs['main'].append(page)
                    
                    # Show organized by subdirectory
                    if 'main' in subdirs:
                        for page in sorted(subdirs['main']):
                            report.append(f"  - {page}")
                    
                    for subdir in sorted(subdirs.keys()):
                        if subdir != 'main':
                            report.append(f"\n  [{subdir}/]")
                            for page in sorted(subdirs[subdir]):
                                report.append(f"    - {page.split('/')[-1][:60]}")
                
                # Group Vatican resources
                elif section == 'Vatican Documents':
                    htmldocs = []
                    main_docs = []
                    for page in sorted(pages):
                        if 'htmldocs/' in page:
                            htmldocs.append(page)
                        else:
                            main_docs.append(page)
                    
                    if main_docs:
                        report.append(f"  Main Documents ({len(main_docs)}):")
                        for page in main_docs[:10]:
                            report.append(f"    - {page.split('/')[-1][:60]}")
                        if len(main_docs) > 10:
                            report.append(f"    ... and {len(main_docs) - 10} more")
                    
                    if htmldocs:
                        report.append(f"\n  HTMLDocs Subdirectory ({len(htmldocs)}):")
                        for page in htmldocs[:10]:
                            report.append(f"    - {page.split('/')[-1][:60]}")
                        if len(htmldocs) > 10:
                            report.append(f"    ... and {len(htmldocs) - 10} more")
                
                # Show sample for large sections
                elif len(pages) > 15:
                    for page in sorted(pages)[:10]:
                        report.append(f"  - {page}")
                    report.append(f"  ... and {len(pages) - 10} more")
                else:
                    for page in sorted(pages):
                        report.append(f"  - {page}")
        
        report.append("")
        
        # Dependencies
        if self.all_dependencies['javascript']:
            js_files = sorted(self.all_dependencies['javascript'])
            report.append(f"JAVASCRIPT DEPENDENCIES ({len(js_files)} files)")
            report.append("-" * 40)
            for js in js_files:
                report.append(f"  - {js}")
            report.append("")
        
        if self.all_dependencies['stylesheets']:
            css_files = sorted(self.all_dependencies['stylesheets'])
            report.append(f"CSS STYLESHEETS ({len(css_files)} files)")
            report.append("-" * 40)
            for css in css_files:
                report.append(f"  - {css}")
            report.append("")
        
        # Total count
        total_files = (len(self.all_pages) + 
                      len(self.all_dependencies['javascript']) +
                      len(self.all_dependencies['stylesheets']))
        
        report.append("FINAL TOTALS")
        report.append("-" * 40)
        report.append(f"HTML Pages: {len(self.all_pages)}")
        report.append(f"JavaScript Files: {len(self.all_dependencies['javascript'])}")
        report.append(f"CSS Files: {len(self.all_dependencies['stylesheets'])}")
        report.append(f"\nTOTAL FILES FOR COMPLETE LAUNCHSITE: {total_files}")
        
        # Comparison with recursive crawl
        report.append("\n\nCOMPARISON WITH RECURSIVE CRAWL")
        report.append("-" * 40)
        report.append("Previous recursive crawl found: 85 HTML pages")
        report.append(f"Complete directory scan found: {len(self.all_pages)} HTML pages")
        report.append(f"Additional pages discovered: {len(self.all_pages) - 85}")
        
        report_text = '\n'.join(report)
        
        # Save report
        with open(self.base_dir / 'COMPLETE_DIRECTORY_MANIFEST.txt', 'w') as f:
            f.write(report_text)
        
        # Save JSON manifest with all files
        json_manifest = {
            'summary': {
                'total_html_pages': len(self.all_pages),
                'total_javascript': len(self.all_dependencies['javascript']),
                'total_css': len(self.all_dependencies['stylesheets']),
                'total_files': total_files
            },
            'pages_by_section': {
                section: sorted(list(pages))
                for section, pages in self.pages_by_section.items()
            },
            'all_pages': sorted(list(self.all_pages)),
            'javascript': sorted(list(self.all_dependencies['javascript'])),
            'stylesheets': sorted(list(self.all_dependencies['stylesheets']))
        }
        
        with open(self.base_dir / 'complete_directory_manifest.json', 'w') as f:
            json.dump(json_manifest, f, indent=2)
        
        print(report_text)
        print("\n✓ Manifest saved to: COMPLETE_DIRECTORY_MANIFEST.txt")
        print("✓ JSON saved to: complete_directory_manifest.json")
        
        return report_text

if __name__ == "__main__":
    manifest = CompleteDirectoryManifest('/Users/christopherhoar/Desktop/dcfh')
    manifest.scan_directories()
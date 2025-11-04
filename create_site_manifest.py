#!/usr/bin/env python3
"""
Website Crawler and Manifest Generator
Crawls all HTML files and identifies all dependencies (JS, CSS, images, etc.)
"""

import os
import re
from pathlib import Path
from collections import defaultdict
import json

class SiteManifestGenerator:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.manifest = {
            'html_pages': set(),
            'javascript': set(),
            'stylesheets': set(),
            'images': set(),
            'fonts': set(),
            'other_assets': set()
        }
        self.page_dependencies = defaultdict(lambda: {
            'js': set(),
            'css': set(),
            'images': set(),
            'links': set()
        })
        self.shared_dependencies = defaultdict(set)
        
    def crawl_site(self):
        """Crawl all HTML files in the directory"""
        print("Starting site crawl...")
        
        # Find all HTML files
        html_files = list(self.base_dir.rglob("*.html"))
        
        # Filter out backup and test files
        filtered_files = []
        for file in html_files:
            rel_path = file.relative_to(self.base_dir)
            # Skip backup, test, and temp files
            if not any(x in str(rel_path).lower() for x in ['backup', 'bak', 'test', 'temp_', 'old']):
                filtered_files.append(file)
        
        print(f"Found {len(filtered_files)} HTML files to analyze")
        
        for html_file in filtered_files:
            rel_path = html_file.relative_to(self.base_dir)
            self.manifest['html_pages'].add(str(rel_path))
            self.analyze_html_file(html_file)
            
        # Identify shared dependencies
        self.identify_shared_resources()
        
        return self.generate_report()
    
    def analyze_html_file(self, file_path):
        """Analyze a single HTML file for dependencies"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            rel_path = str(file_path.relative_to(self.base_dir))
            
            # Extract JavaScript files
            js_patterns = [
                r'<script[^>]*src=["\']([^"\']+)["\']',
                r'import\s+.*?from\s+["\']([^"\']+\.js)["\']'
            ]
            for pattern in js_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    js_file = self.normalize_path(match.group(1), file_path)
                    if js_file and not js_file.startswith('http'):
                        self.manifest['javascript'].add(js_file)
                        self.page_dependencies[rel_path]['js'].add(js_file)
                        self.shared_dependencies[js_file].add(rel_path)
            
            # Extract CSS files
            css_patterns = [
                r'<link[^>]*href=["\']([^"\']+\.css)["\']',
                r'@import\s+["\']([^"\']+\.css)["\']'
            ]
            for pattern in css_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    css_file = self.normalize_path(match.group(1), file_path)
                    if css_file and not css_file.startswith('http'):
                        self.manifest['stylesheets'].add(css_file)
                        self.page_dependencies[rel_path]['css'].add(css_file)
                        self.shared_dependencies[css_file].add(rel_path)
            
            # Extract images
            img_patterns = [
                r'<img[^>]*src=["\']([^"\']+)["\']',
                r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)',
                r'url\(["\']?([^"\')\s]+\.(jpg|jpeg|png|gif|svg|webp))["\']?\)'
            ]
            for pattern in img_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    img_file = match.group(1)
                    img_file = self.normalize_path(img_file, file_path)
                    if img_file and not img_file.startswith('http') and not img_file.startswith('data:'):
                        self.manifest['images'].add(img_file)
                        self.page_dependencies[rel_path]['images'].add(img_file)
                        self.shared_dependencies[img_file].add(rel_path)
            
            # Extract internal links
            link_patterns = [
                r'<a[^>]*href=["\']([^"\'#]+\.html)["\']',
                r'window\.location(?:\.href)?\s*=\s*["\']([^"\']+\.html)["\']'
            ]
            for pattern in link_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    link = self.normalize_path(match.group(1), file_path)
                    if link and not link.startswith('http'):
                        self.page_dependencies[rel_path]['links'].add(link)
                        
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
    
    def normalize_path(self, path, current_file):
        """Normalize relative paths to be relative to base directory"""
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
                path = str(resolved.relative_to(self.base_dir))
            except ValueError:
                return None
        
        return path.replace('\\', '/')
    
    def identify_shared_resources(self):
        """Identify resources used by multiple pages"""
        # Already populated in shared_dependencies during analysis
        pass
    
    def generate_report(self):
        """Generate a structured report of all dependencies"""
        report = []
        report.append("=" * 80)
        report.append("WEBSITE MANIFEST - COMPREHENSIVE FILE LISTING")
        report.append("=" * 80)
        report.append("")
        
        # HTML Pages
        report.append("HTML PAGES ({} files)".format(len(self.manifest['html_pages'])))
        report.append("-" * 40)
        for page in sorted(self.manifest['html_pages']):
            report.append(f"  - {page}")
        report.append("")
        
        # JavaScript Files
        report.append("JAVASCRIPT FILES ({} files)".format(len(self.manifest['javascript'])))
        report.append("-" * 40)
        for js in sorted(self.manifest['javascript']):
            usage_count = len(self.shared_dependencies[js])
            if usage_count > 1:
                report.append(f"  - {js} (used by {usage_count} pages) **SHARED**")
            else:
                report.append(f"  - {js}")
        report.append("")
        
        # CSS Files
        report.append("STYLESHEETS ({} files)".format(len(self.manifest['stylesheets'])))
        report.append("-" * 40)
        for css in sorted(self.manifest['stylesheets']):
            usage_count = len(self.shared_dependencies[css])
            if usage_count > 1:
                report.append(f"  - {css} (used by {usage_count} pages) **SHARED**")
            else:
                report.append(f"  - {css}")
        report.append("")
        
        # Images
        report.append("IMAGES ({} files)".format(len(self.manifest['images'])))
        report.append("-" * 40)
        for img in sorted(self.manifest['images']):
            report.append(f"  - {img}")
        report.append("")
        
        # Shared Dependencies Analysis
        report.append("SHARED DEPENDENCIES ANALYSIS")
        report.append("-" * 40)
        
        # Find most commonly shared resources
        shared_items = [(resource, len(pages)) for resource, pages in self.shared_dependencies.items() if len(pages) > 1]
        shared_items.sort(key=lambda x: x[1], reverse=True)
        
        if shared_items:
            report.append("Most frequently shared resources:")
            for resource, count in shared_items[:20]:  # Top 20 shared resources
                report.append(f"  - {resource}: used by {count} pages")
        else:
            report.append("No shared resources found")
        report.append("")
        
        # Summary
        report.append("SUMMARY")
        report.append("-" * 40)
        total_files = (len(self.manifest['html_pages']) + 
                      len(self.manifest['javascript']) + 
                      len(self.manifest['stylesheets']) + 
                      len(self.manifest['images']))
        report.append(f"Total HTML pages: {len(self.manifest['html_pages'])}")
        report.append(f"Total JavaScript files: {len(self.manifest['javascript'])}")
        report.append(f"Total CSS files: {len(self.manifest['stylesheets'])}")
        report.append(f"Total Images: {len(self.manifest['images'])}")
        report.append(f"TOTAL FILES NEEDED: {total_files}")
        report.append("")
        
        # Save detailed JSON manifest
        json_manifest = {
            'html_pages': sorted(list(self.manifest['html_pages'])),
            'javascript': sorted(list(self.manifest['javascript'])),
            'stylesheets': sorted(list(self.manifest['stylesheets'])),
            'images': sorted(list(self.manifest['images'])),
            'shared_dependencies': {
                resource: sorted(list(pages)) 
                for resource, pages in self.shared_dependencies.items() 
                if len(pages) > 1
            }
        }
        
        with open(self.base_dir / 'site_manifest.json', 'w') as f:
            json.dump(json_manifest, f, indent=2)
        
        return '\n'.join(report)

if __name__ == "__main__":
    generator = SiteManifestGenerator('/Users/christopherhoar/Desktop/dcfh')
    report = generator.crawl_site()
    
    # Save report to file
    with open('/Users/christopherhoar/Desktop/dcfh/SITE_MANIFEST.txt', 'w') as f:
        f.write(report)
    
    print(report)
    print("\nManifest saved to: SITE_MANIFEST.txt")
    print("Detailed JSON saved to: site_manifest.json")
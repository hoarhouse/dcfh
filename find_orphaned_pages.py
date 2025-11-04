#!/usr/bin/env python3
"""
Find Orphaned Pages
Compare recursive crawl results with complete directory scan
to identify pages that exist but aren't linked
"""

import json
from pathlib import Path
from collections import defaultdict

def find_orphaned_pages():
    base_dir = Path('/Users/christopherhoar/Desktop/dcfh')
    
    # Load the recursive crawl manifest
    recursive_manifest_path = base_dir / 'recursive_launch_manifest.json'
    complete_manifest_path = base_dir / 'complete_directory_manifest.json'
    
    if not recursive_manifest_path.exists() or not complete_manifest_path.exists():
        print("Error: Manifest files not found")
        return
    
    with open(recursive_manifest_path, 'r') as f:
        recursive_data = json.load(f)
    
    with open(complete_manifest_path, 'r') as f:
        complete_data = json.load(f)
    
    # Get sets of pages
    recursive_pages = set(recursive_data['all_pages'])
    complete_pages = set(complete_data['all_pages'])
    
    # Find orphaned pages (in complete but not in recursive)
    orphaned_pages = complete_pages - recursive_pages
    
    # Organize by directory
    orphaned_by_dir = defaultdict(list)
    
    for page in sorted(orphaned_pages):
        if page.startswith('blog/'):
            orphaned_by_dir['Blog'].append(page)
        elif page.startswith('vatican-resources/'):
            orphaned_by_dir['Vatican Resources'].append(page)
        elif page.startswith('public/'):
            orphaned_by_dir['Public'].append(page)
        elif page.startswith('faqs/'):
            orphaned_by_dir['FAQs'].append(page)
        elif page.startswith('initiatives/'):
            orphaned_by_dir['Initiatives'].append(page)
        elif page.startswith('events/'):
            orphaned_by_dir['Events'].append(page)
        elif page.startswith('projects/'):
            orphaned_by_dir['Projects'].append(page)
        elif page.startswith('resources/'):
            orphaned_by_dir['Resources'].append(page)
        elif page.startswith('people/'):
            orphaned_by_dir['People'].append(page)
        elif page.startswith('news/'):
            orphaned_by_dir['News'].append(page)
        else:
            orphaned_by_dir['Other/Root'].append(page)
    
    # Generate report
    report = []
    report.append("=" * 80)
    report.append("ORPHANED PAGES REPORT")
    report.append("Pages that exist in directories but weren't found by recursive crawl")
    report.append("=" * 80)
    report.append("")
    
    report.append("SUMMARY")
    report.append("-" * 40)
    report.append(f"Pages found by recursive crawl: {len(recursive_pages)}")
    report.append(f"Pages found by directory scan: {len(complete_pages)}")
    report.append(f"Orphaned pages (unlinked): {len(orphaned_pages)}")
    report.append(f"Percentage orphaned: {len(orphaned_pages)/len(complete_pages)*100:.1f}%")
    report.append("")
    
    # Breakdown by section
    report.append("ORPHANED PAGES BY SECTION")
    report.append("-" * 40)
    
    section_order = ['Blog', 'Vatican Resources', 'Public', 'FAQs', 
                    'Initiatives', 'Events', 'Projects', 'Resources', 
                    'People', 'News', 'Other/Root']
    
    for section in section_order:
        if section in orphaned_by_dir:
            pages = orphaned_by_dir[section]
            report.append(f"\n{section}: {len(pages)} orphaned pages")
            report.append("=" * 60)
            
            if section == 'Blog':
                # Group blog by subdirectory
                blog_subdirs = defaultdict(list)
                for page in pages:
                    parts = page.split('/')
                    if len(parts) > 2:
                        subdir = parts[1]
                        blog_subdirs[subdir].append(page)
                    else:
                        blog_subdirs['main'].append(page)
                
                for subdir in sorted(blog_subdirs.keys()):
                    if subdir == 'main':
                        for page in sorted(blog_subdirs[subdir]):
                            report.append(f"  ❌ {page}")
                    else:
                        report.append(f"\n  [{subdir}/]")
                        for page in sorted(blog_subdirs[subdir]):
                            filename = page.split('/')[-1]
                            report.append(f"    ❌ {filename[:70]}")
            
            elif section == 'Vatican Resources':
                # Separate htmldocs
                htmldocs = []
                main_docs = []
                for page in pages:
                    if 'htmldocs/' in page:
                        htmldocs.append(page)
                    else:
                        main_docs.append(page)
                
                if main_docs:
                    report.append("  Main Documents:")
                    for page in sorted(main_docs):
                        filename = page.split('/')[-1]
                        report.append(f"    ❌ {filename[:70]}")
                
                if htmldocs:
                    report.append("\n  [htmldocs/]")
                    for page in sorted(htmldocs):
                        filename = page.split('/')[-1]
                        report.append(f"    ❌ {filename[:70]}")
            
            else:
                # Regular listing
                for page in sorted(pages):
                    report.append(f"  ❌ {page}")
    
    report.append("")
    report.append("=" * 80)
    report.append("ANALYSIS")
    report.append("-" * 40)
    
    # Analyze patterns
    report.append("\nCommon patterns in orphaned pages:")
    
    # Check for specific patterns
    patterns = {
        'numbered pages': [],
        'created/manage pages': [],
        'profile pages': [],
        'template pages': [],
        'standalone articles': []
    }
    
    for page in orphaned_pages:
        filename = page.split('/')[-1]
        if any(filename == f"{i}.html" for i in range(10)):
            patterns['numbered pages'].append(page)
        elif any(x in filename for x in ['create', 'manage', 'created']):
            patterns['created/manage pages'].append(page)
        elif 'profile' in filename:
            patterns['profile pages'].append(page)
        elif 'template' in filename.lower() or 'preview' in filename:
            patterns['template pages'].append(page)
        elif page.startswith('blog/') and '/' in page[5:]:
            patterns['standalone articles'].append(page)
    
    for pattern_name, pages in patterns.items():
        if pages:
            report.append(f"\n{pattern_name.title()} ({len(pages)}):")
            for page in sorted(pages)[:5]:
                report.append(f"  - {page}")
            if len(pages) > 5:
                report.append(f"  ... and {len(pages) - 5} more")
    
    report.append("")
    report.append("RECOMMENDATIONS")
    report.append("-" * 40)
    report.append("1. Review 'created/manage' pages - may require authentication")
    report.append("2. Blog articles not linked from index may be drafts or archived")
    report.append("3. Numbered pages (0.html, 1.html, etc.) purpose unclear")
    report.append("4. Vatican documents may need a directory/index page")
    report.append("5. Consider adding navigation to orphaned content")
    
    report_text = '\n'.join(report)
    
    # Save report
    with open(base_dir / 'ORPHANED_PAGES_REPORT.txt', 'w') as f:
        f.write(report_text)
    
    # Save JSON list
    orphaned_json = {
        'summary': {
            'recursive_crawl_pages': len(recursive_pages),
            'directory_scan_pages': len(complete_pages),
            'orphaned_pages': len(orphaned_pages),
            'percentage_orphaned': round(len(orphaned_pages)/len(complete_pages)*100, 1)
        },
        'orphaned_by_section': {
            section: sorted(pages)
            for section, pages in orphaned_by_dir.items()
        },
        'all_orphaned_pages': sorted(list(orphaned_pages))
    }
    
    with open(base_dir / 'orphaned_pages.json', 'w') as f:
        json.dump(orphaned_json, f, indent=2)
    
    print(report_text)
    print("\n✓ Report saved to: ORPHANED_PAGES_REPORT.txt")
    print("✓ JSON saved to: orphaned_pages.json")

if __name__ == "__main__":
    find_orphaned_pages()
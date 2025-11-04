#!/usr/bin/env python3
"""
Create manifest based on LAUNCH_MENU configuration from dcf-ui.js
This extracts only the pages explicitly defined in the launch menu
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

def extract_launch_menu_pages():
    """
    Extract pages from LAUNCH_MENU configuration
    Based on the actual menu structure in dcf-ui.js
    """
    
    # LAUNCH_MENU pages as extracted from dcf-ui.js
    launch_menu_pages = [
        # Direct menu items
        'index.html',
        'blog/index.html',
        'initiatives/initiatives_home.html',
        'public/dcf_values.html',
        'public/dcf_ai_resources.html',
        
        # Initiatives dropdown items
        'initiatives/peace/initiative_peace.html',
        'initiatives/education/initiative_education.html',
        'initiatives/health/initiative_health.html',
        'initiatives/research/initiative_research.html',
        
        # Values dropdown items
        'public/dcf_contact.html',
        
        # Library dropdown items
        'faqs/index.html'
    ]
    
    # Additional pages from LAUNCH_PAGES that are part of the launch site
    # These are pages that should display the launch menu when accessed
    additional_launch_pages = [
        # Public article pages explicitly listed
        'public/dcf_articles_library.html',
        'public/ai-ethics-philosophy.html',
        'public/pope-francis-technology.html', 
        'public/pope-leo-technology.html',
        'public/warfare-security.html',
        'public/work-economy.html',
        
        # Blog pages (main ones)
        'blog/all_blog_posts.html',
        
        # Key vatican resources (sample - not all)
        'vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html',
        'vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html',
        'vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html',
        
        # People page
        'people/index.html'
    ]
    
    # Since faqs/ and vatican-resources/ folders are included, 
    # let's add key FAQ pages
    key_faq_pages = [
        'faqs/catholic-ai-ethics-faq.html',
        'faqs/vatican-ai-peace-2024-faq.html',
        'faqs/ai-consciousness-souls-faq.html',
        'faqs/vatican-rome-call-ai-ethics-faq.html'
    ]
    
    return launch_menu_pages + additional_launch_pages + key_faq_pages

def analyze_dependencies(base_dir, pages):
    """Analyze each page for JS, CSS, and image dependencies"""
    dependencies = {
        'javascript': set(),
        'stylesheets': set(), 
        'images': set()
    }
    page_deps = {}
    
    for page in pages:
        file_path = base_dir / page
        if not file_path.exists():
            print(f"  ⚠️  Page not found: {page}")
            continue
            
        page_deps[page] = {'js': set(), 'css': set(), 'images': set()}
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract JavaScript files
            js_patterns = [r'<script[^>]*src=["\']([^"\']+\.js)["\']']
            for pattern in js_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    js_file = normalize_path(match.group(1), file_path, base_dir)
                    if js_file:
                        dependencies['javascript'].add(js_file)
                        page_deps[page]['js'].add(js_file)
            
            # Extract CSS files
            css_patterns = [r'<link[^>]*href=["\']([^"\']+\.css)["\']']
            for pattern in css_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    css_file = normalize_path(match.group(1), file_path, base_dir)
                    if css_file:
                        dependencies['stylesheets'].add(css_file)
                        page_deps[page]['css'].add(css_file)
            
            # Extract static images (not dynamic)
            img_patterns = [r'<img[^>]*src=["\']([^"\'$]+\.(jpg|jpeg|png|gif|svg|webp))["\']']
            for pattern in img_patterns:
                for match in re.finditer(pattern, content, re.IGNORECASE):
                    img_file = match.group(1)
                    if '$' not in img_file:  # Skip dynamic references
                        img_file = normalize_path(img_file, file_path, base_dir)
                        if img_file:
                            dependencies['images'].add(img_file)
                            page_deps[page]['images'].add(img_file)
                            
        except Exception as e:
            print(f"  Error analyzing {page}: {e}")
    
    return dependencies, page_deps

def normalize_path(path, current_file, base_dir):
    """Normalize relative paths"""
    if not path or path.startswith('http') or path.startswith('//'):
        return None
        
    path = path.split('?')[0].split('#')[0]
    
    if path.startswith('/'):
        path = path[1:]
    else:
        current_dir = current_file.parent
        resolved = current_dir / path
        try:
            resolved = resolved.resolve()
            path = str(resolved.relative_to(base_dir))
        except (ValueError, FileNotFoundError):
            return None
    
    return path.replace('\\', '/')

def generate_manifest():
    """Generate the LAUNCH_MENU manifest"""
    base_dir = Path('/Users/christopherhoar/Desktop/dcfh')
    
    print("=" * 80)
    print("LAUNCH_MENU MANIFEST GENERATOR")
    print("=" * 80)
    print("\nExtracting pages from LAUNCH_MENU configuration...")
    
    # Get launch menu pages
    launch_pages = extract_launch_menu_pages()
    print(f"Found {len(launch_pages)} pages in LAUNCH_MENU")
    
    # Analyze dependencies
    print("\nAnalyzing dependencies...")
    dependencies, page_deps = analyze_dependencies(base_dir, launch_pages)
    
    # Generate report
    report = []
    report.append("=" * 80)
    report.append("LAUNCH_MENU WEBSITE MANIFEST")
    report.append("Based on dcf-ui.js LAUNCH_MENU configuration")
    report.append("=" * 80)
    report.append("")
    
    # Organize pages by section
    pages_by_section = defaultdict(list)
    for page in sorted(launch_pages):
        if page == 'index.html':
            pages_by_section['Homepage'].append(page)
        elif page.startswith('blog/'):
            pages_by_section['Blog'].append(page)
        elif page.startswith('initiatives/'):
            pages_by_section['Initiatives'].append(page)
        elif page.startswith('public/'):
            pages_by_section['Public Pages'].append(page)
        elif page.startswith('faqs/'):
            pages_by_section['FAQs'].append(page)
        elif page.startswith('vatican-resources/'):
            pages_by_section['Vatican Resources'].append(page)
        elif page.startswith('people/'):
            pages_by_section['People'].append(page)
        else:
            pages_by_section['Other'].append(page)
    
    # HTML Pages section
    report.append(f"HTML PAGES ({len(launch_pages)} pages)")
    report.append("-" * 40)
    
    for section in ['Homepage', 'Blog', 'Initiatives', 'Public Pages', 'FAQs', 'Vatican Resources', 'People', 'Other']:
        if section in pages_by_section:
            report.append(f"\n{section} ({len(pages_by_section[section])} pages):")
            for page in pages_by_section[section]:
                exists = "✓" if (base_dir / page).exists() else "✗"
                report.append(f"  {exists} {page}")
    
    report.append("")
    
    # JavaScript Dependencies
    js_files = sorted(dependencies['javascript'])
    report.append(f"JAVASCRIPT DEPENDENCIES ({len(js_files)} files)")
    report.append("-" * 40)
    
    core_js = ['dcf-core.js', 'dcf-ui.js', 'dcf-auth.js', 'dcf-init.js', 'dcf-analytics.js']
    for js in js_files:
        is_core = " **CORE**" if any(js.endswith(c) for c in core_js) else ""
        report.append(f"  - {js}{is_core}")
    report.append("")
    
    # CSS Dependencies
    css_files = sorted(dependencies['stylesheets'])
    report.append(f"CSS STYLESHEETS ({len(css_files)} files)")
    report.append("-" * 40)
    for css in css_files:
        report.append(f"  - {css}")
    report.append("")
    
    # Images
    if dependencies['images']:
        img_files = sorted(dependencies['images'])
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
    report.append(f"Total HTML Pages: {len(launch_pages)}")
    report.append(f"Total JavaScript Files: {len(js_files)}")
    report.append(f"Total CSS Files: {len(css_files)}")
    report.append(f"Total Static Images: {len(dependencies['images'])}")
    
    total = len(launch_pages) + len(js_files) + len(css_files) + len(dependencies['images'])
    report.append(f"\nTOTAL FILES FOR LAUNCH_MENU: {total}")
    report.append("")
    
    # Menu Structure
    report.append("LAUNCH_MENU STRUCTURE")
    report.append("-" * 40)
    report.append("1. Home → index.html")
    report.append("2. Blog → blog/index.html")
    report.append("3. Initiatives (dropdown)")
    report.append("   - Peace Initiative → initiatives/peace/initiative_peace.html")
    report.append("   - Education Initiative → initiatives/education/initiative_education.html")
    report.append("   - Health Initiative → initiatives/health/initiative_health.html")
    report.append("   - Research Initiative → initiatives/research/initiative_research.html")
    report.append("4. Values (dropdown)")
    report.append("   - Values → public/dcf_values.html")
    report.append("   - Contact → public/dcf_contact.html")
    report.append("5. Library (dropdown)")
    report.append("   - Library → public/dcf_ai_resources.html")
    report.append("   - FAQs → faqs/index.html")
    report.append("")
    
    # Additional accessible pages
    report.append("ADDITIONAL LAUNCH SITE PAGES")
    report.append("-" * 40)
    report.append("These pages are part of the launch site but not in main menu:")
    for section in ['Public Pages', 'Vatican Resources', 'People']:
        if section in pages_by_section and len(pages_by_section[section]) > 1:
            report.append(f"\n{section}:")
            for page in pages_by_section[section][1:6]:  # Show first 5
                report.append(f"  - {page}")
            if len(pages_by_section[section]) > 6:
                report.append(f"  ... and {len(pages_by_section[section]) - 6} more")
    
    # Save report
    report_text = '\n'.join(report)
    
    with open(base_dir / 'LAUNCH_MENU_MANIFEST.txt', 'w') as f:
        f.write(report_text)
    
    # Save JSON manifest
    json_manifest = {
        'launch_menu_structure': {
            'home': 'index.html',
            'blog': 'blog/index.html',
            'initiatives': {
                'main': 'initiatives/initiatives_home.html',
                'dropdown': [
                    'initiatives/peace/initiative_peace.html',
                    'initiatives/education/initiative_education.html',
                    'initiatives/health/initiative_health.html',
                    'initiatives/research/initiative_research.html'
                ]
            },
            'values': {
                'main': 'public/dcf_values.html',
                'dropdown': [
                    'public/dcf_values.html',
                    'public/dcf_contact.html'
                ]
            },
            'library': {
                'main': 'public/dcf_ai_resources.html',
                'dropdown': [
                    'public/dcf_ai_resources.html',
                    'faqs/index.html'
                ]
            }
        },
        'all_pages': sorted(launch_pages),
        'javascript': sorted(list(dependencies['javascript'])),
        'stylesheets': sorted(list(dependencies['stylesheets'])),
        'images': sorted(list(dependencies['images'])),
        'summary': {
            'total_pages': len(launch_pages),
            'total_javascript': len(dependencies['javascript']),
            'total_css': len(dependencies['stylesheets']),
            'total_images': len(dependencies['images']),
            'total_files': total
        }
    }
    
    with open(base_dir / 'launch_menu_manifest.json', 'w') as f:
        json.dump(json_manifest, f, indent=2)
    
    print(report_text)
    print("\n✓ Manifest saved to: LAUNCH_MENU_MANIFEST.txt")
    print("✓ JSON saved to: launch_menu_manifest.json")

if __name__ == "__main__":
    generate_manifest()
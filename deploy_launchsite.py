#!/usr/bin/env python3
"""
Deploy Launchsite - Copy all public files to deployment folder
"""

import os
import shutil
import json
from pathlib import Path

def deploy_launchsite():
    base_dir = Path('/Users/christopherhoar/Desktop/dcfh')
    deploy_dir = base_dir / 'launchsite-deployment'
    
    # Load the public site manifest
    manifest_file = base_dir / 'public_launchsite.json'
    if not manifest_file.exists():
        print("Error: public_launchsite.json not found!")
        return False
    
    with open(manifest_file, 'r') as f:
        manifest = json.load(f)
    
    print("=" * 60)
    print("LAUNCHSITE DEPLOYMENT SCRIPT")
    print("=" * 60)
    
    # Create necessary directories
    directories_needed = set()
    
    # Extract directories from file paths
    all_files = (
        manifest['public_pages'] + 
        manifest['javascript'] + 
        manifest['stylesheets']
    )
    
    for file_path in all_files:
        if '/' in file_path:
            dir_path = str(Path(file_path).parent)
            directories_needed.add(dir_path)
    
    # Create all directories
    print("\n1. Creating directory structure...")
    for dir_path in sorted(directories_needed):
        full_dir = deploy_dir / dir_path
        full_dir.mkdir(parents=True, exist_ok=True)
        print(f"   Created: {dir_path}/")
    
    # Copy HTML files
    print("\n2. Copying HTML pages...")
    copied_count = 0
    missing_files = []
    
    for html_file in manifest['public_pages']:
        src = base_dir / html_file
        dst = deploy_dir / html_file
        if src.exists():
            shutil.copy2(src, dst)
            copied_count += 1
            print(f"   ✓ {html_file}")
        else:
            missing_files.append(html_file)
            print(f"   ✗ {html_file} - NOT FOUND")
    
    print(f"   Copied {copied_count}/{len(manifest['public_pages'])} HTML files")
    
    # Copy JavaScript files
    print("\n3. Copying JavaScript files...")
    js_copied = 0
    for js_file in manifest['javascript']:
        src = base_dir / js_file
        dst = deploy_dir / js_file
        if src.exists():
            shutil.copy2(src, dst)
            js_copied += 1
            print(f"   ✓ {js_file}")
        else:
            missing_files.append(js_file)
            print(f"   ✗ {js_file} - NOT FOUND")
    
    print(f"   Copied {js_copied}/{len(manifest['javascript'])} JS files")
    
    # Copy CSS files
    print("\n4. Copying CSS files...")
    css_copied = 0
    for css_file in manifest['stylesheets']:
        src = base_dir / css_file
        dst = deploy_dir / css_file
        if src.exists():
            shutil.copy2(src, dst)
            css_copied += 1
            print(f"   ✓ {css_file}")
        else:
            missing_files.append(css_file)
            print(f"   ✗ {css_file} - NOT FOUND")
    
    print(f"   Copied {css_copied}/{len(manifest['stylesheets'])} CSS files")
    
    # Copy any additional required files
    print("\n5. Copying additional files...")
    additional_files = [
        'sitemap.xml',
        'robots.txt',
        'googlec5fda7e4a2520af5.html'  # Google verification
    ]
    
    for file_name in additional_files:
        src = base_dir / file_name
        if src.exists():
            dst = deploy_dir / file_name
            shutil.copy2(src, dst)
            print(f"   ✓ {file_name}")
        else:
            print(f"   ✗ {file_name} - Not found (may not be required)")
    
    # Summary
    print("\n" + "=" * 60)
    print("DEPLOYMENT SUMMARY")
    print("=" * 60)
    total_copied = copied_count + js_copied + css_copied
    print(f"Total files copied: {total_copied}")
    print(f"HTML pages: {copied_count}")
    print(f"JavaScript files: {js_copied}")
    print(f"CSS files: {css_copied}")
    
    if missing_files:
        print(f"\n⚠️  Missing files ({len(missing_files)}):")
        for mf in missing_files[:10]:
            print(f"   - {mf}")
        if len(missing_files) > 10:
            print(f"   ... and {len(missing_files) - 10} more")
    
    print("\n✓ Deployment package created at: launchsite-deployment/")
    return True

if __name__ == "__main__":
    deploy_launchsite()
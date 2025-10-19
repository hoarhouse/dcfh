#!/usr/bin/env python3
"""
Complete FAQ System Overhaul - DRY RUN VERSION
Automatically runs in dry-run mode to preview changes
"""

import os
import re
import shutil
from pathlib import Path
from datetime import datetime

# Files to rename (old_name -> new_name)
FILES_TO_RENAME = {
    'ai-healthcare.html': 'ai-healthcare-faq.html',
    'ai-companions-relationships-loneliness.html': 'ai-companions-relationships-faq.html',
    'ai-consciousness-souls.html': 'ai-consciousness-souls-faq.html',
    'ai-jobs-catholic-teaching.html': 'ai-jobs-workplace-faq.html',
    'ai-bias-fairness.html': 'ai-bias-fairness-faq.html',
    'ai-privacy-surveillance.html': 'ai-privacy-surveillance-faq.html',
    'ai-warfare-weapons.html': 'ai-warfare-weapons-faq.html',
    'deepfakes-misinformation.html': 'deepfakes-misinformation-faq.html',
    'catholic-ai-ethics.html': 'catholic-ai-ethics-faq.html'
}

class FAQOverhaul:
    def __init__(self):
        self.faq_dir = Path('.')
        self.backup_dir = Path('faq_backup_' + datetime.now().strftime('%Y%m%d_%H%M%S'))
        self.report = {
            'renamed_files': [],
            'link_updates': {},
            'title_updates': [],
            'broken_links': [],
            'errors': []
        }
        
    def phase1_rename_files(self, dry_run=True):
        """Phase 1: Rename files to add -faq.html suffix"""
        print("\n" + "="*80)
        print("PHASE 1: RENAME FILES")
        print("="*80)
        
        for old_name, new_name in FILES_TO_RENAME.items():
            old_path = self.faq_dir / old_name
            new_path = self.faq_dir / new_name
            
            if old_path.exists():
                if dry_run:
                    print(f"  [DRY RUN] Would rename: {old_name} → {new_name}")
                    self.report['renamed_files'].append((old_name, new_name))
                else:
                    old_path.rename(new_path)
                    self.report['renamed_files'].append((old_name, new_name))
                    print(f"  ✓ Renamed: {old_name} → {new_name}")
            else:
                msg = f"  ✗ File not found: {old_name}"
                print(msg)
                self.report['errors'].append(msg)
                
    def phase2_update_links(self, dry_run=True):
        """Phase 2: Update all internal links in all HTML files"""
        print("\n" + "="*80)
        print("PHASE 2: UPDATE INTERNAL LINKS")
        print("="*80)
        
        # Get all HTML files to update (including renamed ones)
        html_files = []
        for file in self.faq_dir.glob('*.html'):
            if file.name not in ['_FAQ_TEMPLATE.html']:
                html_files.append(file)
        
        for html_file in html_files:
            print(f"\n  Processing: {html_file.name}")
            updates_count = 0
            
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Update each link
                for old_name, new_name in FILES_TO_RENAME.items():
                    # Match various href patterns
                    patterns = [
                        (f'href="{old_name}"', f'href="{new_name}"'),
                        (f'href="./{old_name}"', f'href="./{new_name}"'),
                        (f'href="../faqs/{old_name}"', f'href="../faqs/{new_name}"'),
                        (f'href="faqs/{old_name}"', f'href="faqs/{new_name}"'),
                        (f"href='{old_name}'", f"href='{new_name}'"),
                        (f"href='./{old_name}'", f"href='./{new_name}'"),
                        (f"href='../faqs/{old_name}'", f"href='../faqs/{new_name}'"),
                        (f"href='faqs/{old_name}'", f"href='faqs/{new_name}'"),
                    ]
                    
                    for old_pattern, new_pattern in patterns:
                        if old_pattern in content:
                            occurrences = content.count(old_pattern)
                            content = content.replace(old_pattern, new_pattern)
                            updates_count += occurrences
                            if occurrences > 0:
                                print(f"    - Would replace {occurrences} instances of {old_name}")
                
                if updates_count > 0:
                    if dry_run:
                        print(f"    [DRY RUN] Would update {updates_count} links total")
                    else:
                        with open(html_file, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"    ✓ Updated {updates_count} links")
                    
                    self.report['link_updates'][html_file.name] = updates_count
                else:
                    print(f"    - No links to update")
                    
            except Exception as e:
                msg = f"    ✗ Error processing {html_file.name}: {e}"
                print(msg)
                self.report['errors'].append(msg)
                
    def phase3_update_titles(self, dry_run=True):
        """Phase 3: Add 'FAQ' to title tags if not present"""
        print("\n" + "="*80)
        print("PHASE 3: UPDATE TITLE TAGS")
        print("="*80)
        
        # Process only the files that would be renamed
        for old_name, new_name in FILES_TO_RENAME.items():
            # In dry run, check old name; in live, check new name
            file_path = self.faq_dir / old_name if dry_run else self.faq_dir / new_name
            
            if not file_path.exists():
                print(f"  ✗ File not found: {file_path.name}")
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find title tag
                title_pattern = r'<title>(.*?)</title>'
                title_match = re.search(title_pattern, content, re.IGNORECASE)
                
                if title_match:
                    current_title = title_match.group(1)
                    
                    # Check if FAQ is already in title
                    if 'FAQ' not in current_title and 'Frequently Asked' not in current_title:
                        # Add " - FAQ" before any existing separator
                        if '|' in current_title:
                            new_title = current_title.replace('|', '- FAQ |')
                        else:
                            new_title = current_title + ' - FAQ'
                        
                        if dry_run:
                            print(f"  [DRY RUN] Would update title in {old_name}:")
                            print(f"    From: {current_title}")
                            print(f"    To:   {new_title}")
                            self.report['title_updates'].append((old_name, new_title))
                        else:
                            new_content = content.replace(
                                f'<title>{current_title}</title>',
                                f'<title>{new_title}</title>'
                            )
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            print(f"  ✓ Updated title in {new_name}")
                            print(f"    New title: {new_title}")
                            self.report['title_updates'].append((new_name, new_title))
                    else:
                        print(f"  - {file_path.name}: Title already contains FAQ")
                        
            except Exception as e:
                msg = f"  ✗ Error updating title in {file_path.name}: {e}"
                print(msg)
                self.report['errors'].append(msg)
                
    def phase4_verify(self):
        """Phase 4: Verify all changes and check for broken links"""
        print("\n" + "="*80)
        print("PHASE 4: VERIFICATION SUMMARY")
        print("="*80)
        
        print("\n1. FILES TO BE RENAMED:")
        print("-" * 40)
        if self.report['renamed_files']:
            for old, new in self.report['renamed_files']:
                print(f"  ✓ {old} → {new}")
            print(f"\n  Total: {len(self.report['renamed_files'])} files")
        else:
            print("  No files would be renamed")
            
        print("\n2. LINK UPDATES PER FILE:")
        print("-" * 40)
        if self.report['link_updates']:
            total_updates = 0
            for file, count in sorted(self.report['link_updates'].items()):
                if count > 0:
                    print(f"  {file:50} : {count} links")
                total_updates += count
            print(f"  {'-'*50}")
            print(f"  {'TOTAL':50} : {total_updates} links")
        else:
            print("  No links would be updated")
            
        print("\n3. TITLE UPDATES:")
        print("-" * 40)
        if self.report['title_updates']:
            for file, title in self.report['title_updates']:
                print(f"  ✓ {file}")
                print(f"    New title: {title}")
            print(f"\n  Total: {len(self.report['title_updates'])} titles")
        else:
            print("  No titles would be updated")
            
        print("\n4. POTENTIAL ISSUES:")
        print("-" * 40)
        
        # Check what links would be broken after rename
        issues = []
        for old_name, new_name in FILES_TO_RENAME.items():
            if not (self.faq_dir / old_name).exists():
                issues.append(f"Source file missing: {old_name}")
        
        if self.report['errors']:
            for error in self.report['errors']:
                issues.append(error)
        
        if issues:
            for issue in issues:
                print(f"  ⚠️  {issue}")
        else:
            print("  ✓ No issues detected")
            
    def run(self, dry_run=True):
        """Execute all phases"""
        mode = "DRY RUN PREVIEW" if dry_run else "LIVE EXECUTION"
        print(f"\n{'='*80}")
        print(f"FAQ SYSTEM OVERHAUL - {mode}")
        print(f"{'='*80}")
        
        # Execute all phases
        self.phase1_rename_files(dry_run)
        self.phase2_update_links(dry_run)
        self.phase3_update_titles(dry_run)
        self.phase4_verify()
        
        print(f"\n{'='*80}")
        print(f"DRY RUN COMPLETE")
        print(f"{'='*80}")
        
        print("\n⚠️  This was a DRY RUN - no files were modified")
        print("\nTo execute these changes, create and run 'faq_overhaul_live.py'")

def main():
    """Main execution - runs dry run automatically"""
    overhaul = FAQOverhaul()
    overhaul.run(dry_run=True)

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Complete FAQ System Overhaul for LLM/AI Search Optimization
- Renames files to include -faq.html suffix
- Updates all internal links
- Adds "FAQ" to title tags
- Verifies all changes
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
        
    def create_backup(self):
        """Create backup of all FAQ files"""
        print("\n" + "="*80)
        print("CREATING BACKUP")
        print("="*80)
        
        self.backup_dir.mkdir(exist_ok=True)
        
        # Backup all HTML files
        for file in self.faq_dir.glob('*.html'):
            if file.name != '_FAQ_TEMPLATE.html':  # Skip template
                shutil.copy2(file, self.backup_dir / file.name)
                print(f"  ✓ Backed up: {file.name}")
        
        print(f"\nBackup created in: {self.backup_dir}")
        
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
                            print(f"    - Replaced {occurrences} instances of {old_pattern}")
                
                if updates_count > 0:
                    if dry_run:
                        print(f"    [DRY RUN] Would update {updates_count} links")
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
        
        # Process only the renamed files
        for old_name, new_name in FILES_TO_RENAME.items():
            file_path = self.faq_dir / new_name
            
            if not file_path.exists():
                print(f"  ✗ File not found: {new_name} (may not be renamed yet)")
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
                            print(f"  [DRY RUN] Would update title in {new_name}:")
                            print(f"    From: {current_title}")
                            print(f"    To:   {new_title}")
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
                        print(f"  - {new_name}: Title already contains FAQ")
                        
            except Exception as e:
                msg = f"  ✗ Error updating title in {new_name}: {e}"
                print(msg)
                self.report['errors'].append(msg)
                
    def phase4_verify(self):
        """Phase 4: Verify all changes and check for broken links"""
        print("\n" + "="*80)
        print("PHASE 4: VERIFICATION")
        print("="*80)
        
        print("\n1. RENAMED FILES:")
        print("-" * 40)
        if self.report['renamed_files']:
            for old, new in self.report['renamed_files']:
                print(f"  ✓ {old} → {new}")
        else:
            print("  No files renamed (dry run or not executed)")
            
        print("\n2. LINK UPDATES PER FILE:")
        print("-" * 40)
        if self.report['link_updates']:
            total_updates = 0
            for file, count in sorted(self.report['link_updates'].items()):
                print(f"  {file:50} : {count} links updated")
                total_updates += count
            print(f"  {'TOTAL':50} : {total_updates} links updated")
        else:
            print("  No links updated (dry run or not executed)")
            
        print("\n3. TITLE UPDATES:")
        print("-" * 40)
        if self.report['title_updates']:
            for file, title in self.report['title_updates']:
                print(f"  ✓ {file}: {title}")
        else:
            print("  No titles updated (dry run or not executed)")
            
        print("\n4. CHECKING FOR BROKEN LINKS:")
        print("-" * 40)
        
        # Check all HTML files for potentially broken links
        for html_file in self.faq_dir.glob('*.html'):
            if html_file.name == '_FAQ_TEMPLATE.html':
                continue
                
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all href links to .html files
            href_pattern = r'href=["\']([^"\']*\.html)["\']'
            links = re.findall(href_pattern, content)
            
            for link in links:
                # Clean up the link
                clean_link = link.replace('./', '').replace('../faqs/', '').replace('faqs/', '')
                
                # Check if it's a local FAQ link
                if not link.startswith('http') and not link.startswith('../vatican-resources/'):
                    # Check if the file exists
                    target_file = self.faq_dir / clean_link
                    if not target_file.exists() and clean_link != 'index.html':
                        self.report['broken_links'].append((html_file.name, link))
        
        if self.report['broken_links']:
            print("  ⚠️  BROKEN LINKS FOUND:")
            for source, link in self.report['broken_links']:
                print(f"    {source} → {link}")
        else:
            print("  ✓ No broken links found")
            
        print("\n5. ERRORS:")
        print("-" * 40)
        if self.report['errors']:
            for error in self.report['errors']:
                print(f"  ✗ {error}")
        else:
            print("  ✓ No errors encountered")
            
    def run(self, dry_run=True):
        """Execute all phases"""
        mode = "DRY RUN" if dry_run else "LIVE EXECUTION"
        print(f"\n{'='*80}")
        print(f"FAQ SYSTEM OVERHAUL - {mode}")
        print(f"{'='*80}")
        
        if not dry_run:
            # Create backup before making changes
            self.create_backup()
        
        # Execute all phases
        self.phase1_rename_files(dry_run)
        self.phase2_update_links(dry_run)
        self.phase3_update_titles(dry_run)
        self.phase4_verify()
        
        print(f"\n{'='*80}")
        print(f"OVERHAUL COMPLETE - {mode}")
        print(f"{'='*80}")
        
        if dry_run:
            print("\n⚠️  This was a DRY RUN - no files were modified")
            print("To execute changes, run with: overhaul.run(dry_run=False)")
        else:
            print(f"\n✓ All changes completed. Backup saved in: {self.backup_dir}")

def main():
    """Main execution"""
    overhaul = FAQOverhaul()
    
    print("\n" + "="*80)
    print("FAQ COMPLETE OVERHAUL PLAN")
    print("="*80)
    
    print("\nThis script will:")
    print("1. Rename 9 FAQ files to add '-faq.html' suffix")
    print("2. Update all internal links in 23 HTML files")
    print("3. Add 'FAQ' to title tags where missing")
    print("4. Verify all changes and check for broken links")
    
    print("\nFiles to be renamed:")
    for old, new in FILES_TO_RENAME.items():
        print(f"  • {old} → {new}")
    
    print("\n" + "-"*80)
    print("READY TO EXECUTE")
    print("-"*80)
    
    response = input("\nRun in DRY RUN mode first? (recommended) [y/n]: ")
    
    if response.lower() == 'y':
        print("\nRunning DRY RUN to preview changes...")
        overhaul.run(dry_run=True)
        
        print("\n" + "-"*80)
        response2 = input("\nDry run complete. Execute actual changes? [y/n]: ")
        if response2.lower() == 'y':
            overhaul2 = FAQOverhaul()  # Fresh instance
            overhaul2.run(dry_run=False)
        else:
            print("\nExecution cancelled. No files were modified.")
    else:
        response2 = input("\nAre you sure you want to execute without dry run? [y/n]: ")
        if response2.lower() == 'y':
            overhaul.run(dry_run=False)
        else:
            print("\nExecution cancelled.")

if __name__ == "__main__":
    main()
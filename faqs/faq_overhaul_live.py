#!/usr/bin/env python3
"""
Complete FAQ System Overhaul - LIVE EXECUTION
This will actually modify files - creates backup first
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
        backup_count = 0
        for file in self.faq_dir.glob('*.html'):
            if file.name != '_FAQ_TEMPLATE.html':  # Skip template
                shutil.copy2(file, self.backup_dir / file.name)
                backup_count += 1
                if backup_count <= 5:  # Show first 5
                    print(f"  ✓ Backed up: {file.name}")
        
        if backup_count > 5:
            print(f"  ... and {backup_count - 5} more files")
        
        print(f"\n✓ Backup created: {self.backup_dir}")
        print(f"  Total files backed up: {backup_count}")
        
    def phase1_rename_files(self):
        """Phase 1: Rename files to add -faq.html suffix"""
        print("\n" + "="*80)
        print("PHASE 1: RENAME FILES")
        print("="*80)
        
        for old_name, new_name in FILES_TO_RENAME.items():
            old_path = self.faq_dir / old_name
            new_path = self.faq_dir / new_name
            
            if old_path.exists():
                old_path.rename(new_path)
                self.report['renamed_files'].append((old_name, new_name))
                print(f"  ✓ Renamed: {old_name} → {new_name}")
            else:
                msg = f"File not found: {old_name}"
                print(f"  ✗ {msg}")
                self.report['errors'].append(msg)
                
    def phase2_update_links(self):
        """Phase 2: Update all internal links in all HTML files"""
        print("\n" + "="*80)
        print("PHASE 2: UPDATE INTERNAL LINKS")
        print("="*80)
        
        # Get all HTML files to update
        html_files = []
        for file in self.faq_dir.glob('*.html'):
            if file.name not in ['_FAQ_TEMPLATE.html']:
                html_files.append(file)
        
        total_updates = 0
        for html_file in html_files:
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
                
                if updates_count > 0:
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    self.report['link_updates'][html_file.name] = updates_count
                    total_updates += updates_count
                    print(f"  ✓ {html_file.name}: Updated {updates_count} links")
                    
            except Exception as e:
                msg = f"Error processing {html_file.name}: {e}"
                print(f"  ✗ {msg}")
                self.report['errors'].append(msg)
        
        print(f"\n  Total: {total_updates} links updated across {len(self.report['link_updates'])} files")
                
    def phase3_update_titles(self):
        """Phase 3: Add 'FAQ' to title tags if not present"""
        print("\n" + "="*80)
        print("PHASE 3: UPDATE TITLE TAGS")
        print("="*80)
        
        # Process only the renamed files
        for old_name, new_name in FILES_TO_RENAME.items():
            file_path = self.faq_dir / new_name
            
            if not file_path.exists():
                print(f"  ✗ File not found: {new_name}")
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
                        
                        new_content = content.replace(
                            f'<title>{current_title}</title>',
                            f'<title>{new_title}</title>'
                        )
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"  ✓ {new_name}: Title updated")
                        self.report['title_updates'].append((new_name, new_title))
                    else:
                        print(f"  - {new_name}: Title already contains FAQ")
                        
            except Exception as e:
                msg = f"Error updating title in {new_name}: {e}"
                print(f"  ✗ {msg}")
                self.report['errors'].append(msg)
        
        print(f"\n  Total: {len(self.report['title_updates'])} titles updated")
                
    def phase4_verify(self):
        """Phase 4: Verify all changes and check for broken links"""
        print("\n" + "="*80)
        print("PHASE 4: FINAL VERIFICATION")
        print("="*80)
        
        print("\n✅ COMPLETED ACTIONS:")
        print("-" * 40)
        print(f"  • Renamed {len(self.report['renamed_files'])} files")
        print(f"  • Updated {sum(self.report['link_updates'].values())} links in {len(self.report['link_updates'])} files")
        print(f"  • Updated {len(self.report['title_updates'])} title tags")
        
        # Check for any remaining old filenames
        print("\n🔍 CHECKING FOR BROKEN LINKS:")
        print("-" * 40)
        
        broken_count = 0
        for html_file in self.faq_dir.glob('*.html'):
            if html_file.name == '_FAQ_TEMPLATE.html':
                continue
                
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for any old filenames that shouldn't exist
            for old_name in FILES_TO_RENAME.keys():
                if old_name in content:
                    print(f"  ⚠️  {html_file.name} still contains reference to {old_name}")
                    broken_count += 1
        
        if broken_count == 0:
            print("  ✓ No broken links found")
            
        if self.report['errors']:
            print("\n⚠️  ERRORS ENCOUNTERED:")
            print("-" * 40)
            for error in self.report['errors']:
                print(f"  • {error}")
        
    def run(self):
        """Execute all phases with backup"""
        print(f"\n{'='*80}")
        print(f"FAQ SYSTEM OVERHAUL - LIVE EXECUTION")
        print(f"{'='*80}")
        
        # Create backup first
        self.create_backup()
        
        # Execute all phases
        self.phase1_rename_files()
        self.phase2_update_links()
        self.phase3_update_titles()
        self.phase4_verify()
        
        print(f"\n{'='*80}")
        print(f"✅ OVERHAUL COMPLETE")
        print(f"{'='*80}")
        
        print(f"\nBackup location: {self.backup_dir}")
        print("To restore: Copy files from backup directory back to current directory")

def main():
    """Main execution"""
    print("\n" + "="*80)
    print("FAQ SYSTEM OVERHAUL - LIVE EXECUTION")
    print("="*80)
    print("\n⚠️  WARNING: This will modify files!")
    print("\nThis script will:")
    print("1. Create a backup of all FAQ files")
    print("2. Rename 9 FAQ files")
    print("3. Update all internal links")
    print("4. Add 'FAQ' to title tags")
    print("5. Verify all changes")
    
    # Auto-execute
    print("\nStarting execution...")
    overhaul = FAQOverhaul()
    overhaul.run()

if __name__ == "__main__":
    main()
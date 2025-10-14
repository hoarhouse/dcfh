#!/usr/bin/env python3
"""
Remove old/obsolete scripts and keep only the current versions
"""
import os

# Scripts to KEEP (current, working versions)
KEEP_SCRIPTS = {
    'MASTER_FAQ_BUILDER_TEMPLATE_V2.py',
    'add_schema_markup.py',
    'analyze_faq_llm_optimization.py',
    'fix_all_faq_navs.py',
    'HOWTOBUILDANFAQ.md'
}

# Scripts to DELETE (old/obsolete/one-time fixes)
DELETE_SCRIPTS = {
    'build_bias_fairness_faq.py',
    'build_deepfakes_correct.py',
    'fix_bias_hero.py',
    'fix_deepfakes_final.py',
    'rebuild_deepfakes.py',
    'add_bias_card.py',
    'add_deepfakes_card.py',
    'add_deepfakes_card_correct.py',
    'add_deepfakes_card_fixed.py',
    'fix_card_insertion.py',
    'remove_duplicate_bias_card.py',
    'fix_meta_descriptions.py',
    'fix_title_lengths.py',
    'final_meta_title_tweaks.py',
    'fix_short_titles.py',
    'fix_broken_answers.py',
    'add_missing_answer_text.py',
    'analyze_answer_depth.py',
    'MASTER_FAQ_BUILDER_TEMPLATE.py',  # Old version, replaced by V2
    'UPDATE_HOWTOBUILDANFAQ.md'  # Temp file
}

print("="*80)
print("CLEANING UP OLD SCRIPTS")
print("="*80)

print("\n📁 Scripts to KEEP:")
for script in sorted(KEEP_SCRIPTS):
    if os.path.exists(script):
        print(f"  ✅ {script}")
    else:
        print(f"  ⚠️  {script} (not found - should exist!)")

deleted_count = 0
print("\n🗑️  Deleting old scripts:")
for script in sorted(DELETE_SCRIPTS):
    if os.path.exists(script):
        os.remove(script)
        print(f"  ✅ Deleted {script}")
        deleted_count += 1
    else:
        print(f"  ⏭️  {script} (already gone)")

print(f"\n{'='*80}")
print(f"✅ Cleanup complete: {deleted_count} old scripts removed")
print(f"{'='*80}")

# List remaining .py files for review
print("\n📋 Remaining Python scripts in directory:")
py_files = [f for f in os.listdir('.') if f.endswith('.py')]
for f in sorted(py_files):
    status = "✅ KEEP" if f in KEEP_SCRIPTS else "❓ REVIEW"
    print(f"  {status}: {f}")


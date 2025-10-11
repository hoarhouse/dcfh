#!/usr/bin/env python3
import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Only fix within <script> tags at the end
    if '<script>' in content and 'async function trackView()' in content:
        # Replace all {{ with { and }} with } in the tracking script
        parts = content.split('<script>')
        if len(parts) >= 2:
            # Get the last script tag (the tracking one)
            last_part = parts[-1]
            before_last_script = '<script>'.join(parts[:-1])
            
            # Fix the double braces in the last script only
            fixed_script = last_part.replace('{{', '{').replace('}}', '}')
            
            content = before_last_script + '<script>' + fixed_script
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Fixed {filepath}")
        return True
    else:
        print(f"⏭️  Skipped {filepath} (no changes needed)")
        return False

# Fix all blog HTML files
fixed_count = 0
for root, dirs, files in os.walk('blog'):
    for file in files:
        if file.endswith('.html') and file not in ['index.html', 'post.html', 'category.html', 'all_blog_posts.html', 'news-blog-template-preview.html']:
            filepath = os.path.join(root, file)
            if fix_file(filepath):
                fixed_count += 1

print(f"\n🎉 Fixed {fixed_count} files!")

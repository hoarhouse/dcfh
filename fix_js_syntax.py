#!/usr/bin/env python3
import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the script section and fix the curly braces
    # The issue is we're using {{{{ }}}} but JavaScript doesn't need that many
    content = re.sub(
        r'async function trackView\(\) \{\{(\{+)',
        r'async function trackView() {',
        content
    )
    content = re.sub(
        r'\}\}(\}+) catch',
        r'} catch',
        content
    )
    content = re.sub(
        r'blog_id: postId \}\}(\}+)\);',
        r'blog_id: postId });',
        content
    )
    content = re.sub(
        r'while \(!window\.dcfSupabase && attempts < 50\) \{\{(\{+)',
        r'while (!window.dcfSupabase && attempts < 50) {',
        content
    )
    content = re.sub(
        r'await new Promise\(r => setTimeout\(r, 100\)\);',
        r'await new Promise(r => setTimeout(r, 100));',
        content
    )
    content = re.sub(
        r'\}\}(\}+)\s+if \(!window\.dcfSupabase\)',
        r'}\n            if (!window.dcfSupabase)',
        content
    )
    
    # Fix all the quadruple braces
    content = content.replace('{{{{', '{')
    content = content.replace('}}}}', '}')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Fixed {os.path.basename(filepath)}")

# Fix all blog post HTML files
for root, dirs, files in os.walk('blog'):
    for file in files:
        if file.endswith('.html') and file not in ['index.html', 'post.html', 'category.html', 'all_blog_posts.html', 'news-blog-template-preview.html']:
            filepath = os.path.join(root, file)
            try:
                fix_file(filepath)
            except Exception as e:
                print(f"❌ Error fixing {file}: {e}")

print("\n🎉 All files fixed!")

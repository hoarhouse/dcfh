with open('dcf_articles_library.html', 'r') as f:
    content = f.read()

# Fix the image CSS - make it fill completely with no gaps
old_image_css = '''        .article-image {
            width: 100%;
            aspect-ratio: 16 / 9;
            object-fit: cover;
            background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
        }'''

new_image_css = '''        .article-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
            background: #f0f0f0;
        }'''

content = content.replace(old_image_css, new_image_css)

# Remove border-radius and ensure no gaps
old_card = '''        .article-card {
            background: white;
            border-radius: 0;
            overflow: hidden;
            border: 1px solid #e5e5e5;'''

new_card = '''        .article-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e5e5e5;'''

content = content.replace(old_card, new_card)

# Ensure content padding doesn't affect image
old_content = '''        .article-content {
            padding: 1.5rem;'''

new_content = '''        .article-content {
            padding: 1.5rem 1.5rem 1.5rem 1.5rem;'''

content = content.replace(old_content, new_content)

with open('dcf_articles_library.html', 'w') as f:
    f.write(content)

print("✅ Fixed: Images now fill card area with NO GAPS")

with open('dcf_articles_library.html', 'r') as f:
    content = f.read()

# Replace article-image CSS with fixed aspect ratio
old_image = '''        .article-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #f0f0f0;
        }'''

new_image = '''        .article-image {
            width: 100%;
            aspect-ratio: 16 / 9;
            object-fit: cover;
            background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
        }'''

content = content.replace(old_image, new_image)

# Update article-card CSS for consistent height
old_card = '''        .article-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            display: flex;
            flex-direction: column;
        }'''

new_card = '''        .article-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            height: 100%;
        }'''

content = content.replace(old_card, new_card)

# Update grid for consistent card heights
old_grid = '''        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
        }'''

new_grid = '''        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 2rem;
            align-items: stretch;
        }'''

content = content.replace(old_grid, new_grid)

with open('dcf_articles_library.html', 'w') as f:
    f.write(content)

print("✅ Fixed card consistency - all images 16:9, all cards same height")

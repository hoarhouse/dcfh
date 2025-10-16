with open('dcf_articles_library.html', 'r') as f:
    content = f.read()

# Remove hover transform
content = content.replace('''        .article-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }''', '''        .article-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }''')

# Make image truly edge-to-edge - remove border radius at top
content = content.replace('''        .article-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;''', '''        .article-card {
            background: white;
            border-radius: 0;
            overflow: hidden;
            border: 1px solid #e5e5e5;''')

# Wider grid - 3 columns instead of 4
content = content.replace('''        .articles-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
        }''', '''        .articles-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }''')

# More padding in content area
content = content.replace('''        .article-content {
            padding: 1.25rem;''', '''        .article-content {
            padding: 1.5rem;''')

# Bigger title
content = content.replace('''        .article-title {
            font-size: 1.1rem;''', '''        .article-title {
            font-size: 1.25rem;''')

with open('dcf_articles_library.html', 'w') as f:
    f.write(content)

print("✅ Fixed: 3-col grid, no transforms, edge-to-edge images")

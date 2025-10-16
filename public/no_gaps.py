with open('dcf_articles_library.html', 'r') as f:
    content = f.read()

# Remove ALL padding from content
content = content.replace(
    '            padding: 1.5rem 1.5rem 1.5rem 1.5rem;',
    '            padding: 0;'
)

# Add smaller internal spacing just for text elements
content = content.replace(
    '        .article-meta {',
    '        .article-meta {\n            padding: 1rem 1rem 0 1rem;'
)

content = content.replace(
    '        .article-title {',
    '        .article-title {\n            padding: 0 1rem;'
)

content = content.replace(
    '        .article-excerpt {',
    '        .article-excerpt {\n            padding: 0 1rem;'
)

content = content.replace(
    '        .article-footer {',
    '        .article-footer {\n            padding: 0.75rem 1rem 1rem 1rem;'
)

with open('dcf_articles_library.html', 'w') as f:
    f.write(content)

print("✅ NO GAPS - image and text edge-to-edge")

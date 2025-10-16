with open('dcf_articles_library.html', 'r') as f:
    content = f.read()

# Find and replace the malformed HTML structure in renderArticles
old_html = '''return `
                    <div class="article-card" onclick="window.location.href='${url}'">\\n                        ${article.featured_image_url ? `<img src="${article.featured_image_url}" alt="${article.title}" class="article-image">` : ''}\\n                        <div class="article-content">
                        <div class="article-meta">
                            <span class="meta-badge">${blogName}</span>
                        </div>
                        </div>
                        <h2 class="article-title">${article.title}</h2>
                        <p class="article-excerpt">${article.excerpt || 'Read more about this topic...'}</p>
                        <div class="article-footer">
                            <span class="article-date">${date}</span>
                            <span class="article-read-time">📖 ${article.read_time || '5'} min read</span>
                        </div>
                    </div>
                `;'''

new_html = '''return `
                    <div class="article-card" onclick="window.location.href='${url}'">
                        ${article.featured_image_url ? `<img src="${article.featured_image_url}" alt="${article.title}" class="article-image">` : ''}
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="meta-badge">${blogName}</span>
                            </div>
                            <h2 class="article-title">${article.title}</h2>
                            <p class="article-excerpt">${article.excerpt || 'Read more about this topic...'}</p>
                            <div class="article-footer">
                                <span class="article-date">${date}</span>
                                <span class="article-read-time">📖 ${article.read_time || '5'} min read</span>
                            </div>
                        </div>
                    </div>
                `;'''

content = content.replace(old_html, new_html)

with open('dcf_articles_library.html', 'w') as f:
    f.write(content)

print("✅ Fixed HTML structure - image now outside content padding")

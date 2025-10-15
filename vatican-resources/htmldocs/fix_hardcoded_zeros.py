#!/usr/bin/env python3
with open('antiqua-et-nova-2025.html', 'r') as f:
    content = f.read()

# Replace hardcoded 0s with IDs so JavaScript can find them
content = content.replace(
    '<div style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>\n                        <div style="font-size: 0.8rem; color: #666;">Views</div>',
    '<div id="stat-views" style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>\n                        <div style="font-size: 0.8rem; color: #666;">Views</div>'
)

content = content.replace(
    '<div style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>\n                        <div style="font-size: 0.8rem; color: #666;">Downloads</div>',
    '<div id="stat-downloads" style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>\n                        <div style="font-size: 0.8rem; color: #666;">Downloads</div>'
)

content = content.replace(
    '<div style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>\n                        <div style="font-size: 0.8rem; color: #666;">Bookmarks</div>',
    '<div id="stat-bookmarks" style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>\n                        <div style="font-size: 0.8rem; color: #666;">Bookmarks</div>'
)

content = content.replace(
    '<div style="font-size: 1.5rem; font-weight: 700; color: #333;">0.0★</div>\n                        <div style="font-size: 0.8rem; color: #666;">Rating</div>',
    '<div id="stat-rating" style="font-size: 1.5rem; font-weight: 700; color: #333;">0.0★</div>\n                        <div style="font-size: 0.8rem; color: #666;">Rating</div>'
)

# Now fix the JavaScript to use these IDs
old_js = '''                const sidebar = document.querySelector('aside');
                if (sidebar) {
                    const statDivs = sidebar.querySelectorAll('div[style*="font-size: 1.5rem"]');
                    if (statDivs[0]) statDivs[0].textContent = data.view_count || 0;
                    if (statDivs[1]) statDivs[1].textContent = data.download_count || 0;
                    if (statDivs[2]) statDivs[2].textContent = data.bookmark_count || 0;
                    if (statDivs[3]) statDivs[3].textContent = (data.rating_average || 0).toFixed(1) + '★';
                }'''

new_js = '''                const viewsEl = document.getElementById('stat-views');
                const downloadsEl = document.getElementById('stat-downloads');
                const bookmarksEl = document.getElementById('stat-bookmarks');
                const ratingEl = document.getElementById('stat-rating');
                
                if (viewsEl) viewsEl.textContent = data.view_count || 0;
                if (downloadsEl) downloadsEl.textContent = data.download_count || 0;
                if (bookmarksEl) bookmarksEl.textContent = data.bookmark_count || 0;
                if (ratingEl) ratingEl.textContent = (data.rating_average || 0).toFixed(1) + '★';'''

content = content.replace(old_js, new_js)

with open('antiqua-et-nova-2025.html', 'w') as f:
    f.write(content)

print("✅ Added IDs and fixed JavaScript selectors - FINAL FIX")

#!/usr/bin/env python3
with open('antiqua-et-nova-2025.html', 'r') as f:
    content = f.read()

# Replace the loadLiveStats selector code
old_code = '''                const statItems = document.querySelectorAll('[style*="font-size: 1.5rem"]');
                if (statItems[0]) statItems[0].textContent = data.view_count || 0;
                if (statItems[1]) statItems[1].textContent = data.download_count || 0;
                if (statItems[2]) statItems[2].textContent = data.bookmark_count || 0;
                if (statItems[3]) statItems[3].textContent = (data.rating_average || 0).toFixed(1) + '★';'''

new_code = '''                const sidebar = document.querySelector('aside');
                if (sidebar) {
                    const statDivs = sidebar.querySelectorAll('div[style*="font-size: 1.5rem"]');
                    if (statDivs[0]) statDivs[0].textContent = data.view_count || 0;
                    if (statDivs[1]) statDivs[1].textContent = data.download_count || 0;
                    if (statDivs[2]) statDivs[2].textContent = data.bookmark_count || 0;
                    if (statDivs[3]) statDivs[3].textContent = (data.rating_average || 0).toFixed(1) + '★';
                }'''

content = content.replace(old_code, new_code)

with open('antiqua-et-nova-2025.html', 'w') as f:
    f.write(content)

print("✅ Fixed stat display to target sidebar only")

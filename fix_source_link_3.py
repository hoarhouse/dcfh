import re

file = "vatican-resources/htmldocs/pope-leo-xiv-media-address-may-2025.html"

with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the source link
content = re.sub(
    r'Official Source:.*?</p>',
    'Official Source: <a href="https://www.vatican.va/content/leo-xiv/en/speeches/2025/may/documents/20250512-media.html" target="_blank">Vatican.va - Address to Media Representatives, May 12, 2025</a></p>',
    content,
    flags=re.DOTALL
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed Media Address source link")

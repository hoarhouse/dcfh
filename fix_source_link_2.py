import re

file = "vatican-resources/htmldocs/pope-leo-xiv-cardinals-address-may-2025.html"

with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the source link
content = re.sub(
    r'Official Source:.*?</p>',
    'Official Source: <a href="https://www.vatican.va/content/leo-xiv/en/speeches/2025/may/documents/20250510-collegio-cardinalizio.html" target="_blank">Vatican.va - Address to College of Cardinals, May 10, 2025</a></p>',
    content,
    flags=re.DOTALL
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed Cardinals Address source link")

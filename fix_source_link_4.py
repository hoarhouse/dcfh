import re

file = "vatican-resources/htmldocs/pope-leo-xiv-tech-executives-vatican-june-2025.html"

with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the source link
content = re.sub(
    r'Official Source:.*?</p>',
    'Official Source: <a href="https://www.vatican.va/content/leo-xiv/en/messages/pont-messages/2025/documents/20250617-messaggio-ia.html" target="_blank">Vatican.va - Message to AI Ethics Conference, June 17, 2025</a></p>',
    content,
    flags=re.DOTALL
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed Tech Executives source link")

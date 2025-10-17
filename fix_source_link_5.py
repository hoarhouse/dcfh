import re

file = "vatican-resources/htmldocs/pope-leo-xiv-un-ai-summit-july-2025.html"

with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the source link
content = re.sub(
    r'Official Source:.*?</p>',
    'Official Source: <a href="https://www.vatican.va/content/leo-xiv/en/messages/pont-messages/2025/documents/20250708-messaggio-aiforgood-ginevra.html" target="_blank">Vatican.va - Message to AI for Good Summit, July 10, 2025</a></p>',
    content,
    flags=re.DOTALL
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed UN AI Summit source link")

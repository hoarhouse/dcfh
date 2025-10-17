import re

# Fix 1: Minerva Dialogues 2023
file1 = "vatican-resources/htmldocs/pope-francis-minerva-dialogues-2023.html"
with open(file1, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(
    r'Official Source:.*?</p>',
    'Official Source: <a href="https://www.vatican.va/content/francesco/en/speeches/2023/march/documents/20230327-minerva-dialogues.html" target="_blank">Vatican.va - Address to Minerva Dialogues, March 27, 2023</a></p>',
    content,
    flags=re.DOTALL
)
with open(file1, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Fixed Minerva Dialogues 2023")

# Fix 2: World Communications Day 2023
file2 = "vatican-resources/htmldocs/pope-francis-world-communications-day-2023.html"
with open(file2, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(
    r'Official Source:.*?</p>',
    'Official Source: <a href="https://www.vatican.va/content/francesco/en/messages/communications/documents/20230124-messaggio-comunicazioni-sociali.html" target="_blank">Vatican.va - Message for World Communications Day 2023</a></p>',
    content,
    flags=re.DOTALL
)
with open(file2, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Fixed World Communications Day 2023")

# Fix 3: World Communications Day 2024
file3 = "vatican-resources/htmldocs/pope-francis-world-communications-day-2024.html"
with open(file3, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(
    r'Official Source:.*?</p>',
    'Official Source: <a href="https://www.vatican.va/content/francesco/en/messages/communications/documents/20240124-messaggio-comunicazioni-sociali.html" target="_blank">Vatican.va - Message for World Communications Day 2024</a></p>',
    content,
    flags=re.DOTALL
)
with open(file3, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Fixed World Communications Day 2024")

print("\n✅ ALL POPE FRANCIS SOURCE LINKS FIXED")

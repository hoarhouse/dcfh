with open('js/dcf-ui.js', 'r') as f:
    lines = f.readlines()

cleaned = []
for line in lines:
    # Skip lines that are ONLY the articles library string with weird formatting
    if line.strip() == "'public/dcf_articles_library.html',":
        continue
    cleaned.append(line)

with open('js/dcf-ui.js', 'w') as f:
    f.writelines(cleaned)

print("✅ Removed garbage lines")

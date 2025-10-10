import re

# Read contact page to get header
with open('/Users/christopherhoar/Desktop/dcfh/public/dcf_contact.html', 'r') as f:
    contact = f.read()

# Extract header
header_match = re.search(r'(<header class="header">.*?</header>)', contact, re.DOTALL)
if not header_match:
    print("❌ Could not find header in contact page")
    exit(1)

header_html = header_match.group(1)
# Fix the logo link
header_html = header_html.replace('href="#"', 'href="../index.html"')

print("✅ Extracted header from contact page")

# Read resource page
with open('lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html', 'r') as f:
    resource = f.read()

# Find where to insert (after <body>)
if '<body>' in resource:
    resource = resource.replace('<body>', f'<body>\n{header_html}\n')
    print("✅ Inserted header after <body>")
else:
    print("❌ Could not find <body> tag")
    exit(1)

# Add footer before </body> if not already there
if '<footer class="dcf-footer">' not in resource:
    resource = resource.replace('</body>', '\n<footer class="dcf-footer"></footer>\n</body>')
    print("✅ Added footer")

# Save
with open('lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html', 'w') as f:
    f.write(resource)

print("\n🎉 File updated! Commit and push, then test live URL.")

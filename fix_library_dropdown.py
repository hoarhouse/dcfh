with open('js/dcf-ui.js', 'r') as f:
    content = f.read()

old = """    items: [
            { id: 'library', text: 'Library', href: 'public/dcf_ai_resources.html' },
    ]"""

new = """    dropdown: true,
        items: [
            { id: 'library', text: 'Library', href: 'public/dcf_ai_resources.html' },
            { id: 'faqs', text: 'FAQs', href: 'faqs/index.html' }
        ]"""

content = content.replace(old, new)

with open('js/dcf-ui.js', 'w') as f:
    f.write(content)

print("✅ Added dropdown: true and FAQs link")

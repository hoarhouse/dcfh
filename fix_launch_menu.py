with open('js/dcf-ui.js', 'r') as f:
    content = f.read()

# Find and replace the broken LAUNCH_MENU section
old_menu = """    {
        id: 'resources',
        text: 'Library', 
        href: 'public/dcf_ai_resources.html', 
        items: [
            { id: 'library', text: 'Library', href: 'public/dcf_ai_resources.html' },
        ]
    }"""

new_menu = """    {
        id: 'resources',
        text: 'Library', 
        href: 'public/dcf_ai_resources.html', 
        dropdown: true,
        items: [
            { id: 'library', text: 'Library', href: 'public/dcf_ai_resources.html' },
            { id: 'faqs', text: 'FAQs', href: 'faqs/index.html' }
        ]
    }"""

content = content.replace(old_menu, new_menu)

with open('js/dcf-ui.js', 'w') as f:
    f.write(content)

print("✅ Fixed Library dropdown with FAQs")

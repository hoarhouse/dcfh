with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Make cards equal height with better visual design
old_collection_css = '''.collection-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border-left: 4px solid #000;
        }'''

new_collection_css = '''.collection-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 1px solid #e5e5e5;
            height: 100%;
            display: flex;
            flex-direction: column;
        }'''

content = content.replace(old_collection_css, new_collection_css)

# Add hover effect
old_hover_card = '''.collection-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }'''

new_hover_card = '''.collection-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
            border-color: #333;
        }'''

content = content.replace(old_hover_card, new_hover_card)

# Add icon back with modern styling
old_icon = '''.collection-icon {
            display: none;
        }'''

new_icon = '''.collection-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            opacity: 0.8;
        }'''

content = content.replace(old_icon, new_icon)

# Better title styling
old_title = '''.collection-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #000;
            margin-bottom: 1.25rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 0.9rem;
        }'''

new_title = '''.collection-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 1.5rem;
        }'''

content = content.replace(old_title, new_title)

# Remove arrows from links
content = content.replace(' →', '')
content = content.replace('→', '')

# Update list to limit items shown
old_items = '''.collection-items {
            list-style: none;
            padding: 0;
        }'''

new_items = '''.collection-items {
            list-style: none;
            padding: 0;
            flex-grow: 1;
        }'''

content = content.replace(old_items, new_items)

# Cleaner list item styling
old_li = '''.collection-items li {
            margin-bottom: 0.75rem;
        }'''

new_li = '''.collection-items li {
            margin-bottom: 1rem;
            position: relative;
            padding-left: 1rem;
        }
        
        .collection-items li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #999;
            font-weight: bold;
        }'''

content = content.replace(old_li, new_li)

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Made cards more engaging with equal heights and better design")

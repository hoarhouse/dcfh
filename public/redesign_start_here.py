with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Find and replace the collection-card styling
old_collection_css = '''.collection-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }'''

new_collection_css = '''.collection-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border-left: 4px solid #000;
        }'''

content = content.replace(old_collection_css, new_collection_css)

# Remove emoji icons and update title styling
old_icon_css = '''.collection-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }'''

new_icon_css = '''.collection-icon {
            display: none;
        }'''

content = content.replace(old_icon_css, new_icon_css)

# Update title styling
old_title_css = '''.collection-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 1rem;
        }'''

new_title_css = '''.collection-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #000;
            margin-bottom: 1.25rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 0.9rem;
        }'''

content = content.replace(old_title_css, new_title_css)

# Update list item styling for cleaner look
old_item_css = '''.collection-items li a {
            color: #333;
            text-decoration: none;
            transition: color 0.2s ease;
            display: block;
        }'''

new_item_css = '''.collection-items li a {
            color: #666;
            text-decoration: none;
            transition: all 0.2s ease;
            display: block;
            font-size: 0.95rem;
            line-height: 1.6;
        }'''

content = content.replace(old_item_css, new_item_css)

# Update hover state
old_hover = '''.collection-items li a:hover {
            color: #000;
            text-decoration: underline;
        }'''

new_hover = '''.collection-items li a:hover {
            color: #000;
            padding-left: 8px;
        }'''

content = content.replace(old_hover, new_hover)

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Redesigned Start Here cards - cleaner, modern, no emojis")

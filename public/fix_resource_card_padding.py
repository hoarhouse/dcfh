with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Find and update resource-card CSS to remove padding
old = '''.resource-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: box-shadow 0.3s ease;
            border: 1px solid #e5e5e5;
        }'''

new = '''.resource-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: box-shadow 0.3s ease;
            border: 1px solid #e5e5e5;
        }
        
        .resource-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }'''

content = content.replace(old, new)

# Ensure resource-content has correct padding
if '.resource-content {' not in content:
    # Find where to insert it
    insert_at = content.find('.resource-image {')
    if insert_at > 0:
        insert_point = content.find('}', insert_at) + 1
        resource_content_css = '''

        .resource-content {
            padding: 1.25rem;
        }
'''
        content = content[:insert_point] + resource_content_css + content[insert_point:]

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Fixed resource card padding")

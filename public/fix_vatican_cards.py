with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Change Vatican Document cards to use a different class
content = content.replace(
    '<!-- Key Vatican Documents -->',
    '''<!-- Key Vatican Documents -->
        <style>
        .resource-card-no-image {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            display: flex;
            flex-direction: column;
        }
        .resource-card-no-image:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
        </style>'''
)

# Replace all Vatican Document cards to use the new class
# Find the Vatican Documents section and replace resource-card with resource-card-no-image
lines = content.split('\n')
in_vatican_section = False
new_lines = []

for line in lines:
    if '<!-- Key Vatican Documents -->' in line:
        in_vatican_section = True
    elif '<!-- Featured Articles -->' in line or '<!-- Advanced Search' in line:
        in_vatican_section = False
    
    if in_vatican_section and 'class="resource-card"' in line:
        line = line.replace('class="resource-card"', 'class="resource-card-no-image"')
    
    new_lines.append(line)

content = '\n'.join(new_lines)

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Fixed Vatican Documents cards with separate styling")

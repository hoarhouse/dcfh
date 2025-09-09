#!/usr/bin/env python3
"""
Extract SVG icons from admin/icons.html and generate SQL INSERT statements
"""

import re

def create_sized_svg(svg_content, size):
    """Create a sized version of the SVG"""
    # Remove existing width/height attributes
    svg = re.sub(r'width="[^"]*"', '', svg_content)
    svg = re.sub(r'height="[^"]*"', '', svg)
    
    # Add new size attributes
    svg = svg.replace('<svg', f'<svg width="{size}" height="{size}"', 1)
    
    # Ensure viewBox exists
    if 'viewBox=' not in svg:
        svg = svg.replace('<svg', '<svg viewBox="0 0 24 24"', 1)
    
    return svg.strip()

def escape_sql(text):
    """Escape single quotes for SQL"""
    return text.replace("'", "''")

def extract_icons_from_section(content, style_name, set_id):
    """Extract all icons from a style section"""
    icons = {}
    
    # Find all icon boxes with their SVGs
    pattern = r'<div class="icon-box" data-name="([^"]+)">\s*(<svg[^<]*(?:<[^/][^<]*)*</svg>)'
    matches = re.findall(pattern, content, re.DOTALL)
    
    for name, svg in matches:
        # Clean up the SVG
        svg = re.sub(r'\s+', ' ', svg)  # Normalize whitespace
        svg = svg.strip()
        
        # Map icon names to our core icon names
        icon_map = {
            'Home': 'home',
            'Menu': 'menu', 
            'Search': 'search',
            'Arrow': 'arrow',
            'Close': 'close',
            'Message': 'message',
            'Phone': 'phone',
            'Email': 'email',
            'Bell': 'notification',
            'Share': 'share',
            'User': 'user',
            'Team': 'team',
            'Heart': 'heart',
            'Star': 'star',
            'Settings': 'settings',
            'AI Brain': 'ai',
            'Shield': 'shield',
            'Globe': 'globe',
            'Data': 'data',
            'Code': 'code',
            'Peace': 'peace',
            'Education': 'education',
            'Health': 'health',
            'Research': 'research',
            'Collaboration': 'collaboration',
            'Calendar': 'calendar',
            'Clock': 'clock',
            'Donate': 'donate',
            'Justice': 'justice',
            'Megaphone': 'megaphone',
            'News': 'news',
            'Info': 'info',
            'Success': 'success',
            'Error': 'error',
            'Warning': 'warning',
            'Edit': 'edit',
            'View': 'view'
        }
        
        core_name = icon_map.get(name, name.lower().replace(' ', '_'))
        icons[core_name] = svg
    
    return icons

def generate_sql_for_set(set_name, set_id, icons):
    """Generate SQL INSERT statements for an icon set"""
    sql_lines = [f"\n-- {set_name} Icons (set_id={set_id})"]
    sql_lines.append("INSERT INTO icons (set_id, icon_name, icon_category, svg_small, svg_standard, svg_large, description) VALUES")
    
    values = []
    for icon_name, svg in icons.items():
        # Determine category
        if icon_name in ['peace', 'education', 'health', 'research']:
            category = 'initiatives'
        elif icon_name in ['home', 'menu', 'search', 'arrow', 'close']:
            category = 'navigation'
        elif icon_name in ['message', 'phone', 'email', 'notification', 'share']:
            category = 'communication'
        elif icon_name in ['user', 'team', 'heart', 'star', 'settings']:
            category = 'user'
        elif icon_name in ['ai', 'shield', 'globe', 'data', 'code']:
            category = 'technology'
        else:
            category = 'general'
        
        # Create sized versions
        svg_small = escape_sql(create_sized_svg(svg, 16))
        svg_standard = escape_sql(create_sized_svg(svg, 24))
        svg_large = escape_sql(create_sized_svg(svg, 32))
        
        description = f"{icon_name.replace('_', ' ').title()} icon"
        
        values.append(f"({set_id}, '{icon_name}', '{category}', '{svg_small}', '{svg_standard}', '{svg_large}', '{description}')")
    
    sql_lines.append(',\n'.join(values) + ';')
    
    return '\n'.join(sql_lines)

# Read the icons.html file
with open('/Users/christopherhoar/Desktop/dcfh/admin/icons.html', 'r') as f:
    content = f.read()

# Define the icon sets and their IDs in the database
icon_sets = [
    ('Modern Minimalist', 1),
    ('Solid Geometric', 2), 
    ('Hybrid Clean', 3),
    ('Sacred Minimalist', 4),
    ('Humanity Focused', 5),
    ('Faith & Tech Fusion', 6)
]

sql_output = []
sql_output.append("-- DCF Icon System - Complete Icon Library SQL")
sql_output.append("-- Generated SQL INSERT statements for all icon sets")
sql_output.append("-- Run these commands in your Supabase SQL editor\n")

# Process each icon set
for set_name, set_id in icon_sets:
    # Find the section for this style - more flexible pattern
    pattern = f"Style {set_id}:.*?style-card.*?(?=Style \\d+:|$)"
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    
    if match:
        section_content = match.group(0)
        icons = extract_icons_from_section(section_content, set_name, set_id)
        
        if icons:
            sql = generate_sql_for_set(set_name, set_id, icons)
            sql_output.append(sql)
            print(f"✅ Extracted {len(icons)} icons from {set_name}")
        else:
            # Try alternate extraction method
            print(f"⚠️ Trying alternate extraction for {set_name}")
            # Extract all SVGs in section
            svg_pattern = r'<svg[^>]*>.*?</svg>'
            svgs = re.findall(svg_pattern, section_content, re.DOTALL)
            print(f"   Found {len(svgs)} SVGs in section")
    else:
        print(f"❌ Could not find section for {set_name}")

# Add additional core icons that might be missing
additional_icons = {
    'success': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    'error': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    'warning': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    'calendar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    'clock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    'donate': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    'justice': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"></path><path d="M5 7l7-5 7 5"></path><path d="M5 7v6c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7"></path></svg>',
    'megaphone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-8v18L3 13v-2z"></path><path d="M8.5 16c0 1.5-.5 4-1 5.5"></path></svg>',
    'news': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9h4"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>',
    'info': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    'edit': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    'view': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
}

# Add missing icons to each set
sql_output.append("\n\n-- Additional Core Icons for All Sets")
sql_output.append("-- These ensure all required icons are available in each set\n")

for set_name, set_id in icon_sets:
    values = []
    for icon_name, svg in additional_icons.items():
        svg_small = escape_sql(create_sized_svg(svg, 16))
        svg_standard = escape_sql(create_sized_svg(svg, 24))
        svg_large = escape_sql(create_sized_svg(svg, 32))
        description = f"{icon_name.replace('_', ' ').title()} icon"
        category = 'general'
        
        values.append(f"({set_id}, '{icon_name}', '{category}', '{svg_small}', '{svg_standard}', '{svg_large}', '{description}')")
    
    sql_output.append(f"\n-- Missing core icons for {set_name} (set_id={set_id})")
    sql_output.append("INSERT INTO icons (set_id, icon_name, icon_category, svg_small, svg_standard, svg_large, description) VALUES")
    sql_output.append(',\n'.join(values) + ' ON CONFLICT (set_id, icon_name) DO NOTHING;')

# Write to SQL file
output_file = '/Users/christopherhoar/Desktop/dcfh/dcf_icons_insert.sql'
with open(output_file, 'w') as f:
    f.write('\n'.join(sql_output))

print(f"\n✅ SQL file generated: {output_file}")
print(f"📋 Total SQL statements: {len(icon_sets) * 2}")
print("\n📌 Next steps:")
print("1. Open dcf_icons_insert.sql")
print("2. Copy the SQL statements")
print("3. Paste into Supabase SQL editor")
print("4. Run the queries to populate the icons table")
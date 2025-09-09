#!/usr/bin/env python3
"""
Generate SQL INSERT statements for DCF Icon System
Manually processes each icon set with actual SVG data
"""

def escape_sql(text):
    """Escape single quotes for SQL"""
    return text.replace("'", "''")

def create_sized_svg(svg_content, size):
    """Create a sized version of the SVG"""
    import re
    # Clean the SVG
    svg = svg_content.strip()
    
    # Remove existing width/height
    svg = re.sub(r'width="[^"]*"', '', svg)
    svg = re.sub(r'height="[^"]*"', '', svg)
    
    # Add size attributes
    if '<svg' in svg:
        svg = svg.replace('<svg', f'<svg width="{size}" height="{size}"', 1)
    
    # Ensure viewBox
    if 'viewBox=' not in svg:
        svg = svg.replace('<svg', '<svg viewBox="0 0 24 24"', 1)
    
    return svg

def generate_icon_sql(icon_set_id, set_name, icon_name, svg, category='general'):
    """Generate SQL for a single icon"""
    svg_small = escape_sql(create_sized_svg(svg, 16))
    svg_standard = escape_sql(create_sized_svg(svg, 24))
    svg_large = escape_sql(create_sized_svg(svg, 32))
    description = f"{icon_name.replace('_', ' ').title()} icon for {set_name}"
    
    return f"({icon_set_id}, '{icon_name}', '{category}', '{svg_small}', '{svg_standard}', '{svg_large}', '{description}')"

# Define all core icons with their SVG data (Modern Minimalist style as base)
core_icons = {
    # Navigation
    'home': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
             '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>'
             '<polyline points="9 22 9 12 15 12 15 22"></polyline></svg>', 'navigation'),
    
    'menu': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
             '<line x1="3" y1="6" x2="21" y2="6"></line>'
             '<line x1="3" y1="12" x2="21" y2="12"></line>'
             '<line x1="3" y1="18" x2="21" y2="18"></line></svg>', 'navigation'),
    
    'search': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
               '<circle cx="11" cy="11" r="8"></circle>'
               '<path d="m21 21-4.35-4.35"></path></svg>', 'navigation'),
    
    'close': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
              '<line x1="18" y1="6" x2="6" y2="18"></line>'
              '<line x1="6" y1="6" x2="18" y2="18"></line></svg>', 'navigation'),
    
    # Communication
    'message': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
                '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>', 'communication'),
    
    'notification': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
                     '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>'
                     '<path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>', 'communication'),
    
    'share': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
              '<circle cx="18" cy="5" r="3"></circle>'
              '<circle cx="6" cy="12" r="3"></circle>'
              '<circle cx="18" cy="19" r="3"></circle>'
              '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>'
              '<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>', 'communication'),
    
    # User
    'user': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
             '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>'
             '<circle cx="12" cy="7" r="4"></circle></svg>', 'user'),
    
    'settings': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
                 '<circle cx="12" cy="12" r="3"></circle>'
                 '<path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 12h6m6 0h6m-13.22 4.22l4.24 4.24M6.34 6.34l4.24 4.24m8.88 0l4.24 4.24"></path></svg>', 'user'),
    
    # Initiatives
    'peace': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
              '<circle cx="12" cy="12" r="10"></circle>'
              '<line x1="12" y1="2" x2="12" y2="22"></line>'
              '<path d="M12 12L4.93 16.5"></path>'
              '<path d="M12 12L19.07 16.5"></path></svg>', 'initiatives'),
    
    'education': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
                  '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>'
                  '<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>', 'initiatives'),
    
    'health': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
               '<line x1="12" y1="2" x2="12" y2="22"></line>'
               '<line x1="2" y1="12" x2="22" y2="12"></line></svg>', 'initiatives'),
    
    'research': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
                 '<path d="M10 2v8L8 8l-2 2v8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-8l-2-2-2 2V2"></path>'
                 '<line x1="10" y1="2" x2="14" y2="2"></line></svg>', 'initiatives'),
    
    # Status
    'success': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
                '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>'
                '<polyline points="22 4 12 14.01 9 11.01"></polyline></svg>', 'status'),
    
    'error': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
              '<circle cx="12" cy="12" r="10"></circle>'
              '<line x1="15" y1="9" x2="9" y2="15"></line>'
              '<line x1="9" y1="9" x2="15" y2="15"></line></svg>', 'status'),
    
    'warning': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
                '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>'
                '<line x1="12" y1="9" x2="12" y2="13"></line>'
                '<line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', 'status'),
    
    'info': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
             '<circle cx="12" cy="12" r="10"></circle>'
             '<line x1="12" y1="16" x2="12" y2="12"></line>'
             '<line x1="12" y1="8" x2="12.01" y2="8"></line></svg>', 'status'),
    
    # Additional
    'calendar': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
                 '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>'
                 '<line x1="16" y1="2" x2="16" y2="6"></line>'
                 '<line x1="8" y1="2" x2="8" y2="6"></line>'
                 '<line x1="3" y1="10" x2="21" y2="10"></line></svg>', 'general'),
    
    'clock': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
              '<circle cx="12" cy="12" r="10"></circle>'
              '<polyline points="12 6 12 12 16 14"></polyline></svg>', 'general'),
    
    'donate': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
               '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>', 'general'),
    
    'globe': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
              '<circle cx="12" cy="12" r="10"></circle>'
              '<line x1="2" y1="12" x2="22" y2="12"></line>'
              '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>', 'general'),
    
    'justice': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
                '<path d="M12 2v20"></path>'
                '<path d="M5 7l7-5 7 5"></path>'
                '<path d="M5 7v6c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7"></path></svg>', 'general'),
    
    'megaphone': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
                  '<path d="M3 11l18-8v18L3 13v-2z"></path>'
                  '<path d="M8.5 16c0 1.5-.5 4-1 5.5"></path></svg>', 'general'),
    
    'news': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
             '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9h4"></path>'
             '<path d="M18 14h-8"></path>'
             '<path d="M15 18h-5"></path>'
             '<path d="M10 6h8v4h-8V6Z"></path></svg>', 'general'),
    
    'edit': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
             '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>'
             '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>', 'general'),
    
    'view': ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
             '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>'
             '<circle cx="12" cy="12" r="3"></circle></svg>', 'general')
}

# Icon set definitions
icon_sets = [
    (1, 'Modern Minimalist'),
    (2, 'Solid Geometric'),
    (3, 'Hybrid Clean'),
    (4, 'Sacred Minimalist'),
    (5, 'Humanity Focused'),
    (6, 'Faith & Tech Fusion')
]

# Generate SQL
sql_output = []
sql_output.append("-- DCF Icon System - Complete Icon Library")
sql_output.append("-- SQL INSERT statements for populating the icons table")
sql_output.append("-- Generated for all 6 icon sets with 25+ icons each")
sql_output.append("-- ")
sql_output.append("-- Instructions:")
sql_output.append("-- 1. Copy this entire file")
sql_output.append("-- 2. Open Supabase SQL Editor")
sql_output.append("-- 3. Paste and run the SQL")
sql_output.append("")

# Generate SQL for each icon set
for icon_set_id, set_name in icon_sets:
    sql_output.append(f"\n-- {set_name} Icons (icon_set_id={icon_set_id})")
    sql_output.append("INSERT INTO icons (icon_set_id, icon_name, icon_category, svg_small, svg_standard, svg_large, description) VALUES")
    
    values = []
    for icon_name, (svg, category) in core_icons.items():
        # Apply style variations based on icon_set_id
        styled_svg = svg
        
        if icon_set_id == 2:  # Solid Geometric - make filled versions
            styled_svg = svg.replace('fill="none"', 'fill="currentColor"').replace('stroke-width="2"', 'stroke-width="0"')
        elif icon_set_id == 3:  # Hybrid Clean - slightly thicker strokes
            styled_svg = svg.replace('stroke-width="2"', 'stroke-width="2.5"')
        elif icon_set_id == 4:  # Sacred Minimalist - thinner strokes
            styled_svg = svg.replace('stroke-width="2"', 'stroke-width="1.5"')
        elif icon_set_id == 5:  # Humanity Focused - rounded caps
            styled_svg = svg.replace('stroke-linecap="round"', 'stroke-linecap="round" stroke-linejoin="round"')
        elif icon_set_id == 6:  # Faith & Tech Fusion - mixed style
            if category == 'initiatives':
                styled_svg = svg.replace('stroke-width="2"', 'stroke-width="2.5"')
            else:
                styled_svg = svg.replace('stroke-width="2"', 'stroke-width="1.8"')
        
        values.append(generate_icon_sql(icon_set_id, set_name, icon_name, styled_svg, category))
    
    sql_output.append(',\n'.join(values) + ';')

# Add cleanup and verification queries
sql_output.append("\n\n-- Verification Query")
sql_output.append("-- Run this to check the icons were inserted correctly:")
sql_output.append("SELECT icon_set_id, COUNT(*) as icon_count")
sql_output.append("FROM icons")
sql_output.append("GROUP BY icon_set_id")
sql_output.append("ORDER BY icon_set_id;")

sql_output.append("\n-- Expected result: Each icon_set_id should have 25+ icons")

# Write to file
output_file = '/Users/christopherhoar/Desktop/dcfh/dcf_icons_insert.sql'
with open(output_file, 'w') as f:
    f.write('\n'.join(sql_output))

print("✅ SQL file generated successfully!")
print(f"📁 Output file: {output_file}")
print(f"📊 Generated SQL for {len(icon_sets)} icon sets")
print(f"🎨 Each set contains {len(core_icons)} icons")
print(f"💾 Total icons to be inserted: {len(icon_sets) * len(core_icons)}")
print("\n📋 Next steps:")
print("1. Open dcf_icons_insert.sql")
print("2. Copy all SQL statements")
print("3. Go to Supabase SQL Editor")
print("4. Paste and execute the SQL")
print("5. Verify with the included verification query")
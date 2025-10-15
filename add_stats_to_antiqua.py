#!/usr/bin/env python3
"""Add stats tracking JavaScript to Antiqua et Nova"""

import uuid

with open('vatican-resources/htmldocs/antiqua-et-nova-2025.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Generate unique resource ID for this document
resource_id = str(uuid.uuid4())

# Find where to insert (before closing </body> tag)
stats_js = f'''
    <script>
        // Resource tracking
        const resourceId = '{resource_id}';
        
        // Track page view
        async function trackView() {{
            if (!window.dcfSupabase) return;
            
            try {{
                await window.dcfSupabase.rpc('increment_view_count', {{
                    resource_id: resourceId
                }});
                console.log('✅ View tracked');
            }} catch (err) {{
                console.warn('Failed to track view:', err);
            }}
        }}
        
        // Track download (when clicking external links)
        async function trackDownload() {{
            if (!window.dcfSupabase) return;
            
            try {{
                await window.dcfSupabase.rpc('increment_download_count', {{
                    resource_id: resourceId
                }});
                console.log('✅ Download tracked');
            }} catch (err) {{
                console.warn('Failed to track download:', err);
            }}
        }}
        
        // Load live stats
        async function loadLiveStats() {{
            if (!window.dcfSupabase) return;
            
            try {{
                const {{ data, error }} = await window.dcfSupabase.from('resources')
                    .select('view_count, download_count, bookmark_count, rating_average')
                    .eq('id', resourceId)
                    .single();
                
                if (error) throw error;
                
                // Update stat numbers in the DOM (using inline styles)
                const statNumbers = document.querySelectorAll('.htmldoc-sidebar [style*="font-size: 1.5rem"]');
                if (statNumbers[0]) statNumbers[0].textContent = data.view_count || 0;
                if (statNumbers[1]) statNumbers[1].textContent = data.download_count || 0;
                if (statNumbers[2]) statNumbers[2].textContent = data.bookmark_count || 0;
                if (statNumbers[3]) statNumbers[3].textContent = (data.rating_average || 0).toFixed(1) + '★';
                
                console.log('✅ Live stats loaded:', data);
            }} catch (err) {{
                console.warn('Failed to load stats:', err);
            }}
        }}
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {{
            setTimeout(() => {{
                trackView();
                loadLiveStats();
            }}, 1000);
        }});
    </script>
'''

# Insert before </body>
html = html.replace('</body>', stats_js + '\n</body>')

with open('vatican-resources/htmldocs/antiqua-et-nova-2025.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Added stats tracking to Antiqua et Nova")
print(f"   Resource ID: {resource_id}")

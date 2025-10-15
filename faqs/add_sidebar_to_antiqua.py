#!/usr/bin/env python3
"""Add sidebar to Antiqua et Nova htmldocs page"""

with open('../vatican-resources/antiqua-et-nova-2025.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the main container and wrap it in flex layout
html = html.replace(
    '<div class="htmldoc-container">',
    '<div style="display: flex; gap: 2rem; max-width: 1400px; margin: 0 auto; padding: 2rem;">\n        <div class="htmldoc-container" style="flex: 1; max-width: 900px;">'
)

# Find where to insert sidebar (before back-to-top link)
insertion_point = html.find('<a href="#" class="back-to-top"')

if insertion_point == -1:
    print("❌ Could not find insertion point")
    exit(1)

sidebar_html = '''        </div>
        
        <!-- RIGHT SIDEBAR -->
        <aside style="width: 320px; flex-shrink: 0;">
            <div style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">👤 Author</h3>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #dc3545, #c82333); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.1rem;">VD</div>
                    <div>
                        <div style="font-weight: 600; color: #333;">Vatican Documents</div>
                        <div style="color: #666; font-size: 0.9rem;">Vatican / DCF Hungary</div>
                    </div>
                </div>
            </div>

            <div style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">📊 Statistics</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>
                        <div style="font-size: 0.8rem; color: #666;">Views</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>
                        <div style="font-size: 0.8rem; color: #666;">Downloads</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #333;">0</div>
                        <div style="font-size: 0.8rem; color: #666;">Bookmarks</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #333;">0.0★</div>
                        <div style="font-size: 0.8rem; color: #666;">Rating</div>
                    </div>
                </div>
            </div>

            <div style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">🔗 Share</h3>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="https://twitter.com/intent/tweet?url=https://hoarhouse.github.io/dcfh/vatican-resources/antiqua-et-nova-2025.html&text=Antiqua%20et%20Nova" target="_blank" style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; text-decoration: none; color: #333; font-weight: 500;">𝕏 Twitter</a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=https://hoarhouse.github.io/dcfh/vatican-resources/antiqua-et-nova-2025.html" target="_blank" style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; text-decoration: none; color: #333; font-weight: 500;">📘 Facebook</a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://hoarhouse.github.io/dcfh/vatican-resources/antiqua-et-nova-2025.html" target="_blank" style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; text-decoration: none; color: #333; font-weight: 500;">💼 LinkedIn</a>
                    <button onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied!');" style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; border: none; color: #333; font-weight: 500; cursor: pointer; width: 100%; font-family: inherit; font-size: inherit;">📋 Copy Link</button>
                </div>
            </div>

            <div style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">🏷️ Tags</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="padding: 0.4rem 0.8rem; background: #f8f9fa; border-radius: 20px; font-size: 0.85rem; color: #666;">Antiqua et Nova</span>
                    <span style="padding: 0.4rem 0.8rem; background: #f8f9fa; border-radius: 20px; font-size: 0.85rem; color: #666;">Vatican</span>
                    <span style="padding: 0.4rem 0.8rem; background: #f8f9fa; border-radius: 20px; font-size: 0.85rem; color: #666;">AI Ethics</span>
                    <span style="padding: 0.4rem 0.8rem; background: #f8f9fa; border-radius: 20px; font-size: 0.85rem; color: #666;">Pope Francis</span>
                    <span style="padding: 0.4rem 0.8rem; background: #f8f9fa; border-radius: 20px; font-size: 0.85rem; color: #666;">Human Dignity</span>
                    <span style="padding: 0.4rem 0.8rem; background: #f8f9fa; border-radius: 20px; font-size: 0.85rem; color: #666;">AI Warfare</span>
                </div>
            </div>
        </aside>
    </div>

    '''

# Insert sidebar before back-to-top
html = html[:insertion_point] + sidebar_html + '\n    ' + html[insertion_point:]

# Write updated file
with open('../vatican-resources/antiqua-et-nova-2025.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Added sidebar to Antiqua et Nova")

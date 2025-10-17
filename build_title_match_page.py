#!/usr/bin/env python3
"""
Builder for pages that use title matching instead of tag queries
"""
from build_resource_page import build_page

def build_title_match_page(config, title_query):
    """
    config: same as build_page
    title_query: SQL query like ".or('title.ilike.%pope francis%,title.ilike.%holy father%')"
    """
    html = build_page(config)
    html = html.replace(
        f".contains('tags', ['{config['tag_slug']}'])",
        title_query
    )
    with open(f'public/{config["filename"]}', 'w') as f:
        f.write(html)
    print(f'✅ Created: public/{config["filename"]}')

if __name__ == '__main__':
    # Example: Pope Francis
    config = {
        'filename': 'pope-francis-technology.html',
        'page_title': 'Pope Francis on AI & Technology',
        'meta_description': 'Complete collection of Pope Francis teachings',
        'breadcrumb_text': 'Back to Library',
        'breadcrumb_url': 'dcf_ai_resources.html',
        'header_title': 'Pope Francis on AI & Technology',
        'header_subtitle': 'The complete vision from Pope Francis on ethical technology',
        'tag_slug': 'CUSTOM',  # Placeholder, will be replaced
        'blog_url_prefix': '../blog/pope-francis/'
    }
    title_query = ".or('title.ilike.%pope francis%,title.ilike.%holy father%,title.ilike.%g7%,title.ilike.%world day of peace 2024%')"
    build_title_match_page(config, title_query)

from build_resource_page import build_page

configs = [
    {
        'filename': 'pope-francis-technology.html',
        'page_title': 'Pope Francis on AI & Technology',
        'meta_description': 'Complete collection of Pope Francis teachings',
        'breadcrumb_text': 'Back to Library',
        'breadcrumb_url': 'dcf_ai_resources.html',
        'header_title': 'Pope Francis on AI & Technology',
        'header_subtitle': 'The complete vision from Pope Francis on ethical technology',
        'tag_slug': 'pope-francis',
        'blog_url_prefix': '../blog/pope-francis/'
    },
    {
        'filename': 'pope-leo-technology.html',
        'page_title': 'Pope Leo XIV: Faith & Technology',
        'meta_description': 'Pope Leo XIV emerging vision for AI',
        'breadcrumb_text': 'Back to Library',
        'breadcrumb_url': 'dcf_ai_resources.html',
        'header_title': 'Pope Leo XIV: Faith & Technology in a New Era',
        'header_subtitle': 'The new papacy emerging vision for AI',
        'tag_slug': 'pope-leo',
        'blog_url_prefix': '../blog/pope-leo/'
    },
    {
        'filename': 'warfare-security.html',
        'page_title': 'Warfare, Security & Disarmament',
        'meta_description': 'Catholic teaching on AI weapons and peace',
        'breadcrumb_text': 'Back to Library',
        'breadcrumb_url': 'dcf_ai_resources.html',
        'header_title': 'Warfare, Security & Disarmament',
        'header_subtitle': 'AI weapons, nuclear ethics, and the pursuit of peace',
        'tag_slug': 'warfare-security',
        'blog_url_prefix': '../blog/warfare/'
    },
    {
        'filename': 'work-economy.html',
        'page_title': 'Work, Economy & Human Dignity',
        'meta_description': 'Catholic teaching on AI and employment',
        'breadcrumb_text': 'Back to Library',
        'breadcrumb_url': 'dcf_ai_resources.html',
        'header_title': 'Work, Economy & Human Dignity',
        'header_subtitle': 'AI impact on employment and economic justice',
        'tag_slug': 'work-economy',
        'blog_url_prefix': '../blog/work-economy/'
    }
]

for config in configs:
    html = build_page(config)
    with open(f'public/{config["filename"]}', 'w') as f:
        f.write(html)
    print(f'✅ Created: public/{config["filename"]}')

print('\n🎉 ALL 4 PAGES CREATED!')

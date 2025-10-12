#!/usr/bin/env python3
from pathlib import Path

BASE_URL = "https://hoarhouse.github.io/dcfh"

def generate_sitemap():
    urls = []
    
    # Launch pages ONLY from LAUNCH_MENU
    launch_pages = [
        ('/', '1.0', 'daily'),  # Homepage
        ('/blog/index.html', '0.9', 'daily'),
        ('/initiatives/initiatives_home.html', '0.8', 'monthly'),
        ('/initiatives/peace/initiative_peace.html', '0.7', 'monthly'),
        ('/initiatives/education/initiative_education.html', '0.7', 'monthly'),
        ('/initiatives/health/initiative_health.html', '0.7', 'monthly'),
        ('/initiatives/research/initiative_research.html', '0.7', 'monthly'),
        ('/public/dcf_values.html', '0.8', 'monthly'),
        ('/public/dcf_contact.html', '0.7', 'monthly'),
        ('/public/dcf_ai_resources.html', '0.9', 'weekly'),
    ]
    
    for path, priority, changefreq in launch_pages:
        if path == '/':
            full_path = Path('index.html')
        else:
            full_path = Path(path.lstrip('/'))
        
        if full_path.exists():
            urls.append({
                'loc': f'{BASE_URL}{path}',
                'priority': priority,
                'changefreq': changefreq
            })
    
    # Blog posts
    blog_dir = Path('blog')
    if blog_dir.exists():
        for blog_folder in blog_dir.iterdir():
            if blog_folder.is_dir() and blog_folder.name not in ['admin', 'templates']:
                for html_file in blog_folder.glob('*.html'):
                    if html_file.name not in ['post.html', 'category.html', 'index.html']:
                        urls.append({
                            'loc': f'{BASE_URL}/blog/{blog_folder.name}/{html_file.name}',
                            'priority': '0.9',
                            'changefreq': 'monthly'
                        })
    
    # Vatican resources
    vatican_dir = Path('vatican-resources')
    if vatican_dir.exists():
        urls.append({
            'loc': f'{BASE_URL}/vatican-resources/',
            'priority': '0.9',
            'changefreq': 'weekly'
        })
        
        for html_file in vatican_dir.glob('*.html'):
            if not any(skip in html_file.name.lower() for skip in ['sample', 'test', 'temp']):
                urls.append({
                    'loc': f'{BASE_URL}/vatican-resources/{html_file.name}',
                    'priority': '0.8',
                    'changefreq': 'monthly'
                })
    
    # Generate XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml += '  <url>\n'
        xml += f'    <loc>{url["loc"]}</loc>\n'
        xml += f'    <changefreq>{url["changefreq"]}</changefreq>\n'
        xml += f'    <priority>{url["priority"]}</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(xml)
    
    print(f'✅ Sitemap generated with {len(urls)} URLs')
    print('📄 Pages included:')
    print(f'   - Launch pages: {sum(1 for u in urls if "/blog/" not in u["loc"] and "/vatican-resources/" not in u["loc"])}')
    print(f'   - Blog posts: {sum(1 for u in urls if "/blog/" in u["loc"])}')
    print(f'   - Vatican resources: {sum(1 for u in urls if "/vatican-resources/" in u["loc"])}')
    print(f'📝 Sitemap saved to: sitemap.xml')

if __name__ == '__main__':
    generate_sitemap()

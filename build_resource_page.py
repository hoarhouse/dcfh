#!/usr/bin/env python3
"""
MASTER RESOURCE PAGE BUILDER
Builds resource detail pages with working nav/footer using the proven template
NO MORE SED COMMANDS - ONE COMPLETE FILE GENERATION
"""

import sys

def build_page(config):
    """
    Build a complete resource page using proven template structure.
    
    config = {
        'filename': 'ai-ethics-philosophy.html',
        'page_title': 'AI Ethics & Philosophy',
        'meta_description': 'Description here...',
        'breadcrumb_text': 'Back to Library',
        'breadcrumb_url': 'dcf_ai_resources.html',
        'header_title': 'AI Ethics & Philosophy',
        'header_subtitle': 'Subtitle here...',
        'tag_slug': 'ai-ethics-philosophy',
        'blog_url_prefix': '../blog/ai-ethics/'
    }
    """
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{config['page_title']} - DCF Hungary</title>
    <meta name="description" content="{config['meta_description']}">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23333'/></svg>">
    
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
            color: #333;
            line-height: 1.6;
        }}

        .header {{
            background: white;
            border-bottom: 1px solid #e5e5e5;
            padding: 1rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }}

        .nav-container {{
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }}

        .logo {{
            display: flex;
            align-items: center;
            font-weight: 600;
            color: #333;
            text-decoration: none;
            font-size: 1.1rem;
        }}

        .nav-menu {{
            display: flex;
            list-style: none;
            gap: 2rem;
        }}

        .nav-menu a {{
            text-decoration: none;
            color: #666;
            font-size: 0.9rem;
            transition: color 0.3s;
        }}

        .nav-menu a:hover {{
            color: #333;
        }}

        .main-container {{
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 2rem;
        }}

        .breadcrumb {{
            margin-bottom: 1.5rem;
        }}

        .breadcrumb a {{
            color: #666;
            text-decoration: none;
            font-size: 0.9rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: color 0.2s;
        }}

        .breadcrumb a:hover {{
            color: #000;
        }}

        .page-header {{
            margin-bottom: 3rem;
        }}

        .page-title {{
            font-size: 2.5rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 0.5rem;
        }}

        .page-subtitle {{
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            max-width: 800px;
            line-height: 1.6;
        }}

        .page-controls {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}

        .stats {{
            display: flex;
            gap: 2rem;
            align-items: center;
        }}

        .stat-item {{
            font-size: 0.9rem;
            color: #666;
        }}

        .stat-number {{
            font-weight: 700;
            color: #000;
            font-size: 1.2rem;
        }}

        .sort-controls {{
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }}

        .sort-label {{
            font-size: 0.9rem;
            color: #666;
            font-weight: 600;
        }}

        .sort-btn {{
            padding: 0.5rem 1rem;
            background: #f8f9fa;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
        }}

        .sort-btn:hover {{
            background: #e9ecef;
        }}

        .sort-btn.active {{
            background: #000;
            color: white;
            border-color: #000;
        }}

        .resource-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }}

        .resource-card {{
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid transparent;
            display: flex;
            flex-direction: column;
        }}

        .resource-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
            border-color: #000;
        }}

        .resource-type-badge {{
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 1rem;
            width: fit-content;
        }}

        .badge-document {{
            background: #e8f5e9;
            color: #2e7d32;
        }}

        .badge-article {{
            background: #e3f2fd;
            color: #1565c0;
        }}

        .resource-title {{
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.75rem;
            line-height: 1.4;
        }}

        .resource-description {{
            color: #666;
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 1rem;
            flex-grow: 1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }}

        .resource-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: auto;
            padding-top: 1rem;
            border-top: 1px solid #f0f0f0;
        }}

        .tag {{
            background: #f8f9fa;
            color: #666;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            border: 1px solid #e5e5e5;
        }}

        .resource-date {{
            color: #999;
            font-size: 0.85rem;
            margin-top: 0.5rem;
        }}

        .loading {{
            text-align: center;
            padding: 3rem;
            color: #666;
            font-size: 1.1rem;
        }}

        .empty-state {{
            text-align: center;
            padding: 4rem 2rem;
            color: #666;
        }}

        .empty-state h3 {{
            color: #333;
            margin-bottom: 0.5rem;
        }}

        @media (max-width: 768px) {{
            .main-container {{
                padding: 0 1rem;
            }}

            .page-title {{
                font-size: 2rem;
            }}

            .resource-grid {{
                grid-template-columns: 1fr;
            }}

            .page-controls {{
                flex-direction: column;
                align-items: flex-start;
            }}

            .stats {{
                flex-direction: column;
                gap: 0.5rem;
                align-items: flex-start;
            }}
        }}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../js/dcf-core.js"></script>
    <script src="../js/dcf-ui.js"></script>
    <script src="../js/dcf-auth.js"></script>
    <script src="../js/dcf-analytics.js"></script>
    <script src="../js/dcf-init.js"></script>
</head>
<body>
    <header class="header" id="main-header"></header>

    <main class="main-container">
        <div class="breadcrumb">
            <a href="{config['breadcrumb_url']}">← {config['breadcrumb_text']}</a>
        </div>

        <div class="page-header">
            <h1 class="page-title">{config['header_title']}</h1>
            <p class="page-subtitle">{config['header_subtitle']}</p>
        </div>

        <div class="page-controls">
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-number" id="totalCount">0</span>
                    <span> Total Resources</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="documentCount">0</span>
                    <span> Official Documents</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="articleCount">0</span>
                    <span> Articles</span>
                </div>
            </div>

            <div class="sort-controls">
                <span class="sort-label">Sort by:</span>
                <button class="sort-btn active" data-sort="newest">Newest</button>
                <button class="sort-btn" data-sort="oldest">Oldest</button>
                <button class="sort-btn" data-sort="a-z">A-Z</button>
            </div>
        </div>

        <div id="resourcesGrid" class="resource-grid">
            <div class="loading">Loading resources...</div>
        </div>
    </main>

    <footer id="dcf-footer"></footer>

    <script>
        let allResources = [];
        let currentSort = 'newest';

        async function loadResources() {{
            try {{
                const {{ data: vaticanDocs, error: docError }} = await window.dcfSupabase
                    .from('resources')
                    .select('id, title, description, tags, page_url, created_at')
                    .contains('tags', ['{config['tag_slug']}'])
                    .in('status', ['published', 'approved'])
                    .order('created_at', {{ ascending: false }});

                if (docError) throw docError;

                const {{ data: blogPosts, error: blogError }} = await window.dcfSupabase
                    .from('blog_posts')
                    .select('id, title, excerpt, slug, created_at, featured_image_url, blog_post_tags!inner(blog_tags!inner(slug))')
                    .eq('status', 'published')
                    .eq('blog_post_tags.blog_tags.slug', '{config['tag_slug']}')
                    .order('created_at', {{ ascending: false }});

                if (blogError) throw blogError;

                const formattedVatican = (vaticanDocs || []).map(doc => ({{
                    id: doc.id, title: doc.title, description: doc.description,
                    tags: doc.tags || [], url: doc.page_url, type: 'document', created_at: doc.created_at
                }}));

                const formattedBlogs = (blogPosts || []).map(post => ({{
                    id: post.id, title: post.title, description: post.excerpt,
                    tags: ['{config['tag_slug']}'], url: `{config['blog_url_prefix']}${{post.slug}}.html`,
                    type: 'article', created_at: post.created_at
                }}));

                allResources = [...formattedVatican, ...formattedBlogs];
                document.getElementById('totalCount').textContent = allResources.length;
                document.getElementById('documentCount').textContent = formattedVatican.length;
                document.getElementById('articleCount').textContent = formattedBlogs.length;
                sortAndRender();
            }} catch (error) {{
                console.error('Error:', error);
                document.getElementById('resourcesGrid').innerHTML = '<div class="empty-state"><h3>Unable to load</h3></div>';
            }}
        }}

        function sortAndRender() {{
            let sorted = [...allResources];
            if(currentSort === 'newest') sorted.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
            else if(currentSort === 'oldest') sorted.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
            else sorted.sort((a,b) => a.title.localeCompare(b.title));
            
            const grid = document.getElementById('resourcesGrid');
            if (sorted.length === 0) {{
                grid.innerHTML = '<div class="empty-state"><h3>No resources found</h3></div>';
                return;
            }}

            grid.innerHTML = sorted.map(resource => {{
                const badgeClass = resource.type === 'document' ? 'badge-document' : 'badge-article';
                const badgeText = resource.type === 'document' ? 'Official Document' : 'Article';
                const date = new Date(resource.created_at).toLocaleDateString('en-US', {{
                    year: 'numeric', month: 'short', day: 'numeric'
                }});

                const tagLabels = {{
                    'ai-ethics-philosophy': 'AI Ethics',
                    'warfare-security': 'Warfare & Security',
                    'governance-policy': 'Governance',
                    'work-economy': 'Work & Economy',
                    'education-formation': 'Education',
                    'social-issues': 'Social Issues',
                    'theological-perspectives': 'Theology',
                    'official-church-documents': 'Church Document',
                    'catholic': 'Catholic'
                }};

                const displayTags = resource.tags
                    .slice(0, 4)
                    .map(tag => tagLabels[tag] || tag.replace(/-/g, ' '))
                    .map(label => `<span class="tag">${{label}}</span>`)
                    .join('');

                return `
                    <div class="resource-card" onclick="window.location.href='${{resource.url}}'">
                        <span class="resource-type-badge ${{badgeClass}}">${{badgeText}}</span>
                        <h3 class="resource-title">${{resource.title}}</h3>
                        <p class="resource-description">${{resource.description || ''}}</p>
                        <div class="resource-tags">${{displayTags}}</div>
                        <div class="resource-date">${{date}}</div>
                    </div>
                `;
            }}).join('');
        }}

        document.querySelectorAll('.sort-btn').forEach(btn => {{
            btn.addEventListener('click', function() {{
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentSort = this.dataset.sort;
                sortAndRender();
            }});
        }});

        document.addEventListener('DOMContentLoaded', () => {{
            setTimeout(loadResources, 1000);
        }});
    </script>
</body>
</html>"""

    return html


if __name__ == '__main__':
    # Example usage
    config = {
        'filename': 'ai-ethics-philosophy.html',
        'page_title': 'AI Ethics & Philosophy',
        'meta_description': 'Explore foundational questions about artificial intelligence, machine learning, and technology through the lens of Catholic Social Teaching and philosophical inquiry.',
        'breadcrumb_text': 'Back to Library',
        'breadcrumb_url': 'dcf_ai_resources.html',
        'header_title': 'AI Ethics & Philosophy',
        'header_subtitle': 'Explore foundational questions about artificial intelligence, machine learning, and technology through the lens of Catholic Social Teaching and philosophical inquiry.',
        'tag_slug': 'ai-ethics-philosophy',
        'blog_url_prefix': '../blog/ai-ethics/'
    }
    
    
    html = build_page(config)
    
    with open(f'public/{config["filename"]}', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ Created: public/{config['filename']}")
    print("⚠️  REMEMBER: Add this page to LAUNCH_PAGES in js/dcf-ui.js")

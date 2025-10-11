#!/usr/bin/env python3
"""
Generate SEO-optimized static HTML files for blog posts
Uses the EXACT styling from blog/post.html
"""

import os
import sys
from datetime import datetime
from supabase import create_client, Client

SUPABASE_URL = "https://atzommnkkwzgbktuzjti.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks"

BASE_URL = "https://hoarhouse.github.io/dcfh"

def slugify_blog_name(blog_slug):
    if not blog_slug:
        return "uncategorized"
    return blog_slug.replace('_', '-')

def generate_blog_post_html(post, blog_name, blog_slug):
    post_id = post['id']
    title = post['title']
    slug = post['slug']
    content = post['content'] or ""
    excerpt = post['excerpt'] or ""
    meta_description = excerpt[:160] if excerpt else title[:160]
    published_date = post['published_at'][:10] if post['published_at'] else datetime.now().strftime('%Y-%m-%d')
    featured_image = post.get('hero_image_url') or post.get('featured_image_url')
    
    try:
        date_obj = datetime.strptime(published_date, '%Y-%m-%d')
        display_date = date_obj.strftime('%B %d, %Y')
    except:
        display_date = published_date
    
    keywords = ", ".join([w.lower() for w in title.split()[:8] if len(w) > 3])
    blog_folder = slugify_blog_name(blog_slug)
    
    # Featured media HTML
    featured_media_html = ""
    if featured_image:
        featured_media_html = f'''
        <div class="post-featured-media">
            <img src="{featured_image}" alt="{title}">
        </div>'''
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>{title} | {blog_name or "DCF Hungary"}</title>
    <meta name="description" content="{meta_description}">
    <meta name="keywords" content="{keywords}, AI ethics, technology ethics, catholic social teaching">
    <meta name="author" content="Domus Communis Foundation Hungary">
    
    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="{BASE_URL}/blog/{blog_folder}/{slug}.html">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{meta_description}">
    {f'<meta property="og:image" content="{featured_image}">' if featured_image else ''}
    <meta property="og:site_name" content="DCF Hungary">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{meta_description}">
    {f'<meta name="twitter:image" content="{featured_image}">' if featured_image else ''}
    
    <!-- Canonical -->
    <link rel="canonical" href="{BASE_URL}/blog/{blog_folder}/{slug}.html">
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {{{{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{title}",
        "description": "{meta_description}",
        {f'"image": "{featured_image}",' if featured_image else ''}
        "datePublished": "{published_date}",
        "author": {{{{
            "@type": "Organization",
            "name": "Domus Communis Foundation Hungary"
        }}}},
        "publisher": {{{{
            "@type": "Organization",
            "name": "DCF Hungary"
        }}}}
    }}}}
    </script>
    
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <style>
        * {{{{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}}}

        body {{{{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
            color: #333;
            line-height: 1.6;
        }}}}

        .header {{{{
            background: white;
            border-bottom: 1px solid #e5e5e5;
            padding: 1rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }}}}

        .nav-container {{{{
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }}}}

        .nav-menu {{{{
            display: flex;
            list-style: none;
            gap: 2rem;
        }}}}

        .nav-menu a {{{{
            text-decoration: none;
            color: #666;
            font-size: 0.9rem;
            transition: color 0.3s;
        }}}}

        .nav-menu a:hover {{{{
            color: #333;
        }}}}

        .user-menu {{{{
            display: flex;
            align-items: center;
            gap: 1rem;
        }}}}

        .user-avatar {{{{
            width: 48px;
            height: 48px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            color: #666;
            font-weight: 600;
        }}}}

        .breadcrumb {{{{
            background: white;
            padding: 1rem 0;
            border-bottom: 1px solid #f0f0f0;
        }}}}

        .breadcrumb-container {{{{
            max-width: 900px;
            margin: 0 auto;
            padding: 0 2rem;
            font-size: 0.9rem;
            color: #666;
        }}}}

        .breadcrumb a {{{{
            color: #333;
            text-decoration: none;
        }}}}

        .breadcrumb a:hover {{{{
            text-decoration: underline;
        }}}}

        .main-container {{{{
            max-width: 900px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }}}}

        .post-header {{{{
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            margin-bottom: 2rem;
        }}}}

        .post-featured-media {{{{
            width: 100%;
            max-height: 500px;
            overflow: hidden;
        }}}}

        .post-featured-media img {{{{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }}}}

        .post-header-content {{{{
            padding: 3rem;
        }}}}

        .post-meta {{{{
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            color: #666;
        }}}}

        .post-title {{{{
            font-size: 3rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 1rem;
            line-height: 1.2;
        }}}}

        .post-excerpt {{{{
            font-size: 1.25rem;
            color: #666;
            line-height: 1.5;
            font-style: italic;
        }}}}

        .post-content {{{{
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            padding: 3rem;
            margin-bottom: 2rem;
        }}}}

        .post-body {{{{
            font-size: 1.125rem;
            line-height: 1.8;
            color: #333;
        }}}}

        .post-body h2 {{{{
            font-size: 1.75rem;
            font-weight: 600;
            color: #333;
            margin: 1.75rem 0 1rem;
        }}}}

        .post-body h3 {{{{
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin: 1.5rem 0 1rem;
        }}}}

        .post-body p {{{{
            margin-bottom: 1rem;
        }}}}

        .post-body ul,
        .post-body ol {{{{
            margin-bottom: 1.25rem;
            padding-left: 2rem;
        }}}}

        .post-body li {{{{
            margin-bottom: 0.5rem;
        }}}}

        .post-body blockquote {{{{
            border-left: 4px solid #333;
            padding-left: 2rem;
            margin: 2rem 0;
            font-style: italic;
            color: #555;
            font-size: 1.2rem;
        }}}}

        .post-body a {{{{
            color: #333;
            text-decoration: underline;
            text-decoration-thickness: 2px;
        }}}}

        .post-footer {{{{
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            padding: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}}}

        .post-stats {{{{
            display: flex;
            gap: 2rem;
            color: #666;
            font-size: 0.9rem;
        }}}}

        .back-to-blog {{{{
            background: #333;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }}}}

        .back-to-blog:hover {{{{
            background: #000;
        }}}}

        @media (max-width: 768px) {{{{
            .nav-menu {{{{
                display: none;
            }}}}
            
            .post-title {{{{
                font-size: 2rem;
            }}}}
            
            .post-header-content,
            .post-content {{{{
                padding: 2rem;
            }}}}
        }}}}
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav-container">
            <a href="../../index.html" class="logo"></a>
            <ul class="nav-menu" id="navMenu"></ul>
            <div class="user-menu">
                <div class="user-dropdown">
                    <div class="user-avatar" id="userAvatar"></div>
                </div>
            </div>
        </nav>
    </header>

    <div class="breadcrumb">
        <div class="breadcrumb-container">
            <a href="../../index.html">Home</a> <span>/</span>
            <a href="../../blog/{blog_folder}/">{blog_name or "Blog"}</a> <span>/</span>
            <span>{title}</span>
        </div>
    </div>

    <main class="main-container">
        <article class="post-header">
            {featured_media_html}
            <div class="post-header-content">
                <div class="post-meta">
                    <span>📅 {display_date}</span>
                    <span>📚 {blog_name or "Blog"}</span>
                </div>
                <h1 class="post-title">{title}</h1>
                {f'<p class="post-excerpt">{excerpt}</p>' if excerpt else ''}
            </div>
        </article>

        <div class="post-content">
            <div class="post-body">
                {content}
            </div>
        </div>

        <div class="post-footer">
            <div class="post-stats">
                <span id="viewCount">-- views</span>
            </div>
            <a href="../../blog/{blog_folder}/" class="back-to-blog">← Back to {blog_name or "Blog"}</a>
        </div>
    </main>

    <script src="../../js/dcf-core.js"></script>
    <script src="../../js/dcf-ui.js"></script>
    <script src="../../js/dcf-auth.js"></script>
    <script src="../../js/dcf-analytics.js"></script>
    <script src="../../js/dcf-init.js"></script>

    <script>
        const postId = '{post_id}';
        
        async function trackView() {{{{
            if (!window.dcfSupabase) return;
            try {{{{
                await window.dcfSupabase.rpc('increment_blog_view', {{{{ blog_id: postId }}}});
            }}}} catch (err) {{{{
                console.warn('View tracking error:', err);
            }}}}
        }}}}
        
        async function loadStats() {{{{
            let attempts = 0;
            while (!window.dcfSupabase && attempts < 50) {{{{
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }}}}
            
            if (!window.dcfSupabase) return;
            
            try {{{{
                const {{{{ data }}}} = await window.dcfSupabase
                    .from('blog_posts')
                    .select('view_count')
                    .eq('id', postId)
                    .single();
                
                if (data) {{{{
                    document.getElementById('viewCount').textContent = `${{{{data.view_count || 0}}}} views`;
                }}}}
            }}}} catch (err) {{{{
                console.warn('Stats error:', err);
            }}}}
        }}}}
        
        document.addEventListener('DOMContentLoaded', () => {{{{
            trackView();
            setTimeout(loadStats, 1000);
        }}}});
    </script>
</body>
</html>'''
    
    return html

def main():
    print("🚀 Generating blog posts with CORRECT styling...")
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        response = supabase.table('blog_posts').select('*, blogs(name, slug)').eq('status', 'published').execute()
        posts = response.data
        
        print(f"✅ Found {len(posts)} posts")
        
        blogs_dict = {}
        for post in posts:
            blog_info = post.get('blogs')
            blog_slug = blog_info.get('slug', 'uncategorized') if blog_info else 'uncategorized'
            blog_name = blog_info.get('name', 'Blog') if blog_info else 'Uncategorized'
            
            if blog_slug not in blogs_dict:
                blogs_dict[blog_slug] = {'name': blog_name, 'posts': []}
            blogs_dict[blog_slug]['posts'].append(post)
        
        total = 0
        for blog_slug, blog_data in blogs_dict.items():
            folder = os.path.join('blog', slugify_blog_name(blog_slug))
            os.makedirs(folder, exist_ok=True)
            
            for post in blog_data['posts']:
                try:
                    html = generate_blog_post_html(post, blog_data['name'], blog_slug)
                    filepath = os.path.join(folder, f"{post['slug']}.html")
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(html)
                    
                    print(f"✅ {post['slug']}.html")
                    total += 1
                except Exception as e:
                    print(f"❌ {post.get('slug')}: {e}")
        
        print(f"\n🎉 Generated {total} files!")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

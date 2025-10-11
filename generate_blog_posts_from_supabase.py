#!/usr/bin/env python3
"""
Generate SEO-optimized HTML files for all blog posts from Supabase
Organizes posts by blog into separate folders
Matches Vatican resource page structure exactly
"""

import os
import sys
from datetime import datetime
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://atzommnkkwzgbktuzjti.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks"

BASE_URL = "https://hoarhouse.github.io/dcfh"

def slugify_blog_name(blog_slug):
    """Convert blog slug to folder name"""
    if not blog_slug:
        return "uncategorized"
    return blog_slug.replace('_', '-')

def generate_blog_post_html(post, blog_name, blog_slug):
    """Generate complete HTML for a single blog post"""
    
    post_id = post['id']
    title = post['title']
    slug = post['slug']
    content = post['content'] or ""
    excerpt = post['excerpt'] or ""
    meta_description = excerpt[:160] if excerpt else title[:160]
    published_date = post['published_at'][:10] if post['published_at'] else datetime.now().strftime('%Y-%m-%d')
    featured_image = post.get('hero_image_url') or post.get('featured_image_url') or f"{BASE_URL}/images/default-blog.jpg"
    
    try:
        date_obj = datetime.strptime(published_date, '%Y-%m-%d')
        display_date = date_obj.strftime('%B %d, %Y')
    except:
        display_date = published_date
    
    keywords = ", ".join([w.lower() for w in title.split()[:8] if len(w) > 3])
    blog_folder = slugify_blog_name(blog_slug)
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>{title} | {blog_name or "DCF Hungary"}</title>
    <meta name="description" content="{meta_description}">
    <meta name="keywords" content="{keywords}, vatican ai ethics, artificial intelligence, catholic social teaching, technology ethics">
    <meta name="author" content="Domus Communis Foundation Hungary">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="{BASE_URL}/blog/{blog_folder}/{slug}.html">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{meta_description}">
    <meta property="og:image" content="{featured_image}">
    <meta property="og:site_name" content="DCF Hungary">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{meta_description}">
    <meta name="twitter:image" content="{featured_image}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{BASE_URL}/blog/{blog_folder}/{slug}.html">
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {{{{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{title}",
        "description": "{meta_description}",
        "image": "{featured_image}",
        "datePublished": "{published_date}",
        "dateModified": "{published_date}",
        "author": {{{{
            "@type": "Organization",
            "name": "Domus Communis Foundation Hungary"
        }}}},
        "publisher": {{{{
            "@type": "Organization",
            "name": "DCF Hungary",
            "logo": {{{{
                "@type": "ImageObject",
                "url": "{BASE_URL}/images/dcf-logo.png"
            }}}}
        }}}},
        "mainEntityOfPage": {{{{
            "@type": "WebPage",
            "@id": "{BASE_URL}/blog/{blog_folder}/{slug}.html"
        }}}}
    }}}}
    </script>
    
    <!-- Breadcrumb Schema -->
    <script type="application/ld+json">
    {{{{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {{{{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "{BASE_URL}/"
            }}}},
            {{{{
                "@type": "ListItem",
                "position": 2,
                "name": "{blog_name or 'Blog'}",
                "item": "{BASE_URL}/blog/{blog_folder}/"
            }}}},
            {{{{
                "@type": "ListItem",
                "position": 3,
                "name": "{title}",
                "item": "{BASE_URL}/blog/{blog_folder}/{slug}.html"
            }}}}
        ]
    }}}}
    </script>
    
    <!-- Supabase -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <style>
        * {{{{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}}}

        body {{{{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }}}}

        .header {{{{
            background: white;
            border-bottom: 1px solid #e5e5e5;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
        }}}}

        .nav-container {{{{
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }}}}

        .logo {{{{
            display: flex;
            align-items: center;
            font-weight: 600;
            color: #333;
            text-decoration: none;
        }}}}

        .logo-icon {{{{
            width: 24px;
            height: 24px;
            background: #dc3545;
            border-radius: 50%;
            margin-right: 8px;
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
        }}}}

        .nav-menu a:hover {{{{
            color: #333;
        }}}}

        .user-menu {{{{
            display: flex;
            align-items: center;
            gap: 1rem;
        }}}}

        .language-switcher {{{{
            position: relative;
        }}}}

        .user-dropdown {{{{
            position: relative;
        }}}}

        .user-avatar {{{{
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #000, #333);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            cursor: pointer;
        }}}}

        .dropdown-menu {{{{
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 250px;
            padding: 0.5rem 0;
            z-index: 1000;
        }}}}

        .breadcrumb {{{{
            max-width: 1200px;
            margin: 2rem auto 0;
            padding: 0 2rem;
            font-size: 0.9rem;
            color: #666;
        }}}}

        .breadcrumb a {{{{
            color: #666;
            text-decoration: none;
        }}}}

        .breadcrumb a:hover {{{{
            color: #333;
            text-decoration: underline;
        }}}}

        .main-container {{{{
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
        }}}}

        .content-area {{{{
            background: white;
            border-radius: 12px;
            padding: 3rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}}}

        .resource-hero {{{{
            margin-bottom: 2rem;
        }}}}

        .resource-title {{{{
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            color: #000;
        }}}}

        .resource-meta {{{{
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 2rem;
        }}}}

        .meta-badge {{{{
            background: #f8f9fa;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            color: #666;
            border: 1px solid #e5e5e5;
        }}}}

        .stats-container {{{{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
        }}}}

        .stat-item {{{{
            text-align: center;
        }}}}

        .stat-number {{{{
            font-size: 1.8rem;
            font-weight: 700;
            color: #333;
            display: block;
            margin-bottom: 0.25rem;
        }}}}

        .stat-label {{{{
            font-size: 0.85rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}}}

        .featured-image {{{{
            width: 100%;
            max-height: 500px;
            object-fit: cover;
            border-radius: 12px;
            margin: 2rem 0;
        }}}}

        .resource-description {{{{
            font-size: 1.1rem;
            line-height: 1.8;
            color: #333;
        }}}}

        .resource-description p {{{{
            margin-bottom: 1.5rem;
        }}}}

        .resource-description h2 {{{{
            font-size: 1.8rem;
            font-weight: 700;
            margin: 2.5rem 0 1rem;
            color: #000;
        }}}}

        .resource-description h3 {{{{
            font-size: 1.4rem;
            font-weight: 600;
            margin: 2rem 0 1rem;
            color: #000;
        }}}}

        .resource-description strong {{{{
            font-weight: 600;
            color: #000;
        }}}}

        .resource-description a {{{{
            color: #dc3545;
            text-decoration: none;
            border-bottom: 1px solid #dc3545;
        }}}}

        .resource-description a:hover {{{{
            color: #c82333;
            border-bottom-color: #c82333;
        }}}}

        .resource-description ul,
        .resource-description ol {{{{
            margin: 1.5rem 0 1.5rem 2rem;
        }}}}

        .resource-description li {{{{
            margin-bottom: 0.75rem;
        }}}}

        .resource-description blockquote {{{{
            border-left: 4px solid #dc3545;
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            color: #555;
        }}}}

        .share-section {{{{
            margin: 3rem 0;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 12px;
        }}}}

        .share-title {{{{
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #333;
        }}}}

        .share-buttons {{{{
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }}}}

        .share-btn {{{{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: white;
            border: 2px solid #e5e5e5;
            border-radius: 8px;
            color: #666;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }}}}

        .share-btn:hover {{{{
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}}}

        .share-btn.twitter:hover {{{{
            border-color: #1DA1F2;
            color: #1DA1F2;
        }}}}

        .share-btn.linkedin:hover {{{{
            border-color: #0077B5;
            color: #0077B5;
        }}}}

        .share-btn.facebook:hover {{{{
            border-color: #1877F2;
            color: #1877F2;
        }}}}

        .share-btn.email:hover {{{{
            border-color: #666;
            color: #666;
        }}}}

        @media (max-width: 768px) {{{{
            .content-area {{{{
                padding: 2rem 1.5rem;
            }}}}

            .resource-title {{{{
                font-size: 2rem;
            }}}}

            .stats-container {{{{
                grid-template-columns: repeat(2, 1fr);
            }}}}

            .nav-menu {{{{
                display: none;
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
                <div class="language-switcher"></div>
                <div class="user-dropdown">
                    <div class="user-avatar" onclick="toggleUserMenu()" id="userAvatar"></div>
                    <div class="dropdown-menu" id="userDropdown">
                        <div class="dropdown-header">
                            <div class="dropdown-avatar"></div>
                            <div class="dropdown-info">
                                <div class="dropdown-name" id="dropdownUserName"></div>
                                <div class="dropdown-email" id="dropdownUserEmail"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <div class="breadcrumb">
        <a href="../../index.html">Home</a> / 
        <a href="../../blog/{blog_folder}/">{"Blog" if not blog_name else blog_name}</a> / 
        <span>{title}</span>
    </div>

    <main class="main-container">
        <div class="content-area">
            <div class="resource-hero">
                <h1 class="resource-title">{title}</h1>
                
                <div class="resource-meta">
                    <span class="meta-badge">📝 Article</span>
                    <span class="meta-badge">📅 {display_date}</span>
                    {"<span class='meta-badge'>📚 " + blog_name + "</span>" if blog_name else ""}
                </div>
            </div>

            <div class="stats-container">
                <div class="stat-item">
                    <span class="stat-number" id="viewCount">--</span>
                    <span class="stat-label">Views</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">0</span>
                    <span class="stat-label">Bookmarks</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">5.0★</span>
                    <span class="stat-label">Rating</span>
                </div>
            </div>

            {f'<img src="{featured_image}" alt="{title}" class="featured-image">' if featured_image and featured_image != f"{BASE_URL}/images/default-blog.jpg" else ''}

            <div class="resource-description">
                {content}
            </div>

            <div class="share-section">
                <h3 class="share-title">Share this article</h3>
                <div class="share-buttons">
                    <a href="https://twitter.com/intent/tweet?url={BASE_URL}/blog/{blog_folder}/{slug}.html&text={title.replace(' ', '%20')}" 
                       target="_blank" class="share-btn twitter">
                        𝕏 Twitter
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url={BASE_URL}/blog/{blog_folder}/{slug}.html" 
                       target="_blank" class="share-btn linkedin">
                        in LinkedIn
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u={BASE_URL}/blog/{blog_folder}/{slug}.html" 
                       target="_blank" class="share-btn facebook">
                        f Facebook
                    </a>
                    <a href="mailto:?subject={title.replace(' ', '%20')}&body=Check%20out%20this%20article:%20{BASE_URL}/blog/{blog_folder}/{slug}.html" 
                       class="share-btn email">
                        ✉ Email
                    </a>
                </div>
            </div>
        </div>
    </main>

    <script src="../../js/dcf-core.js"></script>
    <script src="../../js/dcf-ui.js"></script>
    <script src="../../js/dcf-auth.js"></script>
    <script src="../../js/dcf-analytics.js"></script>
    <script src="../../js/dcf-init.js"></script>

    <script>
        const postId = '{post_id}';
        
        async function trackBlogView() {{{{
            if (!window.dcfSupabase) {{{{
                console.error('❌ Supabase client not available');
                return;
            }}}}
            
            try {{{{
                const {{{{ error }}}} = await window.dcfSupabase.rpc('increment_blog_view', {{{{
                    blog_id: postId
                }}}});
                
                if (error) {{{{
                    console.error('❌ Error tracking view:', error);
                }}}} else {{{{
                    console.log('✅ Blog view tracked');
                }}}}
                
                if (window.dcfAnalytics?.trackPageView) {{{{
                    window.dcfAnalytics.trackPageView('blog-post');
                }}}}
            }}}} catch (err) {{{{
                console.warn('View tracking error:', err);
            }}}}
        }}}}
        
        async function loadLiveStats() {{{{
            let attempts = 0;
            while (!window.dcfSupabase && attempts < 50) {{{{
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }}}}
            
            if (!window.dcfSupabase) {{{{
                console.warn('Supabase not available for stats');
                return;
            }}}}
            
            try {{{{
                const {{{{ data, error }}}} = await window.dcfSupabase.from('blog_posts')
                    .select('view_count')
                    .eq('id', postId)
                    .single();
                
                if (error) throw error;
                
                const viewCountEl = document.getElementById('viewCount');
                if (viewCountEl) {{{{
                    viewCountEl.textContent = data.view_count || 0;
                }}}}
                
                console.log('✅ Live stats loaded:', data);
            }}}} catch (err) {{{{
                console.warn('Failed to load stats:', err);
            }}}}
        }}}}
        
        document.addEventListener('DOMContentLoaded', function() {{{{
            trackBlogView();
            setTimeout(loadLiveStats, 1000);
        }}}});
    </script>
</body>
</html>'''
    
    return html

def main():
    """Main execution function"""
    print("🚀 Starting blog post HTML generation...")
    
    try:
        print(f"📡 Connecting to Supabase...")
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Connected to Supabase")
        
        print("📥 Fetching blog posts...")
        response = supabase.table('blog_posts').select(
            '*, blogs(name, slug)'
        ).eq('status', 'published').execute()
        
        posts = response.data
        print(f"✅ Found {len(posts)} published blog posts")
        
        if not posts:
            print("⚠️  No published posts found")
            return
        
        blogs_dict = {}
        for post in posts:
            blog_info = post.get('blogs')
            if blog_info:
                blog_slug = blog_info.get('slug', 'uncategorized')
                blog_name = blog_info.get('name', 'Blog')
            else:
                blog_slug = 'uncategorized'
                blog_name = 'Uncategorized'
            
            if blog_slug not in blogs_dict:
                blogs_dict[blog_slug] = {
                    'name': blog_name,
                    'posts': []
                }
            blogs_dict[blog_slug]['posts'].append(post)
        
        print(f"\n📊 Found {len(blogs_dict)} blogs:")
        for blog_slug, blog_data in blogs_dict.items():
            print(f"   • {blog_data['name']}: {len(blog_data['posts'])} posts")
        
        total_generated = 0
        
        for blog_slug, blog_data in blogs_dict.items():
            blog_folder = slugify_blog_name(blog_slug)
            blog_name = blog_data['name']
            
            folder_path = os.path.join('blog', blog_folder)
            os.makedirs(folder_path, exist_ok=True)
            print(f"\n📁 Created/verified folder: {folder_path}")
            
            for post in blog_data['posts']:
                try:
                    html_content = generate_blog_post_html(post, blog_name, blog_slug)
                    
                    filename = f"{post['slug']}.html"
                    filepath = os.path.join(folder_path, filename)
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(html_content)
                    
                    print(f"   ✅ Generated: {filename}")
                    total_generated += 1
                    
                except Exception as e:
                    print(f"   ❌ Error generating {post.get('slug', 'unknown')}: {str(e)}")
                    continue
        
        print(f"\n🎉 SUCCESS! Generated {total_generated} blog post HTML files")
        print(f"📂 Files organized in /blog/ folder by blog name")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()

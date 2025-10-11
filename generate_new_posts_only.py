#!/usr/bin/env python3
import os
from supabase import create_client, Client
from pathlib import Path

# Supabase configuration
SUPABASE_URL = "https://atzommnkkwzgbktuzjti.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def post_has_static_file(blog_slug, post_slug):
    """Check if static HTML file exists for this post"""
    file_path = Path(f"blog/{blog_slug}/{post_slug}.html")
    return file_path.exists()

def generate_static_html(post, blog):
    """Generate static HTML file for a post"""
    blog_slug = blog['slug']
    post_slug = post['slug']
    
    # Create directory if it doesn't exist
    blog_dir = Path(f"blog/{blog_slug}")
    blog_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate HTML content
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{post['title']} - {blog['name']} - DCF Hungary</title>
    <meta name="description" content="{post.get('excerpt', '')}">
    <meta property="og:title" content="{post['title']}">
    <meta property="og:description" content="{post.get('excerpt', '')}">
    <meta property="og:image" content="{post.get('featured_image_url', '')}">
    <meta property="og:type" content="article">
    <link rel="stylesheet" href="../../css/blog-post.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../js/dcf-core.js"></script>
    <script src="../../js/dcf-ui.js"></script>
</head>
<body>
    <header class="header">
        <nav class="nav-container" id="dcf-nav">
            <a href="../../index.html" class="logo">
                <div class="logo-icon"></div>
                <span class="logo-text">Domus Communis Foundation Hungary</span>
            </a>
            <ul class="nav-menu" id="navMenu"></ul>
            <div class="user-menu" id="userMenu"></div>
        </nav>
    </header>

    <nav class="breadcrumb">
        <div class="breadcrumb-container">
            <a href="../../index.html">Home</a>
            <span>›</span>
            <a href="../index.html">Blog</a>
            <span>›</span>
            <a href="../category.html?blog={blog_slug}">{blog['name']}</a>
            <span>›</span>
            <span>{post['title']}</span>
        </div>
    </nav>

    <main class="main-container">
        <article>
            <div class="post-header">
                {"<div class='post-featured-media'><img src='" + post.get('featured_image_url', '') + "' alt='" + post['title'] + "'></div>" if post.get('featured_image_url') else ''}
                <div class="post-header-content">
                    <div class="post-meta">
                        <span>{post.get('published_at', post['created_at'])[:10]}</span>
                        <span>{blog['name']}</span>
                        <span id="viewCount">{post.get('view_count', 0)} views</span>
                    </div>
                    <h1 class="post-title">{post['title']}</h1>
                    {"<div class='post-excerpt'>" + post.get('excerpt', '') + "</div>" if post.get('excerpt') else ''}
                </div>
            </div>

            <div class="post-content">
                <div class="post-body">
                    {post['content']}
                </div>
            </div>

            <div class="post-footer">
                <div class="post-stats">
                    <span>Views: <strong id="footerViewCount">{post.get('view_count', 0)}</strong></span>
                    <span>Published: <strong>{post.get('published_at', post['created_at'])[:10]}</strong></span>
                </div>
                <a href="../category.html?blog={blog_slug}" class="back-to-blog">← Back to Blog</a>
            </div>
        </article>
    </main>

    <script>
        const postId = '{post['id']}';
        
        async function trackView() {{
            if (!window.dcfSupabase) return;
            try {{
                const {{ data: currentPost }} = await window.dcfSupabase
                    .from('blog_posts')
                    .select('view_count')
                    .eq('id', postId)
                    .single();
                
                const newViewCount = (currentPost?.view_count || 0) + 1;
                
                await window.dcfSupabase
                    .from('blog_posts')
                    .update({{ view_count: newViewCount }})
                    .eq('id', postId);
                
                console.log('✅ View tracked');
            }} catch (err) {{
                console.warn('View tracking error:', err);
            }}
        }}

        async function loadStats() {{
            let attempts = 0;
            while (!window.dcfSupabase && attempts < 50) {{
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }}
            
            if (!window.dcfSupabase) return;
            
            try {{
                const {{ data }} = await window.dcfSupabase
                    .from('blog_posts')
                    .select('view_count')
                    .eq('id', postId)
                    .single();
                
                if (data) {{
                    document.getElementById('viewCount').textContent = `${{data.view_count || 0}} views`;
                    document.getElementById('footerViewCount').textContent = data.view_count || 0;
                }}
            }} catch (err) {{
                console.warn('Stats error:', err);
            }}
        }}

        document.addEventListener('DOMContentLoaded', () => {{
            trackView();
            setTimeout(loadStats, 1000);
        }});
    </script>
</body>
</html>"""
    
    # Write the file
    file_path = blog_dir / f"{post_slug}.html"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return file_path

def main():
    print("🔍 Checking for new blog posts without static HTML files...")
    
    # Get all published posts
    response = supabase.table('blog_posts').select('*, blogs(*)').eq('status', 'published').execute()
    posts = response.data
    
    if not posts:
        print("❌ No published posts found")
        return
    
    new_posts_generated = 0
    skipped_no_blog = 0
    
    for post in posts:
        blog = post.get('blogs')
        
        # Skip if post has no associated blog
        if not blog:
            print(f"⚠️  Skipping (no blog): {post.get('title', 'Unknown')}")
            skipped_no_blog += 1
            continue
            
        blog_slug = blog['slug']
        post_slug = post['slug']
        
        # Check if static file exists
        if post_has_static_file(blog_slug, post_slug):
            print(f"⏭️  Skipping (already exists): {blog_slug}/{post_slug}")
            continue
        
        # Generate static HTML
        print(f"✨ Generating: {blog_slug}/{post_slug}.html")
        file_path = generate_static_html(post, blog)
        print(f"   ✅ Created: {file_path}")
        new_posts_generated += 1
    
    if new_posts_generated > 0:
        print(f"\n🎉 Generated {new_posts_generated} new static HTML file(s)")
        if skipped_no_blog > 0:
            print(f"⚠️  Skipped {skipped_no_blog} post(s) with no blog assignment")
        print("\n📝 Next steps:")
        print("   cd ~/Desktop/dcfh")
        print("   git add blog/")
        print(f"   git commit -m 'Add {new_posts_generated} new blog post(s)'")
        print("   git push origin main")
    else:
        print("\n✅ All posts already have static HTML files!")
        if skipped_no_blog > 0:
            print(f"⚠️  Note: {skipped_no_blog} post(s) have no blog assignment")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
FINAL blog post generator with share buttons and proper tracking
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
    
    featured_media_html = ""
    if featured_image:
        featured_media_html = f'''
        <div class="post-featured-media">
            <img src="{featured_image}" alt="{title}">
        </div>'''
    
    # Share sidebar HTML
    share_sidebar_html = '''
    <!-- Social Share Sidebar -->
    <div class="share-sidebar" id="shareSidebar">
        <a href="#" class="share-btn share-twitter" title="Share on Twitter">
            <svg viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        </a>
        <a href="#" class="share-btn share-facebook" title="Share on Facebook">
            <svg viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        </a>
        <a href="#" class="share-btn share-linkedin" title="Share on LinkedIn">
            <svg viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        </a>
        <a href="#" class="share-btn share-reddit" title="Share on Reddit">
            <svg viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
        </a>
        <a href="#" class="share-btn share-whatsapp" title="Share on WhatsApp">
            <svg viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
        </a>
        <a href="#" class="share-btn share-email" title="Share via Email">
            <svg viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
        </a>
        <a href="#" class="share-btn share-copy" title="Copy Link">
            <svg viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
        </a>
    </div>'''
    
    # JavaScript for tracking and sharing - kept separate to avoid f-string issues
    tracking_and_share_script = f'''<script>
        const postId = '{post_id}';
        
        async function trackView() ''' + '''{
            if (!window.dcfSupabase) return;
            try {
                // Get current view count
                const { data: currentPost } = await window.dcfSupabase
                    .from('blog_posts')
                    .select('view_count')
                    .eq('id', postId)
                    .single();
                
                const newViewCount = (currentPost?.view_count || 0) + 1;
                
                // Update view count
                await window.dcfSupabase
                    .from('blog_posts')
                    .update({ view_count: newViewCount })
                    .eq('id', postId);
                console.log('✅ View tracked');
            } catch (err) {
                console.warn('View tracking error:', err);
            }
        }
        
        async function loadStats() {
            let attempts = 0;
            while (!window.dcfSupabase && attempts < 50) {
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }
            
            if (!window.dcfSupabase) return;
            
            try {
                const { data } = await window.dcfSupabase
                    .from('blog_posts')
                    .select('view_count')
                    .eq('id', postId)
                    .single();
                
                if (data) {
                    document.getElementById('viewCount').textContent = `${data.view_count || 0} views`;
                }
            } catch (err) {
                console.warn('Stats error:', err);
            }
        }
        
        // Share functions
        function shareTwitter(url, text) {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
        }

        function shareFacebook(url) {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
        }

        function shareLinkedIn(url, title) {
            const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
            window.open(linkedInUrl, '_blank', 'width=600,height=400');
        }

        function shareReddit(url, title) {
            const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
            window.open(redditUrl, '_blank', 'width=600,height=400');
        }

        function shareWhatsApp(url, text) {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            window.open(whatsappUrl, '_blank');
        }

        function shareEmail(title, url) {
            const subject = encodeURIComponent(`Check out: ${title}`);
            const body = encodeURIComponent(`I thought you might find this interesting:\\n\\n${title}\\n\\n${url}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }

        function copyLink(url) {
            navigator.clipboard.writeText(url).then(() => {
                showCopySuccess();
            }).catch(err => {
                const textArea = document.createElement('textarea');
                textArea.value = url;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showCopySuccess();
                } catch (e) {}
                document.body.removeChild(textArea);
            });
        }

        function showCopySuccess() {
            const existing = document.querySelector('.copy-success');
            if (existing) existing.remove();
            
            const message = document.createElement('div');
            message.className = 'copy-success';
            message.textContent = 'Link copied!';
            message.style.cssText = 'position:fixed;top:20px;right:20px;background:#28a745;color:white;padding:1rem 1.5rem;border-radius:8px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:slideIn 0.3s ease';
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 3000);
        }
        
        function setupShareButtons() {
            const shareButtons = document.querySelectorAll('.share-btn');
            shareButtons.forEach(btn => {
                btn.addEventListener('click', handleShare);
            });
        }

        function handleShare(e) {
            e.preventDefault();
            const btn = e.currentTarget;
            const platform = Array.from(btn.classList).find(c => 
                ['share-twitter', 'share-facebook', 'share-linkedin', 'share-reddit', 'share-whatsapp', 'share-email', 'share-copy'].includes(c)
            )?.replace('share-', '');
            
            const url = window.location.href;
            const title = document.querySelector('h1').textContent;
            const text = `Check out: ${title}`;
            
            switch(platform) {
                case 'twitter': shareTwitter(url, text); break;
                case 'facebook': shareFacebook(url); break;
                case 'linkedin': shareLinkedIn(url, title); break;
                case 'reddit': shareReddit(url, title); break;
                case 'whatsapp': shareWhatsApp(url, text); break;
                case 'email': shareEmail(title, url); break;
                case 'copy': copyLink(url); break;
            }
        }
        
        // Show sidebar on scroll
        let scrollTimer;
        window.addEventListener('scroll', () => {
            const sidebar = document.getElementById('shareSidebar');
            if (sidebar) {
                clearTimeout(scrollTimer);
                if (window.scrollY > 200) {
                    sidebar.classList.add('visible');
                } else {
                    sidebar.classList.remove('visible');
                }
            }
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            trackView();
            setTimeout(loadStats, 1000);
            setupShareButtons();
        });
    </script>'''
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>{title} | {blog_name or "DCF Hungary"}</title>
    <meta name="description" content="{meta_description}">
    <meta name="keywords" content="{keywords}, AI ethics, technology ethics, catholic social teaching">
    <meta name="author" content="Domus Communis Foundation Hungary">
    
    <meta property="og:type" content="article">
    <meta property="og:url" content="{BASE_URL}/blog/{blog_folder}/{slug}.html">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{meta_description}">
    {f'<meta property="og:image" content="{featured_image}">' if featured_image else ''}
    <meta property="og:site_name" content="DCF Hungary">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{meta_description}">
    {f'<meta name="twitter:image" content="{featured_image}">' if featured_image else ''}
    
    <link rel="canonical" href="{BASE_URL}/blog/{blog_folder}/{slug}.html">
    
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{title}",
        "description": "{meta_description}",
        {f'"image": "{featured_image}",' if featured_image else ''}
        "datePublished": "{published_date}",
        "author": {{
            "@type": "Organization",
            "name": "Domus Communis Foundation Hungary"
        }},
        "publisher": {{
            "@type": "Organization",
            "name": "DCF Hungary"
        }}
    }}
    </script>
    
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
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

        .user-menu {{
            display: flex;
            align-items: center;
            gap: 1rem;
        }}

        .user-avatar {{
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
        }}

        .breadcrumb {{
            background: white;
            padding: 1rem 0;
            border-bottom: 1px solid #f0f0f0;
        }}

        .breadcrumb-container {{
            max-width: 900px;
            margin: 0 auto;
            padding: 0 2rem;
            font-size: 0.9rem;
            color: #666;
        }}

        .breadcrumb a {{
            color: #333;
            text-decoration: none;
        }}

        .breadcrumb a:hover {{
            text-decoration: underline;
        }}

        .main-container {{
            max-width: 900px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }}

        .post-header {{
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            margin-bottom: 2rem;
        }}

        .post-featured-media {{
            width: 100%;
            max-height: 500px;
            overflow: hidden;
        }}

        .post-featured-media img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }}

        .post-header-content {{
            padding: 3rem;
        }}

        .post-meta {{
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            color: #666;
        }}

        .post-title {{
            font-size: 3rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 1rem;
            line-height: 1.2;
        }}

        .post-excerpt {{
            font-size: 1.25rem;
            color: #666;
            line-height: 1.5;
            font-style: italic;
        }}

        .post-content {{
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            padding: 3rem;
            margin-bottom: 2rem;
        }}

        .post-body {{
            font-size: 1.125rem;
            line-height: 1.8;
            color: #333;
        }}

        .post-body h2 {{
            font-size: 1.75rem;
            font-weight: 600;
            color: #333;
            margin: 1.75rem 0 1rem;
        }}

        .post-body h3 {{
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin: 1.5rem 0 1rem;
        }}

        .post-body p {{
            margin-bottom: 1rem;
        }}

        .post-body ul, .post-body ol {{
            margin-bottom: 1.25rem;
            padding-left: 2rem;
        }}

        .post-body li {{
            margin-bottom: 0.5rem;
        }}

        .post-body blockquote {{
            border-left: 4px solid #333;
            padding-left: 2rem;
            margin: 2rem 0;
            font-style: italic;
            color: #555;
            font-size: 1.2rem;
        }}

        .post-body a {{
            color: #333;
            text-decoration: underline;
            text-decoration-thickness: 2px;
        }}

        .post-footer {{
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            padding: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .post-stats {{
            display: flex;
            gap: 2rem;
            color: #666;
            font-size: 0.9rem;
        }}

        .back-to-blog {{
            background: #333;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }}

        .back-to-blog:hover {{
            background: #000;
        }}

        /* Share Sidebar */
        .share-sidebar {{
            position: fixed;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 1000;
            background: white;
            padding: 12px;
            border-radius: 50px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            opacity: 0;
            transition: opacity 0.3s ease;
        }}

        .share-sidebar.visible {{
            opacity: 1;
        }}

        .share-sidebar .share-btn {{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #666;
            text-decoration: none;
        }}

        .share-sidebar .share-btn:hover {{
            transform: scale(1.1);
        }}

        .share-sidebar .share-btn svg {{
            width: 22px;
            height: 22px;
            fill: currentColor;
        }}

        .share-sidebar .share-twitter:hover {{ background: #1DA1F2; color: white; }}
        .share-sidebar .share-facebook:hover {{ background: #1877F2; color: white; }}
        .share-sidebar .share-linkedin:hover {{ background: #0A66C2; color: white; }}
        .share-sidebar .share-reddit:hover {{ background: #FF4500; color: white; }}
        .share-sidebar .share-whatsapp:hover {{ background: #25D366; color: white; }}
        .share-sidebar .share-email:hover {{ background: #EA4335; color: white; }}
        .share-sidebar .share-copy:hover {{ background: #333; color: white; }}

        @media (max-width: 1200px) {{
            .share-sidebar {{
                display: none;
            }}
        }}

        @media (max-width: 768px) {{
            .nav-menu {{
                display: none;
            }}
            
            .post-title {{
                font-size: 2rem;
            }}
            
            .post-header-content, .post-content {{
                padding: 2rem;
            }}
        }}
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
            <a href="../">{blog_name or "Blog"}</a> <span>/</span>
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
            <a href="../" class="back-to-blog">← Back to {blog_name or "Blog"}</a>
        </div>
    </main>

    {share_sidebar_html}

    <script src="../../js/dcf-core.js"></script>
    <script src="../../js/dcf-ui.js"></script>
    <script src="../../js/dcf-auth.js"></script>
    <script src="../../js/dcf-analytics.js"></script>
    <script src="../../js/dcf-init.js"></script>

    {tracking_and_share_script}
</body>
</html>'''
    
    return html

def main():
    print("🚀 Generating blog posts with share buttons...")
    
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
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
        
        print(f"\n🎉 Generated {total} files with share buttons!")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

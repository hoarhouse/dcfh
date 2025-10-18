
        async function updateSectionCounts() {
            if (!window.dcfSupabase) return;
            
            try {
                // 1. TOTAL COUNT
                const { count: totalResources } = await window.dcfSupabase
                    .from('resources')
                    .select('*', { count: 'exact', head: true })
                    .in('status', ['published', 'approved']);
                
                const { count: totalBlogs } = await window.dcfSupabase
                    .from('blog_posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'published');
                
                const grandTotal = (totalResources || 0) + (totalBlogs || 0);
                if (document.getElementById('totalResourceCount')) {
                    document.getElementById('totalResourceCount').textContent = grandTotal;
                }
                
                // 2. AI ETHICS & PHILOSOPHY
                const { count: aiEthicsRes } = await window.dcfSupabase.from('resources').select('*', { count: 'exact', head: true }).contains('tags', ['ai-ethics-philosophy']).in('status', ['published', 'approved']);
                const { count: aiEthicsBlog } = await window.dcfSupabase.from('blog_posts').select('*, blog_post_tags!inner(blog_tags!inner(slug))', { count: 'exact', head: true }).eq('status', 'published').eq('blog_post_tags.blog_tags.slug', 'ai-ethics-philosophy');
                const aiEthicsCount = (aiEthicsRes || 0) + (aiEthicsBlog || 0);
                
                // 3. POPE FRANCIS (text search)
                const { count: francisRes } = await window.dcfSupabase.from('resources').select('*', { count: 'exact', head: true }).or('title.ilike.%pope francis%,title.ilike.%holy father%,title.ilike.%g7%,title.ilike.%world day of peace 2024%').in('status', ['published', 'approved']);
                const { count: francisBlog } = await window.dcfSupabase.from('blog_posts').select('*, blog_post_tags!inner(blog_tags!inner(slug))', { count: 'exact', head: true }).eq('status', 'published').eq('blog_post_tags.blog_tags.slug', 'pope-francis');
                const francisCount = (francisRes || 0) + (francisBlog || 0);
                
                // 4. POPE LEO
                const { count: leoRes } = await window.dcfSupabase.from('resources').select('*', { count: 'exact', head: true }).contains('tags', ['pope-leo']).in('status', ['published', 'approved']);
                const { count: leoBlog } = await window.dcfSupabase.from('blog_posts').select('*, blog_post_tags!inner(blog_tags!inner(slug))', { count: 'exact', head: true }).eq('status', 'published').eq('blog_post_tags.blog_tags.slug', 'pope-leo');
                const leoCount = (leoRes || 0) + (leoBlog || 0);
                
                // 5. WARFARE & SECURITY
                const { count: warfareRes } = await window.dcfSupabase.from('resources').select('*', { count: 'exact', head: true }).contains('tags', ['warfare-security']).in('status', ['published', 'approved']);
                const { count: warfareBlog } = await window.dcfSupabase.from('blog_posts').select('*, blog_post_tags!inner(blog_tags!inner(slug))', { count: 'exact', head: true }).eq('status', 'published').eq('blog_post_tags.blog_tags.slug', 'warfare-security');
                const warfareCount = (warfareRes || 0) + (warfareBlog || 0);
                
                // 6. WORK & ECONOMY
                const { count: workRes } = await window.dcfSupabase.from('resources').select('*', { count: 'exact', head: true }).contains('tags', ['work-economy']).in('status', ['published', 'approved']);
                const { count: workBlog } = await window.dcfSupabase.from('blog_posts').select('*, blog_post_tags!inner(blog_tags!inner(slug))', { count: 'exact', head: true }).eq('status', 'published').eq('blog_post_tags.blog_tags.slug', 'work-economy');
                const workCount = (workRes || 0) + (workBlog || 0);
                
                // 7. KEY VATICAN DOCUMENTS
                const { count: vaticanRes } = await window.dcfSupabase.from('resources').select('*', { count: 'exact', head: true }).contains('tags', ['official-church-documents']).in('status', ['published', 'approved']);
                const { count: vaticanBlog } = await window.dcfSupabase.from('blog_posts').select('*, blog_post_tags!inner(blog_tags!inner(slug))', { count: 'exact', head: true }).eq('status', 'published').eq('blog_post_tags.blog_tags.slug', 'vatican-documents');
                const vaticanCount = (vaticanRes || 0) + (vaticanBlog || 0);
                
                // 8. FEATURED ARTICLES (blogs only)
                const { count: featuredCount } = await window.dcfSupabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
                
                // UPDATE ALL LINKS
                document.querySelectorAll('a[href="ai-ethics-philosophy.html"]').forEach(link => { if (link.textContent.includes('View All')) link.textContent = `View All (${aiEthicsCount}) →`; });
                document.querySelectorAll('a[href="pope-francis-technology.html"]').forEach(link => { if (link.textContent.includes('View All')) link.textContent = `View All (${francisCount}) →`; });
                document.querySelectorAll('a[href="pope-leo-technology.html"]').forEach(link => { if (link.textContent.includes('View All')) link.textContent = `View All (${leoCount}) →`; });
                document.querySelectorAll('a[href="warfare-security.html"]').forEach(link => { if (link.textContent.includes('View All')) link.textContent = `View All (${warfareCount}) →`; });
                document.querySelectorAll('a[href="work-economy.html"]').forEach(link => { if (link.textContent.includes('View All')) link.textContent = `View All (${workCount}) →`; });
                document.querySelectorAll('a[href="key-vatican-documents.html"]').forEach(link => { if (link.textContent.includes('View All')) link.textContent = `View All (${vaticanCount}) →`; });
                document.querySelectorAll('a[href="dcf_articles_library.html"]').forEach(link => { if (link.textContent.includes('View All')) link.textContent = `View All (${featuredCount}) →`; });
                
                console.log('✅ ALL COUNTS:', {total: grandTotal, aiEthics: aiEthicsCount, francis: francisCount, leo: leoCount, warfare: warfareCount, work: workCount, vatican: vaticanCount, featured: featuredCount});
            } catch (err) {
                console.error('❌ Count error:', err);
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => setTimeout(updateSectionCounts, 2000));

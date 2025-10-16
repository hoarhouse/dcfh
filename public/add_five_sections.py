with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Find where to insert - after the "Start Here" section
insert_point = content.find('<!-- Key Vatican Documents -->')

new_sections = '''
        <!-- AI Ethics & Philosophy Section -->
        <section class="section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">AI Ethics & Philosophy</h2>
                    <p class="section-subtitle">Foundational thinking on artificial intelligence and human dignity</p>
                </div>
                <a href="ai-ethics-philosophy.html" class="view-all-link">View All (31) →</a>
            </div>
            <div class="resource-grid" id="aiEthicsGrid">
                <div style="text-align: center; padding: 2rem; color: #666;">Loading...</div>
            </div>
        </section>

        <!-- Pope Francis on AI Section -->
        <section class="section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Pope Francis on AI & Technology</h2>
                    <p class="section-subtitle">The complete vision from Pope Francis on ethical technology</p>
                </div>
                <a href="pope-francis-technology.html" class="view-all-link">View All (7) →</a>
            </div>
            <div class="resource-grid" id="popeFrancisGrid">
                <div style="text-align: center; padding: 2rem; color: #666;">Loading...</div>
            </div>
        </section>

        <!-- Pope Leo XIV Section -->
        <section class="section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Pope Leo XIV: Faith & Technology in a New Era</h2>
                    <p class="section-subtitle">The new papacy's emerging vision for AI and human flourishing</p>
                </div>
                <a href="pope-leo-technology.html" class="view-all-link">View All →</a>
            </div>
            <div class="resource-grid" id="popeLeoGrid">
                <div style="text-align: center; padding: 2rem; color: #666;">Loading...</div>
            </div>
        </section>

        <!-- Warfare, Security & Disarmament Section -->
        <section class="section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Warfare, Security & Disarmament</h2>
                    <p class="section-subtitle">AI weapons, nuclear ethics, and the pursuit of peace</p>
                </div>
                <a href="warfare-security.html" class="view-all-link">View All (12) →</a>
            </div>
            <div class="resource-grid" id="warfareSecurityGrid">
                <div style="text-align: center; padding: 2rem; color: #666;">Loading...</div>
            </div>
        </section>

        <!-- Work, Economy & Human Dignity Section -->
        <section class="section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Work, Economy & Human Dignity</h2>
                    <p class="section-subtitle">AI's impact on employment and economic justice</p>
                </div>
                <a href="work-economy.html" class="view-all-link">View All (6) →</a>
            </div>
            <div class="resource-grid" id="workEconomyGrid">
                <div style="text-align: center; padding: 2rem; color: #666;">Loading...</div>
            </div>
        </section>

'''

content = content[:insert_point] + new_sections + content[insert_point:]

# Now add JavaScript to load these sections
script_insert = content.rfind('</script>')

load_script = '''

        // Load curated sections
        async function loadCuratedSections() {
            try {
                // 1. AI Ethics & Philosophy (3 resources)
                const { data: aiEthics } = await window.dcfSupabase
                    .from('resources')
                    .select('*')
                    .contains('tags', ['ai-ethics-philosophy'])
                    .in('status', ['published', 'approved'])
                    .order('created_at', { ascending: false })
                    .limit(3);
                
                renderSection(aiEthics, 'aiEthicsGrid');

                // 2. Pope Francis (3 resources)
                const { data: popeFrancis } = await window.dcfSupabase
                    .from('resources')
                    .select('*')
                    .or('title.ilike.%pope francis%,title.ilike.%holy father%,title.ilike.%g7%,title.ilike.%world day of peace 2024%')
                    .in('status', ['published', 'approved'])
                    .order('created_at', { ascending: false })
                    .limit(3);
                
                renderSection(popeFrancis, 'popeFrancisGrid');

                // 3. Pope Leo (show what we have)
                const { data: popeLeo } = await window.dcfSupabase
                    .from('resources')
                    .select('*')
                    .or('title.ilike.%pope leo%,title.ilike.%antiqua%')
                    .in('status', ['published', 'approved'])
                    .limit(3);
                
                if (popeLeo && popeLeo.length > 0) {
                    renderSection(popeLeo, 'popeLeoGrid');
                } else {
                    document.getElementById('popeLeoGrid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">Coming soon as Pope Leo XIV addresses technology and AI</div>';
                }

                // 4. Warfare & Security (3 resources)
                const { data: warfare } = await window.dcfSupabase
                    .from('resources')
                    .select('*')
                    .contains('tags', ['warfare-security'])
                    .in('status', ['published', 'approved'])
                    .order('created_at', { ascending: false })
                    .limit(3);
                
                renderSection(warfare, 'warfareSecurityGrid');

                // 5. Work & Economy (3 resources)
                const { data: workEconomy } = await window.dcfSupabase
                    .from('resources')
                    .select('*')
                    .contains('tags', ['work-economy'])
                    .in('status', ['published', 'approved'])
                    .order('created_at', { ascending: false })
                    .limit(3);
                
                renderSection(workEconomy, 'workEconomyGrid');

            } catch (error) {
                console.error('Error loading curated sections:', error);
            }
        }

        function renderSection(resources, gridId) {
            const grid = document.getElementById(gridId);
            if (!resources || resources.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">No resources available</div>';
                return;
            }

            grid.innerHTML = resources.map(resource => `
                <div class="resource-card-no-image" onclick="window.location.href='${resource.page_url}'">
                    <div class="resource-meta">
                        <span class="meta-badge authority">Vatican Document</span>
                    </div>
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description || resource.excerpt || ''}</p>
                </div>
            `).join('');
        }

        // Call on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadCuratedSections();
        });
'''

content = content[:script_insert] + load_script + content[script_insert:]

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Added 5 curated sections to library page")

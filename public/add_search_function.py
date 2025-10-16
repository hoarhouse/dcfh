with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Find where to insert the search functions - right before closing </script>
script_close = content.rfind('</script>')

search_functions = '''

        async function searchByTags(tagSlugs) {
            try {
                console.log('Fetching resources with tags:', tagSlugs);
                
                const { data, error } = await window.dcfSupabase
                    .from('resources')
                    .select('*')
                    .overlaps('tags', tagSlugs)
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                console.log(`Found ${data.length} resources`);
                displaySearchResults(data);
                
            } catch (error) {
                console.error('Search error:', error);
                alert('Search failed. Please try again.');
            }
        }
        
        function displaySearchResults(resources) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            
            let resultsSection = document.getElementById('searchResultsSection');
            if (!resultsSection) {
                resultsSection = document.createElement('section');
                resultsSection.id = 'searchResultsSection';
                resultsSection.className = 'section';
                document.querySelector('.main-container').insertBefore(
                    resultsSection, 
                    document.querySelector('.section')
                );
            }
            
            resultsSection.style.display = 'block';
            
            if (resources.length === 0) {
                resultsSection.innerHTML = `
                    <div class="section-header">
                        <h2 class="section-title">Search Results</h2>
                        <button onclick="clearSearch()" style="padding: 0.5rem 1rem; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer;">Clear Search</button>
                    </div>
                    <div style="text-align: center; padding: 4rem; color: #666;">No resources found.</div>
                `;
                return;
            }
            
            const resultsHTML = resources.map(resource => `
                <div class="resource-card-no-image" onclick="window.location.href='${resource.page_url || '#'}'" style="cursor: pointer;">
                    <div class="resource-meta">
                        <span class="meta-badge authority">Vatican Document</span>
                    </div>
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description || resource.excerpt || ''}</p>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${(resource.tags || []).slice(0, 4).map(tag => 
                            `<span style="background: #f0f0f0; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem;">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
            `).join('');
            
            resultsSection.innerHTML = `
                <div class="section-header">
                    <div>
                        <h2 class="section-title">Search Results</h2>
                        <p class="section-subtitle">Found ${resources.length} resource${resources.length === 1 ? '' : 's'}</p>
                    </div>
                    <button onclick="clearSearch()" style="padding: 0.5rem 1rem; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer;">Clear Search</button>
                </div>
                <div class="resource-grid">${resultsHTML}</div>
            `;
        }
        
        function clearSearch() {
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'block';
            });
            
            const resultsSection = document.getElementById('searchResultsSection');
            if (resultsSection) resultsSection.style.display = 'none';
            
            document.querySelectorAll('#advancedSearchContent input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
        }
'''

content = content[:script_close] + search_functions + content[script_close:]

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Added search functions")

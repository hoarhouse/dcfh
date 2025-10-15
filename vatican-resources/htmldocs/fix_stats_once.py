#!/usr/bin/env python3
import re

with open('antiqua-et-nova-2025.html', 'r') as f:
    content = f.read()

# Find and remove ALL broken script sections
content = re.sub(r'<script>\s*//.*?Resource tracking.*?</script>', '', content, flags=re.DOTALL)

# Insert the working stats code before </body>
working_stats = '''
    <script>
        // Resource tracking with proper timing
        async function trackResourceView() {
            const resourceId = 'f9fd315b-f6a8-4a54-aecf-b11150e19c80';
            
            let attempts = 0;
            while (!window.dcfSupabase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!window.dcfSupabase) return;
            
            try {
                const { error } = await window.dcfSupabase.rpc('increment_resource_view', {
                    resource_id: resourceId
                });
                
                if (error) {
                    console.error('❌ Error tracking view:', error);
                } else {
                    console.log('✅ Resource view tracked');
                }
            } catch (err) {
                console.warn('View tracking error:', err);
            }
        }
        
        async function loadLiveStats() {
            let attempts = 0;
            while (!window.dcfSupabase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!window.dcfSupabase) return;
            
            try {
                const { data, error } = await window.dcfSupabase.from('resources')
                    .select('view_count, download_count, bookmark_count, rating_average')
                    .eq('id', 'f9fd315b-f6a8-4a54-aecf-b11150e19c80')
                    .single();
                
                if (error) throw error;
                
                const statNumbers = document.querySelectorAll('[style*="font-size: 1.5rem"]');
                if (statNumbers[0]) statNumbers[0].textContent = data.view_count || 0;
                if (statNumbers[1]) statNumbers[1].textContent = data.download_count || 0;
                if (statNumbers[2]) statNumbers[2].textContent = data.bookmark_count || 0;
                if (statNumbers[3]) statNumbers[3].textContent = (data.rating_average || 0).toFixed(1) + '★';
                
                console.log('✅ Live stats loaded:', data);
            } catch (err) {
                console.warn('Failed to load stats:', err);
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                trackResourceView();
                loadLiveStats();
            }, 1000);
        });
    </script>
'''

content = content.replace('</body>', working_stats + '\n</body>')

with open('antiqua-et-nova-2025.html', 'w') as f:
    f.write(content)

print("✅ Fixed stats in ONE operation")

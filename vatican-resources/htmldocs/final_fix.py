#!/usr/bin/env python3
with open('antiqua-et-nova-2025.html', 'r') as f:
    lines = f.readlines()

# Find where to insert (before </body>)
insert_pos = None
for i in range(len(lines)-1, -1, -1):
    if '</body>' in lines[i]:
        insert_pos = i
        break

if not insert_pos:
    print("ERROR: Could not find </body>")
    exit(1)

# The EXACT working stats code
stats_code = '''    <script>
        // Resource tracking with proper timing
        async function trackResourceView() {
            const resourceId = 'f9fd315b-f6a8-4a54-aecf-b11150e19c80';
            
            let attempts = 0;
            while (!window.dcfSupabase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!window.dcfSupabase) {
                console.error('❌ Supabase client not available');
                return;
            }
            
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
            
            if (!window.dcfSupabase) {
                console.warn('Supabase not available for stats');
                return;
            }
            
            try {
                const { data, error } = await window.dcfSupabase.from('resources')
                    .select('view_count, download_count, bookmark_count, rating_average')
                    .eq('id', 'f9fd315b-f6a8-4a54-aecf-b11150e19c80')
                    .single();
                
                if (error) throw error;
                
                const statItems = document.querySelectorAll('.stat-item');
                if (statItems[0]) statItems[0].querySelector('.stat-number').textContent = data.view_count || 0;
                if (statItems[1]) statItems[1].querySelector('.stat-number').textContent = data.download_count || 0;
                if (statItems[2]) statItems[2].querySelector('.stat-number').textContent = data.bookmark_count || 0;
                if (statItems[3]) statItems[3].querySelector('.stat-number').textContent = (data.rating_average || 0).toFixed(1) + '★';
                
                console.log('✅ Live stats loaded:', data);
            } catch (err) {
                console.warn('Failed to load stats:', err);
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            trackResourceView();
            setTimeout(loadLiveStats, 1000);
        });
    </script>

'''

# Insert before </body>
lines.insert(insert_pos, stats_code)

with open('antiqua-et-nova-2025.html', 'w') as f:
    f.writelines(lines)

print("✅ Stats code added - FINAL VERSION")

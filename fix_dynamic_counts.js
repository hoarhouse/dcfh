// Add this at the end of dcf_ai_resources.html to make counts dynamic

// Update section counts dynamically
async function updateSectionCounts() {
    if (!window.dcfSupabase) return;
    
    try {
        // Count Pope Leo docs
        const { count: leoCount } = await window.dcfSupabase
            .from('resources')
            .select('*', { count: 'exact', head: true })
            .contains('tags', ['pope-leo'])
            .in('status', ['published', 'approved']);
        
        // Count Pope Francis docs  
        const { count: francisCount } = await window.dcfSupabase
            .from('resources')
            .select('*', { count: 'exact', head: true })
            .contains('tags', ['pope-francis'])
            .in('status', ['published', 'approved']);
        
        // Update the links
        document.querySelectorAll('a[href="pope-leo-technology.html"]').forEach(link => {
            if (link.textContent.includes('View All')) {
                link.textContent = `View All (${leoCount}) →`;
            }
        });
        
        document.querySelectorAll('a[href="pope-francis-technology.html"]').forEach(link => {
            if (link.textContent.includes('View All')) {
                link.textContent = `View All (${francisCount}) →`;
            }
        });
        
        console.log('✅ Updated counts - Leo:', leoCount, 'Francis:', francisCount);
    } catch (err) {
        console.error('Error updating counts:', err);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateSectionCounts, 2000);
});

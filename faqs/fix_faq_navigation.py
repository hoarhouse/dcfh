#!/usr/bin/env python3
"""
Fix FAQ page navigation by adding footer and scripts
Based on working index.html structure
"""

def fix_faq_page(filename):
    """Fix a single FAQ page by adding footer and scripts"""
    
    # Read the file
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already fixed
    if 'dcf-ui.js' in content:
        print(f"✅ {filename} already has scripts - skipping")
        return False
    
    # The footer and scripts to add
    footer_and_scripts = """    </main>

    <!-- Footer will be injected by dcf-ui.js -->
    <footer id="main-footer"></footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../js/dcf-core.js"></script>
    <script src="../js/dcf-ui.js"></script>
    <script src="../js/dcf-auth.js"></script>
    <script src="../js/dcf-analytics.js"></script>
    <script src="../js/dcf-init.js"></script>

    <script>
        // Display view count when page loads
        async function displayViewCount() {
            // Wait for dcfSupabase to be available
            if (!window.dcfSupabase) {
                setTimeout(displayViewCount, 100);
                return;
            }

            try {
                const currentPath = window.location.pathname;
                const normalizedPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
                
                // Construct the expected page URL format
                const pagePath = normalizedPath.includes('/faqs/') 
                    ? normalizedPath.split('/faqs/')[1] 
                    : normalizedPath.split('/').pop();
                
                const expectedUrl = `/dcfh/faqs/${pagePath}`;
                
                // Get view count for this FAQ page
                const { data, error } = await window.dcfSupabase
                    .from('universal_analytics')
                    .select('view_count')
                    .eq('page_url', expectedUrl)
                    .single();
                
                if (error || !data) {
                    console.log('No view data for:', expectedUrl);
                    const viewElement = document.getElementById('viewCount');
                    if (viewElement) viewElement.style.display = 'none';
                    return;
                }
                
                const viewElement = document.getElementById('viewCount');
                if (viewElement) {
                    viewElement.textContent = `${data.view_count.toLocaleString()} views`;
                }
                
            } catch (err) {
                console.log('View count error:', err);
                const viewElement = document.getElementById('viewCount');
                if (viewElement) viewElement.style.display = 'none';
            }
        }

        // Call when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', displayViewCount);
        } else {
            displayViewCount();
        }
    </script>
</body>
</html>"""
    
    # Find where to replace (look for </main> and </body>)
    if '    </main>\n</body>\n</html>' in content:
        # Replace the incorrect ending
        new_content = content.replace('    </main>\n</body>\n</html>', footer_and_scripts)
        
        # Save the fixed file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Fixed {filename}")
        return True
    else:
        print(f"⚠️  {filename} has unexpected structure - manual review needed")
        # Show what we found at the end
        print("   End of file:")
        lines = content.split('\n')
        for line in lines[-5:]:
            print(f"   {line}")
        return False

def main():
    """Main execution"""
    print("="*60)
    print("FAQ NAVIGATION FIX - TEST RUN ON ONE FILE")
    print("="*60)
    
    # Test on one file first
    test_file = 'ai-healthcare-faq.html'
    
    print(f"\nTesting fix on: {test_file}")
    print("-"*40)
    
    success = fix_faq_page(test_file)
    
    if success:
        print("\n✅ Test successful!")
        print("\nTo verify:")
        print("1. Open ai-healthcare-faq.html in browser")
        print("2. Check if navigation appears at top")
        print("3. Check if footer appears at bottom")
        print("\nIf working, we can apply to other broken files:")
        print("  - ai-consciousness-souls-faq.html")
        print("  - dcf_faq_ai_wisdom.html")
    else:
        print("\n⚠️  Fix may need adjustment")

if __name__ == "__main__":
    main()
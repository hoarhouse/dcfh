#!/usr/bin/env python3
"""
Apply the working navigation fix to all remaining FAQ pages
"""

def fix_faq_page(filename):
    """Fix a single FAQ page by adding footer and scripts"""
    
    try:
        # Read the file
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already fixed
        if 'dcf-ui.js' in content and '<footer id="main-footer">' in content:
            return 'already_fixed'
        
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
            
            return 'fixed'
        
        # Try alternative ending patterns
        elif '</main>\n</body>\n</html>' in content:
            new_content = content.replace('</main>\n</body>\n</html>', footer_and_scripts.replace('    </main>', '</main>'))
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return 'fixed'
            
        else:
            return 'needs_manual'
            
    except Exception as e:
        return f'error: {str(e)}'

def main():
    """Main execution"""
    print("="*60)
    print("APPLYING NAVIGATION FIX TO ALL FAQ PAGES")
    print("="*60)
    
    # List of all FAQ files to fix
    faq_files = [
        'ai-bias-fairness-faq.html',
        'ai-companions-relationships-faq.html',
        'ai-consciousness-souls-faq.html',
        'ai-jobs-workplace-faq.html',
        'ai-privacy-surveillance-faq.html',
        'ai-warfare-weapons-faq.html',
        'deepfakes-misinformation-faq.html',
        'catholic-ai-ethics-faq.html',
        'dcf_faq_ai_wisdom.html',
        'vatican-ai-peace-2024-faq.html',
        'vatican-ai-question-of-meaning-faq.html',
        'vatican-ai-wisdom-faq.html',
        'vatican-child-dignity-digital-world-2019-faq.html',
        'vatican-common-good-digital-age-2019-faq.html',
        'vatican-communications-ai-wisdom-2024-faq.html',
        'vatican-g7-ai-address-2024-faq.html',
        'vatican-minerva-dialogues-2023-faq.html',
        'vatican-peace-2022-education-work-faq.html',
        'vatican-rome-call-ai-ethics-faq.html',
        'vatican-un-security-council-ai-2025-faq.html',
        'vatican-wef-ai-message-2025-faq.html'
    ]
    
    # Track results
    results = {
        'fixed': [],
        'already_fixed': [],
        'needs_manual': [],
        'error': []
    }
    
    print(f"\nProcessing {len(faq_files)} FAQ files...")
    print("-"*40)
    
    for i, filename in enumerate(faq_files, 1):
        print(f"{i:2}. {filename:50} ", end='')
        
        result = fix_faq_page(filename)
        
        if result == 'fixed':
            print("✅ Fixed")
            results['fixed'].append(filename)
        elif result == 'already_fixed':
            print("✓ Already has navigation")
            results['already_fixed'].append(filename)
        elif result == 'needs_manual':
            print("⚠️  Needs manual review")
            results['needs_manual'].append(filename)
        else:
            print(f"❌ Error: {result}")
            results['error'].append((filename, result))
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    print(f"\n✅ Successfully Fixed: {len(results['fixed'])} files")
    if results['fixed']:
        for f in results['fixed']:
            print(f"   - {f}")
    
    print(f"\n✓ Already Had Navigation: {len(results['already_fixed'])} files")
    if results['already_fixed']:
        for f in results['already_fixed']:
            print(f"   - {f}")
    
    if results['needs_manual']:
        print(f"\n⚠️  Need Manual Review: {len(results['needs_manual'])} files")
        for f in results['needs_manual']:
            print(f"   - {f}")
    
    if results['error']:
        print(f"\n❌ Errors: {len(results['error'])} files")
        for f, err in results['error']:
            print(f"   - {f}: {err}")
    
    print("\n" + "="*60)
    print(f"TOTAL PROCESSED: {len(faq_files)} files")
    print(f"TOTAL NOW WORKING: {len(results['fixed']) + len(results['already_fixed'])} files")
    print("="*60)

if __name__ == "__main__":
    main()
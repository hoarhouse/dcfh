#!/usr/bin/env python3
import re

with open('js/dcf-core.js', 'r') as f:
    content = f.read()

# Find the initiatives depth logic and add similar logic for blog right after it
old_code = '''    // Check if we're in the initiatives folder or its subfolders
    if (pathname.includes('/initiatives/')) {
        // Count the depth from initiatives folder
        const initiativesIndex = pathParts.indexOf('initiatives');
        if (initiativesIndex !== -1) {
            // Calculate depth: initiatives/file = 1 level, initiatives/subfolder/file = 2 levels
            const depthFromInitiatives = pathParts.length - initiativesIndex - 1;
            
            console.log('DEBUG PATH - In initiatives folder, depth:', depthFromInitiatives);
            
            if (depthFromInitiatives === 1) {
                // We're directly in initiatives folder (e.g., initiatives_home.html)
                console.log('DEBUG PATH - returning: ../');
                return '../';
            } else if (depthFromInitiatives === 2) {
                // We're in a subfolder of initiatives (e.g., peace/initiative_peace.html)
                console.log('DEBUG PATH - returning: ../../');
                return '../../';
            }
        }
    }
    
    // Check if we're in other known folders'''

new_code = '''    // Check if we're in the initiatives folder or its subfolders
    if (pathname.includes('/initiatives/')) {
        // Count the depth from initiatives folder
        const initiativesIndex = pathParts.indexOf('initiatives');
        if (initiativesIndex !== -1) {
            // Calculate depth: initiatives/file = 1 level, initiatives/subfolder/file = 2 levels
            const depthFromInitiatives = pathParts.length - initiativesIndex - 1;
            
            console.log('DEBUG PATH - In initiatives folder, depth:', depthFromInitiatives);
            
            if (depthFromInitiatives === 1) {
                // We're directly in initiatives folder (e.g., initiatives_home.html)
                console.log('DEBUG PATH - returning: ../');
                return '../';
            } else if (depthFromInitiatives === 2) {
                // We're in a subfolder of initiatives (e.g., peace/initiative_peace.html)
                console.log('DEBUG PATH - returning: ../../');
                return '../../';
            }
        }
    }
    
    // Check if we're in the blog folder or its subfolders
    if (pathname.includes('/blog/')) {
        // Count the depth from blog folder
        const blogIndex = pathParts.indexOf('blog');
        if (blogIndex !== -1) {
            // Calculate depth: blog/file = 1 level, blog/subfolder/file = 2 levels
            const depthFromBlog = pathParts.length - blogIndex - 1;
            
            console.log('DEBUG PATH - In blog folder, depth:', depthFromBlog);
            
            if (depthFromBlog === 1) {
                // We're directly in blog folder (e.g., blog/index.html)
                console.log('DEBUG PATH - returning: ../');
                return '../';
            } else if (depthFromBlog === 2) {
                // We're in a blog subfolder (e.g., blog/the-wisdom-brief/article.html)
                console.log('DEBUG PATH - returning: ../../');
                return '../../';
            }
        }
    }
    
    // Check if we're in other known folders'''

content = content.replace(old_code, new_code)

with open('js/dcf-core.js', 'w') as f:
    f.write(content)

print('✅ Fixed blog path depth logic!')

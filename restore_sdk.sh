#!/bin/bash

# List of admin files that need the SDK restored
admin_files=(
    "system-settings.html"
    "user-management.html"
    "icon-management.html"
    "alerts.html"
    "dcf_media_editor.html"
    "dcf_admin_login.html"
    "createblogwiz.html"
    "blogpostsmanage.html"
    "dcf_blog_post_editor.html"
    "blogwiz.html"
    "dcf_manage_blog.html"
    "blogmanage.html"
    "dcf_manage_blog_backup.html"
    "blogwiz_backup.html"
    "icons.html"
    "cms.html"
    "dcf_admin_dashboard.html"
)

for file in "${admin_files[@]}"; do
    filepath="/Users/christopherhoar/Desktop/dcfh/admin/$file"
    if [ -f "$filepath" ]; then
        echo "Processing $file..."
        
        # Check if file already has SDK (shouldn't, but let's be safe)
        if grep -q "cdn.jsdelivr.net/npm/@supabase/supabase-js@2" "$filepath"; then
            echo "  SDK already present in $file, skipping..."
            continue
        fi
        
        # Find where dcf-unified-system.js is loaded and insert SDK before it
        if grep -q "dcf-unified-system.js" "$filepath"; then
            sed -i '' '/<script src="\.\.\/js\/dcf-unified-system\.js"><\/script>/i\
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>' "$filepath"
            echo "  ✓ Added SDK before dcf-unified-system.js"
        else
            echo "  ⚠ No dcf-unified-system.js found in $file"
        fi
    fi
done

echo "SDK restoration complete!"
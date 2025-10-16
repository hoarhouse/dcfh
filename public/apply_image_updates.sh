#!/bin/bash

# 1. Update article-card CSS to add overflow: hidden
sed -i.tmp1 's/\.article-card {/\.article-card {\
            overflow: hidden;/' dcf_articles_library.html

# 2. Add image and content wrapper CSS after article-card:hover
sed -i.tmp2 '/\.article-card:hover {/a\
\
        .article-image {\
            width: 100%;\
            height: 200px;\
            object-fit: cover;\
            background: #f0f0f0;\
        }\
\
        .article-content {\
            padding: 2rem;\
            display: flex;\
            flex-direction: column;\
            flex-grow: 1;\
        }' dcf_articles_library.html

# 3. Update the card HTML structure in renderArticles
sed -i.tmp3 "s|<div class=\"article-card\" onclick=\"window.location.href='\${url}'\">|<div class=\"article-card\" onclick=\"window.location.href='\${url}'\">\\\n                        \${article.featured_image_url ? \`<img src=\"\${article.featured_image_url}\" alt=\"\${article.title}\" class=\"article-image\">\` : ''}\\\n                        <div class=\"article-content\">|g" dcf_articles_library.html

# 4. Close the content wrapper div before closing article-card
sed -i.tmp4 's|</div>$|</div>\
                        </div>|' dcf_articles_library.html

# Clean up temp files
rm -f dcf_articles_library.html.tmp*

echo "✅ Updated article cards with featured images"

# LAUNCH SITE MANIFEST - DCFH
Generated from: https://hoarhouse.github.io/dcfh/index.html

## CRITICAL SHARED DEPENDENCIES

These JavaScript files are used across the entire site and are essential:

### Core JavaScript System (Used by 200+ pages)
- **js/dcf-core.js** - Core functionality
- **js/dcf-ui.js** - UI components and interactions  
- **js/dcf-auth.js** - Authentication system
- **js/dcf-init.js** - Initialization scripts
- **js/dcf-analytics.js** - Analytics tracking

### Specialized JavaScript
- **js/faq-components.js** - FAQ page specific functionality
- **admin/blog-templates-config.js** - Blog template configuration

## STYLESHEETS (3 files total)

### Core CSS
- **css/dcf-card-templates.css** - Card component styles
- **css/blog-post.css** - Blog post styles

## HTML PAGES BY SECTION

### Main Pages (3)
- index.html
- googlec5fda7e4a2520af5.html (Google verification)
- sitemap.xml

### Admin Section (15 pages)
- admin/alerts.html
- admin/blogmanage.html
- admin/blogpostsmanage.html
- admin/blogwiz.html
- admin/cms.html
- admin/createblogwiz.html
- admin/dcf_admin_dashboard.html
- admin/dcf_admin_login.html
- admin/dcf_blog_editor.html
- admin/dcf_blog_post_editor.html
- admin/dcf_manage_blog.html
- admin/dcf_media_editor.html
- admin/manage_resources.html
- admin/system-settings.html
- admin/user-management.html

### Authentication (4 pages)
- auth/dcf_email_confirm.html
- auth/dcf_login_page.html
- auth/dcf_profile_signup.html
- auth/dcf_user_onboarding.html

### Blog Section (46 pages)
- blog/index.html
- blog/all_blog_posts.html
- blog/category.html
- blog/post.html
- blog/news-blog-template-preview.html

#### Blog Categories:
- **ai-weapons-systems/** (1 post)
- **code-to-conscience/** (7 posts)
- **dcf-nuclear-disarmament-blog/** (2 posts)
- **domus-communis-foundation/** (2 posts)
- **ethical-ai-educational-materials/** (3 posts)
- **the-wisdom-brief/** (5 posts)
- **uncategorized/** (2 posts)

### Events (5 pages)
- events/dcf_create_event.html
- events/dcf_event_created.html
- events/dcf_event_details.html
- events/dcf_event_manage.html
- events/dcf_events_calendar.html

### FAQs (23 pages)
- faqs/index.html
- faqs/ai-bias-fairness-faq.html
- faqs/ai-companions-relationships-faq.html
- faqs/ai-consciousness-souls-faq.html
- faqs/ai-healthcare-faq.html
- faqs/ai-jobs-workplace-faq.html
- faqs/ai-privacy-surveillance-faq.html
- faqs/ai-warfare-weapons-faq.html
- faqs/catholic-ai-ethics-faq.html
- faqs/deepfakes-misinformation-faq.html
- faqs/vatican-ai-peace-2024-faq.html
- faqs/vatican-ai-question-of-meaning-faq.html
- faqs/vatican-ai-wisdom-faq.html
- faqs/vatican-child-dignity-digital-world-2019-faq.html
- faqs/vatican-common-good-digital-age-2019-faq.html
- faqs/vatican-communications-ai-wisdom-2024-faq.html
- faqs/vatican-g7-ai-address-2024-faq.html
- faqs/vatican-minerva-dialogues-2023-faq.html
- faqs/vatican-peace-2022-education-work-faq.html
- faqs/vatican-rome-call-ai-ethics-faq.html
- faqs/vatican-un-security-council-ai-2025-faq.html
- faqs/vatican-wef-ai-message-2025-faq.html

### Initiatives (6 pages)
- initiatives/initiatives_home.html
- initiatives/education/initiative_education.html
- initiatives/health/initiative_health.html
- initiatives/peace/initiative_peace.html
- initiatives/peace/nd/ndblog_antal_rome.html
- initiatives/peace/nd/nuclear_disarmament.html
- initiatives/research/initiative_research.html

### Members (11 pages)
- members/dcf_discussion_forums.html
- members/dcf_donate.html
- members/dcf_edit_profile.html
- members/dcf_member_home.html
- members/dcf_member_profile.html
- members/dcf_members_directory.html
- members/dcf_my_connections.html
- members/dcf_notifications.html
- members/dcf_personal_analytics.html
- members/dcf_private_messaging.html
- members/dcf_profile_dashboard.html

### News (1 page)
- news/dcf_news.html

### People (2 pages)
- people/index.html
- people/profile.html

### Projects (6 pages)
- projects/dcf_create_project.html
- projects/dcf_project_created.html
- projects/dcf_project_detail.html
- projects/dcf_project_manage.html
- projects/dcf_projects.html
- projects/dcf_projects_home.html

### Public (22 pages)
- public/dcf_advanced_search.html
- public/dcf_ai_resource_view.html
- public/dcf_ai_resources.html
- public/dcf_articles_library.html
- public/dcf_contact.html
- public/dcf_events_public.html
- public/dcf_feed.html
- public/dcf_impact_report.html
- public/dcf_newsletter.html
- public/dcf_projects_public.html
- public/dcf_resources_public.html
- public/dcf_search_results.html
- public/dcf_sitemap.html
- public/dcf_values.html
- public/ai-ethics-philosophy.html
- public/key-vatican-documents.html
- public/pope-francis-technology.html
- public/pope-leo-technology.html
- public/search-results.html
- public/warfare-security.html
- public/work-economy.html

### Resources (4 pages)
- resources/dcf_resource_detail.html
- resources/dcf_resource_upload.html
- resources/dcf_resources_library.html
- resources/dcf_resources_library_new.html

### Vatican Resources (75 pages)
- 57 main Vatican document pages
- 18 pages in vatican-resources/htmldocs/ subdirectory

### Real Estate Site (7 pages)
- realestatesite/index.html
- realestatesite/about.html
- realestatesite/apply.html
- realestatesite/contact.html
- realestatesite/properties.html
- realestatesite/property-care.html
- realestatesite/section8.html

## IMAGE ASSETS

### Real Estate Images (6 files)
- realestatesite/10201-colfax.jpg
- realestatesite/1433-macon.jpg
- realestatesite/1451-macon.jpg
- realestatesite/1463-macon.jpg
- realestatesite/1592-boston.jpg
- realestatesite/1960-dallas.jpg

### Dynamic Image References
Most images are loaded dynamically from Supabase storage based on:
- User avatars (${currentUser.avatar_url})
- Featured images (${post.featured_image_url})
- Media uploads (${mediaUrls[0]})
- Resource images (${resource.featured_image_url})

## TOTAL FILE COUNT

- **HTML Pages**: 229
- **JavaScript Files**: 5 core + 2 specialized = 7 unique JS files
- **CSS Files**: 2
- **Static Images**: 6
- **Total Static Files Needed**: ~244 files

## DEPLOYMENT NOTES

1. **Path Resolution**: All JavaScript references use relative paths (../) that need to resolve to the /js/ directory
2. **Supabase Integration**: The site heavily depends on Supabase for:
   - Authentication
   - Database queries
   - Image/media storage
3. **Dynamic Content**: Many pages load content dynamically from Supabase
4. **Google Verification**: Includes googlec5fda7e4a2520af5.html for site verification

## CRITICAL DEPENDENCIES

The following files MUST be present for the site to function:
1. All 5 core JavaScript files in /js/ directory
2. Both CSS files in /css/ directory  
3. index.html as the main entry point
4. All HTML pages referenced in navigation menus

## EXCLUDED FROM LAUNCH

The following were filtered out as test/backup files:
- All files with "test", "temp_", "backup", "bak" in the name
- Development utility files (.py, .sh, .sql)
- Configuration files (.json, .md, .txt)
# PUBLIC LAUNCHSITE MANIFEST
## Domus Communis Foundation - Public Pages Only

Generated from: https://hoarhouse.github.io/dcfh/index.html  
Date: November 2024

---

## EXECUTIVE SUMMARY

**Total Public Files Required: 104**
- 98 HTML pages
- 5 JavaScript files
- 1 CSS file
- 0 static images (all images loaded dynamically from Supabase)

---

## CORE DEPENDENCIES (Required on Every Page)

### JavaScript Files (5)
```
js/dcf-core.js       - Core functionality and utilities
js/dcf-ui.js         - UI components and interactions
js/dcf-auth.js       - Authentication system (for public user features)
js/dcf-init.js       - Initialization and setup
js/dcf-analytics.js  - Analytics tracking
```

### CSS Files (1)
```
css/dcf-card-templates.css - Card component styling
```

---

## PUBLIC HTML PAGES BY SECTION

### 🏠 Homepage
- `index.html` - Main landing page

### 📢 Public Information (17 pages)
Main public-facing content pages:
- `public/dcf_ai_resources.html` - AI Resources Hub
- `public/dcf_articles_library.html` - Articles Library
- `public/ai-ethics-philosophy.html` - AI Ethics & Philosophy
- `public/pope-francis-technology.html` - Pope Francis on Technology
- `public/pope-leo-technology.html` - Pope Leo on Technology
- `public/key-vatican-documents.html` - Key Vatican Documents
- `public/warfare-security.html` - Warfare & Security Ethics
- `public/work-economy.html` - Work & Economy
- `public/dcf_values.html` - Our Values
- `public/dcf_contact.html` - Contact Us
- `public/dcf_newsletter.html` - Newsletter Signup
- `public/dcf_sitemap.html` - Site Map
- `public/dcf_events_public.html` - Public Events
- `public/dcf_projects_public.html` - Public Projects
- `public/dcf_resources_public.html` - Public Resources
- `public/dcf_advanced_search.html` - Advanced Search
- `public/dcf_search_results.html` - Search Results

### 📝 Blog (9 pages)
- `blog/index.html` - Blog homepage
- `blog/all_blog_posts.html` - All blog posts listing

**Featured Articles:**
- The Wisdom Brief Series (5 articles)
- Ethical AI Educational Materials (1 article)  
- Domus Communis Foundation Updates (1 article)

### ❓ FAQs (22 pages)
Comprehensive FAQ section covering:
- `faqs/index.html` - FAQ Index

**AI Ethics Topics:**
- AI Bias & Fairness
- AI Consciousness & Souls
- AI in Healthcare
- AI & Jobs/Workplace
- AI Privacy & Surveillance
- AI Warfare & Weapons
- AI Companions & Relationships
- Deepfakes & Misinformation
- Catholic AI Ethics

**Vatican Documents FAQs:**
- Vatican AI Peace 2024
- Vatican AI Wisdom
- Vatican G7 AI Address 2024
- Vatican Rome Call AI Ethics
- Vatican UN Security Council AI 2025
- Vatican WEF AI Message 2025
- And 7 more Vatican document FAQs

### 📚 Vatican Resources (33 pages)
Official Vatican documents and statements:

**Recent AI & Technology Documents (18 in htmldocs/):**
- Antiqua et Nova 2025
- Pope Francis speeches on AI (6 documents)
- Pope Leo XIV addresses on AI (6 documents)
- Benedict XVI on Digital Culture
- Church and Internet documents

**World Day of Peace Messages (15 documents):**
- Covering years 2007-2024
- Focus on peace, technology, and human dignity

### 🎯 Initiatives (6 pages)
- `initiatives/initiatives_home.html` - Initiatives Overview
- `initiatives/education/initiative_education.html` - Education Initiative
- `initiatives/health/initiative_health.html` - Health Initiative
- `initiatives/peace/initiative_peace.html` - Peace Initiative
- `initiatives/peace/nd/nuclear_disarmament.html` - Nuclear Disarmament
- `initiatives/research/initiative_research.html` - Research Initiative

### 👥 People (1 page)
- `people/index.html` - People Directory

### 📅 Events (3 pages)
- `events/dcf_events_calendar.html` - Events Calendar
- `events/dcf_event_details.html` - Event Details (template)
- `events/dcf_event_manage.html` - Event Management (may require auth)

### 🚀 Projects (3 pages)
- `projects/dcf_projects_home.html` - Projects Homepage
- `projects/dcf_project_detail.html` - Project Details (template)
- `projects/dcf_project_manage.html` - Project Management (may require auth)

### 📁 Resources (3 pages)
- `resources/dcf_resources_library.html` - Resources Library
- `resources/dcf_resource_detail.html` - Resource Details (template)
- `resources/dcf_resource_upload.html` - Upload Resources (may require auth)

---

## CONTENT DISTRIBUTION

| Section | Page Count | Percentage |
|---------|------------|------------|
| Vatican Resources | 33 | 33.7% |
| FAQs | 22 | 22.4% |
| Public Info | 17 | 17.3% |
| Blog | 9 | 9.2% |
| Initiatives | 6 | 6.1% |
| Events | 3 | 3.1% |
| Projects | 3 | 3.1% |
| Resources | 3 | 3.1% |
| People | 1 | 1.0% |
| Homepage | 1 | 1.0% |

---

## DEPLOYMENT NOTES

### Critical Requirements
1. All 5 JavaScript files must be present in `/js/` directory
2. CSS file must be in `/css/` directory
3. All paths are relative and must maintain directory structure

### Dynamic Content
- Images are loaded dynamically from Supabase storage
- User authentication handled by Supabase
- Content queries pull from Supabase database

### Authentication Boundaries
The crawler stopped at these authentication gates:
- Member areas (`/members/`)
- Admin sections (`/admin/`)
- Auth pages (`/auth/`)
- Create/Edit functions in events, projects, and resources

### File Organization
```
dcfh/
├── index.html
├── css/
│   └── dcf-card-templates.css
├── js/
│   ├── dcf-core.js
│   ├── dcf-ui.js
│   ├── dcf-auth.js
│   ├── dcf-init.js
│   └── dcf-analytics.js
├── public/ (17 pages)
├── blog/ (9 pages)
├── faqs/ (22 pages)
├── vatican-resources/ (33 pages)
├── initiatives/ (6 pages)
├── people/ (1 page)
├── events/ (3 pages)
├── projects/ (3 pages)
└── resources/ (3 pages)
```

---

## VERIFICATION

To verify completeness:
1. Check all 5 JS files are present
2. Verify CSS file exists
3. Confirm all 98 HTML pages are accessible
4. Test navigation from index.html
5. Ensure Supabase connection is configured

---

*Generated by Public Site Crawler v2.0*
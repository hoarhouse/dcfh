# LAUNCH_MENU WEBSITE MANIFEST
## Based on dcf-ui.js LAUNCH_MENU Configuration

Generated: November 2024  
Source: `/js/dcf-ui.js` LAUNCH_MENU constant

---

## 📊 SUMMARY

**Total Files Required: 32**
- 26 HTML pages (directly referenced in LAUNCH_MENU)
- 5 JavaScript files (core system)
- 1 CSS file
- 0 static images

This is a **minimal launch site** containing only the pages explicitly defined in the LAUNCH_MENU configuration.

---

## 🗂️ MENU STRUCTURE

The LAUNCH_MENU defines this exact navigation:

### 1. **Home**
   - `index.html`

### 2. **Blog** 
   - `blog/index.html` (main blog page)
   - `blog/all_blog_posts.html` (all posts listing)

### 3. **Initiatives** (dropdown)
   - Main: `initiatives/initiatives_home.html`
   - Dropdown items:
     - Peace Initiative → `initiatives/peace/initiative_peace.html`
     - Education Initiative → `initiatives/education/initiative_education.html`
     - Health Initiative → `initiatives/health/initiative_health.html`
     - Research Initiative → `initiatives/research/initiative_research.html`

### 4. **Values** (dropdown)
   - Main: `public/dcf_values.html`
   - Dropdown items:
     - Values → `public/dcf_values.html`
     - Contact → `public/dcf_contact.html`

### 5. **Library** (dropdown)
   - Main: `public/dcf_ai_resources.html`
   - Dropdown items:
     - Library → `public/dcf_ai_resources.html`
     - FAQs → `faqs/index.html`

---

## 📁 COMPLETE FILE LIST

### Core Dependencies (Required on Every Page)

#### JavaScript (5 files)
```
js/dcf-core.js      # Core functionality
js/dcf-ui.js        # UI components & menu system
js/dcf-auth.js      # Authentication
js/dcf-init.js      # Initialization
js/dcf-analytics.js # Analytics tracking
```

#### CSS (1 file)
```
css/dcf-card-templates.css  # Card component styles
```

### HTML Pages by Section

#### Homepage (1)
- `index.html`

#### Blog (2)
- `blog/index.html`
- `blog/all_blog_posts.html`

#### Initiatives (5)
- `initiatives/initiatives_home.html`
- `initiatives/peace/initiative_peace.html`
- `initiatives/education/initiative_education.html`
- `initiatives/health/initiative_health.html`
- `initiatives/research/initiative_research.html`

#### Public Pages (9)
- `public/dcf_values.html`
- `public/dcf_contact.html`
- `public/dcf_ai_resources.html`
- `public/dcf_articles_library.html`
- `public/ai-ethics-philosophy.html`
- `public/pope-francis-technology.html`
- `public/pope-leo-technology.html`
- `public/warfare-security.html`
- `public/work-economy.html`

#### FAQs (5 - sample set)
- `faqs/index.html`
- `faqs/catholic-ai-ethics-faq.html`
- `faqs/vatican-ai-peace-2024-faq.html`
- `faqs/ai-consciousness-souls-faq.html`
- `faqs/vatican-rome-call-ai-ethics-faq.html`

#### Vatican Resources (3 - key documents)
- `vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html`
- `vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html`
- `vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html`

#### People (1)
- `people/index.html`

---

## 🔄 Page Dependencies

All pages share these common dependencies:
- **JavaScript**: All 5 JS files listed above
- **CSS**: `css/dcf-card-templates.css`
- **Images**: Loaded dynamically from Supabase

---

## 📋 Deployment Notes

### What This Package Contains
This is the **minimal viable launch site** containing only:
- Pages directly accessible from the LAUNCH_MENU
- Core JavaScript and CSS required for functionality
- No member/admin areas
- No authentication-gated content

### What's NOT Included
- Full FAQ library (only 5 key FAQs included)
- Complete Vatican Resources (only 3 key documents)
- Member areas (`/members/`)
- Admin sections (`/admin/`)
- Event/Project management pages
- Full blog post archive (individual posts not included)

### Expansion Path
The LAUNCH_PAGES configuration in dcf-ui.js indicates these folders can display the launch menu:
- `blog/` - All blog pages
- `initiatives/` - All initiative pages
- `faqs/` - All FAQ pages  
- `vatican-resources/` - All Vatican documents

To expand the site, simply add more pages from these folders while maintaining the same structure.

---

## ⚙️ Configuration Requirements

### Required Files at Minimum
1. All 5 JavaScript files in `/js/`
2. CSS file in `/css/`
3. The 26 HTML pages listed above

### Supabase Integration
The site requires Supabase configuration for:
- Dynamic content loading
- Image storage
- User authentication (for future expansion)

### Directory Structure
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
├── blog/ (2 pages)
├── initiatives/ (5 pages)
├── public/ (9 pages)
├── faqs/ (5 pages)
├── vatican-resources/ (3 pages)
└── people/ (1 page)
```

---

## ✅ Verification Checklist

- [ ] All 5 core JS files present
- [ ] CSS file in place
- [ ] index.html accessible
- [ ] Blog section loads
- [ ] Initiatives dropdown works
- [ ] Values dropdown works
- [ ] Library dropdown works
- [ ] FAQs page accessible
- [ ] Supabase credentials configured

---

*This manifest represents the absolute minimum files needed for a functional launch site based on the LAUNCH_MENU configuration.*
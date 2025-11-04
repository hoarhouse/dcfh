# INITIATIVES STRUCTURE REPORT
## Current Initiative Pages in DCFH Repository

---

## 📁 FILE STRUCTURE

### Main Directory: `/initiatives/`

```
initiatives/
├── initiatives_home.html          # Main initiatives landing page
├── education/
│   └── initiative_education.html  # Education Initiative page
├── health/
│   └── initiative_health.html     # Health Initiative page
├── peace/
│   ├── initiative_peace.html      # Peace Initiative page
│   └── nd/                        # Nuclear Disarmament subdirectory
│       ├── nuclear_disarmament.html
│       └── ndblog_antal_rome.html
└── research/
    └── initiative_research.html   # Research Initiative page
```

---

## 📍 CURRENT INITIATIVES (7 HTML files total)

### 1. **Main Landing Page**
- **Path:** `initiatives/initiatives_home.html`
- **Purpose:** Hub page for all initiatives

### 2. **Peace Initiative** 
- **Path:** `initiatives/peace/initiative_peace.html`
- **Sub-pages:**
  - `initiatives/peace/nd/nuclear_disarmament.html` - Nuclear Disarmament focus
  - `initiatives/peace/nd/ndblog_antal_rome.html` - Related blog/article

### 3. **Education Initiative**
- **Path:** `initiatives/education/initiative_education.html`
- **Sub-pages:** None currently

### 4. **Health Initiative**
- **Path:** `initiatives/health/initiative_health.html`
- **Sub-pages:** None currently

### 5. **Research Initiative**
- **Path:** `initiatives/research/initiative_research.html`
- **Sub-pages:** None currently

---

## 🗂️ MENU CONFIGURATION (from dcf-ui.js)

### LAUNCH_MENU Definition:
```javascript
{
    id: 'initiatives',
    text: 'Initiatives', 
    href: 'initiatives/initiatives_home.html', 
    dropdown: true,
    items: [
        { id: 'peace', text: 'Peace Initiative', href: 'initiatives/peace/initiative_peace.html' },
        { id: 'education', text: 'Education Initiative', href: 'initiatives/education/initiative_education.html' },
        { id: 'health', text: 'Health Initiative', href: 'initiatives/health/initiative_health.html' },
        { id: 'research', text: 'Research Initiative', href: 'initiatives/research/initiative_research.html' }
    ]
}
```

### Footer Configuration:
- Links to `initiatives/index.html` (note: this file doesn't exist, should be `initiatives_home.html`)

---

## 📄 INITIATIVE PAGE TEMPLATE STRUCTURE

Based on `initiative_peace.html`, each initiative page follows this structure:

### HTML Components:
1. **Header:** Standard DCF navigation header
2. **Breadcrumb:** Home › Initiatives › [Initiative Name]
3. **Hero Section:**
   - Title (e.g., "Peace Through Technology")
   - Subtitle/description paragraph
   - No buttons in hero (hidden via CSS)

4. **Sub-Initiative Cards Section:**
   - Grid of clickable cards for sub-initiatives
   - Each card contains:
     - Icon (using data-icon attribute)
     - Title
     - Description
     - Progress bar with percentage
   - Cards link to deeper content pages

5. **Additional Sections** (vary by initiative):
   - Mission statements
   - Impact statistics
   - Current projects
   - Call to action

### Styling:
- Clean, modern design with gradient accents
- Card-based layout for sub-initiatives
- Progress indicators
- Responsive design
- Color scheme: Purple/blue gradients (#667eea to #764ba2)

---

## ❌ MISSING INITIATIVES

### Not Found (but mentioned in content):
- **Technology Initiative** - Referenced in blog posts but no dedicated page exists
- **Academia Initiative** - Not found in current structure

### Potential Issues:
1. Footer links to non-existent `initiatives/index.html` (should be `initiatives_home.html`)
2. Some initiative pages may need sub-pages like Peace has with Nuclear Disarmament

---

## 🔧 RECOMMENDATIONS

1. **Fix Footer Link:** Change `initiatives/index.html` to `initiatives/home.html` in footer configuration

2. **Consider Adding:**
   - Technology Initiative page (frequently referenced in content)
   - Academia/University partnerships page
   - More sub-pages for Education, Health, and Research initiatives

3. **Standardize Structure:** 
   - Each initiative could have its own subdirectory with sub-pages
   - Create consistent navigation between initiatives

4. **Add Missing Links:**
   - The Autonomous Weapons card in Peace Initiative links to "#" (placeholder)
   - Other initiatives may have similar placeholder links

---

## 📊 SUMMARY

- **Total Initiative Files:** 7 HTML files
- **Main Categories:** 4 (Peace, Education, Health, Research)
- **Sub-initiatives:** Only Peace has developed sub-pages (Nuclear Disarmament)
- **Menu Integration:** Properly configured in LAUNCH_MENU
- **Missing:** Technology and Academia initiatives mentioned but not implemented

---

*File generated from analysis of `/initiatives/` directory structure*
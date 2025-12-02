# E-Group Product Page Build Guide

## Template for Creating New Federated AI Product Pages

This guide provides the complete template and instructions for building new E-Group product pages that maintain consistency with the existing platform design system.

---

## Directory Structure

```
/[PRODUCT_NAME]/
├── index.html              # Main product page
├── demos.html              # Interactive tools hub (optional)
├── mini-app-1.html         # Interactive demonstration tool
├── mini-app-2.html         # Assessment or calculator tool
└── mini-app-3.html         # Visualization or analysis tool
```

---

## Design System Variables

All pages must use these exact CSS variables from the E-Group design system:

```css
:root {
    /* Primary Colors */
    --cyan: #00D4FF;           /* Primary accent for federated products */
    --teal: #00B4D8;           /* Secondary accent */
    --dark-bg: #0A0E1A;        /* Dark gradient start */
    --dark-card: #0F1420;      /* Dark gradient end / card background */
    
    /* Semantic Colors */
    --green: #10a37f;          /* Success, positive metrics */
    --red: #dc2626;            /* Risk, warnings, critical */
    --amber: #ff9500;          /* Warning, medium risk */
    
    /* Text Colors */
    --text-primary: #1d1d1f;   /* Main text (white in dark mode) */
    --text-secondary: #86868b; /* Secondary text */
    
    /* Backgrounds */
    --bg-gray: #f5f5f7;        /* Light section backgrounds */
    --border: #d2d2d7;         /* Border color */
    
    /* Product-Specific Accents (choose one) */
    --blue: #1a73e8;           /* Healthcare products */
    --purple: #9B59B6;         /* Lab/clinical products */
    --orange: #F39C12;         /* Security products */
    --gold: #FFD700;           /* Public sector products */
}
```

---

## Core Components

### 1. Navigation Bar (Fixed)

```html
<nav>
    <div class="nav-content">
        <a href="../index.html" class="logo">← E-Group</a>
        <ul class="nav-links">
            <li><a href="#what-is">What is [PRODUCT]</a></li>
            <li><a href="#problem">Problem</a></li>
            <li><a href="#solution">Solution</a></li>
            <li><a href="#technology">Technology</a></li>
            <li><a href="demos.html" style="color: var(--green); font-weight: 500;">Tools</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </div>
</nav>
```

### 2. Hero Section Template

```html
<section class="hero">
    <div class="hero-content">
        <div class="badge">[CATEGORY BADGE]</div>
        <h1>[PRODUCT NAME]</h1>
        <p class="tagline">[Italic tagline - emotional hook]</p>
        <p class="subtitle">[One-line value proposition]</p>
        <p class="description">
            [2-3 sentence description explaining the product's unique approach and value]
        </p>
        
        <div class="quick-stats">
            <div class="stat-block">
                <span class="stat-number">[METRIC]</span>
                <span class="stat-label">[LABEL]</span>
            </div>
            <!-- Repeat 3-4 times for key metrics -->
        </div>
        
        <div class="hero-cta">
            <a href="#contact" class="cta-button cta-primary">Request Demo</a>
            <a href="#how-it-works" class="cta-button cta-secondary">See How It Works</a>
        </div>
    </div>
</section>
```

### 3. How It Works Section (MANDATORY - Must come immediately after hero)

```html
<section class="how-it-works-section" id="how-it-works">
    <div class="section-content">
        <h2 class="section-title">How [PRODUCT] Works</h2>
        
        <!-- Process Steps (4-5 steps) -->
        <div class="process-steps">
            <div class="step-card">
                <div class="step-number">1</div>
                <h3 class="step-title">[Step Name]</h3>
                <p class="step-description">[Brief description]</p>
            </div>
            <!-- Repeat for each step -->
        </div>

        <!-- SVG Flow Diagram -->
        <div class="flow-diagram">
            <svg class="flow-svg" viewBox="0 0 900 500">
                <!-- Include visual representation of data flow -->
                <!-- Show federated architecture -->
                <!-- Emphasize no data centralization -->
            </svg>
        </div>

        <!-- Key Benefits -->
        <div class="key-benefits">
            <div class="benefit-card">
                <div class="benefit-icon">[emoji or icon]</div>
                <h3 class="benefit-title">[Benefit]</h3>
                <p class="benefit-text">[Description]</p>
            </div>
            <!-- Repeat 3 times -->
        </div>
    </div>
</section>
```

### 4. Problem Section

```html
<section class="problem-section" id="problem">
    <div class="section-content">
        <h2 class="section-title">[Problem Statement Title]</h2>
        <p class="section-intro">[1-2 sentence problem overview]</p>
        
        <div class="problem-grid">
            <div class="problem-card">
                <h3>[Specific Problem]</h3>
                <p>[Detailed explanation of this aspect of the problem]</p>
            </div>
            <!-- Repeat 4 times for different problem aspects -->
        </div>

        <!-- Cost/Impact Table -->
        <div class="cost-table">
            <table>
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Add 5-6 rows of metrics showing problem scale -->
                </tbody>
            </table>
        </div>

        <!-- Highlight Statistic -->
        <div class="highlight-stat">
            <div class="value">[Key Metric]</div>
            <div class="context">[Why this matters]</div>
        </div>
    </div>
</section>
```

### 5. Solution Section

```html
<section class="solution-section" id="solution">
    <div class="section-content">
        <h2 class="section-title">[PRODUCT]: [Solution Tagline]</h2>
        <p class="section-intro">[How product solves the problem]</p>

        <!-- Comparison Table -->
        <div class="comparison-table">
            <table>
                <thead>
                    <tr>
                        <th>Approach</th>
                        <th>Data Location</th>
                        <th>[Key Metric]</th>
                        <th>[Compliance]</th>
                        <th>[Unique Value]</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Compare 3-4 approaches, with your product highlighted -->
                </tbody>
            </table>
        </div>

        <!-- Differentiators -->
        <div class="problem-grid">
            <!-- 4 cards explaining what makes solution unique -->
        </div>
    </div>
</section>
```

### 6. Technology Section

```html
<section class="technology-section" id="technology">
    <div class="section-content">
        <h2 class="section-title">E-Group Products Powering [PRODUCT]</h2>
        
        <div class="tech-grid">
            <div class="tech-card">
                <h4>FedX - Federated Learning Engine</h4>
                <p>[How FedX is used in this product]</p>
            </div>
            <div class="tech-card">
                <h4>MyD Wallet - Identity & Authentication</h4>
                <p>[How MyD provides identity layer]</p>
            </div>
            <div class="tech-card">
                <h4>InnoHealth DataLake - Data Governance</h4>
                <p>[How DataLake manages policies]</p>
            </div>
            <div class="tech-card">
                <h4>IOX - Secure Communication</h4>
                <p>[How IOX enables secure data exchange]</p>
            </div>
            <div class="tech-card">
                <h4>reData.me - Data Sovereignty Controls</h4>
                <p>[How reData.me ensures user control]</p>
            </div>
            <div class="tech-card">
                <h4>[PRODUCT] Agent - Edge Deployment</h4>
                <p>[Product-specific edge component]</p>
            </div>
        </div>
    </div>
</section>
```

### 7. Footer

```html
<footer class="footer">
    <div class="footer-links">
        <a href="../index.html">← Back to E-Group Platform</a>
        <a href="../Argus/index.html">Argus</a>
        <a href="../ALETHEIA/index.html">ALETHEIA</a>
        <a href="../PROMETHEUS/index.html">PROMETHEUS</a>
        <a href="../NEMESIS/index.html">NEMESIS</a>
        <a href="../HealthCompanion/index.html">Health Companion</a>
    </div>
    <p class="footer-text">Part of E-Group European Sovereign Data Infrastructure</p>
    <p class="footer-text">© 2024 E-Group Innovation</p>
</footer>
```

---

## Mini-App Template Structure

### Welcome Screen
- Badge indicating tool type
- Clear headline explaining what the tool does
- Brief description of value
- "Start" button to begin

### Input/Assessment Screen
- Progress bar if multi-step
- Clear form fields or questions
- Input validation
- Back/Next navigation

### Processing/Analysis Screen (if needed)
- Animation or progress indicator
- "Analyzing..." or similar messaging
- Automatic progression when complete

### Results Screen
- Visual score or key metric display
- Detailed findings broken into categories
- Benchmark comparisons
- Clear CTAs to main product demo

### Cross-Links Section
- Links to other mini-apps
- Back to demos hub
- Consistent across all mini-apps

---

## Content Guidelines

### Voice and Tone
- **Lead with value, not technology** - What problem does it solve?
- **Clear over clever** - Avoid jargon, explain simply
- **Urgent but not alarmist** - Show the problem is real and solvable
- **European context** - Reference EU regulations, markets, values

### Messaging Hierarchy
1. **Headline**: Emotional hook or bold claim
2. **Subtitle**: Clear value proposition
3. **Description**: How it works uniquely
4. **Proof**: Metrics, statistics, regulatory alignment
5. **CTA**: Clear next step

### Key Principles
- **Zero data centralization** - Always emphasize federated approach
- **Sovereignty by design** - Users/organizations control their data
- **Network effects** - More participants = better for everyone
- **Regulatory alignment** - GDPR, EHDS, NIS2, CSRD, eIDAS 2.0, etc.

---

## Color Assignment by Sector

- **Healthcare**: Blue (#1a73e8) - Health Companion
- **Clinical/Lab**: Purple (#9B59B6) - LabVault
- **Research**: Green (#10a37f) - ResearchPay
- **Cybersecurity**: Orange (#F39C12) - Argus
- **Credentials**: Cyan (#00D4FF) - ALETHEIA
- **Sustainability**: Teal (#00B4D8) - PROMETHEUS
- **Public Sector**: Gold (#FFD700) - NEMESIS

---

## Responsive Design Requirements

### Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

### Mobile Adaptations
- Navigation collapses to hamburger menu
- Stack cards vertically
- Reduce font sizes proportionally
- Hide decorative elements
- Simplify complex visualizations

---

## Integration Checklist

When adding a new product to the E-Group platform:

### Main Platform (index.html)
- [ ] Add button in hero section with product color
- [ ] Add product card in platform section
- [ ] Update product count (X Products. Y Markets.)
- [ ] Add to technology overview paragraph
- [ ] Add market statistics if new sector
- [ ] Add relevant regulations if applicable
- [ ] Include in footer links

### Product Page Requirements
- [ ] Main index.html with all sections
- [ ] demos.html hub page (if mini-apps exist)
- [ ] 2-3 interactive mini-apps
- [ ] All cross-links working
- [ ] Footer links to other products
- [ ] Consistent use of design system
- [ ] Mobile responsive
- [ ] Clear CTAs throughout

---

## Testing Checklist

- [ ] All internal links work
- [ ] External links open in new tab
- [ ] Forms validate properly
- [ ] Animations perform smoothly
- [ ] Mobile layout doesn't break
- [ ] Color contrast meets accessibility standards
- [ ] Images have alt text
- [ ] JavaScript functionality works without errors
- [ ] Cross-browser compatibility (Chrome, Safari, Firefox, Edge)

---

## File Naming Conventions

- Product folders: PascalCase (e.g., `HealthCompanion`, `PROMETHEUS`)
- HTML files: kebab-case (e.g., `bid-pattern-scanner.html`)
- Main pages: `index.html`, `demos.html`
- Mini-apps: descriptive-tool-name.html

---

## Questions or Updates?

This guide represents the current E-Group product page template as of December 2024. 
For questions or updates, contact the E-Group development team.

---

*End of Build Guide*
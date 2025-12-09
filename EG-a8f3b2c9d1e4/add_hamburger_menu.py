#!/usr/bin/env python3
import os
import re
from pathlib import Path

def get_product_name(filepath):
    """Extract product name from filepath"""
    parts = filepath.split('/')
    for i, part in enumerate(parts):
        if part in ['HealthCompanion', 'ResearchPay', 'LabVault', 'Argus', 
                    'ALETHEIA', 'PROMETHEUS', 'NEMESIS', 'HYPERION', 'ARCHON']:
            return part
    return 'E-Group'

def get_path_prefix(filepath):
    """Determine the path prefix for relative URLs based on file location"""
    # Count how many directories deep we are from EG-a8f3b2c9d1e4
    depth = filepath.count('/EG-a8f3b2c9d1e4/')[0]
    parts = filepath.split('/EG-a8f3b2c9d1e4/')[-1].split('/')
    
    # Remove filename
    parts = parts[:-1]
    
    # Calculate prefix
    if len(parts) == 0:
        return ''
    elif len(parts) == 1:
        return '../'
    else:
        return '../../'

def get_active_product(filepath):
    """Determine which product link should be marked as active"""
    product = get_product_name(filepath)
    if product == 'HealthCompanion':
        return 'Health Companion'
    return product

def create_hamburger_css():
    """Return the CSS for the hamburger menu"""
    return """
        /* Navigation with Hamburger Menu */
        .site-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(10, 14, 26, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .header-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 20px;
            font-weight: 600;
            color: #00D4FF;
            text-decoration: none;
        }

        .hamburger {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            padding: 8px;
            min-width: 44px;
            min-height: 44px;
        }

        .hamburger .close-icon {
            display: none;
        }

        .hamburger.open .hamburger-icon {
            display: none;
        }

        .hamburger.open .close-icon {
            display: inline;
        }

        .main-nav {
            display: flex;
            gap: 24px;
        }

        .main-nav a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s;
        }

        .main-nav a:hover, .main-nav a.active {
            color: #00D4FF;
        }

        @media (max-width: 1024px) {
            .hamburger {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .main-nav {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(15, 20, 32, 0.98);
                flex-direction: column;
                padding: 16px 0;
                gap: 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                animation: slideDown 0.3s ease;
            }
            
            .main-nav.open {
                display: flex;
            }
            
            .main-nav a {
                padding: 16px 24px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            
            .main-nav a:last-child {
                border-bottom: none;
            }
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }"""

def create_hamburger_html(product_name, path_prefix):
    """Create the HTML for the hamburger menu"""
    active_class = ''
    
    # Map product names for active class
    product_map = {
        'HealthCompanion': 'HealthCompanion',
        'ResearchPay': 'ResearchPay',
        'LabVault': 'LabVault', 
        'Argus': 'Argus',
        'ALETHEIA': 'ALETHEIA',
        'PROMETHEUS': 'PROMETHEUS',
        'NEMESIS': 'NEMESIS',
        'HYPERION': 'HYPERION',
        'ARCHON': 'ARCHON'
    }
    
    html = f"""    <!-- Navigation with Hamburger Menu -->
    <header class="site-header">
        <div class="header-container">
            <a href="{path_prefix}index.html" class="logo">← E-Group / {product_name}</a>
            <button class="hamburger" onclick="toggleMenu()" aria-label="Toggle menu">
                <span class="hamburger-icon">☰</span>
                <span class="close-icon">✕</span>
            </button>
            <nav class="main-nav">
                <a href="{path_prefix}HealthCompanion/index.html"{'class="active"' if product_name == 'HealthCompanion' else ''}>Health Companion</a>
                <a href="{path_prefix}ResearchPay/index.html"{'class="active"' if product_name == 'ResearchPay' else ''}>ResearchPay</a>
                <a href="{path_prefix}LabVault/index.html"{'class="active"' if product_name == 'LabVault' else ''}>LabVault</a>
                <a href="{path_prefix}Argus/index.html"{'class="active"' if product_name == 'Argus' else ''}>Argus</a>
                <a href="{path_prefix}ALETHEIA/index.html"{'class="active"' if product_name == 'ALETHEIA' else ''}>ALETHEIA</a>
                <a href="{path_prefix}PROMETHEUS/index.html"{'class="active"' if product_name == 'PROMETHEUS' else ''}>PROMETHEUS</a>
                <a href="{path_prefix}NEMESIS/index.html"{'class="active"' if product_name == 'NEMESIS' else ''}>NEMESIS</a>
                <a href="{path_prefix}HYPERION/index.html"{'class="active"' if product_name == 'HYPERION' else ''}>HYPERION</a>
                <a href="{path_prefix}ARCHON/index.html"{'class="active"' if product_name == 'ARCHON' else ''}>ARCHON</a>
            </nav>
        </div>
    </header>"""
    
    return html

def create_hamburger_js():
    """Return the JavaScript for the hamburger menu"""
    return """
        // Hamburger Menu Toggle
        function toggleMenu() {
            const nav = document.querySelector('.main-nav');
            const hamburger = document.querySelector('.hamburger');
            nav.classList.toggle('open');
            hamburger.classList.toggle('open');
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            const nav = document.querySelector('.main-nav');
            const hamburger = document.querySelector('.hamburger');
            if (!e.target.closest('.site-header') && nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                hamburger.classList.remove('open');
            }
        });

        // Close menu when window resizes above mobile breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                const nav = document.querySelector('.main-nav');
                const hamburger = document.querySelector('.hamburger');
                if (nav && hamburger) {
                    nav.classList.remove('open');
                    hamburger.classList.remove('open');
                }
            }
        });"""

def update_file(filepath):
    """Update a single HTML file with hamburger menu"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has hamburger
        if 'class="hamburger"' in content:
            print(f"  ✓ Already has hamburger menu: {filepath}")
            return True
        
        # Skip main index
        if filepath.endswith('/EG-a8f3b2c9d1e4/index.html'):
            print(f"  ✓ Main index already updated")
            return True
            
        product_name = get_product_name(filepath)
        path_prefix = get_path_prefix(filepath)
        
        # Add/update CSS
        css = create_hamburger_css()
        if '/* Navigation' in content and '</style>' in content:
            # Replace existing nav CSS
            pattern = r'/\*\s*Navigation.*?\*/.*?(?=/\*|</style>)'
            content = re.sub(pattern, css, content, flags=re.DOTALL)
        elif '</style>' in content:
            # Add before closing style tag
            content = content.replace('</style>', css + '\n    </style>')
        elif '<head>' in content:
            # Add style block to head
            style_block = f'    <style>{css}\n    </style>'
            content = content.replace('</head>', style_block + '\n</head>')
        
        # Replace navigation HTML
        nav_html = create_hamburger_html(product_name, path_prefix)
        
        # Find and replace existing nav
        if '<nav' in content or '<header' in content:
            # Replace existing nav/header
            pattern = r'<nav[^>]*>.*?</nav>|<header[^>]*>.*?</header>'
            if re.search(pattern, content, re.DOTALL):
                # Find body tag and insert after
                body_match = re.search(r'<body[^>]*>', content)
                if body_match:
                    # Remove old nav/header
                    content = re.sub(pattern, '', content, flags=re.DOTALL)
                    # Insert new nav after body
                    insert_pos = body_match.end()
                    content = content[:insert_pos] + '\n' + nav_html + content[insert_pos:]
        else:
            # Add after body tag
            content = content.replace('<body>', f'<body>\n{nav_html}')
        
        # Add JavaScript before closing body
        js = create_hamburger_js()
        if 'toggleMenu' not in content:
            if '</script>' in content and '</body>' in content:
                # Add to existing script block
                last_script = content.rfind('</script>')
                content = content[:last_script] + js + '\n    ' + content[last_script:]
            else:
                # Add new script block
                script_block = f'    <script>{js}\n    </script>'
                content = content.replace('</body>', script_block + '\n</body>')
        
        # Update padding-top for fixed header
        content = re.sub(r'padding-top:\s*\d+px', 'padding-top: 70px', content)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ Updated: {filepath}")
        return True
        
    except Exception as e:
        print(f"  ❌ Error updating {filepath}: {e}")
        return False

def main():
    # List of all HTML files to update
    files_to_update = [
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ResearchPay/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ResearchPay/SurveyVault/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/LabVault/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/LabVault/LabShot/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/Argus/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/Argus/sentinel.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/Argus/immunity-index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/Argus/threat-lab.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/demos.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/verification-calculator.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/fraud-risk-scanner.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/mobility-barrier-map.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/demos.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/carbon-truth-calculator.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/carbon-intelligence-map.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/blind-spot-scanner.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/demos.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/ted-scanner.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/network-xray.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/collusion-radar.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HYPERION/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HYPERION/demos.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HYPERION/nis2-checker.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HYPERION/eidas-readiness.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ARCHON/index.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ARCHON/demos.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ARCHON/live-counter.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ARCHON/agent-roulette.html",
        "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HealthCompanion/EmergencyCard/index.html"
    ]
    
    total = len(files_to_update)
    success = 0
    
    print(f"Updating {total} HTML files with hamburger menu...")
    print("-" * 50)
    
    for filepath in files_to_update:
        if os.path.exists(filepath):
            if update_file(filepath):
                success += 1
        else:
            print(f"  ⚠️  File not found: {filepath}")
    
    print("-" * 50)
    print(f"✅ Successfully updated {success}/{total} files")

if __name__ == "__main__":
    main()
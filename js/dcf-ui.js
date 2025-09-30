// =============================================================================
// DCF UI SYSTEM - Navigation, Modals, Footer
// Uses dcf-core.js utilities
// Works independently of authentication system
// =============================================================================

console.log('🎨 DCF UI System Loading...');

// =============================================================================
// LOGO CONFIGURATION
// =============================================================================

const LOGO_CONFIG = {
    icon: {
        type: 'circle', // 'circle', 'image', or 'svg'
        color: '#000', // black circle
        size: '24px',
        imageUrl: null // or path to logo image if using image type
    },
    text: {
        full: 'Domus Communis',
        short: 'Domus Communis',
        abbrev: 'DC'
    },
    link: 'index.html', // Homepage link
    // Display mode based on page type
    displayMode: {
        launch: 'full', // Show full name on launch pages
        member: 'short', // Show short name on member pages
        mobile: 'abbrev' // Show abbreviation on mobile
    }
};

// =============================================================================
// DUAL NAVIGATION SYSTEM - Launch Menu vs Full Menu
// =============================================================================

// LAUNCH MENU - Simplified public navigation for Phase 1
const LAUNCH_MENU = [
    { text: 'Home', href: 'index.html', dropdown: false },
    { text: 'Blog', href: 'blog/index.html', dropdown: false },
    { 
        text: 'Initiatives', 
        href: 'initiatives/initiatives_home.html', 
        dropdown: true,
        items: [
            { text: 'Peace Initiative', href: 'initiatives/peace/initiative_peace.html' },
            { text: 'Education Initiative', href: 'initiatives/education/initiative_education.html' },
            { text: 'Health Initiative', href: 'initiatives/health/initiative_health.html' },
            { text: 'Research Initiative', href: 'initiatives/research/initiative_research.html' }
        ]
    },
    { 
        text: 'About', 
        href: 'public/dcf_about.html', 
        dropdown: true,
        items: [
            { text: 'About Us', href: 'public/dcf_about.html' },
            { text: 'Contact', href: 'public/dcf_contact.html' },
            { text: 'Donate', href: 'members/dcf_donate.html' }
        ]
    },
    { text: 'Resources', href: 'public/dcf_ai_resources.html', dropdown: false }
];

// FULL MENU - Complete member navigation for Phase 2
const FULL_MENU = [
    { text: 'Home', href: 'members/dcf_member_home.html', dropdown: false },
    { text: 'Members', href: 'members/dcf_members_directory.html', dropdown: false },
    { text: 'Projects', href: 'public/dcf_projects_public.html', dropdown: false },
    { text: 'Events', href: 'public/dcf_events_public.html', dropdown: false },
    { text: 'Resources', href: 'public/dcf_resources_public.html', dropdown: false }
];

// List of pages that should show the LAUNCH_MENU
const LAUNCH_PAGES = [
    // Main pages
    'index.html',
    
    // Public pages
    'public/dcf_about.html',
    'public/dcf_contact.html',
    'public/dcf_ai_resources.html',
    'public/dcf_ai_resource_view.html',
    
    // ALL Initiative pages - matches any file in initiatives folder and subfolders
    'initiatives/',  // This includes all 7 HTML files: initiatives_home, 4 initiative pages, and 2 nuclear disarmament pages
    
    // ALL Blog pages - matches any file in blog folder
    'blog/',
    
    // Donation page
    'members/dcf_donate.html'
];

// Function to detect if current page should use LAUNCH_MENU
function isLaunchPage() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    
    // Check if current page is in launch pages list
    const isLaunch = LAUNCH_PAGES.some(page => {
        // Handle folder matches (like blog/, initiatives/)
        if (page.endsWith('/')) {
            const matches = currentPath.includes(page);
            if (matches) {
                console.log(`📁 Folder match found: "${page}" in path "${currentPath}"`);
            }
            return matches;
        }
        // Handle exact filename matches
        return currentPath.includes(page) || filename === page;
    });
    
    // Enhanced logging for blog pages
    if (currentPath.includes('/blog/')) {
        console.log('📝 Blog page detected:', {
            path: currentPath,
            file: filename,
            recognized: isLaunch ? '✅ YES - Launch Page' : '❌ NO - Member Page'
        });
    }
    
    console.log('🚀 Launch page check:', { 
        currentPath, 
        filename, 
        isLaunch,
        menuType: isLaunch ? 'LAUNCH MENU' : 'FULL MENU',
        matchedBy: isLaunch ? 'Matched by LAUNCH_PAGES' : 'Default to FULL_MENU'
    });
    
    return isLaunch;
}

// =============================================================================
// 1. NAVIGATION SYSTEM
// =============================================================================

function populateDCFNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) {
        console.log('❌ Navigation menu element not found');
        return;
    }

    // Determine which menu to use
    const menuItems = isLaunchPage() ? LAUNCH_MENU : FULL_MENU;
    const menuType = isLaunchPage() ? 'LAUNCH' : 'FULL';
    
    console.log(`🧭 Populating ${menuType} navigation menu with ${menuItems.length} items`);
    
    // Clear existing menu
    navMenu.innerHTML = '';
    
    // Get base path for links
    const basePath = window.getCorrectBasePath();
    
    // Build menu from config
    menuItems.forEach(item => {
        const li = document.createElement('li');
        
        if (item.dropdown && item.items) {
            // Create dropdown container
            li.className = 'nav-dropdown';
            li.style.position = 'relative';
            
            // Create dropdown toggle link
            const toggle = document.createElement('a');
            toggle.href = basePath + item.href;
            toggle.className = 'dropdown-toggle';
            toggle.textContent = item.text;
            
            // Add dropdown arrow
            const arrow = document.createElement('span');
            arrow.textContent = ' ▼';
            arrow.style.fontSize = '0.7em';
            arrow.style.marginLeft = '3px';
            toggle.appendChild(arrow);
            
            li.appendChild(toggle);
            
            // Create dropdown menu
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'nav-submenu';
            dropdownMenu.style.cssText = `
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                min-width: 220px;
                z-index: 1000;
                margin-top: 0;
                padding: 0.5rem 0;
                list-style: none;
            `;
            
            // Add dropdown items
            item.items.forEach(subItem => {
                const subLi = document.createElement('li');
                const link = document.createElement('a');
                link.href = basePath + subItem.href;
                link.textContent = subItem.text;
                link.style.cssText = `
                    display: block;
                    padding: 0.75rem 1.25rem;
                    color: #333;
                    text-decoration: none;
                    transition: background 0.2s ease;
                    white-space: nowrap;
                `;
                
                // Add hover effect
                link.addEventListener('mouseenter', () => {
                    link.style.background = '#f8f9fa';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.background = 'transparent';
                });
                
                subLi.appendChild(link);
                dropdownMenu.appendChild(subLi);
            });
            
            li.appendChild(dropdownMenu);
            
            // Improved hover handling with delay
            let hoverTimeout;
            
            li.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                dropdownMenu.style.display = 'block';
            });
            
            li.addEventListener('mouseleave', (e) => {
                // Small delay to allow cursor to reach submenu
                hoverTimeout = setTimeout(() => {
                    // Check if mouse is still within the dropdown area
                    if (!li.contains(e.relatedTarget)) {
                        dropdownMenu.style.display = 'none';
                    }
                }, 50);
            });
            
            // Keep menu open when hovering over it
            dropdownMenu.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                dropdownMenu.style.display = 'block';
            });
            
            dropdownMenu.addEventListener('mouseleave', () => {
                dropdownMenu.style.display = 'none';
            });
            
            // Keyboard accessibility
            toggle.addEventListener('focus', () => {
                dropdownMenu.style.display = 'block';
            });
            toggle.addEventListener('blur', (e) => {
                // Check if focus moved to dropdown item
                setTimeout(() => {
                    if (!li.contains(document.activeElement)) {
                        dropdownMenu.style.display = 'none';
                    }
                }, 100);
            });
            
        } else {
            // Create regular menu item
            const link = document.createElement('a');
            link.href = basePath + item.href;
            link.textContent = item.text;
            
            // Highlight active page
            if (window.location.pathname.includes(item.href)) {
                link.className = 'active';
            }
            
            li.appendChild(link);
        }
        
        navMenu.appendChild(li);
    });
    
    console.log(`✅ ${menuType} navigation populated with ${menuItems.length} items`);
}

// Keep the old function for backward compatibility
function populateTopNavigation() {
    console.log('🧭 Populating DCF navigation (legacy call)...');
    populateDCFNavigation();
}

// Original navigation structure (preserved for reference)
function populateTopNavigationOld() {
    console.log('🧭 Populating DCF navigation (OLD VERSION)...');
    
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) {
        console.log('❌ Navigation container (.nav-menu) not found');
        return;
    }
    
    // Clear existing navigation
    navMenu.innerHTML = '';
    
    const basePath = window.getCorrectBasePath();
    
    // DCF HUNGARY NAVIGATION STRUCTURE (logged out state)
    const navItems = [
        { 
            href: basePath + 'initiatives/initiatives_home.html', 
            text: 'Initiatives',
            dropdown: true,
            submenu: [
                { href: basePath + 'initiatives/peace/initiative_peace.html', text: 'Peace Initiative' },
                { href: basePath + 'initiatives/education/initiative_education.html', text: 'Education Initiative' },
                { href: basePath + 'initiatives/health/initiative_health.html', text: 'Health Initiative' },
                { href: basePath + 'initiatives/research/initiative_research.html', text: 'Research Initiative' }
            ]
        },
        { href: basePath + 'blog/index.html', text: 'Blog' },
        { href: basePath + 'people/index.html', text: 'People' },
        { 
            href: basePath + 'public/dcf_about.html', 
            text: 'About',
            dropdown: true,
            submenu: [
                { href: basePath + 'public/dcf_about.html', text: 'About DCF' },
                { href: basePath + 'public/dcf_impact_report.html', text: 'Impact Report' },
                { href: basePath + 'public/dcf_contact.html', text: 'Contact' }
            ]
        },
        { href: basePath + 'public/dcf_projects_public.html', text: 'Projects' },
        { href: basePath + 'public/dcf_ai_resources.html', text: 'Resources' },
        { 
            href: basePath + 'news/dcf_news.html', 
            text: 'News',
            dropdown: true,
            submenu: [
                { href: basePath + 'news/dcf_news.html', text: 'Latest News' },
                { href: basePath + 'public/dcf_events_public.html', text: 'Events' }
            ]
        }
    ];
    
    navItems.forEach(item => {
        const li = document.createElement('li');
        
        if (item.dropdown && item.submenu) {
            // Create dropdown structure
            li.className = 'nav-dropdown';
            li.style.position = 'relative';
            
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.text;
            a.className = 'dropdown-toggle';
            
            // Add dropdown arrow
            const arrow = document.createElement('span');
            arrow.textContent = ' ▼';
            arrow.style.fontSize = '0.7em';
            arrow.style.marginLeft = '3px';
            a.appendChild(arrow);
            
            li.appendChild(a);
            
            // Create submenu
            const submenu = document.createElement('ul');
            submenu.className = 'nav-submenu';
            submenu.style.cssText = `
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                min-width: 200px;
                z-index: 1000;
                padding: 0.5rem 0;
                margin-top: 0;
                list-style: none;
            `;
            
            item.submenu.forEach(subItem => {
                const subLi = document.createElement('li');
                subLi.style.margin = '0';
                
                const subA = document.createElement('a');
                subA.href = subItem.href;
                subA.textContent = subItem.text;
                subA.style.cssText = `
                    display: block;
                    padding: 0.5rem 1rem;
                    color: #666;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                `;
                
                // Add hover effect
                subA.addEventListener('mouseenter', () => {
                    subA.style.backgroundColor = '#f8f9fa';
                    subA.style.color = '#333';
                });
                subA.addEventListener('mouseleave', () => {
                    subA.style.backgroundColor = 'transparent';
                    subA.style.color = '#666';
                });
                
                subLi.appendChild(subA);
                submenu.appendChild(subLi);
            });
            
            li.appendChild(submenu);
            
            // Handle dropdown hover
            let hoverTimeout;
            
            li.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                submenu.style.display = 'block';
            });
            
            li.addEventListener('mouseleave', (e) => {
                // Small delay to allow cursor to reach submenu
                hoverTimeout = setTimeout(() => {
                    // Check if mouse is still within the dropdown area
                    if (!li.contains(e.relatedTarget)) {
                        submenu.style.display = 'none';
                    }
                }, 50);
            });
            
            // Keep submenu open when hovering over it
            submenu.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                submenu.style.display = 'block';
            });
            
            submenu.addEventListener('mouseleave', () => {
                submenu.style.display = 'none';
            });
            
        } else {
            // Regular menu item
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.text;
            li.appendChild(a);
        }
        
        navMenu.appendChild(li);
    });
    
    console.log('✅ DCF navigation populated with', navItems.length, 'items');
}

// =============================================================================
// 2. USER INTERFACE MANAGEMENT
// =============================================================================

function updateUserInterface() {
    console.log('🎨 Updating UI (logged out state)...');
    
    showLoggedOutState();
    populateLogo();  // Use new logo generation system
    populateDCFNavigation();  // Use new dual navigation system
    handleResponsiveLogo();  // Enable responsive logo behavior
    initializeFooter();
    
    // Hide launch-specific elements after DOM is populated
    setTimeout(() => {
        hideLaunchPageElements();
    }, 100);
    
    console.log('✅ UI updated for logged-out state');
}

function showLoggedOutState() {
    console.log('👤 Showing logged-out UI state');
    
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) {
        console.log('❌ User menu container not found');
        return;
    }
    
    const basePath = window.getCorrectBasePath();
    
    // Check if we're on a launch page
    const onLaunchPage = isLaunchPage();
    
    if (onLaunchPage) {
        // Launch pages: No login or join buttons
        userMenu.innerHTML = '';
        console.log('🚀 Launch page: Hidden login/join buttons in header');
    } else {
        // Member pages: Show both login and join buttons
        userMenu.innerHTML = `
            <a href="${basePath}auth/dcf_login_page.html" class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px;">Login</a>
            <a href="${basePath}auth/dcf_profile_signup.html" class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Join Us</a>
        `;
        console.log('👥 Member page: Showing login/join buttons');
    }
}

function hideLaunchPageElements() {
    // Only run on launch pages
    if (!isLaunchPage()) {
        console.log('ℹ️ Not a launch page, keeping all elements visible');
        return;
    }
    
    console.log('🚀 Launch page detected - hiding member/auth elements');
    
    // Hide "Join Us" buttons
    const joinButtons = document.querySelectorAll('a[href*="signup"], a[href*="join"], .join-btn, .signup-btn, button.join-btn');
    joinButtons.forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        if (btnText.includes('join') || 
            btnText.includes('sign up') ||
            btnText.includes('create account') ||
            btnText.includes('register')) {
            btn.style.display = 'none';
            console.log('🔒 Hiding join/signup button:', btn.textContent.trim());
        }
    });
    
    // Hide signup prompts and links
    const signupPrompts = document.querySelectorAll('p, div, span');
    signupPrompts.forEach(element => {
        const text = element.textContent.toLowerCase();
        if ((text.includes('new to dcf') || 
             text.includes('create an account') ||
             text.includes('sign up today') ||
             text.includes('join us today')) &&
            element.querySelector('a[href*="signup"], a[href*="join"]')) {
            element.style.display = 'none';
            console.log('🔒 Hiding signup prompt:', element.textContent.substring(0, 50) + '...');
        }
    });
    
    // Hide any remaining signup links not caught above
    const signupLinks = document.querySelectorAll('a[href*="dcf_profile_signup"], a[href*="signup"], a[href*="register"]');
    signupLinks.forEach(link => {
        // Don't hide if it's part of main navigation (already handled)
        if (!link.closest('.nav-menu')) {
            const linkText = link.textContent.toLowerCase();
            if (linkText.includes('create') || linkText.includes('sign') || linkText.includes('join')) {
                link.style.display = 'none';
                console.log('🔒 Hiding signup link:', link.textContent.trim());
            }
        }
    });
    
    console.log('✅ Launch page elements hidden');
}

// =============================================================================
// LOGO GENERATION SYSTEM
// =============================================================================

function generateLogo() {
    const isLaunch = isLaunchPage();
    const isMobile = window.innerWidth < 768;
    
    // Determine which text to show
    let logoText;
    if (isMobile) {
        logoText = LOGO_CONFIG.text.abbrev;
    } else {
        logoText = isLaunch ? LOGO_CONFIG.text.full : LOGO_CONFIG.text.short;
    }
    
    const basePath = window.getCorrectBasePath();
    
    console.log('🏷️ Generating logo:', { 
        pageType: isLaunch ? 'LAUNCH' : 'MEMBER',
        isMobile,
        text: logoText 
    });
    
    // Create logo container
    const logoLink = document.createElement('a');
    logoLink.href = basePath + LOGO_CONFIG.link;
    logoLink.className = 'logo';
    logoLink.style.cssText = `
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #333;
        font-weight: 600;
        font-size: 1rem;
    `;
    
    // Create logo icon
    if (LOGO_CONFIG.icon.type === 'circle') {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'logo-icon';
        iconDiv.style.cssText = `
            width: ${LOGO_CONFIG.icon.size};
            height: ${LOGO_CONFIG.icon.size};
            background: ${LOGO_CONFIG.icon.color};
            border-radius: 50%;
            margin-right: 8px;
            flex-shrink: 0;
        `;
        logoLink.appendChild(iconDiv);
    } else if (LOGO_CONFIG.icon.type === 'image' && LOGO_CONFIG.icon.imageUrl) {
        const iconImg = document.createElement('img');
        iconImg.src = basePath + LOGO_CONFIG.icon.imageUrl;
        iconImg.className = 'logo-icon';
        iconImg.style.cssText = `
            width: ${LOGO_CONFIG.icon.size};
            height: ${LOGO_CONFIG.icon.size};
            margin-right: 8px;
            flex-shrink: 0;
        `;
        iconImg.alt = 'Logo';
        logoLink.appendChild(iconImg);
    }
    
    // Create logo text
    const textSpan = document.createElement('span');
    textSpan.className = 'logo-text';
    textSpan.textContent = logoText;
    textSpan.style.cssText = 'white-space: nowrap;';
    logoLink.appendChild(textSpan);
    
    console.log('✅ Logo generated');
    return logoLink;
}

function populateLogo() {
    // Find logo container in navigation - try multiple selectors
    let logoContainer = document.querySelector('.logo-container') || 
                       document.querySelector('.nav-container > .logo') ||
                       document.querySelector('.nav-container');
    
    if (!logoContainer) {
        console.log('⚠️ Logo container not found');
        return;
    }
    
    console.log('🏷️ Populating logo...');
    
    // If we found nav-container, we'll prepend the logo to it
    if (logoContainer.classList.contains('nav-container')) {
        // Check if there's already a logo
        const existingLogo = logoContainer.querySelector('.logo');
        if (existingLogo) {
            existingLogo.remove();
        }
        
        // Generate and insert new logo at the beginning
        const newLogo = generateLogo();
        logoContainer.insertBefore(newLogo, logoContainer.firstChild);
    } else if (logoContainer.classList.contains('logo')) {
        // The container itself is the logo link - replace its content
        const newLogo = generateLogo();
        logoContainer.innerHTML = newLogo.innerHTML;
        logoContainer.href = newLogo.href;
        logoContainer.className = newLogo.className;
        if (newLogo.style.cssText) {
            logoContainer.style.cssText = newLogo.style.cssText;
        }
    } else if (logoContainer.classList.contains('logo-container')) {
        // It's a dedicated logo container - replace content
        logoContainer.innerHTML = '';
        const newLogo = generateLogo();
        logoContainer.appendChild(newLogo);
    }
    
    console.log('✅ Logo populated');
}

function handleResponsiveLogo() {
    console.log('📱 Setting up responsive logo handling...');
    
    // Update logo text based on screen width
    function updateLogoResponsive() {
        const logoText = document.querySelector('.logo-text');
        if (!logoText) return;
        
        const isLaunch = isLaunchPage();
        const width = window.innerWidth;
        
        if (width < 768) {
            // Mobile: show abbreviation
            logoText.textContent = LOGO_CONFIG.text.abbrev;
        } else {
            // Desktop: show full or short based on page type
            logoText.textContent = isLaunch ? 
                LOGO_CONFIG.text.full : 
                LOGO_CONFIG.text.short;
        }
        
        console.log('📱 Logo text updated:', logoText.textContent);
    }
    
    // Update on load
    updateLogoResponsive();
    
    // Debounce resize events for performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateLogoResponsive, 250);
    });
    
    console.log('✅ Responsive logo handling enabled');
}

// Keep old function for backward compatibility
function updateLogoText() {
    console.log('🏷️ Updating logo text (legacy call - using populateLogo instead)...');
    populateLogo();
}

// =============================================================================
// 3. MODAL SYSTEM
// =============================================================================

function showAlert(message, type = 'info', title = null) {
    return new Promise((resolve) => {
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'dcf-alert';
        alertDiv.setAttribute('data-type', type);
        
        const iconMap = {
            'info': '💡',
            'success': '✅', 
            'warning': '⚠️',
            'error': '❌',
            'question': '❓'
        };
        
        const titleMap = {
            'info': 'Information',
            'success': 'Success',
            'warning': 'Warning', 
            'error': 'Error',
            'question': 'Confirm'
        };
        
        alertDiv.innerHTML = `
            <div class="dcf-alert-overlay" onclick="closeAlert()"></div>
            <div class="dcf-alert-content">
                <div class="dcf-alert-header">
                    <span class="dcf-alert-icon">${iconMap[type]}</span>
                    <h3 class="dcf-alert-title">${title || titleMap[type]}</h3>
                </div>
                <div class="dcf-alert-message">${message}</div>
                <div class="dcf-alert-actions">
                    <button class="dcf-alert-btn dcf-alert-btn-primary" onclick="closeAlert(true)">OK</button>
                </div>
            </div>
        `;
        
        addAlertCSS();
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.classList.add('active'), 10);
        
        window.currentAlertResolve = resolve;
    });
}

function showConfirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'dcf-alert';
        alertDiv.setAttribute('data-type', 'question');
        
        alertDiv.innerHTML = `
            <div class="dcf-alert-overlay" onclick="closeAlert(false)"></div>
            <div class="dcf-alert-content">
                <div class="dcf-alert-header">
                    <span class="dcf-alert-icon">❓</span>
                    <h3 class="dcf-alert-title">${title}</h3>
                </div>
                <div class="dcf-alert-message">${message}</div>
                <div class="dcf-alert-actions">
                    <button class="dcf-alert-btn dcf-alert-btn-secondary" onclick="closeAlert(false)">Cancel</button>
                    <button class="dcf-alert-btn dcf-alert-btn-primary" onclick="closeAlert(true)">Confirm</button>
                </div>
            </div>
        `;
        
        addAlertCSS();
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.classList.add('active'), 10);
        
        window.currentAlertResolve = resolve;
    });
}

function showPrompt(message, defaultValue = '', title = 'Input Required') {
    return new Promise((resolve) => {
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'dcf-alert';
        alertDiv.setAttribute('data-type', 'question');
        
        alertDiv.innerHTML = `
            <div class="dcf-alert-overlay" onclick="closeAlert(null)"></div>
            <div class="dcf-alert-content">
                <div class="dcf-alert-header">
                    <span class="dcf-alert-icon">✏️</span>
                    <h3 class="dcf-alert-title">${title}</h3>
                </div>
                <div class="dcf-alert-message">${message}</div>
                <div class="dcf-alert-input">
                    <input type="text" class="dcf-prompt-input" value="${defaultValue}" placeholder="Enter text..." />
                </div>
                <div class="dcf-alert-actions">
                    <button class="dcf-alert-btn dcf-alert-btn-secondary" onclick="closeAlert(null)">Cancel</button>
                    <button class="dcf-alert-btn dcf-alert-btn-primary" onclick="closeAlertWithInput()">OK</button>
                </div>
            </div>
        `;
        
        addAlertCSS();
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.classList.add('active');
            const input = alertDiv.querySelector('.dcf-prompt-input');
            if (input) {
                input.focus();
                input.select();
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') closeAlertWithInput();
                    if (e.key === 'Escape') closeAlert(null);
                });
            }
        }, 10);
        
        window.currentAlertResolve = resolve;
    });
}

function closeAlert(result = false) {
    const alert = document.querySelector('.dcf-alert');
    if (alert) {
        alert.classList.remove('active');
        setTimeout(() => {
            if (alert.parentNode) alert.parentNode.removeChild(alert);
        }, 300);
    }
    
    if (window.currentAlertResolve) {
        window.currentAlertResolve(result);
        window.currentAlertResolve = null;
    }
}

function closeAlertWithInput() {
    const input = document.querySelector('.dcf-prompt-input');
    const value = input ? input.value : null;
    closeAlert(value);
}

function removeExistingAlert() {
    const existingAlert = document.querySelector('.dcf-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
}

function addAlertCSS() {
    if (!document.querySelector('#dcf-alert-css')) {
        const style = document.createElement('style');
        style.id = 'dcf-alert-css';
        style.textContent = `
            .dcf-alert {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .dcf-alert.active {
                opacity: 1;
                visibility: visible;
            }
            
            .dcf-alert-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                cursor: pointer;
            }
            
            .dcf-alert-content {
                background: white;
                border-radius: 12px;
                padding: 0;
                max-width: 450px;
                width: 90%;
                position: relative;
                z-index: 1;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
                overflow: hidden;
            }
            
            .dcf-alert.active .dcf-alert-content {
                transform: scale(1);
            }
            
            .dcf-alert-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.5rem 1.5rem 1rem 1.5rem;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .dcf-alert-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .dcf-alert-title {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
                color: #333;
            }
            
            .dcf-alert-message {
                padding: 1.5rem;
                color: #666;
                line-height: 1.6;
                font-size: 0.95rem;
            }
            
            .dcf-alert-input {
                padding: 0 1.5rem;
            }
            
            .dcf-prompt-input {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e5e5e5;
                border-radius: 8px;
                font-size: 0.95rem;
                transition: border-color 0.3s ease;
                outline: none;
            }
            
            .dcf-prompt-input:focus {
                border-color: #000;
            }
            
            .dcf-alert-actions {
                padding: 1rem 1.5rem 1.5rem 1.5rem;
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
                background: #fafafa;
            }
            
            .dcf-alert-btn {
                padding: 0.6rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 80px;
            }
            
            .dcf-alert-btn-primary {
                background: #000;
                color: white;
            }
            
            .dcf-alert-btn-primary:hover {
                background: #333;
                transform: translateY(-1px);
            }
            
            .dcf-alert-btn-secondary {
                background: transparent;
                color: #666;
                border: 2px solid #e5e5e5;
            }
            
            .dcf-alert-btn-secondary:hover {
                color: #333;
                border-color: #333;
                transform: translateY(-1px);
            }
        `;
        document.head.appendChild(style);
    }
}

// =============================================================================
// 4. FOOTER SYSTEM
// =============================================================================

function initializeFooter() {
    console.log('🦶 Initializing footer...');
    
    const footer = document.querySelector('footer, .site-footer');
    if (!footer) {
        console.log('Footer not found (normal for admin pages)');
        return;
    }
    
    // Basic footer functionality can be added here
    console.log('✅ Footer initialized');
}

// =============================================================================
// 5. MAIN UI OBJECT
// =============================================================================

const dcfUI = {
    initialize() {
        console.log('🚀 Initializing DCF UI System...');
        updateUserInterface();
        console.log('✅ DCF UI System initialized');
    },
    
    // Export functions for external use
    showAlert,
    showConfirm,
    showPrompt,
    populateTopNavigation,
    populateDCFNavigation,
    updateUserInterface,
    showLoggedOutState,
    isLaunchPage,
    hideLaunchPageElements,
    generateLogo,
    populateLogo,
    handleResponsiveLogo
};

// Export to window for global access
window.dcfUI = dcfUI;
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showPrompt = showPrompt;
window.closeAlert = closeAlert;
window.populateDCFNavigation = populateDCFNavigation;
window.isLaunchPage = isLaunchPage;
window.hideLaunchPageElements = hideLaunchPageElements;
window.generateLogo = generateLogo;
window.populateLogo = populateLogo;
window.handleResponsiveLogo = handleResponsiveLogo;
window.LOGO_CONFIG = LOGO_CONFIG; // Export config for easy access

console.log('✅ DCF UI system loaded');
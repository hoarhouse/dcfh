// =============================================================================
// DCF UI SYSTEM - Navigation, Modals, Footer
// Uses dcf-core.js utilities
// Works independently of authentication system
// =============================================================================

console.log('🎨 DCF UI System Loading...');

// =============================================================================
// 1. NAVIGATION SYSTEM
// =============================================================================

function populateTopNavigation() {
    console.log('🧭 Populating DCF navigation...');
    
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
        { href: basePath + 'public/dcf_resources_public.html', text: 'Resources' },
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
                min-width: 180px;
                z-index: 1000;
                padding: 0.5rem 0;
                margin-top: 0.5rem;
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
            
            li.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    submenu.style.display = 'none';
                }, 100);
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
    updateLogoText();
    populateTopNavigation();
    initializeFooter();
    
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
    
    userMenu.innerHTML = `
        <a href="${basePath}auth/dcf_login_page.html" class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px;">Login</a>
        <a href="${basePath}auth/dcf_profile_signup.html" class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Join Us</a>
    `;
}

function updateLogoText() {
    console.log('🏷️ Updating logo text...');
    
    // Update any navigation logo text
    const logoElements = document.querySelectorAll('.logo, .logo-text, .brand-name, .site-title');
    logoElements.forEach(element => {
        if (element.textContent && element.textContent.includes('Domus Communis Foundation')) {
            element.textContent = element.textContent.replace('Domus Communis Foundation', 'DCF');
        }
    });
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
    updateUserInterface,
    showLoggedOutState
};

// Export to window for global access
window.dcfUI = dcfUI;
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showPrompt = showPrompt;
window.closeAlert = closeAlert;

console.log('✅ DCF UI system loaded');
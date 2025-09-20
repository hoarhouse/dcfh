// ===================================================================
// DCF HUNGARY - UI SYSTEM
// Navigation and UI components using dcf-core.js
// ===================================================================

// =============================================================================
// NAVIGATION SYSTEM
// =============================================================================

/**
 * Populates the main navigation menu
 * Uses window.getCorrectBasePath from dcf-core.js
 */
function populateTopNavigation() {
    console.log('🧭 Populating top navigation...');
    
    const navContainer = document.querySelector('.nav-menu');
    if (!navContainer) {
        console.log('Navigation container not found');
        return;
    }

    const basePath = window.getCorrectBasePath ? window.getCorrectBasePath() : '';
    
    // Navigation structure for logged-out state
    const navigationStructure = [
        {
            label: 'Home',
            href: `${basePath}index.html`,
            type: 'link'
        },
        {
            label: 'About',
            type: 'dropdown',
            items: [
                { label: 'Our Story', href: `${basePath}about.html` },
                { label: 'Mission', href: `${basePath}mission.html` },
                { label: 'Values', href: `${basePath}values.html` },
                { label: 'Team', href: `${basePath}team.html` },
                { label: 'Why Hungary?', href: `${basePath}hungary.html` }
            ]
        },
        {
            label: 'Programs',
            type: 'dropdown',
            items: [
                { label: 'All Programs', href: `${basePath}programs.html` },
                { label: 'Accelerator', href: `${basePath}accelerator.html` },
                { label: 'Fellowships', href: `${basePath}fellowships.html` },
                { label: 'Bootcamps', href: `${basePath}bootcamps.html` },
                { label: 'Workshops', href: `${basePath}workshops.html` },
                { label: 'Mentorship', href: `${basePath}mentorship.html` }
            ]
        },
        {
            label: 'Resources',
            type: 'dropdown',
            items: [
                { label: 'All Resources', href: `${basePath}resources.html` },
                { label: 'Tools & Templates', href: `${basePath}tools.html` },
                { label: 'Guides', href: `${basePath}guides.html` },
                { label: 'Funding Database', href: `${basePath}funding.html` },
                { label: 'Blog', href: `${basePath}blog.html` },
                { label: 'Newsletter', href: `${basePath}newsletter.html` }
            ]
        },
        {
            label: 'Community',
            type: 'dropdown',
            items: [
                { label: 'Projects', href: `${basePath}projects.html` },
                { label: 'Events', href: `${basePath}events.html` },
                { label: 'Members', href: `${basePath}members.html` },
                { label: 'Success Stories', href: `${basePath}success-stories.html` },
                { label: 'Partners', href: `${basePath}partners.html` }
            ]
        },
        {
            label: 'Innovation',
            type: 'dropdown',
            items: [
                { label: 'AI/ML Solutions', href: `${basePath}ai-ml.html` },
                { label: 'GreenTech', href: `${basePath}greentech.html` },
                { label: 'HealthTech', href: `${basePath}healthtech.html` },
                { label: 'Blockchain', href: `${basePath}blockchain.html` },
                { label: 'Smart Cities', href: `${basePath}smart-cities.html` }
            ]
        }
    ];

    // Clear existing content
    navContainer.innerHTML = '';

    // Build navigation HTML
    navigationStructure.forEach(navItem => {
        if (navItem.type === 'link') {
            const link = document.createElement('a');
            link.href = navItem.href;
            link.className = 'nav-item';
            link.textContent = navItem.label;
            navContainer.appendChild(link);
        } else if (navItem.type === 'dropdown') {
            const dropdown = document.createElement('div');
            dropdown.className = 'nav-item dropdown-trigger';
            
            const label = document.createElement('span');
            label.textContent = navItem.label;
            dropdown.appendChild(label);
            
            const menu = document.createElement('div');
            menu.className = 'dropdown-menu';
            menu.style.display = 'none';
            menu.style.opacity = '0';
            
            navItem.items.forEach(item => {
                const link = document.createElement('a');
                link.href = item.href;
                link.textContent = item.label;
                menu.appendChild(link);
            });
            
            dropdown.appendChild(menu);
            navContainer.appendChild(dropdown);
            
            // Add hover functionality
            let timeout;
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                menu.style.display = 'block';
                setTimeout(() => menu.style.opacity = '1', 10);
            });
            
            dropdown.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    menu.style.opacity = '0';
                    setTimeout(() => menu.style.display = 'none', 200);
                }, 200);
            });
        }
    });
}

// =============================================================================
// USER INTERFACE MANAGEMENT
// =============================================================================

/**
 * Updates the main user interface to show logged-out state
 */
function updateUserInterface() {
    console.log('🎨 Updating UI (logged out state)...');
    
    // Show logged out state
    showLoggedOutState();
    
    // Populate navigation
    populateTopNavigation();
    
    // Update logo if exists
    updateLogoText();
    
    // Initialize footer
    initializeFooter();
    
    // Add alert CSS if needed
    addAlertCSS();
}

/**
 * Shows the logged-out state in the user menu
 */
function showLoggedOutState() {
    console.log('👤 Showing logged-out UI state');
    
    const userSection = document.querySelector('.user-menu');
    if (!userSection) {
        console.log('❌ User section not found');
        return;
    }

    // Clear and rebuild for logged-out state
    userSection.innerHTML = `
        <a href="register.html" class="btn-primary">Sign Up</a>
        <a href="login.html" class="btn-ghost">Log In</a>
    `;
    
    userSection.classList.remove('logged-in');
}

/**
 * Updates the logo text
 */
function updateLogoText() {
    console.log('🏷️ Updating logo text...');
    
    const logo = document.querySelector('.logo');
    if (logo) {
        // Preserve the logo icon div and update text
        const logoIcon = logo.querySelector('.logo-icon');
        if (logoIcon) {
            logo.innerHTML = '';
            logo.appendChild(logoIcon);
            logo.appendChild(document.createTextNode(' DCF Hungary'));
        } else {
            // If no icon, just set the text
            const currentHref = logo.getAttribute('href');
            logo.textContent = 'DCF Hungary';
            if (currentHref) {
                logo.setAttribute('href', currentHref);
            }
        }
    }
}

/**
 * Initializes the footer
 */
function initializeFooter() {
    console.log('🦶 Initializing footer...');
    
    const footer = document.querySelector('footer');
    if (!footer) {
        console.log('Footer not found');
        return;
    }

    // Add basic footer content if empty
    if (!footer.innerHTML.trim()) {
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-section">
                    <h3>DCF Hungary</h3>
                    <p>Building tomorrow's digital community today.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <a href="about.html">About Us</a>
                    <a href="projects.html">Projects</a>
                    <a href="blog.html">Blog</a>
                    <a href="contact.html">Contact</a>
                </div>
                <div class="footer-section">
                    <h4>Connect</h4>
                    <a href="newsletter.html">Newsletter</a>
                    <a href="events.html">Events</a>
                    <a href="community.html">Community</a>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 DCF Hungary. All rights reserved.</p>
                </div>
            </div>
        `;
    }
}

// =============================================================================
// ALERT/MODAL SYSTEM
// =============================================================================

/**
 * Shows an alert modal
 * @param {string} message - The message to display
 * @param {string} type - Alert type (info, success, warning, error)
 * @param {string|null} title - Optional title
 */
function showAlert(message, type = 'info', title = null) {
    removeExistingAlert();
    
    const alertHTML = `
        <div class="dcf-alert-overlay">
            <div class="dcf-alert dcf-alert-${type}">
                ${title ? `<div class="dcf-alert-title">${title}</div>` : ''}
                <div class="dcf-alert-message">${message}</div>
                <button class="dcf-alert-button" onclick="closeAlert()">OK</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
}

/**
 * Shows a confirmation modal
 * @param {string} message - The message to display
 * @param {string} title - Modal title
 * @returns {Promise<boolean>} Promise that resolves to true/false
 */
function showConfirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        removeExistingAlert();
        
        const confirmHTML = `
            <div class="dcf-alert-overlay">
                <div class="dcf-alert dcf-alert-confirm">
                    <div class="dcf-alert-title">${title}</div>
                    <div class="dcf-alert-message">${message}</div>
                    <div class="dcf-alert-buttons">
                        <button class="dcf-alert-button dcf-alert-cancel" onclick="closeAlert(false)">Cancel</button>
                        <button class="dcf-alert-button dcf-alert-confirm-btn" onclick="closeAlert(true)">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', confirmHTML);
        window.alertResolve = resolve;
    });
}

/**
 * Shows a prompt modal for user input
 * @param {string} message - The message to display
 * @param {string} defaultValue - Default input value
 * @param {string} title - Modal title
 * @returns {Promise<string|null>} Promise that resolves to the input value or null
 */
function showPrompt(message, defaultValue = '', title = 'Input Required') {
    return new Promise((resolve) => {
        removeExistingAlert();
        
        const promptHTML = `
            <div class="dcf-alert-overlay">
                <div class="dcf-alert dcf-alert-prompt">
                    <div class="dcf-alert-title">${title}</div>
                    <div class="dcf-alert-message">${message}</div>
                    <input type="text" class="dcf-alert-input" id="dcfPromptInput" value="${defaultValue}" />
                    <div class="dcf-alert-buttons">
                        <button class="dcf-alert-button dcf-alert-cancel" onclick="closeAlert(null)">Cancel</button>
                        <button class="dcf-alert-button dcf-alert-confirm-btn" onclick="closeAlertWithInput()">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', promptHTML);
        document.getElementById('dcfPromptInput').focus();
        
        // Add enter key support
        document.getElementById('dcfPromptInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                closeAlertWithInput();
            }
        });
        
        window.alertResolve = resolve;
    });
}

/**
 * Closes the alert modal
 * @param {*} result - Result to return to the promise
 */
function closeAlert(result = false) {
    const overlay = document.querySelector('.dcf-alert-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    if (window.alertResolve) {
        window.alertResolve(result);
        delete window.alertResolve;
    }
}

/**
 * Closes the alert modal with input value
 */
function closeAlertWithInput() {
    const input = document.getElementById('dcfPromptInput');
    closeAlert(input ? input.value : '');
}

/**
 * Removes any existing alert overlay
 */
function removeExistingAlert() {
    const existing = document.querySelector('.dcf-alert-overlay');
    if (existing) existing.remove();
}

/**
 * Adds CSS for alert modals
 */
function addAlertCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .dcf-alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.2s;
        }
        
        .dcf-alert {
            background: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s;
        }
        
        .dcf-alert-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #1f2937;
        }
        
        .dcf-alert-message {
            margin-bottom: 20px;
            line-height: 1.6;
            color: #4b5563;
        }
        
        .dcf-alert-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        }
        
        .dcf-alert-button:hover {
            background: #2563eb;
        }
        
        .dcf-alert-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        
        .dcf-alert-cancel {
            background: #6b7280;
        }
        
        .dcf-alert-cancel:hover {
            background: #4b5563;
        }
        
        .dcf-alert-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            margin-bottom: 16px;
            font-size: 14px;
        }
        
        .dcf-alert-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    if (!document.querySelector('style[data-dcf-alerts]')) {
        style.setAttribute('data-dcf-alerts', 'true');
        document.head.appendChild(style);
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize DCF UI on DOM ready
 */
function initializeDCFUI() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateUserInterface);
    } else {
        updateUserInterface();
    }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export to window object
window.dcfUI = {
    // Navigation
    populateTopNavigation,
    
    // UI State
    updateUserInterface,
    showLoggedOutState,
    updateLogoText,
    initializeFooter,
    
    // Modals
    showAlert,
    showConfirm,
    showPrompt,
    closeAlert,
    
    // Initialize
    initialize: initializeDCFUI
};

// Also export individual functions for backward compatibility
window.populateTopNavigation = populateTopNavigation;
window.updateUserInterface = updateUserInterface;
window.showLoggedOutState = showLoggedOutState;
window.updateLogoText = updateLogoText;
window.initializeFooter = initializeFooter;
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showPrompt = showPrompt;
window.closeAlert = closeAlert;
window.closeAlertWithInput = closeAlertWithInput;

console.log('✅ DCF UI system loaded');
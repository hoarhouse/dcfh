// ===================================================================
// DCF HUNGARY - MINIMAL UI SYSTEM (NO AUTH)
// AUTHENTICATION DISABLED FOR DEBUGGING
// All Supabase/database functionality removed or mocked
// ===================================================================

console.log('🚀 DCF Minimal System Loading (No Auth)...');

// =============================================================================
// 1. NO SUPABASE CLIENT - COMPLETELY DISABLED
// =============================================================================
// All Supabase initialization removed to prevent hanging

// =============================================================================
// 2. GLOBAL STATE - ALWAYS LOGGED OUT
// =============================================================================
window.dcfUser = {
    isLoggedIn: false,
    profile: null,
    session: null
};

window.isDropdownOpen = false;
window.notificationDropdownOpen = false;

// =============================================================================
// 3. MOCK AUTHENTICATION - ALWAYS RETURNS LOGGED OUT
// =============================================================================
async function initializeAuth() {
    console.log('🔐 Auth disabled - running in minimal mode');
    // Always return false/logged out state
    window.dcfUser = {
        isLoggedIn: false,
        profile: null,
        session: null
    };
    return false;
}

// =============================================================================
// 4. USER INTERFACE FUNCTIONS
// =============================================================================

function updateUserInterface() {
    console.log('🎨 Updating UI (logged out state)...');
    
    // Always show logged out state
    showLoggedOutState();
    
    // Add basic navigation
    addNavigationItems();
    
    // Setup logo
    updateLogoText();
    
    // Add search functionality (UI only)
    addSearchToUserMenu();
}

function showLoggedOutState() {
    console.log('👤 Showing logged-out UI state');
    
    const userSection = document.querySelector('.user-section');
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

function generateInitials(username) {
    if (!username) return '?';
    
    const parts = username.split(/[\s._-]+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
}

// User menu functions (disabled but preserved for onclick handlers)
function toggleUserMenu() {
    console.log('User menu disabled in minimal mode');
}

function openUserMenu() {
    console.log('User menu disabled in minimal mode');
}

function closeUserMenu() {
    // Do nothing - menu is disabled
}

function handleDocumentClick(event) {
    // Simplified - just close any open dropdowns
    window.isDropdownOpen = false;
    window.notificationDropdownOpen = false;
}

function addNavigationItems() {
    console.log('📍 Adding navigation items...');
    
    const navContainer = document.querySelector('.nav-links');
    if (!navContainer) {
        console.log('❌ Navigation container not found');
        return;
    }

    // Clear existing navigation
    navContainer.innerHTML = '';
    
    // Basic navigation structure
    const navHTML = `
        <a href="index.html" class="nav-item">Home</a>
        <div class="nav-item dropdown-trigger">
            <span>About</span>
            <div class="dropdown-menu">
                <a href="about.html">Our Story</a>
                <a href="mission.html">Mission</a>
                <a href="values.html">Values</a>
                <a href="team.html">Team</a>
                <a href="hungary.html">Why Hungary?</a>
            </div>
        </div>
        <div class="nav-item dropdown-trigger">
            <span>Programs</span>
            <div class="dropdown-menu">
                <a href="programs.html">All Programs</a>
                <a href="accelerator.html">Accelerator</a>
                <a href="fellowships.html">Fellowships</a>
                <a href="bootcamps.html">Bootcamps</a>
                <a href="workshops.html">Workshops</a>
                <a href="mentorship.html">Mentorship</a>
            </div>
        </div>
        <div class="nav-item dropdown-trigger">
            <span>Resources</span>
            <div class="dropdown-menu">
                <a href="resources.html">All Resources</a>
                <a href="tools.html">Tools & Templates</a>
                <a href="guides.html">Guides</a>
                <a href="funding.html">Funding Database</a>
                <a href="blog.html">Blog</a>
                <a href="newsletter.html">Newsletter</a>
            </div>
        </div>
        <div class="nav-item dropdown-trigger">
            <span>Community</span>
            <div class="dropdown-menu">
                <a href="projects.html">Projects</a>
                <a href="events.html">Events</a>
                <a href="members.html">Members</a>
                <a href="success-stories.html">Success Stories</a>
                <a href="partners.html">Partners</a>
            </div>
        </div>
        <div class="nav-item dropdown-trigger">
            <span>Innovation</span>
            <div class="dropdown-menu">
                <a href="ai-ml.html">AI/ML Solutions</a>
                <a href="greentech.html">GreenTech</a>
                <a href="healthtech.html">HealthTech</a>
                <a href="blockchain.html">Blockchain</a>
                <a href="smart-cities.html">Smart Cities</a>
            </div>
        </div>
    `;
    
    navContainer.innerHTML = navHTML;
    
    // Add simple dropdown hover functionality
    const dropdowns = navContainer.querySelectorAll('.dropdown-trigger');
    dropdowns.forEach(dropdown => {
        let timeout;
        
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = 'block';
                menu.style.opacity = '1';
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                timeout = setTimeout(() => {
                    menu.style.display = 'none';
                    menu.style.opacity = '0';
                }, 200);
            }
        });
    });
}

function getCorrectBasePath() {
    const currentPath = window.location.pathname;
    const pathDepth = currentPath.split('/').filter(p => p).length;
    
    if (pathDepth === 0 || currentPath === '/' || currentPath === '/index.html') {
        return '';
    } else if (pathDepth === 1) {
        return '';
    } else {
        return '../'.repeat(pathDepth - 1);
    }
}

function populateTopNavigation() {
    console.log('🧭 Populating top navigation...');
    
    const navContainer = document.querySelector('.nav-links');
    if (!navContainer) {
        console.log('Navigation container not found');
        return;
    }

    const basePath = getCorrectBasePath();
    
    // Simplified navigation structure
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

function populateAdminMenu() {
    // Admin menu disabled in minimal mode
    console.log('Admin menu disabled in minimal mode');
}

window.showBlogManagement = function(event) {
    if (event) event.preventDefault();
    console.log('Blog management disabled in minimal mode');
};

function updateLogoText() {
    console.log('🏷️ Updating logo text...');
    
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        logoText.textContent = 'DCF Hungary';
    }
}

function addSearchToUserMenu() {
    console.log('🔍 Adding search functionality...');
    
    const userSection = document.querySelector('.user-section');
    if (!userSection) {
        console.log('User section not found for search');
        return;
    }

    // Check if search already exists
    if (document.querySelector('.search-container')) {
        console.log('Search already exists');
        return;
    }

    // Create search HTML
    const searchHTML = `
        <div class="search-container" id="searchContainer">
            <div class="search-icon" onclick="expandSearch()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <input type="text" 
                   class="search-input" 
                   id="searchInput" 
                   placeholder="Search DCF Hungary..."
                   onkeypress="handleSearchKeypress(event)"
                   style="width: 0; opacity: 0; pointer-events: none;">
        </div>
    `;

    // Insert before first element in user section
    userSection.insertAdjacentHTML('afterbegin', searchHTML);
}

window.expandSearch = function() {
    const container = document.getElementById('searchContainer');
    const input = document.getElementById('searchInput');
    
    if (container && input) {
        container.classList.add('expanded');
        input.style.width = '250px';
        input.style.opacity = '1';
        input.style.pointerEvents = 'auto';
        input.focus();
    }
};

window.collapseSearch = function() {
    const container = document.getElementById('searchContainer');
    const input = document.getElementById('searchInput');
    
    if (container && input) {
        container.classList.remove('expanded');
        input.style.width = '0';
        input.style.opacity = '0';
        input.style.pointerEvents = 'none';
        input.value = '';
    }
};

window.handleSearchKeypress = function(event) {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
        if (searchTerm) {
            // Simple search redirect
            window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
        }
    } else if (event.key === 'Escape') {
        collapseSearch();
    }
};

// Search icon initialization
window.initializeSearchIcons = function() {
    console.log('Initializing search icons...');
};

window.addSearchIconWhenReady = function() {
    console.log('Search icon ready check...');
};

// Logout functions (disabled)
function handleLogout() {
    console.log('Logout disabled in minimal mode');
}

function showLogoutModal() {
    console.log('Logout modal disabled in minimal mode');
}

function closeLogoutModal() {
    // Do nothing
}

async function confirmLogout() {
    console.log('Logout disabled in minimal mode');
}

// Footer functions
function renderFooterIcons() {
    console.log('Footer icons disabled in minimal mode');
}

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
                <p>&copy; 2025 DCF Hungary. All rights reserved.</p>
            </div>
        `;
    }
}

// Newsletter functions (disabled)
function sanitizeEmail(email) {
    return email.trim().toLowerCase();
}

async function subscribeNewsletter() {
    console.log('Newsletter subscription disabled in minimal mode');
    alert('Newsletter subscription is temporarily disabled.');
    return false;
}

// Notification functions (all disabled)
function addNotificationBell() {
    console.log('Notifications disabled in minimal mode');
}

function toggleNotificationDropdown(event) {
    if (event) event.stopPropagation();
    console.log('Notifications disabled in minimal mode');
}

function getNotificationPagePath() {
    return 'notifications.html';
}

function createNotificationDropdown() {
    // Do nothing - notifications disabled
}

async function openNotificationDropdown() {
    console.log('Notifications disabled in minimal mode');
}

function closeNotificationDropdown() {
    window.notificationDropdownOpen = false;
}

function handleNotificationDocumentClick(event) {
    // Do nothing
}

function formatTimeAgo(dateString) {
    return 'some time ago';
}

async function loadNotifications() {
    return [];
}

function createNotificationHTML(notification) {
    return '';
}

function getNotificationIcon(type) {
    return '🔔';
}

async function handleNotificationClick(notificationId, relatedType, relatedId) {
    console.log('Notifications disabled in minimal mode');
}

async function markNotificationRead(notificationId) {
    console.log('Notifications disabled in minimal mode');
}

async function markAllNotificationsRead() {
    console.log('Notifications disabled in minimal mode');
}

// CSS injection functions (keep for styling)
function addNotificationCSS() {
    // Keep minimal CSS for layout
    const style = document.createElement('style');
    style.textContent = `
        .notification-bell { display: none !important; }
        .notification-dropdown { display: none !important; }
    `;
    document.head.appendChild(style);
}

function addNotificationDropdownCSS() {
    // Already handled above
}

// Auth state listener (disabled)
function setupAuthStateListener() {
    console.log('Auth state listener disabled in minimal mode');
}

// User state functions (all return logged out state)
function getCurrentUser() {
    return null;
}

function isUserLoggedIn() {
    return false;
}

function getUserEmail() {
    return null;
}

function getUserName() {
    return null;
}

function getUserId() {
    return null;
}

// Main initialization function
async function initializeDCF() {
    console.log('🚀 Starting DCF Minimal System initialization...');
    
    try {
        // Skip auth initialization - always logged out
        console.log('✅ Running in minimal mode (no auth)');
        
        // Update UI to show logged out state
        updateUserInterface();
        
        // Initialize footer
        initializeFooter();
        
        // Add minimal CSS
        addNotificationCSS();
        
        console.log('✅ DCF Minimal System initialized successfully');
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
}

// Username validation (disabled)
async function validateUsername(username) {
    // Always return valid for minimal mode
    return { isValid: true };
}

// Export all window functions for onclick handlers
window.toggleUserMenu = toggleUserMenu;
window.openUserMenu = openUserMenu;
window.closeUserMenu = closeUserMenu;
window.addNavigationItems = addNavigationItems;
window.handleLogout = handleLogout;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.markAllNotificationsRead = markAllNotificationsRead;
window.handleNotificationClick = handleNotificationClick;
window.markNotificationRead = markNotificationRead;
window.closeNotificationDropdown = closeNotificationDropdown;
window.getCurrentUser = getCurrentUser;
window.isUserLoggedIn = isUserLoggedIn;
window.getUserEmail = getUserEmail;
window.getUserName = getUserName;
window.getUserId = getUserId;
window.validateUsername = validateUsername;
window.initializeDCF = initializeDCF;
window.generateInitials = generateInitials;
window.subscribeNewsletter = subscribeNewsletter;
window.updateUserInterface = updateUserInterface;
window.populateTopNavigation = populateTopNavigation;

// =============================================================================
// ALERT/MODAL SYSTEM (Keep for UI functionality)
// =============================================================================

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
        window.alertResolve = resolve;
    });
}

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

function closeAlertWithInput() {
    const input = document.getElementById('dcfPromptInput');
    closeAlert(input ? input.value : '');
}

function removeExistingAlert() {
    const existing = document.querySelector('.dcf-alert-overlay');
    if (existing) existing.remove();
}

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
        }
        
        .dcf-alert {
            background: white;
            border-radius: 8px;
            padding: 20px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .dcf-alert-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .dcf-alert-message {
            margin-bottom: 20px;
            line-height: 1.5;
        }
        
        .dcf-alert-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .dcf-alert-button:hover {
            background: #2563eb;
        }
        
        .dcf-alert-buttons {
            display: flex;
            gap: 10px;
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
            padding: 8px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            margin-bottom: 15px;
        }
    `;
    
    if (!document.querySelector('style[data-dcf-alerts]')) {
        style.setAttribute('data-dcf-alerts', 'true');
        document.head.appendChild(style);
    }
}

// Export alert functions
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showPrompt = showPrompt;
window.closeAlert = closeAlert;

// =============================================================================
// COMMENT SYSTEM (ALL DISABLED)
// =============================================================================

// All comment functions return empty/disabled state
async function initComments(contentType, contentId, containerId = 'commentsList') {
    console.log('Comments disabled in minimal mode');
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<p style="color: #666;">Comments are temporarily disabled.</p>';
    }
}

async function loadComments() { return []; }
async function displayComments() { }
async function createCommentHtml() { return ''; }
function createReplyHtml() { return ''; }
async function submitComment() { return false; }
async function postComment() { return false; }
async function submitPostComment() { return false; }
async function submitReply() { return false; }
async function deleteComment() { return false; }
function toggleReplyForm() { }
function startEditComment() { }
async function saveEditComment() { return false; }
async function editComment() { return false; }
function cancelEditComment() { }
async function toggleCommentLike() { return false; }
async function updateCommentLikeCount() { }
function updateLikeUI() { }
async function loadUserCommentInteractions() { return {}; }
async function sortComments() { }
async function getTotalCommentCount() { return 0; }
function updateAllCommentUIs() { }
function getTimeAgo() { return 'some time ago'; }
function escapeHtml(text) { return text; }

// Export comment functions for onclick handlers
window.initComments = initComments;
window.loadComments = loadComments;
window.displayComments = displayComments;
window.submitComment = submitComment;
window.postComment = postComment;
window.deleteComment = deleteComment;
window.sortComments = sortComments;
window.loadPostComments = loadComments;
window.submitPostComment = submitPostComment;
window.loadResourceComments = loadComments;
window.loadEventComments = loadComments;
window.postCommentToContent = postComment;
window.editPostComment = editComment;
window.deletePostComment = deleteComment;
window.createCommentHtml = createCommentHtml;
window.createReplyHtml = createReplyHtml;
window.submitReply = submitReply;
window.toggleReplyForm = toggleReplyForm;
window.startEditComment = startEditComment;
window.saveEditComment = saveEditComment;
window.editComment = editComment;
window.cancelEditComment = cancelEditComment;
window.toggleCommentLike = toggleCommentLike;
window.updateCommentLikeCount = updateCommentLikeCount;
window.updateLikeUI = updateLikeUI;
window.loadUserCommentInteractions = loadUserCommentInteractions;
window.getTotalCommentCount = getTotalCommentCount;
window.updateAllCommentUIs = updateAllCommentUIs;
window.getTimeAgo = getTimeAgo;
window.escapeHtml = escapeHtml;

// =============================================================================
// INTERACTION TRACKING (ALL DISABLED)
// =============================================================================

function cleanupCache() { }
async function trackInteraction() { return false; }
async function getInteractionCount() { return 0; }
async function hasUserInteracted() { return false; }
async function toggleInteraction() { return false; }
function updateInteractionUI() { }
async function initializeInteractionButtons() { }
async function trackPageView() { }
function getSessionId() { return 'mock-session'; }
async function loadUserInteractions() { return {}; }
async function trackProjectView() { }
function getProjectIdFromURL() { return null; }
async function getAnalyticsSummary() { return {}; }
async function getBulkInteractionCounts() { return {}; }
async function getUserInteractionHistory() { return []; }
async function initializeAnalyticsButtons() { }

// Export interaction functions
window.trackInteraction = trackInteraction;
window.getInteractionCount = getInteractionCount;
window.hasUserInteracted = hasUserInteracted;
window.toggleInteraction = toggleInteraction;
window.updateInteractionUI = updateInteractionUI;
window.initializeInteractionButtons = initializeInteractionButtons;
window.trackPageView = trackPageView;
window.loadUserInteractions = loadUserInteractions;
window.userInteractions = {};
window.getSessionId = getSessionId;
window.trackProjectView = trackProjectView;
window.getProjectIdFromURL = getProjectIdFromURL;
window.getAnalyticsSummary = getAnalyticsSummary;
window.getBulkInteractionCounts = getBulkInteractionCounts;
window.getUserInteractionHistory = getUserInteractionHistory;
window.initializeAnalyticsButtons = initializeAnalyticsButtons;

// =============================================================================
// ICON SYSTEM (SIMPLIFIED - NO DATABASE)
// =============================================================================

async function getIcon(iconName, size = 'standard', ariaLabel = '') {
    // Return simple fallback icons
    return createFallbackIcon(iconName, size, ariaLabel);
}

function createIconHTML(svgContent, iconName, size, ariaLabel) {
    const sizeClass = `icon-${size}`;
    const ariaAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';
    return `<span class="dcf-icon ${sizeClass}" data-icon="${iconName}" ${ariaAttr}>${svgContent}</span>`;
}

function createFallbackIcon(iconName, size, ariaLabel) {
    // Simple text-based fallback
    const iconMap = {
        'home': '🏠',
        'user': '👤',
        'settings': '⚙️',
        'search': '🔍',
        'menu': '☰',
        'close': '✕',
        'arrow-right': '→',
        'arrow-left': '←',
        'chevron-down': '▼',
        'chevron-up': '▲'
    };
    
    const icon = iconMap[iconName] || '●';
    return createIconHTML(icon, iconName, size, ariaLabel);
}

window.getIcon = getIcon;

// Memory cleanup
window.dcfCleanupMemory = function() {
    console.log('Memory cleanup not needed in minimal mode');
};

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, starting minimal DCF initialization...');
    
    // Initialize immediately without delay
    initializeDCF();
});

// Fallback for pages where DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('📄 DOM already loaded, starting immediate initialization...');
    initializeDCF();
}

// Add basic CSS
addAlertCSS();

console.log('✅ DCF Minimal System loaded successfully');
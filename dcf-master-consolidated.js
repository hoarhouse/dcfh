// DCF Hungary Master Consolidated JavaScript - COMPLETE
// Combines: universal-navbar.js + universal-quick-actions.js + quickactions.js + footer functionality

// =============================================================================
// 1. USER MENU FUNCTIONALITY (from universal-navbar.js)
// =============================================================================
let isDropdownOpen = false;

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    
    if (isDropdownOpen) {
        closeUserMenu();
    } else {
        openUserMenu();
    }
}

function openUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    
    dropdown.classList.add('active');
    isDropdownOpen = true;
    updateUserDropdownInfo();
    addNavigationItems();
    
    setTimeout(() => {
        document.addEventListener('click', handleDocumentClick, true);
    }, 10);
}

function closeUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    
    dropdown.classList.remove('active');
    isDropdownOpen = false;
    document.removeEventListener('click', handleDocumentClick, true);
}

function handleDocumentClick(event) {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown && !userDropdown.contains(event.target)) {
        closeUserMenu();
    }
}

function updateUserDropdownInfo() {
    const userName = localStorage.getItem('dcf_user_name') || 'Dr. Sarah Johnson';
    const userEmail = localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org';
    const authProvider = localStorage.getItem('dcf_auth_provider') || 'demo';

    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');

    if (nameElement) nameElement.textContent = userName;
    if (emailElement) {
        if (authProvider === 'github') {
            emailElement.textContent = `${userEmail} (GitHub)`;
        } else {
            emailElement.textContent = userEmail;
        }
    }

    const initials = generateInitials(userName);
    const avatarElement = document.getElementById('userAvatar');
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');

    if (avatarElement) {
        avatarElement.textContent = initials;
        // Add neon green styling to indicate master JS is active
        avatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
        avatarElement.style.boxShadow = '0 0 10px #00ff00';
    }
    if (dropdownAvatarElement) {
        dropdownAvatarElement.textContent = initials;
        dropdownAvatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
    }
}

function generateInitials(name) {
    if (!name) return 'SJ';
    
    const cleanName = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.|Rev\.|Fr\.|Sr\.)\s+/i, '');
    const parts = cleanName.split(' ');
    
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
}

function addNavigationItems() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown || dropdown.querySelector('.nav-item')) return;

    const currentPage = window.location.pathname.split('/').pop();
    
    const navigationItems = [
        { href: 'dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: 'dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: 'dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: 'dcf_projects_home.html', icon: '📋', text: 'My Projects' },
        { href: 'dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: 'dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },
        { href: 'dcf_account_settings.html', icon: '⚙️', text: 'Settings' }
    ];

    const navSection = document.createElement('div');
    navSection.innerHTML = '<div class="dropdown-divider"></div>';

    navigationItems
        .filter(item => item.href !== currentPage)
        .forEach(item => {
            const navItem = document.createElement('a');
            navItem.href = item.href;
            navItem.className = 'dropdown-item nav-item';
            navItem.innerHTML = `
                <span class="dropdown-icon">${item.icon}</span>
                ${item.text}
            `;
            navSection.appendChild(navItem);
        });

    const logoutItem = document.createElement('div');
    logoutItem.innerHTML = `
        <div class="dropdown-divider"></div>
        <button onclick="handleLogout()" class="dropdown-item logout-btn">
            <span class="dropdown-icon">🚪</span>
            Sign Out
        </button>
    `;
    navSection.appendChild(logoutItem);

    const dropdownHeader = dropdown.querySelector('.dropdown-header');
    if (dropdownHeader && dropdownHeader.nextSibling) {
        dropdown.insertBefore(navSection, dropdownHeader.nextSibling);
    } else if (dropdownHeader) {
        dropdown.appendChild(navSection);
    }
}

function handleLogout() {
    closeUserMenu();
    
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('dcf_github_session');
        localStorage.removeItem('dcf_user_logged_in');
        localStorage.removeItem('dcf_user_name');
        localStorage.removeItem('dcf_user_email');
        localStorage.removeItem('dcf_auth_provider');
        localStorage.removeItem('dcf_remember_login');
        sessionStorage.clear();
        
        window.location.href = 'dcf_login_page.html';
    }
}

// =============================================================================
// 2. TOP NAVIGATION FUNCTIONALITY
// =============================================================================
function populateTopNavigation() {
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    // Clear existing nav items
    navMenu.innerHTML = '';
    
    let navItems = [];
    
    if (!isLoggedIn) {
        // Not logged in: Show Home, About, Contact (excluding current page)
        const publicNav = [
            { href: 'index.html', text: 'Home' },
            { href: 'dcf_about.html', text: 'About' },
            { href: 'dcf_contact.html', text: 'Contact' }
        ];
        navItems = publicNav.filter(item => item.href !== currentPage);
    } else {
        // Logged in: Show only Contact (excluding if on contact page)
        if (currentPage !== 'dcf_contact.html') {
            navItems = [{ href: 'dcf_contact.html', text: 'Contact' }];
        }
    }
    
    // Create and append nav items
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.text;
        li.appendChild(a);
        navMenu.appendChild(li);
    });
}

// =============================================================================
// 3. QUICK ACTIONS CONFIGURATION (from quickactions.js)
// =============================================================================
const quickActionsConfig = {
    'dcf_projects_home.html': [
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '📁', text: 'My Projects', action: 'dcf_projects.html', type: 'secondary' },
        { icon: '📊', text: 'View Analytics', action: 'dcf_personal_analytics.html', type: 'secondary' },
        { icon: '📅', text: 'Events Calendar', action: 'dcf_events_calendar.html', type: 'secondary' },
        { icon: '💬', text: 'Discussion Forum', action: 'dcf_member_home.html', type: 'secondary' }
    ],
    'dcf_projects.html': [
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '📊', text: 'Analytics', action: 'dcf_personal_analytics.html', type: 'secondary' },
        { icon: '📅', text: 'Events Calendar', action: 'dcf_events_calendar.html', type: 'secondary' },
        { icon: '💬', text: 'Discussion Board', action: 'dcf_member_home.html', type: 'secondary' }
    ],
    'dcf_create_project.html': [
        { icon: '📁', text: 'My Projects', action: 'dcf_projects.html', type: 'secondary' },
        { icon: '🌍', text: 'All Projects', action: 'dcf_projects_home.html', type: 'secondary' },
        { icon: '📊', text: 'Analytics', action: 'dcf_personal_analytics.html', type: 'secondary' }
    ],
    'dcf_events_calendar.html': [
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'primary' },
        { icon: '📅', text: 'My Events', action: 'dcf_events.html', type: 'secondary' },
        { icon: '📊', text: 'Event Analytics', action: 'dcf_event_analytics.html', type: 'secondary' },
        { icon: '💬', text: 'Event Discussions', action: 'dcf_member_home.html', type: 'secondary' }
    ],
    'dcf_member_home.html': [
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'primary' },
        { icon: '👤', text: 'Edit Profile', action: 'dcf_member_profile.html', type: 'secondary' },
        { icon: '💬', text: 'Messages', action: 'dcf_messages.html', type: 'secondary' }
    ],
    'dcf_members_directory.html': [
        { icon: '👥', text: 'Find Members', action: 'javascript:focusSearchMembers()', type: 'primary' },
        { icon: '🤝', text: 'Connect with Members', action: 'javascript:connectWithMembers()', type: 'secondary' },
        { icon: '📊', text: 'Member Analytics', action: 'dcf_personal_analytics.html', type: 'secondary' },
        { icon: '💬', text: 'Messages', action: 'dcf_messages.html', type: 'secondary' }
    ],
    'dcf_resources_library.html': [
        { icon: '📄', text: 'Upload Resource', action: 'dcf_upload_resource.html', type: 'primary' },
        { icon: '📚', text: 'Learning Materials', action: 'dcf_learning_materials.html', type: 'secondary' },
        { icon: '💬', text: 'Discussion Board', action: 'dcf_discussion_board.html', type: 'secondary' },
        { icon: '🔍', text: 'Advanced Search', action: 'javascript:advancedSearch()', type: 'secondary' }
    ],
    'default': [
        { icon: '🏠', text: 'Dashboard', action: 'dcf_member_home.html', type: 'secondary' },
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'secondary' },
        { icon: '💬', text: 'Messages', action: 'dcf_messages.html', type: 'secondary' }
    ]
};

// =============================================================================
// 4. QUICK ACTIONS FUNCTIONALITY (from universal-quick-actions.js)
// =============================================================================
function initializeQuickActions() {
    const currentPage = getCurrentPageType();
    const quickActionsContainer = findQuickActionsContainer();
    
    if (!quickActionsContainer) {
        return;
    }
    
    updateQuickActions(currentPage, quickActionsContainer);
}

function findQuickActionsContainer() {
    const quickActionsCards = document.querySelectorAll('.card');
    
    for (let card of quickActionsCards) {
        const title = card.querySelector('.card-title');
        if (title && title.textContent.includes('Quick Actions')) {
            return card;
        }
    }
    
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        return sidebar.querySelector('.card');
    }
    
    return null;
}

function getCurrentPageType() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop();
    
    if (filename.includes('projects_home') || filename.includes('project_detail')) {
        return 'projects';
    }
    if (filename.includes('create_project')) {
        return 'create_project';
    }
    if (filename === 'dcf_projects.html') {
        return 'my_projects';
    }
    if (filename.includes('events_calendar') || filename.includes('event_details')) {
        return 'events';
    }
    if (filename.includes('create_event')) {
        return 'create_event';
    }
    if (filename.includes('members_directory') || filename.includes('member_view')) {
        return 'members';
    }
    if (filename.includes('resources_library') || filename.includes('resource_detail')) {
        return 'resources';
    }
    if (filename.includes('member_home')) {
        return 'home_feed';
    }
    
    return 'default';
}

function updateQuickActions(pageType, container) {
    const title = container.querySelector('.card-title');
    let actionsDiv = container.querySelector('div[style*="flex-direction: column"]');
    
    if (!actionsDiv) {
        actionsDiv = container.querySelector('div');
        if (actionsDiv && !actionsDiv.querySelector('button, .btn')) {
            actionsDiv = document.createElement('div');
            actionsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
            container.appendChild(actionsDiv);
        }
    }
    
    if (!title || !actionsDiv) {
        return;
    }
    
    title.textContent = 'Quick Actions';
    const actionsHTML = getQuickActionsHTML(pageType);
    actionsDiv.innerHTML = actionsHTML;
}

function getQuickActionsHTML(pageType) {
    switch (pageType) {
        case 'projects':
            return `
                <button class="btn btn-primary" onclick="focusSearchProjects()">
                    🔍 Search Projects
                </button>
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_project.html'">
                    ➕ Create Project
                </button>
                <button class="btn btn-secondary" onclick="exploreJoinableProjects()">
                    🤝 Join Project
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects.html'">
                    📊 Manage My Projects
                </button>
            `;
        case 'events':
            return `
                <button class="btn btn-primary" onclick="focusSearchEvents()">
                    📅 Find Events
                </button>
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_event.html'">
                    ➕ Create Event
                </button>
                <button class="btn btn-secondary" onclick="exploreUpcomingEvents()">
                    🎟️ Register for Events
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_events.html'">
                    📋 My Event Calendar
                </button>
            `;
        case 'members':
            return `
                <button class="btn btn-primary" onclick="focusSearchMembers()">
                    👥 Find Members
                </button>
                <button class="btn btn-secondary" onclick="connectWithMembers()">
                    🤝 Connect with Members
                </button>
                <button class="btn btn-secondary" onclick="showComingSoon('My Network')">
                    🌐 View My Network
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_personal_analytics.html'">
                    📊 Member Analytics
                </button>
            `;
        case 'resources':
            return `
                <button class="btn btn-primary" onclick="focusSearchResources()">
                    📚 Browse Library
                </button>
                <button class="btn btn-primary" onclick="window.location.href='dcf_resource_upload.html'">
                    ⬆️ Upload Resource
                </button>
                <button class="btn btn-secondary" onclick="viewMyContributions()">
                    📝 My Contributions
                </button>
                <button class="btn btn-secondary" onclick="viewBookmarks()">
                    🔖 My Bookmarks
                </button>
            `;
        case 'home_feed':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_project.html'">
                    🚀 Create Project
                </button>
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_event.html'">
                    📅 Create Event
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_members_directory.html'">
                    👥 Find Collaborators
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_personal_analytics.html'">
                    📊 View My Stats
                </button>
            `;
        default:
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_project.html'">
                    🚀 Create Project
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_personal_analytics.html'">
                    📊 View Analytics
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_events_calendar.html'">
                    📅 Events Calendar
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_member_home.html'">
                    💬 Discussion Forum
                </button>
            `;
    }
}

// Quick Actions Helper Functions
function focusSearchProjects() {
    const searchInput = document.querySelector('#projectSearch, .search-input, input[placeholder*="Search projects"], input[placeholder*="search projects"]');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = 'dcf_projects_home.html';
    }
}

function exploreJoinableProjects() {
    if (window.location.pathname.includes('projects_home')) {
        const recruitingBtn = document.querySelector('.category-btn[data-category="recruiting"], button[data-category="recruiting"]');
        if (recruitingBtn) {
            recruitingBtn.click();
        }
    } else {
        window.location.href = 'dcf_projects_home.html?filter=recruiting';
    }
}

function focusSearchEvents() {
    const searchInput = document.querySelector('#eventSearch, .search-input, input[placeholder*="Search events"], input[placeholder*="search events"]');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = 'dcf_events_calendar.html';
    }
}

function exploreUpcomingEvents() {
    if (window.location.pathname.includes('events_calendar')) {
        const upcomingSection = document.querySelector('.upcoming-events, .events-grid');
        if (upcomingSection) {
            upcomingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        window.location.href = 'dcf_events_calendar.html';
    }
}

function focusSearchMembers() {
    const searchInput = document.querySelector('#memberSearch, .search-input, input[placeholder*="Search members"], input[placeholder*="search members"]');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = 'dcf_members_directory.html';
    }
}

function connectWithMembers() {
    window.location.href = 'dcf_members_directory.html';
}

function focusSearchResources() {
    const searchInput = document.querySelector('#resourceSearch, .search-input, input[placeholder*="Search resources"], input[placeholder*="search resources"]');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = 'dcf_resources_library.html';
    }
}

function viewMyContributions() {
    window.location.href = 'dcf_resources_library.html?filter=my_contributions';
}

function viewBookmarks() {
    window.location.href = 'dcf_resources_library.html?filter=bookmarks';
}

function showComingSoon(feature) {
    alert(`${feature} page coming soon!`);
}

// =============================================================================
// 5. FOOTER FUNCTIONALITY
// =============================================================================
function initializeFooter() {
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <div class="footer-logo-icon"></div>
                        <span class="footer-logo-text">DCF Hungary</span>
                    </div>
                </div>
                <div class="footer-section">
                    <h4 class="footer-title">Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="#mission">About Us</a></li>
                        <li><a href="dcf_contact.html">Contact</a></li>
                        <li><a href="dcf_login_page.html">Member Login</a></li>
                        <li><a href="dcf_profile_signup.html">Join Us</a></li>
                        <li><a href="dcf_sitemap.html">Site Map</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>

    <style>
    .site-footer { background: #1a1a1a; color: #ffffff; padding: 2rem 0; margin-top: 2rem; }
    .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    .footer-content { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .footer-logo { display: flex; align-items: center; }
    .footer-logo-icon { width: 32px; height: 32px; background: #ffffff; border-radius: 50%; margin-right: 0.75rem; }
    .footer-logo-text { font-size: 1.4rem; font-weight: 700; }
    .footer-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }
    .footer-links { list-style: none; padding: 0; }
    .footer-links li { margin-bottom: 0.5rem; }
    .footer-links a { color: #cccccc; text-decoration: none; }
    .footer-links a:hover { color: #ffffff; }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// =============================================================================
// 6. PAGE TYPE DETECTION AND PUBLIC PAGE HANDLING
// =============================================================================
function getPageType() {
    return 'public';
}

function handlePublicPageAuth() {
    const userMenu = document.querySelector('.user-menu');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userAvatar && userMenu) {
        userMenu.innerHTML = `
            <a href="dcf_profile_signup.html" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                Join DCF Hungary
            </a>
        `;
    }
}

// =============================================================================
// 7. MAIN INITIALIZATION - EVERYTHING HAPPENS HERE
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    const pageType = getPageType();
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in') === 'true';
    
    // Initialize top navigation for all pages
    populateTopNavigation();
    
    // Initialize footer for all pages
    setTimeout(initializeFooter, 50);
    
    if (pageType === 'member') {
        // Member pages require login
        if (!isLoggedIn) {
            window.location.href = 'https://hoarhouse.github.io/dcfh/dcf_login_page.html';
            return;
        }
        
        // Initialize member page components
        updateUserDropdownInfo();
        
        // Initialize Quick Actions with delay for DOM readiness
        setTimeout(initializeQuickActions, 100);
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isDropdownOpen) {
                closeUserMenu();
            }
        });
        
    } else if (pageType === 'public') {
        // Public pages - show sign up button instead of avatar
        if (!isLoggedIn) {
            handlePublicPageAuth();
        } else {
            // Logged in user on public page - show avatar
            updateUserDropdownInfo();
        }
    }
});

// =============================================================================
// 8. GLOBAL FUNCTIONS - MAKE FUNCTIONS AVAILABLE TO HTML
// =============================================================================
window.toggleUserMenu = toggleUserMenu;
window.handleLogout = handleLogout;
window.focusSearchProjects = focusSearchProjects;
window.exploreJoinableProjects = exploreJoinableProjects;
window.focusSearchEvents = focusSearchEvents;
window.exploreUpcomingEvents = exploreUpcomingEvents;
window.focusSearchMembers = focusSearchMembers;
window.connectWithMembers = connectWithMembers;
window.focusSearchResources = focusSearchResources;
window.viewMyContributions = viewMyContributions;
window.viewBookmarks = viewBookmarks;
window.showComingSoon = showComingSoon;
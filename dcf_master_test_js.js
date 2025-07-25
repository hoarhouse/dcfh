// DCF Hungary Master JavaScript - Test Version
// Consolidates all navigation, user menu, quick actions, and footer functionality

// NAVIGATION CONFIGURATION
const navigationConfig = {
    logo: {
        href: 'index.html',
        text: 'Domus Communis Foundation Hungary'
    },
    menuItems: [
        { href: 'dcf_member_home.html', text: 'Home', id: 'home' },
        { href: 'dcf_members_directory.html', text: 'Members', id: 'members' },
        { href: 'dcf_projects_home.html', text: 'Projects', id: 'projects' },
        { href: 'dcf_events_calendar.html', text: 'Events', id: 'events' },
        { href: 'dcf_resources_library.html', text: 'Resources', id: 'resources' }
    ]
};

// QUICK ACTIONS CONFIGURATION
const quickActionsConfig = {
    'dcf_projects_home.html': [
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '📊', text: 'View Analytics', action: 'dcf_personal_analytics.html', type: 'secondary' },
        { icon: '📅', text: 'Events Calendar', action: 'dcf_events_calendar.html', type: 'secondary' },
        { icon: '💬', text: 'Discussion Forum', action: 'dcf_member_home.html', type: 'secondary' }
    ],
    'dcf_member_home.html': [
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'primary' },
        { icon: '👤', text: 'Edit Profile', action: 'dcf_member_profile.html', type: 'secondary' },
        { icon: '💬', text: 'Messages', action: 'dcf_messages.html', type: 'secondary' }
    ],
    'default': [
        { icon: '🏠', text: 'Dashboard', action: 'dcf_member_home.html', type: 'secondary' },
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'secondary' },
        { icon: '💬', text: 'Messages', action: 'dcf_messages.html', type: 'secondary' }
    ]
};

// USER DROPDOWN NAVIGATION
const userDropdownItems = [
    { href: 'dcf_member_home.html', icon: '🏠', text: 'My Feed' },
    { href: 'dcf_member_profile.html', icon: '👤', text: 'My Profile' },
    { href: 'dcf_members_directory.html', icon: '👥', text: 'My Connections' },
    { href: 'dcf_projects_home.html', icon: '📋', text: 'My Projects' },
    { href: 'dcf_events_calendar.html', icon: '📅', text: 'My Events' },
    { href: 'dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },
    { href: 'dcf_account_settings.html', icon: '⚙️', text: 'Settings' }
];

// GLOBAL STATE
let isDropdownOpen = false;

// NAVIGATION GENERATION
function generateNavigation() {
    const navContainer = document.getElementById('mainNavigation');
    if (!navContainer) {
        console.error('Navigation container not found');
        return;
    }

    const currentPage = window.location.pathname.split('/').pop();
    console.log('Generating navigation for page:', currentPage);

    navContainer.innerHTML = `
        <a href="${navigationConfig.logo.href}" class="logo">
            <div class="logo-icon"></div>
            ${navigationConfig.logo.text}
        </a>
        <ul class="nav-menu">
            ${navigationConfig.menuItems.map(item => `
                <li><a href="${item.href}" class="${currentPage === item.href ? 'active' : ''}">${item.text}</a></li>
            `).join('')}
        </ul>
        <div class="user-menu">
            <div class="user-dropdown">
                <div class="user-avatar" onclick="toggleUserMenu()" id="userAvatar">SJ</div>
                <div class="dropdown-menu" id="userDropdown">
                    <div class="dropdown-header">
                        <div class="dropdown-avatar">SJ</div>
                        <div class="dropdown-info">
                            <div class="dropdown-name" id="dropdownUserName">Dr. Sarah Johnson</div>
                            <div class="dropdown-email" id="dropdownUserEmail">sarah.johnson@dcfhungary.org</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('Navigation generated successfully');
}

// USER MENU FUNCTIONS
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

    if (avatarElement) avatarElement.textContent = initials;
    if (dropdownAvatarElement) dropdownAvatarElement.textContent = initials;
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
    
    const navSection = document.createElement('div');
    navSection.innerHTML = '<div class="dropdown-divider"></div>';

    userDropdownItems
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

// QUICK ACTIONS GENERATION
function generateQuickActions() {
    const container = document.getElementById('quickActionsContainer');
    if (!container) {
        console.error('Quick actions container not found');
        return;
    }

    const currentPage = window.location.pathname.split('/').pop();
    const actions = quickActionsConfig[currentPage] || quickActionsConfig['default'];
    
    console.log('Generating quick actions for page:', currentPage, 'Actions:', actions);

    container.innerHTML = `
        <div class="card">
            <h3 class="card-title">Quick Actions</h3>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${actions.map(action => `
                    <button class="btn btn-${action.type}" onclick="handleQuickAction('${action.action}')">
                        ${action.icon} ${action.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    console.log('Quick actions generated successfully');
}

function handleQuickAction(action) {
    if (action.startsWith('javascript:')) {
        // Handle JavaScript actions
        const func = action.replace('javascript:', '');
        try {
            eval(func);
        } catch (e) {
            console.log('Quick action function not implemented:', func);
        }
    } else {
        // Handle navigation actions
        window.location.href = action;
    }
}

// FOOTER GENERATION
function generateFooter() {
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
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('DCF Master JS initializing...');
    
    // Check authentication
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in');
    if (isLoggedIn !== 'true') {
        console.log('User not logged in, redirecting...');
        window.location.href = 'dcf_login_page.html';
        return;
    }

    console.log('User is logged in, generating components...');

    // Generate all components
    generateNavigation();
    generateQuickActions();
    generateFooter();
    updateUserDropdownInfo();

    console.log('All components generated');

    // ESC key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDropdownOpen) {
            closeUserMenu();
        }
    });
});

// Make functions globally available
window.toggleUserMenu = toggleUserMenu;
window.handleLogout = handleLogout;
window.handleQuickAction = handleQuickAction;
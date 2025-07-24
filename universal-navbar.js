// DCF Hungary Universal Navbar - Complete Working Implementation
// Chris - Replace your entire universal-navbar.js file with this code

let isDropdownOpen = false;

// Core toggle function - called by onclick="toggleUserMenu()" in HTML
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
    
    // Add document click listener ONLY when dropdown opens
    setTimeout(() => {
        document.addEventListener('click', handleDocumentClick, true);
    }, 10);
}

function closeUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    
    dropdown.classList.remove('active');
    isDropdownOpen = false;
    
    // Remove document click listener when dropdown closes
    document.removeEventListener('click', handleDocumentClick, true);
}

// Critical click-away handler - this is where previous versions failed
function handleDocumentClick(event) {
    const userDropdown = document.querySelector('.user-dropdown');
    
    // If click is outside the entire user dropdown area, close menu
    if (userDropdown && !userDropdown.contains(event.target)) {
        closeUserMenu();
    }
}

// Update dropdown with user info from localStorage
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

    // Update avatar initials
    const initials = generateInitials(userName);
    const avatarElement = document.getElementById('userAvatar');
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');

    if (avatarElement) avatarElement.textContent = initials;
    if (dropdownAvatarElement) dropdownAvatarElement.textContent = initials;
}

// Generate user initials for avatar
function generateInitials(name) {
    if (!name) return 'SJ';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Add navigation items to dropdown
function addNavigationItems() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;

    // Check if navigation already added
    if (dropdown.querySelector('.nav-item')) return;

    const currentPage = window.location.pathname.split('/').pop();
    
    const navigationItems = [
        { href: 'dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: 'dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: 'dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: 'dcf_projects_home.html', icon: '📋', text: 'My Projects' },
        { href: 'dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: 'dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },
        { href: 'dcf_settings.html', icon: '⚙️', text: 'Settings' }
    ];

    // Create navigation section
    const navSection = document.createElement('div');
    navSection.innerHTML = '<div class="dropdown-divider"></div>';

    // Add filtered navigation items (exclude current page)
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

    // Add logout item
    const logoutItem = document.createElement('div');
    logoutItem.innerHTML = `
        <div class="dropdown-divider"></div>
        <button onclick="handleLogout()" class="dropdown-item logout-btn">
            <span class="dropdown-icon">🚪</span>
            Sign Out
        </button>
    `;
    navSection.appendChild(logoutItem);

    // Insert after dropdown header
    const dropdownHeader = dropdown.querySelector('.dropdown-header');
    if (dropdownHeader && dropdownHeader.nextSibling) {
        dropdown.insertBefore(navSection, dropdownHeader.nextSibling);
    } else if (dropdownHeader) {
        dropdown.appendChild(navSection);
    }
}

// Handle user logout
function handleLogout() {
    closeUserMenu();
    
    if (confirm('Are you sure you want to sign out?')) {
        // Clear all stored data
        localStorage.removeItem('dcf_github_session');
        localStorage.removeItem('dcf_user_logged_in');
        localStorage.removeItem('dcf_user_name');
        localStorage.removeItem('dcf_user_email');
        localStorage.removeItem('dcf_auth_provider');
        localStorage.removeItem('dcf_remember_login');
        sessionStorage.clear();
        
        // Redirect to login
        window.location.href = 'dcf_login_page.html';
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in');
    if (isLoggedIn !== 'true') {
        window.location.href = 'dcf_login_page.html';
        return;
    }

    // Initialize user info
    updateUserDropdownInfo();

    // ESC key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDropdownOpen) {
            closeUserMenu();
        }
    });
});

// Make functions globally available for HTML onclick attributes
window.toggleUserMenu = toggleUserMenu;
window.handleLogout = handleLogout;
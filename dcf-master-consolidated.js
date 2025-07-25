// DCF Hungary Master Consolidated JavaScript
// Combines: universal-navbar.js + universal-quick-actions.js + footer functionality

// USER MENU FUNCTIONALITY (from universal-navbar.js)
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

// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    const pageType = getPageType();
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in') === 'true';
    
    if (pageType === 'member') {
        // Member pages require login
        if (!isLoggedIn) {
            window.location.href = 'dcf_login_page.html';
            return;
        }
        
        // Initialize member page components
        updateUserDropdownInfo();
        populateTopNavigation();
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isDropdownOpen) {
                closeUserMenu();
            }
        });
        
    } else if (pageType === 'public') {
        // Public pages - show sign up button instead of avatar
        if (!isLoggedIn) {
            handlePublicPageAuth();
            populateTopNavigation();
        } else {
            // Logged in user on public page - show avatar
            updateUserDropdownInfo();
            populateTopNavigation();
        }
    }
});

function getPageType() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop();
    
    // Public pages (no login required)
    if (filename === 'index.html' || filename === '' || 
        filename.includes('contact') || filename.includes('about') ||
        filename.includes('login') || filename.includes('signup')) {
        return 'public';
    }
    
    // Member pages (login required)
    if (filename.includes('dcf_member') || filename.includes('dcf_projects') ||
        filename.includes('dcf_events') || filename.includes('dcf_resources') ||
        filename.includes('dcf_admin') || filename.includes('dcf_personal') ||
        filename.includes('dcf_account_settings')) {
        return 'member';
    }
    
    // Default to public if unsure
    return 'public';
}

function handlePublicPageAuth() {
    // For public pages, replace user avatar with Sign Up button if present
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

function populateTopNavigation() {
    const navMenu = document.getElementById('navMenu');
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
            { href: 'about.html', text: 'About' },
            { href: 'contact.html', text: 'Contact' }
        ];
        navItems = publicNav.filter(item => item.href !== currentPage);
    } else {
        // Logged in: Show only Contact (excluding if on contact page)
        if (currentPage !== 'contact.html') {
            navItems = [{ href: 'contact.html', text: 'Contact' }];
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

// GLOBAL FUNCTIONS
window.toggleUserMenu = toggleUserMenu;
window.handleLogout = handleLogout;
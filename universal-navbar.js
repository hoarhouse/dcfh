// universal-navbar.js - Clean working version

let isDropdownOpen = false;

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    const overlay = getOrCreateOverlay();
    
    if (isDropdownOpen) {
        closeUserMenu();
    } else {
        openUserMenu();
    }
}

function openUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    const overlay = getOrCreateOverlay();
    
    dropdown.classList.add('active');
    dropdown.style.opacity = '1';
    dropdown.style.visibility = 'visible';
    dropdown.style.transform = 'translateY(0)';
    overlay.classList.add('active');
    isDropdownOpen = true;
    
    updateUserDropdownInfo();
}

function closeUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    const overlay = document.querySelector('.dropdown-overlay');
    
    dropdown.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    isDropdownOpen = false;
}

function getOrCreateOverlay() {
    let overlay = document.querySelector('.dropdown-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'dropdown-overlay';
        overlay.addEventListener('click', closeUserMenu);
        document.body.appendChild(overlay);
    }
    return overlay;
}

function updateUserDropdownInfo() {
    const userName = localStorage.getItem('dcf_user_name') || 'Dr. Sarah Johnson';
    const userEmail = localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org';

    // Update user info in dropdown header
    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');
    if (nameElement) nameElement.textContent = userName;
    if (emailElement) emailElement.textContent = userEmail;

    // Generate and update initials
    const initials = generateInitials(userName);
    const avatarElement = document.getElementById('userAvatar');
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');
    if (avatarElement) avatarElement.textContent = initials;
    if (dropdownAvatarElement) dropdownAvatarElement.textContent = initials;

    // Add navigation if not already present
    addNavigationItems();
}

function addNavigationItems() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;

    // Check if navigation already exists
    const existingItems = dropdown.querySelectorAll('.dropdown-item');
    if (existingItems.length > 0) return; // Already added

    // Create navigation HTML
   // Get current page to hide it from dropdown
    const currentPage = window.location.pathname.split('/').pop() || 'dcf_member_home.html';
    
    const allLinks = [
        { href: 'dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: 'dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: 'dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: 'dcf_projects.html', icon: '📋', text: 'My Projects' },
        { href: 'dcf_events.html', icon: '📅', text: 'My Events' },
        { href: 'dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },
        { href: 'dcf_account_settings.html', icon: '⚙️', text: 'Settings' }
    ];
    
    // Filter out current page
    const visibleLinks = allLinks.filter(link => link.href !== currentPage);
    
    // Build navigation HTML
    let navigationHTML = '<div class="dropdown-divider"></div>';
    visibleLinks.forEach(link => {
        navigationHTML += `
            <a href="${link.href}" class="dropdown-item">
                <span class="dropdown-icon">${link.icon}</span>
                ${link.text}
            </a>
        `;
    });
    navigationHTML += `
        <div class="dropdown-divider"></div>
        <button onclick="handleLogout()" class="dropdown-item logout-btn">
            <span class="dropdown-icon">🚪</span>
            Sign Out
        </button>
    `;

    // Add to dropdown after header
    const header = dropdown.querySelector('.dropdown-header');
    if (header) {
        header.insertAdjacentHTML('afterend', navigationHTML);
    }
}

function generateInitials(name) {
    if (!name) return 'SJ';
    const parts = name.split(' ').filter(part => !['Dr.', 'Mr.', 'Ms.', 'Mrs.', 'Prof.'].includes(part));
    
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return 'SJ';
}

function handleLogout() {
    closeUserMenu();
    setTimeout(() => {
        if(confirm('Are you sure you want to sign out?')){
            localStorage.clear();
            sessionStorage.clear();
            window.location.href='dcf_login_page.html';
        }
    }, 100);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUserDropdownInfo();

    // Check login status for member pages
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in');
    if (isLoggedIn !== 'true') {
        const currentPage = window.location.pathname;
        const publicPages = ['index.html', 'dcf_login_page.html', 'dcf_profile_signup.html'];
        const isPublicPage = publicPages.some(page => currentPage.includes(page)) || currentPage === '/';
        
        if (!isPublicPage) {
            window.location.href = 'dcf_login_page.html';
        }
    }

    // Close dropdown on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDropdownOpen) {
            closeUserMenu();
        }
    });

  // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const userDropdown = document.getElementById('userDropdown');
        const userAvatar = document.getElementById('userAvatar');
        
        if (isDropdownOpen && 
            !userDropdown.contains(e.target) && 
            !userAvatar.contains(e.target)) {
            closeUserMenu();
        }
    });
});
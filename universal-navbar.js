// universal-navbar.js - Ultra simple approach

let dropdownOpen = false;

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    
    if (dropdownOpen) {
        // Close dropdown
        dropdown.classList.remove('active');
        dropdownOpen = false;
    } else {
        // Open dropdown
        dropdown.classList.add('active');
        dropdownOpen = true;
        updateUserDropdownInfo();
    }
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
    if(confirm('Are you sure you want to sign out?')){
        localStorage.clear();
        sessionStorage.clear();
        window.location.href='dcf_login_page.html';
    }
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

    // Simple click-away handler
    document.addEventListener('click', function(event) {
        // Only check if dropdown is open
        if (!dropdownOpen) return;
        
        // Check if click was on avatar or inside dropdown
        const avatar = document.getElementById('userAvatar');
        const dropdown = document.getElementById('userDropdown');
        
        if (!avatar || !dropdown) return;
        
        // If click was on avatar, let toggleUserMenu handle it
        if (avatar.contains(event.target)) return;
        
        // If click was inside dropdown, don't close
        if (dropdown.contains(event.target)) return;
        
        // Click was outside - close dropdown
        dropdown.classList.remove('active');
        dropdownOpen = false;
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdownOpen) {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
                dropdownOpen = false;
            }
        }
    });
});
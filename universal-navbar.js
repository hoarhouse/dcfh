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
        overlay.onclick = closeUserMenu;
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
    const navigationHTML = `
        <div class="dropdown-divider"></div>
        <a href="dcf_member_home.html" class="dropdown-item">
            <span class="dropdown-icon">🏠</span>
            My Feed
        </a>
        <a href="dcf_member_profile.html" class="dropdown-item">  
            <span class="dropdown-icon">👤</span>
            My Profile
        </a>
        <a href="dcf_members_directory.html" class="dropdown-item">
            <span class="dropdown-icon">👥</span>
            My Connections
        </a>
        <a href="dcf_projects_home.html" class="dropdown-item">
            <span class="dropdown-icon">📋</span>
            My Projects
        </a>
        <a href="dcf_events_calendar.html" class="dropdown-item">
            <span class="dropdown-icon">📅</span>
            My Events
        </a>
        <a href="dcf_personal_analytics.html" class="dropdown-item">
            <span class="dropdown-icon">📊</span>
            My Stats
        </a>
        <a href="dcf_settings.html" class="dropdown-item">
            <span class="dropdown-icon">⚙️</span>
            Settings
        </a>
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
        const userMenu = document.querySelector('.user-menu');
        if (isDropdownOpen && userMenu && !userMenu.contains(e.target)) {
            closeUserMenu();
        }
    });
});
// universal-navbar.js - Fixed to handle click events properly

// User menu functionality
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
    const authProvider = localStorage.getItem('dcf_auth_provider') || 'demo';

    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');

    if (nameElement) nameElement.textContent = userName;
    if (emailElement) emailElement.textContent = userEmail;

    const initials = generateInitials(userName);
    const avatarElement = document.getElementById('userAvatar');
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');

    if (avatarElement) avatarElement.textContent = initials;
    if (dropdownAvatarElement) dropdownAvatarElement.textContent = initials;

    if (authProvider === 'github') {
        if (emailElement) emailElement.textContent = `${userEmail} (GitHub)`;
    }

    // Update IDM with Personal Dashboard Focus navigation
    updateIDMNavigation();
}

function updateIDMNavigation() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;

    // Find the dropdown content area (after header)
    const dropdownHeader = dropdown.querySelector('.dropdown-header');
    if (!dropdownHeader) return;

    // Check if navigation is already populated
    const existingNav = dropdown.querySelector('.dropdown-item');
    if (existingNav) return; // Already populated

    // Find the comment placeholder and replace it with navigation
    const commentPlaceholder = Array.from(dropdown.childNodes).find(node => 
        node.nodeType === 8 && node.textContent.includes('Navigation will be dynamically generated')
    );

    // Create Personal Dashboard Focus navigation
    const navigationHTML = `
        <div class="dropdown-divider"></div>
        
        <!-- Personal Dashboard Focus Navigation -->
        <a href="dcf_member_home.html" class="dropdown-item">
            <span class="dropdown-icon">🏠</span>
            My Feed
        </a>
        <a href="dcf_member_profile.html" class="dropdown-item">
            <span class="dropdown-icon">👤</span>
            My Profile
        </a>
        <a href="#" class="dropdown-item" onclick="showComingSoon('My Connections'); return false;">
            <span class="dropdown-icon">🤝</span>
            My Connections
        </a>
        <a href="dcf_projects.html" class="dropdown-item">
            <span class="dropdown-icon">📁</span>
            My Projects
        </a>
        <a href="dcf_events.html" class="dropdown-item">
            <span class="dropdown-icon">📅</span>
            My Events
        </a>
        <a href="dcf_personal_analytics.html" class="dropdown-item">
            <span class="dropdown-icon">📊</span>
            My Stats
        </a>
        
        <div class="dropdown-divider"></div>
        
        <a href="dcf_account_settings.html" class="dropdown-item">
            <span class="dropdown-icon">⚙️</span>
            Settings
        </a>
        <a href="dcf_contact.html" class="dropdown-item">
            <span class="dropdown-icon">💬</span>
            Help & Support
        </a>
        
        <div class="dropdown-divider"></div>
        
        <a href="#" onclick="handleLogout(); return false;" class="dropdown-item logout-btn">
            <span class="dropdown-icon">🚪</span>
            Logout
        </a>
    `;

    // Insert the new navigation after the header
    if (commentPlaceholder) {
        // Replace the comment with navigation
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = navigationHTML;
        
        while (tempDiv.firstChild) {
            dropdown.insertBefore(tempDiv.firstChild, commentPlaceholder);
        }
        dropdown.removeChild(commentPlaceholder);
    } else {
        // Fallback: append after header
        dropdownHeader.insertAdjacentHTML('afterend', navigationHTML);
    }

    // Fix click event handling for dropdown items
    setTimeout(() => {
        fixDropdownClickEvents();
    }, 100);
}

function fixDropdownClickEvents() {
    document.querySelectorAll('.dropdown-item').forEach(link => {
        // Remove existing event listeners by cloning the element
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add proper event handling
        newLink.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Handle onclick functions
            if (this.onclick) {
                this.onclick();
                return;
            }
            
            // Handle regular navigation
            if (this.href && !this.href.includes('#')) {
                setTimeout(() => {
                    window.location.href = this.href;
                }, 100);
                return;
            }
        });
        
        // Also handle regular clicks as backup
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
}

function generateInitials(name) {
    if (!name) return 'SJ';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function showComingSoon(feature) {
    closeUserMenu();
    setTimeout(() => {
        alert(`${feature} page coming soon!`);
    }, 100);
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

function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('dcf_github_session');
        localStorage.removeItem('dcf_user_logged_in');
        localStorage.removeItem('dcf_user_name');
        localStorage.removeItem('dcf_user_email');
        localStorage.removeItem('dcf_auth_provider');
        localStorage.removeItem('dcf_remember_login');

        sessionStorage.clear();

        alert('You have been signed out successfully.');
        window.location.href = 'dcf_login_page.html';
    }
}

// Initialize user menu on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUserDropdownInfo();

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in');
    if (isLoggedIn !== 'true') {
        // Redirect to login for member pages only
        const currentPage = window.location.pathname;
        const publicPages = ['index.html', 'dcf_login_page.html', 'dcf_profile_signup.html', 
                            'dcf_about.html', 'dcf_contact.html', 'dcf_projects_public.html', 
                            'dcf_events_public.html'];
        
        const isPublicPage = publicPages.some(page => currentPage.includes(page)) || currentPage === '/';
        
        if (!isPublicPage) {
            window.location.href = 'dcf_login_page.html';
        }
    }

    // Close dropdown on escape key
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
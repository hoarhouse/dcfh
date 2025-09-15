// DCF Admin Navigation System
// This module provides dedicated navigation for admin pages

(function() {
    'use strict';

    // Check if we're in the admin section
    function isAdminPage() {
        const path = window.location.pathname;
        return path.includes('/admin/') || path.includes('dcf_admin') || path.includes('blog_post_editor');
    }

    // Create admin navigation HTML
    function createAdminNavigation() {
        const navHTML = `
            <nav class="nav-container admin-nav-container">
                <a href="/admin/dcf_admin_dashboard.html" class="logo">
                    <div class="logo-icon"></div>
                    <span class="nav-title">DCF Admin</span>
                </a>
                
                <ul class="nav-menu admin-nav-menu" id="adminNavMenu">
                    <li><a href="/admin/dcf_admin_dashboard.html" class="nav-link ${isCurrentPage('dashboard') ? 'active' : ''}">
                        <span data-icon="dashboard"></span> Dashboard
                    </a></li>
                    <li><a href="/admin/dcf_admin_dashboard.html#blog-management" class="nav-link ${isCurrentPage('blog') ? 'active' : ''}" onclick="showBlogManagementFromNav(event)">
                        <span data-icon="blog"></span> Blog Management
                    </a></li>
                    <li><a href="/admin/dcf_admin_dashboard.html#user-management" class="nav-link ${isCurrentPage('users') ? 'active' : ''}">
                        <span data-icon="users"></span> User Management
                    </a></li>
                    <li><a href="/admin/dcf_admin_dashboard.html#settings" class="nav-link ${isCurrentPage('settings') ? 'active' : ''}">
                        <span data-icon="settings"></span> System Settings
                    </a></li>
                    <li><a href="/admin/dcf_admin_dashboard.html#analytics" class="nav-link ${isCurrentPage('analytics') ? 'active' : ''}">
                        <span data-icon="chart"></span> Analytics
                    </a></li>
                </ul>
                
                <div class="nav-actions">
                    <button class="btn btn-secondary btn-small exit-admin-btn" onclick="exitAdminMode()">
                        <span data-icon="exit"></span> Exit Admin
                    </button>
                    
                    <!-- Preserve notification bell -->
                    <div class="notification-wrapper">
                        <button class="notification-bell" onclick="toggleNotifications()">
                            <span data-icon="bell"></span>
                            <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
                        </button>
                        <div class="notification-dropdown" id="notificationDropdown" style="display: none;">
                            <div class="notification-header">
                                <h3>Notifications</h3>
                                <button class="mark-all-read">Mark all as read</button>
                            </div>
                            <div class="notification-list" id="notificationList">
                                <!-- Notifications populated here -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Preserve user dropdown -->
                    <div class="user-dropdown">
                        <div class="user-avatar" onclick="toggleUserMenu()" id="userAvatar"></div>
                        <div class="dropdown-menu" id="userDropdown">
                            <div class="dropdown-header">
                                <div class="dropdown-avatar"></div>
                                <div class="dropdown-info">
                                    <div class="dropdown-name" id="dropdownUserName"></div>
                                    <div class="dropdown-email" id="dropdownUserEmail"></div>
                                </div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <a href="../profile.html" class="dropdown-item">
                                <span data-icon="user"></span> My Profile
                            </a>
                            <a href="../settings.html" class="dropdown-item">
                                <span data-icon="settings"></span> Settings
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" onclick="logout()" class="dropdown-item">
                                <span data-icon="logout"></span> Logout
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
        
        return navHTML;
    }

    // Create sub-navigation for blog management
    function createBlogSubNav() {
        const subNavHTML = `
            <div class="sub-nav-container" id="blogSubNav" style="display: none;">
                <div class="breadcrumb-nav">
                    <a href="/admin/dcf_admin_dashboard.html">Dashboard</a>
                    <span class="breadcrumb-separator">›</span>
                    <span class="breadcrumb-current">Blog Management</span>
                </div>
                <div class="sub-nav-tabs">
                    <button class="sub-nav-tab active" data-tab="all-blogs">All Blogs</button>
                    <button class="sub-nav-tab" data-tab="create-blog">Create Blog</button>
                    <button class="sub-nav-tab" data-tab="manage-posts">Manage Posts</button>
                    <button class="sub-nav-tab" data-tab="media-library">Media Library</button>
                    <button class="sub-nav-tab" data-tab="user-permissions">User Permissions</button>
                </div>
            </div>
        `;
        
        return subNavHTML;
    }

    // Check which page we're on
    function isCurrentPage(page) {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        switch(page) {
            case 'dashboard':
                return path.includes('dcf_admin_dashboard') && !hash;
            case 'blog':
                return hash.includes('blog-management') || path.includes('blog_post_editor');
            case 'users':
                return hash.includes('user-management');
            case 'settings':
                return hash.includes('settings');
            case 'analytics':
                return hash.includes('analytics');
            default:
                return false;
        }
    }

    // Exit admin mode and return to main site
    function exitAdminMode() {
        // Clear any admin-specific session data if needed
        sessionStorage.removeItem('adminMode');
        
        // Navigate to main site
        window.location.href = '/index.html';
    }

    // Show blog management from navigation
    function showBlogManagementFromNav(event) {
        if (event) event.preventDefault();
        
        // If we're already on the dashboard, trigger the blog management view
        if (window.location.pathname.includes('dcf_admin_dashboard')) {
            if (typeof showBlogManagement === 'function') {
                showBlogManagement(event);
            }
        } else {
            // Navigate to dashboard with blog management hash
            window.location.href = '/admin/dcf_admin_dashboard.html#blog-management';
        }
    }

    // Initialize admin navigation
    function initializeAdminNav() {
        if (!isAdminPage()) {
            return; // Not an admin page, don't initialize
        }

        // Set admin mode in session
        sessionStorage.setItem('adminMode', 'true');

        // Replace or update the header navigation
        const header = document.querySelector('.header');
        if (header) {
            // Check if we already have admin nav
            if (!header.querySelector('.admin-nav-container')) {
                // Replace the nav container
                const existingNav = header.querySelector('.nav-container');
                if (existingNav) {
                    const adminNav = createAdminNavigation();
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = adminNav;
                    header.innerHTML = '';
                    header.appendChild(tempDiv.firstElementChild);
                }
            }

            // Add sub-navigation if needed
            if (isCurrentPage('blog') && !document.getElementById('blogSubNav')) {
                const subNav = createBlogSubNav();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = subNav;
                header.parentNode.insertBefore(tempDiv.firstElementChild, header.nextSibling);
            }
        }

        // Initialize user menu data
        initializeUserMenu();
        
        // Initialize notification system
        initializeNotifications();
    }

    // Initialize user menu with current user data
    async function initializeUserMenu() {
        if (window.dcfSupabase) {
            try {
                const { data: { user } } = await window.dcfSupabase.auth.getUser();
                if (user) {
                    // Update avatar
                    const avatar = document.getElementById('userAvatar');
                    if (avatar) {
                        const initials = user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
                        avatar.textContent = initials;
                    }
                    
                    // Update dropdown info
                    const dropdownName = document.getElementById('dropdownUserName');
                    const dropdownEmail = document.getElementById('dropdownUserEmail');
                    if (dropdownName) dropdownName.textContent = user.user_metadata?.full_name || 'Admin User';
                    if (dropdownEmail) dropdownEmail.textContent = user.email;
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }
    }

    // Initialize notification system
    function initializeNotifications() {
        // This would connect to your notification system
        // For now, just a placeholder
        updateNotificationBadge(0);
    }

    // Update notification badge
    function updateNotificationBadge(count) {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // Toggle user menu
    window.toggleUserMenu = function() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    };

    // Toggle notifications
    window.toggleNotifications = function() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    };

    // Logout function
    window.logout = async function() {
        if (window.dcfSupabase) {
            await window.dcfSupabase.auth.signOut();
            window.location.href = '/auth/dcf_login_page.html';
        }
    };

    // Make functions globally available
    window.exitAdminMode = exitAdminMode;
    window.showBlogManagementFromNav = showBlogManagementFromNav;
    window.initializeAdminNav = initializeAdminNav;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAdminNav);
    } else {
        initializeAdminNav();
    }

})();
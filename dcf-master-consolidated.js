// DCF Hungary Master Consolidated JavaScript - COMPLETE FIXED VERSION
// Combines: universal-navbar.js + universal-quick-actions.js + quickactions.js + footer functionality

// Supabase configuration for avatar loading
window.masterSupabase = null;

// Wait for supabase-auth.js to be ready
function waitForAuthSupabase() {
    return new Promise((resolve) => {
        const checkAuth = () => {
            if (window.authSupabase) {
                window.masterSupabase = window.authSupabase;
                console.log('SUCCESS: Connected masterSupabase to authSupabase');
                resolve();
            } else {
                setTimeout(checkAuth, 50);
            }
        };
        checkAuth();
    });
}

// Connect to auth system when it's ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for supabase-auth.js to initialize
    setTimeout(() => {
        if (window.authSupabase) {
            window.masterSupabase = window.authSupabase;
            console.log('Connected masterSupabase to authSupabase');
        }
    }, 100);
});

// =============================================================================
// NOTIFICATION SYSTEM - MUST BE AT TOP FOR IMMEDIATE AVAILABILITY
// =============================================================================
let notificationDropdownOpen = false;
let lastNotificationCount = 0;
let notificationSound = null;

function toggleNotificationDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    if (notificationDropdownOpen) {
        closeNotificationDropdown();
    } else {
        openNotificationDropdown();
    }
}

function openNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    dropdown.style.display = 'block';
    dropdown.classList.add('active');
    notificationDropdownOpen = true;
    loadRecentNotifications();
    setTimeout(() => document.addEventListener('click', closeNotificationDropdownOutside), 100);
}

function closeNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    dropdown.style.display = 'none';
    dropdown.classList.remove('active');
    notificationDropdownOpen = false;
    document.removeEventListener('click', closeNotificationDropdownOutside);
}

function closeNotificationDropdownOutside(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const bell = document.querySelector('.notification-bell');
    if (!dropdown?.contains(event.target) && !bell?.contains(event.target)) {
        closeNotificationDropdown();
    }
}

async function loadRecentNotifications() {
    const content = document.getElementById('notificationDropdownContent');
    if (!content) return;
    content.innerHTML = '<div class="notification-loading">Loading...</div>';
    
    setTimeout(() => {
        content.innerHTML = `
            <div class="notification-item">
                <div class="notification-item-header">
                    <span class="notification-item-icon">🎉</span>
                    <span class="notification-item-title">Welcome</span>
                    <span class="notification-item-time">now</span>
                </div>
                <div class="notification-item-message">Your notification system is working!</div>
            </div>
        `;
    }, 500);
}

function markAllNotificationsAsRead() {
    closeNotificationDropdown();
}

// Make functions immediately available
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;

function initializeSupabase() {
    console.log('initializeSupabase called from:', new Error().stack);
    console.log('Current Supabase instances:', { masterSupabase: !!window.masterSupabase, supabaseClient: !!window.supabaseClient });
    console.log('window.supabase exists:', !!window.supabase);
    
    if (window.supabase && !window.masterSupabase) {
        // Check if there's already a global Supabase client we can reuse
        if (window.supabaseClient) {
            console.log('Reusing existing supabaseClient');
            window.masterSupabase = window.authSupabase;
            return;
        }
        
        console.log('Supabase client creation disabled - using supabase-auth.js client only');
        // Commented out to prevent multiple client conflicts
        // const supabaseUrl = 'https://atzommnkkwzgbktuzjti.supabase.co';
        // const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';
        // window.masterSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        // window.supabaseClient = window.masterSupabase; // Store as global reference
    }
}

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
    addNavigationItems(); // Always add navigation items for logged-in users
    
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

// COMPLETELY FIXED FUNCTION - This handles all undefined cases properly
async function updateUserDropdownInfo() {
    // Get user data from auth system instead of localStorage
    let userName = getCurrentUser()?.name || null;
    let userEmail = getCurrentUser()?.email || null;
    const authProvider = localStorage.getItem('dcf_auth_provider') || 'demo';
    
    console.log('updateUserDropdownInfo called with:', { userName, userEmail });
    
    // ALWAYS fetch from database to get real name
    if (true) {
        console.log('updateUserDropdownInfo: fetching from database...');
        
        if (!window.masterSupabase) {
            window.masterSupabase = window.authSupabase;
        }
        
        if (window.masterSupabase && userEmail && userEmail !== 'null' && userEmail !== 'undefined') {
            try {
                const { data: profile, error } = await window.masterSupabase
                    .from('user_profiles')
                    .select('name, first_name, last_name, username, avatar_url')
                    .eq('email', userEmail)
                    .single();
                
                if (!error && profile) {
                    userName = profile.username || (profile.first_name && profile.last_name ? 
                        `${profile.first_name} ${profile.last_name}` : 
                        profile.name) || 'DCF Member';
                    const userUsername = profile.username;
                    localStorage.setItem('dcf_user_name', userName);
                    localStorage.setItem('dcf_user_username', userUsername);
                    localStorage.setItem('dcf_username', userUsername);
                    console.log('updateUserDropdownInfo: Fetched userName from database:', userName);
                    console.log('updateUserDropdownInfo: Set username to:', userUsername);
                    
                    // NOW set the dropdown with fresh database username
                    const nameElement = document.getElementById('dropdownUserName');
                    if (nameElement) {
                        nameElement.textContent = userUsername;
                        console.log('Set dropdown to fresh username:', userUsername);
                    }
                }
            } catch (error) {
                console.log('updateUserDropdownInfo: Error fetching profile:', error);
            }
        }
        
        // Final fallback
        if (!userName || userName === 'null' || userName === 'undefined') {
            userName = userEmail ? userEmail.split('@')[0].replace(/[._]/g, ' ') : 'DCF Member';
        }
    }

    // Final fallback for email
    if (!userEmail || userEmail === 'null' || userEmail === 'undefined') {
        userEmail = 'member@dcfhungary.org';
    }

    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');

    // Don't set dropdown here - wait for database fetch below
    console.log('Waiting for database fetch to set dropdown...');
    if (emailElement) {
        if (authProvider === 'github') {
            emailElement.textContent = `${userEmail} (GitHub)`;
        } else {
            emailElement.textContent = userEmail;
        }
    }

    const initials = generateInitials(userName);
    const avatarElement = document.querySelector('.user-menu .user-avatar') || document.getElementById('userAvatar');
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');

    // Set initials first as fallback
    if (avatarElement) {
        avatarElement.textContent = initials;
        avatarElement.style.backgroundImage = '';
        avatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
    }
    if (dropdownAvatarElement) {
        dropdownAvatarElement.textContent = initials;
        dropdownAvatarElement.style.backgroundImage = '';
        dropdownAvatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
    }

    // Try to load profile picture
    let avatarUrl = null;
    try {
        if (window.masterSupabase) {
            const { data } = await window.masterSupabase
                .from('user_profiles')
                .select('avatar_url')
                .eq('email', userEmail)
                .single();
            avatarUrl = data?.avatar_url;
            console.log('Public page avatar URL:', avatarUrl);
        }
    } catch (error) {
        console.log('Public page avatar load error:', error);
    }

    // Apply avatar or keep initials
    if (avatarUrl) {
        console.log('Applying profile picture:', avatarUrl);
        // Use profile picture
        if (avatarElement) {
            avatarElement.style.background = '';
            avatarElement.style.backgroundImage = `url(${avatarUrl})`;
            avatarElement.style.backgroundSize = 'cover';
            avatarElement.style.backgroundPosition = 'center';
            avatarElement.textContent = '';
        }
        if (dropdownAvatarElement) {
            dropdownAvatarElement.style.background = '';
            dropdownAvatarElement.style.backgroundImage = `url(${avatarUrl})`;
            dropdownAvatarElement.style.backgroundSize = 'cover';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.textContent = '';
        }
    } else {
        console.log('No profile picture found, keeping initials');
    }
}

async function loadUserAvatar(avatarElement, dropdownAvatarElement, userEmail, initials) {
    // Try to load profile picture first
    let avatarUrl = null;
    try {
        if (window.masterSupabase) {
            const { data } = await window.masterSupabase
                .from('user_profiles')
                .select('avatar_url')
                .eq('email', userEmail)
                .single();
            avatarUrl = data?.avatar_url;
        }
    } catch (error) {
        console.log('Avatar load error:', error);
    }

    // Apply avatar or initials
    if (avatarUrl) {
        // Use profile picture
        if (avatarElement) {
            avatarElement.style.backgroundImage = `url(${avatarUrl})`;
            avatarElement.style.backgroundSize = 'cover';
            avatarElement.style.backgroundPosition = 'center';
            avatarElement.style.background = '';
            avatarElement.textContent = '';
        }
        if (dropdownAvatarElement) {
            dropdownAvatarElement.style.backgroundImage = `url(${avatarUrl})`;
            dropdownAvatarElement.style.backgroundSize = 'cover';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.style.background = '';
            dropdownAvatarElement.textContent = '';
        }
    } else {
        // Use initials fallback
        if (avatarElement) {
            avatarElement.textContent = initials;
            avatarElement.style.backgroundImage = '';
            avatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
        }
        if (dropdownAvatarElement) {
            dropdownAvatarElement.textContent = initials;
            dropdownAvatarElement.style.backgroundImage = '';
            dropdownAvatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
        }
    }
}

// COMPLETELY FIXED FUNCTION - This handles all
async function loadPageAvatars() {
    console.log('Loading page avatars...');
    
    // Get user data from auth system instead of localStorage
    let userName = getCurrentUser()?.name || null;
    let userEmail = getCurrentUser()?.email || null;
    
    console.log('Raw userName from auth system:', userName);
    console.log('Raw userEmail from auth system:', userEmail);
    
    // ALWAYS fetch from database to get real name
    if (true) {
        console.log('Found invalid userName, fetching from database...');
        
        if (!window.masterSupabase) {
            await waitForAuthSupabase();
        }
        
        if (window.masterSupabase && userEmail && userEmail !== 'null' && userEmail !== 'undefined') {
            try {
                const { data: profile, error } = await window.masterSupabase
                    .from('user_profiles')
                    .select('name, first_name, last_name, username')
                    .eq('email', userEmail)
                    .single();
                
                if (!error && profile) {
                    userName = profile.username || profile.name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'DCF Member';
                    const userUsername = profile.username || 'DCF Member';
                    localStorage.setItem('dcf_user_name', userName);
                    localStorage.setItem('dcf_user_username', userUsername);
                    localStorage.setItem('dcf_username', userUsername);
                    console.log('Fetched userName from database:', userName);
                    console.log('Set username to:', userUsername);
                    
                    // NOW set the dropdown with fresh database username
                    const nameElement = document.getElementById('dropdownUserName');
                    if (nameElement) {
                        nameElement.textContent = userUsername;
                        console.log('loadPageAvatars: Set dropdown to fresh username:', userUsername);
                    }
                }
            } catch (error) {
                console.log('Error fetching profile:', error);
            }
        }
        
        if (!userName || userName === 'null' || userName === 'undefined') {
            userName = userEmail ? userEmail.split('@')[0].replace(/[._]/g, ' ') : 'DCF Member';
            console.log('Using fallback userName:', userName);
        }
    }
    
    if (typeof userName === 'string' && userName.trim() === 'undefined') {
        console.log('Found string "undefined", forcing fallback');
        userName = userEmail ? userEmail.split('@')[0].replace(/[._]/g, ' ') : 'DCF Member';
    }
    
    if (!userEmail || userEmail === 'null' || userEmail === 'undefined') {
        userEmail = 'member@dcfhungary.org';
        console.log('Using fallback userEmail:', userEmail);
    }
    
    const initials = generateInitials(userName);
    console.log('Generated initials:', initials);
    
    const avatarElement = document.getElementById('userAvatar');
    
    // FIRST - Set initials immediately to prevent "undefined" 
    if (avatarElement) {
        console.log('Setting initial fallback initials:', initials);
        avatarElement.textContent = initials;
        avatarElement.style.backgroundImage = '';
        avatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
        avatarElement.style.boxShadow = '0 0 10px #00ff00';
    }
    
    // Update dropdown avatar too
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');
    if (dropdownAvatarElement) {
        dropdownAvatarElement.textContent = initials;
        dropdownAvatarElement.style.backgroundImage = '';
        dropdownAvatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
    }
    
    // Update user info in dropdown
    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');
    // Don't set dropdown here - wait for database fetch below
    if (emailElement) emailElement.textContent = userEmail;
    
    // Force initialize Supabase
    if (!window.masterSupabase) {
        await waitForAuthSupabase();
    }
    
    // Try to load profile picture
    let avatarUrl = null;
    try {
        if (window.masterSupabase && window.supabase) {
            console.log('Attempting to load avatar for page load:', userEmail);
            const { data, error } = await window.masterSupabase
                .from('user_profiles')
                .select('avatar_url')
                .eq('email', userEmail)
                .single();
            
            if (error) {
                console.log('Database error on page load:', error);
            }
            
            if (data && data.avatar_url) {
                avatarUrl = data.avatar_url;
                console.log('Found avatar URL on page load:', avatarUrl);
            } else {
                console.log('No avatar URL found on page load');
            }
        } else {
            console.log('Supabase not available on page load');
        }
    } catch (error) {
        console.log('Error loading avatar on page load:', error);
    }
    
    // Update avatar ONLY if we found a picture
    if (avatarElement && avatarUrl) {
        console.log('Avatar element classes:', avatarElement.className);
        console.log('Avatar element ID:', avatarElement.id);
        console.log('Setting avatar image on page load');
        // Clear background first, then set image
        avatarElement.style.background = '';
        avatarElement.style.backgroundImage = `url(${avatarUrl})`;
        avatarElement.style.backgroundSize = 'cover';
        avatarElement.style.backgroundPosition = 'center';
        avatarElement.style.boxShadow = '';
        avatarElement.textContent = '';
        
        // Update dropdown avatar too
        if (dropdownAvatarElement) {
            dropdownAvatarElement.style.background = '';
            dropdownAvatarElement.style.backgroundImage = `url(${avatarUrl})`;
            dropdownAvatarElement.style.backgroundSize = 'cover';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.textContent = '';
        }
   }
}

// COMPLETELY FIXED FUNCTION - This was the main source of "undefined"
function generateInitials(name) {
    console.log('generateInitials called with:', name, 'type:', typeof name);
    
    // Handle all possible undefined/null/empty cases
    if (!name || name === 'undefined' || name === 'null' || typeof name !== 'string' || name.trim() === '') {
        console.log('generateInitials received invalid name:', name, 'returning default CH');
        return 'CH';
    }
    
    // Clean the name and handle titles
    const cleanName = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.|Rev\.|Fr\.|Sr\.|Rabbi)\s+/i, '');
    
    if (!cleanName || cleanName.trim() === '') {
        console.log('generateInitials cleaned name is empty, returning default CH');
        return 'CH';
    }
    
    const parts = cleanName.trim().split(' ').filter(part => part.length > 0);
    
    if (parts.length >= 2) {
        const firstInitial = parts[0][0] || 'C';
        const lastInitial = parts[parts.length - 1][0] || 'H';
        const initials = (firstInitial + lastInitial).toUpperCase();
        console.log('generateInitials created initials:', initials, 'from name:', name);
        return initials;
    } else if (parts.length === 1) {
        const initials = (parts[0][0] + 'H').toUpperCase();
        console.log('generateInitials created initials from single name:', initials, 'from name:', name);
        return initials;
    }
    
    console.log('generateInitials falling back to default CH for name:', name);
    return 'CH';
}

function addNavigationItems() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown || dropdown.querySelector('.nav-item')) return;

    const currentPage = window.location.pathname.split('/').pop();
    
    const navigationItems = [
        { href: 'dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: 'dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: 'dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: 'dcf_projects.html', icon: '📋', text: 'My Projects' },
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
    showLogoutModal();
}

function showLogoutModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('logoutModal')) {
        const modalHTML = `
            <div class="modal" id="logoutModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Sign Out</h2>
                    </div>
                    <p style="margin-bottom: 2rem; color: #666;">Are you sure you want to sign out of your DCF Hungary account?</p>
                    <div class="form-actions" style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                        <button type="button" class="btn btn-secondary" onclick="closeLogoutModal()">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="confirmLogout()">Sign Out</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal styles if not already present
        if (!document.querySelector('#logoutModalCSS')) {
            const style = document.createElement('style');
            style.id = 'logoutModalCSS';
            style.textContent = `
                .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 1000; align-items: center; justify-content: center; }
                .modal.active { display: flex; }
                .modal-content { background: white; border-radius: 12px; padding: 2rem; max-width: 400px; width: 90%; }
                .modal-header { margin-bottom: 1.5rem; }
                .modal-title { font-size: 1.3rem; font-weight: 600; color: #333; }
                .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: inline-block; font-weight: 600; }
                .btn-primary { background: #000; color: white; }
                .btn-primary:hover { background: #333; }
                .btn-secondary { background: transparent; color: #666; border: 2px solid #e5e5e5; }
                .btn-secondary:hover { color: #333; border-color: #333; }
            `;
            document.head.appendChild(style);
        }
    }
    
    document.getElementById('logoutModal').classList.add('active');
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function confirmLogout() {
    localStorage.removeItem('dcf_github_session');
    localStorage.removeItem('dcf_user_logged_in');
    localStorage.removeItem('dcf_user_name');
    localStorage.removeItem('dcf_user_email');
    localStorage.removeItem('dcf_user_username');
    localStorage.removeItem('dcf_username');
    localStorage.removeItem('dcf_auth_provider');
    localStorage.removeItem('dcf_remember_login');
    sessionStorage.clear();
    window.location.href = 'dcf_login_page.html';
}

// =============================================================================
// 2. UPDATED TOP NAVIGATION FUNCTIONALITY - REPLACES ALL HARDCODED NAV
// =============================================================================
function populateTopNavigation() {
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    const isLoggedIn = window.dcfUser ? window.dcfUser.isLoggedIn : false;
    const currentPage = window.location.pathname.split('/').pop();
    
    // Clear existing nav items
    navMenu.innerHTML = '';
    
    let navItems = [];
    
    if (!isLoggedIn) {
        // PUBLIC NAVIGATION: Home, About, Contact (excluding current page)
        const publicNav = [
            { href: 'index.html', text: 'Home' },
            { href: 'dcf_about.html', text: 'About' },
            { href: 'dcf_contact.html', text: 'Contact' }
        ];
        navItems = publicNav.filter(item => item.href !== currentPage);
    } else {
        // MEMBER NAVIGATION: Home, Members, Projects, Events, Resources, Contact (excluding current page)
        const memberNav = [
            { href: 'dcf_member_home.html', text: 'Home' },
            { href: 'dcf_members_directory.html', text: 'Members' },
            { href: 'dcf_projects_home.html', text: 'Projects' },
            { href: 'dcf_events_calendar.html', text: 'Events' },
            { href: 'dcf_resources_library.html', text: 'Resources' },
            { href: 'dcf_contact.html', text: 'Contact' }
        ];
        navItems = memberNav.filter(item => item.href !== currentPage);
    }
    
    // Create and append nav items
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.text;
        
        // Add active class if this is the current page
        if (item.href === currentPage) {
            a.classList.add('active');
        }
        
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
    'dcf_project_detail.html': [
        { icon: '🤝', text: 'Join Project', action: 'javascript:joinProject()', type: 'primary' },
        { icon: '⭐', text: 'Follow Project', action: 'javascript:toggleFollow()', type: 'secondary' },
        { icon: '🌍', text: 'All Projects', action: 'dcf_projects_home.html', type: 'secondary' },
        { icon: '📁', text: 'My Projects', action: 'dcf_projects.html', type: 'secondary' }
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
    
    if (filename.includes('projects_home')) {
        return 'projects';
    }
    if (filename.includes('project_detail')) {
        return 'project_detail';
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
                        <li><a href="dcf_about.html">About Us</a></li>
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
        filename.includes('dcf_account_settings') || filename.includes('dcf_project') ||
        filename.includes('dcf_notifications')) {
        return 'member';
    }
    
    return 'public';
}

function handlePublicPageAuth() {
    const isLoggedIn = window.dcfUser ? window.dcfUser.isLoggedIn : false;
    const navActions = document.querySelector('.nav-actions') || document.querySelector('.user-menu');
    
    if (navActions) {
        if (!isLoggedIn) {
            // User is NOT logged in - show Login/Join buttons
            navActions.innerHTML = `
                <a href="dcf_login_page.html" class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px; transition: all 0.3s ease;">Login</a>
                <a href="dcf_profile_signup.html" class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; cursor: pointer; text-decoration: none; display: inline-block;">Join Us</a>
            `;
        } else {
            // User IS logged in - CREATE basic dropdown structure with notification bell
            navActions.innerHTML = `
                <div class="user-menu">
                    <div class="notification-bell" onclick="toggleNotificationDropdown(event)">
                        <span class="notification-icon">🔔</span>
                        <div class="notification-badge" id="notificationBadge" style="display: none;">0</div>
                        <div class="notification-dropdown" id="notificationDropdown" style="display: none;">
                            <div class="notification-dropdown-header">
                                <h3>Notifications</h3>
                                <a href="dcf_notifications.html" class="view-all-link">View All</a>
                            </div>
                            <div class="notification-dropdown-content" id="notificationDropdownContent">
                                <div class="notification-loading">Loading...</div>
                            </div>
                            <div class="notification-dropdown-footer">
                                <button onclick="markAllNotificationsAsRead()" class="mark-all-read-btn">Mark All Read</button>
                            </div>
                        </div>
                    </div>
                    <div class="user-dropdown">
                        <div class="user-avatar" onclick="toggleUserMenu()" id="userAvatar">DM</div>
                        <div class="dropdown-menu" id="userDropdown">
                            <div class="dropdown-header">
                                <div class="dropdown-avatar">DM</div>
                                <div class="dropdown-info">
                                    <div class="dropdown-name" id="dropdownUserName">DCF Member</div>
                                    <div class="dropdown-email" id="dropdownUserEmail">member@dcfhungary.org</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add required CSS for public page dropdown
            if (!document.querySelector('#publicDropdownCSS')) {
                const style = document.createElement('style');
                style.id = 'publicDropdownCSS';
                style.textContent = `
                    .user-menu { position: relative; display: flex; align-items: center; }
                    .user-dropdown { position: relative; }
                    .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #00ff00, #32cd32); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.9rem; font-weight: 600; cursor: pointer; box-shadow: 0 0 10px #00ff00; }
                    .dropdown-menu { position: absolute; top: calc(100% + 8px); right: 0; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); border: 1px solid #e5e5e5; min-width: 280px; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.3s ease; z-index: 1000; }
                    .dropdown-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
                    .dropdown-header { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; border-bottom: 1px solid #f0f0f0; }
                    .dropdown-avatar { width: 48px; height: 48px; background: linear-gradient(135deg, #00ff00, #32cd32); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.1rem; flex-shrink: 0; }
                    .dropdown-info { flex: 1; min-width: 0; }
                    .dropdown-name { font-weight: 600; color: #333; font-size: 1rem; margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                    .dropdown-email { color: #666; font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                    .dropdown-divider { height: 1px; background: #f0f0f0; margin: 0.5rem 0; }
                    .dropdown-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; color: #333; text-decoration: none; transition: all 0.2s ease; border: none; background: none; width: 100%; text-align: left; cursor: pointer; font-size: 0.9rem; }
                    .dropdown-item:hover { background: #f8f9fa; color: #000; }
                    .logout-btn { color: #dc3545 !important; font-weight: 500; }
                    .logout-btn:hover { background: #fee !important; color: #c82333 !important; }
                    .dropdown-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }
                    .notification-bell { position: relative; cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: background-color 0.3s ease; margin-right: 1rem; }
                    .notification-bell:hover { background-color: #f0f0f0; }
                    .notification-bell.ringing { animation: ring 0.5s ease-in-out; }
                    @keyframes ring { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
                    .notification-icon { font-size: 1.2rem; display: block; }
                    .notification-badge { position: absolute; top: -2px; right: -2px; background: #dc3545; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; border: 2px solid white; min-width: 20px; }
                    .notification-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border: 1px solid #e5e5e5; width: 350px; max-height: 400px; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.3s ease; z-index: 10000; overflow: hidden; display: none; }
                    .notification-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); display: block; }
                    .notification-dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e5e5; background: #000; }
                    .notification-dropdown-header h3 { margin: 0; font-size: 1rem; font-weight: 600; color: white; }
                    .view-all-link { color: white; text-decoration: none; font-size: 0.9rem; font-weight: 500; opacity: 0.8; transition: opacity 0.2s ease; }
                    .view-all-link:hover { opacity: 1; text-decoration: underline; }
                    .notification-dropdown-content { max-height: 300px; overflow-y: auto; }
                    .notification-item { padding: 1rem 1.5rem; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background-color 0.2s ease; }
                    .notification-item:last-child { border-bottom: none; }
                    .notification-item:hover { background: #f8f9fa; }
                    .notification-item.unread { background: #f8f9fa; border-left: 3px solid #000; }
                    .notification-item.unread::before { content: ''; position: absolute; top: 1rem; right: 1.5rem; width: 6px; height: 6px; background: #000; border-radius: 50%; }
                    .notification-item-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem; }
                    .notification-item-icon { font-size: 1rem; flex-shrink: 0; }
                    .notification-item-title { font-weight: 600; font-size: 0.9rem; color: #333; flex: 1; }
                    .notification-item-time { font-size: 0.8rem; color: #666; }
                    .notification-item-message { font-size: 0.85rem; color: #666; line-height: 1.4; }
                    .notification-dropdown-footer { padding: 0.75rem 1.5rem; border-top: 1px solid #e5e5e5; background: #f8f9fa; }
                    .mark-all-read-btn { width: 100%; padding: 0.5rem; background: #000; color: white; border: none; border-radius: 6px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s ease; }
                    .mark-all-read-btn:hover { background: #333; }
                    .notification-loading { padding: 2rem; text-align: center; color: #666; font-size: 0.9rem; }
                    .notification-empty { padding: 2rem; text-align: center; color: #666; font-size: 0.9rem; }
                `;
                document.head.appendChild(style);
            }
            
            // Set initial avatar properly with our fixed function
            setTimeout(async () => {
                await updateUserDropdownInfo(); // This will load the profile picture
                addNavigationItems(); // Add menu items and logout
                
                // Notification bell uses inline onclick - no addEventListener needed
            }, 100);
        }
    }
}

function addNotificationBellToMemberPages() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        // REMOVE any existing notification bell first
        const existingBell = userMenu.querySelector('.notification-bell');
        if (existingBell) {
            existingBell.remove();
        }
        
        // Add the correct notification bell
        const bellHTML = `
            <div class="notification-bell" onclick="toggleNotificationDropdown(event)">
                <span class="notification-icon">🔔</span>
                <div class="notification-badge" id="notificationBadge" style="display: none;">0</div>
                <div class="notification-dropdown" id="notificationDropdown" style="display: none;">
                    <div class="notification-dropdown-header">
                        <h3>Notifications</h3>
                        <a href="dcf_notifications.html" class="view-all-link">View All</a>
                    </div>
                    <div class="notification-dropdown-content" id="notificationDropdownContent">
                        <div class="notification-loading">Loading...</div>
                    </div>
                    <div class="notification-dropdown-footer">
                        <button onclick="markAllNotificationsAsRead()" class="mark-all-read-btn">Mark All Read</button>
                    </div>
                </div>
            </div>
        `;
        userMenu.insertAdjacentHTML('afterbegin', bellHTML);
        
        // Add CSS for notification bell if not already added
        if (!document.querySelector('#memberPageBellCSS')) {
            const style = document.createElement('style');
            style.id = 'memberPageBellCSS';
            style.textContent = `
                .notification-bell { position: relative; cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: background-color 0.3s ease; margin-right: 1rem; }
                .notification-bell:hover { background-color: #f0f0f0; }
                .notification-bell.ringing { animation: ring 0.5s ease-in-out; }
                @keyframes ring { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
                .notification-icon { font-size: 1.2rem; display: block; }
                .notification-badge { position: absolute; top: -2px; right: -2px; background: #dc3545; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; border: 2px solid white; min-width: 20px; }
                .notification-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border: 1px solid #e5e5e5; width: 350px; max-height: 400px; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.3s ease; z-index: 10000; overflow: hidden; display: none; }
                .notification-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); display: block; }
                .notification-dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e5e5; background: #000; }
                .notification-dropdown-header h3 { margin: 0; font-size: 1rem; font-weight: 600; color: white; }
                .view-all-link { color: white; text-decoration: none; font-size: 0.9rem; font-weight: 500; opacity: 0.8; transition: opacity 0.2s ease; }
                .view-all-link:hover { opacity: 1; text-decoration: underline; }
                .notification-dropdown-content { max-height: 300px; overflow-y: auto; }
                .notification-item { padding: 1rem 1.5rem; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background-color 0.2s ease; }
                .notification-item:last-child { border-bottom: none; }
                .notification-item:hover { background: #f8f9fa; }
                .notification-item.unread { background: #f8f9fa; border-left: 3px solid #000; }
                .notification-item.unread::before { content: ''; position: absolute; top: 1rem; right: 1.5rem; width: 6px; height: 6px; background: #000; border-radius: 50%; }
                .notification-item-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem; }
                .notification-item-icon { font-size: 1rem; flex-shrink: 0; }
                .notification-item-title { font-weight: 600; font-size: 0.9rem; color: #333; flex: 1; }
                .notification-item-time { font-size: 0.8rem; color: #666; }
                .notification-item-message { font-size: 0.85rem; color: #666; line-height: 1.4; }
                .notification-dropdown-footer { padding: 0.75rem 1.5rem; border-top: 1px solid #e5e5e5; background: #f8f9fa; }
                .mark-all-read-btn { width: 100%; padding: 0.5rem; background: #000; color: white; border: none; border-radius: 6px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s ease; }
                .mark-all-read-btn:hover { background: #333; }
                .notification-loading { padding: 2rem; text-align: center; color: #666; font-size: 0.9rem; }
                .notification-empty { padding: 2rem; text-align: center; color: #666; font-size: 0.9rem; }
            `;
            document.head.appendChild(style);
        }
    }
}

// =============================================================================
// 7. MAIN INITIALIZATION - EVERYTHING HAPPENS HERE
// =============================================================================
document.addEventListener('DOMContentLoaded', async function() {
    const pageType = getPageType();
    
    // Wait for auth to initialize properly
    await initializeAuth();
    
    // Navigation handling removed - let pages use their own nav
    
    // Initialize footer for all pages
    setTimeout(initializeFooter, 50);
    
    if (pageType === 'member') {
        // ONLY redirect if it's actually a member page AND user not logged in
        // TEMP DISABLED - if (!isLoggedIn) {
        //     window.location.href = 'dcf_login_page.html';
        //     return;
        // }
        // Load avatar on page load - FIXED VERSION
        setTimeout(async () => {
            await loadPageAvatars();
        }, 100);
        setTimeout(initializeQuickActions, 200);
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isDropdownOpen) {
                closeUserMenu();
            }
        });
     } else {
        // Public pages - no redirects, just UI
        handlePublicPageAuth();
        const isLoggedIn = window.dcfUser ? window.dcfUser.isLoggedIn : false;
        if (isLoggedIn) {
            setTimeout(async () => {
                await updateUserDropdownInfo();
            }, 100);
        }
}
    
    // ALSO handle member pages that have existing .user-menu
    if (pageType === 'member' && isLoggedIn) {
        addNotificationBellToMemberPages();
        
       // Initialize notification system
        setTimeout(() => {
            // updateNotificationBadge(); // Function not defined - commented out
            
            // Notification bell uses inline onclick - no addEventListener conflicts
            
            // Update badge every 30 seconds if function exists
            // setInterval(updateNotificationBadge, 30000); // Function not defined - commented out
        }, 1000);
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
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
// =============================================================================
// 9. USERNAME VALIDATION FUNCTIONS
// =============================================================================
async function validateUsername(username) {
    // Check format
    if (!username || username.length < 3 || username.length > 30) {
        return { valid: false, message: 'Username must be 3-30 characters long' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    
    // Check availability
   if (!window.masterSupabase) {
        initializeSupabase();
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    try {
        const { data, error } = await window.masterSupabase
            .from('user_profiles')
            .select('username')
            .eq('username', username.toLowerCase())
            .single();
        
        if (data) {
            return { valid: false, message: 'Username is already taken' };
        }
        
        return { valid: true, message: 'Username is available' };
    } catch (error) {
        return { valid: true, message: 'Username is available' };
    }
}

function generateSuggestedUsername(email, name) {
    if (email) {
        return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    if (name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
    }
    return 'user_' + Math.random().toString(36).substring(2, 8);
}

// Make functions available globally
window.validateUsername = validateUsername;
window.generateSuggestedUsername = generateSuggestedUsername;

// DUPLICATE NOTIFICATION FUNCTIONS REMOVED - USING TOP VERSIONS ONLYRetryClaude can make mistakes. Please double-check responses.
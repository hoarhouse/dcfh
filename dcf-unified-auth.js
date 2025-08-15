// ===================================================================
// DCF HUNGARY - UNIFIED AUTHENTICATION SYSTEM
// SINGLE FILE REPLACEMENT FOR: supabase-auth.js + dcf-master-consolidated.js + notification-system.js
// NO CONFLICTS, NO MULTIPLE CLIENTS, EVERYTHING WORKS
// ===================================================================

console.log('🚀 DCF Unified Auth System Loading...');

// =============================================================================
// 1. SINGLE SUPABASE CLIENT - NO CONFLICTS
// =============================================================================
const SUPABASE_URL = 'https://atzommnkkwzgbktuzjti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';

// SINGLE CLIENT - PREVENT MULTIPLE INSTANCES
if (!window.dcfSupabase) {
    if (typeof window !== 'undefined' && window.supabase) {
        window.dcfSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Single Supabase client created');
    } else {
        console.error('❌ Supabase library not loaded');
    }
}

// =============================================================================
// 2. GLOBAL STATE - SINGLE SOURCE OF TRUTH
// =============================================================================
window.dcfUser = {
    isLoggedIn: false,
    profile: null,
    session: null
};

window.isDropdownOpen = false;
window.notificationDropdownOpen = false;

// =============================================================================
// 3. AUTHENTICATION CORE - NO HANGING PROMISES
// =============================================================================
async function initializeAuth() {
    if (!window.dcfSupabase) {
        console.log('❌ No Supabase client available');
        return false;
    }
    
    try {
        console.log('🔐 Checking authentication...');
        
        // Get current session with timeout
        const sessionPromise = window.dcfSupabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (session?.user) {
            console.log('✅ User session found:', session.user.email);
            
            // Get profile data with timeout
            const profilePromise = window.dcfSupabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
            const profileTimeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
            );
            
            try {
                const { data: profile } = await Promise.race([profilePromise, profileTimeoutPromise]);
                
                window.dcfUser = {
                    isLoggedIn: true,
                    profile: {
                        id: session.user.id,
                        email: session.user.email,
                        name: profile?.name || session.user.email?.split('@')[0] || 'User',
                        username: profile?.username || session.user.email?.split('@')[0] || 'user',
                        avatar_url: profile?.avatar_url || null
                    },
                    session: session
                };
                
                console.log('✅ User profile loaded:', window.dcfUser.profile);
                return true;
                
            } catch (profileError) {
                console.log('⚠️ Profile fetch failed, using session data:', profileError.message);
                
                // Fallback to session data only
                window.dcfUser = {
                    isLoggedIn: true,
                    profile: {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.email?.split('@')[0] || 'User',
                        username: session.user.email?.split('@')[0] || 'user',
                        avatar_url: null
                    },
                    session: session
                };
                
                return true;
            }
        } else {
            console.log('ℹ️ No user session found');
            window.dcfUser = { isLoggedIn: false, profile: null, session: null };
            return false;
        }
        
    } catch (error) {
        console.error('❌ Auth initialization failed:', error.message);
        window.dcfUser = { isLoggedIn: false, profile: null, session: null };
        return false;
    }
}

// =============================================================================
// 4. USER INTERFACE UPDATES - NO HANGING, WORKS RELIABLY
// =============================================================================
function updateUserInterface() {
    console.log('🎨 Updating user interface...');
    
    const user = window.dcfUser;
    
    if (!user.isLoggedIn || !user.profile) {
        console.log('ℹ️ User not logged in, showing login state');
        showLoggedOutState();
        return;
    }
    
    console.log('✅ Updating UI for logged-in user:', user.profile.username);
    
    // Update dropdown info
    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');
    
    if (nameElement) {
        nameElement.textContent = `@${user.profile.username}`;
    }
    if (emailElement) {
        emailElement.textContent = user.profile.email;
    }
    
    // Generate initials
    const initials = generateInitials(user.profile.name);
    console.log('🔤 Generated initials:', initials);
    
    // Update main avatar
    const avatarElement = document.getElementById('userAvatar');
    if (avatarElement) {
        if (user.profile.avatar_url) {
            console.log('🖼️ Setting profile picture:', user.profile.avatar_url);
            avatarElement.style.backgroundImage = `url(${user.profile.avatar_url})`;
            avatarElement.style.backgroundSize = 'cover';
            avatarElement.style.backgroundPosition = 'center';
            avatarElement.textContent = '';
        } else {
            console.log('🔤 Using initials:', initials);
            avatarElement.style.backgroundImage = '';
            avatarElement.style.background = 'linear-gradient(135deg, #000, #333)';
            avatarElement.textContent = initials;
        }
        
        // Make clickable
        avatarElement.setAttribute('onclick', 'toggleUserMenu()');
        avatarElement.style.cursor = 'pointer';
        avatarElement.className = 'user-avatar';
    }
    
    // Update dropdown avatar
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');
    if (dropdownAvatarElement) {
        if (user.profile.avatar_url) {
            dropdownAvatarElement.style.backgroundImage = `url(${user.profile.avatar_url})`;
            dropdownAvatarElement.style.backgroundSize = 'cover';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.textContent = '';
        } else {
            dropdownAvatarElement.style.backgroundImage = '';
            dropdownAvatarElement.style.background = 'linear-gradient(135deg, #000, #333)';
            dropdownAvatarElement.textContent = initials;
        }
    }
    
    // Add notification bell
    addNotificationBell();
    
    console.log('✅ UI update complete');
}

function showLoggedOutState() {
    const avatarElement = document.getElementById('userAvatar');
    if (avatarElement) {
        avatarElement.className = 'user-avatar logged-out';
        avatarElement.textContent = '👤';
        avatarElement.style.backgroundImage = '';
        avatarElement.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
        avatarElement.removeAttribute('onclick');
        avatarElement.style.cursor = 'default';
    }
    
    // Show login/signup buttons
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.innerHTML = `
            <a href="auth/dcf_login_page.html" class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px;">Login</a>
            <a href="auth/dcf_profile_signup.html" class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Join Us</a>
        `;
    }
}

function generateInitials(name) {
    if (!name || typeof name !== 'string') return 'U';
    
    const cleanName = name.replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?|Professor|Father|Fr\.?|Sister|Sr\.?|Rabbi)\s+/i, '').trim();
    const parts = cleanName.split(' ').filter(part => part.length > 0);
    
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    
    return 'U';
}

// =============================================================================
// 5. USER MENU FUNCTIONALITY
// =============================================================================
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    
    if (window.isDropdownOpen) {
        closeUserMenu();
    } else {
        openUserMenu();
    }
}

function openUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    
    dropdown.classList.add('active');
    window.isDropdownOpen = true;
    
    // Add navigation items
    addNavigationItems();
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', handleDocumentClick, true);
    }, 10);
}

function closeUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    
    dropdown.classList.remove('active');
    window.isDropdownOpen = false;
    document.removeEventListener('click', handleDocumentClick, true);
}

function handleDocumentClick(event) {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown && !userDropdown.contains(event.target)) {
        closeUserMenu();
    }
}

function addNavigationItems() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown || dropdown.querySelector('.nav-item')) return;

    const currentPage = window.location.pathname.split('/').pop();
    const basePath = getCorrectBasePath();
    
    const navigationItems = [
        { href: basePath + 'dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: basePath + 'dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: basePath + 'dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: basePath + 'dcf_projects_home.html', icon: '📋', text: 'My Projects' },
        { href: basePath + 'dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: basePath + 'dcf_personal_analytics.html', icon: '📊', text: 'My Stats' }
    ];
    
    const navSection = document.createElement('div');
    navSection.innerHTML = '<div class="dropdown-divider"></div>';

    navigationItems.forEach(item => {
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
    if (dropdownHeader) {
        dropdown.insertBefore(navSection, dropdownHeader.nextSibling);
    }
}

// =============================================================================
// 6. NAVIGATION FUNCTIONS
// =============================================================================
function getCorrectBasePath() {
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(p => p);
    const filename = pathParts[pathParts.length - 1] || 'index.html';
    
    console.log('DEBUG PATH - pathname:', pathname);
    console.log('DEBUG PATH - pathParts:', pathParts);
    console.log('DEBUG PATH - filename:', filename);
    
    // Check if we're in a subfolder by looking at known folder names
    const knownFolders = ['members', 'projects', 'events', 'resources', 'auth', 'admin', 'public'];
    
    // Find the current folder
    let currentFolder = null;
    for (let i = pathParts.length - 2; i >= 0; i--) {
        if (knownFolders.includes(pathParts[i])) {
            currentFolder = pathParts[i];
            break;
        }
    }
    
    console.log('DEBUG PATH - currentFolder:', currentFolder);
    
    // If we're in a known subfolder, go up one level
    if (currentFolder) {
        console.log('DEBUG PATH - returning: ../');
        return '../';
    }
    
    // If we're at root level (index.html or similar), no need to go up
    console.log('DEBUG PATH - returning: ./');
    return './';
}

function populateTopNavigation() {
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Only populate if empty
    navMenu.innerHTML = '';
    
    const currentPage = window.location.pathname.split('/').pop();
    const basePath = getCorrectBasePath();
    
    // Member navigation
    const memberNav = [
        { href: basePath + 'dcf_member_home.html', text: 'Home' },
        { href: basePath + 'dcf_members_directory.html', text: 'Members' },
        { href: basePath + 'dcf_projects_home.html', text: 'Projects' },
        { href: basePath + 'dcf_events_calendar.html', text: 'Events' },
        { href: basePath + 'dcf_resources_library.html', text: 'Resources' }
    ];
    
    console.log('DEBUG TOP NAV - basePath:', basePath);
    console.log('DEBUG TOP NAV - memberNav:', memberNav);
    
    const navItems = memberNav.filter(item => item.href !== currentPage);
    
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
// 7. LOGOUT FUNCTIONALITY
// =============================================================================
function handleLogout() {
    closeUserMenu();
    showLogoutModal();
}

function showLogoutModal() {
    if (!document.getElementById('logoutModal')) {
        const modalHTML = `
            <div class="logout-modal" id="logoutModal">
                <div class="logout-modal-content">
                    <div class="logout-modal-header">
                        <h2 class="logout-modal-title">Sign Out</h2>
                    </div>
                    <p style="margin-bottom: 2rem; color: #666;">Are you sure you want to sign out?</p>
                    <div class="form-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-secondary" onclick="closeLogoutModal()">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="confirmLogout()">Sign Out</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const style = document.createElement('style');
        style.textContent = `
            .logout-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 10000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
            .logout-modal.active { display: flex; opacity: 1; }
            .logout-modal-content { background: white; border-radius: 12px; padding: 2rem; max-width: 400px; width: 90%; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); }
            .logout-modal-header { margin-bottom: 1.5rem; }
            .logout-modal-title { font-size: 1.3rem; font-weight: 600; color: #333; }
            .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-size: 0.9rem; cursor: pointer; font-weight: 600; }
            .btn-primary { background: #000; color: white; }
            .btn-secondary { background: transparent; color: #666; border: 2px solid #e5e5e5; }
        `;
        document.head.appendChild(style);
    }
    
    document.getElementById('logoutModal').classList.add('active');
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) modal.classList.remove('active');
}

async function confirmLogout() {
    try {
        // Sign out from Supabase
        if (window.dcfSupabase) {
            await window.dcfSupabase.auth.signOut();
        }
        
        // Clear state
        window.dcfUser = { isLoggedIn: false, profile: null, session: null };
        
        // Clear localStorage
        localStorage.removeItem('dcf_user_logged_in');
        localStorage.removeItem('dcf_user_name');
        localStorage.removeItem('dcf_user_email');
        
        // Navigate to login page
        const basePath = getCorrectBasePath();
        window.location.href = basePath + 'auth/dcf_login_page.html';
        
    } catch (error) {
        console.error('Error during logout:', error);
        // Force logout even if Supabase signOut fails
        localStorage.clear();
        sessionStorage.clear();
        const basePath = getCorrectBasePath();
        window.location.href = basePath + 'auth/dcf_login_page.html';
    }
}

// =============================================================================
// 8. QUICK ACTIONS SYSTEM
// =============================================================================
function initializeQuickActions() {
    const currentPage = getCurrentPageType();
    const container = document.querySelector('.quick-actions-container, .sidebar-card div[style*="flex-direction: column"]');
    if (!container) return;
    
    const actionsHTML = getQuickActionsHTML(currentPage);
    container.innerHTML = actionsHTML;
}

function getCurrentPageType() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop();
    
    if (filename.includes('projects_home')) return 'projects';
    if (filename.includes('project_detail')) return 'project_detail';
    if (filename.includes('create_project')) return 'create_project';
    if (filename === 'dcf_projects.html') return 'my_projects';
    if (filename.includes('events_calendar') || filename.includes('event_details')) return 'events';
    if (filename.includes('create_event')) return 'create_event';
    if (filename.includes('members_directory') || filename.includes('member_view')) return 'members';
    if (filename.includes('resources_library') || filename.includes('resource_detail')) return 'resources';
    if (filename.includes('member_home')) return 'home_feed';
    
    return 'default';
}

function getQuickActionsHTML(pageType) {
    const basePath = getCorrectBasePath();
    
    switch (pageType) {
        case 'projects':
            return `
                <button class="btn btn-primary" onclick="focusSearchProjects()">🔍 Search Projects</button>
                <button class="btn btn-primary" onclick="window.location.href='${basePath}dcf_create_project.html'">➕ Create Project</button>
                <button class="btn btn-secondary" onclick="exploreJoinableProjects()">🤝 Join Project</button>
                <button class="btn btn-secondary" onclick="window.location.href='${basePath}dcf_projects.html'">📊 Manage My Projects</button>
            `;
        case 'events':
            return `
                <button class="btn btn-primary" onclick="focusSearchEvents()">📅 Find Events</button>
                <button class="btn btn-primary" onclick="window.location.href='${basePath}dcf_create_event.html'">➕ Create Event</button>
                <button class="btn btn-secondary" onclick="exploreUpcomingEvents()">🎟️ Register for Events</button>
                <button class="btn btn-secondary" onclick="window.location.href='${basePath}dcf_events.html'">📋 My Event Calendar</button>
            `;
        case 'members':
            return `
                <button class="btn btn-primary" onclick="focusSearchMembers()">👥 Find Members</button>
                <button class="btn btn-secondary" onclick="connectWithMembers()">🤝 Connect with Members</button>
                <button class="btn btn-secondary" onclick="showComingSoon('My Network')">🌐 View My Network</button>
                <button class="btn btn-secondary" onclick="window.location.href='${basePath}dcf_personal_analytics.html'">📊 Member Analytics</button>
            `;
        case 'resources':
            return `
                <button class="btn btn-primary" onclick="focusSearchResources()">📚 Browse Library</button>
                <button class="btn btn-primary" onclick="window.location.href='${basePath}dcf_resource_upload.html'">⬆️ Upload Resource</button>
                <button class="btn btn-secondary" onclick="viewMyContributions()">📝 My Contributions</button>
                <button class="btn btn-secondary" onclick="viewBookmarks()">🔖 My Bookmarks</button>
            `;
        case 'home_feed':
            return `
                <button class="btn btn-primary" onclick="window.location.href='${basePath}dcf_create_project.html'">🚀 Create Project</button>
                <button class="btn btn-primary" onclick="window.location.href='${basePath}dcf_create_event.html'">📅 Create Event</button>
                <button class="btn btn-secondary" onclick="window.location.href='${basePath}dcf_members_directory.html'">👥 Find Collaborators</button>
                <button class="btn btn-secondary" onclick="window.location.href='${basePath}dcf_personal_analytics.html'">📊 View My Stats</button>
            `;
        default:
            return `
                <button class="btn btn-primary" onclick="window.location.href='${basePath}dcf_create_project.html'">🚀 Create Project</button>
                <button class="btn btn-secondary" onclick="window.location.href='${basePath}dcf_personal_analytics.html'">📊 View Analytics</button>
                <button class="btn btn-secondary" onclick="window.location.href='${basePath}dcf_events_calendar.html'">📅 Events Calendar</button>
                <button class="btn btn-secondary" onclick="window.location.href='${basePath}dcf_member_home.html'">💬 Discussion Forum</button>
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
        window.location.href = getCorrectBasePath() + 'dcf_projects_home.html';
    }
}

function exploreJoinableProjects() {
    if (window.location.pathname.includes('projects_home')) {
        const recruitingBtn = document.querySelector('.category-btn[data-category="recruiting"], button[data-category="recruiting"]');
        if (recruitingBtn) {
            recruitingBtn.click();
        }
    } else {
        window.location.href = getCorrectBasePath() + 'dcf_projects_home.html?filter=recruiting';
    }
}

function focusSearchEvents() {
    const searchInput = document.querySelector('#eventSearch, .search-input, input[placeholder*="Search events"], input[placeholder*="search events"]');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = getCorrectBasePath() + 'dcf_events_calendar.html';
    }
}

function exploreUpcomingEvents() {
    if (window.location.pathname.includes('events_calendar')) {
        const upcomingSection = document.querySelector('.upcoming-events, .events-grid');
        if (upcomingSection) {
            upcomingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        window.location.href = getCorrectBasePath() + 'dcf_events_calendar.html';
    }
}

function focusSearchMembers() {
    const searchInput = document.querySelector('#memberSearch, .search-input, input[placeholder*="Search members"], input[placeholder*="search members"]');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = getCorrectBasePath() + 'dcf_members_directory.html';
    }
}

function connectWithMembers() {
    window.location.href = getCorrectBasePath() + 'dcf_members_directory.html';
}

function focusSearchResources() {
    const searchInput = document.querySelector('#resourceSearch, .search-input, input[placeholder*="Search resources"], input[placeholder*="search resources"]');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = getCorrectBasePath() + 'dcf_resources_library.html';
    }
}

function viewMyContributions() {
    window.location.href = getCorrectBasePath() + 'dcf_resources_library.html?filter=my_contributions';
}

function viewBookmarks() {
    window.location.href = getCorrectBasePath() + 'dcf_resources_library.html?filter=bookmarks';
}

function showComingSoon(feature) {
    alert(`${feature} page coming soon!`);
}

// =============================================================================
// 9. FOOTER FUNCTIONALITY
// =============================================================================
function initializeFooter() {
    // Only add footer if one doesn't exist
    if (document.querySelector('.site-footer')) return;
    
    const basePath = getCorrectBasePath();
    
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-logo">
                    <div class="footer-logo-icon"></div>
                    <span class="footer-logo-text">DCF Hungary</span>
                </div>
                <div class="footer-links">
                    <a href="${basePath}index.html">Home</a>
                    <a href="${basePath}dcf_about.html">About</a>
                    <a href="${basePath}dcf_contact.html">Contact</a>
                    <a href="${basePath}auth/dcf_login_page.html">Login</a>
                    <a href="${basePath}auth/dcf_profile_signup.html">Join</a>
                </div>
            </div>
        </div>
    </footer>

    <style>
    .site-footer { background: #f8f9fa; border-top: 1px solid #e5e5e5; padding: 1.5rem 0; margin-top: 3rem; }
    .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    .footer-content { display: flex; justify-content: space-between; align-items: center; }
    .footer-logo { display: flex; align-items: center; }
    .footer-logo-icon { width: 24px; height: 24px; background: #333; border-radius: 50%; margin-right: 0.5rem; }
    .footer-logo-text { font-size: 1.1rem; font-weight: 600; color: #333; }
    .footer-links { display: flex; gap: 2rem; }
    .footer-links a { color: #666; text-decoration: none; font-size: 0.9rem; transition: color 0.2s ease; }
    .footer-links a:hover { color: #333; }
    @media (max-width: 768px) { .footer-content { flex-direction: column; gap: 1rem; } .footer-links { gap: 1.5rem; } }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// =============================================================================
// 10. NOTIFICATION SYSTEM
// =============================================================================
class NotificationSystem {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.currentUser = window.dcfUser?.profile || null;
    }

    async createLikeNotification(postId, postAuthorEmail, postAuthorName, postContent) {
        try {
            if (!this.currentUser || postAuthorEmail === this.currentUser.email) return;

            const { error } = await this.supabase
                .from('notifications')
                .insert({
                    type: 'post_like',
                    title: 'Someone liked your post',
                    message: `${this.currentUser.name} liked your post: "${this.truncateText(postContent, 50)}"`,
                    recipient_email: postAuthorEmail,
                    recipient_name: postAuthorName,
                    sender_email: this.currentUser.email,
                    sender_name: this.currentUser.name,
                    related_id: postId,
                    related_type: 'post'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error creating like notification:', error);
        }
    }

    async createCommentNotification(postId, postAuthorEmail, postAuthorName, commentContent) {
        try {
            if (!this.currentUser || postAuthorEmail === this.currentUser.email) return;

            const { error } = await this.supabase
                .from('notifications')
                .insert({
                    type: 'post_comment',
                    title: 'New comment on your post',
                    message: `${this.currentUser.name} commented: "${this.truncateText(commentContent, 50)}"`,
                    recipient_email: postAuthorEmail,
                    recipient_name: postAuthorName,
                    sender_email: this.currentUser.email,
                    sender_name: this.currentUser.name,
                    related_id: postId,
                    related_type: 'post'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error creating comment notification:', error);
        }
    }

    async getUnreadCount(userEmail = null) {
        try {
            const email = userEmail || this.currentUser?.email;
            if (!email) return 0;
            
            const { count, error } = await this.supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('recipient_email', email)
                .eq('is_read', false);

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    async updateNotificationBadge() {
        try {
            const count = await this.getUnreadCount();
            const badge = document.getElementById('notificationBadge');
            
            if (badge) {
                if (count > 0) {
                    badge.textContent = count > 99 ? '99+' : count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error updating notification badge:', error);
        }
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
}

function addNotificationBell() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu || userMenu.querySelector('.notification-bell')) return;
    
    const bellHTML = `
        <div class="notification-bell" onclick="toggleNotificationDropdown(event)">
            <span class="notification-icon">🔔</span>
            <div class="notification-badge" id="notificationBadge" style="display: none;">0</div>
        </div>
    `;
    
    userMenu.insertAdjacentHTML('afterbegin', bellHTML);
    addNotificationCSS();
}

function toggleNotificationDropdown(event) {
    if (event) event.stopPropagation();
    console.log('🔔 Notification bell clicked');
    
    // Initialize notification system if not already done
    if (!window.notificationSystem && window.dcfSupabase) {
        window.notificationSystem = new NotificationSystem(window.dcfSupabase);
        window.notificationSystem.updateNotificationBadge();
    }
}

function addNotificationCSS() {
    if (document.querySelector('#notificationCSS')) return;
    
    const style = document.createElement('style');
    style.id = 'notificationCSS';
    style.textContent = `
        .notification-bell { 
            position: relative; 
            cursor: pointer; 
            padding: 0.5rem; 
            border-radius: 50%; 
            transition: background-color 0.3s ease; 
            margin-right: 1rem; 
        }
        .notification-bell:hover { background-color: #f0f0f0; }
        .notification-icon { font-size: 1.2rem; display: block; }
        .notification-badge { 
            position: absolute; 
            top: -2px; 
            right: -2px; 
            background: #dc3545; 
            color: white; 
            border-radius: 50%; 
            width: 20px; 
            height: 20px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 0.7rem; 
            font-weight: 600; 
            border: 2px solid white; 
        }
    `;
    document.head.appendChild(style);
}

// =============================================================================
// 11. AUTH STATE LISTENER - NO CONFLICTS
// =============================================================================
function setupAuthStateListener() {
    if (!window.dcfSupabase) return;
    
    window.dcfSupabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
            await initializeAuth();
            updateUserInterface();
        } else if (event === 'SIGNED_OUT') {
            window.dcfUser = { isLoggedIn: false, profile: null, session: null };
            showLoggedOutState();
        }
    });
}

// =============================================================================
// 12. HELPER FUNCTIONS FOR POSTS/COMMENTS
// =============================================================================
function getCurrentUser() {
    if (!window.dcfUser?.isLoggedIn) return null;
    return window.dcfUser.profile;
}

function isUserLoggedIn() {
    return window.dcfUser?.isLoggedIn || false;
}

function getUserEmail() {
    return getCurrentUser()?.email || null;
}

function getUserName() {
    return getCurrentUser()?.name || null;
}

function getUserId() {
    return getCurrentUser()?.id || null;
}

// =============================================================================
// 13. INITIALIZATION - SINGLE ENTRY POINT
// =============================================================================
async function initializeDCF() {
    console.log('🚀 Initializing DCF Authentication System...');
    
    try {
        // Setup auth state listener
        setupAuthStateListener();
        
        // Initialize authentication
        const isLoggedIn = await initializeAuth();
        
        // Update UI based on auth state
        updateUserInterface();
        
        // Initialize components
        populateTopNavigation();
        initializeQuickActions();
        initializeFooter();
        
        // Initialize notification system if logged in
        if (isLoggedIn && window.dcfSupabase) {
            window.notificationSystem = new NotificationSystem(window.dcfSupabase);
            window.notificationSystem.updateNotificationBadge();
        }
        
        console.log(`✅ DCF initialization complete. User logged in: ${isLoggedIn}`);
        
        return isLoggedIn;
        
    } catch (error) {
        console.error('❌ DCF initialization failed:', error);
        showLoggedOutState();
        return false;
    }
}

// =============================================================================
// 14. GLOBAL EXPORTS
// =============================================================================
window.toggleUserMenu = toggleUserMenu;
window.handleLogout = handleLogout;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.getCurrentUser = getCurrentUser;
window.isUserLoggedIn = isUserLoggedIn;
window.getUserEmail = getUserEmail;
window.getUserName = getUserName;
window.getUserId = getUserId;
window.initializeDCF = initializeDCF;
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

// =============================================================================
// 15. AUTO-INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, starting DCF initialization...');
    
    // Small delay to ensure Supabase is loaded
    setTimeout(async () => {
        await initializeDCF();
    }, 500);
});

// Fallback for pages where DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('📄 DOM already loaded, starting immediate initialization...');
    setTimeout(async () => {
        await initializeDCF();
    }, 100);
}

console.log('✅ DCF Unified Auth System loaded successfully');
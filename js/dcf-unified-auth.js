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
            
            // Get profile data with timeout - FIXED QUERY
            const profilePromise = window.dcfSupabase
                .from('user_profiles')
                .select('name, username, email, avatar_url')
                .eq('email', session.user.email)
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
    console.log('🔍 DEBUG - User Profile Data:', user.profile);
    console.log('🔍 DEBUG - Profile Name:', user.profile.name);
    console.log('🔍 DEBUG - Profile Username:', user.profile.username);
    const initials = generateInitials(user.profile.name);
    console.log('🔍 DEBUG - Generated Initials:', initials);
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
        const basePath = getCorrectBasePath();
        userMenu.innerHTML = `
            <a href="${basePath}auth/dcf_login_page.html" class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px;">Login</a>
            <a href="${basePath}auth/dcf_profile_signup.html" class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Join Us</a>
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
        { href: basePath + 'members/dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: basePath + 'members/dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: basePath + 'members/dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: basePath + 'projects/dcf_projects_home.html', icon: '📋', text: 'My Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: basePath + 'members/dcf_personal_analytics.html', icon: '📊', text: 'My Stats' }
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
        { href: basePath + 'members/dcf_member_home.html', text: 'Home' },
        { href: basePath + 'members/dcf_members_directory.html', text: 'Members' },
        { href: basePath + 'projects/dcf_projects_home.html', text: 'Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', text: 'Events' },
        { href: basePath + 'resources/dcf_resources_library.html', text: 'Resources' }
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
    }
    
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) {
        createNotificationDropdown();
    }
    
    if (window.notificationDropdownOpen) {
        closeNotificationDropdown();
    } else {
        openNotificationDropdown();
    }
}

function createNotificationDropdown() {
    const bell = document.querySelector('.notification-bell');
    if (!bell) return;
    
    const dropdownHTML = `
        <div class="notification-dropdown" id="notificationDropdown">
            <div class="notification-dropdown-header">
                <h3 class="notification-dropdown-title">Notifications</h3>
                <button class="mark-all-read-btn" onclick="markAllNotificationsRead()">Mark All Read</button>
            </div>
            <div class="notification-dropdown-content" id="notificationDropdownContent">
                <div class="notification-loading">Loading notifications...</div>
            </div>
            <div class="notification-dropdown-footer">
                <a href="#" class="view-all-notifications">View All Notifications</a>
            </div>
        </div>
    `;
    
    bell.style.position = 'relative';
    bell.insertAdjacentHTML('afterend', dropdownHTML);
    addNotificationDropdownCSS();
}

async function openNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    dropdown.classList.add('active');
    window.notificationDropdownOpen = true;
    
    // Load notifications
    await loadNotifications();
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', handleNotificationDocumentClick, true);
    }, 10);
}

function closeNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    dropdown.classList.remove('active');
    window.notificationDropdownOpen = false;
    document.removeEventListener('click', handleNotificationDocumentClick, true);
}

function handleNotificationDocumentClick(event) {
    const notificationBell = document.querySelector('.notification-bell');
    const dropdown = document.getElementById('notificationDropdown');
    
    if (notificationBell && dropdown && 
        !notificationBell.contains(event.target) && 
        !dropdown.contains(event.target)) {
        closeNotificationDropdown();
    }
}

// =============================================================================
// NOTIFICATION TIME FORMATTING
// =============================================================================
function formatTimeAgo(dateString) {
    if (!dateString) return 'Unknown time';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Unknown time';
    }
}

async function loadNotifications() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const supabase = window.dcfSupabase;
    const container = document.getElementById('notificationDropdownContent');
    
    try {
        container.innerHTML = '<div class="notification-loading">Loading notifications...</div>';
        
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_email', currentUser.email)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        if (notifications.length === 0) {
            container.innerHTML = '<div class="no-notifications">No notifications yet</div>';
            return;
        }

        container.innerHTML = notifications.map(notification => createNotificationHTML(notification)).join('');

    } catch (error) {
        console.error('Error loading notifications:', error);
        container.innerHTML = '<div class="notification-error">Failed to load notifications</div>';
    }
}

function createNotificationHTML(notification) {
    const timeAgo = formatTimeAgo(notification.created_at);
    const isUnread = !notification.is_read;
    
    return `
        <div class="notification-item ${isUnread ? 'unread' : 'read'}" onclick="handleNotificationClick('${notification.id}', '${notification.related_type}', '${notification.related_id}')">
            <div class="notification-icon">
                ${getNotificationIcon(notification.type)}
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${timeAgo}</div>
            </div>
            ${isUnread ? '<div class="notification-unread-dot"></div>' : ''}
        </div>
    `;
}

function getNotificationIcon(type) {
    const icons = {
        'post_like': '❤️',
        'post_comment': '💬',
        'connection_request': '🤝',
        'event_invite': '📅',
        'project_invite': '📋'
    };
    return icons[type] || '🔔';
}

async function handleNotificationClick(notificationId, relatedType, relatedId) {
    // Mark as read
    await markNotificationRead(notificationId);
    
    // Navigate to related content
    if (relatedType === 'post') {
        // Navigate to post or scroll to it
        console.log('Navigate to post:', relatedId);
    } else if (relatedType === 'connection') {
        // Navigate to connections page
        console.log('Navigate to connection:', relatedId);
    }
    
    closeNotificationDropdown();
}

async function markNotificationRead(notificationId) {
    const supabase = window.dcfSupabase;
    
    try {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);
            
        // Update badge count
        if (window.notificationSystem) {
            window.notificationSystem.updateNotificationBadge();
        }
        
        // Update the notification item visually
        const notificationItem = document.querySelector(`[onclick*="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.classList.remove('unread');
            notificationItem.classList.add('read');
            const dot = notificationItem.querySelector('.notification-unread-dot');
            if (dot) dot.remove();
        }
        
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

async function markAllNotificationsRead() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const supabase = window.dcfSupabase;
    
    try {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('recipient_email', currentUser.email)
            .eq('is_read', false);
            
        // Reload notifications
        await loadNotifications();
        
        // Update badge
        if (window.notificationSystem) {
            window.notificationSystem.updateNotificationBadge();
        }
        
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
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

function addNotificationDropdownCSS() {
    if (document.querySelector('#notificationDropdownCSS')) return;
    
    const style = document.createElement('style');
    style.id = 'notificationDropdownCSS';
    style.textContent = `
        .notification-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            border: 1px solid #e5e5e5;
            width: 380px;
            max-height: 500px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
            overflow: hidden;
        }
        
        .notification-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .notification-dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #f0f0f0;
            background: #f8f9fa;
        }
        
        .notification-dropdown-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin: 0;
        }
        
        .mark-all-read-btn {
            background: none;
            border: none;
            color: #666;
            font-size: 0.85rem;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .mark-all-read-btn:hover {
            color: #333;
            background: #e9ecef;
        }
        
        .notification-dropdown-content {
            max-height: 350px;
            overflow-y: auto;
        }
        
        .notification-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #f8f9fa;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .notification-item:hover {
            background: #f8f9fa;
        }
        
        .notification-item.unread {
            background: #f0f8ff;
            border-left: 3px solid #007bff;
        }
        
        .notification-item.unread:hover {
            background: #e6f3ff;
        }
        
        .notification-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
            margin-top: 0.1rem;
        }
        
        .notification-content {
            flex: 1;
            min-width: 0;
        }
        
        .notification-title {
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .notification-message {
            color: #666;
            font-size: 0.85rem;
            line-height: 1.4;
            margin-bottom: 0.25rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .notification-time {
            color: #999;
            font-size: 0.75rem;
        }
        
        .notification-unread-dot {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 8px;
            height: 8px;
            background: #007bff;
            border-radius: 50%;
            flex-shrink: 0;
        }
        
        .notification-dropdown-footer {
            padding: 0.75rem 1.5rem;
            border-top: 1px solid #f0f0f0;
            background: #f8f9fa;
            text-align: center;
        }
        
        .view-all-notifications {
            color: #666;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 500;
            transition: color 0.2s ease;
        }
        
        .view-all-notifications:hover {
            color: #333;
        }
        
        .notification-loading, .no-notifications, .notification-error {
            padding: 2rem;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        
        .notification-error {
            color: #dc3545;
        }
        
        @media (max-width: 480px) {
            .notification-dropdown {
                width: 320px;
                right: -20px;
            }
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
        
        // Check for page protection
        if (document.body.classList.contains('dcf-public-page') && isLoggedIn) {
            console.log('🔒 Redirecting logged-in user from public auth page');
            window.location.href = getCorrectBasePath() + 'members/dcf_member_home.html';
            return;
        }
        
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
window.markAllNotificationsRead = markAllNotificationsRead;
window.handleNotificationClick = handleNotificationClick;
window.markNotificationRead = markNotificationRead;
window.closeNotificationDropdown = closeNotificationDropdown;
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
window.generateInitials = generateInitials;

// =============================================================================
// 17. STANDARDIZED ALERT SYSTEM
// =============================================================================
function showAlert(message, type = 'info', title = null) {
    return new Promise((resolve) => {
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'dcf-alert';
        alertDiv.setAttribute('data-type', type);
        
        const iconMap = {
            'info': '💡',
            'success': '✅', 
            'warning': '⚠️',
            'error': '❌',
            'question': '❓'
        };
        
        const titleMap = {
            'info': 'Information',
            'success': 'Success',
            'warning': 'Warning', 
            'error': 'Error',
            'question': 'Confirm'
        };
        
        alertDiv.innerHTML = `
            <div class="dcf-alert-overlay" onclick="closeAlert()"></div>
            <div class="dcf-alert-content">
                <div class="dcf-alert-header">
                    <span class="dcf-alert-icon">${iconMap[type]}</span>
                    <h3 class="dcf-alert-title">${title || titleMap[type]}</h3>
                </div>
                <div class="dcf-alert-message">${message}</div>
                <div class="dcf-alert-actions">
                    <button class="dcf-alert-btn dcf-alert-btn-primary" onclick="closeAlert(true)">OK</button>
                </div>
            </div>
        `;
        
        addAlertCSS();
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.classList.add('active'), 10);
        
        window.currentAlertResolve = resolve;
    });
}

function showConfirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'dcf-alert';
        alertDiv.setAttribute('data-type', 'question');
        
        alertDiv.innerHTML = `
            <div class="dcf-alert-overlay" onclick="closeAlert(false)"></div>
            <div class="dcf-alert-content">
                <div class="dcf-alert-header">
                    <span class="dcf-alert-icon">❓</span>
                    <h3 class="dcf-alert-title">${title}</h3>
                </div>
                <div class="dcf-alert-message">${message}</div>
                <div class="dcf-alert-actions">
                    <button class="dcf-alert-btn dcf-alert-btn-secondary" onclick="closeAlert(false)">Cancel</button>
                    <button class="dcf-alert-btn dcf-alert-btn-primary" onclick="closeAlert(true)">Confirm</button>
                </div>
            </div>
        `;
        
        addAlertCSS();
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.classList.add('active'), 10);
        
        window.currentAlertResolve = resolve;
    });
}

function showPrompt(message, defaultValue = '', title = 'Input Required') {
    return new Promise((resolve) => {
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'dcf-alert';
        alertDiv.setAttribute('data-type', 'question');
        
        alertDiv.innerHTML = `
            <div class="dcf-alert-overlay" onclick="closeAlert(null)"></div>
            <div class="dcf-alert-content">
                <div class="dcf-alert-header">
                    <span class="dcf-alert-icon">✏️</span>
                    <h3 class="dcf-alert-title">${title}</h3>
                </div>
                <div class="dcf-alert-message">${message}</div>
                <div class="dcf-alert-input">
                    <input type="text" class="dcf-prompt-input" value="${defaultValue}" placeholder="Enter text..." />
                </div>
                <div class="dcf-alert-actions">
                    <button class="dcf-alert-btn dcf-alert-btn-secondary" onclick="closeAlert(null)">Cancel</button>
                    <button class="dcf-alert-btn dcf-alert-btn-primary" onclick="closeAlertWithInput()">OK</button>
                </div>
            </div>
        `;
        
        addAlertCSS();
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.classList.add('active');
            const input = alertDiv.querySelector('.dcf-prompt-input');
            if (input) {
                input.focus();
                input.select();
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') closeAlertWithInput();
                    if (e.key === 'Escape') closeAlert(null);
                });
            }
        }, 10);
        
        window.currentAlertResolve = resolve;
    });
}

function closeAlert(result = false) {
    const alert = document.querySelector('.dcf-alert');
    if (alert) {
        alert.classList.remove('active');
        setTimeout(() => {
            if (alert.parentNode) alert.parentNode.removeChild(alert);
        }, 300);
    }
    
    if (window.currentAlertResolve) {
        window.currentAlertResolve(result);
        window.currentAlertResolve = null;
    }
}

function closeAlertWithInput() {
    const input = document.querySelector('.dcf-prompt-input');
    const value = input ? input.value : null;
    closeAlert(value);
}

function removeExistingAlert() {
    const existingAlert = document.querySelector('.dcf-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
}

function addAlertCSS() {
    if (!document.querySelector('#dcf-alert-css')) {
        const style = document.createElement('style');
        style.id = 'dcf-alert-css';
        style.textContent = `
            .dcf-alert {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .dcf-alert.active {
                opacity: 1;
                visibility: visible;
            }
            
            .dcf-alert-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                cursor: pointer;
            }
            
            .dcf-alert-content {
                background: white;
                border-radius: 12px;
                padding: 0;
                max-width: 450px;
                width: 90%;
                position: relative;
                z-index: 1;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
                overflow: hidden;
            }
            
            .dcf-alert.active .dcf-alert-content {
                transform: scale(1);
            }
            
            .dcf-alert-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.5rem 1.5rem 1rem 1.5rem;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .dcf-alert-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .dcf-alert-title {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
                color: #333;
            }
            
            .dcf-alert-message {
                padding: 1.5rem;
                color: #666;
                line-height: 1.6;
                font-size: 0.95rem;
            }
            
            .dcf-alert-input {
                padding: 0 1.5rem;
            }
            
            .dcf-prompt-input {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e5e5e5;
                border-radius: 8px;
                font-size: 0.95rem;
                transition: border-color 0.3s ease;
                outline: none;
            }
            
            .dcf-prompt-input:focus {
                border-color: #000;
            }
            
            .dcf-alert-actions {
                padding: 1rem 1.5rem 1.5rem 1.5rem;
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
                background: #fafafa;
            }
            
            .dcf-alert-btn {
                padding: 0.6rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 80px;
            }
            
            .dcf-alert-btn-primary {
                background: #000;
                color: white;
            }
            
            .dcf-alert-btn-primary:hover {
                background: #333;
                transform: translateY(-1px);
            }
            
            .dcf-alert-btn-secondary {
                background: transparent;
                color: #666;
                border: 2px solid #e5e5e5;
            }
            
            .dcf-alert-btn-secondary:hover {
                color: #333;
                border-color: #333;
                transform: translateY(-1px);
            }
            
            .dcf-alert[data-type="success"] .dcf-alert-header {
                background: linear-gradient(135deg, #d4edda, #c3e6cb);
            }
            
            .dcf-alert[data-type="warning"] .dcf-alert-header {
                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            }
            
            .dcf-alert[data-type="error"] .dcf-alert-header {
                background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            }
            
            .dcf-alert[data-type="info"] .dcf-alert-header {
                background: linear-gradient(135deg, #d1ecf1, #bee5eb);
            }
        `;
        document.head.appendChild(style);
    }
}

// Export alert functions to window
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showPrompt = showPrompt;
window.closeAlert = closeAlert;

// =============================================================================
// 18. MISSING TABLE HANDLERS - GRACEFUL DEGRADATION
// =============================================================================
// Handle missing tables gracefully - REMOVED SINCE TABLES EXIST
// Comments table is called 'post_comments' not 'comments'
// Make dcfSupabase available as authSupabase and masterSupabase for existing code
window.authSupabase = window.dcfSupabase;
window.masterSupabase = window.dcfSupabase;
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
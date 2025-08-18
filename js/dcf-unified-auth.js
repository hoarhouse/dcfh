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
            
            // Get profile data - query by email since that's your setup
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
                
                console.log('🔍 RAW DATABASE PROFILE:', profile);
                
                window.dcfUser = {
                    isLoggedIn: true,
                    profile: {
                        id: session.user.id,
                        email: session.user.email,
                        // FIXED: Always use database fields, never fallback to email parsing
                        name: profile?.name || 'Unknown User',
                        username: profile?.username || 'unknown',
                        avatar_url: profile?.avatar_url || null
                    },
                    session: session
                };
                
                console.log('✅ User profile loaded:', window.dcfUser.profile);
                console.log('✅ Username from DB:', window.dcfUser.profile.username);
                console.log('✅ Name from DB:', window.dcfUser.profile.name);
                return true;
                
            } catch (profileError) {
                console.log('⚠️ Profile fetch failed:', profileError.message);
                
                // Even in fallback, don't parse email for username
                window.dcfUser = {
                    isLoggedIn: true,
                    profile: {
                        id: session.user.id,
                        email: session.user.email,
                        name: 'Unknown User',
                        username: 'unknown',
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
    
    // Update dropdown info - ALWAYS USE DATABASE USERNAME
    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');
    
    if (nameElement) {
        // FIXED: Always show @username from database, never email
        nameElement.textContent = `@${user.profile.username}`;
    }
    if (emailElement) {
        emailElement.textContent = user.profile.email;
    }
    
    // FIXED: Generate initials from NAME field (first + last name), never email
    console.log('🔍 DEBUG - User Profile Data:', user.profile);
    console.log('🔍 DEBUG - Profile Name for initials:', user.profile.name);
    const initials = generateInitials(user.profile.name);
    console.log('🔍 DEBUG - Generated Initials:', initials);
    
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
        const currentPage = window.location.pathname;
        const isSignupPage = currentPage.includes('dcf_profile_signup.html');
        
        if (isSignupPage) {
            // Signup page: only show login option
            userMenu.innerHTML = `
                <a href="${basePath}auth/dcf_login_page.html" class="login-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Already a member? Sign In</a>
            `;
        } else {
            // Other pages: show both login and join
            userMenu.innerHTML = `
                <a href="${basePath}auth/dcf_login_page.html" class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px;">Login</a>
                <a href="${basePath}auth/dcf_profile_signup.html" class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Join Us</a>
            `;
        }
    }
}

function generateInitials(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        console.log('❌ No valid name provided for initials, using fallback');
        return 'CH'; // Your fallback
    }
    
    console.log('🔍 Generating initials from name:', fullName);
    
    // Remove titles and clean the name
    const cleanName = fullName.replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?|Professor|Father|Fr\.?|Sister|Sr\.?|Rabbi)\s+/i, '').trim();
    const parts = cleanName.split(' ').filter(part => part.length > 0);
    
    console.log('🔍 Name parts after cleaning:', parts);
    
    if (parts.length >= 2) {
        // First letter of first name + first letter of last name
        const initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        console.log('🔍 Generated initials (first + last):', initials);
        return initials;
    } else if (parts.length === 1) {
        // If only one name, use first two letters
        const initials = parts[0].substring(0, 2).toUpperCase();
        console.log('🔍 Generated initials (single name):', initials);
        return initials;
    }
    
    console.log('🔍 Fallback initials used');
    return 'CH'; // Your fallback
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
    console.log('🚀 populateTopNavigation() called');
    
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
    console.log('🔍 DEBUG NAV: navMenu element found:', !!navMenu);
    if (!navMenu) {
        console.log('❌ DEBUG NAV: No navMenu element found');
        return;
    }
    
    // Only populate if empty
    navMenu.innerHTML = '';
    
    const currentPage = window.location.pathname.split('/').pop();
    const basePath = getCorrectBasePath();
    
    console.log('🔍 DEBUG NAV: window.dcfUser:', window.dcfUser);
    console.log('🔍 DEBUG NAV: User login status:', window.dcfUser?.isLoggedIn);
    console.log('🔍 DEBUG NAV: Navigation type:', window.dcfUser?.isLoggedIn ? 'member' : 'public');
    
    let navItems;
    
    // Check if user is logged in
    if (window.dcfUser?.isLoggedIn) {
        console.log('✅ DEBUG NAV: Using member navigation');
        // Member navigation
        navItems = [
            { href: basePath + 'members/dcf_member_home.html', text: 'Home' },
            { href: basePath + 'members/dcf_members_directory.html', text: 'Members' },
            { href: basePath + 'projects/dcf_projects_home.html', text: 'Projects' },
            { href: basePath + 'events/dcf_events_calendar.html', text: 'Events' },
            { href: basePath + 'resources/dcf_resources_library.html', text: 'Resources' }
        ];
    } else {
        console.log('✅ DEBUG NAV: Using public navigation');
        // Public navigation
        navItems = [
            { href: basePath + 'public/dcf_about.html', text: 'About' },
            { href: basePath + 'public/dcf_contact.html', text: 'Contact' },
            { href: basePath + 'public/dcf_events_public.html', text: 'Events' },
            { href: basePath + 'public/dcf_projects_public.html', text: 'Projects' },
            { href: basePath + 'public/dcf_resources_public.html', text: 'Resources' },
            { href: basePath + 'public/dcf_newsletter.html', text: 'Newsletter' }
        ];
    }
    
    console.log('🔍 DEBUG NAV: navItems:', navItems);
    console.log('DEBUG TOP NAV - basePath:', basePath);
    console.log('DEBUG TOP NAV - navItems:', navItems);
    console.log('DEBUG TOP NAV - isLoggedIn:', window.dcfUser?.isLoggedIn);
    
    const filteredNavItems = navItems.filter(item => item.href !== currentPage);
    
    filteredNavItems.forEach(item => {
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
            <!-- Main Footer Content -->
            <div class="footer-main">
                <!-- Column 1: Brand & Mission -->
                <div class="footer-brand">
                    <div class="footer-logo">
                        <div class="footer-logo-icon"></div>
                        <span class="footer-logo-text">DCF Hungary</span>
                    </div>
                    <p class="footer-mission">
                        Advancing ethical AI development and promoting human dignity in technology through 
                        collaborative research, education, and global initiatives.
                    </p>
                    <div class="footer-social">
                        <a href="#" class="social-link" aria-label="LinkedIn">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Twitter">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="GitHub">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Column 2: Navigation -->
                <div class="footer-navigation">
                    <h4 class="footer-heading">Navigation</h4>
                    <nav class="footer-nav">
                        <a href="${basePath}index.html" class="footer-link">Home</a>
                        <a href="${basePath}public/dcf_about.html" class="footer-link">About Us</a>
                        <a href="${basePath}public/dcf_events_public.html" class="footer-link">Events</a>
                        <a href="${basePath}public/dcf_projects_public.html" class="footer-link">Projects</a>
                        <a href="${basePath}public/dcf_resources_public.html" class="footer-link">Resources</a>
                        <a href="${basePath}public/dcf_newsletter.html" class="footer-link">Newsletter</a>
                    </nav>
                </div>

                <!-- Column 3: Newsletter -->
                <div class="footer-newsletter">
                    <h4 class="footer-heading">Stay Informed</h4>
                    <p class="newsletter-description">
                        Get the latest updates on our AI ethics initiatives, research findings, and global events.
                    </p>
                    <div class="newsletter-form">
                        <div class="newsletter-input-wrapper">
                            <input 
                                type="email" 
                                id="footerNewsletterEmail" 
                                placeholder="Enter your email address" 
                                class="newsletter-input" 
                                onkeydown="if(event.key==='Enter') subscribeNewsletter()"
                            >
                            <button onclick="subscribeNewsletter()" class="newsletter-btn">
                                Subscribe
                            </button>
                        </div>
                        <p class="newsletter-privacy">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>

                <!-- Column 4: Contact & Legal -->
                <div class="footer-contact">
                    <h4 class="footer-heading">Get in Touch</h4>
                    <div class="contact-info">
                        <a href="${basePath}public/dcf_contact.html" class="contact-link">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            Contact Us
                        </a>
                        <a href="${basePath}auth/dcf_profile_signup.html" class="contact-link">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Join Our Mission
                        </a>
                        <a href="${basePath}auth/dcf_login_page.html" class="contact-link">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                            </svg>
                            Member Login
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <p class="copyright">
                        © ${new Date().getFullYear()} Domus Communis Foundation Hungary. All rights reserved.
                    </p>
                    <div class="footer-legal">
                        <a href="#" class="legal-link">Privacy Policy</a>
                        <a href="#" class="legal-link">Terms of Service</a>
                        <a href="#" class="legal-link">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <style>
    /* Foundation Footer Styling */
    .site-footer {
        background: linear-gradient(135deg, #f8fafb 0%, #f1f5f9 100%);
        border-top: 1px solid #e2e8f0;
        margin-top: 4rem;
        color: #334155;
    }

    .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    /* Main Footer Grid */
    .footer-main {
        display: grid;
        grid-template-columns: 1fr 200px 280px 200px;
        gap: 3rem;
        padding: 3rem 0;
        border-bottom: 1px solid #e2e8f0;
    }

    /* Brand Section */
    .footer-brand {
        max-width: 300px;
    }

    .footer-logo {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .footer-logo-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border-radius: 8px;
        margin-right: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .footer-logo-text {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
        letter-spacing: -0.025em;
    }

    .footer-mission {
        color: #64748b;
        font-size: 0.875rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-weight: 400;
    }

    .footer-social {
        display: flex;
        gap: 0.75rem;
    }

    .social-link {
        width: 40px;
        height: 40px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .social-link:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: #334155;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Navigation Section */
    .footer-navigation {
    }

    .footer-heading {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 1rem;
        letter-spacing: -0.025em;
    }

    .footer-nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .footer-link {
        color: #64748b;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 400;
        padding: 0.25rem 0;
        transition: color 0.2s ease;
    }

    .footer-link:hover {
        color: #1e293b;
    }

    /* Newsletter Section */
    .footer-newsletter {
    }

    .newsletter-description {
        color: #64748b;
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 1.5rem;
        font-weight: 400;
    }

    .newsletter-form {
        margin-bottom: 1rem;
    }

    .newsletter-input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .newsletter-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 0.875rem;
        outline: none;
        transition: all 0.2s ease;
        background: white;
        color: #374151;
        font-weight: 400;
    }

    .newsletter-input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        transform: translateY(-1px);
    }

    .newsletter-input::placeholder {
        color: #9ca3af;
        font-weight: 400;
    }

    .newsletter-btn {
        width: 100%;
        padding: 0.75rem 1rem;
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;
        transition: all 0.2s ease;
        letter-spacing: 0.025em;
        box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
    }

    .newsletter-btn:hover {
        background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
    }

    .newsletter-btn:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
    }

    .newsletter-btn:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
        color: #9ca3af;
    }

    .newsletter-privacy {
        color: #9ca3af;
        font-size: 0.75rem;
        text-align: center;
        font-weight: 400;
        margin: 0;
    }

    /* Contact Section */
    .footer-contact {
    }

    .contact-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .contact-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #64748b;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 400;
        padding: 0.5rem 0;
        transition: all 0.2s ease;
        border-radius: 6px;
    }

    .contact-link:hover {
        color: #1e293b;
        background: rgba(241, 245, 249, 0.8);
        padding-left: 0.5rem;
    }

    .contact-link svg {
        flex-shrink: 0;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    }

    .contact-link:hover svg {
        opacity: 1;
    }

    /* Footer Bottom */
    .footer-bottom {
        padding: 1.5rem 0;
        background: rgba(248, 250, 252, 0.8);
    }

    .footer-bottom-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .copyright {
        color: #64748b;
        font-size: 0.875rem;
        font-weight: 400;
        margin: 0;
    }

    .footer-legal {
        display: flex;
        gap: 1.5rem;
    }

    .legal-link {
        color: #64748b;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 400;
        transition: color 0.2s ease;
    }

    .legal-link:hover {
        color: #1e293b;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
        .footer-main {
            grid-template-columns: 1fr 200px 250px;
            gap: 2.5rem;
        }
        
        .footer-contact {
            grid-column: 1 / -1;
            margin-top: 1rem;
        }
    }

    @media (max-width: 768px) {
        .footer-container {
            padding: 0 1rem;
        }

        .footer-main {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 0;
            text-align: center;
        }

        .footer-brand {
            max-width: none;
        }

        .footer-logo {
            justify-content: center;
        }

        .footer-social {
            justify-content: center;
        }

        .footer-nav {
            align-items: center;
        }

        .newsletter-input-wrapper {
            flex-direction: column;
        }

        .contact-info {
            align-items: center;
        }

        .contact-link {
            justify-content: center;
            width: fit-content;
        }

        .footer-bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }

        .footer-legal {
            flex-wrap: wrap;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .footer-main {
            padding: 1.5rem 0;
        }

        .footer-social {
            gap: 0.5rem;
        }

        .social-link {
            width: 36px;
            height: 36px;
        }

        .footer-legal {
            gap: 1rem;
        }
    }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// =============================================================================
// 9.1. NEWSLETTER SUBSCRIPTION FUNCTIONALITY
// =============================================================================
async function subscribeNewsletter() {
    const emailInput = document.getElementById('footerNewsletterEmail');
    const subscribeBtn = document.querySelector('.newsletter-btn');
    
    if (!emailInput || !subscribeBtn) {
        console.error('Newsletter elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    
    // Validate email
    if (!email) {
        showAlert('Please enter your email address.', 'warning', 'Email Required');
        emailInput.focus();
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address.', 'warning', 'Invalid Email');
        emailInput.focus();
        return;
    }
    
    // Disable button during submission
    subscribeBtn.disabled = true;
    subscribeBtn.textContent = 'Subscribing...';
    
    try {
        // Check if Supabase is available
        if (!window.dcfSupabase) {
            throw new Error('Database connection not available');
        }
        
        // Check if email already exists
        const { data: existingSubscriber } = await window.dcfSupabase
            .from('newsletter_subscribers')
            .select('email')
            .eq('email', email.toLowerCase())
            .single();
            
        if (existingSubscriber) {
            showAlert('You are already subscribed to our newsletter!', 'info', 'Already Subscribed');
            emailInput.value = '';
            return;
        }
        
        // Insert new subscriber
        const { error } = await window.dcfSupabase
            .from('newsletter_subscribers')
            .insert({
                email: email.toLowerCase(),
                subscribed_at: new Date().toISOString(),
                status: 'active',
                source: 'footer_form'
            });
            
        if (error) {
            // Handle specific Supabase errors
            if (error.code === '42P01') {
                throw new Error('Newsletter service temporarily unavailable');
            }
            throw error;
        }
        
        // Success
        showAlert('Thank you for subscribing! You\'ll receive updates on our latest initiatives and events.', 'success', 'Successfully Subscribed');
        emailInput.value = '';
        
        console.log('✅ Newsletter subscription successful for:', email);
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        
        // User-friendly error messages
        let errorMessage = 'Unable to subscribe at this time. Please try again later.';
        
        if (error.message.includes('not available') || error.message.includes('temporarily unavailable')) {
            errorMessage = 'Newsletter service is temporarily unavailable. Please try again later.';
        } else if (error.message.includes('duplicate') || error.message.includes('already exists')) {
            errorMessage = 'You are already subscribed to our newsletter!';
            emailInput.value = '';
        }
        
        showAlert(errorMessage, 'error', 'Subscription Failed');
        
    } finally {
        // Re-enable button
        subscribeBtn.disabled = false;
        subscribeBtn.textContent = 'Subscribe';
    }
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
        
        // PROTECT MEMBER-ONLY PAGES
        const memberOnlyFolders = ['members/', 'projects/', 'resources/', 'events/', 'admin/'];
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.includes('/auth/');
        const isPublicPage = currentPath.includes('/public/') || currentPath === '/' || currentPath.endsWith('index.html');
        
        // If not logged in AND on a member-only page, redirect to login
        if (!isLoggedIn && !isAuthPage && !isPublicPage) {
            const isMemberOnlyPage = memberOnlyFolders.some(folder => currentPath.includes(folder));
            if (isMemberOnlyPage) {
                console.log('🔒 Redirecting unauthorized user to login');
                window.location.href = getCorrectBasePath() + 'auth/dcf_login_page.html';
                return;
            }
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
// 13. USERNAME VALIDATION
// =============================================================================

async function validateUsername(username) {
    if (!username || username.length < 3 || username.length > 30) {
        return { valid: false, message: 'Username must be 3-30 characters long' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    
    if (!window.dcfSupabase) {
        console.error('Supabase client not initialized');
        return { valid: false, message: 'Unable to validate username' };
    }
    
    try {
        const { data } = await window.dcfSupabase
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
window.validateUsername = validateUsername;
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
window.subscribeNewsletter = subscribeNewsletter;

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
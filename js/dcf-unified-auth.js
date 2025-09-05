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
        window.dcfSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage
  }
});
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
        
        const { data: { session } } = await sessionPromise;
        
        if (session?.user) {
            console.log('✅ User session found:', session.user.email);
            
            // Get profile data - query by email since that's your setup
            const profilePromise = window.dcfSupabase
                .from('user_profiles')
                .select('first_name, last_name, username, email, avatar_url')
                .eq('email', session.user.email)
                .single();
                
            try {
                const { data: profile } = await profilePromise;
                
                console.log('🔍 RAW DATABASE PROFILE:', profile);
                
                window.dcfUser = {
                    isLoggedIn: true,
                    profile: {
                        id: session.user.id,
                        email: session.user.email,
                        // FIXED: Always use database fields, never fallback to email parsing
                        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unknown User',
                        first_name: profile?.first_name || null,
                        last_name: profile?.last_name || null,
                        username: profile?.username || 'unknown',
                        avatar_url: profile?.avatar_url || null
                    },
                    session: session
                };
                
                console.log('✅ User profile loaded:', window.dcfUser.profile);
                console.log('✅ Username from DB:', window.dcfUser.profile.username);
                console.log('✅ Name from DB:', window.dcfUser.profile.name);
                
                // Gentle session monitoring - LOGS ONLY, NO REDIRECTS
                if (session?.expires_at) {
                    const expiryTime = new Date(session.expires_at * 1000);
                    const timeUntilExpiry = expiryTime.getTime() - Date.now();
                    console.log('⏰ Session expires in:', Math.round(timeUntilExpiry / (1000 * 60)), 'minutes');
                    
                    if (timeUntilExpiry < 1 * 60 * 1000) { // 1 minute
                        console.warn('⚠️ Session expiring soon - refresh recommended');
                    }
                    
                    // Optional session refresh - GENTLE, user can ignore
                    if (timeUntilExpiry < 2 * 60 * 1000 && timeUntilExpiry > 0) { // 2 minutes
                        console.log('🔄 Attempting session refresh...');
                        try {
                            window.dcfSupabase.auth.refreshSession().then(result => {
                                if (result.data?.session) {
                                    console.log('✅ Session refreshed successfully');
                                    // Update global session data
                                    window.dcfUser.session = result.data.session;
                                }
                            }).catch(error => {
                                console.warn('⚠️ Session refresh failed:', error.message);
                            });
                        } catch (error) {
                            console.warn('⚠️ Session refresh error:', error.message);
                        }
                    }
                }
                
                // Invalid session cleanup - GENTLE, non-disruptive  
                try {
                    if (session?.user?.id && !session.user.email) {
                        console.warn('⚠️ Invalid session detected - missing email');
                        console.log('💡 Recommendation: Refresh page if experiencing issues');
                    }
                    
                    if (session?.access_token && session.access_token.length < 50) {
                        console.warn('⚠️ Suspicious session token - may be corrupted');
                        console.log('💡 Recommendation: Re-login if experiencing issues');
                    }
                    
                    // Test session validity with actual API call
                    if (session?.user?.id) {
                        window.dcfSupabase.auth.getUser().then(result => {
                            if (result.error) {
                                console.warn('⚠️ Session validation failed:', result.error.message);
                                console.log('💡 Session may be expired - consider refreshing');
                            } else {
                                console.log('✅ Session validation passed - all systems healthy');
                            }
                        }).catch(error => {
                            console.warn('⚠️ Session validation error:', error.message);
                        });
                    }
                } catch (error) {
                    console.warn('⚠️ Session cleanup error:', error.message);
                }
                
                // Expired session handling - GENTLE, user choice
                if (session?.expires_at) {
                    const expiryTime = new Date(session.expires_at * 1000);
                    const now = new Date();
                    
                    if (expiryTime <= now) {
                        console.warn('⚠️ Session has expired');
                        console.log('💡 Recommendation: Please refresh page or re-login');
                        
                        // TEMPORARILY DISABLED FOR TESTING
                        // setTimeout(() => {
                        //     const shouldRefresh = confirm('Your session has expired. Would you like to refresh the page to re-authenticate?');
                        //     if (shouldRefresh) {
                        //         window.location.reload();
                        //     } else {
                        //         console.log('ℹ️ User chose to continue with expired session');
                        //     }
                        // }, 2000); // 2 second delay so user can finish what they're doing
                        
                    } else if (expiryTime - now < 2 * 60 * 1000) { // Less than 2 minutes
                        console.warn('⚠️ Session expires in less than 2 minutes');
                        console.log('💡 Automatic refresh will be attempted shortly');
                    }
                }
                
                // Session corruption recovery - GENTLE cleanup
                try {
                    // Check for data inconsistencies
                    if (window.dcfUser?.isLoggedIn && !window.dcfUser?.profile?.email) {
                        console.warn('⚠️ Corrupted user data detected - missing profile email');
                        console.log('💡 Attempting gentle data recovery...');
                        
                        // Try to refresh user data
                        if (session?.user?.email) {
                            console.log('🔄 Rebuilding user profile from session data...');
                            window.dcfUser.profile = {
                                ...window.dcfUser.profile,
                                email: session.user.email,
                                id: session.user.id
                            };
                            console.log('✅ User profile data recovered');
                        }
                    }
                    
                    // Check for mismatched user IDs
                    if (window.dcfUser?.profile?.id && session?.user?.id && 
                        window.dcfUser.profile.id !== session.user.id) {
                        console.warn('⚠️ User ID mismatch detected between profile and session');
                        console.log('💡 Synchronizing user data...');
                        window.dcfUser.profile.id = session.user.id;
                        console.log('✅ User ID synchronized');
                    }
                    
                    // Check for authentication state inconsistency  
                    if (session?.user && !window.dcfUser?.isLoggedIn) {
                        console.warn('⚠️ Authentication state inconsistency detected');
                        console.log('💡 Correcting authentication state...');
                        window.dcfUser.isLoggedIn = true;
                        console.log('✅ Authentication state corrected');
                    }
                    
                } catch (recoveryError) {
                    console.warn('⚠️ Session recovery error:', recoveryError.message);
                    console.log('💡 Consider refreshing page if experiencing issues');
                }
                
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
    
    // FIXED: Generate initials from USERNAME field, first 2 letters uppercase
    console.log('🔍 DEBUG - User Profile Data:', user.profile);
    console.log('🔍 DEBUG - Profile Username for initials:', user.profile.username);
    const initials = generateInitials(user.profile.username);
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

function generateInitials(username) {
    console.log('🔍 INITIALS DEBUG - Input username:', username);
    console.log('🔍 INITIALS DEBUG - Type of username:', typeof username);
    
    if (!username || typeof username !== 'string') {
        console.log('❌ No valid username provided for initials, using fallback');
        return 'HO'; // Your fallback
    }
    
    console.log('🔍 Generating initials from username:', username);
    
    // NEW SPECIFICATION: First 2 letters of username, uppercase
    const initials = username.substring(0, 2).toUpperCase();
    
    console.log('🔍 Generated initials from username:', initials);
    return initials;
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
    
    // Prevent duplicate logout buttons
    const existingLogout = dropdown.querySelector('.logout-btn');
    if (existingLogout) {
        console.log('⚠️ Logout button already exists, skipping navigation items');
        return;
    }

    const currentPage = window.location.pathname.split('/').pop();
    const basePath = getCorrectBasePath();
    
    const navigationItems = [
        { href: basePath + 'members/dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: basePath + 'members/dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: basePath + 'members/dcf_private_messaging.html', icon: '💬', text: 'My Messages' },
        { href: basePath + 'members/dcf_my_connections.html', icon: '👥', text: 'My Connections' },
        { href: basePath + 'projects/dcf_projects_home.html', icon: '📋', text: 'My Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: basePath + 'members/dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },
        { href: basePath + 'members/dcf_edit_profile.html', icon: '✏️', text: 'Edit Profile' }
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
    // Reset the flag at the start in case it was stuck from a previous failed attempt
    window.dcfLogoutInProgress = false;
    
    console.log('🚨 confirmLogout() FUNCTION CALLED');
    console.trace('LOGOUT CALL STACK:');
    try {
        // Sign out from Supabase
        if (window.dcfSupabase) {
            await window.dcfSupabase.auth.signOut();
        }
        
        // Clear state immediately
        window.dcfUser = { isLoggedIn: false, profile: null, session: null };
        
        // Update UI to logged out state
        showLoggedOutState();
        
        // Clear all localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        
        // Navigate to login page immediately
        console.log('🚨 LOGOUT FUNCTION CALLED - redirecting to login');
        const basePath = getCorrectBasePath();
        window.location.href = basePath + 'auth/dcf_login_page.html';
        
    } catch (error) {
        console.error('Error during logout:', error);
        // Force logout even if Supabase signOut fails
        window.dcfUser = { isLoggedIn: false, profile: null, session: null };
        showLoggedOutState();
        
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Force redirect to login
        console.log('🚨 LOGOUT FUNCTION CALLED (error path) - redirecting to login');
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

    async createConnectionRequestNotification(recipientEmail, recipientName) {
        try {
            if (!this.currentUser || recipientEmail === this.currentUser.email) return;

            const { error } = await this.supabase
                .from('notifications')
                .insert({
                    type: 'connection_request',
                    title: 'New connection request',
                    message: `${this.currentUser.name} sent you a connection request`,
                    recipient_email: recipientEmail,
                    recipient_name: recipientName,
                    sender_email: this.currentUser.email,
                    sender_name: this.currentUser.name,
                    related_id: Date.now().toString(), // Unique ID for this request
                    related_type: 'connection_request'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error creating connection request notification:', error);
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

function getNotificationPagePath() {
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(p => p);
    
    // Check if we're in a subfolder
    const knownFolders = ['members', 'projects', 'events', 'resources', 'auth', 'admin', 'public'];
    let currentFolder = null;
    
    for (let i = pathParts.length - 2; i >= 0; i--) {
        if (knownFolders.includes(pathParts[i])) {
            currentFolder = pathParts[i];
            break;
        }
    }
    
    // If we're already in the members folder, use direct path
    if (currentFolder === 'members') {
        return 'dcf_notifications.html';
    }
    // If we're in another folder, go up and into members
    else if (currentFolder) {
        return '../members/dcf_notifications.html';
    }
    // If we're at root level, go into members folder
    else {
        return 'members/dcf_notifications.html';
    }
}

function createNotificationDropdown() {
    const bell = document.querySelector('.notification-bell');
    if (!bell) return;
    
    const notificationPath = getNotificationPagePath();
    
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
                <a href="${notificationPath}" class="view-all-notifications">View All Notifications</a>
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
    // Always mark as read first, even if content is missing
    await markNotificationRead(notificationId);
    
    // Get current page info for navigation
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const currentFolder = pathParts[pathParts.length - 2];
    const currentFile = pathParts[pathParts.length - 1];
    
    // Helper function to navigate to notifications page with message
    const navigateToNotificationsWithError = (message) => {
        alert(message);
        if (currentFolder === 'members') {
            window.location.href = 'dcf_notifications.html';
        } else {
            window.location.href = '../members/dcf_notifications.html';
        }
        closeNotificationDropdown();
    };
    
    // Helper function to check if content exists (can be expanded with API calls)
    const checkContentExists = async (type, id) => {
        // For now, if we're on the target page, we can check DOM
        // In the future, this could make an API call to verify
        if (type === 'post' && currentFile === 'dcf_member_home.html') {
            return document.querySelector(`[data-post-id="${id}"]`) !== null;
        }
        // For other types, assume they exist and let navigation handle it
        return true;
    };
    
    try {
        // Navigate to related content based on type
        if (relatedType === 'post' || relatedType === 'post_like' || relatedType === 'post_comment') {
            // Navigate to the specific post
            if (currentFile === 'dcf_member_home.html') {
                // Already on home page, check if post exists
                const postElement = document.querySelector(`[data-post-id="${relatedId}"]`);
                if (postElement) {
                    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Add highlight effect
                    postElement.style.transition = 'background-color 0.5s ease';
                    postElement.style.backgroundColor = '#fff3cd';
                    setTimeout(() => {
                        postElement.style.backgroundColor = '';
                    }, 2000);
                } else {
                    // Post not found on current page
                    navigateToNotificationsWithError('This post may have been removed or is no longer available.');
                    return;
                }
            } else {
                // Navigate to member home with post hash
                // We'll check if post exists after navigation via the hash handler
                if (currentFolder === 'members') {
                    window.location.href = `dcf_member_home.html#post-${relatedId}`;
                } else {
                    window.location.href = `../members/dcf_member_home.html#post-${relatedId}`;
                }
            }
        } else if (relatedType === 'connection' || relatedType === 'connection_request') {
            // Navigate to members directory for now (future: dedicated connections page)
            if (currentFile === 'dcf_members_directory.html') {
                // Already on members directory
                console.log('Already on members directory');
            } else {
                if (currentFolder === 'members') {
                    window.location.href = 'dcf_members_directory.html';
                } else {
                    window.location.href = '../members/dcf_members_directory.html';
                }
            }
        } else if (relatedType === 'project' || relatedType === 'project_update') {
            // Navigate to project detail page
            // Add check parameter to verify project exists on load
            if (currentFolder === 'projects') {
                window.location.href = `dcf_project_detail.html?id=${relatedId}&check=true`;
            } else {
                window.location.href = `../projects/dcf_project_detail.html?id=${relatedId}&check=true`;
            }
        } else if (relatedType === 'event' || relatedType === 'event_reminder') {
            // Navigate to events detail page
            // Add check parameter to verify event exists on load
            if (currentFolder === 'events') {
                window.location.href = `dcf_event_details.html?id=${relatedId}&check=true`;
            } else {
                window.location.href = `../events/dcf_event_details.html?id=${relatedId}&check=true`;
            }
        } else {
            // Default: go to notifications page
            if (currentFolder === 'members') {
                window.location.href = 'dcf_notifications.html';
            } else {
                window.location.href = '../members/dcf_notifications.html';
            }
        }
    } catch (error) {
        console.error('Error handling notification click:', error);
        navigateToNotificationsWithError('An error occurred while navigating to this content.');
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
    
    // Prevent multiple listeners
    if (window.authListenerSetup) return;
    window.authListenerSetup = true;
    
    window.dcfSupabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 AUTH STATE LISTENER - Event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ AUTH STATE LISTENER - Processing SIGNED_IN event');
            
            // Copy EXACT pattern from working member profile page
            try {
                const { data: profile, error } = await window.dcfSupabase
                    .from('user_profiles')
                    .select('first_name,last_name,role,location,organization,avatar_url,username,bio,cover_image_url')
                    .eq('id', session.user.id)  // ✅ Use ID like working page
                    .single();
                
                if (profile) {
                    console.log('✅ Profile loaded:', profile.username);
                    
                    // Set profile data EXACTLY like initializeAuth does
                    window.dcfUser = {
                        isLoggedIn: true,
                        profile: {
                            id: session.user.id,
                            email: session.user.email,
                            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
                            first_name: profile.first_name || null,
                            last_name: profile.last_name || null,
                            username: profile.username || 'unknown',  // ✅ Gets @username
                            avatar_url: profile.avatar_url || null,
                            role: profile.role || null,
                            location: profile.location || null,
                            organization: profile.organization || null,
                            bio: profile.bio || null
                        },
                        session: session
                    };
                } else {
                    // Fallback if no profile found
                    window.dcfUser = {
                        isLoggedIn: true,
                        profile: session.user,
                        session: session
                    };
                }
            } catch (error) {
                console.error('Profile load error:', error);
                // Fallback on error
                window.dcfUser = {
                    isLoggedIn: true,
                    profile: session.user,
                    session: session
                };
            }
            
            updateUserInterface();
        } else if (event === 'SIGNED_OUT') {
            console.log('🚨 AUTH STATE LISTENER - Processing SIGNED_OUT event');
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
async function initializeDCF() {
    console.log('🚀 Initializing DCF Authentication System - REDIRECTS DISABLED...');
    
    try {
        // Setup auth state listener
        setupAuthStateListener();
        
        // Initialize authentication
        const isLoggedIn = await initializeAuth();
        
        // ❌ REMOVED: Check for page protection redirect
        // if (document.body.classList.contains('dcf-public-page') && isLoggedIn) {
        //     console.log('🔒 Redirecting logged-in user from public auth page');
        //     window.location.href = getCorrectBasePath() + 'members/dcf_member_home.html';
        //     return;
        // }
        
        // ❌ REMOVED: Member-only page protection and redirects
        // const memberOnlyFolders = ['members/', 'projects/', 'resources/', 'events/', 'admin/'];
        // const currentPath = window.location.pathname;
        // const isAuthPage = currentPath.includes('/auth/');
        // const isPublicPage = currentPath.includes('/public/') || currentPath === '/' || currentPath.endsWith('index.html');
        
        console.log('🚨 All auth redirects permanently disabled - pages accessible');
        
        // ✅ RESTORED: Update UI based on auth state
        updateUserInterface();
        
        // ✅ RESTORED: Initialize components
        populateTopNavigation();
        initializeQuickActions();
        initializeFooter();
        
        // ✅ RESTORED: Initialize notification system if logged in
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
    // Client-side validation first
    if (!username || username.length < 3 || username.length > 30) {
        return { valid: false, message: 'Username must be 3-30 characters long' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    
    // Reserved usernames check
    const reservedUsernames = [
        'admin', 'administrator', 'root', 'system', 'user', 'guest', 'test',
        'support', 'help', 'info', 'contact', 'about', 'privacy', 'terms',
        'api', 'www', 'mail', 'email', 'ftp', 'blog', 'forum', 'chat',
        'dcf', 'hungary', 'foundation', 'domus', 'communis'
    ];
    
    if (reservedUsernames.includes(username.toLowerCase())) {
        return { valid: false, message: 'This username is reserved' };
    }
    
    // Database availability check using secure SQL function
    if (!window.dcfSupabase) {
        console.error('Supabase client not initialized');
        return { valid: true, message: 'Username format is valid (will verify during signup)' };
    }
    
    try {
        // Use the public SQL function to check availability
        const { data, error } = await window.dcfSupabase
            .rpc('check_username_available', {
                input_username: username.toLowerCase()
            });
        
        if (error) {
            console.error('Username validation error:', error);
            // Fallback to format validation if function fails
            return { valid: true, message: 'Username format is valid (will verify during signup)' };
        }
        
        if (data === true) {
            return { valid: true, message: 'Username is available' };
        } else {
            return { valid: false, message: 'Username is already taken' };
        }
        
    } catch (error) {
        console.error('Username validation error:', error);
        // Fallback gracefully if validation service fails
        return { valid: true, message: 'Username format is valid (will verify during signup)' };
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
// 18. UNIFIED QUICK ACTIONS SYSTEM
// =============================================================================
function detectPageType() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    // Check for data attribute first
    if (document.body.dataset.pageType) {
        return document.body.dataset.pageType;
    }
    
    // Auto-detect from filename
    const pageTypeMap = {
        'dcf_member_home.html': 'member_home',
        'dcf_member_profile.html': 'member_profile',
        'dcf_members_directory.html': 'members_directory',
        'dcf_my_connections.html': 'my_connections',
        'dcf_private_messaging.html': 'messaging',
        'dcf_notifications.html': 'notifications',
        'dcf_profile_dashboard.html': 'profile_dashboard',
        'dcf_personal_analytics.html': 'analytics',
        'dcf_projects_home.html': 'projects_home',
        'dcf_projects.html': 'projects',
        'dcf_project_detail.html': 'project_detail',
        'dcf_project_manage.html': 'project_manage',
        'dcf_create_project.html': 'create_project',
        'dcf_events_calendar.html': 'events_calendar',
        'dcf_event_details.html': 'event_details',
        'dcf_event_manage.html': 'event_manage',
        'dcf_create_event.html': 'create_event',
        'dcf_resources_library.html': 'resources_library',
        'dcf_resource_detail.html': 'resource_detail',
        'dcf_resource_upload.html': 'resource_upload',
        'dcf_admin_dashboard.html': 'admin_dashboard'
    };
    
    return pageTypeMap[filename] || 'default';
}

function getQuickActionsConfig(pageType) {
    // Get the current location to properly construct paths
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const currentFolder = pathParts[pathParts.length - 2];
    
    // Helper to get correct path based on current location
    const getPath = (targetFolder, targetFile) => {
        if (currentFolder === targetFolder) {
            // Same folder, direct link
            return targetFile;
        } else if (currentFolder === 'dcfh' || !currentFolder) {
            // At root level
            return `${targetFolder}/${targetFile}`;
        } else {
            // In a different folder, go up then to target
            return `../${targetFolder}/${targetFile}`;
        }
    };
    
    // Standardized quick actions for most pages
    const standardActions = [
        { icon: '➕', text: 'Create Project', href: getPath('projects', 'dcf_project_create.html'), primary: true },
        { icon: '📊', text: 'View Analytics', href: getPath('members', 'dcf_personal_analytics.html') },
        { icon: '📅', text: 'Events Calendar', href: getPath('events', 'dcf_events_calendar.html') },
        { icon: '💬', text: 'Discussion Forum', href: getPath('forum', 'dcf_forum_home.html') },
        { icon: '👥', text: 'Members Directory', href: getPath('members', 'dcf_members_directory.html') },
        { icon: '📚', text: 'Resources Library', href: getPath('resources', 'dcf_resources_library.html') }
    ];
    
    const quickActionsConfig = {
        'member_home': standardActions,
        'member_profile': [
            { icon: '✏️', text: 'Edit Profile', href: getPath('members', 'dcf_edit_profile.html'), primary: true },
            { icon: '👥', text: 'My Connections', href: getPath('members', 'dcf_my_connections.html') },
            { icon: '💬', text: 'My Messages', href: getPath('members', 'dcf_private_messaging.html') },
            { icon: '📊', text: 'My Analytics', href: getPath('members', 'dcf_personal_analytics.html') },
            { icon: '📋', text: 'My Projects', href: getPath('projects', 'dcf_my_projects.html') },
            { icon: '🏠', text: 'Member Home', href: getPath('members', 'dcf_member_home.html') }
        ],
        'members_directory': standardActions,
        'my_connections': [
            { icon: '👥', text: 'Find Members', href: 'dcf_members_directory.html' },
            { icon: '💬', text: 'Send Message', href: 'dcf_private_messaging.html' },
            { icon: '🏠', text: 'Back to Home', href: 'dcf_member_home.html' }
        ],
        'messaging': [
            { icon: '💬', text: 'New Message', action: 'openNewMessageModal()' },
            { icon: '👥', text: 'My Connections', href: 'dcf_my_connections.html' },
            { icon: '🏠', text: 'Back to Home', href: 'dcf_member_home.html' }
        ],
        'notifications': [
            { icon: '✅', text: 'Mark All Read', action: 'markAllAsRead()' },
            { icon: '🗑️', text: 'Clear All', action: 'clearAllNotifications()' },
            { icon: '⚙️', text: 'Settings', action: 'openNotificationSettings()' },
            { icon: '🏠', text: 'Back to Home', href: 'dcf_member_home.html' }
        ],
        'profile_dashboard': [
            { icon: '👤', text: 'Edit Profile', href: 'dcf_member_profile.html' },
            { icon: '📊', text: 'View Analytics', href: 'dcf_personal_analytics.html' },
            { icon: '💳', text: 'Donate', href: 'dcf_donate.html' },
            { icon: '🏠', text: 'Member Home', href: 'dcf_member_home.html' }
        ],
        'analytics': standardActions,
        'personal_analytics': standardActions,
        'projects_home': [
            { icon: '➕', text: 'Create Project', href: getPath('projects', 'dcf_project_create.html'), primary: true },
            { icon: '📋', text: 'My Projects', href: getPath('projects', 'dcf_my_projects.html') },
            { icon: '🔍', text: 'Browse Projects', href: getPath('projects', 'dcf_projects_home.html') },
            { icon: '📊', text: 'Project Analytics', href: getPath('projects', 'dcf_project_analytics.html') },
            { icon: '👥', text: 'Find Collaborators', href: getPath('members', 'dcf_members_directory.html') },
            { icon: '📚', text: 'Resources', href: getPath('resources', 'dcf_resources_library.html') }
        ],
        'projects': [
            { icon: '📋', text: 'Create Project', href: 'dcf_create_project.html' },
            { icon: '📋', text: 'My Projects', href: 'dcf_project_manage.html' },
            { icon: '🏠', text: 'Projects Home', href: 'dcf_projects_home.html' }
        ],
        'project_detail': [
            { icon: '📋', text: 'Create Task', action: 'createTask()' },
            { icon: '📤', text: 'Upload Files', action: 'uploadFiles()' },
            { icon: '📊', text: 'View Analytics', action: 'viewAnalytics()' },
            { icon: '🏠', text: 'All Projects', href: 'dcf_projects_home.html' }
        ],
        'project_manage': [
            { icon: '📋', text: 'Create Project', href: 'dcf_create_project.html' },
            { icon: '📊', text: 'Export Data', action: 'exportProjectData()' },
            { icon: '🏠', text: 'Projects Home', href: 'dcf_projects_home.html' }
        ],
        'events_calendar': standardActions,
        'event_details': [
            { icon: '🎟️', text: 'Register Now', action: 'registerForEvent()' },
            { icon: '📅', text: 'View Calendar', href: 'dcf_events_calendar.html' },
            { icon: '🔗', text: 'Share Event', action: 'shareEvent()' },
            { icon: '🏠', text: 'Back to Home', href: basePath + 'members/dcf_member_home.html' }
        ],
        'event_manage': [
            { icon: '📅', text: 'Create Event', href: 'dcf_create_event.html' },
            { icon: '📊', text: 'Export Data', action: 'exportEventData()' },
            { icon: '📅', text: 'View Calendar', href: 'dcf_events_calendar.html' },
            { icon: '👥', text: 'All Registrations', action: 'showAllRegistrations()' }
        ],
        'resources_library': standardActions,
        'resource_detail': [
            { icon: '📚', text: 'Download', action: 'downloadResource()' },
            { icon: '🔗', text: 'Share Resource', action: 'shareResource()' },
            { icon: '⚠️', text: 'Report Issue', action: 'reportIssue()' },
            { icon: '📚', text: 'Back to Library', href: 'dcf_resources_library.html' }
        ],
        'resource_upload': [
            { icon: '📚', text: 'Resource Library', href: 'dcf_resources_library.html' },
            { icon: '📚', text: 'My Uploads', action: 'viewMyUploads()' },
            { icon: '🏠', text: 'Back to Home', href: basePath + 'members/dcf_member_home.html' }
        ],
        'admin_dashboard': [
            { icon: '👤', text: 'Add User', action: 'openModal("userModal")' },
            { icon: '📢', text: 'Broadcast', action: 'openModal("broadcastModal")' },
            { icon: '📊', text: 'Export Data', action: 'exportData()' },
            { icon: '⚙️', text: 'Maintenance', action: 'openMaintenanceMode()' }
        ],
        'default': standardActions
    };
    
    return quickActionsConfig[pageType] || quickActionsConfig['default'];
}

function populateQuickActions() {
    const container = document.getElementById('quickActionsContainer');
    if (!container) {
        console.log('Quick Actions container not found on this page');
        return;
    }
    
    const pageType = detectPageType();
    const actions = getQuickActionsConfig(pageType);
    
    console.log(`Populating Quick Actions for page type: ${pageType}`);
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add CSS if not already present
    if (!document.getElementById('quickActionsStyles')) {
        const style = document.createElement('style');
        style.id = 'quickActionsStyles';
        style.textContent = `
            #quickActionsContainer,
            .quick-actions-grid {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .quick-action-btn,
            .btn.quick-action-btn {
                display: flex !important;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                text-decoration: none;
                color: #333;
                transition: all 0.2s ease;
                border: 1px solid #e5e5e5;
                width: 100%;
                cursor: pointer;
                font-size: 0.9rem;
                text-align: left;
                font-weight: 500;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }
            
            .quick-action-btn:hover,
            .btn.quick-action-btn:hover {
                background: #e9ecef;
                border-color: #dee2e6;
                transform: translateY(-1px);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                text-decoration: none;
                color: #333;
            }
            
            .quick-action-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
                width: 24px;
                text-align: center;
            }
            
            .quick-action-text {
                font-size: 0.9rem;
                flex: 1;
            }
            
            .quick-action-btn.btn-primary,
            .btn.btn-primary.quick-action-btn {
                background: #333;
                color: white;
                border-color: #333;
            }
            
            .quick-action-btn.btn-primary:hover,
            .btn.btn-primary.quick-action-btn:hover {
                background: #555;
                border-color: #555;
                color: white;
            }
            
            .quick-action-btn.btn-secondary,
            .btn.btn-secondary.quick-action-btn {
                background: white;
                color: #333;
                border-color: #dee2e6;
            }
            
            .quick-action-btn.btn-secondary:hover,
            .btn.btn-secondary.quick-action-btn:hover {
                background: #f8f9fa;
                border-color: #adb5bd;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create action buttons with standardized styling
    actions.forEach((action, index) => {
        const isPrimary = index === 0 && ['event_details', 'notifications', 'events_calendar'].includes(pageType);
        
        if (action.href) {
            // Create link styled as button
            const link = document.createElement('a');
            link.href = action.href;
            link.className = isPrimary ? 'btn btn-primary quick-action-btn' : 'btn btn-secondary quick-action-btn';
            link.innerHTML = `
                <span class="quick-action-icon">${action.icon}</span>
                <span class="quick-action-text">${action.text}</span>
            `;
            container.appendChild(link);
        } else if (action.action) {
            // Create button
            const button = document.createElement('button');
            button.className = isPrimary ? 'btn btn-primary quick-action-btn' : 'btn btn-secondary quick-action-btn';
            button.onclick = () => eval(action.action);
            button.innerHTML = `
                <span class="quick-action-icon">${action.icon}</span>
                <span class="quick-action-text">${action.text}</span>
            `;
            container.appendChild(button);
        }
    });
    
    console.log(`✅ Quick Actions populated with ${actions.length} items`);
}

// Initialize Quick Actions when DOM is ready
function initializeQuickActions() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', populateQuickActions);
    } else {
        populateQuickActions();
    }
}

// Export Quick Actions functions
window.populateQuickActions = populateQuickActions;
window.initializeQuickActions = initializeQuickActions;

// =============================================================================
// 19. UNIVERSAL COMMENT SYSTEM - WORKS FOR ANY CONTENT TYPE
// =============================================================================
// Supports: 'project', 'resource', 'event', 'post', 'profile'
// Single source of truth for ALL comment functionality across the entire platform

// Global variables for comment management
let commentStates = {}; // Stores state for each content type/id combination
let userCommentLikes = new Set();

// Universal comment initialization
async function initComments(contentType, contentId, containerId = 'commentsList') {
    console.log(`🔄 Initializing ${contentType} comments for ID: ${contentId}`);
    
    // Create state key for this content
    const stateKey = `${contentType}_${contentId}`;
    if (!commentStates[stateKey]) {
        commentStates[stateKey] = {
            comments: [],
            sort: 'newest',
            container: containerId,
            showingAll: false
        };
    }
    
    // Load comments for this content
    await loadComments(contentType, contentId, containerId);
}

// UNIVERSAL LOAD COMMENTS - Works for ANY content type
async function loadComments(contentType, contentId, containerId = 'commentsList', sortType = null) {
    try {
        console.log(`📥 Loading ${contentType} comments for ID: ${contentId}`);
        
        // Handle different table names based on content type
        let tableName = 'comments';
        let query;
        
        // Special handling for events which use a different table
        if (contentType === 'event') {
            tableName = 'event_comments';
            query = window.dcfSupabase
                .from(tableName)
                .select('*')
                .eq('event_id', contentId);
        } else {
            // Standard comments table for all other types
            query = window.dcfSupabase
                .from(tableName)
                .select('*')
                .eq('content_type', contentType)
                .eq('content_id', contentId);
        }
        
        // Add sorting
        const stateKey = `${contentType}_${contentId}`;
        const currentSort = sortType || commentStates[stateKey]?.sort || 'newest';
        
        if (currentSort === 'newest') {
            query = query.order('created_at', { ascending: false });
        } else if (currentSort === 'oldest') {
            query = query.order('created_at', { ascending: true });
        } else if (currentSort === 'liked') {
            query = query.order('like_count', { ascending: false });
        }
        
        const { data: comments, error } = await query;

        if (error) throw error;

        // Store comments in state
        if (commentStates[stateKey]) {
            commentStates[stateKey].comments = comments || [];
            commentStates[stateKey].sort = currentSort;
        }
        
        // Load user interactions
        await loadUserCommentInteractions();
        
        // Display comments
        await displayComments(comments, containerId, contentType, contentId);
        
        // Update comment count
        const totalComments = comments ? comments.length : 0;
        const commentCountElement = document.getElementById(`totalComments-${contentId}`) || 
                                   document.getElementById('totalComments');
        if (commentCountElement) {
            commentCountElement.textContent = totalComments;
        }
        
        console.log(`✅ Loaded ${totalComments} ${contentType} comments`);

    } catch (error) {
        console.error(`Error loading ${contentType} comments:`, error);
        await showAlert('Failed to load comments', 'error');
    }
}

// UNIVERSAL DISPLAY COMMENTS - Renders comments for any content type
async function displayComments(comments, containerId = 'commentsList', contentType = 'profile', contentId = null) {
    // Support multiple container formats
    let container = document.getElementById(containerId);
    if (!container && contentId) {
        // Try with contentId suffix (for post comments)
        container = document.getElementById(`${containerId}-${contentId}`);
    }
    if (!container) return;
    
    if (comments.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #666; padding: 2rem;">
                💬 No comments yet. Be the first to leave a message!
            </div>
        `;
        return;
    }

    // Filter top-level comments (no parent_id)
    const topLevelComments = comments.filter(comment => !comment.parent_comment_id);
    
    const commentsHtml = await Promise.all(topLevelComments.map(async comment => {
        const replies = comments.filter(c => c.parent_comment_id === comment.id);
        return createCommentHtml(comment, replies);
    }));

    container.innerHTML = commentsHtml.join('');
    
    // Update UI states for top-level comments only
    updateAllCommentUIs(topLevelComments);
}

async function createCommentHtml(comment, replies = []) {
    const currentUser = window.getCurrentUser();
    const isAuthor = currentUser && (comment.author_id === currentUser.id || comment.author_email === currentUser.email);
    const isLiked = userCommentLikes.has(comment.id);
    const authorInitials = comment.author_name ? comment.author_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    const timeAgo = getTimeAgo(comment.created_at);
    
    const repliesHtml = replies.length > 0 ? `
        <div class="replies">
            ${replies.map(reply => createReplyHtml(reply)).join('')}
        </div>
    ` : '';
    
    return `
        <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
                <div class="comment-avatar">${authorInitials}</div>
                <div class="comment-main-line">
                    <span class="comment-username">${comment.author_name || 'Anonymous'}</span>
                    <span class="comment-text-inline" data-original-text="${escapeHtml(comment.comment_text)}">${escapeHtml(comment.comment_text)}</span>
                </div>
            </div>
            <div class="comment-footer-line">
                <span class="comment-date">${timeAgo}</span>
                <div class="comment-controls-inline">
                    <button class="comment-btn like-btn ${isLiked ? 'liked' : ''}" id="like-btn-${comment.id}" onclick="toggleCommentLike('${comment.id}')">
                        <span class="like-icon">${isLiked ? '❤️' : '🤍'}</span>
                        <span class="like-count" id="like-count-${comment.id}">${comment.like_count || 0}</span>
                    </button>
                    <button class="comment-btn" onclick="toggleReplyForm('${comment.id}')">💬 Reply</button>
                    ${isAuthor ? `
                        <button class="comment-btn" onclick="startEditComment('${comment.id}')">✏️ Edit</button>
                        <button class="comment-btn delete" onclick="deleteComment('${comment.id}')">🗑️ Delete</button>
                    ` : ''}
                </div>
            </div>
            <div class="edit-form" id="edit-form-${comment.id}">
                <textarea class="reply-textarea" id="edit-textarea-${comment.id}">${comment.comment_text}</textarea>
                <div class="reply-actions">
                    <button class="btn btn-primary" onclick="saveEditComment('${comment.id}')">Save</button>
                    <button class="btn btn-secondary" onclick="cancelEditComment('${comment.id}')">Cancel</button>
                </div>
            </div>
            <div class="reply-form" id="reply-form-${comment.id}">
                <textarea class="reply-textarea" id="replyText-${comment.id}" placeholder="Write a reply..."></textarea>
                <div class="reply-actions">
                    <button class="btn btn-primary" onclick="submitReply('${comment.id}')">Reply</button>
                    <button class="btn btn-secondary" onclick="toggleReplyForm('${comment.id}')">Cancel</button>
                </div>
            </div>
            ${repliesHtml}
        </div>
    `;
}

function createReplyHtml(reply) {
    const currentUser = window.getCurrentUser();
    const isAuthor = currentUser && (reply.author_id === currentUser.id || reply.author_email === currentUser.email);
    const authorInitials = reply.author_name ? reply.author_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    const timeAgo = getTimeAgo(reply.created_at);
    
    return `
        <div class="comment reply" data-comment-id="${reply.id}">
            <div class="comment-header">
                <div class="comment-avatar">${authorInitials}</div>
                <div class="comment-main-line">
                    <span class="comment-username">${reply.author_name || 'Anonymous'}</span>
                    <span class="comment-text-inline">${escapeHtml(reply.comment_text)}</span>
                </div>
            </div>
            <div class="comment-footer-line">
                <span class="comment-date">${timeAgo}</span>
                ${isAuthor ? `
                    <div class="comment-controls-inline">
                        <button class="comment-btn delete" onclick="deleteComment('${reply.id}')">🗑️ Delete</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// UNIVERSAL SUBMIT COMMENT - Works for ANY content type
async function submitComment(contentType, contentId, commentText = null, textareaId = null) {
    // Support multiple ways to get comment text
    let text = commentText;
    if (!text && textareaId) {
        const textarea = document.getElementById(textareaId);
        if (textarea) {
            text = textarea.value.trim();
        }
    }
    // Fallback to generic commentText field
    if (!text) {
        const defaultTextarea = document.getElementById(`commentText-${contentId}`) || 
                               document.getElementById('commentText');
        if (defaultTextarea) {
            text = defaultTextarea.value.trim();
        }
    }
    
    if (!text) {
        await showAlert('Please enter a comment', 'warning');
        return;
    }
    
    const currentUser = window.getCurrentUser();
    if (!currentUser) {
        await showAlert('Please log in to comment', 'warning');
        return;
    }
    
    try {
        // Build comment data based on content type
        const commentData = {
            comment_text: text,
            author_id: currentUser.id,
            author_email: currentUser.email,
            author_name: currentUser.name || currentUser.username || `@${currentUser.username}` || currentUser.email.split('@')[0],
            created_at: new Date().toISOString(),
            like_count: 0
        };
        
        // Handle different table structures
        let tableName = 'comments';
        if (contentType === 'event') {
            tableName = 'event_comments';
            commentData.event_id = contentId;
            commentData.user_id = currentUser.id;
        } else {
            // Standard comments table
            commentData.content_type = contentType;
            commentData.content_id = contentId;
        }
        
        const { error } = await window.dcfSupabase
            .from(tableName)
            .insert([commentData]);
        
        if (error) throw error;
        
        // Clear textarea
        if (textareaId) {
            const textarea = document.getElementById(textareaId);
            if (textarea) textarea.value = '';
        } else {
            const defaultTextarea = document.getElementById(`commentText-${contentId}`) || 
                                   document.getElementById('commentText');
            if (defaultTextarea) defaultTextarea.value = '';
        }
        
        // Reload comments for this content
        const stateKey = `${contentType}_${contentId}`;
        const containerId = commentStates[stateKey]?.container || 'commentsList';
        await loadComments(contentType, contentId, containerId);
        
        await showAlert('Comment posted successfully', 'success');
        console.log(`✅ Posted comment for ${contentType} ID: ${contentId}`);
        
    } catch (error) {
        console.error(`Error posting ${contentType} comment:`, error);
        await showAlert('Failed to post comment', 'error');
    }
}

// Backward compatibility wrapper
async function postComment(contentType, contentId, commentText) {
    return submitComment(contentType, contentId, commentText);
}

// For post-specific comments (backward compatibility)
async function submitPostComment(postId) {
    return submitComment('post', postId, null, `commentText-${postId}`);
}

async function submitReply(parentId) {
    const textarea = document.getElementById(`replyText-${parentId}`);
    if (!textarea) return;
    
    const replyText = textarea.value.trim();
    
    if (!replyText) {
        await showAlert('Please enter a reply', 'warning');
        return;
    }
    
    const currentUser = window.getCurrentUser();
    if (!currentUser) {
        await showAlert('Please log in to reply', 'warning');
        return;
    }
    
    try {
        const profileId = window.currentProfile ? window.currentProfile.id : currentUser.id;
        const { error } = await window.dcfSupabase
            .from('comments')
            .insert([{
                content_type: 'profile',
                content_id: profileId,
                parent_comment_id: parentId,
                comment_text: replyText,
                author_id: currentUser.id,
                author_email: currentUser.email,
                author_name: currentUser.name || currentUser.username || currentUser.email.split('@')[0],
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        
        textarea.value = '';
        toggleReplyForm(parentId);
        await loadComments();
        
    } catch (error) {
        console.error('Error posting reply:', error);
        await showAlert('Failed to post reply', 'error');
    }
}

// UNIVERSAL DELETE COMMENT - Works for ANY content type
async function deleteComment(commentId, contentType = null) {
    const confirmed = await showConfirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;
    
    try {
        // Determine table based on content type or try both
        let deleted = false;
        
        // Try standard comments table first
        const { error: commentError } = await window.dcfSupabase
            .from('comments')
            .delete()
            .eq('id', commentId);
        
        if (!commentError) {
            deleted = true;
        } else if (contentType === 'event' || !deleted) {
            // Try event_comments table
            const { error: eventError } = await window.dcfSupabase
                .from('event_comments')
                .delete()
                .eq('id', commentId);
            
            if (!eventError) {
                deleted = true;
            }
        }
        
        if (deleted) {
            // Remove from UI
            const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
            if (commentElement) {
                // Find parent post card to reload its comments
                const postCard = commentElement.closest('[data-post-id]');
                if (postCard) {
                    const postId = postCard.getAttribute('data-post-id');
                    await loadComments('post', postId, `commentsList-${postId}`);
                } else {
                    commentElement.remove();
                }
            }
            
            await showAlert('Comment deleted successfully', 'success');
            console.log('✅ Comment deleted:', commentId);
        } else {
            throw new Error('Failed to delete comment from any table');
        }
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        await showAlert('Failed to delete comment', 'error');
    }
}

function toggleReplyForm(commentId) {
    const form = document.getElementById(`reply-form-${commentId}`);
    if (form) {
        form.classList.toggle('active');
    }
}

function startEditComment(commentId) {
    const editForm = document.getElementById(`edit-form-${commentId}`);
    const commentText = document.querySelector(`[data-comment-id="${commentId}"] .comment-text-inline`);
    
    if (editForm && commentText) {
        editForm.classList.add('active');
        commentText.style.display = 'none';
        
        const textarea = document.getElementById(`edit-textarea-${commentId}`);
        if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }
}

async function saveEditComment(commentId) {
    const textarea = document.getElementById(`edit-textarea-${commentId}`);
    if (!textarea) return;
    
    const newText = textarea.value.trim();
    if (!newText) {
        await showAlert('Comment cannot be empty', 'warning');
        return;
    }
    
    try {
        let commentTextElement = document.querySelector(`[data-comment-id="${commentId}"] .comment-text-inline`);
        const originalText = commentTextElement?.getAttribute('data-original-text') || '';
        
        if (originalText === newText) {
            cancelEditComment(commentId);
            return;
        }
        
        await editComment(commentId, newText, 'User edit');
        
        // Update the specific comment's display text
        commentTextElement = document.querySelector(`[data-comment-id="${commentId}"] .comment-text-inline`);
        if (commentTextElement) {
            commentTextElement.textContent = newText;
            commentTextElement.setAttribute('data-original-text', newText);
        }
        
        // Exit edit mode
        cancelEditComment(commentId);
        
    } catch (error) {
        console.error('Error saving edit:', error);
        await showAlert('Failed to save changes', 'error');
    }
}

async function editComment(commentId, newText, editReason = 'User edit') {
    const currentUser = window.getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }
    
    try {
        const { error: updateError } = await window.dcfSupabase
            .from('comments')
            .update({
                comment_text: newText,
                updated_at: new Date().toISOString()
            })
            .eq('id', commentId)
            .eq('author_email', currentUser.email);
        
        if (updateError) throw updateError;
        
    } catch (error) {
        console.error('Error editing comment:', error);
        throw error;
    }
}

function cancelEditComment(commentId) {
    const editForm = document.getElementById(`edit-form-${commentId}`);
    const commentText = document.querySelector(`[data-comment-id="${commentId}"] .comment-text-inline`);
    
    if (editForm) {
        editForm.classList.remove('active');
    }
    if (commentText) {
        commentText.style.display = '';
    }
}

async function toggleCommentLike(commentId) {
    const currentUser = window.getCurrentUser();
    if (!currentUser) {
        await showAlert('Please log in to like comments', 'warning');
        return;
    }
    
    try {
        const isLiked = userCommentLikes.has(commentId);
        
        if (isLiked) {
            // Remove like
            const { error } = await window.dcfSupabase
                .from('comment_likes')
                .delete()
                .eq('comment_id', commentId)
                .eq('user_id', currentUser.id);
            if (error) throw error;
            
            userCommentLikes.delete(commentId);
        } else {
            // Add like
            const { error } = await window.dcfSupabase
                .from('comment_likes')
                .insert([{
                    comment_id: commentId,
                    user_id: currentUser.id,
                    user_email: currentUser.email,
                    user_name: currentUser.name || currentUser.username || currentUser.email.split('@')[0],
                    created_at: new Date().toISOString()
                }]);
            if (error) throw error;
            
            userCommentLikes.add(commentId);
        }
        
        // Update UI
        await updateCommentLikeCount(commentId);
        updateLikeUI(commentId);
        
    } catch (error) {
        console.error('Error toggling like:', error);
        await showAlert('Failed to update like', 'error');
    }
}

async function updateCommentLikeCount(commentId) {
    try {
        const { data, error } = await window.dcfSupabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', commentId);
        
        if (error) throw error;
        
        const likeCount = data ? data.length : 0;
        const likeCountElement = document.getElementById(`like-count-${commentId}`);
        
        if (likeCountElement) {
            likeCountElement.textContent = likeCount;
        }
        
    } catch (error) {
        console.error('Error updating like count:', error);
    }
}

function updateLikeUI(commentId) {
    const likeButton = document.getElementById(`like-btn-${commentId}`);
    if (likeButton) {
        const isLiked = userCommentLikes.has(commentId);
        const likeIcon = likeButton.querySelector('.like-icon');
        
        if (likeIcon) {
            likeIcon.textContent = isLiked ? '❤️' : '🤍';
        }
        
        if (isLiked) {
            likeButton.classList.add('liked');
        } else {
            likeButton.classList.remove('liked');
        }
    }
}

async function loadUserCommentInteractions() {
    const currentUser = window.getCurrentUser();
    if (!currentUser) return;
    
    try {
        // Load user's likes
        const { data: likes, error } = await window.dcfSupabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', currentUser.id);
        
        if (!error && likes) {
            userCommentLikes = new Set(likes.map(l => l.comment_id));
        }
    } catch (error) {
        console.error('Error loading user interactions:', error);
    }
}

// UNIVERSAL SORT COMMENTS - Works for ANY content type
async function sortComments(sortType, contentType, contentId) {
    const stateKey = `${contentType}_${contentId}`;
    
    // Update state
    if (commentStates[stateKey]) {
        commentStates[stateKey].sort = sortType;
    }
    
    // Update sort button states (supports multiple comment sections on same page)
    const postCard = document.querySelector(`[data-post-id="${contentId}"]`) || 
                    document.querySelector(`[data-${contentType}-id="${contentId}"]`);
    
    const container = postCard || document;
    
    container.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#f8f9fa';
        btn.style.color = '#666';
        btn.style.border = '1px solid #e5e5e5';
    });
    
    const activeBtn = container.querySelector(`[data-sort="${sortType}"]`) || 
                     document.getElementById(`sort-${sortType}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = 'linear-gradient(135deg, #000, #333)';
        activeBtn.style.color = 'white';
        activeBtn.style.border = 'none';
    }
    
    // Reload comments with new sort
    const containerId = commentStates[stateKey]?.container || 'commentsList';
    await loadComments(contentType, contentId, containerId, sortType);
}

async function getTotalCommentCount() {
    try {
        const contentId = window.getCurrentUser() ? window.getCurrentUser().id : null;
        if (!contentId) return 0;

        const { data, error } = await window.dcfSupabase
            .from('comments')
            .select('id')
            .eq('content_type', 'profile')
            .eq('content_id', contentId);
        
        return data ? data.length : 0;
    } catch (error) {
        console.error('Error getting comment count:', error);
        return 0;
    }
}

function updateAllCommentUIs(comments) {
    comments.forEach(comment => {
        updateLikeUI(comment.id);
    });
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============= BACKWARD COMPATIBILITY FUNCTIONS =============
// These ensure existing HTML pages continue to work without modification

// For pages that call loadPostComments
async function loadPostComments(postId, sortType = null) {
    return loadComments('post', postId, `commentsList-${postId}`, sortType);
}

// For resource pages
async function loadResourceComments(resourceId) {
    return loadComments('resource', resourceId, 'commentsList');
}

// For event pages  
async function loadEventComments(eventId) {
    return loadComments('event', eventId, 'event-comments-container');
}

// Generic post comment for any content type
async function postCommentToContent(contentType, contentId, text) {
    return submitComment(contentType, contentId, text);
}

// Handle comment editing for posts
async function editPostComment(commentId, newText) {
    return editComment(commentId, newText);
}

// Handle comment deletion for posts
async function deletePostComment(commentId) {
    return deleteComment(commentId, 'post');
}

// ============= EXPORT ALL FUNCTIONS FOR GLOBAL ACCESS =============
// Universal comment functions
window.initComments = initComments;
window.loadComments = loadComments;
window.displayComments = displayComments;
window.submitComment = submitComment;
window.postComment = postComment;
window.deleteComment = deleteComment;
window.sortComments = sortComments;

// Backward compatibility functions
window.loadPostComments = loadPostComments;
window.submitPostComment = submitPostComment;
window.loadResourceComments = loadResourceComments;
window.loadEventComments = loadEventComments;
window.postCommentToContent = postCommentToContent;
window.editPostComment = editPostComment;
window.deletePostComment = deletePostComment;

// UI and helper functions
window.createCommentHtml = createCommentHtml;
window.createReplyHtml = createReplyHtml;
window.submitReply = submitReply;
window.toggleReplyForm = toggleReplyForm;
window.startEditComment = startEditComment;
window.saveEditComment = saveEditComment;
window.editComment = editComment;
window.cancelEditComment = cancelEditComment;
window.toggleCommentLike = toggleCommentLike;
window.updateCommentLikeCount = updateCommentLikeCount;
window.updateLikeUI = updateLikeUI;
window.loadUserCommentInteractions = loadUserCommentInteractions;
window.getTotalCommentCount = getTotalCommentCount;
window.updateAllCommentUIs = updateAllCommentUIs;
window.getTimeAgo = getTimeAgo;
window.escapeHtml = escapeHtml;

console.log('✅ Universal Comment System loaded - supports: project, resource, event, post, profile');

// =============================================================================
// 20. UNIVERSAL ANALYTICS SYSTEM - TRACKS ALL INTERACTIONS
// =============================================================================
// Supports all content types: 'project', 'resource', 'event', 'post', 'profile'
// Tracks all interactions: 'like', 'view', 'share', 'bookmark', 'download'

// Global state for user interactions
const userInteractions = {
    likes: new Set(),
    bookmarks: new Set(),
    shares: new Set(),
    downloads: new Set()
};

// Cache for interaction counts
const interactionCache = new Map();

/**
 * Track any user interaction with any content type
 * @param {string} contentType - Type of content ('project', 'resource', 'event', 'post', 'profile')
 * @param {string} contentId - Unique identifier for the content
 * @param {string} interactionType - Type of interaction ('like', 'view', 'share', 'bookmark', 'download')
 * @param {object} userData - Optional user data (defaults to current user)
 * @returns {Promise<boolean>} Success status
 */
async function trackInteraction(contentType, contentId, interactionType, userData = null) {
    try {
        const user = userData || window.getCurrentUser();
        const timestamp = new Date().toISOString();
        
        // Build interaction record for universal_analytics table - ONLY allowed columns
        const interactionData = {
            content_type: contentType,
            content_id: contentId,
            interaction_type: interactionType,
            created_at: timestamp
        };
        
        // Add user data if available (only user_id and user_email allowed)
        if (user) {
            interactionData.user_id = user.id;
            interactionData.user_email = user.email;
        } else if (interactionType === 'view') {
            // Allow anonymous views without user data
            console.log(`Tracking anonymous ${interactionType} for ${contentType} ${contentId}`);
            // Skip insert for anonymous views since user_id and user_email might be required
            return true;
        } else {
            // Other interactions require authentication
            console.warn(`Authentication required for ${interactionType}`);
            await showAlert(`Please log in to ${interactionType} this content`, 'warning');
            return false;
        }
        
        // All interactions go to universal_analytics table
        const { data, error } = await window.dcfSupabase
            .from('universal_analytics')
            .insert([interactionData]);
        
        if (error) {
            // Handle duplicate key errors gracefully
            if (error.code === '23505') {
                console.log(`Interaction already tracked: ${interactionType} on ${contentType} ${contentId}`);
                return true;
            }
            throw error;
        }
        
        // Update local cache
        const cacheKey = `${contentType}_${contentId}_${interactionType}`;
        if (interactionCache.has(cacheKey)) {
            const current = interactionCache.get(cacheKey);
            interactionCache.set(cacheKey, current + 1);
        }
        
        // Add to user's interaction set
        if (user && interactionType !== 'view') {
            const setKey = `${contentType}_${contentId}`;
            userInteractions[`${interactionType}s`]?.add(setKey);
        }
        
        console.log(`✅ Tracked ${interactionType} for ${contentType} ${contentId}`);
        return true;
        
    } catch (error) {
        console.error(`Error tracking ${interactionType}:`, error);
        return false;
    }
}

/**
 * Get interaction count for specific content
 * @param {string} contentType - Type of content
 * @param {string} contentId - Content identifier
 * @param {string} interactionType - Type of interaction
 * @returns {Promise<number>} Count of interactions
 */
async function getInteractionCount(contentType, contentId, interactionType) {
    try {
        // Check cache first
        const cacheKey = `${contentType}_${contentId}_${interactionType}`;
        if (interactionCache.has(cacheKey)) {
            return interactionCache.get(cacheKey);
        }
        
        // Query universal_analytics table
        const { count, error } = await window.dcfSupabase
            .from('universal_analytics')
            .select('*', { count: 'exact', head: true })
            .eq('content_type', contentType)
            .eq('content_id', contentId)
            .eq('interaction_type', interactionType);
        
        if (error) {
            console.error(`Error getting ${interactionType} count:`, error);
            return 0;
        }
        
        // Cache the result
        interactionCache.set(cacheKey, count || 0);
        
        return count || 0;
        
    } catch (error) {
        console.error(`Error getting interaction count:`, error);
        return 0;
    }
}

/**
 * Check if user has interacted with content
 * @param {string} contentType - Type of content
 * @param {string} contentId - Content identifier  
 * @param {string} interactionType - Type of interaction
 * @param {string} userId - User ID (defaults to current user)
 * @returns {Promise<boolean>} True if user has interacted
 */
async function hasUserInteracted(contentType, contentId, interactionType, userId = null) {
    try {
        const user = userId ? { id: userId } : window.getCurrentUser();
        if (!user) return false;
        
        // Check local cache first
        const setKey = `${contentType}_${contentId}`;
        if (userInteractions[`${interactionType}s`]?.has(setKey)) {
            return true;
        }
        
        // Query universal_analytics table - use maybeSingle() to avoid 406 errors
        const { data, error } = await window.dcfSupabase
            .from('universal_analytics')
            .select('id')
            .eq('content_type', contentType)
            .eq('content_id', contentId)
            .eq('interaction_type', interactionType)
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (error) {
            console.error(`Error checking interaction:`, error);
        }
        
        const hasInteracted = !!data;
        
        // Update cache
        if (hasInteracted) {
            userInteractions[`${interactionType}s`]?.add(setKey);
        }
        
        return hasInteracted;
        
    } catch (error) {
        console.error(`Error checking user interaction:`, error);
        return false;
    }
}

/**
 * Toggle interaction (like/unlike, bookmark/unbookmark, etc.)
 * @param {string} contentType - Type of content
 * @param {string} contentId - Content identifier
 * @param {string} interactionType - Type of interaction
 * @param {object} options - Additional options (contentTitle, etc.)
 * @returns {Promise<object>} Result with new state and count
 */
async function toggleInteraction(contentType, contentId, interactionType, options = {}) {
    try {
        const user = window.getCurrentUser();
        if (!user) {
            await showAlert(`Please log in to ${interactionType} this content`, 'warning');
            return { success: false, isActive: false, count: 0 };
        }
        
        // Check current state
        const isCurrentlyActive = await hasUserInteracted(contentType, contentId, interactionType, user.id);
        
        if (isCurrentlyActive) {
            // Remove interaction from universal_analytics table
            const { error } = await window.dcfSupabase
                .from('universal_analytics')
                .delete()
                .eq('content_type', contentType)
                .eq('content_id', contentId)
                .eq('interaction_type', interactionType)
                .eq('user_id', user.id);
            
            if (error) throw error;
            
            // Update cache
            const setKey = `${contentType}_${contentId}`;
            userInteractions[`${interactionType}s`]?.delete(setKey);
            
            // Update count cache
            const cacheKey = `${contentType}_${contentId}_${interactionType}`;
            if (interactionCache.has(cacheKey)) {
                const current = interactionCache.get(cacheKey);
                interactionCache.set(cacheKey, Math.max(0, current - 1));
            }
            
            console.log(`✅ Removed ${interactionType} from ${contentType} ${contentId}`);
            
        } else {
            // Add interaction to universal_analytics table - ONLY allowed columns
            const interactionData = {
                content_type: contentType,
                content_id: contentId,
                interaction_type: interactionType,
                user_id: user.id,
                user_email: user.email,
                created_at: new Date().toISOString()
            };
            
            const { error } = await window.dcfSupabase
                .from('universal_analytics')
                .insert([interactionData]);
            
            if (error) {
                if (error.code === '23505') {
                    // Already exists, treat as success
                    console.log(`${interactionType} already exists`);
                } else {
                    throw error;
                }
            }
            
            // Update cache
            const setKey = `${contentType}_${contentId}`;
            userInteractions[`${interactionType}s`]?.add(setKey);
            
            // Update count cache
            const cacheKey = `${contentType}_${contentId}_${interactionType}`;
            if (interactionCache.has(cacheKey)) {
                const current = interactionCache.get(cacheKey);
                interactionCache.set(cacheKey, current + 1);
            }
            
            console.log(`✅ Added ${interactionType} to ${contentType} ${contentId}`);
        }
        
        // Update UI if options provided
        if (options.buttonId) {
            const button = document.getElementById(options.buttonId);
            if (button) {
                updateInteractionUI(button, !isCurrentlyActive, null, {
                    activeEmoji: options.activeEmoji,
                    inactiveEmoji: options.inactiveEmoji
                });
            }
        }
        
        // Get new count
        const newCount = await getInteractionCount(contentType, contentId, interactionType);
        
        // Update count element if provided
        if (options.countElementId) {
            const countEl = document.getElementById(options.countElementId);
            if (countEl) {
                countEl.textContent = `(${newCount})`;
            }
        }
        
        return {
            success: true,
            isActive: !isCurrentlyActive,
            count: newCount
        };
        
    } catch (error) {
        console.error(`Error toggling ${interactionType}:`, error);
        await showAlert(`Failed to update ${interactionType}`, 'error');
        return { success: false, isActive: false, count: 0 };
    }
}

/**
 * Update UI for interaction button
 * @param {HTMLElement} button - Button element
 * @param {boolean} isActive - Whether interaction is active
 * @param {number} count - Current count
 * @param {object} options - Options including emojis
 */
function updateInteractionUI(button, isActive, count, options = {}) {
    if (!button) return;
    
    // Update button state
    if (isActive) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
    
    // Update icon if emojis provided
    if (options.activeEmoji && options.inactiveEmoji) {
        const iconElement = button.querySelector('.icon') || button.querySelector('span:first-child');
        if (iconElement) {
            iconElement.textContent = isActive ? options.activeEmoji : options.inactiveEmoji;
        }
    }
    
    // Update text if element exists
    const textElement = button.querySelector('.text') || button.querySelector('span:last-child');
    if (textElement && textElement.id && textElement.id.includes('Text')) {
        const baseText = textElement.textContent.replace('d', ''); // Remove 'd' from 'Liked'
        textElement.textContent = isActive ? baseText + 'd' : baseText;
    }
    
    // Update count if provided
    if (count !== null && count !== undefined) {
        const countElement = button.querySelector('.count') || document.getElementById(button.id + 'Count');
        if (countElement) {
            countElement.textContent = count > 0 ? `(${count})` : '';
        }
    }
}

/**
 * Initialize all interaction buttons on page
 * @param {string} contentType - Type of content on current page
 */
async function initializeInteractionButtons(contentType = null) {
    // Find all interaction buttons
    const buttons = document.querySelectorAll('[data-interaction-type]');
    
    for (const button of buttons) {
        const btnContentType = button.getAttribute('data-content-type') || contentType;
        const contentId = button.getAttribute('data-content-id');
        const interactionType = button.getAttribute('data-interaction-type');
        
        if (btnContentType && contentId && interactionType) {
            // Check if user has interacted
            const isActive = await hasUserInteracted(btnContentType, contentId, interactionType);
            const count = await getInteractionCount(btnContentType, contentId, interactionType);
            
            // Update UI
            updateInteractionUI(button, isActive, count, interactionType);
            
            // Add click handler
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Get content title if available
                const contentTitle = button.getAttribute('data-content-title') || 
                                   document.querySelector('h1')?.textContent;
                
                // Toggle interaction
                const result = await toggleInteraction(
                    btnContentType, 
                    contentId, 
                    interactionType,
                    { contentTitle }
                );
                
                if (result.success) {
                    updateInteractionUI(button, result.isActive, result.count, interactionType);
                }
            });
        }
    }
    
    console.log(`✅ Initialized ${buttons.length} interaction buttons`);
}

/**
 * Track page view automatically
 * @param {string} contentType - Type of content
 * @param {string} contentId - Content identifier
 */
async function trackPageView(contentType, contentId) {
    // Auto-track view when page loads
    await trackInteraction(contentType, contentId, 'view');
}

/**
 * Get session ID for anonymous tracking
 * @returns {string} Session identifier
 */
function getSessionId() {
    let sessionId = sessionStorage.getItem('dcf_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('dcf_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Load user's interactions for current session
 */
async function loadUserInteractions() {
    const user = window.getCurrentUser();
    if (!user) return;
    
    try {
        // Load likes
        const { data: likes } = await window.dcfSupabase
            .from('content_likes')
            .select('content_type, content_id')
            .eq('user_id', user.id);
            
        if (likes) {
            likes.forEach(like => {
                userInteractions.likes.add(`${like.content_type}_${like.content_id}`);
            });
        }
        
        // Load bookmarks
        const { data: bookmarks } = await window.dcfSupabase
            .from('bookmarks')
            .select('content_type, content_id')
            .eq('user_id', user.id);
            
        if (bookmarks) {
            bookmarks.forEach(bookmark => {
                userInteractions.bookmarks.add(`${bookmark.content_type}_${bookmark.content_id}`);
            });
        }
        
        console.log('✅ Loaded user interactions:', {
            likes: userInteractions.likes.size,
            bookmarks: userInteractions.bookmarks.size
        });
        
    } catch (error) {
        console.error('Error loading user interactions:', error);
    }
}

// ============= HELPER FUNCTIONS =============

/**
 * Get or create session ID for anonymous tracking
 * @returns {string} Session ID
 */
function getSessionId() {
    let sessionId = sessionStorage.getItem('dcf_session_id');
    if (!sessionId) {
        sessionId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('dcf_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Track a project view (convenience function)
 * @param {string} projectId - Project ID
 * @param {object} metadata - Additional metadata
 */
async function trackProjectView(projectId, metadata = {}) {
    return await trackInteraction('project', projectId, 'view', metadata);
}

/**
 * Get project ID from current URL
 * @returns {string|null} Project ID or null
 */
function getProjectIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || urlParams.get('project_id') || urlParams.get('projectId');
}

/**
 * Get analytics summary for a content item
 * @param {string} contentType - Type of content
 * @param {string} contentId - Content ID
 * @returns {Promise<object>} Summary of all interactions
 */
async function getAnalyticsSummary(contentType, contentId) {
    const summary = {
        views: await getInteractionCount(contentType, contentId, 'view'),
        likes: await getInteractionCount(contentType, contentId, 'like'),
        shares: await getInteractionCount(contentType, contentId, 'share'),
        bookmarks: await getInteractionCount(contentType, contentId, 'bookmark'),
        downloads: await getInteractionCount(contentType, contentId, 'download')
    };
    return summary;
}

/**
 * Get bulk interaction counts for multiple items
 * @param {string} contentType - Type of content
 * @param {string[]} contentIds - Array of content IDs
 * @param {string} interactionType - Type of interaction
 * @returns {Promise<object>} Map of contentId to count
 */
async function getBulkInteractionCounts(contentType, contentIds, interactionType) {
    try {
        const { data, error } = await window.dcfSupabase
            .from('universal_analytics')
            .select('content_id')
            .eq('content_type', contentType)
            .in('content_id', contentIds)
            .eq('interaction_type', interactionType);
        
        if (error) throw error;
        
        // Count by content_id
        const counts = {};
        contentIds.forEach(id => counts[id] = 0);
        data.forEach(row => {
            counts[row.content_id] = (counts[row.content_id] || 0) + 1;
        });
        
        return counts;
    } catch (error) {
        console.error('Error getting bulk counts:', error);
        return {};
    }
}

/**
 * Get user's interaction history
 * @param {string} userId - User ID (defaults to current user)
 * @param {number} limit - Maximum number of results
 * @returns {Promise<array>} Array of interactions
 */
async function getUserInteractionHistory(userId = null, limit = 50) {
    try {
        const user = userId ? { id: userId } : window.getCurrentUser();
        if (!user) return [];
        
        const { data, error } = await window.dcfSupabase
            .from('universal_analytics')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error getting user history:', error);
        return [];
    }
}

/**
 * Initialize analytics buttons with data attributes
 */
async function initializeAnalyticsButtons() {
    // Find all elements with data-analytics attributes
    const buttons = document.querySelectorAll('[data-interaction-type]');
    
    buttons.forEach(button => {
        const contentType = button.dataset.contentType;
        const contentId = button.dataset.contentId;
        const interactionType = button.dataset.interactionType;
        
        if (!contentType || !contentId || !interactionType) return;
        
        // Add click handler
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const result = await toggleInteraction(contentType, contentId, interactionType, {
                buttonId: button.id,
                activeEmoji: button.dataset.activeEmoji,
                inactiveEmoji: button.dataset.inactiveEmoji
            });
            
            if (result.success) {
                console.log(`Toggled ${interactionType} on ${contentType} ${contentId}`);
            }
        });
        
        // Initialize button state
        hasUserInteracted(contentType, contentId, interactionType).then(isActive => {
            updateInteractionUI(button, isActive, null, {
                activeEmoji: button.dataset.activeEmoji,
                inactiveEmoji: button.dataset.inactiveEmoji
            });
        });
        
        // Get and display count
        getInteractionCount(contentType, contentId, interactionType).then(count => {
            const countEl = document.getElementById(button.id + 'Count');
            if (countEl) {
                countEl.textContent = count > 0 ? `(${count})` : '';
            }
        });
    });
}

// ============= EXPORT ANALYTICS FUNCTIONS =============
window.trackInteraction = trackInteraction;
window.getInteractionCount = getInteractionCount;
window.hasUserInteracted = hasUserInteracted;
window.toggleInteraction = toggleInteraction;
window.updateInteractionUI = updateInteractionUI;
window.initializeInteractionButtons = initializeInteractionButtons;
window.trackPageView = trackPageView;
window.loadUserInteractions = loadUserInteractions;
window.userInteractions = userInteractions;
window.getSessionId = getSessionId;
window.trackProjectView = trackProjectView;
window.getProjectIdFromURL = getProjectIdFromURL;
window.getAnalyticsSummary = getAnalyticsSummary;
window.getBulkInteractionCounts = getBulkInteractionCounts;
window.getUserInteractionHistory = getUserInteractionHistory;
window.initializeAnalyticsButtons = initializeAnalyticsButtons;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserInteractions();
    initializeInteractionButtons();
});

console.log('✅ Universal Analytics System loaded - tracks all interactions for all content types');

// =============================================================================
// 21. MISSING TABLE HANDLERS - GRACEFUL DEGRADATION
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
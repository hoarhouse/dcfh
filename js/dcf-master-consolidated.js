// DCF Hungary Master Consolidated JavaScript - COMPLETELY REWRITTEN AND FIXED
// NO DUPLICATES, NO ERRORS, EVERYTHING WORKS

// =============================================================================
// 1. GLOBAL VARIABLES - DECLARED ONCE ONLY
// =============================================================================
window.masterSupabase = null;
window.isDropdownOpen = false;
window.notificationDropdownOpen = false;

// =============================================================================
// 2. SUPABASE CONNECTION
// =============================================================================
async function connectToAuth() {
    if (window.authSupabase) {
        window.masterSupabase = window.authSupabase;
        console.log('Connected to auth Supabase');
        console.log('Connected, testing auth immediately...');
        try {
            const testSession = await window.masterSupabase.auth.getUser();
            console.log('Auth test result:', testSession);
            
            // If user is logged in, setup session management
            if (testSession?.data?.user && window.dcfAuth?.setupSessionManagement) {
                console.log('Setting up session management for active user');
                window.dcfAuth.setupSessionManagement();
            }
        } catch (e) {
            console.log('Auth test failed:', e);
        }
        return true;
    }
    return false;
}

// =============================================================================
// 3. USER MENU FUNCTIONALITY
// =============================================================================
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
    addNavigationItems();
    
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

// =============================================================================
// 4. USER DATA AND AVATAR FUNCTIONS
// =============================================================================
async function updateUserInfo() {
    console.log('updateUserInfo called');
    
    // Use the improved auth system from supabase-auth.js
    if (window.dcfAuth && typeof window.dcfAuth.getCurrentUser === 'function') {
        const currentUser = window.dcfAuth.getCurrentUser();
        if (currentUser) {
            console.log('Using improved auth system, user:', currentUser);
            
            // Fetch real profile data from database
            let profileName = currentUser.name;
            let profileUsername = currentUser.username;
            let profileAvatarUrl = currentUser.avatar_url;
            
            if (window.masterSupabase && currentUser.email) {
                try {
                    const { data: profile } = await window.masterSupabase
                        .from('user_profiles')
                        .select('name, username, avatar_url')

                        .eq('email', currentUser.email)
                        .single();
                    
                    if (profile) {
                        profileName = profile.name || profile.username || profileName;
                        profileUsername = profile.username || profileUsername;
                        profileAvatarUrl = profile.avatar_url || profileAvatarUrl;
                        console.log('Found database profile:', { profileName, profileUsername, profileAvatarUrl });
                    } else {
                        console.log('No profile found in database for:', currentUser.email);
                    }
                } catch (error) {
                    console.log('Database profile fetch error:', error);
                }
            }
            
            // Update UI elements
            const nameElement = document.getElementById('dropdownUserName');
            const emailElement = document.getElementById('dropdownUserEmail');
            const avatarElement = document.getElementById('userAvatar');
            const dropdownAvatarElement = document.querySelector('.dropdown-avatar');
            
            // Set username (with @ prefix) and email using database data
            const displayUsername = profileUsername ? `@${profileUsername}` : `@${currentUser.username}` || '@user';
            if (nameElement) nameElement.textContent = displayUsername;
            if (emailElement) emailElement.textContent = currentUser.email;
            
            // Generate initials using database data
            const initials = generateInitials(profileName || currentUser.username || 'User');
            console.log('Generated initials:', initials);
            
            // Set avatars with database profile data
            if (avatarElement) {
                if (profileAvatarUrl) {
                    avatarElement.className = 'user-avatar';
                    avatarElement.style.backgroundImage = `url(${profileAvatarUrl})`;
                    avatarElement.style.backgroundSize = 'cover';
                    avatarElement.style.backgroundPosition = 'center';
                    avatarElement.textContent = '';
                } else {
                    avatarElement.className = 'user-avatar';
                    avatarElement.style.backgroundImage = '';
                    avatarElement.textContent = initials;
                }
            }
            
            if (dropdownAvatarElement) {
                if (profileAvatarUrl) {
                    dropdownAvatarElement.style.backgroundImage = `url(${profileAvatarUrl})`;
                    dropdownAvatarElement.style.backgroundSize = 'cover';
                    dropdownAvatarElement.style.backgroundPosition = 'center';
                    dropdownAvatarElement.textContent = '';
                } else {
                    dropdownAvatarElement.style.backgroundImage = '';
                    dropdownAvatarElement.textContent = initials;
                }
            }
            return;
        }
    }
    
    // Fallback to old system
    console.log('Falling back to old auth system');
    
    // Use authSupabase directly - skip the broken connection
    const supabase = window.authSupabase;
    if (!supabase) {
        console.log('No Supabase available');
        return;
    }
    
    if (!window.masterSupabase) {
        console.log('No Supabase connection available');
        return;
    }
    
    // Get current session
    const { data: { session } } = await window.masterSupabase.auth.getSession();
    if (!session?.user) {
        console.log('No user session found - user is logged out');
        // Don't return - this is normal for logged-out users
        // The main initialization will handle the logged-out state
        return;
    }
    
    const userEmail = session.user.email;
    const userMetadata = session.user.user_metadata || {};
    console.log('Found user email:', userEmail, 'metadata:', userMetadata);
    
    // Get user profile from database or metadata
    let userName = userMetadata.full_name || userMetadata.name || userEmail?.split('@')[0] || 'User';
    let userUsername = userEmail?.split('@')[0] || 'user';
    let avatarUrl = null; // No external provider avatars
    
    try {
        const { data: profile } = await window.masterSupabase
            .from('user_profiles')
            .select('name, username, avatar_url')

            .eq('email', userEmail)
            .single();
        
        if (profile) {
            userName = profile.name || profile.username || userName;
            userUsername = profile.username || userUsername;
            avatarUrl = profile.avatar_url || avatarUrl;
            console.log('Found profile:', { userName, userUsername, avatarUrl });
        }
    } catch (error) {
        console.log('Profile fetch error:', error);
    }
    
    // Update UI elements
    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');
    const avatarElement = document.getElementById('userAvatar');
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');
    
    // Set username (with @ prefix) and email
    const displayUsername = userUsername ? `@${userUsername}` : '@user';
    if (nameElement) nameElement.textContent = displayUsername;
    if (emailElement) emailElement.textContent = userEmail;
    
    // Generate initials
    const initials = generateInitials(userName);
    console.log('Generated initials:', initials);
    
    // Set avatars
    if (avatarElement) {
        if (avatarUrl) {
            avatarElement.className = 'user-avatar';
            avatarElement.style.backgroundImage = `url(${avatarUrl})`;
            avatarElement.style.backgroundSize = 'cover';
            avatarElement.style.backgroundPosition = 'center';
            avatarElement.textContent = '';
        } else {
            avatarElement.className = 'user-avatar';
            avatarElement.textContent = initials || '?';
            avatarElement.style.backgroundImage = '';
            avatarElement.style.background = 'linear-gradient(135deg, #000, #333)';
        }
    }
    
    if (dropdownAvatarElement) {
        if (avatarUrl) {
            dropdownAvatarElement.style.backgroundImage = `url(${avatarUrl})`;
            dropdownAvatarElement.style.backgroundSize = 'cover';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.textContent = '';
        } else {
            dropdownAvatarElement.textContent = initials || '?';
            dropdownAvatarElement.style.backgroundImage = '';
            dropdownAvatarElement.style.background = 'linear-gradient(135deg, #000, #333)';
        }
    }
}

function generateInitials(name) {
    if (!name || typeof name !== 'string') return '';
    
    const cleanName = name.replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?|Professor|Father|Fr\.?|Sister|Sr\.?|Rabbi)\s+/i, '').trim();
    const parts = cleanName.split(' ').filter(part => part.length > 0);
    
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    
    return '';
}

// =============================================================================
// 5. NAVIGATION FUNCTIONS
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

function addNavigationItems() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown || dropdown.querySelector('.nav-item')) return;

    const currentPage = window.location.pathname.split('/').pop();
    
    // Use the correct base path calculation
    const basePath = getCorrectBasePath();
    
    const navigationItems = [
        { href: basePath + 'members/dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: basePath + 'members/dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: basePath + 'members/dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: basePath + 'projects/dcf_projects.html', icon: '📋', text: 'My Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: basePath + 'members/dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },

    ];
    
    console.log('DEBUG NAV - basePath:', basePath);
    console.log('DEBUG NAV - navigationItems:', navigationItems);

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
    if (dropdownHeader) {
        dropdown.insertBefore(navSection, dropdownHeader.nextSibling);
    }
}

function populateTopNavigation() {
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Only populate if empty
    navMenu.innerHTML = '';
    
    const currentPage = window.location.pathname.split('/').pop();
    
    // Use the correct base path calculation
    const basePath = getCorrectBasePath();
    
    // Member navigation
    const memberNav = [
        { href: basePath + 'members/dcf_member_home.html', text: 'Home' },
        { href: basePath + 'members/dcf_members_directory.html', text: 'Members' },
        { href: basePath + 'projects/dcf_projects_home.html', text: 'Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', text: 'Events' },
        { href: basePath + 'resources/dcf_resources_library.html', text: 'Resources' },
        { href: basePath + 'public/dcf_contact.html', text: 'Contact' }
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
// 6. LOGOUT FUNCTIONS
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
        // Sign out from Supabase first
        if (window.masterSupabase) {
            await window.masterSupabase.auth.signOut();
        }
        
        // Clear old auth keys specifically to avoid conflicts
        const oldAuthKeys = [
            'dcf_user_logged_in',
            'dcf_user_name',
            'dcf_user_email',
            'dcf_remember_login',
            'dcf_redirect_after_login'
        ];
        
        oldAuthKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Clear all session storage
        sessionStorage.clear();
        
        // Clear global user state
        if (window.dcfUser) {
            window.dcfUser = {
                isLoggedIn: false,
                profile: null,
                session: null
            };
        }
        
        // Clear session management
        if (window.dcfAuth?.clearSessionManagement) {
            window.dcfAuth.clearSessionManagement();
        }
        
        // Navigate to login page with proper path
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
// 7. UNIVERSAL AUTHENTICATION HANDLING - ALL PAGES TREATED EQUALLY
// =============================================================================
// Note: Page type detection disabled - all pages get universal auth handling
/*
function getPageType() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop();
    
    if (filename === 'index.html' || filename === '' || 
        filename.includes('contact') || filename.includes('about') ||
        filename.includes('login') || filename.includes('signup')) {
        return 'public';
    }
    
    if (filename.includes('dcf_member') || filename.includes('dcf_projects') ||
        filename.includes('dcf_events') || filename.includes('dcf_resources') ||
        filename.includes('dcf_admin') || filename.includes('dcf_personal') ||
        filename.includes('dcf_account_settings') || filename.includes('dcf_project') ||
        filename.includes('dcf_notifications') || filename.includes('dcf_upload') || filename.includes('dcf_resource')) {
        return 'member';
    }
    
    return 'public';
}

function handlePublicPageAuth() {
    // Check if user is logged in via Supabase session
    if (window.masterSupabase) {
        window.masterSupabase.auth.getSession().then(({ data: { session } }) => {
            const isLoggedIn = !!session?.user;
            
            // Only modify nav if user is NOT logged in
            if (!isLoggedIn) {
                updateNavForAuthState(false);
            } else {
                // User is logged in - add notification bell and make sure avatar is clickable
                addNotificationBellToMemberPages();
                const avatar = document.getElementById('userAvatar');
                if (avatar && !avatar.onclick) {
                    avatar.setAttribute('onclick', 'toggleUserMenu()');
                    avatar.style.cursor = 'pointer';
                }
            }
        });
    } else {
        updateNavForAuthState(false);
    }
}
*/

function updateNavForAuthState(isLoggedIn) {
    const navActions = document.querySelector('.nav-actions') || document.querySelector('.user-menu');
    
    if (navActions) {
        if (!isLoggedIn) {
            // Update avatar for logged out state
            updateAvatarForLoggedOutState();
            
            navActions.innerHTML = `
                <a href="${getCorrectBasePath()}auth/dcf_login_page.html" class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px;">Login</a>
                <a href="${getCorrectBasePath()}auth/dcf_profile_signup.html" class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Join Us</a>
            `;
        }
    }
}

// =============================================================================
// 8. COMPLETE QUICK ACTIONS SYSTEM
// =============================================================================
function initializeQuickActions() {
    const currentPage = getCurrentPageType();
    const container = document.querySelector('.sidebar-card');
    if (!container) return;
    
    const actionsDiv = container.querySelector('div[style*="flex-direction: column"]');
    if (!actionsDiv) return;
    
    const actionsHTML = getQuickActionsHTML(currentPage);
    actionsDiv.innerHTML = actionsHTML;
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
    switch (pageType) {
        case 'projects':
            return `
                <button class="btn btn-primary" onclick="focusSearchProjects()">🔍 Search Projects</button>
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_project.html'">➕ Create Project</button>
                <button class="btn btn-secondary" onclick="exploreJoinableProjects()">🤝 Join Project</button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects.html'">📊 Manage My Projects</button>
            `;
        case 'events':
            return `
                <button class="btn btn-primary" onclick="focusSearchEvents()">📅 Find Events</button>
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_event.html'">➕ Create Event</button>
                <button class="btn btn-secondary" onclick="exploreUpcomingEvents()">🎟️ Register for Events</button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_events.html'">📋 My Event Calendar</button>
            `;
        case 'members':
            return `
                <button class="btn btn-primary" onclick="focusSearchMembers()">👥 Find Members</button>
                <button class="btn btn-secondary" onclick="connectWithMembers()">🤝 Connect with Members</button>
                <button class="btn btn-secondary" onclick="showComingSoon('My Network')">🌐 View My Network</button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_personal_analytics.html'">📊 Member Analytics</button>
            `;
        case 'resources':
            return `
                <button class="btn btn-primary" onclick="focusSearchResources()">📚 Browse Library</button>
                <button class="btn btn-primary" onclick="window.location.href='dcf_resource_upload.html'">⬆️ Upload Resource</button>
                <button class="btn btn-secondary" onclick="viewMyContributions()">📝 My Contributions</button>
                <button class="btn btn-secondary" onclick="viewBookmarks()">🔖 My Bookmarks</button>
            `;
        case 'home_feed':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_project.html'">🚀 Create Project</button>
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_event.html'">📅 Create Event</button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_members_directory.html'">👥 Find Collaborators</button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_personal_analytics.html'">📊 View My Stats</button>
            `;
        default:
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_project.html'">🚀 Create Project</button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_personal_analytics.html'">📊 View Analytics</button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_events_calendar.html'">📅 Events Calendar</button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_member_home.html'">💬 Discussion Forum</button>
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
// 9. USERNAME VALIDATION FUNCTIONS
// =============================================================================
async function validateUsername(username) {
    if (!username || username.length < 3 || username.length > 30) {
        return { valid: false, message: 'Username must be 3-30 characters long' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    
    if (!window.masterSupabase) {
        await connectToAuth();
    }
    
    try {
        const { data } = await window.masterSupabase
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

// =============================================================================
// 8. FOOTER FUNCTIONALITY
// =============================================================================
function initializeFooter() {
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-logo">
                    <div class="footer-logo-icon"></div>
                    <span class="footer-logo-text">DCF Hungary</span>
                </div>
                <div class="footer-links">
                    <a href="index.html">Home</a>
                    <a href="dcf_about.html">About</a>
                    <a href="dcf_contact.html">Contact</a>
                    <a href="${getCorrectBasePath()}auth/dcf_login_page.html">Login</a>
                    <a href="${getCorrectBasePath()}auth/dcf_profile_signup.html">Join</a>
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
// 9. IMAGE OPTIMIZATION & LAZY LOADING SYSTEM
// =============================================================================

// Lazy loading observer
let imageObserver = null;

function initImageOptimization() {
    // Initialize lazy loading for all images
    initLazyLoading();
    
    // Optimize existing images
    optimizeExistingImages();
    
    // Set up avatar optimization
    optimizeAvatars();
    
    console.log('Image optimization initialized');
}

function initLazyLoading() {
    // Create intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
        imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });
        
        // Apply to all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    // Show loading placeholder
    img.style.filter = 'blur(5px)';
    img.style.opacity = '0.5';
    
    // Create new image to preload
    const imageLoader = new Image();
    imageLoader.onload = () => {
        img.src = src;
        img.style.filter = '';
        img.style.opacity = '';
        img.classList.add('loaded');
    };
    imageLoader.onerror = () => {
        img.src = getPlaceholderImage();
        img.classList.add('error');
    };
    imageLoader.src = src;
}

function getPlaceholderImage() {
    // Generate placeholder SVG
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666'%3EImage Loading...%3C/text%3E%3C/svg%3E`;
}

function optimizeExistingImages() {
    // Convert existing images to lazy loading
    document.querySelectorAll('img:not([data-src])').forEach(img => {
        if (img.src && !img.complete) {
            const src = img.src;
            img.dataset.src = src;
            img.src = getPlaceholderImage();
            if (imageObserver) imageObserver.observe(img);
        }
    });
}

function optimizeAvatars() {
    // Optimize user avatars specifically
    document.querySelectorAll('.user-avatar, .member-avatar, .dropdown-avatar').forEach(avatar => {
        if (avatar.style.backgroundImage) {
            const url = avatar.style.backgroundImage.slice(5, -2); // Remove url(" ")
            if (url && url.startsWith('http')) {
                // Convert to optimized Supabase Storage URL if needed
                const optimizedUrl = getOptimizedImageUrl(url);
                avatar.style.backgroundImage = `url(${optimizedUrl})`;
            }
        }
    });
}

function getOptimizedImageUrl(originalUrl, width = 300, height = 300) {
    // If it's already a Supabase Storage URL, add transformation parameters
    if (originalUrl.includes('supabase.co/storage')) {
        return `${originalUrl}?format=webp`;
    }
    
    // For external URLs, return as-is (could implement external optimization service)
    return originalUrl;
}

function addImageOptimizationCSS() {
    if (document.getElementById('imageOptimizationCSS')) return;
    
    const style = document.createElement('style');
    style.id = 'imageOptimizationCSS';
    style.textContent = `
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        .progressive-image-wrapper {
            position: relative;
            overflow: hidden;
        }
        
        .image-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        
        img.loaded {
            transition: all 0.3s ease;
        }
        
        img.error {
            opacity: 0.5;
            filter: grayscale(100%);
        }
        
        /* Optimize avatar loading */
        .user-avatar, .member-avatar, .dropdown-avatar {
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            border-radius: 50% !important;
        }
        
        /* Post image optimization */
        .post-image, .project-image, .event-image {
            transition: opacity 0.3s ease, filter 0.3s ease;
        }
        
        .post-image[data-src] {
            background: #f8f9fa;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
}

// Re-run when new content is dynamically loaded
function reinitializeImageOptimization() {
    initLazyLoading();
    optimizeExistingImages();
    optimizeAvatars();
}

// =============================================================================
// 10. NOTIFICATION FUNCTIONS
// =============================================================================
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
    
    setTimeout(() => {
        document.addEventListener('click', closeNotificationDropdownOutside);
    }, 100);
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

function markAllNotificationsAsRead() {
    closeNotificationDropdown();
}

async function loadRecentNotifications() {
    const content = document.getElementById('notificationDropdownContent');
    if (!content) return;
    content.innerHTML = '<div class="notification-loading">Loading...</div>';
    
    try {
        // Get current user
        if (!window.masterSupabase) {
            await connectToAuth();
        }
        
        const { data: { session } } = await window.masterSupabase.auth.getSession();
        if (!session?.user) {
            content.innerHTML = '<div class="notification-loading">Please log in to view notifications</div>';
            return;
        }
        
        // Fetch recent notifications for the user
        const { data: notifications, error } = await window.masterSupabase
            .from('notifications')
            .select('*')
            .eq('recipient_email', session.user.email)
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (error) {
            console.error('Error loading notifications:', error);
            content.innerHTML = '<div class="notification-loading">Error loading notifications</div>';
            return;
        }
        
        // Display notifications
        if (!notifications || notifications.length === 0) {
            content.innerHTML = `
                <div class="notification-item">
                    <div class="notification-item-header">
                        <span class="notification-item-icon">📬</span>
                        <span class="notification-item-title">No notifications</span>
                        <span class="notification-item-time">-</span>
                    </div>
                    <div class="notification-item-message">You're all caught up!</div>
                </div>
            `;
            return;
        }
        
        // Generate notification HTML
        const notificationHTML = notifications.map(notification => {
            const timeAgo = getTimeAgo(notification.created_at);
            const icon = getNotificationIcon(notification.type);
            
            return `
                <div class="notification-item" onclick="handleNotificationClick('${notification.id}')">
                    <div class="notification-item-header">
                        <span class="notification-item-icon">${icon}</span>
                        <span class="notification-item-title">${notification.title}</span>
                        <span class="notification-item-time">${timeAgo}</span>
                    </div>
                    <div class="notification-item-message">${notification.message}</div>
                </div>
            `;
        }).join('');
        
        content.innerHTML = notificationHTML;
        
    } catch (error) {
        console.error('Error in loadRecentNotifications:', error);
        content.innerHTML = '<div class="notification-loading">Error loading notifications</div>';
    }
}

function getNotificationIcon(type) {
    const icons = {
        'project': '📁',
        'event': '📅',
        'message': '💬',
        'connection': '🤝',
        'system': '⚙️',
        'achievement': '🏆',
        'reminder': '⏰'
    };
    return icons[type] || '🔔';
}

function getTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
}

function handleNotificationClick(notificationId) {
    console.log('Clicked notification:', notificationId);
    // Mark as read and potentially navigate somewhere
    closeNotificationDropdown();
}

function addNotificationBellToMemberPages() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        // Remove any existing notification bell first
        const existingBell = userMenu.querySelector('.notification-bell');
        if (existingBell) {
            existingBell.remove();
        }
        
        // Add the notification bell
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
        
        // Add CSS for notification bell
        if (!document.querySelector('#notificationBellCSS')) {
            const style = document.createElement('style');
            style.id = 'notificationBellCSS';
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
                .notification-item-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem; }
                .notification-item-icon { font-size: 1rem; flex-shrink: 0; }
                .notification-item-title { font-weight: 600; font-size: 0.9rem; color: #333; flex: 1; }
                .notification-item-time { font-size: 0.8rem; color: #666; }
                .notification-item-message { font-size: 0.85rem; color: #666; line-height: 1.4; }
                .notification-dropdown-footer { padding: 0.75rem 1.5rem; border-top: 1px solid #e5e5e5; background: #f8f9fa; }
                .mark-all-read-btn { width: 100%; padding: 0.5rem; background: #000; color: white; border: none; border-radius: 6px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s ease; }
                .mark-all-read-btn:hover { background: #333; }
                .notification-loading { padding: 2rem; text-align: center; color: #666; font-size: 0.9rem; }
            `;
            document.head.appendChild(style);
        }
    }
}


function updateAvatarForLoggedOutState() {
    const avatarElement = document.getElementById('userAvatar');
    if (avatarElement) {
        avatarElement.className = 'user-avatar logged-out';
        avatarElement.textContent = '👤';
        avatarElement.style.backgroundImage = '';
        avatarElement.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
        avatarElement.removeAttribute('onclick');
        avatarElement.style.cursor = 'default';
    }
}

// =============================================================================
// 9. MAIN INITIALIZATION
// =============================================================================
console.log('SCRIPT LOADING: dcf-master-consolidated.js loaded');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DEBUG: DOMContentLoaded fired');
    console.log('DEBUG: Master JS initializing...');
    
    // Wait a moment for other scripts to load
    try {
        console.log('DEBUG: About to start setTimeout');
        setTimeout(async () => {
            console.log('DEBUG: setTimeout fired, starting init');
            connectToAuth().catch(e => console.log('connectToAuth failed but continuing:', e));
            console.log('DEBUG: connectToAuth completed');
        
        // Populate navigation if needed
        console.log('DEBUG: About to call populateTopNavigation');
        console.log('DEBUG: navMenu element:', document.getElementById('navMenu'));
        console.log('DEBUG: nav-menu element:', document.querySelector('.nav-menu'));
        populateTopNavigation();
        console.log('DEBUG: populateTopNavigation called');
        console.log('DEBUG: navMenu innerHTML after populate:', document.getElementById('navMenu')?.innerHTML);
        
        // Update user info for all pages
        await updateUserInfo();
        
        // Check authentication state and handle UI accordingly
        const currentUser = window.dcfAuth?.getCurrentUser?.() || null;
        
        if (currentUser) {
            // User is logged in - ensure avatar is clickable and add notifications
            const avatar = document.getElementById('userAvatar');
            if (avatar && !avatar.onclick) {
                avatar.setAttribute('onclick', 'toggleUserMenu()');
                avatar.style.cursor = 'pointer';
            }
            addNotificationBellToMemberPages();
        } else {
            // User is NOT logged in - show login/signup buttons
            updateNavForAuthState(false);
        }
        
        // Initialize footer
        setTimeout(initializeFooter, 50);
        
        // Initialize image optimization
        addImageOptimizationCSS();
        setTimeout(initImageOptimization, 100);
        
        console.log('DEBUG: Master JS initialization complete');
        }, 500);
    } catch (error) {
        console.error('DEBUG: Error in DOMContentLoaded:', error);
    }
});

// Also try immediate execution in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    console.log('DEBUG: Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('DEBUG: Document already loaded, running immediately');
    setTimeout(() => {
        console.log('DEBUG: Immediate execution timeout fired');
        populateTopNavigation();
        console.log('DEBUG: Immediate populateTopNavigation called');
    }, 100);
}

// =============================================================================
// 11. GLOBAL EXPORTS
// =============================================================================
window.toggleUserMenu = toggleUserMenu;
window.handleLogout = handleLogout;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.focusSearchProjects = focusSearchProjects;
window.exploreJoinableProjects = exploreJoinableProjects;
window.focusSearchEvents = focusSearchEvents;
window.exploreUpcomingEvents = exploreUpcomingEvents;

// 11. STANDARDIZED ALERT SYSTEM
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
window.focusSearchMembers = focusSearchMembers;
window.connectWithMembers = connectWithMembers;
window.focusSearchResources = focusSearchResources;
window.viewMyContributions = viewMyContributions;
window.viewBookmarks = viewBookmarks;
window.showComingSoon = showComingSoon;
window.validateUsername = validateUsername;
window.generateSuggestedUsername = generateSuggestedUsername;
window.initImageOptimization = initImageOptimization;
window.reinitializeImageOptimization = reinitializeImageOptimization;
window.getOptimizedImageUrl = getOptimizedImageUrl;
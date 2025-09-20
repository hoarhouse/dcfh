// =============================================================================
// DCF AUTHENTICATION SYSTEM
// Uses dcf-core.js utilities and integrates with dcf-ui.js
// Non-blocking authentication that gracefully degrades
// =============================================================================

console.log('🔐 DCF Authentication System Loading...');

// =============================================================================
// 1. GLOBAL STATE
// =============================================================================

let dcfSupabase = null;
let dcfUser = {
    isLoggedIn: false,
    profile: null,
    session: null
};

// =============================================================================
// 2. SUPABASE CLIENT INITIALIZATION
// =============================================================================

function initializeSupabaseClient() {
    try {
        // Check if Supabase library is available
        if (typeof window.supabase === 'undefined') {
            console.warn('⚠️ Supabase library not loaded - authentication disabled');
            return false;
        }
        
        // Use credentials from dcf-core.js
        if (!window.dcfCore) {
            console.warn('⚠️ dcf-core.js not loaded - using fallback credentials');
            return false;
        }
        
        dcfSupabase = window.supabase.createClient(
            window.dcfCore.SUPABASE_URL,
            window.dcfCore.SUPABASE_ANON_KEY,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true,
                    flowType: 'pkce',
                    storage: window.localStorage
                }
            }
        );
        
        console.log('✅ Supabase client initialized');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Supabase client initialization failed:', error.message);
        return false;
    }
}

// =============================================================================
// 3. AUTHENTICATION CORE
// =============================================================================

async function initializeAuth() {
    console.log('🔍 Initializing authentication...');
    
    // Initialize Supabase client
    const supabaseReady = initializeSupabaseClient();
    if (!supabaseReady) {
        console.log('📱 Running in offline mode - authentication disabled');
        dcfUser = { isLoggedIn: false, profile: null, session: null };
        updateUIForLoggedOutState();
        return false;
    }
    
    try {
        // Check for existing session with timeout
        const sessionPromise = dcfSupabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session check timeout')), 3000)
        );
        
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (error) {
            console.warn('⚠️ Session check failed:', error.message);
            dcfUser = { isLoggedIn: false, profile: null, session: null };
            updateUIForLoggedOutState();
            return false;
        }
        
        if (session?.user) {
            console.log('👤 Found existing session for:', session.user.email);
            await loadUserProfile(session);
            updateUIForLoggedInState();
            return true;
        } else {
            console.log('📝 No existing session found');
            dcfUser = { isLoggedIn: false, profile: null, session: null };
            updateUIForLoggedOutState();
            return false;
        }
        
    } catch (error) {
        console.warn('⚠️ Authentication initialization failed:', error.message);
        dcfUser = { isLoggedIn: false, profile: null, session: null };
        updateUIForLoggedOutState();
        return false;
    }
}

async function loadUserProfile(session) {
    try {
        // Try to load user profile from database
        const { data: profile, error } = await dcfSupabase
            .from('user_profiles')
            .select('first_name, last_name, username, email, avatar_url')
            .eq('email', session.user.email)
            .single();
        
        if (error || !profile) {
            console.log('ℹ️ No profile found, using session data');
            // Fallback to session data
            dcfUser = {
                isLoggedIn: true,
                profile: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.email.split('@')[0],
                    username: session.user.email.split('@')[0],
                    avatar_url: null
                },
                session: session
            };
        } else {
            console.log('👤 Profile loaded:', profile.username);
            dcfUser = {
                isLoggedIn: true,
                profile: {
                    id: session.user.id,
                    email: session.user.email,
                    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username,
                    username: profile.username,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    avatar_url: profile.avatar_url
                },
                session: session
            };
        }
        
    } catch (error) {
        console.warn('⚠️ Profile loading failed:', error.message);
        // Use session data as fallback
        dcfUser = {
            isLoggedIn: true,
            profile: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.email.split('@')[0],
                username: session.user.email.split('@')[0],
                avatar_url: null
            },
            session: session
        };
    }
}

// =============================================================================
// 4. UI INTEGRATION
// =============================================================================

function updateUIForLoggedInState() {
    console.log('🎨 Updating UI for logged-in user');
    
    if (!window.dcfUI) {
        console.warn('⚠️ dcf-ui.js not available');
        return;
    }
    
    // Update navigation to logged-in version
    updateLoggedInNavigation();
    
    // Update user menu
    updateUserMenu();
}

function updateUIForLoggedOutState() {
    console.log('📱 Updating UI for logged-out state');
    
    if (window.dcfUI) {
        // Use the existing logged-out UI from dcf-ui.js
        window.dcfUI.showLoggedOutState();
    }
}

function updateLoggedInNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    const basePath = window.getCorrectBasePath();
    
    // Clear existing navigation
    navMenu.innerHTML = '';
    
    // LOGGED IN NAVIGATION STRUCTURE
    const loggedInNavItems = [
        { href: basePath + 'members/dcf_member_home.html', text: 'Dashboard' },
        { href: basePath + 'projects/dcf_projects_home.html', text: 'Projects' },
        { href: basePath + 'resources/dcf_resources_library.html', text: 'Resources' },
        { href: basePath + 'blog/index.html', text: 'Blog' },
        { href: basePath + 'people/index.html', text: 'People' },
        { 
            href: basePath + 'news/dcf_news.html', 
            text: 'Community',
            dropdown: true,
            submenu: [
                { href: basePath + 'news/dcf_news.html', text: 'News & Updates' },
                { href: basePath + 'events/dcf_events_calendar.html', text: 'Events' },
                { href: basePath + 'members/dcf_members_directory.html', text: 'Member Directory' }
            ]
        }
    ];
    
    // Build navigation using same structure as dcf-ui.js
    loggedInNavItems.forEach(item => {
        const li = document.createElement('li');
        
        if (item.dropdown && item.submenu) {
            // Create dropdown structure
            li.className = 'nav-dropdown';
            li.style.position = 'relative';
            
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.text;
            a.className = 'dropdown-toggle';
            
            // Add dropdown arrow
            const arrow = document.createElement('span');
            arrow.textContent = ' ▼';
            arrow.style.fontSize = '0.7em';
            arrow.style.marginLeft = '3px';
            a.appendChild(arrow);
            
            li.appendChild(a);
            
            // Create submenu
            const submenu = document.createElement('ul');
            submenu.className = 'nav-submenu';
            submenu.style.cssText = `
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                min-width: 180px;
                z-index: 1000;
                padding: 0.5rem 0;
                margin-top: 0.5rem;
                list-style: none;
            `;
            
            item.submenu.forEach(subItem => {
                const subLi = document.createElement('li');
                subLi.style.margin = '0';
                
                const subA = document.createElement('a');
                subA.href = subItem.href;
                subA.textContent = subItem.text;
                subA.style.cssText = `
                    display: block;
                    padding: 0.5rem 1rem;
                    color: #666;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                `;
                
                // Add hover effect
                subA.addEventListener('mouseenter', () => {
                    subA.style.backgroundColor = '#f8f9fa';
                    subA.style.color = '#333';
                });
                subA.addEventListener('mouseleave', () => {
                    subA.style.backgroundColor = 'transparent';
                    subA.style.color = '#666';
                });
                
                subLi.appendChild(subA);
                submenu.appendChild(subLi);
            });
            
            li.appendChild(submenu);
            
            // Handle dropdown hover
            let hoverTimeout;
            
            li.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                submenu.style.display = 'block';
            });
            
            li.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    submenu.style.display = 'none';
                }, 100);
            });
            
        } else {
            // Regular menu item
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.text;
            li.appendChild(a);
        }
        
        navMenu.appendChild(li);
    });
}

function updateUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu || !dcfUser.profile) return;
    
    const initials = window.generateInitials(dcfUser.profile.username || dcfUser.profile.name);
    const basePath = window.getCorrectBasePath();
    
    // Create avatar HTML with profile picture support
    const avatarHTML = dcfUser.profile.avatar_url 
        ? `<div class="user-avatar" onclick="toggleUserMenu()" id="userAvatar" style="background-image: url('${dcfUser.profile.avatar_url}'); background-size: cover; background-position: center;"></div>`
        : `<div class="user-avatar" onclick="toggleUserMenu()" id="userAvatar">${initials}</div>`;
    
    // Create dropdown avatar HTML with profile picture support  
    const dropdownAvatarHTML = dcfUser.profile.avatar_url
        ? `<div class="dropdown-avatar" style="background-image: url('${dcfUser.profile.avatar_url}'); background-size: cover; background-position: center;"></div>`
        : `<div class="dropdown-avatar">${initials}</div>`;
    
    userMenu.innerHTML = `
        <div class="notification-bell" onclick="toggleNotificationDropdown(event)">
            <span class="notification-icon">🔔</span>
            <div class="notification-badge" id="notificationBadge" style="display: none;">0</div>
        </div>
        <div class="user-dropdown">
            ${avatarHTML}
            <div class="dropdown-menu" id="userDropdown">
                <div class="dropdown-header">
                    ${dropdownAvatarHTML}
                    <div class="dropdown-info">
                        <div class="dropdown-name">@${dcfUser.profile.username}</div>
                        <div class="dropdown-email">${dcfUser.profile.email}</div>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="${basePath}members/dcf_member_profile.html" class="dropdown-item">
                    <span class="dropdown-icon">👤</span>
                    My Profile
                </a>
                <a href="${basePath}members/dcf_my_connections.html" class="dropdown-item">
                    <span class="dropdown-icon">👥</span>
                    My Connections
                </a>
                <a href="${basePath}members/dcf_private_messaging.html" class="dropdown-item">
                    <span class="dropdown-icon">✉️</span>
                    Messages
                </a>
                <a href="${basePath}projects/dcf_projects.html" class="dropdown-item">
                    <span class="dropdown-icon">📁</span>
                    My Projects
                </a>
                <a href="${basePath}events/dcf_events_calendar.html" class="dropdown-item">
                    <span class="dropdown-icon">📅</span>
                    My Events
                </a>
                <a href="${basePath}members/dcf_personal_analytics.html" class="dropdown-item">
                    <span class="dropdown-icon">📊</span>
                    My Stats
                </a>
                <a href="${basePath}members/dcf_edit_profile.html" class="dropdown-item">
                    <span class="dropdown-icon">⚙️</span>
                    Settings
                </a>
                <a href="${basePath}public/dcf_contact.html" class="dropdown-item">
                    <span class="dropdown-icon">💬</span>
                    Help & Support
                </a>
                <div class="dropdown-divider"></div>
                <button onclick="handleLogout()" class="dropdown-item logout-btn">
                    <span class="dropdown-icon">🚪</span>
                    Sign Out
                </button>
            </div>
        </div>
    `;
    
    // Add notification bell CSS
    addNotificationBellCSS();
}

// =============================================================================
// 6. NOTIFICATION SYSTEM
// =============================================================================

function addNotificationBellCSS() {
    if (document.querySelector('#notificationBellCSS')) return;
    
    const style = document.createElement('style');
    style.id = 'notificationBellCSS';
    style.textContent = `
        .notification-bell { 
            position: relative; 
            cursor: pointer; 
            padding: 0.5rem; 
            border-radius: 50%; 
            transition: background-color 0.3s ease; 
            margin-right: 1rem; 
        }
        .notification-bell:hover { 
            background-color: #f0f0f0; 
        }
        .notification-icon { 
            font-size: 1.2rem; 
            display: block; 
        }
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

function toggleNotificationDropdown(event) {
    if (event) event.stopPropagation();
    console.log('🔔 Notification bell clicked - notifications coming soon');
    
    // Placeholder for future notification functionality
    if (window.showAlert) {
        window.showAlert('Notification system coming soon!', 'info');
    }
}

// =============================================================================
// 7. USER MENU FUNCTIONALITY
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
    
    // Close on outside click
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
// 8. AUTHENTICATION ACTIONS
// =============================================================================

async function handleLogout() {
    closeUserMenu();
    
    if (!dcfSupabase) {
        console.log('📱 Offline mode - clearing local session');
        dcfUser = { isLoggedIn: false, profile: null, session: null };
        updateUIForLoggedOutState();
        return;
    }
    
    const confirmed = await window.showConfirm('Are you sure you want to sign out?');
    if (!confirmed) return;
    
    try {
        await dcfSupabase.auth.signOut();
        dcfUser = { isLoggedIn: false, profile: null, session: null };
        updateUIForLoggedOutState();
        
        // Redirect to home page
        const basePath = window.getCorrectBasePath();
        window.location.href = basePath + 'index.html';
        
    } catch (error) {
        console.error('Logout error:', error);
        // Force logout even if API fails
        dcfUser = { isLoggedIn: false, profile: null, session: null };
        updateUIForLoggedOutState();
    }
}

// =============================================================================
// 9. AUTH STATE LISTENER
// =============================================================================

function setupAuthStateListener() {
    if (!dcfSupabase) return;
    
    dcfSupabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
            await loadUserProfile(session);
            updateUIForLoggedInState();
        } else if (event === 'SIGNED_OUT') {
            dcfUser = { isLoggedIn: false, profile: null, session: null };
            updateUIForLoggedOutState();
        }
    });
}

// =============================================================================
// 10. PUBLIC API
// =============================================================================

function getCurrentUser() {
    return dcfUser.isLoggedIn ? dcfUser.profile : null;
}

function isUserLoggedIn() {
    return dcfUser.isLoggedIn;
}

function getSession() {
    return dcfUser.session;
}

function getSupabaseClient() {
    return dcfSupabase;
}

// =============================================================================
// 11. EXPORTS
// =============================================================================

const dcfAuth = {
    initializeAuth,
    getCurrentUser,
    isUserLoggedIn,
    getSession,
    getSupabaseClient,
    handleLogout,
    toggleUserMenu,
    openUserMenu,
    closeUserMenu
};

// Export to window for global access
window.dcfAuth = dcfAuth;
window.dcfSupabase = () => dcfSupabase; // Function to get current client
window.getCurrentUser = getCurrentUser;
window.isUserLoggedIn = isUserLoggedIn;
window.handleLogout = handleLogout;
window.toggleUserMenu = toggleUserMenu;
window.toggleNotificationDropdown = toggleNotificationDropdown;

// Initialize auth state listener
setupAuthStateListener();

console.log('✅ DCF Authentication System loaded');
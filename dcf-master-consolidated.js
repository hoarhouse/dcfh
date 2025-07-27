// DCF Hungary Master Consolidated JavaScript - COMPLETE
// Combines: universal-navbar.js + universal-quick-actions.js + quickactions.js + footer functionality

// Supabase configuration for avatar loading
let masterSupabase = null;
function initializeSupabase() {
    if (window.supabase && !masterSupabase) {
        const supabaseUrl = 'https://atzommnkkwzgbktuzjti.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';
        masterSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);
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
    // DON'T call updateUserDropdownInfo() here - avatar already loaded on page load
    // Only add navigation items on member pages, not public pages
    if (getPageType() === 'member') {
        addNavigationItems();
    }
    
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

async function updateUserDropdownInfo() {
    const userName = localStorage.getItem('dcf_user_name') || 'Dr. Sarah Johnson';
    const userEmail = localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org';
    const authProvider = localStorage.getItem('dcf_auth_provider') || 'demo';

    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');

    if (nameElement) nameElement.textContent = userName;
    if (emailElement) {
        if (authProvider === 'github') {
            emailElement.textContent = `${userEmail} (GitHub)`;
        } else {
            emailElement.textContent = userEmail;
        }
    }

    const initials = generateInitials(userName);
    // Be more specific - find the avatar in the top navigation
    const avatarElement = document.querySelector('.user-menu .user-avatar') || document.getElementById('userAvatar');
    
    console.log('Found avatar element:', avatarElement);
    console.log('Current avatar content:', avatarElement ? avatarElement.textContent : 'none');
    console.log('Current avatar background:', avatarElement ? avatarElement.style.background : 'none');
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');

    // Initialize Supabase and wait longer for it to be ready
    if (!masterSupabase) {
        initializeSupabase();
        // Wait longer and retry until Supabase is available
        let retries = 0;
        while (!masterSupabase && retries < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
    }

    // Try to load profile picture from database
    let avatarUrl = null;
    try {
        if (masterSupabase && window.supabase) {
            console.log('Attempting to load avatar for:', userEmail);
            const { data, error } = await masterSupabase
                .from('user_profiles')
                .select('avatar_url')
                .eq('email', userEmail)
                .single();
            
            if (error) {
                console.log('Database error:', error);
            }
            
            if (data && data.avatar_url) {
                avatarUrl = data.avatar_url;
                console.log('Found avatar URL:', avatarUrl);
            } else {
                console.log('No avatar URL found in database');
            }
        } else {
            console.log('Supabase not available');
        }
    } catch (error) {
        console.log('Could not load avatar from database:', error);
    }

    // Update both avatars (top right and dropdown)
    if (avatarElement) {
        if (avatarUrl) {
            console.log('Setting avatar image for top right');
            // Show profile picture
            avatarElement.style.backgroundImage = `url(${avatarUrl})`;
            avatarElement.style.backgroundSize = 'cover';
            avatarElement.style.backgroundPosition = 'center';
            avatarElement.style.background = '';  // Remove gradient
            avatarElement.style.boxShadow = '0 0 10px #00ff00';  // Keep green glow
            avatarElement.textContent = '';  // Remove initials
        } else {
            console.log('Setting initials for top right');
            // Show initials with green styling
            avatarElement.textContent = initials;
            avatarElement.style.backgroundImage = '';
            avatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
            avatarElement.style.boxShadow = '0 0 10px #00ff00';
        }
    }
    
    if (dropdownAvatarElement) {
        if (avatarUrl) {
            console.log('Setting avatar image for dropdown');
            // Show profile picture
            dropdownAvatarElement.style.backgroundImage = `url(${avatarUrl})`;
            dropdownAvatarElement.style.backgroundSize = 'cover';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.style.background = '';  // Remove gradient
            dropdownAvatarElement.textContent = '';  // Remove initials
        } else {
            console.log('Setting initials for dropdown');
            // Show initials with green styling
            dropdownAvatarElement.textContent = initials;
            dropdownAvatarElement.style.backgroundImage = '';
            dropdownAvatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
        }
    }
}

// NEW FUNCTION - Add this after updateUserDropdownInfo()
async function loadPageAvatars() {
    console.log('Loading page avatars...');
    const userName = localStorage.getItem('dcf_user_name') || 'Dr. Sarah Johnson';
    const userEmail = localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org';
    
    const initials = generateInitials(userName);
    const avatarElement = document.getElementById('userAvatar');
    
    // Force initialize Supabase
    if (!masterSupabase) {
        initializeSupabase();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait longer
    }
    
    // Try to load profile picture
    let avatarUrl = null;
    try {
        if (masterSupabase && window.supabase) {
            console.log('Attempting to load avatar for page load:', userEmail);
            const { data, error } = await masterSupabase
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
    
    // Update avatar
    if (avatarElement) {
        console.log('Avatar element classes:', avatarElement.className);
        console.log('Avatar element ID:', avatarElement.id);
        if (avatarUrl) {
            console.log('Setting avatar image on page load');
            avatarElement.style.backgroundImage = `url(${avatarUrl})`;
            avatarElement.style.backgroundSize = 'cover';
            avatarElement.style.backgroundPosition = 'center';
            avatarElement.style.background = '';
            avatarElement.style.boxShadow = '0 0 10px #00ff00';
            avatarElement.textContent = '';
            
            // Force it to stay by setting it again after a delay
            setTimeout(() => {
                console.log('Re-applying avatar image to ensure it stays');
                avatarElement.style.backgroundImage = `url(${avatarUrl})`;
                avatarElement.style.backgroundSize = 'cover';
                avatarElement.style.backgroundPosition = 'center';
                avatarElement.style.background = '';
                avatarElement.style.boxShadow = '0 0 10px #00ff00';
                avatarElement.textContent = '';
            }, 500);
        } else {
            console.log('Setting initials on page load');
            avatarElement.textContent = initials;
            avatarElement.style.backgroundImage = '';
            avatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
            avatarElement.style.boxShadow = '0 0 10px #00ff00';
        }
    } else {
        console.log('Avatar element not found on page load');
    }
}

function generateInitials(name) {
    if (!name) return 'SJ';
    
    const cleanName = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.|Rev\.|Fr\.|Sr\.)\s+/i, '');
    const parts = cleanName.split(' ');
    
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
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
    
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('dcf_github_session');
        localStorage.removeItem('dcf_user_logged_in');
        localStorage.removeItem('dcf_user_name');
        localStorage.removeItem('dcf_user_email');
        localStorage.removeItem('dcf_auth_provider');
        localStorage.removeItem('dcf_remember_login');
        sessionStorage.clear();
        
        window.location.href = 'dcf_login_page.html';
    }
}

// =============================================================================
// 2. UPDATED TOP NAVIGATION FUNCTIONALITY - REPLACES ALL HARDCODED NAV
// =============================================================================
function populateTopNavigation() {
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in') === 'true';
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
    
    if (filename.includes('projects_home') || filename.includes('project_detail')) {
        return 'projects';
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
        filename.includes('dcf_account_settings')) {
        return 'member';
    }
    
    return 'public';
}


function handlePublicPageAuth() {
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in') === 'true';
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
                    <div class="notification-bell" onclick="window.location.href='dcf_notifications.html'">
                        <span class="notification-icon">🔔</span>
                        <div class="notification-badge" id="notificationBadge" style="display: none;">0</div>
                    </div>
                    <div class="user-dropdown">
                        <div class="user-avatar" onclick="toggleUserMenu()" id="userAvatar">SJ</div>
                        <div class="dropdown-menu" id="userDropdown">
                            <div class="dropdown-header">
                                <div class="dropdown-avatar">SJ</div>
                                <div class="dropdown-info">
                                    <div class="dropdown-name" id="dropdownUserName">Dr. Sarah Johnson</div>
                                    <div class="dropdown-email" id="dropdownUserEmail">sarah.johnson@dcfhungary.org</div>
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
                `;
                document.head.appendChild(style);
            }
            
// Use existing functions to populate everything correctly
            setTimeout(() => {
                updateUserDropdownInfo(); // Sets correct user data and green styling
                addNavigationItems(); // Adds menu items and logout using your existing system
            }, 10);
        }
    }
}

function addNotificationBellToMemberPages() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu && !userMenu.querySelector('.notification-bell')) {
        // Check if it already has notification bell
        const existingBell = userMenu.querySelector('.notification-bell');
        if (!existingBell) {
            // Add notification bell before the user dropdown
            const bellHTML = `
                <div class="notification-bell" onclick="window.location.href='dcf_notifications.html'">
                    <span class="notification-icon">🔔</span>
                    <div class="notification-badge" id="notificationBadge" style="display: none;">0</div>
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
                    .notification-icon { font-size: 1.2rem; display: block; }
                    .notification-badge { position: absolute; top: -2px; right: -2px; background: #dc3545; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; border: 2px solid white; min-width: 20px; }
                `;
                document.head.appendChild(style);
            }
        }
    }
}

// =============================================================================
// 7. MAIN INITIALIZATION - EVERYTHING HAPPENS HERE
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    const pageType = getPageType();
    const isLoggedIn = localStorage.getItem('dcf_user_logged_in') === 'true';
    
    // Initialize top navigation for all pages
    populateTopNavigation();
    
    // Initialize footer for all pages
    setTimeout(initializeFooter, 50);
    
    if (pageType === 'member') {
        // ONLY redirect if it's actually a member page AND user not logged in
        if (!isLoggedIn) {
            window.location.href = 'dcf_login_page.html';
            return;
        }
        // Load avatar on page load
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
        if (isLoggedIn) {
            setTimeout(async () => {
                await updateUserDropdownInfo();
            }, 100);
        }
}
    
    // ALSO handle member pages that have existing .user-menu
    if (pageType === 'member' && isLoggedIn) {
        addNotificationBellToMemberPages();
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
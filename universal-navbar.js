// Universal Navbar System for DCF Hungary - COMPLETE REWRITE WITH SMART ROUTING
// Provides consistent navigation across all pages with smart login state detection

class DCFUniversalNavbar {
    constructor() {
        // Prevent duplicate initialization
        if (window.dcfNavbar || document.getElementById('dcf-navbar')) {
            console.log('DCF Navbar already exists, skipping initialization');
            return;
        }
        
        this.isLoggedIn = this.checkLoginStatus();
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    // Check if user is logged in - FIXED to detect your actual login data
    checkLoginStatus() {
        // Check your actual login indicators from localStorage
        const loginIndicators = [
            localStorage.getItem('dcf_user_logged_in'),
            localStorage.getItem('dcf_github_session'),
            localStorage.getItem('dcf_user_name'),
            localStorage.getItem('dcf_auth_provider'),
            // Backup checks
            localStorage.getItem('dcf_auth_token'),
            sessionStorage.getItem('dcf_user_session'),
            document.cookie.includes('dcf_logged_in=true'),
            document.querySelector('[data-user-logged-in="true"]')
        ];

        const isLoggedIn = loginIndicators.some(indicator => !!indicator);
        
        // Debug output
        console.log('DCF Login Check:', {
            url: window.location.href,
            dcf_user_logged_in: localStorage.getItem('dcf_user_logged_in'),
            dcf_github_session: !!localStorage.getItem('dcf_github_session'),
            dcf_user_name: localStorage.getItem('dcf_user_name'),
            finalStatus: isLoggedIn
        });
        
        return isLoggedIn;
    }

    // Get current page name for navigation highlighting
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '').replace('dcf_', '');
    }

    // Hide existing navbar elements (SAFE METHOD - keeps old code intact)
    hideExistingNavbars() {
        // Add CSS to hide old navbars
        const hideNavbarCSS = `
        <style id="dcf-hide-old-navbars">
        /* Hide old navbar elements - they remain in DOM but invisible */
        nav:not(.dcf-universal-navbar),
        .navbar:not(.dcf-universal-navbar),
        .navigation:not(.dcf-universal-navbar),
        .header-nav:not(.dcf-universal-navbar),
        .main-nav:not(.dcf-universal-navbar),
        .top-nav:not(.dcf-universal-navbar),
        #navbar:not(.dcf-universal-navbar),
        #navigation:not(.dcf-universal-navbar),
        .nav-container:not(.dcf-universal-navbar),
        .dcf-nav:not(.dcf-universal-navbar) {
            display: none !important;
            visibility: hidden !important;
        }
        
        /* Hide old dropdown scripts and buttons */
        .old-dropdown,
        button[onclick*="toggleDropdown"],
        [class*="SJ-button"],
        .user-toggle:not(.dcf-universal-navbar *) {
            display: none !important;
        }
        
        /* Ensure our universal navbar is always visible */
        .dcf-universal-navbar {
            display: block !important;
            visibility: visible !important;
        }
        </style>
        `;
        
        // Insert CSS to hide old navbars
        if (!document.getElementById('dcf-hide-old-navbars')) {
            document.head.insertAdjacentHTML('beforeend', hideNavbarCSS);
        }
        
        // Log what we're hiding for debugging
        const oldNavElements = document.querySelectorAll('nav:not(.dcf-universal-navbar), .navbar:not(.dcf-universal-navbar)');
        if (oldNavElements.length > 0) {
            console.log(`DCF Universal Navbar: Hiding ${oldNavElements.length} old navbar elements`);
        }
    }

    // Initialize the navbar
    init() {
        // First hide existing navbars (safe method)
        this.hideExistingNavbars();
        
        // Then create our universal navbar
        this.createNavbarHTML();
        this.attachEventListeners();
        this.highlightCurrentPage();
        
        // Add rollback function to window for easy debugging
        window.dcfNavbarRollback = this.rollback.bind(this);
        console.log('DCF Universal Navbar initialized successfully. Login status:', this.isLoggedIn);
    }

    // Create the complete navbar HTML structure
    createNavbarHTML() {
        const navbarHTML = `
        <nav class="dcf-universal-navbar" id="dcf-navbar">
            <div class="navbar-container">
                <!-- LEFT SIDE: Logo + Main Navigation -->
                <div class="navbar-left">
                    <div class="navbar-logo">
                        <a href="index.html" class="logo-link">
                            <img src="assets/dcf-logo.png" alt="DCF Hungary" class="logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                            <span class="logo-text">DCF Hungary</span>
                        </a>
                    </div>
                    <div class="navbar-main-menu">
                        <ul class="main-menu-list">
                            <li class="menu-item has-dropdown" data-page="about">
                                <a href="dcf_about.html" class="menu-link">About</a>
                                <div class="mega-dropdown">
                                    <div class="dropdown-content">
                                        <a href="dcf_mission.html">Our Mission</a>
                                        <a href="dcf_leadership.html">Leadership Team</a>
                                        <a href="dcf_global_network.html">Global Network</a>
                                        <a href="dcf_community_guidelines.html">Community Guidelines</a>
                                    </div>
                                </div>
                            </li>
                            <li class="menu-item has-dropdown" data-page="research">
                                <a href="dcf_research.html" class="menu-link">Research</a>
                                <div class="mega-dropdown">
                                    <div class="dropdown-content">
                                        <a href="#" onclick="dcfNavigateToProjects(event)">Current Projects</a>
                                        <a href="dcf_publications.html">Publications</a>
                                        <a href="dcf_case_studies.html">Case Studies</a>
                                        <a href="dcf_funding.html">Funding</a>
                                    </div>
                                </div>
                            </li>
                            <li class="menu-item has-dropdown" data-page="community">
                                <a href="dcf_community.html" class="menu-link">Community</a>
                                <div class="mega-dropdown">
                                    <div class="dropdown-content">
                                        <a href="dcf_members_directory.html">Members Directory</a>
                                        <a href="dcf_working_groups.html">Working Groups</a>
                                        <a href="dcf_mentorship.html">Mentorship</a>
                                        <a href="dcf_profile_dashboard.html">Member Dashboard</a>
                                    </div>
                                </div>
                            </li>
                            <li class="menu-item has-dropdown" data-page="events">
                                <a href="dcf_events.html" class="menu-link">Events</a>
                                <div class="mega-dropdown">
                                    <div class="dropdown-content">
                                        <a href="dcf_events_calendar.html">Events Calendar</a>
                                        <a href="dcf_event_details.html">Event Details</a>
                                        <a href="dcf_event_registration.html">Register for Events</a>
                                    </div>
                                </div>
                            </li>
                            <li class="menu-item" data-page="projects">
                                <a href="#" class="menu-link" onclick="dcfNavigateToProjects(event)">Projects</a>
                            </li>
                            <li class="menu-item has-dropdown" data-page="events">
    <a href="dcf_events.html" class="menu-link">Events</a>
    <div class="mega-dropdown">
        <div class="dropdown-content">
            <a href="dcf_events_calendar.html">Events Calendar</a>
            <a href="dcf_event_details.html">Event Details</a>
            <a href="dcf_event_registration.html">Register for Events</a>
        </div>
    </div>
</li>
                        </ul>
                    </div>
                </div>

                <!-- CENTER: Search - REDUCED WIDTH -->
                <div class="navbar-center">
                    <div class="navbar-search">
                        <div class="search-container">
                            <input type="text" 
                                   id="dcf-search" 
                                   class="search-input" 
                                   placeholder="Search projects, members, resources..."
                                   autocomplete="off">
                            <button class="search-btn" type="button">
                                <span class="search-icon">🔍</span>
                            </button>
                        </div>
                        <div class="search-suggestions" id="search-suggestions" style="display: none;"></div>
                    </div>
                </div>

                <!-- RIGHT SIDE: Dynamic based on login status -->
                <div class="navbar-right">
                    ${this.isLoggedIn ? this.getLoggedInRightNav() : this.getLoggedOutRightNav()}
                </div>

                <!-- Mobile Menu Toggle -->
                <div class="mobile-menu-toggle">
                    <button class="mobile-toggle-btn" id="mobile-menu-btn">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div class="mobile-menu" id="mobile-menu" style="display: none;">
                <div class="mobile-menu-content">
                    <!-- Mobile menu items will be populated by JavaScript -->
                </div>
            </div>
        </nav>

        <style>
        /* Universal Navbar Styles */
        .dcf-universal-navbar {
            background: #ffffff;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .navbar-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 64px;
        }

        /* LEFT SIDE: Logo + Main Menu */
        .navbar-left {
            display: flex;
            align-items: center;
            flex: 1;
        }

        .navbar-logo {
            margin-right: 40px;
        }

        .logo-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: #1f2937;
        }

        .logo-img {
            height: 32px;
            width: auto;
            margin-right: 8px;
        }

        .logo-text {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
        }

        .main-menu-list {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            align-items: center;
        }

        .menu-item {
            position: relative;
            margin-right: 32px;
        }

        .menu-link {
            display: block;
            padding: 8px 0;
            color: #4b5563;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s ease;
        }

        .menu-link:hover, 
        .menu-item.active .menu-link {
            color: #2563eb;
        }

        /* Dropdown Styles - FIXED TO HIDE BY DEFAULT */
        .mega-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 16px;
            min-width: 200px;
            z-index: 1001;
        }

        .has-dropdown:hover .mega-dropdown {
            display: block;
        }

        .dropdown-content a {
            display: block;
            padding: 8px 12px;
            color: #4b5563;
            text-decoration: none;
            font-size: 14px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }

        .dropdown-content a:hover {
            background-color: #f3f4f6;
            color: #2563eb;
        }

        /* CENTER: Search - REDUCED BY 50% */
        .navbar-center {
            flex: 0 0 200px;
            margin: 0 20px;
        }

        .search-container {
            position: relative;
            display: flex;
            align-items: center;
        }

        .search-input {
            width: 100%;
            padding: 8px 40px 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-btn {
            position: absolute;
            right: 8px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
        }

        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-height: 300px;
            overflow-y: auto;
            z-index: 1002;
        }

        /* RIGHT SIDE */
        .navbar-right {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .navbar-btn {
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-secondary {
            background: #f9fafb;
            color: #4b5563;
            border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
            background: #f3f4f6;
        }

        .btn-primary {
            background: #2563eb;
            color: white;
        }

        .btn-primary:hover {
            background: #1d4ed8;
        }

        .user-dropdown {
            position: relative;
        }

        .user-menu-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: #f9fafb;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        }

        .user-dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 8px 0;
            min-width: 180px;
            z-index: 1001;
        }

        .user-dropdown.active .user-dropdown-menu {
            display: block;
        }

        .dropdown-item {
            display: block;
            width: 100%;
            padding: 8px 16px;
            text-align: left;
            color: #4b5563;
            text-decoration: none;
            font-size: 14px;
            border: none;
            background: none;
            cursor: pointer;
        }

        .dropdown-item:hover {
            background: #f3f4f6;
        }

        .dropdown-divider {
            height: 1px;
            background: #e5e7eb;
            margin: 4px 0;
        }

        /* Mobile Styles */
        .mobile-menu-toggle {
            display: none;
        }

        @media (max-width: 968px) {
            .navbar-main-menu,
            .navbar-center {
                display: none;
            }
            
            .mobile-menu-toggle {
                display: block;
            }
            
            .mobile-toggle-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            
            .hamburger-line {
                width: 20px;
                height: 2px;
                background: #4b5563;
                transition: 0.3s;
            }
            
            .mobile-menu {
                background: white;
                border-top: 1px solid #e5e7eb;
                padding: 20px;
            }
        }
        </style>
        `;

        // Insert navbar at the beginning of body if it doesn't exist
        if (!document.getElementById('dcf-navbar')) {
            document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        }
    }

    // Generate right navigation for logged-out users
    getLoggedOutRightNav() {
        return `
            <div class="language-selector">
                <button class="navbar-btn btn-secondary" title="Language/Region Selector">🌐 EN</button>
            </div>
            <a href="dcf_login_page.html" class="navbar-btn btn-secondary">Login</a>
            <a href="dcf_profile_signup.html" class="navbar-btn btn-primary">Join Movement</a>
        `;
    }

    // Generate right navigation for logged-in users
    getLoggedInRightNav() {
        return `
            <div class="notifications">
                <button class="navbar-btn btn-secondary" title="Notifications">
                    🔔 <span class="notification-count">3</span>
                </button>
            </div>
            <div class="messages">
                <button class="navbar-btn btn-secondary" title="Messages">✉️</button>
            </div>
            <div class="user-dropdown" id="user-dropdown">
                <button class="user-menu-btn" id="user-menu-toggle">
                    <span>GU</span>
                    <span>▼</span>
                </button>
                <div class="user-dropdown-menu">
                    <a href="dcf_profile_dashboard.html" class="dropdown-item">Dashboard</a>
                    <a href="dcf_member_profile.html" class="dropdown-item">My Profile</a>
                    <a href="dcf_projects.html" class="dropdown-item">My Projects</a>
                    <a href="dcf_messages.html" class="dropdown-item">Messages</a>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item" onclick="window.dcfNavbar.logout()">LOGOUT</button>
                </div>
            </div>
        `;
    }

    // Attach all event listeners
    attachEventListeners() {
        // User dropdown toggle for logged-in users
        const userDropdown = document.getElementById('user-dropdown');
        const userToggle = document.getElementById('user-menu-toggle');
        
        if (userToggle && userDropdown) {
            userToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (event) => {
                if (!userDropdown.contains(event.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }

        // Search functionality
        const searchInput = document.getElementById('dcf-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
            searchInput.addEventListener('focus', this.showSearchSuggestions.bind(this));
        }

        // Mobile menu toggle
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                const isVisible = mobileMenu.style.display !== 'none';
                mobileMenu.style.display = isVisible ? 'none' : 'block';
            });
        }

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 968) {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) mobileMenu.style.display = 'none';
            }
        });
    }

    // Highlight current page in navigation
    highlightCurrentPage() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const page = item.getAttribute('data-page');
            if (page && this.currentPage.includes(page)) {
                item.classList.add('active');
            }
        });
    }

    // Handle search input
    handleSearch(event) {
        const query = event.target.value.trim();
        if (query.length < 2) {
            this.hideSearchSuggestions();
            return;
        }

        const suggestions = this.getSearchSuggestions(query);
        this.displaySearchSuggestions(suggestions);
    }

    // Get search suggestions
    getSearchSuggestions(query) {
        // Search data based on your actual pages
        const allItems = [
            { title: 'About DCF Hungary', type: 'page', url: 'dcf_about.html' },
            { title: 'Contact Us', type: 'page', url: 'dcf_contact.html' },
            { title: 'Events Calendar', type: 'events', url: 'dcf_events_calendar.html' },
            { title: 'Event Details', type: 'events', url: 'dcf_event_details.html' },
            { title: 'Members Directory', type: 'community', url: 'dcf_members_directory.html' },
            { title: 'Profile Dashboard', type: 'member', url: 'dcf_profile_dashboard.html' },
            { title: 'Learning Materials', type: 'resources', url: 'dcf_learning_materials.html' },
            { title: 'Login', type: 'account', url: 'dcf_login_page.html' },
            { title: 'Sign Up', type: 'account', url: 'dcf_profile_signup.html' }
        ];

        return allItems.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    // Display search suggestions
    displaySearchSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;

        if (suggestions.length === 0) {
            suggestionsContainer.innerHTML = '<div style="padding: 12px; color: #6b7280;">No results found</div>';
        } else {
            suggestionsContainer.innerHTML = suggestions.map(item => `
                <a href="${item.url}" class="search-suggestion-item" style="display: block; padding: 12px; text-decoration: none; color: #374151; border-bottom: 1px solid #f3f4f6;">
                    <div style="font-weight: 500;">${item.title}</div>
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">${item.type}</div>
                </a>
            `).join('');
        }

        suggestionsContainer.style.display = 'block';
    }

    // Show search suggestions
    showSearchSuggestions() {
        const searchInput = document.getElementById('dcf-search');
        if (searchInput && searchInput.value.trim().length >= 2) {
            this.handleSearch({ target: searchInput });
        }
    }

    // Hide search suggestions
    hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Logout function - UPDATED to clear your actual login data
    logout() {
        // Clear all your actual auth tokens and session data
        localStorage.removeItem('dcf_user_logged_in');
        localStorage.removeItem('dcf_github_session');
        localStorage.removeItem('dcf_user_name');
        localStorage.removeItem('dcf_user_email');
        localStorage.removeItem('dcf_auth_provider');
        localStorage.removeItem('isWhitelist');
        localStorage.removeItem('debug');
        
        // Clear backup auth data
        localStorage.removeItem('dcf_auth_token');
        sessionStorage.removeItem('dcf_user_session');
        
        // Clear cookies
        document.cookie = 'dcf_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'github_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        console.log('User logged out, clearing all DCF session data');
        
        // Redirect to homepage
        window.location.href = 'index.html';
    }

    // Update login status dynamically
    updateLoginStatus(isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        
        // Regenerate right navigation
        const rightNav = document.querySelector('.navbar-right');
        if (rightNav) {
            rightNav.innerHTML = isLoggedIn ? this.getLoggedInRightNav() : this.getLoggedOutRightNav();
            this.attachEventListeners(); // Reattach listeners
        }
        
        console.log('Login status updated to:', isLoggedIn);
    }

    // Rollback function - restore old navbar if needed
    rollback() {
        // Remove our universal navbar
        const ourNavbar = document.getElementById('dcf-navbar');
        if (ourNavbar) {
            ourNavbar.remove();
        }
        
        // Remove the CSS that hides old navbars
        const hideCSS = document.getElementById('dcf-hide-old-navbars');
        if (hideCSS) {
            hideCSS.remove();
        }
        
        console.log('DCF Universal Navbar removed. Old navbar should now be visible.');
        
        // Clean up window references
        delete window.dcfNavbar;
        delete window.dcfNavbarRollback;
    }
}

// SMART PROJECTS NAVIGATION FUNCTION - GLOBAL FUNCTION
function dcfNavigateToProjects(event) {
    // SMART EVENTS NAVIGATION FUNCTION - ADD THIS
function dcfNavigateToEvents(event) {
    event.preventDefault();
    
    // Check login status using same logic as navbar class
    const loginIndicators = [
        localStorage.getItem('dcf_user_logged_in'),
        localStorage.getItem('dcf_github_session'),
        localStorage.getItem('dcf_user_name'),
        localStorage.getItem('dcf_auth_provider')
    ];
    
    const isLoggedIn = loginIndicators.some(indicator => !!indicator);
    
    console.log('Smart Events Navigation:', {
        isLoggedIn: isLoggedIn,
        redirectingTo: isLoggedIn ? 'dcf_events.html' : 'dcf_events_public.html'
    });
    
    if (isLoggedIn) {
        window.location.href = 'dcf_events.html';  // Personal events dashboard
    } else {
        window.location.href = 'dcf_events_public.html';  // Public events showcase
    }
}// SMART EVENTS NAVIGATION FUNCTION
function dcfNavigateToEvents(event) {
    event.preventDefault();
    
    const loginIndicators = [
        localStorage.getItem('dcf_user_logged_in'),
        localStorage.getItem('dcf_github_session'),
        localStorage.getItem('dcf_user_name'),
        localStorage.getItem('dcf_auth_provider')
    ];
    
    const isLoggedIn = loginIndicators.some(indicator => !!indicator);
    
    if (isLoggedIn) {
        window.location.href = 'dcf_events.html';
    } else {
        window.location.href = 'dcf_events_public.html';
    }
}
    event.preventDefault();
    
    // Check login status using same logic as navbar class
    const loginIndicators = [
        localStorage.getItem('dcf_user_logged_in'),
        localStorage.getItem('dcf_github_session'),
        localStorage.getItem('dcf_user_name'),
        localStorage.getItem('dcf_auth_provider')
    ];
    
    const isLoggedIn = loginIndicators.some(indicator => !!indicator);
    
    console.log('Smart Projects Navigation:', {
        isLoggedIn: isLoggedIn,
        redirectingTo: isLoggedIn ? 'dcf_projects.html' : 'dcf_projects_public.html'
    });
    
    if (isLoggedIn) {
        window.location.href = 'dcf_projects.html';  // Personal project dashboard
    } else {
        window.location.href = 'dcf_projects_public.html';  // Public projects showcase
    }
}

// Initialize the universal navbar when DOM is loaded (prevent duplicates)
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a login/auth page that should NOT have navbar
    const isAuthPage = window.location.href.includes('login') || 
                      window.location.href.includes('auth') ||
                      window.location.href.includes('code=') ||
                      window.location.href.includes('token=') ||
                      window.location.href.includes('access_token=') ||
                      document.querySelector('.github-auth') ||
                      document.querySelector('.auth-container') ||
                      document.body.classList.contains('auth-page');
    
    // If it's an auth page, don't create navbar at all
    if (isAuthPage) {
        console.log('Auth page detected - skipping navbar creation');
        return;
    }
    
    // Only create if it doesn't already exist AND not on auth page
    if (!window.dcfNavbar && !document.getElementById('dcf-navbar')) {
        window.dcfNavbar = new DCFUniversalNavbar();
        console.log('DCF Universal Navbar initialized on non-auth page');
    }
});

// Close search suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-search')) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DCFUniversalNavbar;
}
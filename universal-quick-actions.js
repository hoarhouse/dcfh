// universal-quick-actions.js - Context-Sensitive Quick Actions Box

// Initialize Quick Actions based on current page
document.addEventListener('DOMContentLoaded', function() {
    initializeQuickActions();
});

function initializeQuickActions() {
    const currentPage = getCurrentPageType();
    const quickActionsContainer = document.querySelector('.sidebar .card:first-child');
    
    if (!quickActionsContainer) return;
    
    // Update Quick Actions based on page context
    updateQuickActions(currentPage, quickActionsContainer);
}

function getCurrentPageType() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop();
    
    // Projects Pages
    if (filename.includes('projects_home') || filename.includes('project_detail')) {
        return 'projects';
    }
    if (filename.includes('create_project')) {
        return 'create_project';
    }
    if (filename === 'dcf_projects.html') {
        return 'my_projects';
    }
    
    // Events Pages
    if (filename.includes('events_calendar') || filename.includes('event_details')) {
        return 'events';
    }
    if (filename.includes('create_event')) {
        return 'create_event';
    }
    if (filename === 'dcf_events.html') {
        return 'my_events';
    }
    
    // Members Pages
    if (filename.includes('members_directory') || filename.includes('member_view')) {
        return 'members';
    }
    
    // Resources Pages
    if (filename.includes('resources_library') || filename.includes('resource_detail')) {
        return 'resources';
    }
    if (filename.includes('resource_upload')) {
        return 'upload_resource';
    }
    
    // Home/Feed Page
    if (filename.includes('member_home')) {
        return 'home_feed';
    }
    
    // Default fallback
    return 'default';
}

function updateQuickActions(pageType, container) {
    const title = container.querySelector('.card-title');
    const actionsDiv = container.querySelector('div[style*="flex-direction: column"]');
    
    if (!title || !actionsDiv) return;
    
    // Keep the title as "Quick Actions"
    title.textContent = 'Quick Actions';
    
    // Generate context-sensitive actions
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
            
        case 'create_project':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_projects_home.html'">
                    🔍 Browse Projects
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects.html'">
                    📁 My Projects
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_members_directory.html'">
                    👥 Find Collaborators
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_project_analytics.html'">
                    📊 Project Analytics
                </button>
            `;
            
        case 'my_projects':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_project.html'">
                    ➕ Create New Project
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects_home.html'">
                    🔍 Browse All Projects
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_project_analytics.html'">
                    📊 View Analytics
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_members_directory.html'">
                    👥 Find Team Members
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
            
        case 'create_event':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_events_calendar.html'">
                    📅 Browse Events
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_events.html'">
                    📋 My Events
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_members_directory.html'">
                    👥 Invite Members
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_resources_library.html'">
                    📚 Event Resources
                </button>
            `;
            
        case 'my_events':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_create_event.html'">
                    ➕ Create New Event
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_events_calendar.html'">
                    📅 Browse All Events
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_personal_analytics.html'">
                    📊 Event Analytics
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_members_directory.html'">
                    👥 Find Attendees
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
                <button class="btn btn-secondary" onclick="alert('My Network page coming soon!')">
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
            
        case 'upload_resource':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_resources_library.html'">
                    📚 Browse Library
                </button>
                <button class="btn btn-secondary" onclick="viewMyContributions()">
                    📝 My Contributions
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects_home.html'">
                    📁 Related Projects
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_members_directory.html'">
                    👥 Find Reviewers
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

// Helper functions for Quick Actions
function focusSearchProjects() {
    const searchInput = document.querySelector('#projectSearch, .search-input');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = 'dcf_projects_home.html';
    }
}

function exploreJoinableProjects() {
    // Focus on projects that are recruiting
    if (window.location.pathname.includes('projects_home')) {
        const recruitingBtn = document.querySelector('.category-btn[data-category="recruiting"]');
        if (recruitingBtn) {
            recruitingBtn.click();
        }
    } else {
        window.location.href = 'dcf_projects_home.html?filter=recruiting';
    }
}

function focusSearchEvents() {
    const searchInput = document.querySelector('#eventSearch, .search-input');
    if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.location.href = 'dcf_events_calendar.html';
    }
}

function exploreUpcomingEvents() {
    if (window.location.pathname.includes('events_calendar')) {
        // Focus on upcoming events section
        const upcomingSection = document.querySelector('.upcoming-events, .events-grid');
        if (upcomingSection) {
            upcomingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        window.location.href = 'dcf_events_calendar.html';
    }
}

function focusSearchMembers() {
    const searchInput = document.querySelector('#memberSearch, .search-input');
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
    const searchInput = document.querySelector('#resourceSearch, .search-input');
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
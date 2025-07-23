// universal-quick-actions.js - Corrected to work with new HTML structure

// Initialize Quick Actions based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is fully loaded
    setTimeout(initializeQuickActions, 100);
});

function initializeQuickActions() {
    const currentPage = getCurrentPageType();
    const quickActionsContainer = findQuickActionsContainer();
    
    if (!quickActionsContainer) {
        console.log('Quick Actions container not found');
        return;
    }
    
    // Update Quick Actions based on page context
    updateQuickActions(currentPage, quickActionsContainer);
}

function findQuickActionsContainer() {
    // Look for the Quick Actions card in the sidebar
    const quickActionsCards = document.querySelectorAll('.card');
    
    for (let card of quickActionsCards) {
        const title = card.querySelector('.card-title');
        if (title && title.textContent.includes('Quick Actions')) {
            return card;
        }
    }
    
    // Fallback: look for first card in sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        return sidebar.querySelector('.card');
    }
    
    return null;
}

function getCurrentPageType() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop();
    
    console.log('Current page:', filename); // Debug log
    
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
    if (filename.includes('project_manage')) {
        return 'manage_project';
    }
    if (filename.includes('project_analytics')) {
        return 'project_analytics';
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
    let actionsDiv = container.querySelector('div[style*="flex-direction: column"]');
    
    // If no actions div found, look for any div with buttons
    if (!actionsDiv) {
        actionsDiv = container.querySelector('div');
        if (actionsDiv && !actionsDiv.querySelector('button, .btn')) {
            // Create actions div if it doesn't exist
            actionsDiv = document.createElement('div');
            actionsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
            container.appendChild(actionsDiv);
        }
    }
    
    if (!title || !actionsDiv) {
        console.log('Quick Actions structure not found');
        return;
    }
    
    // Keep the title as "Quick Actions"
    title.textContent = 'Quick Actions';
    
    // Generate context-sensitive actions
    const actionsHTML = getQuickActionsHTML(pageType);
    actionsDiv.innerHTML = actionsHTML;
    
    console.log('Updated Quick Actions for page type:', pageType); // Debug log
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

        case 'manage_project':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_project_analytics.html'">
                    📊 View Analytics
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects_home.html'">
                    🔍 Browse Projects
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_members_directory.html'">
                    👥 Manage Team
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects.html'">
                    📁 My Projects
                </button>
            `;

        case 'project_analytics':
            return `
                <button class="btn btn-primary" onclick="window.location.href='dcf_project_manage.html'">
                    ⚙️ Manage Project
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects.html'">
                    📁 My Projects
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_projects_home.html'">
                    🔍 Browse Projects
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='dcf_personal_analytics.html'">
                    📊 Personal Analytics
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
    const searchInput = document.querySelector('#projectSearch, .search-input, input[placeholder*="Search projects"], input[placeholder*="search projects"]');
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
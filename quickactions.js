// Quick Actions Configuration for DCF Hungary
// Edit this file to modify quick actions for any page

const quickActionsConfig = {
    // Projects Pages
    'dcf_projects_home.html': [
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '📁', text: 'My Projects', action: 'dcf_projects.html', type: 'secondary' },
        { icon: '📊', text: 'View Analytics', action: 'dcf_analytics_dashboard.html', type: 'secondary' },
        { icon: '📅', text: 'Project Calendar', action: 'dcf_events_calendar.html', type: 'secondary' },
        { icon: '💬', text: 'Discussion Forum', action: 'dcf_member_home.html', type: 'secondary' }
    ],

    'dcf_projects.html': [
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '📊', text: 'Analytics', action: 'dcf_analytics_dashboard.html', type: 'secondary' },
        { icon: '📅', text: 'Events Calendar', action: 'dcf_events_calendar.html', type: 'secondary' },
        { icon: '💬', text: 'Discussion Board', action: 'dcf_member_home.html', type: 'secondary' }
    ],

    'dcf_create_project.html': [
        { icon: '📁', text: 'My Projects', action: 'dcf_projects.html', type: 'secondary' },
        { icon: '🌍', text: 'All Projects', action: 'dcf_projects_home.html', type: 'secondary' },
        { icon: '📊', text: 'Analytics', action: 'dcf_analytics_dashboard.html', type: 'secondary' }
    ],

    'dcf_project_detail.html': [
        { icon: '✏️', text: 'Edit Project', action: 'javascript:editProject()', type: 'primary' },
        { icon: '👥', text: 'Manage Team', action: 'javascript:manageTeam()', type: 'secondary' },
        { icon: '📊', text: 'Project Analytics', action: 'javascript:viewProjectAnalytics()', type: 'secondary' },
        { icon: '📁', text: 'All Projects', action: 'dcf_projects_home.html', type: 'secondary' }
    ],

    // Events Pages
    'dcf_events_home.html': [
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'primary' },
        { icon: '📅', text: 'My Events', action: 'dcf_events.html', type: 'secondary' },
        { icon: '📊', text: 'Event Analytics', action: 'dcf_event_analytics.html', type: 'secondary' },
        { icon: '🎯', text: 'Browse Categories', action: 'javascript:filterEvents()', type: 'secondary' },
        { icon: '💬', text: 'Event Discussions', action: 'dcf_member_home.html', type: 'secondary' }
    ],

    'dcf_events.html': [
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'primary' },
        { icon: '📈', text: 'My Event Analytics', action: 'dcf_event_analytics.html', type: 'secondary' },
        { icon: '📋', text: 'Registration Management', action: 'javascript:manageRegistrations()', type: 'secondary' },
        { icon: '📅', text: 'Calendar View', action: 'dcf_events_calendar.html', type: 'secondary' }
    ],

    'dcf_create_event.html': [
        { icon: '📅', text: 'My Events', action: 'dcf_events.html', type: 'secondary' },
        { icon: '🌍', text: 'All Events', action: 'dcf_events_home.html', type: 'secondary' },
        { icon: '📊', text: 'Event Analytics', action: 'dcf_event_analytics.html', type: 'secondary' }
    ],

    'dcf_event_creation.html': [
        { icon: '📅', text: 'My Events', action: 'dcf_events.html', type: 'secondary' },
        { icon: '🌍', text: 'All Events', action: 'dcf_events_home.html', type: 'secondary' },
        { icon: '📊', text: 'Event Analytics', action: 'dcf_event_analytics.html', type: 'secondary' }
    ],

    // Admin Pages
    'dcf_admin_dashboard.html': [
        { icon: '👥', text: 'Manage Members', action: 'dcf_admin_members.html', type: 'primary' },
        { icon: '📊', text: 'Site Analytics', action: 'dcf_admin_analytics.html', type: 'secondary' },
        { icon: '⚙️', text: 'Site Settings', action: 'dcf_admin_settings.html', type: 'secondary' },
        { icon: '📧', text: 'Send Announcements', action: 'dcf_admin_messaging.html', type: 'secondary' },
        { icon: '🔐', text: 'Security Logs', action: 'dcf_admin_security.html', type: 'secondary' }
    ],

    // Member Pages
    'dcf_member_home.html': [
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'primary' },
        { icon: '👤', text: 'Edit Profile', action: 'dcf_member_profile.html', type: 'secondary' },
        { icon: '💬', text: 'Messages', action: 'dcf_messages.html', type: 'secondary' }
    ],

    'dcf_member_profile.html': [
        { icon: '✏️', text: 'Edit Profile', action: 'javascript:editProfile()', type: 'primary' },
        { icon: '📊', text: 'My Analytics', action: 'dcf_profile_dashboard.html', type: 'secondary' },
        { icon: '🏠', text: 'Dashboard', action: 'dcf_member_home.html', type: 'secondary' },
        { icon: '⚙️', text: 'Settings', action: 'dcf_settings.html', type: 'secondary' }
    ],

    'dcf_profile_dashboard.html': [
        { icon: '👤', text: 'View Profile', action: 'dcf_member_profile.html', type: 'secondary' },
        { icon: '📁', text: 'My Projects', action: 'dcf_projects.html', type: 'secondary' },
        { icon: '📅', text: 'My Events', action: 'dcf_events.html', type: 'secondary' },
        { icon: '🏠', text: 'Dashboard', action: 'dcf_member_home.html', type: 'secondary' }
    ],

    // Resource Pages
    'dcf_resources_library.html': [
        { icon: '📄', text: 'Upload Resource', action: 'dcf_upload_resource.html', type: 'primary' },
        { icon: '📚', text: 'Learning Materials', action: 'dcf_learning_materials.html', type: 'secondary' },
        { icon: '💬', text: 'Discussion Board', action: 'dcf_discussion_board.html', type: 'secondary' },
        { icon: '🔍', text: 'Advanced Search', action: 'javascript:advancedSearch()', type: 'secondary' }
    ],

    // Messages & Communication
    'dcf_messages.html': [
        { icon: '✉️', text: 'Compose Message', action: 'javascript:composeMessage()', type: 'primary' },
        { icon: '👥', text: 'Group Messages', action: 'javascript:viewGroupMessages()', type: 'secondary' },
        { icon: '🔔', text: 'Notifications', action: 'dcf_notifications.html', type: 'secondary' },
        { icon: '⚙️', text: 'Message Settings', action: 'dcf_message_settings.html', type: 'secondary' }
    ],

    // Default actions for any page not specifically configured
    'default': [
        { icon: '🏠', text: 'Dashboard', action: 'dcf_member_home.html', type: 'secondary' },
        { icon: '🚀', text: 'Create Project', action: 'dcf_create_project.html', type: 'primary' },
        { icon: '🎉', text: 'Create Event', action: 'dcf_create_event.html', type: 'secondary' },
        { icon: '💬', text: 'Messages', action: 'dcf_messages.html', type: 'secondary' }
    ]
};
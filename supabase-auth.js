// supabase-auth.js - Master Authentication Utilities
// Replaces all localStorage-based authentication with proper Supabase Auth

// Use existing Supabase instance to avoid conflicts
window.authSupabase = window.masterSupabase || window.supabase.createClient(
    'https://atzommnkkwzgbktuzjti.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks'
);

// Global user state
window.dcfUser = {
    isLoggedIn: false,
    profile: null,
    session: null
};

/**
 * Initialize auth system - call this on every page
 */
async function initializeAuth() {
    try {
        // Get current session
        const { data: { session }, error } = await window.authSupabase.auth.getSession();
        
        if (error) {
            console.error('Auth session error:', error);
            return false;
        }

        if (session?.user) {
            // User is logged in, get their profile
            const profile = await getUserProfile(session.user.id);
            if (profile) {
                window.dcfUser = {
                    isLoggedIn: true,
                    profile: profile,
                    session: session
                };
                return true;
            }
        }
        
        // User not logged in
        window.dcfUser = {
            isLoggedIn: false,
            profile: null,
            session: null
        };
        return false;
        
    } catch (error) {
        console.error('Auth initialization error:', error);
        return false;
    }
}

/**
 * Get user profile from database
 */
async function getUserProfile(userId) {
    try {
        const { data, error } = await window.authSupabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (error) {
            console.error('Profile fetch error:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Get profile error:', error);
        return null;
    }
}

/**
 * Check if user is logged in (replaces localStorage checks)
 */
function isUserLoggedIn() {
    return window.dcfUser.isLoggedIn;
}

/**
 * Get current user data (replaces localStorage.getItem calls)
 */
function getCurrentUser() {
    if (!window.dcfUser.isLoggedIn) return null;
    
    const profile = window.dcfUser.profile;
    return {
        id: profile.id,
        email: profile.email,
        name: profile.name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        title: profile.title,
        organization: profile.organization,
        location: profile.location,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        role: profile.role,
        // Add any other fields you need
        authProvider: 'supabase'
    };
}

/**
 * Get user email (replaces localStorage.getItem('dcf_user_email'))
 */
function getUserEmail() {
    return getCurrentUser()?.email || null;
}

/**
 * Get user name (replaces localStorage.getItem('dcf_user_name'))
 */
function getUserName() {
    return getCurrentUser()?.name || null;
}

/**
 * Get user ID (replaces localStorage.getItem('dcf_user_id'))
 */
function getUserId() {
    return getCurrentUser()?.id || null;
}

/**
 * Sign out user (replaces localStorage.clear())
 */
async function signOutUser() {
    try {
        const { error } = await window.authSupabase.auth.signOut();
        if (error) throw error;
        
        // Clear global state
        window.dcfUser = {
            isLoggedIn: false,
            profile: null,
            session: null
        };
        
        // Redirect to login
        window.location.href = 'dcf_login_page.html';
        
    } catch (error) {
        console.error('Sign out error:', error);
        // Force redirect even if sign out failed
        window.location.href = 'dcf_login_page.html';
    }
}

/**
 * Redirect if not logged in (replaces localStorage checks)
 */
async function requireAuth() {
    try {
        // Check current session
        const { data: { session } } = await window.authSupabase.auth.getSession();
        if (session?.user) {
            return true; // User is logged in
        }
        
        // Not logged in - redirect
        window.location.href = 'dcf_login_page.html';
        return false;
    } catch (error) {
        console.error('Auth check error:', error);
        return true; // Allow access on error to prevent lockout
    }
}

/**
 * Update user profile in dropdown/header
 */
function updateUserInterface() {
    if (!window.dcfUser.isLoggedIn) return;
    
    const user = getCurrentUser();
    
    // Update avatar
    const avatars = document.querySelectorAll('#userAvatar, .dropdown-avatar');
    const initials = generateInitials(user.name);
    avatars.forEach(avatar => {
        if (user.avatar_url) {
            avatar.style.backgroundImage = `url(${user.avatar_url})`;
            avatar.textContent = '';
        } else {
            avatar.textContent = initials;
        }
    });
    
    // Update dropdown info
    const nameElement = document.getElementById('dropdownUserName');
    const emailElement = document.getElementById('dropdownUserEmail');
    
    if (nameElement) nameElement.textContent = user.name;
    if (emailElement) nameElement.textContent = user.email;
}

/**
 * Generate initials from name
 */
function generateInitials(name) {
    if (!name) return 'DC';
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

/**
 * Listen for auth state changes
 */
window.authSupabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session);
    
    if (event === 'SIGNED_OUT' || !session) {
        window.dcfUser = {
            isLoggedIn: false,
            profile: null,
            session: null
        };
    } else if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
            window.dcfUser = {
                isLoggedIn: true,
                profile: profile,
                session: session
            };
            updateUserInterface();
        }
    }
});

// Don't auto-initialize on login page
if (!window.location.pathname.includes('login')) {
    document.addEventListener('DOMContentLoaded', function() {
        initializeAuth().then(isLoggedIn => {
            if (isLoggedIn) {
                updateUserInterface();
            }
        });
    });
}

// Export functions for global use
window.dcfAuth = {
    initializeAuth,
    isUserLoggedIn,
    getCurrentUser,
    getUserEmail,
    getUserName,
    getUserId,
    signOutUser,
    requireAuth,
    updateUserInterface
};
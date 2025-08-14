// supabase-auth.js - Master Authentication Utilities
// Replaces all localStorage-based authentication with proper Supabase Auth

// Create ONE Supabase client and use it everywhere
if (!window.authSupabase) {
    window.authSupabase = window.supabase.createClient(
        'https://atzommnkkwzgbktuzjti.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcmNncmNxbWhrdGp5eW5ybml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4OTAwOTYsImV4cCI6MjA0OTQ2NjA5Nn0.VDOoN8LXyNR9NTFKvqKFHZ5EHDJRq4smEJLAHADxEP8'
    );

}

// Add the missing getSupabaseClient function that event pages are calling
function getSupabaseClient() {
    if (!window.authSupabase) {
        console.error('❌ Supabase client not initialized');
        return null;
    }
    console.log('✅ getSupabaseClient() returning client');
    return window.authSupabase;
}
window.getSupabaseClient = getSupabaseClient;

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
            const profile = await getUserProfile(session.user.id, session.user.email);
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
async function getUserProfile(userId, userEmail) {
    try {
        // Use direct fetch since Supabase client is broken
        const response = await fetch(`https://atzommnkkwzgbktuzjti.supabase.co/rest/v1/user_profiles?email=eq.${userEmail}&select=*`, {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcmNncmNxbWhrdGp5eW5ybml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4OTAwOTYsImV4cCI6MjA0OTQ2NjA5Nn0.VDOoN8LXyNR9NTFKvqKFHZ5EHDJRq4smEJLAHADxEP8',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcmNncmNxbWhrdGp5eW5ybml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4OTAwOTYsImV4cCI6MjA0OTQ2NjA5Nn0.VDOoN8LXyNR9NTFKvqKFHZ5EHDJRq4smEJLAHADxEP8'
            }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return data[0];
        }
        
        return null;
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
 * Handle session refresh and timeout
 */
let sessionRefreshTimer = null;

function setupSessionManagement() {
    // Clear any existing timer
    if (sessionRefreshTimer) {
        clearTimeout(sessionRefreshTimer);
    }
    
    // Set up automatic session refresh
    // Refresh token 5 minutes before expiry (Supabase default is 1 hour)
    const refreshInterval = 55 * 60 * 1000; // 55 minutes
    
    sessionRefreshTimer = setInterval(async () => {
        try {
            const { data: { session }, error } = await window.authSupabase.auth.getSession();
            
            if (!session) {
                console.log('No session found during refresh check');
                clearInterval(sessionRefreshTimer);
                return;
            }
            
            // Check if token will expire soon (within 10 minutes)
            const expiresAt = session.expires_at * 1000; // Convert to milliseconds
            const now = Date.now();
            const timeUntilExpiry = expiresAt - now;
            
            if (timeUntilExpiry < 10 * 60 * 1000) { // Less than 10 minutes
                console.log('Refreshing session token...');
                const { data: refreshData, error: refreshError } = await window.authSupabase.auth.refreshSession();
                
                if (refreshError) {
                    console.error('Session refresh failed:', refreshError);
                    // Force logout on refresh failure
                    await signOutUser();
                } else {
                    console.log('Session refreshed successfully');
                }
            }
        } catch (error) {
            console.error('Session management error:', error);
        }
    }, refreshInterval);
}

/**
 * Clear session management timers
 */
function clearSessionManagement() {
    if (sessionRefreshTimer) {
        clearInterval(sessionRefreshTimer);
        sessionRefreshTimer = null;
    }
}

/**
 * Redirect if not logged in (replaces localStorage checks)
 */
async function requireAuth() {
    // TEMPORARILY DISABLED FOR TESTING
    return true;
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
        // Clear session management on logout
        clearSessionManagement();
    } else if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getUserProfile(session.user.id, session.user.email);
        console.log('Profile found:', profile);
        
        // ALWAYS set dcfUser even if no profile found
        window.dcfUser = {
            isLoggedIn: true,
            profile: profile || {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email,
                username: session.user.email.split('@')[0]
            },
            session: session
        };
        console.log('Updated dcfUser:', window.dcfUser);
        updateUserInterface();
        // Setup session management on login
        setupSessionManagement();
    }
});

// Initialize auth on ALL pages including login
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth().then(isLoggedIn => {
        if (isLoggedIn) {
            updateUserInterface();
        }
    });
});

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
    updateUserInterface,
    setupSessionManagement,
    clearSessionManagement
};
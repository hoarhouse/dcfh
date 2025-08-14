// supabase-auth.js - Master Authentication Utilities
// Replaces all localStorage-based authentication with proper Supabase Auth

// EMERGENCY: Reinitialize Supabase client
const SUPABASE_URL = 'https://atzommnkkwzgbktuzjti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';

// EMERGENCY: Create Supabase client immediately
if (typeof window !== 'undefined' && typeof supabase !== 'undefined') {
    window.authSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ EMERGENCY: Supabase client restored');
} else if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    window.authSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ EMERGENCY: Supabase client restored via window.supabase');
} else {
    console.error('❌ EMERGENCY: Could not create Supabase client - supabase library not found');
}

/**
 * DISABLED: Auth cleanup completely disabled to preserve user session
 * Previous cleanup was breaking user authentication
 */

// CLEANUP COMPLETELY DISABLED - DO NOT CLEAR ANY AUTH DATA
console.log('🛑 AUTH CLEANUP DISABLED: Preserving all user session data');

/**
 * EMERGENCY: Force restore user session and profile data
 */
async function emergencyRestoreSession() {
    console.log('🚨 EMERGENCY: Attempting to restore user session...');
    
    try {
        // Get current Supabase session
        const { data: { session }, error } = await window.authSupabase.auth.getSession();
        
        if (error) {
            console.error('🚨 EMERGENCY: Session error:', error);
            return false;
        }
        
        if (session && session.user) {
            console.log('🚨 EMERGENCY: Found active session:', session.user);
            
            // Force restore user data immediately
            window.dcfUser = {
                isLoggedIn: true,
                profile: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || 
                          'Chris Hoar',
                    username: session.user.email?.split('@')[0] || 'user',
                    avatar_url: session.user.user_metadata?.avatar_url || 
                               session.user.user_metadata?.picture
                },
                session: session
            };
            
            console.log('🚨 EMERGENCY: Restored dcfUser:', window.dcfUser);
            
            // Update UI immediately
            if (typeof updateUserInterface === 'function') {
                updateUserInterface();
                console.log('🚨 EMERGENCY: Updated user interface');
            }
            
            return true;
        } else {
            console.log('🚨 EMERGENCY: No active session found');
            return false;
        }
        
    } catch (error) {
        console.error('🚨 EMERGENCY: Session restore failed:', error);
        return false;
    }
}

// Run emergency restore immediately
emergencyRestoreSession();

// Create ONE Supabase client and use it everywhere
if (!window.authSupabase) {
    window.authSupabase = window.supabase.createClient(
        'https://atzommnkkwzgbktuzjti.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks'
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
        console.log('🔍 DEBUG: Initializing auth system...');
        
        // Get current session
        const { data: { session }, error } = await window.authSupabase.auth.getSession();
        
        console.log('🔍 DEBUG: Session from Supabase:', session);
        
        if (error) {
            console.error('Auth session error:', error);
            return false;
        }

        if (session?.user) {
            console.log('🔍 DEBUG: User found in session:', session.user);
            
            // User is logged in, get their profile
            const profile = await getUserProfile(session.user.id, session.user.email);
            console.log('🔍 DEBUG: Profile from database:', profile);
            
            // ALWAYS set dcfUser even if no database profile found
            window.dcfUser = {
                isLoggedIn: true,
                profile: profile || {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Chris Hoar',
                    username: session.user.email.split('@')[0],
                    avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
                },
                session: session
            };
            
            console.log('🔍 DEBUG: Set dcfUser to:', window.dcfUser);
            return true;
        }
        
        // User not logged in
        console.log('🔍 DEBUG: No user session found');
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
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks'
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
    console.log('🔍 DEBUG: getCurrentUser called - dcfUser state:', window.dcfUser);
    
    if (!window.dcfUser || !window.dcfUser.isLoggedIn) {
        console.log('🔍 DEBUG: No logged in user found in dcfUser');
        return null;
    }
    
    const profile = window.dcfUser.profile;
    const session = window.dcfUser.session;
    
    console.log('🔍 DEBUG: Profile data:', profile);
    console.log('🔍 DEBUG: Session data:', session);
    
    // Extract user data from session metadata for auth providers like GitHub/Google
    const userMetadata = session?.user?.user_metadata || {};
    
    const userData = {
        id: profile.id,
        email: profile.email,
        name: profile.name || userMetadata.full_name || userMetadata.name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Chris Hoar',
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        title: profile.title,
        organization: profile.organization,
        location: profile.location,
        bio: profile.bio,
        avatar_url: profile.avatar_url || userMetadata.avatar_url || userMetadata.picture,
        role: profile.role,
        // Add any other fields you need
        authProvider: 'supabase'
    };
    
    console.log('🔍 DEBUG: getCurrentUser returning:', userData);
    return userData;
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
    if (emailElement) emailElement.textContent = user.email;
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
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Chris Hoar',
                username: session.user.email.split('@')[0],
                avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
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
    console.log('🔍 DEBUG: DOMContentLoaded - starting emergency auth restoration');
    
    // Run emergency restore first
    setTimeout(() => {
        emergencyRestoreSession().then(restored => {
            console.log('🚨 EMERGENCY: Session restore result:', restored);
            
            // Then run normal initialization
            initializeAuth().then(isLoggedIn => {
                console.log('🔍 DEBUG: Auth initialization complete, logged in:', isLoggedIn);
                if (isLoggedIn) {
                    updateUserInterface();
                    console.log('🔍 DEBUG: User interface updated');
                }
            });
        });
    }, 100);
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
    clearSessionManagement,
    emergencyRestoreSession  // Emergency restore function
};
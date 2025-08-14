// Simple Working Authentication - Master-consolidated.js controls avatars
const SUPABASE_URL = 'https://atzommnkkwzgbktuzjti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';

// Create Supabase client
if (typeof window !== 'undefined' && window.supabase) {
    window.authSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Make getSupabaseClient available
function getSupabaseClient() {
    return window.authSupabase;
}
window.getSupabaseClient = getSupabaseClient;

// Global user state
window.dcfUser = {
    isLoggedIn: false,
    profile: null,
    session: null
};

// Simple auth initialization
async function initializeAuth() {
    if (!window.authSupabase) return false;
    
    try {
        const { data: { session } } = await window.authSupabase.auth.getSession();
        
        if (session?.user) {
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
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Auth error:', error);
        return false;
    }
}

// Get current user
function getCurrentUser() {
    if (!window.dcfUser?.isLoggedIn) return null;
    
    const profile = window.dcfUser.profile;
    return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        username: profile.username,
        avatar_url: profile.avatar_url
    };
}

// User check functions
function isUserLoggedIn() {
    return window.dcfUser?.isLoggedIn || false;
}

function getUserEmail() {
    return getCurrentUser()?.email || null;
}

function getUserName() {
    return getCurrentUser()?.name || null;
}

function getUserId() {
    return getCurrentUser()?.id || null;
}

// DO NOT UPDATE AVATARS - master-consolidated.js handles it
function updateUserInterface() {
    // Only update dropdown text, not avatars
    const user = getCurrentUser();
    if (!user) return;
    
    const nameEl = document.getElementById('dropdownUserName');
    const emailEl = document.getElementById('dropdownUserEmail');
    
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
}

// Sign out
async function signOutUser() {
    if (window.authSupabase) {
        await window.authSupabase.auth.signOut();
    }
    window.dcfUser = { isLoggedIn: false, profile: null, session: null };
    window.location.href = '/auth/dcf_login_page.html';
}

// Auth state listener
if (window.authSupabase) {
    window.authSupabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
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
            updateUserInterface();
        } else if (event === 'SIGNED_OUT') {
            window.dcfUser = { isLoggedIn: false, profile: null, session: null };
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    const loggedIn = await initializeAuth();
    if (loggedIn) {
        updateUserInterface();
    }
});

// Export functions
window.dcfAuth = {
    initializeAuth,
    getCurrentUser,
    isUserLoggedIn,
    getUserEmail,
    getUserName,
    getUserId,
    signOutUser,
    updateUserInterface
};
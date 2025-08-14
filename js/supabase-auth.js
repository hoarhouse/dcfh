// Simple Supabase Auth - Just Works
const SUPABASE_URL = 'https://atzommnkkwzgbktuzjti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';

// Create Supabase client
if (typeof window !== 'undefined' && window.supabase) {
    window.authSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client created');
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
            // Set user data immediately from session
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

// Simple getCurrentUser
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

// Simple user check functions
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

// Update UI
function updateUserInterface() {
    console.log('🔄 updateUserInterface called');
    const user = getCurrentUser();
    if (!user) {
        console.log('❌ No user found for UI update');
        return;
    }
    
    console.log('👤 Updating UI for user:', user.name, user.email);
    
    // Update avatar - preserve CSS styling
    const avatars = document.querySelectorAll('#userAvatar, .dropdown-avatar');
    avatars.forEach(avatar => {
        console.log('🎨 Updating avatar element:', avatar.id || avatar.className);
        
        if (user.avatar_url) {
            console.log('🖼️ Setting profile image:', user.avatar_url);
            avatar.style.backgroundImage = `url(${user.avatar_url})`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.textContent = '';
        } else {
            console.log('🔤 Setting initials:', getInitials(user.name));
            // Clear any background image but keep original gradient
            avatar.style.backgroundImage = '';
            avatar.textContent = getInitials(user.name);
        }
        
        // Ensure visibility is maintained for main avatar
        if (avatar.id === 'userAvatar') {
            // Force maintain the original styling for main avatar
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            avatar.style.width = '48px';
            avatar.style.height = '48px';
            avatar.style.borderRadius = '50%';
            avatar.style.color = 'white';
            avatar.style.fontWeight = '600';
            avatar.style.fontSize = '0.8rem';
            avatar.style.cursor = 'pointer';
            avatar.style.border = '2px solid rgba(255, 255, 255, 0.1)';
            avatar.style.boxSizing = 'border-box';
            avatar.style.overflow = 'hidden';
            avatar.style.flexShrink = '0';
            
            // Set background gradient if no profile image
            if (!user.avatar_url) {
                avatar.style.background = 'linear-gradient(135deg, #000, #333)';
            }
        }
        
        console.log('✅ Avatar updated, visible:', avatar.offsetWidth > 0, avatar.offsetHeight > 0);
    });
    
    // Update dropdown
    const nameEl = document.getElementById('dropdownUserName');
    const emailEl = document.getElementById('dropdownUserEmail');
    
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    
    console.log('✅ UI update completed');
}

function getInitials(name) {
    if (!name) return 'CH';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
        console.log('Auth state:', event);
        
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
    console.log('Initializing auth...');
    const loggedIn = await initializeAuth();
    if (loggedIn) {
        updateUserInterface();
        console.log('User logged in:', getCurrentUser());
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
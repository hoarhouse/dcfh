// FIXED FUNCTION - Add this after updateUserDropdownInfo()
async function loadPageAvatars() {
    console.log('Loading page avatars...');
    const userName = localStorage.getItem('dcf_user_name') || 'Dr. Sarah Johnson';
    const userEmail = localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org';
    
    const initials = generateInitials(userName);
    const avatarElement = document.getElementById('userAvatar');
    
    // FIRST - Set initials immediately to prevent "undefined" 
    if (avatarElement) {
        console.log('Setting initial fallback initials:', initials);
        avatarElement.textContent = initials;
        avatarElement.style.backgroundImage = '';
        avatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
        avatarElement.style.boxShadow = '0 0 10px #00ff00';
    }
    
    // Update dropdown avatar too
    const dropdownAvatarElement = document.querySelector('.dropdown-avatar');
    if (dropdownAvatarElement) {
        dropdownAvatarElement.textContent = initials;
        dropdownAvatarElement.style.backgroundImage = '';
        dropdownAvatarElement.style.background = 'linear-gradient(135deg, #00ff00, #32cd32)';
    }
    
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
    
    // Update avatar ONLY if we found a picture
    if (avatarElement && avatarUrl) {
        console.log('Avatar element classes:', avatarElement.className);
        console.log('Avatar element ID:', avatarElement.id);
        console.log('Setting avatar image on page load');
        // Clear background first, then set image
        avatarElement.style.background = '';
        avatarElement.style.backgroundImage = `url(${avatarUrl})`;
        avatarElement.style.backgroundSize = 'cover';
        avatarElement.style.backgroundPosition = 'center';
        avatarElement.style.boxShadow = '0 0 10px #00ff00';
        avatarElement.textContent = '';
        
        // Update dropdown avatar too
        if (dropdownAvatarElement) {
            dropdownAvatarElement.style.background = '';
            dropdownAvatarElement.style.backgroundImage = `url(${avatarUrl})`;
            dropdownAvatarElement.style.backgroundSize = 'cover';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.textContent = '';
        }
    }
    // If no avatar URL found, keep the initials that were already set
}
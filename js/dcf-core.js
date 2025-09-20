// =============================================================================
// DCF CORE UTILITIES
// Standalone utility functions with no external dependencies
// Based on original dcf-unified-system.js functions
// =============================================================================

console.log('🛠️ DCF Core utilities loading...');

// =============================================================================
// 1. SITE CONFIGURATION
// =============================================================================

const SUPABASE_URL = 'https://atzommnkkwzgbktuzjti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';

const SITE_CONFIG = {
    name: 'DCF Hungary',
    fullName: 'Domus Communis Foundation Hungary',
    baseUrl: 'https://hoarhouse.github.io/dcfh/',
    version: '2.0.0'
};

// =============================================================================
// 2. PATH DETECTION UTILITIES
// =============================================================================

/**
 * Get correct base path for navigation links based on current location
 * Extracted from original dcf-unified-system.js lines ~240-280
 */
function getCorrectBasePath() {
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(p => p);
    const filename = pathParts[pathParts.length - 1] || 'index.html';
    
    console.log('DEBUG PATH - pathname:', pathname);
    console.log('DEBUG PATH - pathParts:', pathParts);
    console.log('DEBUG PATH - filename:', filename);
    
    // Check if we're in the initiatives folder or its subfolders
    if (pathname.includes('/initiatives/')) {
        // Count the depth from initiatives folder
        const initiativesIndex = pathParts.indexOf('initiatives');
        if (initiativesIndex !== -1) {
            // Calculate depth: initiatives/file = 1 level, initiatives/subfolder/file = 2 levels
            const depthFromInitiatives = pathParts.length - initiativesIndex - 1;
            
            console.log('DEBUG PATH - In initiatives folder, depth:', depthFromInitiatives);
            
            if (depthFromInitiatives === 1) {
                // We're directly in initiatives folder (e.g., initiatives_home.html)
                console.log('DEBUG PATH - returning: ../');
                return '../';
            } else if (depthFromInitiatives === 2) {
                // We're in a subfolder of initiatives (e.g., peace/initiative_peace.html)
                console.log('DEBUG PATH - returning: ../../');
                return '../../';
            }
        }
    }
    
    // Check if we're in other known folders
    const knownFolders = ['members', 'projects', 'events', 'resources', 'auth', 'admin', 'public', 'news', 'blog', 'people'];
    
    // Find the current folder
    let currentFolder = null;
    for (let i = pathParts.length - 2; i >= 0; i--) {
        if (knownFolders.includes(pathParts[i])) {
            currentFolder = pathParts[i];
            break;
        }
    }
    
    console.log('DEBUG PATH - currentFolder:', currentFolder);
    
    // If we're in a known subfolder, go up one level
    if (currentFolder) {
        console.log('DEBUG PATH - returning: ../');
        return '../';
    }
    
    // If we're at root level (index.html or similar), no need to go up
    console.log('DEBUG PATH - returning: ./');
    return './';
}

// =============================================================================
// 3. TEXT UTILITIES
// =============================================================================

/**
 * Generate initials from username (from original dcf-unified-system.js)
 * Uses first 2 letters of username, uppercase
 */
function generateInitials(username) {
    console.log('🔍 INITIALS DEBUG - Input username:', username);
    console.log('🔍 INITIALS DEBUG - Type of username:', typeof username);
    
    if (!username || typeof username !== 'string') {
        console.log('❌ No valid username provided for initials, using fallback');
        return 'U'; 
    }
    
    console.log('🔍 Generating initials from username:', username);
    
    // Clean name - remove titles
    const cleanName = username.replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?|Professor|Father|Fr\.?|Sister|Sr\.?|Rabbi)\s+/i, '').trim();
    
    // If it looks like a full name (First Last), use first letter of each word
    const parts = cleanName.split(' ').filter(part => part.length > 0);
    
    if (parts.length >= 2) {
        const initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        console.log('🔍 Generated initials from full name:', initials);
        return initials;
    } else if (parts.length === 1) {
        // Single word - use first 2 letters
        const initials = parts[0].substring(0, 2).toUpperCase();
        console.log('🔍 Generated initials from single word:', initials);
        return initials;
    }
    
    // Fallback
    console.log('🔍 Using fallback initials: U');
    return 'U';
}

/**
 * Escape HTML to prevent XSS attacks
 * From original dcf-unified-system.js
 */
function escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format time ago string (from original dcf-unified-system.js)
 */
function getTimeAgo(dateString) {
    if (!dateString) return 'Unknown time';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'some time ago';
    }
}

/**
 * Format date in readable format
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Format date and time in readable format
 */
function formatDateTime(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return dateString;
    }
}

// =============================================================================
// 4. VALIDATION UTILITIES
// =============================================================================

/**
 * Basic email validation
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Sanitize string input
 */
function sanitizeString(input) {
    if (!input || typeof input !== 'string') return '';
    
    // Remove script tags and event handlers
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    return sanitized.trim();
}

// =============================================================================
// 5. UTILITY HELPERS
// =============================================================================

/**
 * Debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =============================================================================
// 6. EXPORTS
// =============================================================================

// Create dcfCore object for organized access
const dcfCore = {
    // Configuration
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SITE_CONFIG,
    
    // Path utilities
    getCorrectBasePath,
    
    // Text utilities
    generateInitials,
    escapeHtml,
    getTimeAgo,
    formatDate,
    formatDateTime,
    
    // Validation
    isValidEmail,
    sanitizeString,
    
    // Helpers
    debounce,
    throttle,
    isInViewport
};

// Export to window for global access
window.dcfCore = dcfCore;

// Also export individual functions for backward compatibility
window.getCorrectBasePath = getCorrectBasePath;
window.generateInitials = generateInitials;
window.escapeHtml = escapeHtml;
window.getTimeAgo = getTimeAgo;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.isValidEmail = isValidEmail;
window.sanitizeString = sanitizeString;
window.debounce = debounce;
window.throttle = throttle;
window.isInViewport = isInViewport;

console.log('✅ DCF Core utilities loaded');
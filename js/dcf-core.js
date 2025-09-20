// ===================================================================
// DCF HUNGARY - CORE UTILITIES
// Standalone utility functions with no external dependencies
// ===================================================================

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================
const SUPABASE_URL = 'https://atzommnkkwzgbktuzjti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';

// Basic site configuration
const SITE_CONFIG = {
    name: 'DCF Hungary',
    fullName: 'Domus Communis Foundation Hungary',
    domain: 'dcfhungary.org',
    supportEmail: 'support@dcfhungary.org',
    defaultLanguage: 'en',
    timezone: 'Europe/Budapest'
};

// =============================================================================
// PATH UTILITIES
// =============================================================================

/**
 * Determines the correct base path for navigation links based on current location
 * @returns {string} The relative path prefix (empty string or '../' repeated)
 */
function getCorrectBasePath() {
    const currentPath = window.location.pathname;
    const pathDepth = currentPath.split('/').filter(p => p).length;
    
    if (pathDepth === 0 || currentPath === '/' || currentPath === '/index.html') {
        return '';
    } else if (pathDepth === 1) {
        return '';
    } else {
        return '../'.repeat(pathDepth - 1);
    }
}

// =============================================================================
// USER UTILITIES
// =============================================================================

/**
 * Generates initials from a username or full name
 * @param {string} username - The username or full name
 * @returns {string} Two-character initials in uppercase
 */
function generateInitials(username) {
    if (!username) return '?';
    
    const parts = username.split(/[\s._-]+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
}

// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} The escaped HTML-safe text
 */
function escapeHtml(text) {
    if (!text) return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    
    return String(text).replace(/[&<>"'\/]/g, char => map[char]);
}

// =============================================================================
// DATE/TIME UTILITIES
// =============================================================================

/**
 * Formats a date string into a human-readable "time ago" format
 * @param {string|Date} dateString - The date to format
 * @returns {string} Human-readable time difference (e.g., "2 hours ago", "3 days ago")
 */
function getTimeAgo(dateString) {
    if (!dateString) return 'some time ago';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) {
            return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
        }
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        }
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        }
        
        const days = Math.floor(hours / 24);
        if (days < 7) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        }
        
        const weeks = Math.floor(days / 7);
        if (weeks < 4) {
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        }
        
        const months = Math.floor(days / 30);
        if (months < 12) {
            return months === 1 ? '1 month ago' : `${months} months ago`;
        }
        
        const years = Math.floor(days / 365);
        return years === 1 ? '1 year ago' : `${years} years ago`;
        
    } catch (error) {
        return 'some time ago';
    }
}

/**
 * Formats a date string into a localized date format
 * @param {string|Date} dateString - The date to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted date string
 */
function formatDate(dateString, locale = 'en-US') {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Formats a date string into a localized date and time format
 * @param {string|Date} dateString - The date to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted date and time string
 */
function formatDateTime(dateString, locale = 'en-US') {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

// =============================================================================
// EXPORT TO WINDOW
// =============================================================================

// Make utilities available globally
window.dcfCore = {
    // Constants
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SITE_CONFIG,
    
    // Functions
    getCorrectBasePath,
    generateInitials,
    escapeHtml,
    getTimeAgo,
    formatDate,
    formatDateTime
};

// Also export individual functions to window for backward compatibility
window.getCorrectBasePath = getCorrectBasePath;
window.generateInitials = generateInitials;
window.escapeHtml = escapeHtml;
window.getTimeAgo = getTimeAgo;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;

console.log('✅ DCF Core utilities loaded');
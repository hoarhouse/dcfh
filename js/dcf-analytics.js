// =============================================================================
// DCF ANALYTICS SYSTEM
// Comprehensive page view and traffic tracking for all content types
// =============================================================================

console.log('📊 DCF Analytics system loading...');

// =============================================================================
// 1. ANALYTICS CONFIGURATION
// =============================================================================

const ANALYTICS_CONFIG = {
    enabled: true,
    debug: false,
    sessionDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    trackAnonymous: true,
    tables: {
        analytics: 'universal_analytics',
        sessions: 'visitor_sessions'
    }
};

// =============================================================================
// 2. SESSION MANAGEMENT
// =============================================================================

/**
 * Get or create visitor session for unique visitor tracking
 */
function getVisitorSession() {
    const sessionKey = 'dcf_visitor_session';
    const userKey = 'dcf_visitor_id';
    
    let session = JSON.parse(localStorage.getItem(sessionKey) || 'null');
    let visitorId = localStorage.getItem(userKey);
    
    // Create visitor ID if doesn't exist
    if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(userKey, visitorId);
    }
    
    const now = Date.now();
    
    // Check if session is valid (within session duration)
    if (session && (now - session.lastActivity) < ANALYTICS_CONFIG.sessionDuration) {
        // Update last activity
        session.lastActivity = now;
        session.pageViews = (session.pageViews || 0) + 1;
        localStorage.setItem(sessionKey, JSON.stringify(session));
        return { ...session, visitorId, isNewSession: false };
    }
    
    // Create new session
    session = {
        sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        startTime: now,
        lastActivity: now,
        pageViews: 1,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        language: navigator.language
    };
    
    localStorage.setItem(sessionKey, JSON.stringify(session));
    return { ...session, visitorId, isNewSession: true };
}

// =============================================================================
// 3. PAGE ANALYSIS
// =============================================================================

/**
 * Analyze current page to determine content type and ID
 */
function analyzePage() {
    const pathname = window.location.pathname;
    const search = window.location.search;
    const url = window.location.href;
    
    // Extract page info
    const pathParts = pathname.split('/').filter(p => p);
    const filename = pathParts[pathParts.length - 1] || 'index.html';
    
    // Default page info
    let pageInfo = {
        contentType: 'page',
        contentId: generatePageId(pathname),
        title: document.title || 'Untitled',
        path: pathname,
        url: url,
        filename: filename
    };
    
    // Detect specific content types
    if (pathname.includes('/blog/')) {
        pageInfo.contentType = 'blog';
        
        // Check if it's a specific post (has URL params or specific filename)
        const urlParams = new URLSearchParams(search);
        if (urlParams.get('id') || urlParams.get('post') || filename.includes('post')) {
            pageInfo.contentId = urlParams.get('id') || urlParams.get('post') || generatePageId(pathname);
            pageInfo.contentType = 'blog_post';
        } else if (filename.includes('category')) {
            pageInfo.contentType = 'blog_category';
            pageInfo.contentId = urlParams.get('category') || 'all';
        } else {
            pageInfo.contentType = 'blog_index';
        }
    } else if (pathname.includes('/news/')) {
        pageInfo.contentType = 'news';
        const urlParams = new URLSearchParams(search);
        if (urlParams.get('id')) {
            pageInfo.contentId = urlParams.get('id');
        }
    } else if (pathname.includes('/public/') || pathname === '/' || filename === 'index.html') {
        pageInfo.contentType = 'launch_page';
        
        // Specific launch pages
        if (filename.includes('values')) pageInfo.contentType = 'values_page';
        else if (filename.includes('contact')) pageInfo.contentType = 'contact_page';
        else if (filename.includes('about')) pageInfo.contentType = 'about_page';
        else if (filename === 'index.html' || pathname === '/') pageInfo.contentType = 'homepage';
    } else if (pathname.includes('/members/')) {
        pageInfo.contentType = 'member_page';
    } else if (pathname.includes('/admin/')) {
        pageInfo.contentType = 'admin_page';
    }
    
    return pageInfo;
}

/**
 * Generate consistent page ID for tracking
 */
function generatePageId(pathname) {
    // Create a consistent UUID-like ID from pathname
    const cleanPath = pathname.replace(/[^a-zA-Z0-9\/\-\_]/g, '').replace(/\//g, '_');
    const hash = hashString(cleanPath);
    
    // Format as UUID-like string
    const hex = hash.toString(16).padStart(8, '0');
    return `page_${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
}

/**
 * Simple string hash function
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// =============================================================================
// 4. ANALYTICS TRACKING
// =============================================================================

/**
 * Track page view
 */
async function trackPageView(pageInfo = null, additionalMetadata = {}) {
    if (!ANALYTICS_CONFIG.enabled) return;
    
    try {
        // Get page info if not provided
        if (!pageInfo) {
            pageInfo = analyzePage();
        }
        
        // Get session info
        const session = getVisitorSession();
        
        // Get current user if logged in
        const currentUser = window.dcfUser || null;
        
        // Prepare tracking data
        const trackingData = {
            content_type: pageInfo.contentType,
            content_id: pageInfo.contentId,
            interaction_type: 'view',
            user_id: currentUser?.id || null,
            user_email: currentUser?.email || null,
            interaction_subtype: session.isNewSession ? 'new_session' : 'returning_session'
        };
        
        if (ANALYTICS_CONFIG.debug) {
            console.log('📊 Tracking page view:', {
                pageInfo,
                trackingData,
                session: { ...session, visitorId: session.visitorId }
            });
        }
        
        // Check if Supabase is available
        if (typeof window.dcfSupabase === 'undefined') {
            console.warn('📊 Supabase not available for analytics tracking');
            return;
        }
        
        // Track in database
        const { data, error } = await window.dcfSupabase
            .from(ANALYTICS_CONFIG.tables.analytics)
            .insert(trackingData);
        
        if (error) {
            console.error('📊 Error tracking page view:', error);
        } else if (ANALYTICS_CONFIG.debug) {
            console.log('📊 Page view tracked successfully');
        }
        
        // Store in session storage for this page load
        const sessionData = {
            pageInfo,
            trackingData,
            timestamp: Date.now(),
            visitorId: session.visitorId,
            sessionId: session.sessionId
        };
        
        sessionStorage.setItem('dcf_current_page_analytics', JSON.stringify(sessionData));
        
    } catch (error) {
        console.error('📊 Analytics tracking error:', error);
    }
}

/**
 * Track custom interaction
 */
async function trackInteraction(contentType, contentId, interactionType, metadata = {}) {
    if (!ANALYTICS_CONFIG.enabled) return;
    
    try {
        const currentUser = window.dcfUser || null;
        
        const trackingData = {
            content_type: contentType,
            content_id: contentId,
            interaction_type: interactionType,
            user_id: currentUser?.id || null,
            user_email: currentUser?.email || null,
            interaction_subtype: metadata.subtype || null
        };
        
        if (ANALYTICS_CONFIG.debug) {
            console.log('📊 Tracking interaction:', trackingData);
        }
        
        if (typeof window.dcfSupabase === 'undefined') {
            console.warn('📊 Supabase not available for analytics tracking');
            return;
        }
        
        const { data, error } = await window.dcfSupabase
            .from(ANALYTICS_CONFIG.tables.analytics)
            .insert(trackingData);
        
        if (error) {
            console.error('📊 Error tracking interaction:', error);
        }
        
    } catch (error) {
        console.error('📊 Analytics interaction error:', error);
    }
}

// =============================================================================
// 5. AUTO-INITIALIZATION
// =============================================================================

/**
 * Initialize analytics system
 */
function initializeAnalytics() {
    if (ANALYTICS_CONFIG.debug) {
        console.log('📊 Initializing DCF Analytics...');
    }
    
    // Track page view on load
    trackPageView();
    
    // Track page visibility changes (for better session tracking)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Page became visible - update session activity
            const session = getVisitorSession();
            if (ANALYTICS_CONFIG.debug) {
                console.log('📊 Page visible - session updated');
            }
        }
    });
    
    // Track before page unload (for session duration)
    window.addEventListener('beforeunload', function() {
        const session = JSON.parse(localStorage.getItem('dcf_visitor_session') || 'null');
        if (session) {
            session.lastActivity = Date.now();
            localStorage.setItem('dcf_visitor_session', JSON.stringify(session));
        }
    });
}

// =============================================================================
// 6. EXPORTS
// =============================================================================

// Create analytics object for organized access
const dcfAnalytics = {
    config: ANALYTICS_CONFIG,
    trackPageView,
    trackInteraction,
    analyzePage,
    getVisitorSession,
    initialize: initializeAnalytics
};

// Export to window for global access
window.dcfAnalytics = dcfAnalytics;

// Also export individual functions for backward compatibility
window.trackPageView = trackPageView;
window.trackAnalyticsInteraction = trackInteraction;
window.initializeAnalytics = initializeAnalytics;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
    // DOM already loaded
    setTimeout(initializeAnalytics, 100);
}

console.log('✅ DCF Analytics system loaded');
// =============================================================================
// DCF INITIALIZATION COORDINATOR
// Manages startup sequence and system coordination
// Ensures all systems load in correct order with proper error handling
// =============================================================================

console.log('🚀 DCF System Coordinator Loading...');

// =============================================================================
// 1. SYSTEM STATE TRACKING
// =============================================================================

const DCF_SYSTEM_STATE = {
    core: { loaded: false, error: null },
    ui: { loaded: false, error: null },
    auth: { loaded: false, error: null },
    initialized: false,
    startTime: Date.now()
};

// =============================================================================
// 2. DEPENDENCY CHECKING
// =============================================================================

function checkDependencies() {
    const deps = {
        core: typeof window.dcfCore !== 'undefined' && typeof window.getCorrectBasePath === 'function',
        ui: typeof window.dcfUI !== 'undefined' && typeof window.showAlert === 'function',
        supabase: typeof window.supabase !== 'undefined'
    };
    
    console.log('🔍 Dependency check:', deps);
    return deps;
}

function waitForDependency(checkFn, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        function check() {
            if (checkFn()) {
                resolve(true);
            } else if (Date.now() - startTime > timeout) {
                reject(new Error('Dependency timeout'));
            } else {
                setTimeout(check, 50);
            }
        }
        
        check();
    });
}

// =============================================================================
// 3. SYSTEM INITIALIZATION
// =============================================================================

async function initializeDCFSystems() {
    console.log('🎯 Starting DCF system initialization...');
    
    const initStartTime = Date.now();
    
    try {
        // Step 1: Wait for core dependencies
        console.log('⏳ Waiting for core dependencies...');
        await waitForDependency(() => checkDependencies().core, 3000);
        DCF_SYSTEM_STATE.core.loaded = true;
        console.log('✅ Core system ready');
        
        // Step 2: Wait for UI system
        console.log('⏳ Waiting for UI system...');
        await waitForDependency(() => checkDependencies().ui, 3000);
        DCF_SYSTEM_STATE.ui.loaded = true;
        console.log('✅ UI system ready');
        
        // Step 3: Initialize UI (safe to call even if already done)
        if (window.dcfUI && typeof window.dcfUI.initialize === 'function') {
            console.log('🎨 Initializing UI system...');
            window.dcfUI.initialize();
        }
        
        // Step 4: Initialize authentication (optional)
        if (window.dcfAuth && typeof window.dcfAuth.initializeAuth === 'function') {
            console.log('🔐 Initializing authentication...');
            try {
                await window.dcfAuth.initializeAuth();
                DCF_SYSTEM_STATE.auth.loaded = true;
                console.log('✅ Authentication initialized');
            } catch (authError) {
                console.warn('⚠️ Authentication failed, continuing without auth:', authError.message);
                DCF_SYSTEM_STATE.auth.error = authError.message;
            }
        } else {
            console.log('ℹ️ Authentication system not available');
        }
        
        // Step 5: Mark as fully initialized
        DCF_SYSTEM_STATE.initialized = true;
        const totalTime = Date.now() - initStartTime;
        console.log(`✅ DCF System fully initialized in ${totalTime}ms`);
        
        // Step 6: Dispatch ready event
        window.dispatchEvent(new CustomEvent('dcfReady', {
            detail: {
                systemState: DCF_SYSTEM_STATE,
                user: window.getCurrentUser ? window.getCurrentUser() : null,
                isLoggedIn: window.isUserLoggedIn ? window.isUserLoggedIn() : false
            }
        }));
        
        return true;
        
    } catch (error) {
        console.error('❌ DCF system initialization failed:', error);
        
        // Try to provide fallback functionality
        await attemptFallbackInit();
        
        return false;
    }
}

async function attemptFallbackInit() {
    console.log('🔄 Attempting fallback initialization...');
    
    try {
        // Basic UI functionality
        if (window.dcfUI) {
            window.dcfUI.initialize();
            console.log('✅ Basic UI initialized in fallback mode');
        }
        
        // Show user that system is running in limited mode
        setTimeout(() => {
            if (window.showAlert) {
                window.showAlert(
                    'The website is running in limited mode. Some features may not be available.',
                    'warning',
                    'Limited Mode'
                );
            }
        }, 2000);
        
    } catch (fallbackError) {
        console.error('❌ Even fallback initialization failed:', fallbackError);
    }
}

// =============================================================================
// 4. SYSTEM HEALTH MONITORING
// =============================================================================

function getSystemHealth() {
    const health = {
        status: DCF_SYSTEM_STATE.initialized ? 'healthy' : 'degraded',
        systems: {
            core: DCF_SYSTEM_STATE.core.loaded ? 'ok' : 'failed',
            ui: DCF_SYSTEM_STATE.ui.loaded ? 'ok' : 'failed',
            auth: DCF_SYSTEM_STATE.auth.loaded ? 'ok' : 'degraded'
        },
        uptime: Date.now() - DCF_SYSTEM_STATE.startTime,
        user: {
            loggedIn: window.isUserLoggedIn ? window.isUserLoggedIn() : false,
            profile: window.getCurrentUser ? window.getCurrentUser() : null
        }
    };
    
    return health;
}

function performHealthCheck() {
    const health = getSystemHealth();
    console.log('🏥 System health check:', health);
    
    // Check for critical issues
    if (!health.systems.core || !health.systems.ui) {
        console.error('🚨 Critical system failure detected');
        return false;
    }
    
    // Check for authentication issues
    if (health.systems.auth === 'failed' && health.user.loggedIn) {
        console.warn('⚠️ Authentication inconsistency detected');
    }
    
    return true;
}

// =============================================================================
// 5. PAGE-SPECIFIC INITIALIZATION
// =============================================================================

function initializePageSpecificFeatures() {
    const pathname = window.location.pathname;
    console.log('📄 Initializing page-specific features for:', pathname);
    
    // Admin pages
    if (pathname.includes('/admin/')) {
        console.log('👨‍💼 Admin page detected');
        initializeAdminFeatures();
    }
    
    // Member pages
    if (pathname.includes('/members/')) {
        console.log('👤 Member page detected');
        initializeMemberFeatures();
    }
    
    // Public pages
    if (pathname.includes('/public/') || pathname.endsWith('index.html')) {
        console.log('🌐 Public page detected');
        initializePublicFeatures();
    }
}

function initializeAdminFeatures() {
    // Admin-specific functionality
    if (window.populateAdminMenu && typeof window.populateAdminMenu === 'function') {
        window.populateAdminMenu();
    }
    
    // Check admin authentication
    if (window.isUserLoggedIn && !window.isUserLoggedIn()) {
        console.log('⚠️ Admin page accessed without authentication');
        // Could redirect to login, but respecting current non-blocking approach
    }
}

function initializeMemberFeatures() {
    // Member-specific functionality
    console.log('🔧 Initializing member page features');
    
    // Initialize comments if on a page that needs them
    if (typeof window.initComments === 'function') {
        const contentType = 'profile'; // Default for member pages
        const userId = window.getCurrentUser ? window.getCurrentUser()?.id : null;
        if (userId) {
            window.initComments(contentType, userId);
        }
    }
    
    // Initialize analytics
    if (typeof window.initializeInteractionButtons === 'function') {
        window.initializeInteractionButtons();
    }
}

function initializePublicFeatures() {
    // Public page functionality
    console.log('🌍 Initializing public page features');
    
    // Newsletter signup, footer functionality, etc.
    if (typeof window.subscribeNewsletter === 'function') {
        console.log('📧 Newsletter system available');
    }
}

// =============================================================================
// 6. ERROR RECOVERY
// =============================================================================

function setupErrorRecovery() {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('🚨 Global error caught:', event.error);
        
        // Try to maintain basic functionality
        if (!DCF_SYSTEM_STATE.initialized) {
            console.log('🔄 Attempting error recovery...');
            setTimeout(initializeDCFSystems, 1000);
        }
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('🚨 Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent console spam
    });
}

// =============================================================================
// 7. PUBLIC API
// =============================================================================

const dcfInit = {
    initialize: initializeDCFSystems,
    getSystemHealth,
    performHealthCheck,
    getState: () => DCF_SYSTEM_STATE,
    isReady: () => DCF_SYSTEM_STATE.initialized
};

// Export to window
window.dcfInit = dcfInit;
window.initializeDCFSystems = initializeDCFSystems;
window.getSystemHealth = getSystemHealth;

// =============================================================================
// 8. AUTO-INITIALIZATION
// =============================================================================

// Setup error recovery immediately
setupErrorRecovery();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('📄 DOM loaded, starting DCF initialization...');
        await initializeDCFSystems();
        initializePageSpecificFeatures();
    });
} else {
    // DOM already loaded
    console.log('📄 DOM already loaded, starting immediate initialization...');
    setTimeout(async () => {
        await initializeDCFSystems();
        initializePageSpecificFeatures();
    }, 100);
}

// Health check every 30 seconds
setInterval(() => {
    if (DCF_SYSTEM_STATE.initialized) {
        performHealthCheck();
    }
}, 30000);

console.log('✅ DCF System Coordinator loaded');
/**
 * DCF Icon System
 * Core functionality for managing and rendering icons across the platform
 */

class DCFIconSystem {
    constructor() {
        // Core icon mapping with emojis as fallbacks
        this.coreIconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            calendar: '📅',
            user: '👤',
            message: '💬',
            notification: '🔔',
            settings: '⚙️',
            edit: '✏️',
            view: '👁️',
            close: '✖️',
            peace: '⚖️',
            education: '📚',
            health: '🏥',
            research: '🔬',
            home: '🏠',
            menu: '☰',
            search: '🔍',
            share: '📤',
            info: 'ℹ️',
            clock: '🕐',
            donate: '💝',
            globe: '🌍',
            justice: '⚖️',
            megaphone: '📢',
            news: '📰',
            heart: '❤️',
            shield: '🛡️'
        };

        // Size configurations
        this.sizeConfig = {
            small: { width: 16, height: 16, class: 'icon-small' },
            standard: { width: 24, height: 24, class: 'icon-standard' },
            large: { width: 32, height: 32, class: 'icon-large' }
        };

        // Current icon set (cached)
        this.currentIconSet = 'emoji'; // Default to emoji
        this.iconCache = {};
        this.supabaseClient = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the icon system
     * @returns {Promise<void>}
     */
    async initializeIcons() {
        try {
            // Wait for unified-auth.js to initialize the Supabase client
            if (typeof window !== 'undefined' && window.dcfSupabase) {
                this.supabaseClient = window.dcfSupabase;
                
                // Load the default icon set from database
                await this.loadIconSet();
            } else {
                console.log('🎨 Icon System: Running in emoji-only mode (no database connection)');
            }
            
            this.isInitialized = true;
            console.log('✅ Icon System initialized successfully');
        } catch (error) {
            console.error('❌ Icon System initialization failed:', error);
            // Fall back to emoji mode
            this.currentIconSet = 'emoji';
            this.isInitialized = true;
        }
    }

    /**
     * Get an icon by name with specified size and accessibility label
     * @param {string} iconName - Name of the icon
     * @param {string} size - Size of the icon (small/standard/large)
     * @param {string} ariaLabel - ARIA label for accessibility
     * @returns {string} HTML string for the icon
     */
    getIcon(iconName, size = 'standard', ariaLabel = '') {
        // Debug logging
        console.log('🔍 Looking for icon:', iconName);
        console.log('🔍 Icon exists in coreIconMap:', iconName in this.coreIconMap);
        
        // Validate icon name
        if (!this.coreIconMap[iconName]) {
            console.warn(`⚠️ Icon "${iconName}" not found in coreIconMap, using placeholder`);
            console.log('🔍 Available icons in coreIconMap:', Object.keys(this.coreIconMap));
            iconName = 'info';
        }

        // Validate size
        if (!this.sizeConfig[size]) {
            size = 'standard';
        }

        // Check if we have a cached SVG version
        const cacheKey = `${this.currentIconSet}-${iconName}-${size}`;
        console.log('🔍 Cache key:', cacheKey);
        console.log('🔍 Available cache keys (first 10):', Object.keys(this.iconCache).slice(0, 10));
        console.log('🔍 Cache keys with "heart":', Object.keys(this.iconCache).filter(k => k.includes('heart')));
        console.log('🔍 Cache hit result:', !!this.iconCache[cacheKey]);
        
        if (this.iconCache[cacheKey]) {
            console.log('✅ Found in cache, returning SVG');
            return this.renderIcon(this.iconCache[cacheKey], iconName, size, ariaLabel);
        }

        // Log cache miss for debugging (only if not emoji mode)
        if (this.currentIconSet !== 'emoji') {
            console.log(`❌ Cache miss for ${cacheKey} - falling back to emoji`);
        }

        // Always fall back to emoji if not in cache
        // (Icons should be pre-loaded during initialization)
        return this.renderEmojiIcon(iconName, size, ariaLabel);
    }

    /**
     * Load icon set from database
     * @returns {Promise<void>}
     */
    async loadIconSet() {
        if (!this.supabaseClient || typeof this.supabaseClient.from !== 'function') {
            console.log('📊 No database connection, using emoji icons');
            return;
        }

        try {
            // Check for admin preferences first
            const { data: adminPref, error: prefError } = await this.supabaseClient
                .from('site_settings')
                .select('setting_value')
                .eq('setting_key', 'current_icon_set')
                .maybeSingle(); // Use maybeSingle to handle missing settings gracefully

            if (prefError) {
                // If the setting doesn't exist or there's an error, use default
                console.log('📊 No icon preference found, using default emoji icons');
                this.currentIconSet = 'emoji';
            } else if (adminPref && adminPref.setting_value) {
                this.currentIconSet = adminPref.setting_value;
                console.log(`🎨 Loaded icon set: ${this.currentIconSet}`);
            }

            // Load SVG icons if not using emoji set
            if (this.currentIconSet !== 'emoji') {
                // First get the icon set ID - properly handle the query
                console.log('Loading icon set:', this.currentIconSet);
                
                // Try multiple variations to find the icon set
                let iconSet = null;
                let setError = null;
                
                // Create variations to try
                const variations = [
                    this.currentIconSet, // As-is
                    this.currentIconSet.replace(/_/g, ' '), // Underscores to spaces
                    this.currentIconSet.replace(/ /g, '_'), // Spaces to underscores
                    // Title case variations
                    this.currentIconSet.split(/[_ ]/).map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' '),
                    this.currentIconSet.split(/[_ ]/).map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join('_'),
                    // Exact matches for known sets
                    'Sacred Minimalist',
                    'sacred_minimalist'
                ];
                
                // Remove duplicates
                const uniqueVariations = [...new Set(variations)];
                
                // Try each variation
                for (const variation of uniqueVariations) {
                    console.log(`Trying icon set name: "${variation}"`);
                    const result = await this.supabaseClient
                        .from('icon_sets')
                        .select('id, set_name')
                        .eq('set_name', variation)
                        .maybeSingle();
                    
                    if (result.data) {
                        iconSet = result.data;
                        console.log(`✅ Found match with name: "${variation}" (ID: ${iconSet.id})`);
                        break;
                    }
                    setError = result.error;
                }

                if (!iconSet) {
                    if (setError) console.error('❌ Error finding icon set:', setError);
                    console.log(`Icon set "${this.currentIconSet}" not found in database after trying variations, using emoji fallback`);
                    this.currentIconSet = 'emoji';
                } else if (iconSet) {
                    console.log(`📊 Found icon set ID: ${iconSet.id} for ${this.currentIconSet}`);
                    
                    // Load icons for this set
                    const { data: icons, error: iconError } = await this.supabaseClient
                        .from('icons')
                        .select('icon_name, svg_small, svg_standard, svg_large')
                        .eq('icon_set_id', iconSet.id);

                    // Check for query errors
                    if (iconError) {
                        console.error('❌ Failed to load icons from database:', iconError);
                        console.error('Query details - icon_set_id:', iconSet.id);
                        this.currentIconSet = 'emoji';
                        return;
                    }

                    console.log(`📦 Database returned ${icons ? icons.length : 0} icons`);

                    if (icons && icons.length > 0) {
                        // Cache the SVG icons
                        let cachedCount = 0;
                        icons.forEach(icon => {
                            // Check if SVG data exists
                            if (icon.svg_small || icon.svg_standard || icon.svg_large) {
                                console.log(`  - Caching icon: ${icon.icon_name}`);
                                
                                // Special logging for heart icon
                                if (icon.icon_name === 'heart' || icon.icon_name.includes('heart')) {
                                    console.log('💖 Found heart icon in database!', icon.icon_name);
                                }
                                
                                // Cache different sizes
                                const cacheKeySmall = `${this.currentIconSet}-${icon.icon_name}-small`;
                                const cacheKeyStandard = `${this.currentIconSet}-${icon.icon_name}-standard`;
                                const cacheKeyLarge = `${this.currentIconSet}-${icon.icon_name}-large`;
                                
                                if (icon.svg_small) this.iconCache[cacheKeySmall] = icon.svg_small;
                                if (icon.svg_standard) this.iconCache[cacheKeyStandard] = icon.svg_standard;
                                if (icon.svg_large) this.iconCache[cacheKeyLarge] = icon.svg_large;
                                
                                cachedCount++;
                            } else {
                                console.warn(`  ⚠️ Icon ${icon.icon_name} has no SVG data`);
                            }
                        });
                        console.log(`✅ Cached ${cachedCount} SVG icons from ${this.currentIconSet} set (out of ${icons.length} total)`);
                    } else {
                        console.warn(`⚠️ No icons found for ${this.currentIconSet} set (ID: ${iconSet.id})`);
                        console.log('Falling back to emoji icons');
                        this.currentIconSet = 'emoji';
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error loading icon set:', error);
            // Fallback to emoji
            this.currentIconSet = 'emoji';
        }
    }

    /**
     * Switch to a different icon set (admin function)
     * @param {string} setName - Name of the icon set
     * @returns {Promise<boolean>} Success status
     */
    async switchIconSet(setName) {
        try {
            // Check if user is logged in first
            let hasPermission = false;
            
            // Method 1: Check if isAdmin function exists and returns true
            if (window.isAdmin && typeof window.isAdmin === 'function') {
                hasPermission = window.isAdmin();
            }
            
            // Method 2: Check if user is logged in via dcfUser
            if (!hasPermission && window.dcfUser && window.dcfUser.isLoggedIn) {
                // Check if user has admin role or is specific admin user
                if (window.dcfUser.profile) {
                    const userEmail = window.dcfUser.profile.email;
                    const userRole = window.dcfUser.profile.role;
                    
                    // Allow specific admin users or admin role
                    if (userRole === 'admin' || 
                        userEmail === 'hooray@gmail.com' || 
                        userEmail === 'christopherhoar@gmail.com') {
                        hasPermission = true;
                        console.log('✅ Admin access granted for icon management');
                    }
                }
            }
            
            // Method 3: For testing - allow any logged in user (temporary)
            if (!hasPermission && window.dcfUser && window.dcfUser.isLoggedIn) {
                hasPermission = true;
                console.log('⚠️ Temporary: Allowing logged-in user to switch icons for testing');
            }
            
            if (!hasPermission) {
                console.warn('⚠️ Admin permission required to switch icon sets. Please log in as an admin.');
                return false;
            }

            // Clear cache
            this.iconCache = {};

            // Update current set
            this.currentIconSet = setName;

            // Save preference to database if connected
            if (this.supabaseClient && typeof this.supabaseClient.from === 'function') {
                // First check if the setting exists
                const { data: existing } = await this.supabaseClient
                    .from('site_settings')
                    .select('id')
                    .eq('setting_key', 'current_icon_set')
                    .maybeSingle(); // Use maybeSingle to handle missing settings
                
                let saveError = null;
                
                if (existing) {
                    // Update existing setting
                    const { error } = await this.supabaseClient
                        .from('site_settings')
                        .update({ 
                            setting_value: setName,
                            updated_at: new Date().toISOString()
                        })
                        .eq('setting_key', 'current_icon_set');
                    saveError = error;
                } else {
                    // Insert new setting
                    const { error } = await this.supabaseClient
                        .from('site_settings')
                        .insert({ 
                            setting_key: 'current_icon_set',
                            setting_value: setName,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    saveError = error;
                }

                if (saveError) {
                    console.error('❌ Error saving icon preference:', saveError);
                    return false;
                }
            }

            // Reload icons with new set
            await this.loadIconSet();

            // Trigger UI update
            this.updateAllIcons();

            console.log(`✅ Switched to ${setName} icon set`);
            return true;
        } catch (error) {
            console.error('❌ Error switching icon set:', error);
            return false;
        }
    }

    /**
     * Render an icon with proper HTML structure and accessibility
     * @param {string} content - Icon content (emoji or SVG)
     * @param {string} iconName - Name of the icon
     * @param {string} size - Size preset
     * @param {string} ariaLabel - ARIA label
     * @returns {string} HTML string
     */
    renderIcon(content, iconName, size, ariaLabel) {
        const sizeConfig = this.sizeConfig[size];
        const label = ariaLabel || this.getDefaultAriaLabel(iconName);
        
        // Check if content is SVG or emoji
        const isSVG = content.includes('<svg') || content.includes('<?xml');
        
        if (isSVG) {
            // Render SVG with proper attributes
            return `<span class="dcf-icon ${sizeConfig.class}" 
                          data-icon="${iconName}" 
                          role="img" 
                          aria-label="${label}">
                        ${this.processSVG(content, sizeConfig)}
                    </span>`;
        } else {
            // Render emoji
            return this.renderEmojiIcon(iconName, size, ariaLabel);
        }
    }

    /**
     * Render emoji icon with accessibility
     * @param {string} iconName - Name of the icon
     * @param {string} size - Size preset
     * @param {string} ariaLabel - ARIA label
     * @returns {string} HTML string
     */
    renderEmojiIcon(iconName, size, ariaLabel) {
        const emoji = this.coreIconMap[iconName] || '❓';
        const sizeConfig = this.sizeConfig[size];
        const label = ariaLabel || this.getDefaultAriaLabel(iconName);
        
        return `<span class="dcf-icon dcf-icon-emoji ${sizeConfig.class}" 
                      data-icon="${iconName}" 
                      role="img" 
                      aria-label="${label}"
                      style="font-size: ${sizeConfig.width}px; line-height: ${sizeConfig.height}px;">
                    ${emoji}
                </span>`;
    }

    /**
     * Process SVG content to add proper dimensions
     * @param {string} svgContent - Raw SVG content
     * @param {object} sizeConfig - Size configuration
     * @returns {string} Processed SVG
     */
    processSVG(svgContent, sizeConfig) {
        // Add width and height attributes if not present
        let svg = svgContent;
        
        if (!svg.includes('width=')) {
            svg = svg.replace('<svg', `<svg width="${sizeConfig.width}"`);
        }
        if (!svg.includes('height=')) {
            svg = svg.replace('<svg', `<svg height="${sizeConfig.height}"`);
        }
        
        // Ensure viewBox is present for scaling
        if (!svg.includes('viewBox=')) {
            svg = svg.replace('<svg', `<svg viewBox="0 0 24 24"`);
        }
        
        return svg;
    }

    /**
     * Get default ARIA label for an icon
     * @param {string} iconName - Name of the icon
     * @returns {string} Default ARIA label
     */
    getDefaultAriaLabel(iconName) {
        const labels = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            calendar: 'Calendar',
            user: 'User profile',
            message: 'Message',
            notification: 'Notification',
            settings: 'Settings',
            edit: 'Edit',
            view: 'View',
            close: 'Close',
            peace: 'Peace initiative',
            education: 'Education program',
            health: 'Health program',
            research: 'Research program',
            home: 'Home',
            menu: 'Menu',
            search: 'Search',
            share: 'Share',
            info: 'Information',
            clock: 'Time',
            donate: 'Donate',
            globe: 'Global',
            justice: 'Justice',
            megaphone: 'Announcement',
            news: 'News',
            heart: 'Heart',
            shield: 'Shield'
        };
        
        return labels[iconName] || iconName;
    }

    /**
     * Update all icons on the page (after set change)
     */
    updateAllIcons() {
        const iconElements = document.querySelectorAll('.dcf-icon[data-icon]');
        
        iconElements.forEach(element => {
            const iconName = element.dataset.icon;
            const size = this.detectSize(element);
            const ariaLabel = element.getAttribute('aria-label');
            
            // Replace with new icon
            const newIcon = this.getIcon(iconName, size, ariaLabel);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newIcon;
            const newElement = tempDiv.firstChild;
            
            // Preserve any additional classes or attributes
            element.className.split(' ').forEach(cls => {
                if (!cls.startsWith('dcf-icon') && !cls.startsWith('icon-')) {
                    newElement.classList.add(cls);
                }
            });
            
            element.replaceWith(newElement);
        });
        
        console.log(`✅ Updated ${iconElements.length} icons on page`);
    }

    /**
     * Detect size from element classes
     * @param {HTMLElement} element - Icon element
     * @returns {string} Size preset
     */
    detectSize(element) {
        if (element.classList.contains('icon-small')) return 'small';
        if (element.classList.contains('icon-large')) return 'large';
        return 'standard';
    }

    /**
     * Force reload icons from database
     * @returns {Promise<boolean>} Success status
     */
    async reloadIcons() {
        console.log('🔄 Manually reloading icon set...');
        this.iconCache = {}; // Clear cache
        await this.loadIconSet();
        return Object.keys(this.iconCache).length > 0;
    }

    /**
     * Get available icon sets
     * @returns {Promise<Array>} List of available icon sets
     */
    async getAvailableIconSets() {
        const sets = [
            { name: 'emoji', label: 'Emoji Icons', description: 'Default emoji icons' }
        ];

        if (this.supabaseClient && typeof this.supabaseClient.from === 'function') {
            try {
                const { data: iconSets, error } = await this.supabaseClient
                    .from('icon_sets')
                    .select('set_name, description');

                if (iconSets && iconSets.length > 0) {
                    iconSets.forEach(iconSet => {
                        sets.push({
                            name: iconSet.set_name,
                            label: this.formatSetName(iconSet.set_name),
                            description: iconSet.description || `${iconSet.set_name} icon style`
                        });
                    });
                }
            } catch (error) {
                console.error('Error fetching icon sets:', error);
            }
        }

        return sets;
    }

    /**
     * Format icon set name for display
     * @param {string} setName - Raw set name
     * @returns {string} Formatted name
     */
    formatSetName(setName) {
        return setName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}

// Create global instance
const iconSystem = new DCFIconSystem();

// Auto-initialize when DOM is ready and unified-auth.js has loaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait a bit for unified-auth.js to initialize
            setTimeout(() => {
                iconSystem.initializeIcons();
            }, 100);
        });
    } else {
        // DOM already loaded, wait for unified-auth.js
        setTimeout(() => {
            iconSystem.initializeIcons();
        }, 100);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DCFIconSystem;
}
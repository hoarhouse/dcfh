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
            info: 'ℹ️'
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
            // Initialize Supabase client if available
            if (typeof window !== 'undefined' && window.supabase) {
                this.supabaseClient = window.supabase;
                
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
        // Validate icon name
        if (!this.coreIconMap[iconName]) {
            console.warn(`⚠️ Icon "${iconName}" not found, using placeholder`);
            iconName = 'info';
        }

        // Validate size
        if (!this.sizeConfig[size]) {
            size = 'standard';
        }

        // Check if we have a cached SVG version
        const cacheKey = `${this.currentIconSet}-${iconName}-${size}`;
        if (this.iconCache[cacheKey]) {
            return this.renderIcon(this.iconCache[cacheKey], iconName, size, ariaLabel);
        }

        // For now, render emoji version
        if (this.currentIconSet === 'emoji' || !this.supabaseClient) {
            return this.renderEmojiIcon(iconName, size, ariaLabel);
        }

        // If SVG set is selected but not cached, fetch and render
        // This would be async in production, for now fallback to emoji
        return this.renderEmojiIcon(iconName, size, ariaLabel);
    }

    /**
     * Load icon set from database
     * @returns {Promise<void>}
     */
    async loadIconSet() {
        if (!this.supabaseClient) {
            console.log('📊 No database connection, using emoji icons');
            return;
        }

        try {
            // Check for admin preferences first
            const { data: adminPref, error: prefError } = await this.supabaseClient
                .from('admin_settings')
                .select('icon_set')
                .single();

            if (adminPref && adminPref.icon_set) {
                this.currentIconSet = adminPref.icon_set;
                console.log(`🎨 Loaded icon set: ${this.currentIconSet}`);
            }

            // Load SVG icons if not using emoji set
            if (this.currentIconSet !== 'emoji') {
                const { data: icons, error: iconError } = await this.supabaseClient
                    .from('icon_library')
                    .select('name, svg_content, style')
                    .eq('style', this.currentIconSet);

                if (icons && icons.length > 0) {
                    // Cache the SVG icons
                    icons.forEach(icon => {
                        Object.keys(this.sizeConfig).forEach(size => {
                            const cacheKey = `${this.currentIconSet}-${icon.name}-${size}`;
                            this.iconCache[cacheKey] = icon.svg_content;
                        });
                    });
                    console.log(`✅ Cached ${icons.length} SVG icons`);
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
            // Validate admin permission (check if admin functions are available)
            if (!window.isAdmin || !window.isAdmin()) {
                console.warn('⚠️ Admin permission required to switch icon sets');
                return false;
            }

            // Clear cache
            this.iconCache = {};

            // Update current set
            this.currentIconSet = setName;

            // Save preference to database if connected
            if (this.supabaseClient) {
                const { error } = await this.supabaseClient
                    .from('admin_settings')
                    .upsert({ 
                        id: 1, // Single settings row
                        icon_set: setName,
                        updated_at: new Date().toISOString()
                    });

                if (error) {
                    console.error('❌ Error saving icon preference:', error);
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
            info: 'Information'
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
     * Get available icon sets
     * @returns {Promise<Array>} List of available icon sets
     */
    async getAvailableIconSets() {
        const sets = [
            { name: 'emoji', label: 'Emoji Icons', description: 'Default emoji icons' }
        ];

        if (this.supabaseClient) {
            try {
                const { data: styles, error } = await this.supabaseClient
                    .from('icon_library')
                    .select('style')
                    .distinct();

                if (styles) {
                    styles.forEach(style => {
                        sets.push({
                            name: style.style,
                            label: this.formatSetName(style.style),
                            description: `${style.style} icon style`
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

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            iconSystem.initializeIcons();
        });
    } else {
        // DOM already loaded
        iconSystem.initializeIcons();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DCFIconSystem;
}
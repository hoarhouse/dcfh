// Universal Quick Actions Engine for DCF Hungary
// This file handles the rendering logic - rarely needs changes
// Edit quickactions.js to modify the actual quick actions

class DCFQuickActions {
    constructor() {
        this.currentPage = this.getCurrentPageName();
        this.init();
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    getActionsForCurrentPage() {
        // Check if config is loaded
        if (typeof quickActionsConfig === 'undefined') {
            console.warn('Quick Actions config not loaded. Make sure quickactions.js is included before universal-quick-actions.js');
            return [];
        }

        return quickActionsConfig[this.currentPage] || quickActionsConfig['default'] || [];
    }

    generateQuickActionsHTML() {
        const actions = this.getActionsForCurrentPage();
        
        if (actions.length === 0) {
            return ''; // Don't render anything if no actions
        }
        
        let buttonsHTML = '';
        actions.forEach(action => {
            const btnClass = action.type === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';
            const clickAction = action.action.startsWith('javascript:') 
                ? action.action.replace('javascript:', '') 
                : `window.location.href='${action.action}'`;
            
            buttonsHTML += `<button class="${btnClass}" onclick="${clickAction}" style="margin-bottom: 0.5rem;">${action.icon} ${action.text}</button>`;
        });

        return `
            <div class="card" id="universal-quick-actions">
                <h3 class="card-title">Quick Actions</h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${buttonsHTML}
                </div>
            </div>
        `;
    }

    render(containerId = 'quick-actions-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.generateQuickActionsHTML();
        } else {
            console.warn(`Quick Actions container with ID '${containerId}' not found`);
        }
    }

    // Method to replace existing Quick Actions boxes
    replaceExistingQuickActions() {
        // Look for existing Quick Actions cards and replace them
        const existingCards = document.querySelectorAll('.card');
        existingCards.forEach(card => {
            const title = card.querySelector('.card-title');
            if (title && title.textContent.trim() === 'Quick Actions') {
                const newHTML = this.generateQuickActionsHTML();
                if (newHTML) {
                    card.outerHTML = newHTML;
                }
            }
        });
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.replaceExistingQuickActions();
            });
        } else {
            this.replaceExistingQuickActions();
        }
    }

    // Static method to add Quick Actions to any page
    static addToPage(containerId = 'quick-actions-container') {
        const quickActions = new DCFQuickActions();
        quickActions.render(containerId);
    }

    // Method to refresh actions (useful after config changes)
    refresh() {
        this.replaceExistingQuickActions();
    }
}

// Auto-initialize when script loads
window.addEventListener('DOMContentLoaded', () => {
    // Initialize universal quick actions
    if (typeof window.dcfQuickActions === 'undefined') {
        window.dcfQuickActions = new DCFQuickActions();
    }
});

// Global function for easy manual initialization
function initializeQuickActions(containerId) {
    return DCFQuickActions.addToPage(containerId);
}

// Global function to refresh quick actions
function refreshQuickActions() {
    if (window.dcfQuickActions) {
        window.dcfQuickActions.refresh();
    }
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DCFQuickActions;
}
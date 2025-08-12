// ===================================================================
// CUSTOM NAVIGATION MODULE - Reusable Component
// ===================================================================
// Handles the complete navigation system including:
// - Portfolio+ hover animations with extension line
// - Staggered subpage animations with reverse animations
// - Smart 2-second delay system with hover persistence
// - Easy integration for any page
// ===================================================================

export class CustomNavigation {
    constructor(options = {}) {
        // Configuration options with defaults
        this.config = {
            hideDelay: options.hideDelay || 1500, // 1.5 second default delay
            animationDuration: options.animationDuration || 800, // Reverse animation cleanup
            enableLogging: options.enableLogging || false,
            ...options
        };
        
        // Initialize the navigation system
        this.init();
    }
    
    init() {
        // Find all navigation elements
        this.customNav = document.querySelector('.custom-navigation');
        this.portfolioLink = document.querySelector('.nav-link-2'); // portfolio+ link
        this.extension = document.querySelector('.nav-skeleton-extension');
        this.portfolioPages = document.querySelector('.portfolio-pages');
        this.allPortfolioLinks = document.querySelectorAll('.portfolio-link');
        
        // Validate required elements
        if (!this.validateElements()) {
            this.log('Custom navigation elements not found - skipping initialization');
            return;
        }
        
        // Initialize hover system
        this.initPortfolioHover();
        this.log('Custom navigation system initialized successfully');
    }
    
    validateElements() {
        return this.customNav && this.portfolioLink && this.extension && this.portfolioPages;
    }
    
    initPortfolioHover() {
        let hideTimeout;
        let isHiding = false;
        
        // Function to show portfolio elements
        const showPortfolio = () => {
            clearTimeout(hideTimeout);
            isHiding = false;
            
            // Remove hiding class and add showing class
            this.customNav.classList.remove('portfolio-hiding');
            this.customNav.classList.add('portfolio-hover');
            this.log('Portfolio hover activated');
        };
        
        // Function to start hiding sequence with reverse animations
        const startHideSequence = () => {
            if (isHiding) return; // Already hiding
            
            isHiding = true;
            
            // Remove showing class and add hiding class for reverse animations
            this.customNav.classList.remove('portfolio-hover');
            this.customNav.classList.add('portfolio-hiding');
            
            // After reverse animations complete, remove hiding class
            setTimeout(() => {
                this.customNav.classList.remove('portfolio-hiding');
                isHiding = false;
                this.log('Portfolio hover deactivated with reverse animations');
            }, this.config.animationDuration);
        };
        
        // Function to hide portfolio elements with configurable delay
        const hidePortfolio = () => {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                // Check if mouse is still over any interactive elements
                const isOverPortfolioLink = this.portfolioLink.matches(':hover');
                const isOverExtension = this.extension.matches(':hover');
                const isOverPortfolioPages = this.portfolioPages.matches(':hover');
                const isOverAnyPortfolioLink = Array.from(this.allPortfolioLinks).some(link => link.matches(':hover'));
                
                if (!isOverPortfolioLink && !isOverExtension && !isOverPortfolioPages && !isOverAnyPortfolioLink) {
                    startHideSequence();
                }
            }, this.config.hideDelay);
        };
        
        // Event listeners for portfolio+ link
        this.portfolioLink.addEventListener('mouseenter', showPortfolio);
        this.portfolioLink.addEventListener('mouseleave', hidePortfolio);
        
        // Event listeners for extension line
        this.extension.addEventListener('mouseenter', showPortfolio);
        this.extension.addEventListener('mouseleave', hidePortfolio);
        
        // Event listeners for portfolio pages container
        this.portfolioPages.addEventListener('mouseenter', showPortfolio);
        this.portfolioPages.addEventListener('mouseleave', hidePortfolio);
        
        // Event listeners for individual portfolio links
        this.allPortfolioLinks.forEach(link => {
            link.addEventListener('mouseenter', showPortfolio);
            link.addEventListener('mouseleave', hidePortfolio);
        });
    }
    
    // Utility function for logging
    log(message) {
        if (this.config.enableLogging) {
            console.log(`🧭 CustomNavigation: ${message}`);
        }
    }
    
    // Public method to update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Configuration updated');
    }
    
    // Public method to manually show portfolio
    showPortfolio() {
        this.customNav?.classList.remove('portfolio-hiding');
        this.customNav?.classList.add('portfolio-hover');
        this.log('Portfolio manually shown');
    }
    
    // Public method to manually hide portfolio
    hidePortfolio() {
        this.customNav?.classList.remove('portfolio-hover');
        this.customNav?.classList.add('portfolio-hiding');
        this.log('Portfolio manually hidden');
    }
    
    // Public method to destroy the navigation system
    destroy() {
        // Remove event listeners and clean up
        // Implementation would depend on specific cleanup needs
        this.log('Custom navigation system destroyed');
    }
}

// Export default for easy importing
export default CustomNavigation;
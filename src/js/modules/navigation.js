// navigation.js - Unified Floating Navigation System
// Provides consistent floating navigation behavior across all pages

class FloatingNavigation {
    constructor() {
        this.nav = null;
        this.navTrigger = null;
        this.navContent = null;
        this.navClose = null;
        this.isOpen = false;
        this.developmentMode = this.isDevelopmentMode();
        this.lockedSections = this.getLockedSections();
        this.init();
    }
    
    isDevelopmentMode() {
        // Check if we're in development mode
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.port === '3001' ||
               window.location.port === '3000';
    }
    
    getLockedSections() {
        // Define which sections should be locked in development
        // These will show as "UNDER_DEVELOPMENT" or similar
        return {
            '/store.html': {
                locked: true,
                status: 'UNDER_DEVELOPMENT',
                message: 'E-commerce integration in progress'
            },
            '/portfolio/videography.html': {
                locked: false, // Example: unlocked section
                status: 'ACTIVE',
                message: null
            },
            '/portfolio/photography.html': {
                locked: false,
                status: 'ACTIVE', 
                message: null
            },
            '/portfolio/video-editing.html': {
                locked: false,
                status: 'ACTIVE',
                message: null
            },
            '/portfolio/graphic-design.html': {
                locked: false,
                status: 'ACTIVE',
                message: null
            }
        };
    }
    
    init() {
        // Find navigation elements
        this.nav = document.querySelector('.floating-nav');
        this.navTrigger = document.getElementById('navTrigger');
        this.navContent = document.getElementById('navContent');
        this.navClose = document.getElementById('navClose');
        
        if (!this.nav || !this.navTrigger || !this.navContent) {
            console.warn('Floating navigation elements not found');
            return;
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set active page
        this.setActivePage();
        
        // Add system variations
        this.addSystemVariations();
        
        // Apply development locks if in development mode
        if (this.developmentMode) {
            this.applyDevelopmentLocks();
        }
        
        console.log('Floating navigation initialized');
    }
    
    setupEventListeners() {
        // Toggle navigation on trigger click
        this.navTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleNavigation();
        });
        
        // Close navigation on close button click
        if (this.navClose) {
            this.navClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeNavigation();
            });
        }
        
        // Close navigation on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.nav.contains(e.target)) {
                this.closeNavigation();
            }
        });
        
        // Close navigation on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeNavigation();
            }
        });
        
        // Handle navigation link clicks
        const navLinks = this.navContent.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Check if section is locked in development mode
                if (this.developmentMode && this.isLocked(href)) {
                    e.preventDefault();
                    this.showAccessDenied(href);
                    return;
                }
                
                // Add slight delay for visual feedback
                setTimeout(() => {
                    this.closeNavigation();
                }, 150);
            });
        });
    }
    
    toggleNavigation() {
        if (this.isOpen) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }
    }
    
    openNavigation() {
        this.nav.classList.add('nav-open');
        this.navTrigger.classList.add('active');
        document.body.classList.add('nav-open');
        this.isOpen = true;
        
        // Add opening animation class
        this.navContent.classList.add('opening');
        setTimeout(() => {
            this.navContent.classList.remove('opening');
        }, 300);
    }
    
    closeNavigation() {
        this.nav.classList.remove('nav-open');
        this.navTrigger.classList.remove('active');
        document.body.classList.remove('nav-open');
        this.isOpen = false;
        
        // Add closing animation class
        this.navContent.classList.add('closing');
        setTimeout(() => {
            this.navContent.classList.remove('closing');
        }, 300);
    }
    
    setActivePage() {
        // Get current page path
        const currentPath = window.location.pathname;
        const navLinks = this.navContent.querySelectorAll('.nav-link');
        
        // Remove existing active states
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Set active state based on current path
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Handle different URL patterns
            if (
                (currentPath === '/' && href === '/index.html') ||
                (currentPath === '/index.html' && href === '/index.html') ||
                (currentPath === '/home.html' && href === '/home.html') ||
                (currentPath === '/home' && href === '/home.html') ||
                (currentPath.includes('/portfolio/directing') && href === '/portfolio/directing.html') ||
                (currentPath.includes('/portfolio/videography') && href === '/portfolio/videography.html') ||
                (currentPath.includes('/portfolio/photography') && href === '/portfolio/photography.html') ||
                (currentPath.includes('/portfolio/video-editing') && href === '/portfolio/video-editing.html') ||
                (currentPath.includes('/portfolio/graphic-design') && href === '/portfolio/graphic-design.html') ||
                (currentPath.includes('/store') && href === '/store.html')
            ) {
                link.classList.add('active');
            }
        });
    }
    
    addSystemVariations() {
        // Add subtle system variations to keep the brutalist aesthetic interesting
        const variations = ['standard', 'industrial', 'minimal'];
        const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
        
        this.nav.classList.add(`nav-${selectedVariation}`);
        
        // Update system status text to reflect variation
        const statusText = this.navContent.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = `SYSTEM_${selectedVariation.toUpperCase()}`;
        }
        
        // Add random system indicators (subtle brutalist touches)
        this.addSystemIndicators(selectedVariation);
        
        console.log(`Navigation variation: ${selectedVariation}`);
    }
    
    addSystemIndicators(variation) {
        // Add subtle system elements based on variation
        const navHeader = this.navContent.querySelector('.nav-header');
        if (!navHeader) return;
        
        // Create system indicator
        const systemIndicator = document.createElement('div');
        systemIndicator.className = 'system-indicator';
        
        switch (variation) {
            case 'industrial':
                systemIndicator.innerHTML = '<span class="indicator-text">SYS_IND</span>';
                break;
            case 'minimal':
                systemIndicator.innerHTML = '<span class="indicator-line"></span>';
                break;
            default:
                systemIndicator.innerHTML = '<span class="indicator-dot"></span>';
        }
        
        navHeader.appendChild(systemIndicator);
    }
    
    isLocked(href) {
        // Check if a section is locked
        const section = this.lockedSections[href];
        return section && section.locked;
    }
    
    showAccessDenied(href) {
        // Show access denied message for locked sections
        const section = this.lockedSections[href];
        if (!section) return;
        
        // Create and show access denied notification
        this.createAccessDeniedModal(section);
    }
    
    createAccessDeniedModal(section) {
        // Remove existing modal if present
        const existingModal = document.querySelector('.access-denied-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'access-denied-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-title">ACCESS_DENIED</span>
                    <span class="modal-status">${section.status}</span>
                </div>
                <div class="modal-body">
                    <p class="modal-message">${section.message}</p>
                    <p class="modal-info">This section is temporarily locked during development.</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-close brutalist-button">CLOSE</button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .access-denied-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: modalFadeIn 0.3s ease;
            }
            
            .modal-content {
                background: #000;
                border: 2px solid #3300ff;
                max-width: 500px;
                margin: 20px;
                font-family: 'Courier New', monospace;
                color: #fff;
            }
            
            .modal-header {
                background: #3300ff;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-title {
                font-weight: bold;
                font-size: 16px;
            }
            
            .modal-status {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .modal-body {
                padding: 20px;
                line-height: 1.4;
            }
            
            .modal-message {
                margin: 0 0 10px 0;
                font-weight: bold;
            }
            
            .modal-info {
                margin: 0;
                opacity: 0.7;
                font-size: 14px;
            }
            
            .modal-footer {
                padding: 15px 20px;
                text-align: right;
                border-top: 1px solid #333;
            }
            
            .brutalist-button {
                background: #3300ff;
                color: #fff;
                border: none;
                padding: 8px 16px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .brutalist-button:hover {
                background: #4400cc;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Close modal on button click or outside click
        const closeButton = modal.querySelector('.modal-close');
        closeButton.addEventListener('click', () => {
            modal.remove();
            style.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                style.remove();
            }
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
                style.remove();
            }
        }, 5000);
    }
    
    applyDevelopmentLocks() {
        // Apply visual indicators for locked sections
        const navLinks = this.navContent.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const section = this.lockedSections[href];
            
            if (section && section.locked) {
                // Add locked indicator
                link.classList.add('nav-locked');
                
                // Add lock indicator text
                const lockIndicator = document.createElement('span');
                lockIndicator.className = 'lock-indicator';
                lockIndicator.textContent = ' [LOCKED]';
                link.appendChild(lockIndicator);
                
                // Change text color to indicate locked status
                link.style.opacity = '0.5';
                link.style.textDecoration = 'line-through';
            }
        });
        
        console.log('Development locks applied');
    }
    
    // Public methods for external control
    open() {
        this.openNavigation();
    }
    
    close() {
        this.closeNavigation();
    }
    
    toggle() {
        this.toggleNavigation();
    }
    
    isNavigationOpen() {
        return this.isOpen;
    }
    
    // Development control methods
    lockSection(href, status = 'LOCKED', message = 'Section temporarily unavailable') {
        if (this.lockedSections[href]) {
            this.lockedSections[href].locked = true;
            this.lockedSections[href].status = status;
            this.lockedSections[href].message = message;
        } else {
            this.lockedSections[href] = { locked: true, status, message };
        }
        
        if (this.developmentMode) {
            this.applyDevelopmentLocks();
        }
    }
    
    unlockSection(href) {
        if (this.lockedSections[href]) {
            this.lockedSections[href].locked = false;
            this.lockedSections[href].status = 'ACTIVE';
            this.lockedSections[href].message = null;
        }
        
        // Remove visual indicators
        const navLinks = this.navContent.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === href) {
                link.classList.remove('nav-locked');
                link.style.opacity = '';
                link.style.textDecoration = '';
                
                const lockIndicator = link.querySelector('.lock-indicator');
                if (lockIndicator) {
                    lockIndicator.remove();
                }
            }
        });
    }
}

// Initialize navigation system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.floatingNav = new FloatingNavigation();
});

// Export for external use
export { FloatingNavigation };
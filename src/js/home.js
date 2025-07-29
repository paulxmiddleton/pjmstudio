// home.js - Main entry point for home page
import { SwordCursor } from './modules/cursor.js';
import { KnightAnimations } from './modules/animations.js';
import { ParallaxEffects } from './modules/parallax.js';
import { MedievalSparkles } from './modules/sparkles.js';
import { LoadingManager } from './modules/utils.js';

class HomePage {
    constructor() {
        this.init();
    }
    
    async init() {
        // Initialize core systems
        this.loadingManager = new LoadingManager();
        this.cursorManager = new SwordCursor();
        
        // Wait for DOM to be ready
        await this.waitForDOMReady();
        
        // Initialize visual effects
        this.knightAnimations = new KnightAnimations();
        this.parallaxManager = new ParallaxEffects();
        this.sparkleSystem = new MedievalSparkles();
        
        // Initialize home-specific features
        this.initNavigation();
        this.initSmoothScroll();
        
        console.log('🏠 Home page initialized successfully');
    }
    
    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    initNavigation() {
        // Portfolio dropdown functionality
        const dropdown = document.querySelector('.nav-dropdown');
        const dropdownToggle = dropdown?.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown?.querySelector('.dropdown-menu');
        
        if (!dropdown || !dropdownToggle || !dropdownMenu) return;
        
        let isOpen = false;
        
        // Toggle dropdown on click
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            isOpen = !isOpen;
            dropdownMenu.classList.toggle('active', isOpen);
            dropdownToggle.classList.toggle('active', isOpen);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && isOpen) {
                isOpen = false;
                dropdownMenu.classList.remove('active');
                dropdownToggle.classList.remove('active');
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                isOpen = false;
                dropdownMenu.classList.remove('active');
                dropdownToggle.classList.remove('active');
            }
        });
    }
    
    initSmoothScroll() {
        // Smooth scroll for anchor links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize home page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('🏠 Home page hidden - pausing animations');
        // Pause animations when page is not visible
    } else {
        console.log('🏠 Home page visible - resuming animations');
        // Resume animations when page becomes visible
    }
});
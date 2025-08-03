// portfolio.js - Main entry point for portfolio pages
import '../styles/portfolio.scss';
import { FloatingNavigation } from './modules/navigation.js';

class PortfolioPage {
    constructor() {
        this.floatingNav = null;
        this.init();
    }
    
    async init() {
        console.log('🎯 Initializing Portfolio Page...');
        
        // Wait for DOM to be ready
        await this.waitForDOMReady();
        
        // Initialize navigation
        this.initializeNavigation();
        
        // Initialize loading screen
        this.initializeLoading();
        
        // Initialize portfolio-specific interactions
        this.initializePortfolioInteractions();
        
        console.log('✨ Portfolio page initialized successfully');
    }
    
    waitForDOMReady() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    // Loading Screen Management
    initializeLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;
        
        // Simulate loading time for dramatic effect
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            
            // Remove from DOM after transition
            setTimeout(() => {
                loadingScreen.remove();
            }, 1500);
        }, 1000); // Shorter delay for portfolio pages
    }
    
    // Floating Navigation System
    initializeNavigation() {
        const navTrigger = document.getElementById('navTrigger');
        const navContent = document.getElementById('navContent');
        const navClose = document.getElementById('navClose');
        
        if (!navTrigger || !navContent) return;
        
        let isNavigationOpen = false;
        
        const openNav = () => {
            isNavigationOpen = true;
            navTrigger.classList.add('active');
            navContent.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        const closeNav = () => {
            isNavigationOpen = false;
            navTrigger.classList.remove('active');
            navContent.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        navTrigger.addEventListener('click', () => {
            if (isNavigationOpen) {
                closeNav();
            } else {
                openNav();
            }
        });
        
        if (navClose) {
            navClose.addEventListener('click', closeNav);
        }
        
        // Close nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isNavigationOpen) {
                closeNav();
            }
        });
    }
    
    // Portfolio-specific interactions
    initializePortfolioInteractions() {
        // Project block hover effects
        const projectBlocks = document.querySelectorAll('.project-block');
        projectBlocks.forEach(block => {
            block.addEventListener('mouseenter', () => {
                block.style.transform = 'translateY(-2px)';
            });
            
            block.addEventListener('mouseleave', () => {
                block.style.transform = 'translateY(0)';
            });
        });
        
        // Service blocks interactions
        const serviceBlocks = document.querySelectorAll('.service-block');
        serviceBlocks.forEach(block => {
            block.addEventListener('click', () => {
                console.log('Service block clicked:', block.querySelector('.service-name')?.textContent);
            });
        });
    }
}

// Initialize the portfolio page
new PortfolioPage();
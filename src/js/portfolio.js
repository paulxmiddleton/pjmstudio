// portfolio.js - Main entry point for portfolio pages
import '../styles/portfolio.scss';
import { CustomNavigation } from './modules/custom-navigation.js';
import { portfolioData, getProjectBySlug, getProjectsByCategory, getAdjacentProjects, getAllCategories, getCategoryBySlug } from '../config/portfolio-data.js';
import { assetLoader } from '../config/assets.js';

class PortfolioPage {
    constructor() {
        this.customNavigation = null;
        this.projectData = null;
        this.currentCategory = null;
        this.currentProject = null;
        this.init();
    }
    
    async init() {
        console.log('🎯 Initializing Portfolio Page...');
        
        // Wait for DOM to be ready
        await this.waitForDOMReady();
        
        // Initialize data structure
        this.initializeDataStructure();
        
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
    
    // Custom Navigation System
    initializeNavigation() {
        // Initialize the custom navigation system
        this.customNavigation = new CustomNavigation({
            hideDelay: 1500, // 1.5 second delay
            enableLogging: false // Disable logging for production
        });
    }
    
    // Data Structure Management for Future Navigation
    initializeDataStructure() {
        this.loadProjectData();
        this.detectCurrentContext();
        console.log('📊 Portfolio data structure initialized');
    }
    
    loadProjectData() {
        this.projectData = portfolioData;
        console.log('📄 Project data loaded:', Object.keys(this.projectData.categories).length, 'categories');
    }
    
    detectCurrentContext() {
        // Detect current page context from URL or page title
        const pathname = window.location.pathname;
        const pageTitle = document.title;
        
        // Extract category from URL or title
        if (pathname.includes('/portfolio/')) {
            const pathParts = pathname.split('/');
            const categorySlug = pathParts[pathParts.length - 1].replace('.html', '');
            this.currentCategory = getCategoryBySlug(categorySlug);
        } else if (pageTitle.includes('|')) {
            const titleParts = pageTitle.split('|')[0].trim();
            this.currentCategory = this.findCategoryByTitle(titleParts);
        }
        
        if (this.currentCategory) {
            console.log('🎯 Detected category:', this.currentCategory.title);
        }
    }
    
    findCategoryByTitle(title) {
        const categories = getAllCategories();
        return categories.find(cat => 
            cat.title.toLowerCase() === title.toLowerCase() ||
            cat.title.replace(/\s+/g, '_').toLowerCase() === title.toLowerCase()
        ) || null;
    }
    
    // Data Management Helper Methods for Future Navigation
    getProjectData(categorySlug = null, projectSlug = null) {
        if (projectSlug && categorySlug) {
            return getProjectBySlug(categorySlug, projectSlug);
        }
        if (categorySlug) {
            return getProjectsByCategory(categorySlug);
        }
        return this.projectData;
    }
    
    getCategoryData(slug = null) {
        return slug ? getCategoryBySlug(slug) : getAllCategories();
    }
    
    findProjectBySlug(slug) {
        for (const category of getAllCategories()) {
            const project = category.projects.find(p => p.slug === slug);
            if (project) {
                return { project, category };
            }
        }
        return null;
    }
    
    // Future Navigation Integration Methods
    prepareNavigationData() {
        return {
            categories: getAllCategories(),
            currentCategory: this.currentCategory,
            currentProject: this.currentProject
        };
    }
    
    async preloadProjectAssets(categorySlug) {
        const projects = getProjectsByCategory(categorySlug);
        const imagePromises = projects
            .filter(project => project.coverImage)
            .map(project => assetLoader.loadImage(project.coverImage));
        
        try {
            await Promise.all(imagePromises);
            console.log('✅ Project assets preloaded for category:', categorySlug);
        } catch (error) {
            console.warn('⚠️ Some project assets failed to preload:', error);
        }
    }
    
    // Portfolio-specific interactions
    initializePortfolioInteractions() {
        // Portfolio card hover effects
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        portfolioCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // Project block hover effects (for individual project pages)
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
        
        // Preload assets for current category if detected
        if (this.currentCategory) {
            this.preloadProjectAssets(this.currentCategory.slug);
        }
    }
}

// Initialize the portfolio page
new PortfolioPage();
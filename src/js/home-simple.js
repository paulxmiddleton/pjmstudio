// home-simple.js - Simplified home page JavaScript
class SimpleHomePage {
    constructor() {
        this.init();
    }
    
    init() {
        this.initLoading();
        this.initCursor();
        this.initNavigation();
        this.initSmoothScroll();
        
        console.log('🏠 Simple home page initialized');
    }
    
    initLoading() {
        window.addEventListener('load', () => {
            // Show body content
            document.body.style.transition = 'opacity 0.5s ease-in';
            document.body.style.opacity = '1';
            
            // Show cursor
            const cursor = document.getElementById('customCursor');
            if (cursor) {
                cursor.style.opacity = '1';
            }
            
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 300);
        });
    }
    
    initCursor() {
        // Simple cursor tracking
        document.addEventListener('mousemove', (e) => {
            const cursor = document.getElementById('customCursor');
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        });
        
        // Sword swipe animation on click
        document.addEventListener('click', () => {
            const cursor = document.getElementById('customCursor');
            if (cursor) {
                cursor.classList.add('swiping');
                setTimeout(() => {
                    cursor.classList.remove('swiping');
                }, 300);
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SimpleHomePage();
});
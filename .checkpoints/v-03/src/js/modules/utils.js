// utils.js - Utility functions and loading management
export class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.cursor = document.getElementById('customCursor');
        
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            this.hideLoadingScreen();
        });
        
        this.cleanURLParameters();
    }
    
    hideLoadingScreen() {
        // Show body content
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
        
        // Show cursor
        if (this.cursor) {
            this.cursor.style.opacity = '1';
        }
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 300);
    }
    
    cleanURLParameters() {
        // Clean URL parameters (Facebook tracking, etc.)
        if (window.location.search.includes('fbclid')) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

export class CastlePortal {
    constructor() {
        this.castlePortal = document.getElementById('castlePortal');
        this.password = 'excalibur'; // You can change this password
        
        this.init();
    }
    
    init() {
        if (!this.castlePortal) return;
        
        this.castlePortal.addEventListener('click', (e) => {
            this.handlePortalClick(e);
        });
    }
    
    handlePortalClick(e) {
        e.preventDefault();
        const password = prompt('Speak the password to enter the castle:');
        
        if (password && password.toLowerCase() === this.password) {
            // Redirect to home page
            window.location.href = '/home.html';
        } else if (password) {
            alert('The castle remains sealed. Try again, brave one.');
        }
    }
    
    setPassword(newPassword) {
        this.password = newPassword.toLowerCase();
    }
}

export class VideoManager {
    constructor() {
        this.birdsVideo = null;
        this.init();
    }
    
    async init() {
        await this.createBirdsVideo();
        this.bindVideoEvents();
    }
    
    async createBirdsVideo() {
        // Import asset configuration
        const { assetConfig, assetLoader } = await import('../../config/assets.js');
        
        // Create video element
        this.birdsVideo = assetLoader.createVideoElement(assetConfig.videos.birds);
        
        // Insert into illustration layer
        const illustrationLayer = document.querySelector('.illustration-layer');
        if (illustrationLayer) {
            illustrationLayer.appendChild(this.birdsVideo);
            console.log('Birds video created and added to DOM');
        }
    }
    
    bindVideoEvents() {
        if (!this.birdsVideo) return;
        
        this.birdsVideo.addEventListener('loadeddata', () => {
            console.log('Birds video loaded successfully!');
        });
        
        this.birdsVideo.addEventListener('error', (e) => {
            console.error('Video error:', e);
            console.error('Video error detail:', this.birdsVideo.error);
        });
        
        this.birdsVideo.addEventListener('canplay', () => {
            console.log('Birds video ready to play');
        });
    }
    
    play() {
        if (this.birdsVideo) {
            this.birdsVideo.play().catch(e => {
                console.warn('Video autoplay failed:', e);
            });
        }
    }
    
    pause() {
        if (this.birdsVideo) {
            this.birdsVideo.pause();
        }
    }
}

// General utility functions
export const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if device is mobile
    isMobile() {
        return window.innerWidth <= 768;
    },
    
    // Check if device is tablet
    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },
    
    // Get random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Clamp number between min and max
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
};
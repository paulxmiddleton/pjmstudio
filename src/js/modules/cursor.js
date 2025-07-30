// cursor.js - Custom sword cursor functionality
export class SwordCursor {
    constructor() {
        this.cursor = document.getElementById('customCursor');
        this.mouseX = -100; // Start off-screen
        this.mouseY = -100;
        this.cursorX = -100;
        this.cursorY = -100;
        this.smoothness = 0.25; // Cursor following smoothness
        this.hasMouseMoved = false;
        
        this.init();
    }
    
    init() {
        if (!this.cursor) {
            console.warn('Sword cursor element not found. Skipping cursor initialization.');
            return;
        }
        
        // Hide cursor initially and position off-screen
        this.cursor.style.opacity = '0';
        this.cursor.style.transform = 'translate(-100px, -100px)';
        
        this.bindEvents();
        this.animate();
        this.handleMobileSetup();
    }
    
    bindEvents() {
        // Mouse movement tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Show cursor after first mouse movement
            if (!this.hasMouseMoved) {
                this.hasMouseMoved = true;
                this.cursor.style.opacity = '1';
            }
        });
        
        // Enhanced sword slash animation on click
        document.addEventListener('click', (e) => {
            this.performSwordSlash(e);
        });
        
        // Hide cursor when leaving window (only after first movement)
        document.addEventListener('mouseleave', () => {
            if (this.hasMouseMoved) {
                this.cursor.style.opacity = '0';
            }
        });
        
        document.addEventListener('mouseenter', () => {
            if (this.hasMouseMoved) {
                this.cursor.style.opacity = '1';
            }
        });
    }
    
    animate() {
        if (!this.cursor) return; // Guard against missing cursor element
        
        const dx = this.mouseX - this.cursorX;
        const dy = this.mouseY - this.cursorY;
        
        this.cursorX += dx * this.smoothness;
        this.cursorY += dy * this.smoothness;
        
        this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
        
        requestAnimationFrame(() => this.animate());
    }
    
    handleMobileSetup() {
        // Mobile cursor fix - hide until first touch
        if (window.innerWidth <= 768) {
            document.addEventListener('touchstart', () => {
                document.body.classList.add('touched');
            }, { once: true });
        }
    }
    
    performSwordSlash(e) {
        if (!this.cursor) return;
        
        // Add main slash animation
        this.cursor.classList.add('slashing');
        
        // Remove animation class after completion
        setTimeout(() => {
            this.cursor.classList.remove('slashing');
        }, 400);
    }
    
    
    show() {
        if (this.cursor) {
            this.cursor.style.opacity = '1';
        }
    }
    
    hide() {
        if (this.cursor) {
            this.cursor.style.opacity = '0';
        }
    }
}
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
        if (!this.cursor) return;
        
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
        
        // Sword swipe animation on click
        document.addEventListener('click', () => {
            this.cursor.classList.add('swiping');
            setTimeout(() => {
                this.cursor.classList.remove('swiping');
            }, 300);
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
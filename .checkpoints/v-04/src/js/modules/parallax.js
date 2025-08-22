// parallax.js - Mouse-based parallax effects
export class ParallaxEffects {
    constructor() {
        this.heraldMsg = null;
        this.socialBtns = null;
        this.mainBg = null;
        this.isDesktop = window.innerWidth > 768;
        
        // Parallax configuration
        this.config = {
            background: {
                scale: 1.05,
                intensity: 0.4
            },
            text: {
                intensity: -0.08,
                baseLeft: 40,
                baseTop: 40
            },
            social: {
                intensity: -0.05,
                baseLeft: 40,
                baseTop: 20
            }
        };
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.getElements();
        this.bindEvents();
        this.logElements();
    }
    
    getElements() {
        this.heraldMsg = document.querySelector('.herald-message');
        this.socialBtns = document.querySelector('.social-scrolls');
        this.mainBg = document.querySelector('.main-illustration');
    }
    
    logElements() {
        console.log('Parallax elements found:', {
            herald: this.heraldMsg,
            social: this.socialBtns,
            background: this.mainBg
        });
    }
    
    bindEvents() {
        // Only add mousemove listener on desktop
        if (this.isDesktop) {
            document.addEventListener('mousemove', (e) => {
                this.updateParallax(e);
            });
        }
    }
    
    updateParallax(e) {
        const x = (e.clientX - window.innerWidth / 2) / 200;
        const y = (e.clientY - window.innerHeight / 2) / 200;
        
        this.updateBackground(x, y);
        this.updateText(x, y);
        this.updateSocial(x, y);
    }
    
    updateBackground(x, y) {
        if (!this.mainBg) return;
        
        const { scale, intensity } = this.config.background;
        this.mainBg.style.transform = 
            `scale(${scale}) translate(${x * intensity}px, ${y * intensity}px)`;
    }
    
    updateText(x, y) {
        if (!this.heraldMsg) return;
        
        const { intensity, baseLeft, baseTop } = this.config.text;
        this.heraldMsg.style.left = `${baseLeft + (x * intensity)}%`;
        this.heraldMsg.style.top = `${baseTop + (y * intensity)}%`;
    }
    
    updateSocial(x, y) {
        if (!this.socialBtns) return;
        
        const { intensity, baseLeft, baseTop } = this.config.social;
        this.socialBtns.style.left = `${baseLeft + (x * intensity)}%`;
        this.socialBtns.style.top = `${baseTop + (y * intensity)}%`;
    }
}
// sparkles.js - Medieval sparkle effects
export class MedievalSparkles {
    constructor() {
        this.sparklesContainer = null;
        this.sparkleInterval = null;
        this.config = {
            interval: 600, // ms between sparkles (faster for more visibility)
            initialCount: 12, // initial sparkles on load (increased)
            initialDelay: 250, // ms between initial sparkles (faster)
            colors: ['#8B4513', '#CD853F', '#B8860B', '#A0522D', '#2E4F99', '#4682B4'], // Medieval manuscript browns, golds, blues
            symbols: ['+', '✦', '✧'], // Simple, clean symbols
            animations: {
                fadeIn: 1000, // ms (fade in)
                fadeOut: 4000, // ms (much longer visible time)
                total: 7000 // ms total lifetime (much longer overall)
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
        this.sparklesContainer = document.getElementById('sparklesContainer');
        
        if (!this.sparklesContainer) {
            console.warn('Sparkles container not found');
            return;
        }
        
        console.log('Sparkles container found!');
        this.startSparkles();
    }
    
    startSparkles() {
        // Create initial sparkles
        for (let i = 0; i < this.config.initialCount; i++) {
            setTimeout(() => {
                this.createSparkle();
            }, i * this.config.initialDelay);
        }
        
        // Start continuous sparkle creation
        this.sparkleInterval = setInterval(() => {
            this.createSparkle();
        }, this.config.interval);
    }
    
    createSparkle() {
        const sparkle = this.createSparkleElement();
        
        if (!this.sparklesContainer) return;
        
        this.sparklesContainer.appendChild(sparkle);
        
        // Force reflow
        sparkle.offsetHeight;
        
        this.animateSparkle(sparkle);
    }
    
    createSparkleElement() {
        const sparkle = document.createElement('div');
        const symbol = this.getRandomSymbol();
        const color = this.getRandomColor();
        
        sparkle.innerHTML = symbol;
        
        // Position
        sparkle.style.position = 'absolute';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 60 + '%';
        
        // Styling for clean medieval sparkles
        sparkle.style.color = color;
        sparkle.style.fontSize = (Math.random() * 8 + 18) + 'px'; // 18-26px
        sparkle.style.fontWeight = '400'; // Normal weight
        sparkle.style.fontFamily = 'serif'; // Serif for medieval feel
        sparkle.style.opacity = '0';
        sparkle.style.transform = `scale(0.8) rotate(${Math.random() * 360}deg)`; // Normal uniform scaling
        sparkle.style.transition = 'none';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.textShadow = `0 0 6px ${color}AA, 0 0 12px ${color}60, 0 0 18px ${color}30`; // Clean glow
        sparkle.style.letterSpacing = '0';
        
        return sparkle;
    }
    
    animateSparkle(sparkle) {
        const { fadeIn, fadeOut, total } = this.config.animations;
        
        // Add irregular transition timing for rough medieval feel
        const roughEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        const transitionDuration = 1.8 + (Math.random() * 0.8); // 1.8-2.6s variation
        sparkle.style.transition = `all ${transitionDuration}s ${roughEasing}`;
        
        // Fade in with normal scaling
        requestAnimationFrame(() => {
            const randomOpacity = 0.9 + Math.random() * 0.1; // 0.9-1.0 (fully visible)
            const finalScale = 1.0 + Math.random() * 0.3; // 1.0-1.3 (normal scaling)
            const randomRotation = 120 + Math.random() * 120; // 120-240 degrees
            
            sparkle.style.opacity = randomOpacity.toString();
            sparkle.style.transform = `scale(${finalScale}) rotate(${randomRotation}deg)`;
        });
        
        // Fade out with normal scaling
        const fadeOutDelay = fadeIn + (Math.random() * 1000 - 500); // ±500ms variation for longer visibility
        setTimeout(() => {
            const finalRotation = 300 + Math.random() * 120; // 300-420 degrees
            const finalScale = 0.2 + Math.random() * 0.3; // 0.2-0.5 (normal scaling)
            
            sparkle.style.opacity = '0';
            sparkle.style.transform = `scale(${finalScale}) rotate(${finalRotation}deg)`;
        }, Math.max(fadeOutDelay, 1000));
        
        // Remove after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, total);
    }
    
    getRandomSymbol() {
        const { symbols } = this.config;
        return symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    getRandomColor() {
        const { colors } = this.config;
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    destroy() {
        if (this.sparkleInterval) {
            clearInterval(this.sparkleInterval);
            this.sparkleInterval = null;
        }
        
        if (this.sparklesContainer) {
            this.sparklesContainer.innerHTML = '';
        }
    }
}
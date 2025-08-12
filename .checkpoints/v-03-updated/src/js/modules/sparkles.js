// sparkles.js - Mouse-following medieval cross sparkles
export class MedievalSparkles {
    constructor() {
        this.sparklesContainer = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseSpeed = 0;
        this.sparkleQueue = [];
        this.animationFrame = null;
        
        this.config = {
            maxSparkles: 25, // More sparkles for matrix effect
            baseSparkleRate: 0.02, // Much lower base rate for smoothness
            speedMultiplier: 0.015, // Gentler response to movement
            maxSparkleRate: 0.25, // Lower max rate for smooth flow
            sparkleLifetime: 3500, // Longer lifetime for stacking effect
            fadeInTime: 400, // Slower fade in
            fadeOutTime: 1200, // Longer fade out
            mouseRadius: 120, // Much wider spread around mouse
            minDistance: 15, // Minimum distance from mouse center
            colors: ['#ff0000', '#ff00f6', '#3300ff', '#000000'], // Neo-brutalist palette colors
            crossSize: 18, // Slightly larger base size
            crossVariations: [
                { vRatio: 1.0, hRatio: 0.85 }, // Slightly tall cross
                { vRatio: 1.1, hRatio: 0.8 }, // Moderately tall cross
                { vRatio: 0.85, hRatio: 1.0 }, // Slightly wide cross
                { vRatio: 0.8, hRatio: 1.1 }, // Moderately wide cross
                { vRatio: 0.9, hRatio: 0.9 }, // Nearly balanced cross
                { vRatio: 1.15, hRatio: 0.75 }, // Taller cross
                { vRatio: 0.75, hRatio: 1.15 }  // Wider cross
            ]
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
        
        console.log('Mouse-following sparkles initialized!');
        this.startMouseTracking();
        this.startSparkleLoop();
    }
    
    startMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Calculate mouse speed
            const deltaX = this.mouseX - this.lastMouseX;
            const deltaY = this.mouseY - this.lastMouseY;
            const currentSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Smooth speed calculation with momentum
            this.mouseSpeed = this.mouseSpeed * 0.8 + currentSpeed * 0.2;
        });
    }
    
    startSparkleLoop() {
        const animate = () => {
            this.updateSparkles();
            this.maybeCreateSparkle();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }
    
    maybeCreateSparkle() {
        // Create sparkles even with minimal movement for continuous flow
        if (this.mouseSpeed < 0.5) {
            // Very low chance for ambient sparkles when mouse is barely moving
            if (Math.random() < 0.005) {
                this.createMouseSparkle();
            }
            return;
        }
        
        // Limit number of sparkles
        if (this.sparkleQueue.length >= this.config.maxSparkles) return;
        
        // Smooth, continuous sparkle creation based on movement
        const speedFactor = Math.min(this.mouseSpeed * this.config.speedMultiplier, this.config.maxSparkleRate);
        const sparkleChance = this.config.baseSparkleRate + speedFactor;
        
        // Multiple sparkles per frame for matrix-like trailing effect
        const maxSparklesThisFrame = Math.floor(speedFactor * 8) + 1;
        for (let i = 0; i < maxSparklesThisFrame; i++) {
            if (Math.random() < sparkleChance && this.sparkleQueue.length < this.config.maxSparkles) {
                this.createMouseSparkle();
            }
        }
    }
    
    createMouseSparkle() {
        // Create sparkle with wider spread and minimum distance from mouse center
        const angle = Math.random() * Math.PI * 2;
        const distance = this.config.minDistance + Math.random() * (this.config.mouseRadius - this.config.minDistance);
        
        // Add some trailing effect based on mouse movement direction
        const trailX = (this.mouseX - this.lastMouseX) * 0.3;
        const trailY = (this.mouseY - this.lastMouseY) * 0.3;
        
        const x = this.mouseX + Math.cos(angle) * distance + trailX;
        const y = this.mouseY + Math.sin(angle) * distance + trailY;
        
        // Choose random cross variation for diversity
        const crossVariation = this.config.crossVariations[Math.floor(Math.random() * this.config.crossVariations.length)];
        
        const sparkle = this.createCrossElement(x, y, crossVariation);
        this.sparklesContainer.appendChild(sparkle);
        
        // Add to queue for lifecycle management
        const sparkleData = {
            element: sparkle,
            createdAt: Date.now(),
            x: x,
            y: y,
            variation: crossVariation
        };
        
        this.sparkleQueue.push(sparkleData);
        this.animateCrossSparkle(sparkle, crossVariation);
    }
    
    createCrossElement(x, y, variation) {
        const sparkle = document.createElement('div');
        const color = this.getRandomColor();
        const targetOpacity = this.getRandomOpacity(); // Get varied opacity
        const baseSize = this.config.crossSize + Math.random() * 8; // 18-26px for more variety
        
        // Use the provided variation ratios for consistent cross types
        const verticalLength = baseSize * variation.vRatio;
        const horizontalLength = baseSize * variation.hRatio;
        
        // Create thin, varied medieval cross
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.transform = 'translate(-50%, -50%)';
        sparkle.style.width = Math.max(verticalLength, horizontalLength) + 'px';
        sparkle.style.height = Math.max(verticalLength, horizontalLength) + 'px';
        
        // Create cross using CSS pseudo-elements with specific proportions
        sparkle.style.opacity = '0';
        sparkle.style.position = 'fixed';
        
        // Set up the cross structure with individual sizing and opacity
        sparkle.innerHTML = ''; // Safe: clearing content with empty string
        sparkle.style.setProperty('--cross-color', color);
        sparkle.style.setProperty('--target-opacity', targetOpacity);
        sparkle.style.setProperty('--vertical-length', verticalLength + 'px');
        sparkle.style.setProperty('--horizontal-length', horizontalLength + 'px');
        
        // Add CSS for the varied cross shapes (only once)
        if (!document.getElementById('medieval-cross-styles')) {
            const style = document.createElement('style');
            style.id = 'medieval-cross-styles';
            style.textContent = `
                .medieval-cross {
                    position: relative;
                    display: inline-block;
                }
                
                .medieval-cross::before,
                .medieval-cross::after {
                    content: '';
                    position: absolute;
                    background-color: var(--cross-color);
                    /* Very subtle glow for understated effect */
                    box-shadow: 
                        0 0 1px var(--cross-color);
                    filter: brightness(1.05);
                }
                
                /* Vertical line (variable length) */
                .medieval-cross::before {
                    width: 1px; /* Thin lines for delicate appearance */
                    height: var(--vertical-length);
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
                
                /* Horizontal line (variable length) */
                .medieval-cross::after {
                    width: var(--horizontal-length);
                    height: 1px; /* Thin lines for delicate appearance */
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            `;
            document.head.appendChild(style);
        }
        
        sparkle.className = 'medieval-cross';
        
        return sparkle;
    }
    
    animateCrossSparkle(sparkle, variation) {
        const { fadeInTime, fadeOutTime, sparkleLifetime } = this.config;
        const targetOpacity = parseFloat(sparkle.style.getPropertyValue('--target-opacity')) || 0.4;
        
        // Gentler fade in for smoother appearance
        requestAnimationFrame(() => {
            sparkle.style.transition = `opacity ${fadeInTime}ms ease-out, transform ${fadeInTime}ms ease-out`;
            sparkle.style.opacity = targetOpacity.toString(); // Use varied opacity
            
            // More subtle rotation for gentler effect
            const rotation = variation.vRatio > variation.hRatio ? 
                Math.random() * 10 - 5 :  // Vertical crosses: very small rotation
                Math.random() * 15 - 7.5;   // Horizontal crosses: slightly more rotation
                
            sparkle.style.transform = `translate(-50%, -50%) scale(1) rotate(${rotation}deg)`;
        });
        
        // Longer, gradual fade out for matrix-like persistence
        setTimeout(() => {
            sparkle.style.transition = `opacity ${fadeOutTime}ms ease-in, transform ${fadeOutTime}ms ease-in`;
            sparkle.style.opacity = '0';
            
            // Very gentle final transformation
            const finalRotation = variation.vRatio > variation.hRatio ?
                Math.random() * 12 - 6 :
                Math.random() * 18 - 9;
                
            sparkle.style.transform = `translate(-50%, -50%) scale(0.95) rotate(${finalRotation}deg)`;
        }, sparkleLifetime - fadeOutTime);
    }
    
    updateSparkles() {
        const now = Date.now();
        
        // Remove expired sparkles
        this.sparkleQueue = this.sparkleQueue.filter(sparkleData => {
            if (now - sparkleData.createdAt > this.config.sparkleLifetime) {
                if (sparkleData.element.parentNode) {
                    sparkleData.element.remove();
                }
                return false;
            }
            return true;
        });
        
        // Gentler mouse speed decay for smoother transitions
        this.mouseSpeed *= 0.98;
    }
    
    getRandomColor() {
        const { colors } = this.config;
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getRandomOpacity() {
        // Weighted random opacity from 20% to 80%, favoring lower values
        const rand = Math.random();
        let opacity;
        
        if (rand < 0.4) {
            // 40% chance: 20-40% opacity (most transparent)
            opacity = 0.2 + (rand / 0.4) * 0.2;
        } else if (rand < 0.7) {
            // 30% chance: 40-60% opacity (medium)
            opacity = 0.4 + ((rand - 0.4) / 0.3) * 0.2;
        } else {
            // 30% chance: 60-80% opacity (less transparent)
            opacity = 0.6 + ((rand - 0.7) / 0.3) * 0.2;
        }
        
        return opacity;
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Clean up all sparkles
        this.sparkleQueue.forEach(sparkleData => {
            if (sparkleData.element.parentNode) {
                sparkleData.element.remove();
            }
        });
        this.sparkleQueue = [];
        
        if (this.sparklesContainer) {
            this.sparklesContainer.innerHTML = ''; // Safe: clearing content with empty string
        }
    }
}
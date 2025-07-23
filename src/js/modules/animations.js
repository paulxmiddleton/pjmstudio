// animations.js - GSAP-based animations
import gsap from 'gsap';

export class KnightAnimations {
    constructor() {
        this.knightHead = document.getElementById('knightHead');
        this.knightSword = document.getElementById('knightSword');
        this.maxHeadRotation = 6; // degrees
        this.maxSwordRotation = 20; // degrees
        
        this.init();
    }
    
    init() {
        if (!this.knightHead || !this.knightSword) return;
        
        this.bindMouseTracking();
    }
    
    bindMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.updateKnightTracking(e);
        });
    }
    
    updateKnightTracking(e) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate angle from knight to mouse
        const angleX = (e.clientX - centerX) / window.innerWidth;
        const angleY = (e.clientY - centerY) / window.innerHeight;
        
        // Very subtle rotation for head
        const headRotation = angleX * this.maxHeadRotation;
        
        // Pure rotation for sword from hand
        const swordRotation = angleX * this.maxSwordRotation;
        
        gsap.to(this.knightHead, {
            rotation: headRotation,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(this.knightSword, {
            rotation: swordRotation,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

export class TextAnimations {
    constructor() {
        this.comingSoonText = document.getElementById('comingSoon');
        this.init();
    }
    
    init() {
        if (!this.comingSoonText) return;
        
        this.bindHoverEffects();
    }
    
    bindHoverEffects() {
        // Basic water ripple on hover
        this.comingSoonText.addEventListener('mouseenter', () => {
            gsap.to(this.comingSoonText, {
                scaleY: 0.9,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        this.comingSoonText.addEventListener('mouseleave', () => {
            gsap.to(this.comingSoonText, {
                scaleY: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }
}
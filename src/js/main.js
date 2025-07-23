// main.js - Main entry point for PJM Studio
import '../styles/main.scss';

// Import modules
import { SwordCursor } from './modules/cursor.js';
import { KnightAnimations, TextAnimations } from './modules/animations.js';
import { ParallaxEffects } from './modules/parallax.js';
import { MedievalSparkles } from './modules/sparkles.js';
import { LoadingManager, CastlePortal, VideoManager } from './modules/utils.js';

class PJMStudio {
    constructor() {
        this.modules = {};
        this.init();
    }
    
    init() {
        console.log('🏰 Initializing PJM Studio...');
        
        // Initialize all modules
        this.modules.loadingManager = new LoadingManager();
        this.modules.cursor = new SwordCursor();
        this.modules.knightAnimations = new KnightAnimations();
        this.modules.textAnimations = new TextAnimations();
        this.modules.parallax = new ParallaxEffects();
        this.modules.sparkles = new MedievalSparkles();
        this.modules.castlePortal = new CastlePortal();
        this.modules.videoManager = new VideoManager();
        
        console.log('⚔️ All modules initialized successfully!');
    }
    
    // Method to access modules from global scope if needed
    getModule(name) {
        return this.modules[name];
    }
    
    // Cleanup method for when leaving the page
    destroy() {
        Object.values(this.modules).forEach(module => {
            if (module.destroy && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
    }
}

// Initialize the application
const app = new PJMStudio();

// Make app available globally for debugging
window.PJMStudio = app;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    app.destroy();
});
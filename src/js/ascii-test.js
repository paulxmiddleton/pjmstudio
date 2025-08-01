// ascii-test.js - Test script for 3D ASCII engine validation
import { ASCII3DEngine } from './modules/ascii3d-engine.js';

class ASCII3DTestSuite {
    constructor() {
        this.engine = null;
        this.canvas = null;
        this.stats = {
            fps: 0,
            renderTime: 0,
            memory: 0,
            interactionCount: 0,
            morphProgress: 0
        };
        this.testModels = ['cube', 'sphere', 'torus'];
        this.currentModelIndex = 0;
        this.performanceInterval = null;
        
        this.init();
    }
    
    async init() {
        console.log('🧪 Initializing ASCII 3D Test Suite...');
        
        try {
            // Check WebGL support
            if (!this.checkWebGLSupport()) {
                this.showError('WebGL not supported. 3D ASCII engine requires WebGL.');
                return;
            }
            
            // Get canvas and initialize engine
            this.canvas = document.getElementById('ascii3dCanvas');
            if (!this.canvas) {
                this.showError('ASCII 3D canvas not found.');
                return;
            }
            
            // Initialize the 3D ASCII engine
            this.engine = new ASCII3DEngine();
            await this.engine.init(this.canvas);
            
            // Start performance monitoring
            this.startPerformanceMonitoring();
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Start engine animation
            this.engine.startAnimation();
            
            // Hide loading indicator
            this.hideLoading();
            
            // Update UI status
            this.updateEngineStatus('RUNNING');
            
            console.log('✅ ASCII 3D Test Suite initialized successfully');
            
        } catch (error) {
            console.error('❌ Test suite initialization failed:', error);
            this.showError(`Initialization failed: ${error.message}`);
        }
    }
    
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    hideLoading() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
    
    showError(message) {
        console.error('🚨', message);
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorMessage && errorText) {
            errorText.textContent = message;
            errorMessage.style.display = 'block';
        }
        
        this.hideLoading();
        this.updateEngineStatus('ERROR');
    }
    
    updateEngineStatus(status) {
        const statusElement = document.getElementById('engineStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
    
    startPerformanceMonitoring() {
        this.performanceInterval = setInterval(() => {
            if (this.engine) {
                const engineStats = this.engine.getPerformanceStats();
                this.stats = { ...this.stats, ...engineStats };
                this.updatePerformanceDisplay();
            }
        }, 1000);
    }
    
    updatePerformanceDisplay() {
        const displays = {
            'fpsDisplay': Math.round(this.stats.fps),
            'renderTimeDisplay': `${Math.round(this.stats.renderTime)}ms`,
            'memoryDisplay': `${Math.round(this.stats.memory)}MB`,
            'interactionCount': this.stats.interactionCount,
            'morphProgress': `${Math.round(this.stats.morphProgress)}%`
        };
        
        Object.entries(displays).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'r':
                    e.preventDefault();
                    this.resetEngine();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleModels();
                    break;
                case 'p':
                    e.preventDefault();
                    this.cyclePerformanceMode();
                    break;
                case 's':
                    e.preventDefault();
                    this.toggleSlowRotation();
                    break;
                case 'i':
                    e.preventDefault();
                    this.showInteractionInfo();
                    break;
                case 'escape':
                    e.preventDefault();
                    this.stopAnimation();
                    break;
            }
        });
    }
    
    // Test Methods (called from UI buttons)
    async loadModel(modelType) {
        if (!this.engine) {
            console.warn('Engine not initialized');
            return;
        }
        
        try {
            console.log(`🎯 Loading test model: ${modelType}`);
            await this.engine.loadModel(modelType);
            console.log(`✅ Model ${modelType} loaded successfully`);
        } catch (error) {
            console.error(`❌ Failed to load model ${modelType}:`, error);
            this.showError(`Failed to load model: ${error.message}`);
        }
    }
    
    changeResolution(level) {
        if (!this.engine) return;
        
        const resolutionSettings = {
            high: { width: 120, height: 60 },
            medium: { width: 80, height: 40 },
            low: { width: 60, height: 30 }
        };
        
        const settings = resolutionSettings[level];
        if (settings) {
            console.log(`🔧 Changing ASCII resolution to ${level}:`, settings);
            this.engine.setResolution(settings.width, settings.height);
        }
    }
    
    changePerformance(level) {
        if (!this.engine) return;
        
        console.log(`⚡ Setting performance level to: ${level}`);
        this.engine.setPerformanceMode(level);
    }
    
    testMorphing() {
        if (!this.engine) return;
        
        console.log('🔄 Testing morphing functionality...');
        // Simulate interaction events to trigger morphing
        const testInteractions = [
            { x: 400, y: 300 },
            { x: 500, y: 300 },
            { x: 600, y: 300 },
            { x: 500, y: 400 },
            { x: 400, y: 400 }
        ];
        
        testInteractions.forEach((pos, index) => {
            setTimeout(() => {
                this.engine.updateMousePosition(pos.x, pos.y);
                // Simulate mouse crossing different regions
                this.engine.simulateInteraction(pos.x, pos.y);
            }, index * 200);
        });
    }
    
    resetInteractions() {
        if (!this.engine) return;
        
        console.log('🔄 Resetting interactions...');
        this.engine.resetInteractions();
        this.stats.interactionCount = 0;
        this.stats.morphProgress = 0;
        this.updatePerformanceDisplay();
    }
    
    // Keyboard shortcut methods
    async resetEngine() {
        console.log('🔄 Resetting engine...');
        if (this.engine) {
            this.engine.stopAnimation();
            await this.engine.dispose();
        }
        
        // Reinitialize
        this.engine = new ASCII3DEngine();
        await this.engine.init(this.canvas);
        this.engine.startAnimation();
        this.updateEngineStatus('RESET');
        
        console.log('✅ Engine reset complete');
    }
    
    toggleModels() {
        this.currentModelIndex = (this.currentModelIndex + 1) % this.testModels.length;
        const modelType = this.testModels[this.currentModelIndex];
        console.log(`🔄 Toggling to model: ${modelType}`);
        this.loadModel(modelType);
    }
    
    cyclePerformanceMode() {
        const modes = ['high', 'medium', 'low'];
        const currentMode = this.engine?.getPerformanceMode() || 'high';
        const currentIndex = modes.indexOf(currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const nextMode = modes[nextIndex];
        
        console.log(`⚡ Cycling performance: ${currentMode} → ${nextMode}`);
        this.changePerformance(nextMode);
    }
    
    toggleSlowRotation() {
        if (!this.engine) {
            console.warn('⚠️ Engine not initialized');
            return;
        }
        
        // Check if engine has rotation speed property
        if (typeof this.engine.rotationSpeed !== 'undefined') {
            // Toggle between normal speed (0.005) and slow speed (0.001)
            const currentSpeed = this.engine.rotationSpeed || 0.005;
            const newSpeed = currentSpeed === 0.005 ? 0.001 : 0.005;
            this.engine.rotationSpeed = newSpeed;
            
            const speedLabel = newSpeed === 0.001 ? 'SLOW' : 'NORMAL';
            console.log(`🔄 Rotation speed: ${speedLabel} (${newSpeed})`);
            
            // Update UI if exists
            const statusElement = document.getElementById('rotation-status');
            if (statusElement) {
                statusElement.textContent = `Rotation: ${speedLabel}`;
            }
        } else {
            // If no rotation speed property, add it
            this.engine.rotationSpeed = 0.001;
            console.log('🔄 Slow rotation enabled (0.001)');
        }
    }
    
    showInteractionInfo() {
        if (!this.engine) return;
        
        const interactionData = this.engine.getInteractionData();
        console.log('📊 Interaction Info:', interactionData);
        
        // Show in UI or console
        alert(`Interactions: ${interactionData.count}\nCrossings: ${interactionData.crossings}\nMorph Progress: ${interactionData.morphProgress}%`);
    }
    
    stopAnimation() {
        if (this.engine) {
            console.log('⏹️ Stopping animation...');
            this.engine.stopAnimation();
            this.updateEngineStatus('STOPPED');
        }
    }
    
    // Cleanup
    destroy() {
        if (this.performanceInterval) {
            clearInterval(this.performanceInterval);
        }
        
        if (this.engine) {
            this.engine.stopAnimation();
            this.engine.dispose();
            this.engine = null;
        }
        
        console.log('🧹 Test suite cleaned up');
    }
}

// Initialize test suite
const testEngine = new ASCII3DTestSuite();

// Make available globally for UI buttons
window.testEngine = testEngine;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    testEngine.destroy();
});

console.log('🧪 ASCII 3D Test Suite loaded');
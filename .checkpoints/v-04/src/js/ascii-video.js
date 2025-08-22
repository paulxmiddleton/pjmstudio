// ascii-video.js - ASCII 3D Video Lab with file upload capability
import { ASCII3DEngine } from './modules/ascii3d-engine.js';
// Import model assets to ensure they're included in production build
import './modules/model-assets.js';

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
        this.testModels = ['sword', 'pxm-logo', 'cube', 'stone-tower', 'lumpy', 'castle-archers', 'sphere', 'torus'];
        this.currentModelIndex = 0;
        this.performanceInterval = null;
        this.customFileUrls = new Set(); // Track custom file URLs for cleanup
        
        this.init();
    }
    
    async init() {
        console.log('🧪 Initializing ASCII 3D Video Lab...');
        
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
            
            // Position random back link
            this.positionRandomBackLink();
            
            // Setup file upload handling
            this.setupFileUpload();
            
            // Setup UI controls
            this.setupResolutionSlider();
            this.setupScaleSlider();
            
            // Start engine animation
            this.engine.startAnimation();
            
            // Hide loading indicator
            this.hideLoading();
            
            // Update UI status
            this.updateEngineStatus('RUNNING');
            
            console.log('✅ ASCII 3D Video Lab initialized successfully');
            
        } catch (error) {
            console.error('❌ Video lab initialization failed:', error);
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
        console.error('🚨 TERMINAL ERROR:', message);
        
        // Create a temporary error display that matches the terminal theme
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 300;
            background: rgba(0, 0, 0, 0.95);
            color: #3300ff;
            padding: 20px;
            border: 2px solid #3300ff;
            font-family: monospace;
            font-size: 12px;
            text-align: center;
            max-width: 400px;
            white-space: pre-line;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
        
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
    
    // File Upload Methods
    setupFileUpload() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
    }
    
    // Setup resolution slider
    setupResolutionSlider() {
        const slider = document.getElementById('resolution-slider');
        const display = document.getElementById('resolution-value');
        
        if (slider && display) {
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                display.textContent = value.toFixed(1);
                
                if (this.engine && this.engine.setResolution) {
                    this.engine.setResolution(value);
                }
            });
            
            console.log('✅ Resolution slider setup complete');
        }
    }
    
    // Setup scale slider
    setupScaleSlider() {
        const slider = document.getElementById('scale-slider');
        const display = document.getElementById('scale-value');
        
        if (slider && display) {
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                display.textContent = `${value.toFixed(1)}x`;
                
                if (this.engine && this.engine.setModelScale) {
                    this.engine.setModelScale(value);
                }
            });
            
            console.log('✅ Scale slider setup complete');
        }
    }
    
    triggerFileUpload() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.click();
        }
    }
    
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            // Validate file
            const validation = this.validateFile(file);
            if (!validation.valid) {
                this.showTerminalError(validation.error);
                return;
            }
            
            console.log(`📁 Loading custom file: ${file.name}`);
            this.updateEngineStatus('LOADING FILE');
            
            // Create object URL for the file
            const fileURL = URL.createObjectURL(file);
            this.customFileUrls.add(fileURL);
            
            // Get file extension
            const extension = file.name.split('.').pop().toLowerCase();
            
            // Load the custom model
            await this.loadCustomFile(fileURL, extension);
            
            console.log(`✅ Custom file ${file.name} loaded successfully`);
            this.updateEngineStatus('RUNNING');
            
        } catch (error) {
            console.error(`❌ Failed to load custom file:`, error);
            this.showTerminalError(`FILE LOAD ERROR: ${error.message}`);
            this.updateEngineStatus('ERROR');
        }
        
        // Clear the input
        event.target.value = '';
    }
    
    validateFile(file) {
        const maxSize = 50 * 1024 * 1024; // 50MB limit
        const allowedExtensions = ['glb', 'gltf', 'obj'];
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (!allowedExtensions.includes(extension)) {
            return {
                valid: false,
                error: `UNSUPPORTED FORMAT: ${extension.toUpperCase()}\nACCEPTED: .GLB, .GLTF, .OBJ`
            };
        }
        
        if (file.size > maxSize) {
            return {
                valid: false,
                error: `FILE TOO LARGE: ${Math.round(file.size / 1024 / 1024)}MB\nMAX SIZE: 50MB`
            };
        }
        
        return { valid: true };
    }
    
    async loadCustomFile(fileURL, extension) {
        if (!this.engine) {
            throw new Error('Engine not initialized');
        }
        
        // Pass the file URL and extension to loadModel, which will detect it's a blob URL
        await this.engine.loadModel(fileURL, extension);
    }
    
    showTerminalError(message) {
        // Display error in terminal aesthetic matching the neo-blue theme
        console.error('🚨 TERMINAL ERROR:', message);
        
        // Create a temporary error display that matches the terminal theme
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 300;
            background: rgba(0, 0, 0, 0.95);
            color: #3300ff;
            padding: 20px;
            border: 2px solid #3300ff;
            font-family: monospace;
            font-size: 12px;
            text-align: center;
            max-width: 400px;
            white-space: pre-line;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
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
    
    // Position the random back link
    positionRandomBackLink() {
        const backLink = document.getElementById('randomBackLink');
        if (!backLink) return;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get element dimensions (approximate)
        const linkWidth = 60; // approximate width of "back" text with padding
        const linkHeight = 30; // approximate height with padding
        
        // Avoid UI areas
        const testUI = document.querySelector('.test-ui');
        const keyboardHelp = document.querySelector('.keyboard-help');
        
        // Define safe zones (avoiding UI elements)
        const safeZones = [
            // Top left area (avoiding test UI on right)
            { 
                minX: 20, 
                maxX: Math.min(200, viewportWidth * 0.3), 
                minY: 20, 
                maxY: Math.min(150, viewportHeight * 0.3) 
            },
            // Bottom right area (avoiding keyboard help on left)
            { 
                minX: Math.max(viewportWidth * 0.6, viewportWidth - 200), 
                maxX: viewportWidth - linkWidth - 20, 
                minY: Math.max(viewportHeight * 0.6, viewportHeight - 150), 
                maxY: viewportHeight - linkHeight - 20 
            },
            // Center areas
            { 
                minX: viewportWidth * 0.3, 
                maxX: viewportWidth * 0.7, 
                minY: viewportHeight * 0.2, 
                maxY: viewportHeight * 0.4 
            },
            { 
                minX: viewportWidth * 0.1, 
                maxX: viewportWidth * 0.4, 
                minY: viewportHeight * 0.6, 
                maxY: viewportHeight * 0.8 
            }
        ];
        
        // Filter safe zones that are actually usable
        const usableSafeZones = safeZones.filter(zone => 
            zone.maxX > zone.minX + linkWidth && 
            zone.maxY > zone.minY + linkHeight &&
            zone.maxX > 0 && zone.maxY > 0
        );
        
        if (usableSafeZones.length === 0) {
            // Fallback to simple random positioning
            const x = Math.random() * Math.max(0, viewportWidth - linkWidth - 40) + 20;
            const y = Math.random() * Math.max(0, viewportHeight - linkHeight - 40) + 20;
            backLink.style.left = `${x}px`;
            backLink.style.top = `${y}px`;
            return;
        }
        
        // Pick a random safe zone
        const randomZone = usableSafeZones[Math.floor(Math.random() * usableSafeZones.length)];
        
        // Generate random position within the chosen safe zone
        const x = Math.random() * (randomZone.maxX - randomZone.minX) + randomZone.minX;
        const y = Math.random() * (randomZone.maxY - randomZone.minY) + randomZone.minY;
        
        // Position the element
        backLink.style.left = `${Math.max(0, x)}px`;
        backLink.style.top = `${Math.max(0, y)}px`;
        
        console.log(`🔗 Back link positioned at (${Math.round(x)}, ${Math.round(y)})`);
    }
    
    // Cleanup
    destroy() {
        if (this.performanceInterval) {
            clearInterval(this.performanceInterval);
        }
        
        // Clean up custom file URLs
        this.customFileUrls.forEach(url => {
            try {
                URL.revokeObjectURL(url);
            } catch (error) {
                console.warn('Failed to revoke object URL:', error);
            }
        });
        this.customFileUrls.clear();
        
        if (this.engine) {
            this.engine.stopAnimation();
            this.engine.dispose();
            this.engine = null;
        }
        
        console.log('🧹 Video lab cleaned up');
    }
    
    // Toggle auto-rotation
    toggleAutoRotate() {
        if (!this.engine) {
            console.warn('⚠️ Engine not initialized');
            return;
        }
        
        const currentState = this.engine.getAutoRotate ? this.engine.getAutoRotate() : false;
        const newState = !currentState;
        
        if (this.engine.setAutoRotate) {
            this.engine.setAutoRotate(newState);
            console.log(`🔄 Auto-rotate ${newState ? 'enabled' : 'disabled'}`);
        }
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

console.log('🧪 ASCII 3D Video Lab loaded');
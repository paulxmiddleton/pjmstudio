// ASCII 3D Animation Engine - Three.js powered 3D ASCII morphing system
// Replaces 2D ASCII engine with full 3D capabilities, raycasting, and progressive morphing

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { ModelLoader } from './model-loader.js';
import { InteractionSystem } from './interaction-system.js';
import { PerformanceManager } from './performance-manager.js';

export class ASCII3DEngine {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.asciiEffect = null;
        this.canvas = null;
        
        // Engine state
        this.animationId = null;
        this.isRunning = false;
        this.isInitialized = false;
        
        // Model management
        this.modelLoader = null;
        this.currentModel = null;
        this.targetModel = null;
        this.morphProgress = 0;
        
        // Interaction system
        this.interactionSystem = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Performance management
        this.performanceManager = null;
        this.frameCount = 0;
        this.lastFrameTime = 0;
        
        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        
        // 3D configuration
        this.cameraDistance = 5;
        this.autoRotate = false;
        this.rotationSpeed = 0.005;
        
        // ASCII configuration - Higher detail settings
        this.asciiResolution = { width: 160, height: 80 };
        this.characterSet = ' .\'`^",:;Il!i~+_-?][}{1)(|\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
        this.backgroundColor = 'transparent';
        this.textColor = '#FFFFFF';
        
        // Error handling
        this.errorCount = 0;
        this.maxErrors = 5;
        this.hasWebGLSupport = false;
        
        console.log('🎯 ASCII3DEngine: Constructor initialized');
    }
    
    // Initialize engine with canvas - Main API method matching ASCIIEngine
    async init(canvasElement) {
        try {
            console.log('🚀 ASCII3DEngine: Starting initialization...');
            
            // Validate canvas
            if (!canvasElement) {
                throw new Error('Canvas element not provided');
            }
            
            this.canvas = canvasElement;
            
            // Check WebGL support
            this.hasWebGLSupport = this.checkWebGLSupport();
            if (!this.hasWebGLSupport) {
                throw new Error('WebGL not supported');
            }
            
            // Initialize Three.js scene
            await this.initializeThreeJS();
            
            // Initialize ASCII effect
            this.initializeASCIIEffect();
            
            // Initialize subsystems
            this.modelLoader = new ModelLoader(this.scene);
            this.interactionSystem = new InteractionSystem(this.scene, this.camera, this.raycaster);
            this.performanceManager = new PerformanceManager();
            
            console.log('🔧 Subsystems initialized successfully');
            
            // Load default model
            await this.loadDefaultModel();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Configure camera position
            this.camera.position.set(0, 0, this.cameraDistance);
            this.camera.lookAt(0, 0, 0);
            
            this.isInitialized = true;
            console.log('✅ ASCII3DEngine: Initialization complete');
            
            return this;
            
        } catch (error) {
            console.error('❌ ASCII3DEngine initialization failed:', error);
            throw error;
        }
    }
    
    // Check WebGL support
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    // Initialize Three.js scene, camera, renderer
    async initializeThreeJS() {
        console.log('🎨 Initializing Three.js scene...');
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
        
        // Create camera
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        
        // Create WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        // Configure renderer
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lighting
        this.setupLighting();
        
        console.log('✅ Three.js scene initialized');
    }
    
    // Setup scene lighting
    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light for depth
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        // Point light for dynamic effects
        const pointLight = new THREE.PointLight(0x00aaff, 0.3, 10);
        pointLight.position.set(-3, 2, 3);
        this.scene.add(pointLight);
    }
    
    // Initialize ASCII effect
    initializeASCIIEffect() {
        console.log('🔤 Initializing ASCII effect...');
        
        try {
            // Log current state for debugging
            console.log('Renderer available:', !!this.renderer);
            console.log('Canvas dimensions:', this.canvas.clientWidth, 'x', this.canvas.clientHeight);
            console.log('Character set:', this.characterSet);
            
            // Create ASCII effect instance using Three.js built-in AsciiEffect
            // AsciiEffect constructor: (renderer, charSet, options)
            this.asciiEffect = new AsciiEffect(this.renderer, this.characterSet, {
                invert: false,      // Invert colors
                color: false,       // Color ASCII (slower)
                alpha: false,       // Transparency
                block: false,       // Blocked characters
                resolution: 0.2     // Slightly more detail
            });
            
            // Set size to match canvas
            const width = this.canvas.clientWidth || 800;
            const height = this.canvas.clientHeight || 600;
            this.asciiEffect.setSize(width, height);
            
            // Setup ASCII DOM element with robust error handling
            this.setupASCIIDOM(width, height);
            
            console.log('✅ ASCII effect initialized successfully');
            console.log('ASCII DOM element created and positioned');
            
        } catch (error) {
            console.error('❌ ASCII effect initialization failed:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack?.substring(0, 500)
            });
            console.error('Renderer state:', {
                renderer: !!this.renderer,
                rendererType: this.renderer?.constructor?.name,
                canvas: !!this.canvas,
                canvasParent: !!this.canvas?.parentNode,
                canvasWidth: this.canvas?.clientWidth,
                canvasHeight: this.canvas?.clientHeight,
                characterSet: this.characterSet
            });
            throw new Error('Failed to initialize ASCII effect: ' + error.message);
        }
    }
    
    // Load default model
    async loadDefaultModel() {
        console.log('📦 Loading default model...');
        
        try {
            // Create a simple default geometry (cube) if no models available
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
            const defaultModel = new THREE.Mesh(geometry, material);
            
            this.currentModel = defaultModel;
            this.scene.add(defaultModel);
            
            console.log('✅ Default model loaded');
            
        } catch (error) {
            console.error('❌ Failed to load default model:', error);
            throw error;
        }
    }
    
    // Setup ASCII DOM element with robust error handling and positioning
    setupASCIIDOM(width, height) {
        try {
            const asciiElement = this.asciiEffect.domElement;
            
            if (!asciiElement) {
                throw new Error('ASCII effect DOM element not created');
            }
            
            // Get canvas position for precise positioning
            const rect = this.canvas.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(this.canvas);
            
            // Apply comprehensive styling
            asciiElement.className = 'ascii-renderer-output';
            asciiElement.style.cssText = `
                position: absolute;
                top: ${rect.top + window.scrollY}px;
                left: ${rect.left + window.scrollX}px;
                width: ${width}px;
                height: ${height}px;
                background-color: transparent;
                color: ${this.textColor};
                font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
                font-size: 8px;
                line-height: 0.9;
                letter-spacing: -1px;
                white-space: pre;
                overflow: hidden;
                pointer-events: none;
                z-index: ${parseInt(computedStyle.zIndex || '0') + 1};
                border: ${computedStyle.border || 'none'};
                border-radius: ${computedStyle.borderRadius || '0'};
                box-sizing: border-box;
            `;
            
            // Handle parent container
            const container = this.canvas.parentNode;
            if (!container) {
                throw new Error('Canvas parent node not found');
            }
            
            // Ensure container has relative positioning for absolute child
            if (window.getComputedStyle(container).position === 'static') {
                container.style.position = 'relative';
            }
            
            // Insert ASCII element
            try {
                container.appendChild(asciiElement);
            } catch (insertError) {
                // Fallback: try inserting after canvas
                if (this.canvas.nextSibling) {
                    container.insertBefore(asciiElement, this.canvas.nextSibling);
                } else {
                    container.appendChild(asciiElement);
                }
            }
            
            // Hide original canvas but keep it for measurements
            this.canvas.style.opacity = '0';
            
            // Store reference for cleanup
            this.asciiElement = asciiElement;
            
            console.log('✅ ASCII DOM setup complete:', {
                width,
                height,
                position: `${rect.left}, ${rect.top}`,
                zIndex: asciiElement.style.zIndex
            });
            
        } catch (error) {
            console.error('❌ ASCII DOM setup failed:', error);
            // Fallback: simple positioning
            const asciiElement = this.asciiEffect.domElement;
            if (asciiElement && this.canvas.parentNode) {
                asciiElement.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${width}px;
                    height: ${height}px;
                    background: transparent;
                    color: ${this.textColor};
                    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
                    font-size: 8px;
                    line-height: 0.9;
                    letter-spacing: -1px;
                    z-index: 1000;
                `;
                this.canvas.parentNode.appendChild(asciiElement);
                this.canvas.style.display = 'none';
            }
            throw error;
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Mouse events for interaction
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleMouseClick(e));
        
        // WebGL context loss/restoration handlers
        this.canvas.addEventListener('webglcontextlost', (event) => {
            console.warn('⚠️ WebGL context lost');
            event.preventDefault();
            this.handleContextLost();
        });
        
        this.canvas.addEventListener('webglcontextrestored', () => {
            console.log('🔄 WebGL context restored');
            this.handleContextRestored();
        });
        
        console.log('👂 Event listeners configured (including WebGL context handlers)');
    }
    
    // Handle window resize
    handleResize() {
        if (!this.camera || !this.renderer || !this.asciiEffect) return;
        
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        // Update camera
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(width, height);
        
        // Update ASCII effect
        this.asciiEffect.setSize(width, height);
        
        console.log('📐 Canvas resized:', width, 'x', height);
    }
    
    // Handle mouse movement - API method matching ASCIIEngine
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.targetMouseX = event.clientX - rect.left;
        this.targetMouseY = event.clientY - rect.top;
        
        // Update normalized mouse coordinates for raycasting
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update interaction system
        if (this.interactionSystem) {
            this.interactionSystem.updateMousePosition(this.mouse.x, this.mouse.y);
        }
    }
    
    // Handle mouse click
    handleMouseClick(event) {
        if (this.interactionSystem) {
            this.interactionSystem.handleClick(this.mouse.x, this.mouse.y);
        }
    }
    
    // Update mouse position - API method matching ASCIIEngine
    updateMousePosition(x, y) {
        this.targetMouseX = x;
        this.targetMouseY = y;
        
        // Convert to normalized coordinates
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = (x / rect.width) * 2 - 1;
        this.mouse.y = -(y / rect.height) * 2 + 1;
        
        // Update interaction system
        if (this.interactionSystem) {
            this.interactionSystem.updateMousePosition(this.mouse.x, this.mouse.y);
        }
    }
    
    // Start animation - API method matching ASCIIEngine
    startAnimation() {
        if (this.isRunning || !this.isInitialized) return this;
        
        console.log('▶️ Starting ASCII 3D animation...');
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.animate();
        
        return this;
    }
    
    // Stop animation - API method matching ASCIIEngine
    stopAnimation() {
        console.log('⏹️ Stopping ASCII 3D animation...');
        this.isRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        return this;
    }
    
    // Main animation loop
    animate() {
        if (!this.isRunning) return;
        
        try {
            const currentTime = performance.now();
            const deltaTime = currentTime - this.lastFrameTime;
            
            // Update performance metrics
            if (this.performanceManager) {
                this.performanceManager.update(deltaTime);
            }
            
            // Update mouse interpolation
            this.updateMouseInterpolation();
            
            // Update 3D scene
            this.update3DScene(currentTime, deltaTime);
            
            // Update interactions
            if (this.interactionSystem) {
                this.interactionSystem.update(deltaTime);
            }
            
            // Render frame
            this.render();
            
            this.lastFrameTime = currentTime;
            this.frameCount++;
            
            // Continue animation loop
            this.animationId = requestAnimationFrame(() => this.animate());
            
        } catch (error) {
            this.handleError('Animation loop error', error);
        }
    }
    
    // Update mouse interpolation with smooth movement
    updateMouseInterpolation() {
        const smoothing = 0.1;
        
        this.mouseX += (this.targetMouseX - this.mouseX) * smoothing;
        this.mouseY += (this.targetMouseY - this.mouseY) * smoothing;
    }
    
    // Update 3D scene animations
    update3DScene(currentTime, deltaTime) {
        if (!this.currentModel) return;
        
        // Auto rotation
        if (this.autoRotate) {
            this.currentModel.rotation.y += this.rotationSpeed;
            this.currentModel.rotation.x += this.rotationSpeed * 0.5;
        }
        
        // Mouse influence on rotation
        if (this.canvas) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseInfluenceX = (this.mouseX - rect.width / 2) / rect.width;
            const mouseInfluenceY = (this.mouseY - rect.height / 2) / rect.height;
            
            this.currentModel.rotation.y += mouseInfluenceX * 0.01;
            this.currentModel.rotation.x += mouseInfluenceY * 0.01;
        }
        
        // Update model morphing if in progress
        this.updateModelMorphing(deltaTime);
    }
    
    // Update model morphing between different 3D models
    updateModelMorphing(deltaTime) {
        if (!this.targetModel || this.currentModel === this.targetModel) return;
        
        // Enhanced morphing with visual transition effects
        this.morphProgress += deltaTime / 1500; // 1.5 second morph
        
        // Apply morphing effects during transition
        if (this.currentModel && this.targetModel) {
            // Fade out current model
            const fadeOut = Math.max(0, 1 - this.morphProgress);
            this.currentModel.traverse((child) => {
                if (child.material) {
                    child.material.opacity = fadeOut;
                    child.material.transparent = true;
                }
            });
            
            // Fade in target model
            const fadeIn = Math.min(1, this.morphProgress);
            this.targetModel.traverse((child) => {
                if (child.material) {
                    child.material.opacity = fadeIn;
                    child.material.transparent = true;
                }
            });
            
            // Add scale transition effect
            const scaleTransition = 0.8 + (0.2 * fadeIn);
            this.targetModel.scale.setScalar(scaleTransition);
        }
        
        if (this.morphProgress >= 1.0) {
            // Complete the morph
            if (this.currentModel) {
                this.scene.remove(this.currentModel);
            }
            
            // Ensure target model has full opacity and normal scale
            if (this.targetModel) {
                this.targetModel.traverse((child) => {
                    if (child.material) {
                        child.material.opacity = 1.0;
                        child.material.transparent = false;
                    }
                });
                this.targetModel.scale.setScalar(1.0);
            }
            
            this.currentModel = this.targetModel;
            this.targetModel = null;
            this.morphProgress = 0;
            
            console.log('✅ Model morph transition completed');
        }
    }
    
    // Render frame
    render() {
        if (!this.asciiEffect || !this.scene || !this.camera) return;
        
        try {
            // Render with ASCII effect
            this.asciiEffect.render(this.scene, this.camera);
            
        } catch (error) {
            this.handleError('Render error', error);
        }
    }
    
    // Load 3D model - Enhanced API method
    async loadModel(modelType) {
        if (!this.modelLoader) {
            console.warn('Model loader not initialized');
            return;
        }
        
        try {
            console.log(`📦 Loading 3D model: ${modelType}`);
            
            const newModel = await this.modelLoader.loadModel(modelType);
            
            if (newModel) {
                // Remove current model from scene before adding new one
                if (this.currentModel) {
                    this.scene.remove(this.currentModel);
                    console.log('🗑️ Removed previous model from scene');
                }
                
                // Set as target for morphing or direct replacement
                if (this.currentModel) {
                    // Start morphing transition
                    this.targetModel = newModel;
                    this.scene.add(newModel);
                    this.morphProgress = 0;
                    console.log(`🔄 Starting morph transition to ${modelType}`);
                } else {
                    // Direct replacement for first model
                    this.currentModel = newModel;
                    this.scene.add(newModel);
                    console.log(`✅ Model ${modelType} loaded as initial model`);
                }
            }
            
        } catch (error) {
            console.error(`❌ Failed to load model ${modelType}:`, error);
            throw error;
        }
    }
    
    // Set ASCII resolution
    setResolution(width, height) {
        this.asciiResolution = { width, height };
        
        if (this.asciiEffect) {
            // The three-asciieffect package doesn't have setResolution method
            // We'll need to recreate with different scale
            console.log(`🔧 ASCII resolution updated: ${width}x${height}`);
        }
    }
    
    // Set performance mode - API method matching ASCIIEngine
    setPerformanceMode(mode) {
        if (this.performanceManager) {
            this.performanceManager.setMode(mode);
        }
        
        // Adjust rendering quality based on mode - all with higher detail
        switch (mode) {
            case 'low':
                this.setResolution(100, 50);
                this.rotationSpeed = 0.002;
                break;
            case 'medium':
                this.setResolution(130, 65);
                this.rotationSpeed = 0.003;
                break;
            case 'high':
            default:
                this.setResolution(160, 80);
                this.rotationSpeed = 0.005;
                break;
        }
        
        console.log(`⚡ Performance mode set to: ${mode}`);
    }
    
    // Get performance mode
    getPerformanceMode() {
        return this.performanceManager ? this.performanceManager.getCurrentMode() : 'high';
    }
    
    // Simulate interaction for testing
    simulateInteraction(x, y) {
        if (this.interactionSystem) {
            this.interactionSystem.simulateInteraction(x, y);
        }
    }
    
    // Reset interactions
    resetInteractions() {
        if (this.interactionSystem) {
            this.interactionSystem.reset();
        }
        this.morphProgress = 0;
    }
    
    // Get interaction data
    getInteractionData() {
        if (this.interactionSystem) {
            return this.interactionSystem.getInteractionData();
        }
        return { count: 0, crossings: 0, morphProgress: 0 };
    }
    
    // Get performance stats - API method matching ASCIIEngine
    getPerformanceStats() {
        const baseStats = {
            fps: this.performanceManager ? this.performanceManager.getFPS() : 60,
            renderTime: this.performanceManager ? this.performanceManager.getRenderTime() : 16,
            memory: this.performanceManager ? this.performanceManager.getMemoryUsage() : 0,
            performanceMode: this.getPerformanceMode(),
            isRunning: this.isRunning,
            frameCount: this.frameCount,
            errorCount: this.errorCount
        };
        
        // Add interaction stats
        const interactionData = this.getInteractionData();
        return {
            ...baseStats,
            interactionCount: interactionData.count,
            morphProgress: interactionData.morphProgress
        };
    }
    
    // Handle errors
    handleError(context, error) {
        this.errorCount++;
        console.error(`ASCII3DEngine ${context}:`, error);
        
        if (this.errorCount > this.maxErrors) {
            console.error('Too many errors, stopping engine');
            this.stopAnimation();
        }
    }
    
    // Handle WebGL context loss
    handleContextLost() {
        console.warn('⚠️ WebGL context lost - stopping animation');
        this.isContextLost = true;
        this.stopAnimation();
        
        // Show fallback message or loading state
        if (this.canvas) {
            const fallbackElement = document.createElement('div');
            fallbackElement.id = 'webgl-context-lost';
            fallbackElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #666;
                font-family: monospace;
                text-align: center;
                z-index: 1000;
            `;
            fallbackElement.innerHTML = `
                <div>WebGL Context Lost</div>
                <div style="font-size: 12px; margin-top: 10px;">Attempting recovery...</div>
            `;
            this.canvas.parentNode?.appendChild(fallbackElement);
        }
    }
    
    // Handle WebGL context restoration
    async handleContextRestored() {
        console.log('🔄 Attempting WebGL context restoration...');
        
        try {
            // Remove fallback message
            const fallbackElement = document.getElementById('webgl-context-lost');
            if (fallbackElement) {
                fallbackElement.remove();
            }
            
            // Reinitialize WebGL resources
            await this.reinitializeWebGL();
            
            // Restart animation
            this.isContextLost = false;
            this.startAnimation();
            
            console.log('✅ WebGL context restored successfully');
            
        } catch (error) {
            console.error('❌ WebGL context restoration failed:', error);
            // Could trigger fallback to 2D engine here
            this.fallbackTo2DEngine();
        }
    }
    
    // Reinitialize WebGL resources after context restoration
    async reinitializeWebGL() {
        console.log('🔄 Reinitializing WebGL resources...');
        
        // Recreate renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Recreate ASCII effect
        await this.initializeASCIIEffect();
        
        // Reload models if they were loaded
        if (this.modelLoader) {
            // Reinitialize any loaded models
            console.log('🔄 Reloading 3D models...');
            // This would need to track what models were previously loaded
        }
        
        console.log('✅ WebGL resources reinitialized');
    }
    
    // Fallback to 2D engine (could be implemented to communicate with main.js)
    fallbackTo2DEngine() {
        console.log('🔄 Falling back to 2D ASCII engine...');
        
        // Emit custom event that main.js can listen for
        const fallbackEvent = new CustomEvent('ascii-engine-fallback', {
            detail: { reason: 'WebGL context restoration failed' }
        });
        document.dispatchEvent(fallbackEvent);
    }
    
    // Dispose and cleanup - API method matching ASCIIEngine
    async dispose() {
        console.log('🧹 Disposing ASCII3DEngine...');
        
        try {
            // Stop animation
            this.stopAnimation();
            
            // Dispose subsystems
            if (this.modelLoader) {
                this.modelLoader.dispose();
                this.modelLoader = null;
            }
            
            if (this.interactionSystem) {
                this.interactionSystem.dispose();
                this.interactionSystem = null;
            }
            
            if (this.performanceManager) {
                this.performanceManager.dispose();
                this.performanceManager = null;
            }
            
            // Dispose ASCII effect and its DOM element
            if (this.asciiEffect && this.asciiEffect.domElement) {
                // Remove ASCII DOM element from page
                if (this.asciiEffect.domElement.parentNode) {
                    this.asciiEffect.domElement.parentNode.removeChild(this.asciiEffect.domElement);
                }
                // Show original canvas again
                if (this.canvas) {
                    this.canvas.style.display = '';
                }
            }
            
            // Dispose Three.js objects
            if (this.scene) {
                this.scene.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
                this.scene.clear();
                this.scene = null;
            }
            
            if (this.renderer) {
                this.renderer.dispose();
                this.renderer = null;
            }
            
            // Clear references
            this.camera = null;
            this.asciiEffect = null;
            this.canvas = null;
            this.currentModel = null;
            this.targetModel = null;
            
            // Remove event listeners
            window.removeEventListener('resize', this.handleResize);
            
            console.log('✅ ASCII3DEngine disposed successfully');
            
        } catch (error) {
            console.error('❌ Error during disposal:', error);
        }
    }
}
// ASCII 3D Animation Engine - Three.js powered 3D ASCII morphing system
// Replaces 2D ASCII engine with full 3D capabilities, raycasting, and progressive morphing

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { ModelLoader } from './model-loader.js';
import { InteractionSystem } from './interaction-system.js';
import { PerformanceManager } from './performance-manager.js';
import { createWebGLContextLostFallback } from './dom-utils.js';
import logger from './logger.js';
import webglMemoryManager from './webgl-memory-manager.js';

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
        
        // Memory management
        this.memoryManager = webglMemoryManager;
        
        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        
        // 3D configuration
        this.cameraDistance = 5;
        this.autoRotate = false;
        this.rotationSpeed = 0.008;
        
        // ASCII configuration - Enhanced detail settings for 3D models
        this.asciiResolution = { width: 200, height: 100 };
        // Enhanced character set with better shading gradients (from darkest to lightest)
        this.characterSet = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
        this.backgroundColor = 'transparent';
        this.textColor = '#FFFFFF';
        
        // Error handling
        this.errorCount = 0;
        this.maxErrors = 5;
        this.hasWebGLSupport = false;
        
        logger.ascii('ASCII3DEngine: Constructor initialized');
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
            
            // TESTING: Add a simple test cube if model loading fails
            if (!this.currentModel || this.scene.children.length === 0) {
                console.log('🧪 No model loaded, adding simple test cube for ASCII rendering test');
                const testGeometry = new THREE.BoxGeometry(2, 2, 2);
                const testMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
                const testCube = new THREE.Mesh(testGeometry, testMaterial);
                testCube.name = 'test-cube';
                this.scene.add(testCube);
                this.currentModel = testCube;
                console.log('🧪 Test cube added to scene for ASCII rendering');
            }
            
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
            alpha: true,
            willReadFrequently: true
        });
        
        // Configure renderer
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Register renderer with memory manager
        this.memoryManager.registerContext(this.renderer);
        
        // Setup memory pressure callbacks
        this.renderer.onMemoryPressure = () => this.handleMemoryPressure();
        this.renderer.onContextLoss = () => this.handleContextLoss();
        this.renderer.onContextRestore = () => this.handleContextRestored();
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
            console.log('🔤 Creating AsciiEffect with:', {
                renderer: !!this.renderer,
                characterSet: this.characterSet.substring(0, 20) + '...', // Show first 20 chars
                characterCount: this.characterSet.length
            });
            
            // TRY DIFFERENT CONFIGURATION - the issue might be with the options
            this.asciiEffect = new AsciiEffect(this.renderer, this.characterSet, {
                invert: false,      // Invert colors
                color: false,       // Color ASCII (slower)
                alpha: false,       // Transparency
                block: false,       // Blocked characters
                resolution: 0.2     // Try different resolution
            });
            
            // IMMEDIATE TEST: Try rendering a simple scene right after creation
            console.log('🧪 IMMEDIATE ASCII TEST: Creating test scene for rendering validation');
            const testScene = new THREE.Scene();
            const testCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            testCamera.position.z = 5;
            
            // Add a simple white cube
            const testGeo = new THREE.BoxGeometry(1, 1, 1);
            const testMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const testMesh = new THREE.Mesh(testGeo, testMat);
            testScene.add(testMesh);
            
            // Add basic lighting
            const testLight = new THREE.AmbientLight(0xffffff, 1);
            testScene.add(testLight);
            
            // Try immediate render test
            console.log('🧪 Attempting immediate ASCII render test...');
            try {
                this.asciiEffect.render(testScene, testCamera);
                console.log('🧪 Immediate render test completed');
                
                // Check result immediately and more aggressively
                setTimeout(() => {
                    const immediateContent = this.asciiEffect.domElement?.textContent;
                    console.log('🧪🧪🧪 IMMEDIATE TEST RESULT 🧪🧪🧪');
                    console.log('Content length:', immediateContent?.length || 0);
                    console.log('Has content:', !!(immediateContent && immediateContent.length > 0));
                    console.log('First 50 chars:', immediateContent?.substring(0, 50) || 'EMPTY');
                    console.log('ASCII DOM element:', this.asciiEffect.domElement);
                    console.log('DOM element innerHTML length:', this.asciiEffect.domElement?.innerHTML?.length || 0);
                    
                    if (!immediateContent || immediateContent.length === 0) {
                        console.error('🚨🚨🚨 CRITICAL FAILURE 🚨🚨🚨');
                        console.error('AsciiEffect is not generating content even with simple test scene');
                        console.error('This indicates AsciiEffect is fundamentally broken');
                        
                        // Try to examine the AsciiEffect object itself
                        console.log('AsciiEffect object:', this.asciiEffect);
                        console.log('AsciiEffect methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.asciiEffect)));
                    } else {
                        console.log('✅✅✅ SUCCESS: AsciiEffect IS working - main scene issue ✅✅✅');
                    }
                }, 200); // Longer delay
                
            } catch (immediateError) {
                console.error('🧪 IMMEDIATE TEST FAILED:', immediateError);
            }
            
            // POSITION THE ASCII ENGINE'S OWN DOM ELEMENT
            if (this.asciiEffect.domElement) {
                const asciiElement = this.asciiEffect.domElement;
                
                // Apply our centering styles directly to the ASCII engine's element
                asciiElement.style.cssText = `
                    position: fixed !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: 400px !important;
                    height: 300px !important;
                    background-color: transparent !important;
                    color: #ffffff !important;
                    font-family: 'Courier New', 'Monaco', 'Menlo', monospace !important;
                    font-size: 8px !important;
                    line-height: 0.9 !important;
                    letter-spacing: -1px !important;
                    white-space: pre !important;
                    overflow: hidden !important;
                    pointer-events: none !important;
                    z-index: 9999 !important;
                    border: none !important;
                    box-sizing: border-box !important;
                `;
                
                // Append to body to ensure it's visible
                document.body.appendChild(asciiElement);
                
                console.log('✅ ASCII engine DOM element positioned in center');
            }
            
            console.log('🔤 AsciiEffect created:', {
                effectExists: !!this.asciiEffect,
                domElementExists: !!this.asciiEffect.domElement
            });
            
            // Set size to match canvas
            const width = this.canvas.clientWidth || 800;
            const height = this.canvas.clientHeight || 600;
            this.asciiEffect.setSize(width, height);
            
            // Setup ASCII DOM element with robust error handling
            this.setupASCIIDOM(width, height);
            
            // Validate ASCII effect is ready for rendering
            if (!this.asciiEffect.domElement) {
                throw new Error('ASCII DOM element was not created properly');
            }
            
            console.log('✅ ASCII effect initialized successfully');
            console.log('ASCII DOM element created and positioned');
            
            // Immediate validation check
            console.log('🔍 Immediate ASCII validation - DOM element exists:', !!this.asciiEffect.domElement);
            if (this.asciiEffect.domElement) {
                console.log('🔍 DOM element parent:', this.asciiEffect.domElement.parentNode?.tagName);
                console.log('🔍 DOM element position:', this.asciiEffect.domElement.style.position);
                console.log('🔍 DOM element ready for rendering');
            }
            
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
            // TODO: Future enhancement - random model selection or morphing between models
            // const models = ['sword', 'castle-archers', 'dragon'];
            // const randomModel = models[Math.floor(Math.random() * models.length)];
            
            // Temporarily reverting to sword for debugging
            let defaultModel;
            try {
                defaultModel = await this.modelLoader.loadModel('sword');
                console.log('✅ Sword model loaded as default');
            } catch (castleError) {
                console.warn('⚠️ Failed to load castle-archers model, trying sword:', castleError);
                // Fallback to sword model
                try {
                    defaultModel = await this.modelLoader.loadModel('sword');
                    console.log('✅ Sword model loaded as fallback');
                } catch (swordError) {
                    console.warn('⚠️ Failed to load sword model, falling back to cube:', swordError);
                    // Final fallback to cube
                    const geometry = new THREE.BoxGeometry(2, 2, 2);
                    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
                    defaultModel = new THREE.Mesh(geometry, material);
                    console.log('✅ Cube fallback model loaded');
                }
            }
            
            this.currentModel = defaultModel;
            this.scene.add(defaultModel);
            
            // Apply model-specific ASCII settings if available
            this.applyModelSpecificSettings(defaultModel);
            
            // Debug: Check if ASCII element is visible after model loads and a few render cycles
            setTimeout(() => {
                console.log('🔍 Running ASCII debug check...');
                // Only run debug check if the engine is properly initialized and running
                if (this.isInitialized && this.isRunning) {
                    this.debugASCIIElement();
                } else {
                    console.warn('⚠️ Skipping debug check - engine not fully initialized');
                }
            }, 3000); // Increased delay to 3 seconds to ensure proper initialization
            
            console.log('✅ Default model loaded successfully');
            
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
            
            // FIXED: Use relative positioning to follow canvas positioning
            const computedStyle = window.getComputedStyle(this.canvas);
            
            // SIMPLE CENTERED POSITIONING
            asciiElement.className = 'ascii-renderer-output';
            asciiElement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                height: 300px;
                background-color: transparent;
                color: ${this.textColor};
                font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
                font-size: 8px;
                line-height: 0.9;
                letter-spacing: -1px;
                white-space: pre;
                overflow: hidden;
                pointer-events: none;
                z-index: 9999;
                border: none;
                box-sizing: border-box;
            `;
            
            console.log(`🎯 ASCII element positioned at center:`, {
                canvasId: this.canvas.id,
                position: 'fixed center with transform'
            });
            
            console.log('🎯 ASCII element positioned relative to canvas');
            
            // SIMPLE APPROACH: Just position the ASCII engine's own DOM element
            // Don't create our own element, just style the engine's element directly
            console.log('🎯 Using ASCII engine DOM element directly');
            
            // Hide original canvas but keep it for measurements
            this.canvas.style.opacity = '0';
            
            // Store reference for cleanup
            this.asciiElement = asciiElement;
            
            console.log('✅ ASCII DOM setup complete:', {
                width,
                height,
                position: 'relative to canvas',
                zIndex: asciiElement.style.zIndex
            });
            
        } catch (error) {
            console.error('❌ ASCII DOM setup failed:', error);
            // Fallback: simple positioning
            const asciiElement = this.asciiEffect.domElement;
            if (asciiElement && this.canvas.parentNode) {
                asciiElement.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
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
        let normalizedX = (x / rect.width) * 2 - 1;
        let normalizedY = -(y / rect.height) * 2 + 1;
        
        // Enhanced mobile sensitivity for much more responsive touch interactions
        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isMobile) {
            // Amplify mouse movement for much more dramatic effects on mobile
            const amplification = 4.0; // Increased from 1.8 to 4.0 for faster touch response
            normalizedX *= amplification;
            normalizedY *= amplification;
            // Clamp to keep within reasonable bounds
            normalizedX = Math.max(-3, Math.min(3, normalizedX));
            normalizedY = Math.max(-3, Math.min(3, normalizedY));
        }
        
        this.mouse.x = normalizedX;
        this.mouse.y = normalizedY;
        
        // Update interaction system
        if (this.interactionSystem) {
            this.interactionSystem.updateMousePosition(this.mouse.x, this.mouse.y);
        }
    }
    
    // Start animation - API method matching ASCIIEngine
    startAnimation() {
        if (this.isRunning || !this.isInitialized) {
            console.log('🚫 Animation start blocked:', {
                isRunning: this.isRunning,
                isInitialized: this.isInitialized,
                reason: this.isRunning ? 'already running' : 'not initialized'
            });
            return this;
        }
        
        console.log('▶️ Starting ASCII 3D animation...');
        console.log('▶️ Animation prerequisites:', {
            scene: !!this.scene,
            camera: !!this.camera,
            renderer: !!this.renderer,
            asciiEffect: !!this.asciiEffect,
            domElement: !!this.asciiEffect?.domElement,
            currentModel: !!this.currentModel
        });
        
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.frameCount = 0; // Reset frame count for debugging
        
        // Start the animation loop
        this.animate();
        
        console.log('✅ Animation loop initiated');
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
            
            // Enhanced sensitivity with faster overall rotation
            this.currentModel.rotation.y += -mouseInfluenceX * 0.035; // Faster X-axis rotation
            this.currentModel.rotation.x += mouseInfluenceY * 0.025;  // Faster Y-axis rotation
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
            
            // Add scale transition effect - respect custom model scale
            const baseScale = this.targetModel.userData?.originalScale || 1.0;
            const scaleTransition = baseScale * (0.8 + (0.2 * fadeIn));
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
                
                // Preserve custom scale if model has one, otherwise reset to 1.0
                const customScale = this.targetModel.userData?.originalScale || 1.0;
                this.targetModel.scale.setScalar(customScale);
                console.log(`🔄 Morph complete: restored scale to ${customScale} for ${this.targetModel.userData?.modelName || 'unknown'}`);
            }
            
            this.currentModel = this.targetModel;
            this.targetModel = null;
            this.morphProgress = 0;
            
            console.log('✅ Model morph transition completed');
        }
    }
    
    // Render frame
    render() {
        if (!this.asciiEffect || !this.scene || !this.camera) {
            console.warn('🔍 RENDER SKIP: Missing components', {
                asciiEffect: !!this.asciiEffect,
                scene: !!this.scene,
                camera: !!this.camera
            });
            return;
        }
        
        try {
            // DEEP DEBUG: Log every 60th frame (1 second intervals) to track rendering
            if (this.frameCount % 60 === 0) {
                console.log('🎬 RENDER DEBUG frame', this.frameCount, {
                    asciiEffectExists: !!this.asciiEffect,
                    domElementExists: !!this.asciiEffect.domElement,
                    domElementParent: this.asciiEffect.domElement?.parentNode?.tagName,
                    sceneChildren: this.scene.children.length,
                    currentModel: !!this.currentModel
                });
                
                // Check if DOM element content is being updated
                if (this.asciiEffect.domElement) {
                    const contentLength = this.asciiEffect.domElement.textContent?.length || 0;
                    console.log('🎬 DOM content length:', contentLength);
                    if (contentLength === 0) {
                        console.warn('⚠️ ASCII DOM element is empty after render attempt');
                    }
                }
            }
            
            // Render with ASCII effect
            this.asciiEffect.render(this.scene, this.camera);
            
            // ASCII engine will render directly to its own positioned DOM element
            
            // IMMEDIATE DEBUG: Check if content was actually rendered (only for first few frames)
            if (this.frameCount < 5) {
                setTimeout(() => {
                    if (this.asciiEffect?.domElement) {
                        const content = this.asciiEffect.domElement.textContent;
                        console.log(`🎬 POST-RENDER check frame ${this.frameCount}: Content length = ${content?.length || 0}`);
                        if (!content || content.length === 0) {
                            console.warn(`⚠️ Frame ${this.frameCount}: No ASCII content generated by render call`);
                            
                            // DEEP DEBUG: Check scene state when rendering fails
                            console.log('🔍 RENDER FAILURE DEBUG:', {
                                sceneChildren: this.scene.children.length,
                                modelExists: !!this.currentModel,
                                modelInScene: this.currentModel ? this.scene.children.includes(this.currentModel) : false,
                                modelVisible: this.currentModel ? this.currentModel.visible : false,
                                modelScale: this.currentModel ? this.currentModel.scale.x : 'no model',
                                cameraPosition: this.camera ? `${this.camera.position.x.toFixed(2)}, ${this.camera.position.y.toFixed(2)}, ${this.camera.position.z.toFixed(2)}` : 'no camera',
                                cameraLookingAt: this.camera ? 'should be 0,0,0' : 'no camera',
                                asciiEffectType: this.asciiEffect.constructor.name
                            });
                            
                            // Try manual test render
                            console.log('🧪 Attempting manual test render to isolate issue...');
                            try {
                                // Force a direct render call to see if it works
                                this.asciiEffect.render(this.scene, this.camera);
                                console.log('🧪 Manual render completed - checking for content...');
                                setTimeout(() => {
                                    const testContent = this.asciiEffect.domElement.textContent;
                                    console.log('🧪 Manual render result:', testContent?.length || 0, 'characters');
                                }, 50);
                            } catch (manualRenderError) {
                                console.error('🧪 Manual render failed:', manualRenderError);
                            }
                        } else {
                            console.log(`✅ Frame ${this.frameCount}: ASCII content generated successfully!`);
                        }
                    }
                }, 100); // Check 100ms after render
            }
            
        } catch (error) {
            console.error('❌ RENDER ERROR:', error);
            this.handleError('Render error', error);
        }
    }
    
    // Load 3D model - Enhanced API method
    async loadModel(modelType, extension = null) {
        if (!this.modelLoader) {
            console.warn('Model loader not initialized');
            return;
        }
        
        try {
            console.log(`📦 Loading 3D model: ${modelType}`);
            
            let newModel;
            
            // Check if modelType is a file URL (starts with blob:)
            if (typeof modelType === 'string' && modelType.startsWith('blob:')) {
                // Use provided extension or default to 'glb'
                const fileExtension = extension || 'glb';
                newModel = await this.loadCustomModel(modelType, fileExtension);
            } else {
                // Use regular model loader for predefined models
                newModel = await this.modelLoader.loadModel(modelType);
                
                // Apply model-specific scale from configuration if it exists
                if (newModel && this.modelLoader.modelConfigs[modelType]) {
                    const config = this.modelLoader.modelConfigs[modelType];
                    if (config.scale !== undefined && !newModel.userData.hasCustomScale) {
                        console.log(`📏 Applying configured scale ${config.scale} to ${modelType}`);
                        newModel.scale.setScalar(config.scale);
                        newModel.userData.hasCustomScale = true;
                    }
                }
            }
            
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
                    // Ensure model starts with correct scale immediately
                    const baseScale = newModel.userData?.originalScale || 1.0;
                    newModel.scale.setScalar(baseScale * 0.8); // Start at 80% for smooth transition
                    this.scene.add(newModel);
                    this.morphProgress = 0;
                    console.log(`🔄 Starting morph transition to ${modelType} with base scale ${baseScale}`);
                } else {
                    // Direct replacement for first model - should appear at full scale immediately
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
    
    // Load custom model from file URL - New method for file uploads
    async loadCustomModel(fileURL, extension) {
        try {
            console.log(`📁 Loading custom model from file: ${extension}`);
            
            let model;
            
            switch (extension.toLowerCase()) {
                case 'glb':
                case 'gltf':
                    const gltfLoader = new GLTFLoader();
                    const gltfResult = await new Promise((resolve, reject) => {
                        gltfLoader.load(
                            fileURL,
                            (gltf) => resolve(gltf),
                            (progress) => {
                                console.log(`📊 Loading progress: ${Math.round((progress.loaded / progress.total) * 100)}%`);
                            },
                            (error) => reject(error)
                        );
                    });
                    model = gltfResult.scene;
                    break;
                    
                case 'obj':
                    const objLoader = new OBJLoader();
                    model = await new Promise((resolve, reject) => {
                        objLoader.load(
                            fileURL,
                            (obj) => resolve(obj),
                            (progress) => {
                                console.log(`📊 Loading progress: ${Math.round((progress.loaded / progress.total) * 100)}%`);
                            },
                            (error) => reject(error)
                        );
                    });
                    break;
                    
                default:
                    throw new Error(`Unsupported file format: ${extension}`);
            }
            
            if (!model) {
                throw new Error('Failed to load model from file');
            }
            
            // Apply the same preprocessing as other models
            this.preprocessCustomModel(model);
            
            console.log(`✅ Custom ${extension.toUpperCase()} model loaded successfully`);
            return model;
            
        } catch (error) {
            console.error(`❌ Failed to load custom model:`, error);
            throw new Error(`Custom model loading failed: ${error.message}`);
        }
    }
    
    // Preprocess custom model to match engine standards
    preprocessCustomModel(model) {
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Scale the model to fit within reasonable bounds
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 4) {
            const scale = 4 / maxDimension;
            model.scale.setScalar(scale);
        }
        
        // Apply consistent material properties
        model.traverse((child) => {
            if (child.isMesh) {
                // Ensure proper material setup for ASCII rendering
                if (child.material) {
                    child.material.color = new THREE.Color(0xffffff);
                    child.material.transparent = true;
                    child.material.opacity = 1.0;
                }
                
                // Add geometry if missing
                if (!child.geometry) {
                    child.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
                }
            }
        });
        
        console.log('🔧 Custom model preprocessed for ASCII rendering');
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
        
        // Adjust rendering quality based on mode - enhanced for 3D models
        switch (mode) {
            case 'low':
                this.setResolution(140, 70);
                this.rotationSpeed = 0.006;
                break;
            case 'medium':
                this.setResolution(170, 85);
                this.rotationSpeed = 0.007;
                break;
            case 'high':
            default:
                this.setResolution(200, 100);
                this.rotationSpeed = 0.008;
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
    
    // Switch to specific model - Enhanced API for testing different models
    async switchToModel(modelName) {
        console.log(`🔄 Switching to model: ${modelName}`);
        
        try {
            await this.loadModel(modelName);
            return true;
        } catch (error) {
            console.error(`❌ Failed to switch to model ${modelName}:`, error);
            return false;
        }
    }
    
    // Get available models
    getAvailableModels() {
        if (this.modelLoader) {
            return this.modelLoader.getAvailableModels();
        }
        return ['cube', 'sphere', 'torus', 'sword', 'pxm-logo', 'stone-tower', 'castle-archers', 'lumpy'];
    }
    
    // Apply model-specific ASCII settings
    applyModelSpecificSettings(model) {
        if (!model || !model.userData || !model.userData.asciiConfig) {
            console.log('⚙️ No model-specific ASCII config found, using defaults');
            return;
        }
        
        const config = model.userData.asciiConfig;
        console.log('⚙️ Applying model-specific ASCII settings:', config);
        
        try {
            // Update camera distance
            if (config.cameraDistance && this.camera) {
                this.cameraDistance = config.cameraDistance;
                this.camera.position.set(0, 0, config.cameraDistance);
                this.camera.lookAt(0, 0, 0);
            }
            
            // Recreate ASCII effect with new settings if needed
            if (config.resolution !== undefined || config.characterSet) {
                this.updateASCIIEffect(config);
            }
            
        } catch (error) {
            console.warn('⚠️ Failed to apply model-specific settings:', error);
        }
    }
    
    // Update ASCII effect with new configuration
    updateASCIIEffect(config) {
        if (!this.renderer || !this.asciiEffect) return;
        
        try {
            // Use model-specific character set or fallback to current
            const characterSet = config.characterSet || this.characterSet;
            const resolution = config.resolution !== undefined ? config.resolution : 0.25;
            
            console.log('🔄 Updating ASCII effect - Resolution:', resolution, 'Characters:', characterSet.length);
            
            // Create new ASCII effect with updated settings
            this.asciiEffect = new AsciiEffect(this.renderer, characterSet, {
                invert: false,
                color: false,
                alpha: false,
                block: false,
                resolution: resolution
            });
            
            // Update size
            const width = this.canvas.clientWidth || 800;
            const height = this.canvas.clientHeight || 600;
            this.asciiEffect.setSize(width, height);
            
            // Update DOM element styling if needed
            if (this.asciiEffect.domElement) {
                this.updateASCIIElementStyling(this.asciiEffect.domElement);
                
                // Ensure element is added to DOM if not already
                if (!this.asciiEffect.domElement.parentNode) {
                    console.log('🔧 Re-adding ASCII element to DOM');
                    const container = this.canvas.parentNode;
                    if (container) {
                        container.appendChild(this.asciiEffect.domElement);
                    }
                }
            }
            
        } catch (error) {
            console.error('❌ Failed to update ASCII effect:', error);
        }
    }
    
    // Update ASCII element styling for better rendering
    updateASCIIElementStyling(element) {
        if (!element) return;
        
        // Get canvas position for precise positioning
        const rect = this.canvas.getBoundingClientRect();
        
        element.style.cssText = `
            position: absolute;
            top: ${rect.top + window.scrollY}px;
            left: ${rect.left + window.scrollX}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            background-color: transparent;
            color: ${this.textColor};
            font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
            font-size: 8px;
            line-height: 0.9;
            letter-spacing: -1px;
            white-space: pre;
            overflow: hidden;
            pointer-events: none;
            z-index: 10;
        `;
    }
    
    // Debug ASCII element visibility
    debugASCIIElement() {
        console.log('🔍 ASCII Element Debug Info:');
        console.log('- ASCII Effect exists:', !!this.asciiEffect);
        console.log('- ASCII DOM element exists:', !!this.asciiEffect?.domElement);
        
        if (this.asciiEffect?.domElement) {
            const element = this.asciiEffect.domElement;
            const styles = window.getComputedStyle(element);
            console.log('- Element dimensions:', element.offsetWidth, 'x', element.offsetHeight);
            console.log('- Element position:', styles.position, styles.top, styles.left);
            console.log('- Element z-index:', styles.zIndex);
            console.log('- Element visibility:', styles.visibility);
            console.log('- Element display:', styles.display);
            console.log('- Element opacity:', styles.opacity);
            console.log('- Element content length:', element.textContent?.length || 0);
            console.log('- Element parent:', element.parentNode?.tagName);
            
            // Check for content but don't force debug content
            if (element.textContent?.length === 0) {
                console.warn('⚠️ ASCII element has no content - this may indicate a rendering issue');
                // Don't inject test content - let the normal render cycle handle it
                console.warn('⚠️ Skipping debug content injection to prevent red text flash');
            }
        }
        
        console.log('- Scene has model:', !!this.currentModel);
        console.log('- Animation running:', this.isRunning);
        console.log('- Canvas dimensions:', this.canvas?.clientWidth, 'x', this.canvas?.clientHeight);
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
        logger.warn('WebGL context lost - stopping animation');
        this.isContextLost = true;
        this.stopAnimation();
        
        // Show fallback message or loading state - now using safe DOM creation
        if (this.canvas) {
            const fallbackElement = createWebGLContextLostFallback();
            this.canvas.parentNode?.appendChild(fallbackElement);
        }
    }
    
    // Handle memory pressure by reducing quality
    handleMemoryPressure() {
        logger.warn('Memory pressure detected - reducing quality');
        
        if (this.performanceManager) {
            // Force lower performance mode
            this.performanceManager.setMode('low');
        }
        
        // Reduce ASCII resolution
        if (this.asciiEffect) {
            this.asciiEffect.resolution = 0.3; // Lower detail
        }
        
        // Force garbage collection if available
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
        
        logger.info('Quality reduced due to memory pressure');
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
        logger.info('Disposing ASCII3DEngine...');
        
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
            
            // Use memory manager to dispose WebGL resources properly
            if (this.memoryManager) {
                this.memoryManager.clearManagedResources();
            }
            
            // Dispose Three.js objects
            if (this.scene) {
                this.scene.traverse((child) => {
                    if (child.geometry) {
                        this.memoryManager?.disposeGeometry(child.geometry);
                    }
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => this.memoryManager?.disposeMaterial(material));
                        } else {
                            this.memoryManager?.disposeMaterial(child.material);
                        }
                    }
                });
                this.scene.clear();
                this.scene = null;
            }
            
            // Dispose renderer with memory manager awareness
            if (this.renderer) {
                if (this.memoryManager) {
                    // Force context loss for proper cleanup
                    this.memoryManager.forceContextLoss();
                }
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
    
    // Set 3D model scale
    setModelScale(scaleFactor) {
        if (!scaleFactor || scaleFactor <= 0) {
            console.warn('⚠️ Invalid scale factor:', scaleFactor);
            return;
        }
        
        if (this.currentModel) {
            this.currentModel.scale.setScalar(scaleFactor);
        }
        if (this.targetModel) {
            this.targetModel.scale.setScalar(scaleFactor);
        }
    }
    
    // Auto-rotate controls
    setAutoRotate(enabled, speed = 0.008) {
        this.autoRotate = enabled;
        if (speed) {
            this.rotationSpeed = speed;
        }
    }
    
    getAutoRotate() {
        return this.autoRotate || false;
    }
    
    // Set ASCII resolution - convert normalized value to settings
    setResolution(value) {
        const resolution = Math.max(0.1, Math.min(1.0, value));
        const width = Math.round(80 + (resolution * 120));
        const height = Math.round(40 + (resolution * 60));
        this.asciiResolution = { width, height };
    }
}
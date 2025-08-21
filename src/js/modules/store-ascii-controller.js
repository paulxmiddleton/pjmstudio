// ===================================================================
// STORE ASCII CONTROLLER - Easy Background ASCII Engine Management
// ===================================================================
// Manages 3 ASCII engines for store page background ornaments
// Features: Easy positioning, coloring, sizing controls
// ===================================================================

import { ASCII3DEngine } from './ascii3d-engine.js';
import { MODEL_WEIGHTS } from './model-loader.js';

export class StoreAsciiController {
    constructor(config = {}) {
        // Easy configuration options - ADJUST THESE VALUES
        this.config = {
            // === GROUP POSITIONING ===
            groupOffset: { x: '0%', y: '0%' }, // Group offset - move all cubes together
            
            // === SIMPLE SINGLE ELEMENT ===
            enableRandomization: false,       // DISABLED - No auto randomization
            
            // === THREE EVENLY SPACED CUBES ===
            engines: [
                {
                    id: 'storeAsciiCanvas1',
                    model: 'cube',            // Simple cube model
                    position: { x: '25%', y: '35%' },   // Left position
                    size: { width: 520, height: 390 }, // 30% larger size
                    scale: 3.0,               // Moderate scale
                    color: '#ffffff',         // White for contrast
                    autoRotate: true,         // Simple auto rotation
                    rotationSpeed: 0.01,      // Visible rotation
                    opacity: 1.0              // Fully opaque for better visibility
                },
                {
                    id: 'storeAsciiCanvas2',
                    model: 'cube',            // Simple cube model
                    position: { x: '50%', y: '35%' },   // Center position
                    size: { width: 520, height: 390 }, // 30% larger size
                    scale: 3.0,               // Moderate scale
                    color: '#ffffff',         // White for contrast
                    autoRotate: true,         // Simple auto rotation
                    rotationSpeed: 0.01,      // Visible rotation
                    opacity: 1.0              // Fully opaque for better visibility
                },
                {
                    id: 'storeAsciiCanvas3',
                    model: 'cube',            // Simple cube model
                    position: { x: '75%', y: '35%' },   // Right position
                    size: { width: 520, height: 390 }, // 30% larger size
                    scale: 3.0,               // Moderate scale
                    color: '#ffffff',         // White for contrast
                    autoRotate: true,         // Simple auto rotation
                    rotationSpeed: 0.01,      // Visible rotation
                    opacity: 1.0              // Fully opaque for better visibility
                }
            ],
            // === GLOBAL SETTINGS ===
            enableEngines: true,          // Master on/off switch
            enableLogging: false,         // Console logging
            zIndex: -1,                  // Far behind content (negative z-index)
            performanceMode: 'medium',   // Use MEDIUM mode for balanced performance and visibility
            ...config
        };
        
        this.engines = [];
        this.initialized = false;
        this.randomizationTimer = null;
        this.currentRandomModel = null;
    }
    
    async init() {
        if (!this.config.enableEngines) {
            console.log('🎨 ASCII engines disabled in config');
            return;
        }
        
        try {
            console.log('🎨 Initializing store ASCII background engines...');
            console.log(`🎨 Found ${this.config.engines.length} engine configurations`);
            
            // First, check if canvases exist in DOM
            console.log('🎨 Checking canvas elements in DOM...');
            const allCanvases = document.querySelectorAll('canvas');
            console.log(`🎨 Found ${allCanvases.length} canvas elements:`, Array.from(allCanvases).map(c => c.id));
            
            for (const engineConfig of this.config.engines) {
                const canvas = document.getElementById(engineConfig.id);
                console.log(`🎨 Canvas ${engineConfig.id}: ${canvas ? 'EXISTS' : 'NOT FOUND'}`);
                if (canvas) {
                    console.log(`🎨 Canvas ${engineConfig.id} details:`, {
                        offsetWidth: canvas.offsetWidth,
                        offsetHeight: canvas.offsetHeight,
                        style: canvas.style.cssText,
                        visible: canvas.offsetParent !== null
                    });
                }
            }
            
            // Initialize each engine
            for (let i = 0; i < this.config.engines.length; i++) {
                const engineConfig = this.config.engines[i];
                console.log(`🎨 Initializing engine ${i + 1}/${this.config.engines.length}: ${engineConfig.id}`);
                
                try {
                    await this.initEngine(engineConfig);
                    console.log(`✅ Engine ${engineConfig.id} initialized successfully`);
                } catch (error) {
                    console.error(`❌ Engine ${engineConfig.id} failed to initialize:`, error);
                }
            }
            
            this.initialized = true;
            console.log(`🎨 Initialization complete. Active engines: ${this.engines.length}/${this.config.engines.length}`);
            
            // Debug: Log all active engines
            this.engines.forEach((engine, index) => {
                console.log(`🎨 Active engine ${index}:`, {
                    id: engine.config.id,
                    hasASCIIEffect: !!engine.engine.asciiEffect,
                    hasRenderer: !!engine.engine.renderer,
                    hasModel: !!engine.engine.currentModel
                });
            });
            
            // Start randomization if enabled
            if (this.config.enableRandomization) {
                setTimeout(() => {
                    this.startRandomization();
                }, 10000); // Start after 10 seconds to let engines fully stabilize
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize store ASCII engines:', error);
        }
    }
    
    async initEngine(engineConfig) {
        console.log(`🎨 Starting initEngine for ${engineConfig.id}`);
        const canvas = document.getElementById(engineConfig.id);
        if (!canvas) {
            console.error(`❌ Canvas ${engineConfig.id} not found`);
            console.error(`❌ Available elements:`, document.querySelectorAll('canvas'));
            return;
        }
        console.log(`✅ Canvas found: ${engineConfig.id}`, canvas);
        
        // Apply canvas styling
        this.styleCanvas(canvas, engineConfig);
        console.log(`✅ Canvas styled`);
        
        // Create and initialize ASCII engine
        console.log(`🎨 Creating ASCII3DEngine...`);
        const engine = new ASCII3DEngine();
        console.log(`🎨 Initializing ASCII3DEngine...`);
        try {
            await engine.init(canvas);
            console.log(`✅ ASCII3DEngine initialized successfully`);
            
            // CRITICAL FIX: Ensure ASCII DOM element is properly attached
            setTimeout(() => {
                console.log(`🔍 DEEP DEBUG for ${engineConfig.id}:`);
                console.log('- Engine object:', engine);
                console.log('- Engine.asciiEffect:', engine.asciiEffect);
                console.log('- Engine.scene:', engine.scene);
                console.log('- Engine.camera:', engine.camera);
                console.log('- Engine.currentModel:', engine.currentModel);
                console.log('- Engine.isRunning:', engine.isRunning);
                console.log('- Engine.isInitialized:', engine.isInitialized);
                console.log('- Scene children count:', engine.scene ? engine.scene.children.length : 0);
                
                if (engine.asciiEffect && engine.asciiEffect.domElement) {
                    const elem = engine.asciiEffect.domElement;
                    console.log(`🔍 ASCII DOM Element for ${engineConfig.id}:`);
                    console.log('- Element type:', elem.tagName);
                    console.log('- Element classes:', elem.className);
                    console.log('- Element ID:', elem.id);
                    console.log('- Element style.display:', elem.style.display);
                    console.log('- Element style.visibility:', elem.style.visibility);
                    console.log('- Element textContent length:', elem.textContent ? elem.textContent.length : 0);
                    console.log('- Element innerHTML length:', elem.innerHTML ? elem.innerHTML.length : 0);
                    console.log('- Element parent:', elem.parentNode);
                    console.log('- Element in document:', document.contains(elem));
                    
                    // CRITICAL FIX: The ASCII element might not be attached to DOM!
                    if (!document.contains(elem)) {
                        console.log(`🚨 CRITICAL ISSUE: ASCII DOM element is NOT attached to document!`);
                        console.log(`🔧 FORCING attachment to document body...`);
                        document.body.appendChild(elem);
                        console.log(`✅ ASCII element attached to body`);
                    }
                    
                    // ASCII element found and properly configured
                    
                    // Position validation completed
                    
                    // ASCII engine content validation completed
                } else {
                    console.error(`❌ NO ASCII EFFECT or domElement created for ${engineConfig.id}`);
                    console.log('- Available engine properties:', Object.keys(engine));
                }
            }, 1000);
            
        } catch (error) {
            console.error(`❌ ASCII3DEngine init failed:`, error);
            return;
        }
        
        // Load the specified model FIRST
        await this.loadModel(engine, engineConfig.model);
        
        // Configure engine settings AFTER model is loaded
        this.configureEngine(engine, engineConfig);
        
        // ENSURE TRANSPARENT BACKGROUND - no white background
        if (engine.renderer) {
            engine.renderer.setClearColor(0x000000, 0.0); // TRANSPARENT background
            console.log(`🎨 Set renderer background to TRANSPARENT`);
        }
        
        // Start the engine's animation loop
        setTimeout(() => {
            if (engine.startAnimation) {
                engine.startAnimation();
                console.log(`🎨 Engine animation started`);
            } else if (engine.animate) {
                engine.animate();
                console.log(`🎨 Engine animation started via animate()`);
            }
            
            // Start our own VERY SLOW manual rotation
            let rotationAmount = 0;
            const ourRotationSpeed = engineConfig.rotationSpeed; // Use our ultra-slow speed
            
            const manualRotate = () => {
                if (engine.currentModel) {
                    rotationAmount += ourRotationSpeed;
                    engine.currentModel.rotation.y = rotationAmount;
                    engine.currentModel.rotation.x = rotationAmount * 0.5;
                    
                    // Rotation running smoothly
                }
                requestAnimationFrame(manualRotate);
            };
            
            manualRotate();
            console.log(`🎯 Manual rotation started with speed: ${ourRotationSpeed}`);
            
            // Final debug check
            console.log(`🎨 Final engine state:`, {
                autoRotate: engine.autoRotate,
                rotationSpeed: engine.rotationSpeed,
                modelScale: engine.currentModel ? engine.currentModel.scale : 'no model',
                textColor: engine.textColor
            });
        }, 1000);
        
        // Store engine reference
        this.engines.push({
            engine,
            canvas,
            config: engineConfig
        });
        
        this.log(`Engine ${engineConfig.id} initialized with model: ${engineConfig.model}`);
    }
    
    styleCanvas(canvas, config) {
        // Calculate final position including group offset
        const finalX = this.calculatePosition(config.position.x, this.config.groupOffset.x);
        const finalY = this.calculatePosition(config.position.y, this.config.groupOffset.y);
        
        // Apply easy positioning and sizing with proper centering
        canvas.style.position = 'absolute';
        canvas.style.left = finalX;
        canvas.style.top = finalY;
        canvas.style.transform = 'translate(-50%, -50%)'; // Center the canvas at the position
        canvas.style.width = config.size.width + 'px';
        canvas.style.height = config.size.height + 'px';
        canvas.style.opacity = config.opacity;
        canvas.style.zIndex = this.config.zIndex;
        canvas.style.pointerEvents = 'none'; // No mouse interaction
        
        // Set actual canvas resolution
        canvas.width = config.size.width;
        canvas.height = config.size.height;
        
        // Add debugging info
        console.log(`🎨 Canvas styled: ${config.id} at ${config.position.x}+${this.config.groupOffset.x}, ${config.position.y}+${this.config.groupOffset.y} = ${finalX}, ${finalY}`);
    }
    
    // Helper method to calculate combined positions
    calculatePosition(individual, group) {
        // Handle percentage positions
        if (typeof individual === 'string' && individual.includes('%') && 
            typeof group === 'string' && group.includes('%')) {
            const indValue = parseFloat(individual);
            const groupValue = parseFloat(group);
            return `${indValue + groupValue}%`;
        }
        // Handle pixel positions
        if (typeof individual === 'string' && individual.includes('px') && 
            typeof group === 'string' && group.includes('px')) {
            const indValue = parseFloat(individual);
            const groupValue = parseFloat(group);
            return `${indValue + groupValue}px`;
        }
        // Mix of percentage and pixels - convert to calc()
        return `calc(${individual} + ${group})`;
    }
    
    // === RANDOMIZATION SYSTEM (same as landing page) ===
    
    // Select a random model using the same weights as landing page
    selectWeightedRandomModel() {
        const models = Object.keys(MODEL_WEIGHTS);
        const weights = Object.values(MODEL_WEIGHTS);
        
        // Create cumulative weight array
        const cumulativeWeights = [];
        let sum = 0;
        for (const weight of weights) {
            sum += weight;
            cumulativeWeights.push(sum);
        }
        
        // Generate random number and find corresponding model
        const random = Math.random() * sum;
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (random <= cumulativeWeights[i]) {
                return models[i];
            }
        }
        
        // Fallback
        return models[0];
    }
    
    // Start randomization timer
    startRandomization() {
        if (!this.config.enableRandomization) return;
        
        // Clear any existing timer
        this.stopRandomization();
        
        // DON'T set initial random model here - let the natural loading happen first
        // Start timer for ongoing randomization only
        this.randomizationTimer = setInterval(() => {
            this.randomizeAllModels();
        }, this.config.randomizationInterval);
        
        console.log(`🎲 Randomization timer started - first change in ${this.config.randomizationInterval/1000}s`);
    }
    
    // Stop randomization timer
    stopRandomization() {
        if (this.randomizationTimer) {
            clearInterval(this.randomizationTimer);
            this.randomizationTimer = null;
            console.log('🎲 Randomization stopped');
        }
    }
    
    // Randomize all models to the same model (synchronized) - FIXED ROTATION JUMPING
    async randomizeAllModels() {
        if (!this.config.syncAllCubes) return;
        
        // Select one random model for all cubes
        const randomModel = this.selectWeightedRandomModel();
        this.currentRandomModel = randomModel;
        
        console.log(`🎲 Randomizing all cubes to: ${randomModel}`);
        
        // CAPTURE CURRENT ROTATION STATE before switching
        const currentRotations = [];
        for (let i = 0; i < this.engines.length; i++) {
            const { engine } = this.engines[i];
            if (engine && engine.currentModel) {
                currentRotations[i] = {
                    x: engine.currentModel.rotation.x,
                    y: engine.currentModel.rotation.y,
                    z: engine.currentModel.rotation.z
                };
                console.log(`🎯 Captured rotation for engine ${i}:`, currentRotations[i]);
            }
        }
        
        // Apply to all engines simultaneously (no staggering to prevent position jumps)
        const promises = [];
        for (let i = 0; i < this.engines.length; i++) {
            const { engine } = this.engines[i];
            if (engine && engine.switchToModel) {
                try {
                    const promise = engine.switchToModel(randomModel).then(() => {
                        // RESTORE ROTATION STATE after model switch
                        if (currentRotations[i] && engine.currentModel) {
                            engine.currentModel.rotation.x = currentRotations[i].x;
                            engine.currentModel.rotation.y = currentRotations[i].y;
                            engine.currentModel.rotation.z = currentRotations[i].z;
                            console.log(`🎯 Restored rotation for engine ${i}`);
                        }
                    });
                    promises.push(promise);
                    console.log(`🎲 Starting engine ${i} switch to: ${randomModel}`);
                } catch (error) {
                    console.error(`🎲 Failed to setup randomization for engine ${i}:`, error);
                }
            }
        }
        
        // Wait for all engines to complete switching
        try {
            await Promise.all(promises);
            console.log(`🎲 All engines completed switch to: ${randomModel} with preserved rotations`);
        } catch (error) {
            console.error(`🎲 Some engines failed to switch:`, error);
        }
        
        console.log(`🎲 All cubes randomization completed for: ${randomModel}`);
    }
    
    configureEngine(engine, config) {
        console.log(`🎨 Configuring engine with config:`, config);
        
        // Set ASCII color directly via property
        if (engine.textColor !== undefined) {
            engine.textColor = config.color;
            console.log(`🎨 Set textColor to: ${config.color}`);
        }
        
        // Set camera position for better 3D perspective and distance for larger view
        if (engine.camera) {
            // Move camera even closer for much larger model appearance
            engine.camera.position.set(2, 2, 2);
            engine.camera.lookAt(0, 0, 0);
            engine.cameraDistance = 2; // Much closer camera = much larger model
            console.log(`🎨 Camera positioned much closer for larger view`);
        }
        
        // Scale the model directly if it exists - with store-specific scaling
        if (engine.currentModel) {
            let finalScale = config.scale;
            
            // STORE-SPECIFIC SCALING: Make castle-archers 30% of normal size on store page
            if (engine.currentModel.name === 'castle-archers' || 
                (engine.currentModel.userData && engine.currentModel.userData.modelName === 'castle-archers')) {
                finalScale = config.scale * 0.3; // 30% of original size
                console.log(`🎨 Applied STORE-SPECIFIC scaling for castle-archers: ${finalScale}`);
            }
            
            engine.currentModel.scale.set(finalScale, finalScale, finalScale);
            console.log(`🎨 Model scaled to: ${finalScale}`);
        }
        
        // DISABLE auto rotation completely - we'll control it manually
        engine.autoRotate = false;
        engine.rotationSpeed = 0; // Stop engine's built-in rotation
        console.log(`🎨 AutoRotate DISABLED - we'll control rotation manually`);
        
        // Disable mouse controls by setting flags
        engine.mouseX = 0;
        engine.mouseY = 0;
        engine.targetMouseX = 0;
        engine.targetMouseY = 0;
        console.log(`🎨 Mouse controls disabled`);
        
        // RESTORE BASIC ASCII STYLING
        if (engine.asciiEffect) {
            const asciiElement = engine.asciiEffect.domElement;
            
            // ESSENTIAL STYLING FOR VISIBILITY - POSITIONED AS BACKGROUND
            asciiElement.style.display = 'block';
            asciiElement.style.position = 'absolute';
            asciiElement.style.top = config.position.y;
            asciiElement.style.left = config.position.x;
            asciiElement.style.transform = 'translate(-50%, -50%)';
            asciiElement.style.width = config.size.width + 'px';
            asciiElement.style.height = config.size.height + 'px';
            asciiElement.style.background = 'transparent';
            asciiElement.style.opacity = config.opacity.toString();
            asciiElement.style.color = config.color;
            asciiElement.style.fontFamily = 'monospace';
            asciiElement.style.fontSize = '10px';
            asciiElement.style.lineHeight = '1.0';
            asciiElement.style.letterSpacing = '0px';
            asciiElement.style.pointerEvents = 'none';
            asciiElement.style.whiteSpace = 'pre';
            asciiElement.style.overflow = 'hidden';
            
            console.log(`🎨 Applied ESSENTIAL ASCII styling for ${config.id}`);
        }
        
        // MINIMAL renderer settings
        if (engine.renderer) {
            engine.renderer.setClearColor(0x000000, 0.0); // Transparent background
            console.log(`🎨 Set transparent renderer background`);
        }
        
        // Set WORKING resolution for ASCII rendering
        if (engine.setResolution) {
            engine.setResolution(150, 80); // Moderate resolution for stability
            console.log(`🎨 Set WORKING resolution: 150x80`);
        }
        
        // Use STABLE character set
        if (engine.characterSet !== undefined) {
            // Basic but working character set
            engine.characterSet = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
            console.log(`🎨 Set STABLE character set`);
        }
        
        // Set performance mode LAST to prevent it from overriding our settings
        if (engine.setPerformanceMode) {
            console.log(`🎨 BEFORE performance mode - rotation speed: ${engine.rotationSpeed}`);
            engine.setPerformanceMode(this.config.performanceMode);
            console.log(`🎨 AFTER performance mode - rotation speed: ${engine.rotationSpeed}`);
            
            // Aggressively override the rotation speed multiple times
            engine.rotationSpeed = config.rotationSpeed;
            console.log(`🎨 FORCED rotation speed to: ${config.rotationSpeed}`);
            
            // Set up a recurring override to make sure it sticks
            const forceSlowRotation = () => {
                if (engine.rotationSpeed !== config.rotationSpeed) {
                    console.log(`🎨 CORRECTING speed from ${engine.rotationSpeed} to ${config.rotationSpeed}`);
                    engine.rotationSpeed = config.rotationSpeed;
                }
            };
            
            // Force the speed every 100ms for the first few seconds
            setTimeout(() => forceSlowRotation(), 100);
            setTimeout(() => forceSlowRotation(), 500);
            setTimeout(() => forceSlowRotation(), 1000);
            setTimeout(() => forceSlowRotation(), 2000);
            setTimeout(() => forceSlowRotation(), 3000);
        }
    }
    
    async loadModel(engine, modelName) {
        // Handle random model selection
        if (modelName === 'random') {
            // If we already have a current random model for sync, use it
            if (this.currentRandomModel) {
                modelName = this.currentRandomModel;
            } else {
                // Select initial random model
                modelName = this.selectWeightedRandomModel();
                this.currentRandomModel = modelName;
            }
            console.log(`🎲 Random model selected: ${modelName}`);
        }
        
        // Use the engine's built-in loadModel method for all models
        console.log(`🎨 Loading model: ${modelName}`);
        
        try {
            if (engine.loadModel) {
                await engine.loadModel(modelName);
                console.log(`🎨 Model ${modelName} loaded successfully`);
            } else {
                console.error(`🎨 Engine missing loadModel method`);
            }
            
            this.log(`Model ${modelName} loaded for engine`);
        } catch (error) {
            console.error(`🎨 Failed to load model ${modelName}:`, error);
            
            // Fallback to cube
            try {
                await engine.loadModel('cube');
                this.log(`Fallback cube model loaded for engine`);
            } catch (fallbackError) {
                console.error(`🎨 Even fallback failed:`, fallbackError);
            }
        }
    }
    
    // === EASY CONTROL METHODS ===
    
    // === GROUP CONTROLS ===
    moveGroup(x, y) {
        this.config.groupOffset.x = x;
        this.config.groupOffset.y = y;
        
        // Re-style all canvases with new group position
        this.engines.forEach(({ canvas, config }) => {
            this.styleCanvas(canvas, config);
        });
        
        console.log(`🎯 Group moved to offset: ${x}, ${y}`);
        return `Group moved to ${x}, ${y}`;
    }
    
    adjustGroup(deltaX, deltaY) {
        const currentX = parseFloat(this.config.groupOffset.x) || 0;
        const currentY = parseFloat(this.config.groupOffset.y) || 0;
        
        const newX = `${currentX + parseFloat(deltaX)}%`;
        const newY = `${currentY + parseFloat(deltaY)}%`;
        
        return this.moveGroup(newX, newY);
    }
    
    resetGroupPosition() {
        return this.moveGroup('0%', '0%');
    }
    
    getGroupPosition() {
        return {
            groupOffset: this.config.groupOffset,
            individual: this.engines.map(({ config }) => ({
                id: config.id,
                position: config.position
            }))
        };
    }
    
    // === RANDOMIZATION CONTROLS ===
    
    enableRandomization() {
        this.config.enableRandomization = true;
        this.startRandomization();
        return 'Randomization enabled';
    }
    
    disableRandomization() {
        this.config.enableRandomization = false;
        this.stopRandomization();
        return 'Randomization disabled';
    }
    
    setRandomizationInterval(seconds) {
        this.config.randomizationInterval = seconds * 1000;
        if (this.randomizationTimer) {
            this.startRandomization(); // Restart with new interval
        }
        return `Randomization interval set to ${seconds} seconds`;
    }
    
    forceRandomize() {
        this.randomizeAllModels();
        return 'Manual randomization triggered';
    }
    
    getRandomizationStatus() {
        return {
            enabled: this.config.enableRandomization,
            interval: this.config.randomizationInterval / 1000,
            currentModel: this.currentRandomModel,
            isRunning: !!this.randomizationTimer
        };
    }
    
    // Quick test method - call this from browser console
    testCubeSettings() {
        if (this.engines[0] && this.engines[0].engine) {
            const engine = this.engines[0].engine;
            console.log('🎯 Current cube settings:', {
                autoRotate: engine.autoRotate,
                rotationSpeed: engine.rotationSpeed,
                modelScale: engine.currentModel ? engine.currentModel.scale : 'no model',
                textColor: engine.textColor,
                cameraDistance: engine.cameraDistance
            });
            
            // Force ultra slow rotation (20% of previous)
            engine.rotationSpeed = 0.0001;
            console.log('🎯 Rotation speed forced to 0.0001 (20% of previous speed)');
            
            return 'Test complete - check cube behavior';
        }
        return 'No engines available';
    }
    
    updateEnginePosition(engineIndex, x, y) {
        if (this.engines[engineIndex]) {
            const canvas = this.engines[engineIndex].canvas;
            canvas.style.left = typeof x === 'string' ? x : x + 'px';
            canvas.style.top = typeof y === 'string' ? y : y + 'px';
            this.log(`Engine ${engineIndex} moved to (${x}, ${y})`);
        }
    }
    
    updateEngineSize(engineIndex, width, height) {
        if (this.engines[engineIndex]) {
            const canvas = this.engines[engineIndex].canvas;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = width;
            canvas.height = height;
            this.log(`Engine ${engineIndex} resized to ${width}x${height}`);
        }
    }
    
    updateEngineColor(engineIndex, color) {
        if (this.engines[engineIndex] && this.engines[engineIndex].engine.textColor !== undefined) {
            this.engines[engineIndex].engine.textColor = color;
            this.log(`Engine ${engineIndex} color changed to ${color}`);
        }
    }
    
    updateEngineOpacity(engineIndex, opacity) {
        if (this.engines[engineIndex]) {
            this.engines[engineIndex].canvas.style.opacity = opacity;
            this.log(`Engine ${engineIndex} opacity set to ${opacity}`);
        }
    }
    
    updateEngineModel(engineIndex, modelName) {
        if (this.engines[engineIndex]) {
            this.loadModel(this.engines[engineIndex].engine, modelName);
            this.log(`Engine ${engineIndex} model changed to ${modelName}`);
        }
    }
    
    toggleEngine(engineIndex, enable) {
        if (this.engines[engineIndex]) {
            const canvas = this.engines[engineIndex].canvas;
            canvas.style.display = enable ? 'block' : 'none';
            this.log(`Engine ${engineIndex} ${enable ? 'enabled' : 'disabled'}`);
        }
    }
    
    toggleAllEngines(enable) {
        this.engines.forEach((_, index) => {
            this.toggleEngine(index, enable);
        });
        this.log(`All engines ${enable ? 'enabled' : 'disabled'}`);
    }
    
    // === UTILITY METHODS ===
    
    log(message) {
        if (this.config.enableLogging) {
            console.log(`🎨 StoreASCII: ${message}`);
        }
    }
    
    destroy() {
        // Stop randomization
        this.stopRandomization();
        
        // Destroy engines
        this.engines.forEach(({ engine }) => {
            if (engine && engine.dispose) {
                engine.dispose();
            }
        });
        this.engines = [];
        this.initialized = false;
        this.currentRandomModel = null;
        this.log('Store ASCII engines destroyed');
    }
    
    // === CONFIGURATION ACCESS ===
    
    getConfig() {
        return this.config;
    }
    
    updateGlobalConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Global configuration updated');
    }
}

// Export default for easy importing
export default StoreAsciiController;
// ASCII Animation Engine - Neubauladen-inspired systematic design
// Canvas 2D performance-optimized engine for morphing ASCII shapes

export class ASCIIEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;
        this.debug = false; // Debug mode for development
        this.lastMouseUpdate = 0; // Throttle mouse updates
        
        // Performance monitoring with error detection
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.fps = 60;
        this.performanceMode = 'high'; // high, medium, low
        this.errorCount = 0;
        this.maxErrors = 10;
        this.frameTimeBuffer = new Array(10).fill(16.67); // Rolling average buffer
        this.bufferIndex = 0;
        this.skipFrames = 0; // Frame skipping for performance
        
        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        
        // Shape management
        this.currentShape = 'castle';
        this.targetShape = 'castle';
        this.morphProgress = 0;
        this.morphDuration = 2000; // 2 seconds
        this.morphStartTime = 0;
        
        // ASCII rendering - Neo-brutalist color scheme - Optimized
        this.fontSize = 12;
        this.lineHeight = 14;
        this.characterColor = '#FFFFFF'; // White symbols
        this.backgroundColor = '#3300ff'; // Neo-blue background
        this.backgroundAlpha = 0.1;
        this.renderCache = new Map(); // Cache rendered frames
        this.lastRenderKey = null;
        this.isDirty = true; // Track if re-render needed
        
        // 3D Animation enhancement - Optimized
        this.rotationAngle = 0;
        this.depthLayers = [];
        this.keyframes = {};
        this.rotationCache = new Map(); // Cache rotation calculations
        this.lastRotationAngle = -1;
        this.rotationPrecision = 0.1; // Reduce calculation frequency
        
        // Systematic animation principles
        this.animationEasing = this.easeInOutCubic;
        this.restraintFactor = 0.1; // Confident restraint in animation speed
        
        this.shapes = this.initializeShapes();
    }
    
    // Initialize canvas and context with comprehensive error handling
    init(canvasElement) {
        try {
            // Browser compatibility checks
            if (!canvasElement) {
                console.error('ASCII Engine: Canvas element not provided');
                return this.failSoft(new Error('Canvas element missing'));
            }
            
            if (!canvasElement.getContext) {
                console.error('ASCII Engine: Canvas not supported');
                return this.failSoft(new Error('Canvas not supported'));
            }
            
            // Test for requestAnimationFrame support
            if (!window.requestAnimationFrame) {
                console.warn('ASCII Engine: requestAnimationFrame not supported, using fallback');
                window.requestAnimationFrame = (callback) => setTimeout(callback, 16);
            }
            
            this.canvas = canvasElement;
            this.ctx = this.canvas.getContext('2d');
            
            if (!this.ctx) {
                return this.failSoft(new Error('Could not get 2D context'));
            }
            
            // Set canvas size to match container
            this.resizeCanvas();
            
            // Configure rendering context
            this.ctx.font = `${this.fontSize}px Arial, monospace`;
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillStyle = this.characterColor;
            
            // Add resize event listener with error handling
            window.addEventListener('resize', () => {
                try {
                    this.resizeCanvas();
                } catch (error) {
                    this.handleError('Resize error', error);
                }
            });
            
            // Initialize 3D keyframes
            this.loadKeyframes();
            
            if (this.debug) {
                console.log('ASCII Engine: Initialized successfully');
            }
            
            return this;
        } catch (error) {
            return this.failSoft(error);
        }
    }
    
    // Resize canvas to match container with error handling
    resizeCanvas() {
        try {
            if (!this.canvas || !this.ctx) return;
            
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * window.devicePixelRatio;
            this.canvas.height = rect.height * window.devicePixelRatio;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            
            // Scale context for high DPI displays
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            
            // Reconfigure context after resize
            this.ctx.font = `${this.fontSize}px Arial, monospace`;
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
        } catch (error) {
            this.handleError('Canvas resize error', error);
        }
    }
    
    // Initialize ASCII shape templates
    initializeShapes() {
        return {
            castle: [
                "     ═══════════════════════",
                "     ║█████████████████████║",
                "     ║█║███║█████║███║█████║",
                "     ║█║   ║█████║   ║█████║",
                "     ║█║   ║█████║   ║█████║",
                "     ║█████████████████████║",
                "     ║█████████████████████║",
                "     ║████║█████████║██████║",
                "     ║████║    ╋    ║██████║",
                "     ║████║  ╔═══╗  ║██████║",
                "     ║████║  ║   ║  ║██████║",
                "     ║████║  ║   ║  ║██████║",
                "     ╚═════════════════════╝"
            ],
            
            pxm: [
                "     ████████████████████████",
                "     ██████╗ ██╗  ██╗███╗   ███╗",
                "     ██╔══██╗╚██╗██╔╝████╗ ████║",
                "     ██████╔╝ ╚███╔╝ ██╔████╔██║",
                "     ██╔═══╝  ██╔██╗ ██║╚██╔╝██║",
                "     ██║     ██╔╝ ██╗██║ ╚═╝ ██║",
                "     ╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝",
                "     ════════════════════════════",
                "        PAUL MIDDLETON",
                "       CREATIVE STUDIOS",
                "     ════════════════════════════"
            ],
            
            sword: [
                "           ╔═╗",
                "           ║ ║",
                "           ║ ║",
                "           ║ ║",
                "           ║ ║",
                "           ║ ║",
                "           ║ ║",
                "           ║ ║",
                "           ║ ║",
                "         ╔═╝ ╚═╗",
                "         ║ ╔═╗ ║",
                "         ╚═╝ ╚═╝",
                "           ███",
                "           ███",
                "           ███"
            ],
            
            skyline: [
                "     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
                "    ▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓",
                "   ▓▓▓░░░█████░░░██████░░░████░░░█████░░░███░░░████░░░██████░░░█████░░░▓▓▓",
                "  ▓▓▓░░░░█████░░░██████░░░████░░░█████░░░███░░░████░░░██████░░░█████░░░░▓▓▓",
                " ▓▓▓░░░░░█████░░░██████░░░████░░░█████░░░███░░░████░░░██████░░░█████░░░░░▓▓▓",
                "▓▓▓░░░░░░░███░░░░░████░░░░░██░░░░░███░░░░░█░░░░░██░░░░░████░░░░░███░░░░░░░▓▓▓",
                "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓"
            ],
            
            star: [
                "       ★",
                "      ███",
                "     █████",
                "    ███████",
                "   █████████",
                "    ███████",
                "     █████",
                "      ███",
                "       █"
            ],
            
            verticalSword: [
                "  ╔═╗",
                "  ║█║",
                "  ║█║",
                "  ║█║",
                "  ║█║",
                "  ║█║",
                "  ║█║",
                "  ║█║",
                "  ║█║",
                "  ║█║",
                "╔═╝█╚═╗",
                "║█████║",
                "╚══█══╝",
                "  ███",
                "  ███"
            ]
        };
    }
    
    // Start animation loop
    startAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.animate();
        
        return this;
    }
    
    // Stop animation loop
    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        return this;
    }
    
    // Main animation loop with comprehensive error handling - Optimized
    animate() {
        try {
            if (!this.isRunning) return;
            
            const currentTime = performance.now();
            const deltaTime = currentTime - this.lastFrameTime;
            
            // Performance monitoring with error detection
            this.updatePerformanceMetrics(deltaTime);
            
            // Frame skipping for performance
            if (this.skipFrames > 0 && this.frameCount % (this.skipFrames + 1) !== 0) {
                this.lastFrameTime = currentTime;
                this.animationId = requestAnimationFrame(() => this.animate());
                return;
            }
            
            // Update mouse position with smooth interpolation
            this.updateMouseInterpolation();
            
            // Update shape morphing
            this.updateMorphing(currentTime);
            
            // Update 3D rotation
            this.update3DEffects(currentTime);
            
            // Only render if something changed
            if (this.isDirty) {
                this.render();
                this.isDirty = false;
            }
            
            this.lastFrameTime = currentTime;
            this.animationId = requestAnimationFrame(() => this.animate());
            
            if (this.debug && this.frameCount % 120 === 0) {
                console.log(`ASCII Engine FPS: ${Math.round(this.fps)}, Mode: ${this.performanceMode}, Shape: ${this.currentShape}`);
            }
        } catch (error) {
            this.handleError('Animation loop error', error);
            this.failSoft(error);
        }
    }
    
    // Update performance metrics and adjust quality - Optimized
    updatePerformanceMetrics(deltaTime) {
        this.frameCount++;
        
        // Rolling average FPS calculation for smoother performance detection
        this.frameTimeBuffer[this.bufferIndex] = deltaTime;
        this.bufferIndex = (this.bufferIndex + 1) % this.frameTimeBuffer.length;
        
        // Calculate FPS every 30 frames for faster response
        if (this.frameCount % 30 === 0) {
            const avgFrameTime = this.frameTimeBuffer.reduce((a, b) => a + b) / this.frameTimeBuffer.length;
            this.fps = 1000 / avgFrameTime;
            
            // More aggressive performance mode switching
            if (this.fps < 30 && this.performanceMode !== 'low') {
                this.setPerformanceMode('low');
            } else if (this.fps < 45 && this.performanceMode === 'high') {
                this.setPerformanceMode('medium');
            } else if (this.fps > 55 && this.performanceMode !== 'high') {
                this.setPerformanceMode('high');
            }
        }
    }
    
    // Set performance mode - Enhanced with frame skipping
    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        // Clear caches when mode changes
        this.renderCache.clear();
        this.rotationCache.clear();
        this.isDirty = true;
        
        switch (mode) {
            case 'low':
                this.morphDuration = 4000; // Much slower morphing
                this.restraintFactor = 0.03; // More restraint
                this.skipFrames = 2; // Skip every 2nd frame (20fps)
                this.rotationPrecision = 0.2; // Lower precision
                break;
            case 'medium':
                this.morphDuration = 3000;
                this.restraintFactor = 0.06;
                this.skipFrames = 1; // Skip every other frame (30fps)
                this.rotationPrecision = 0.15;
                break;
            case 'high':
            default:
                this.morphDuration = 2000;
                this.restraintFactor = 0.1;
                this.skipFrames = 0; // No frame skipping (60fps)
                this.rotationPrecision = 0.1;
                break;
        }
        
        console.log(`ASCII Engine: Performance mode set to ${mode}`);
    }
    
    // Update mouse position data - Optimized with throttling
    updateMousePosition(x, y) {
        // Throttle mouse updates to reduce calculations
        const now = performance.now();
        if (this.lastMouseUpdate && now - this.lastMouseUpdate < 16) return; // ~60fps limit
        this.lastMouseUpdate = now;
        
        this.targetMouseX = x;
        this.targetMouseY = y;
        this.isDirty = true;
        
        // Determine target shape based on mouse position (systematic zones)
        const rect = this.canvas.getBoundingClientRect();
        const normalizedX = x / rect.width;
        
        let newTargetShape;
        if (normalizedX < 0.33) {
            newTargetShape = 'castle';
        } else if (normalizedX < 0.66) {
            newTargetShape = 'pxm';
        } else {
            newTargetShape = 'sword';
        }
        
        if (newTargetShape !== this.targetShape) {
            this.morphToShape(newTargetShape);
        }
    }
    
    // Smooth mouse interpolation with confident restraint - Optimized
    updateMouseInterpolation() {
        const dx = this.targetMouseX - this.mouseX;
        const dy = this.targetMouseY - this.mouseY;
        
        // Only update if significant movement to reduce calculations
        const distance = Math.abs(dx) + Math.abs(dy);
        if (distance < 0.5) return;
        
        this.mouseX += dx * this.restraintFactor;
        this.mouseY += dy * this.restraintFactor;
        this.isDirty = true;
    }
    
    // Trigger morphing to new shape
    morphToShape(shapeName, duration = null) {
        if (!this.shapes[shapeName] || shapeName === this.targetShape) return;
        
        this.targetShape = shapeName;
        this.morphProgress = 0;
        this.morphStartTime = performance.now();
        
        if (duration) {
            this.morphDuration = duration;
        }
        
        return this;
    }
    
    // Update morphing progress
    updateMorphing(currentTime) {
        if (this.currentShape === this.targetShape) return;
        
        const elapsed = currentTime - this.morphStartTime;
        const rawProgress = Math.min(elapsed / this.morphDuration, 1);
        
        // Apply easing function for systematic animation timing
        this.morphProgress = this.animationEasing(rawProgress);
        
        if (this.morphProgress >= 1) {
            this.currentShape = this.targetShape;
            this.morphProgress = 0;
        }
    }
    
    // Easing function for confident restraint in animations
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    // Render current frame with 3D effects and error handling - Optimized
    render() {
        try {
            if (!this.ctx) return;
            
            // Generate cache key for current render state
            const renderKey = `${this.currentShape}_${Math.round(this.mouseX)}_${Math.round(this.mouseY)}_${Math.round(this.rotationAngle * 100)}_${this.morphProgress}`;
            
            // Check render cache in high performance mode
            if (this.performanceMode === 'high' && this.renderCache.has(renderKey)) {
                return; // Skip render if already cached
            }
            
            // Clear canvas with neo-blue background (batch operations)
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);
            
            // Get current shape to render with 3D enhancement
            const shapeToRender = this.getCurrentRenderShape();
            
            // Calculate positioning (centered with mouse parallax and 3D effects)
            const canvasWidth = this.canvas.width / window.devicePixelRatio;
            const canvasHeight = this.canvas.height / window.devicePixelRatio;
            
            const shapeWidth = this.getShapeWidth(shapeToRender);
            const shapeHeight = shapeToRender.length * this.lineHeight;
            
            // Enhanced parallax with 3D depth simulation
            const parallaxX = (this.mouseX - canvasWidth / 2) * 0.05;
            const parallaxY = (this.mouseY - canvasHeight / 2) * 0.05;
            const rotationOffset = Math.sin(this.rotationAngle) * 10;
            
            const startX = (canvasWidth - shapeWidth) / 2 + parallaxX + rotationOffset;
            const startY = (canvasHeight - shapeHeight) / 2 + parallaxY;
            
            // Pre-calculate common values to reduce per-line calculations
            const baseDepthSin = Math.sin(this.rotationAngle);
            
            // Batch render lines with reduced context state changes
            let lastOpacity = -1;
            shapeToRender.forEach((line, index) => {
                const y = startY + (index * this.lineHeight);
                
                // Apply depth-based opacity for 3D effect (optimized)
                const depthFactor = 0.2 + (0.8 * (1 + Math.sin(baseDepthSin + index * 0.1))) / 2;
                
                // Only change fillStyle if opacity changed significantly
                if (Math.abs(depthFactor - lastOpacity) > 0.05) {
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${depthFactor.toFixed(2)})`;
                    lastOpacity = depthFactor;
                }
                
                this.ctx.fillText(line, startX, y);
            });
            
            // Cache successful render in medium/high performance modes
            if (this.performanceMode !== 'low' && this.renderCache.size < 20) {
                this.renderCache.set(renderKey, true);
            }
            
        } catch (error) {
            this.handleError('Render error', error);
        }
    }
    
    // Get current shape for rendering (with morphing if active) - Optimized
    getCurrentRenderShape() {
        if (this.currentShape === this.targetShape || this.morphProgress === 0) {
            return this.shapes[this.currentShape];
        }
        
        // Cache morphed shapes to avoid recalculation
        const morphKey = `${this.currentShape}_${this.targetShape}_${Math.round(this.morphProgress * 10)}`;
        if (this.renderCache.has(morphKey)) {
            return this.renderCache.get(morphKey);
        }
        
        // Simple morphing: interpolate between shapes
        const currentLines = this.shapes[this.currentShape];
        const targetLines = this.shapes[this.targetShape];
        
        // Optimized morphing - return shape based on progress threshold
        const result = this.morphProgress > 0.5 ? targetLines : currentLines;
        
        // Cache result if not too many cached items
        if (this.renderCache.size < 50) {
            this.renderCache.set(morphKey, result);
        }
        
        return result;
    }
    
    // Calculate the width of a shape
    getShapeWidth(shape) {
        return Math.max(...shape.map(line => line.length)) * (this.fontSize * 0.6);
    }
    
    // Load new shapes (for future expansion)
    loadShapes(shapeData) {
        this.shapes = { ...this.shapes, ...shapeData };
        return this;
    }
    
    // Get current performance stats
    getPerformanceStats() {
        return {
            fps: Math.round(this.fps),
            performanceMode: this.performanceMode,
            isRunning: this.isRunning,
            morphProgress: this.morphProgress,
            currentShape: this.currentShape,
            targetShape: this.targetShape,
            errorCount: this.errorCount
        };
    }
    
    // === ERROR HANDLING AND RECOVERY METHODS ===
    
    // Handle errors gracefully
    handleError(context, error) {
        this.errorCount++;
        
        if (this.debug) {
            console.error(`ASCII Engine ${context}:`, error);
            console.trace();
        }
        
        // If too many errors, fail soft
        if (this.errorCount > this.maxErrors) {
            this.failSoft(new Error(`Too many errors (${this.errorCount})`));
        }
    }
    
    // Graceful degradation and fallback
    failSoft(error) {
        console.warn('ASCII Engine: Falling back to safe mode due to error:', error.message);
        
        // Stop animation loop
        this.stopAnimation();
        
        // Clear canvas
        if (this.ctx) {
            try {
                this.ctx.fillStyle = this.backgroundColor;
                this.ctx.fillRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);
            } catch (clearError) {
                console.error('ASCII Engine: Could not clear canvas:', clearError);
            }
        }
        
        // Inject static fallback
        this.injectStaticFallback();
        
        return false;
    }
    
    // Inject static DOM fallback when canvas fails
    injectStaticFallback() {
        if (!this.canvas || !this.canvas.parentNode) return;
        
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #FFFFFF;
            background: #3300ff;
            padding: 20px;
            font-family: monospace;
            text-align: center;
            border: 2px solid #FFFFFF;
            white-space: pre-line;
        `;
        fallback.textContent = 'PXM\\nSTUDIO\\nCREATIVE';
        
        this.canvas.parentNode.appendChild(fallback);
    }
    
    // Clean disposal method - Enhanced with cache cleanup
    dispose() {
        try {
            // Stop animation
            this.stopAnimation();
            
            // Clear all caches to free memory
            this.renderCache.clear();
            this.rotationCache.clear();
            
            // Remove event listeners
            window.removeEventListener('resize', this.resizeCanvas);
            
            // Cancel animation frame
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            
            // Null references
            this.ctx = null;
            this.canvas = null;
            this.frameTimeBuffer = null;
            
            if (this.debug) {
                console.log('ASCII Engine: Disposed cleanly with cache cleanup');
            }
        } catch (error) {
            console.error('ASCII Engine: Error during disposal:', error);
        }
    }
    
    // === 3D ANIMATION ENHANCEMENT METHODS ===
    
    // Load keyframes for 3D rotation effects
    loadKeyframes() {
        // Pre-computed rotation frames for smooth 3D illusion
        this.keyframes = {
            castle: this.generateRotationFrames(this.shapes.castle),
            pxm: this.generateRotationFrames(this.shapes.pxm),
            sword: this.generateRotationFrames(this.shapes.sword)
        };
    }
    
    // Generate rotation frames for 3D effect
    generateRotationFrames(baseShape) {
        const frames = [];
        const frameCount = 36; // 10-degree increments
        
        for (let i = 0; i < frameCount; i++) {
            const angle = (i / frameCount) * Math.PI * 2;
            frames.push(this.rotateShape(baseShape, angle));
        }
        
        return frames;
    }
    
    // Rotate shape for 3D illusion (simplified character-based rotation)
    rotateShape(shape, angle) {
        // For now, return the original shape (can be enhanced with actual 3D transformation)
        // This is a placeholder for more complex 3D ASCII transformation
        return shape;
    }
    
    // Update 3D effects - Optimized with caching
    update3DEffects(currentTime) {
        // Slow rotation based on time and mouse position
        const baseRotation = currentTime * 0.0005; // Slow base rotation
        const mouseInfluence = (this.mouseX / (this.canvas.width / window.devicePixelRatio)) * 0.5;
        
        const newRotationAngle = baseRotation + mouseInfluence;
        
        // Only update if rotation changed significantly (reduces calculations)
        if (Math.abs(newRotationAngle - this.lastRotationAngle) > this.rotationPrecision) {
            this.rotationAngle = newRotationAngle;
            this.lastRotationAngle = newRotationAngle;
            this.isDirty = true;
        }
    }
    
    // Load keyframes for shape animation (external method)
    loadKeyframes(shapeName, framesArray) {
        if (!this.keyframes) this.keyframes = {};
        this.keyframes[shapeName] = framesArray;
        return this;
    }
}
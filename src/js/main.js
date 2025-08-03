// main.js - High Fashion Brutalist Interactions with ASCII Animation
import '../styles/landing.scss';
import { FloatingNavigation } from './modules/navigation.js';
import { ASCIIEngine } from './modules/ascii-engine.js';
import { ASCII3DEngine } from './modules/ascii3d-engine.js';
import { MODEL_WEIGHTS } from './modules/model-loader.js';
// Import model assets to ensure they're included in production build
import './modules/model-assets.js';

class HighFashionBrutalist {
    constructor() {
        this.asciiEngine = null;
        this.isNavigationOpen = false;
        this.floatingNav = null;
        this.use3DEngine = false;
        this.engineInitialized = false;
        this.init();
    }
    
    init() {
        console.log('🎯 Initializing High Fashion Brutalist Interface...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeAll());
        } else {
            this.initializeAll();
        }
    }
    
    initializeAll() {
        console.log('🚀 Starting full initialization...');
        
        try {
            this.initializeLoading(); // Move loading first - most critical
            this.initializeASCIIAnimation();
            this.initializeNavigation();
            this.initializeServiceBlocks();
            this.initializeContactMethods();
            this.initializeGeneralInteractions();
            
            console.log('✨ High Fashion Brutalist Interface Ready');
        } catch (error) {
            console.error('❌ Critical initialization error:', error);
            
            // Emergency fallback - force hide loading screen
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                console.log('🚨 Emergency: Force hiding loading screen');
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.remove();
                    }
                }, 500);
            }
        }
    }
    
    // ASCII Animation System - WebGL Detection with Robust Fallback
    async initializeASCIIAnimation() {
        console.log('🎨 Initializing ASCII animation with engine detection...');
        const asciiCanvas = document.getElementById('asciiCanvas');
        if (!asciiCanvas) {
            console.warn('⚠️ ASCII canvas not found');
            return;
        }
        
        try {
            // Determine which engine to use
            await this.selectOptimalEngine();
            
            // Initialize the selected engine
            await this.initializeSelectedEngine(asciiCanvas);
            
            console.log('✅ ASCII Animation Engine initialized successfully');
        } catch (error) {
            console.error('❌ ASCII Engine initialization failed:', error);
            // Continue execution even if ASCII fails
        }
    }
    
    // WebGL Feature Detection with Performance Testing
    detectWebGLSupport() {
        console.log('🔍 Detecting WebGL capabilities...');
        const startTime = performance.now();
        
        try {
            // Test canvas creation
            const testCanvas = document.createElement('canvas');
            if (!testCanvas) {
                console.warn('⚠️ Cannot create canvas element');
                return { supported: false, reason: 'Canvas creation failed' };
            }
            
            // Test WebGL 2.0 first (preferred)
            let gl = testCanvas.getContext('webgl2', { 
                failIfMajorPerformanceCaveat: true,
                antialias: false // Test with minimal requirements
            });
            
            let version = null;
            if (gl) {
                version = 'WebGL 2.0';
                console.log('✅ WebGL 2.0 supported');
            } else {
                // Fallback to WebGL 1.0
                gl = testCanvas.getContext('webgl', { 
                    failIfMajorPerformanceCaveat: true,
                    antialias: false
                }) || testCanvas.getContext('experimental-webgl', { 
                    failIfMajorPerformanceCaveat: true,
                    antialias: false
                });
                
                if (gl) {
                    version = 'WebGL 1.0';
                    console.log('✅ WebGL 1.0 supported');
                }
            }
            
            if (!gl) {
                console.warn('⚠️ WebGL not supported');
                return { supported: false, reason: 'WebGL context creation failed' };
            }
            
            // Test basic rendering capability
            const testShader = gl.createShader(gl.VERTEX_SHADER);
            if (!testShader) {
                console.warn('⚠️ Shader creation failed');
                gl.getExtension('WEBGL_lose_context')?.loseContext();
                return { supported: false, reason: 'Shader creation failed' };
            }
            
            // Test texture support (required for ASCII effect)
            const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            if (maxTextureSize < 512) {
                console.warn('⚠️ Insufficient texture support:', maxTextureSize);
                gl.getExtension('WEBGL_lose_context')?.loseContext();
                return { supported: false, reason: 'Insufficient texture support' };
            }
            
            // Get renderer info for mobile optimization
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
            const isMobile = /mobile|android|ios|iphone|ipad/i.test(navigator.userAgent) || 
                           /Mali|Adreno|PowerVR|Tegra/i.test(renderer);
            
            // Performance validation - quick render test
            const frameBuffer = gl.createFramebuffer();
            if (!frameBuffer) {
                console.warn('⚠️ Framebuffer creation failed');
                gl.getExtension('WEBGL_lose_context')?.loseContext();
                return { supported: false, reason: 'Framebuffer creation failed' };
            }
            
            // Clean up test context
            gl.deleteShader(testShader);
            gl.deleteFramebuffer(frameBuffer);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            
            const detectionTime = performance.now() - startTime;
            console.log(`🚀 WebGL detection completed in ${detectionTime.toFixed(2)}ms`);
            
            return {
                supported: true,
                version,
                renderer,
                isMobile,
                maxTextureSize,
                detectionTime,
                reason: 'WebGL fully supported'
            };
            
        } catch (error) {
            const detectionTime = performance.now() - startTime;
            console.error('❌ WebGL detection error:', error);
            return { 
                supported: false, 
                reason: `WebGL detection failed: ${error.message}`,
                detectionTime 
            };
        }
    }
    
    // Engine Selection Logic with User Preferences
    async selectOptimalEngine() {
        console.log('⚙️ Selecting optimal ASCII engine...');
        
        // Check user preference override
        const userPreference = localStorage.getItem('use3DEngine');
        const forceEngine = userPreference === 'true' ? '3d' : userPreference === 'false' ? '2d' : null;
        
        if (forceEngine) {
            console.log(`👤 User preference: ${forceEngine.toUpperCase()} engine`);
            this.use3DEngine = (forceEngine === '3d');
            return;
        }
        
        // Automatic engine selection
        const webglSupport = this.detectWebGLSupport();
        
        if (!webglSupport.supported) {
            console.log(`📱 Using 2D engine: ${webglSupport.reason}`);
            this.use3DEngine = false;
            return;
        }
        
        // Additional checks for 3D engine viability
        const is3DViable = this.assess3DEngineViability(webglSupport);
        
        if (is3DViable) {
            console.log(`🌟 Using 3D engine: ${webglSupport.version} detected`);
            this.use3DEngine = true;
        } else {
            console.log('📱 Using 2D engine: 3D engine not viable for current environment');
            this.use3DEngine = false;
        }
    }
    
    // Assess 3D Engine Viability
    assess3DEngineViability(webglSupport) {
        // Mobile optimization - prefer 2D on older mobile devices
        if (webglSupport.isMobile && webglSupport.maxTextureSize < 2048) {
            console.log('📱 Mobile device with limited GPU detected, preferring 2D');
            return false;
        }
        
        // Memory constraints check
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            console.log('💾 Limited memory detected, preferring 2D');
            return false;
        }
        
        // Performance hints from browser
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            console.log('⚡ Limited CPU cores detected, preferring 2D');
            return false;
        }
        
        // Battery optimization
        if (navigator.getBattery) {
            // Note: This is async, but we'll make a quick decision
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 && !battery.charging) {
                    console.log('🔋 Low battery detected, consider switching to 2D mode');
                }
            });
        }
        
        return true;
    }
    
    // Initialize Selected Engine with Graceful Fallback
    async initializeSelectedEngine(canvasElement) {
        console.log(`🚀 Initializing ${this.use3DEngine ? '3D' : '2D'} ASCII engine...`);
        
        if (this.use3DEngine) {
            try {
                await this.initialize3DEngine(canvasElement);
            } catch (error) {
                console.warn('⚠️ 3D engine initialization failed, falling back to 2D:', error);
                await this.fallbackTo2DEngine(canvasElement, error);
            }
        } else {
            await this.initialize2DEngine(canvasElement);
        }
    }
    
    // Initialize 3D Engine with Error Handling
    async initialize3DEngine(canvasElement, retryCount = 0) {
        console.log('🎯 Initializing 3D ASCII engine...');
        
        try {
            this.asciiEngine = new ASCII3DEngine();
            await this.asciiEngine.init(canvasElement);
            
            // Load a random weighted model
            const randomModel = this.selectWeightedRandomModel();
            console.log(`🎲 Loading random weighted model: ${randomModel}`);
            await this.asciiEngine.loadModel(randomModel);
            
            this.asciiEngine.startAnimation();
            
            this.engineInitialized = true;
            this.use3DEngine = true;
            
            console.log('✅ 3D ASCII engine initialized successfully');
            
            // Store successful preference
            localStorage.setItem('lastWorkingEngine', '3d');
            
        } catch (error) {
            console.error('❌ 3D engine initialization error:', error);
            
            // Retry logic for transient failures
            if (retryCount < 2 && this.isTransientError(error)) {
                console.log(`🔄 Retrying 3D engine initialization (attempt ${retryCount + 1}/2)...`);
                await new Promise(resolve => setTimeout(resolve, 100));
                return await this.initialize3DEngine(canvasElement, retryCount + 1);
            }
            
            throw error;
        }
    }
    
    // Initialize 2D Engine (Always Reliable)
    async initialize2DEngine(canvasElement) {
        console.log('🎯 Initializing 2D ASCII engine...');
        
        try {
            this.asciiEngine = new ASCIIEngine();
            this.asciiEngine.init(canvasElement).startAnimation();
            
            this.engineInitialized = true;
            this.use3DEngine = false;
            
            console.log('✅ 2D ASCII engine initialized successfully');
            
            // Store successful preference
            localStorage.setItem('lastWorkingEngine', '2d');
            
        } catch (error) {
            console.error('❌ 2D engine initialization failed:', error);
            throw error;
        }
    }
    
    // Fallback to 2D Engine
    async fallbackTo2DEngine(canvasElement, originalError) {
        console.log('🔄 Falling back to 2D ASCII engine...');
        
        try {
            // Clean up failed 3D engine
            if (this.asciiEngine) {
                if (typeof this.asciiEngine.dispose === 'function') {
                    await this.asciiEngine.dispose();
                }
                this.asciiEngine = null;
            }
            
            // Initialize 2D engine
            await this.initialize2DEngine(canvasElement);
            
            // Store fallback preference temporarily
            localStorage.setItem('engine3DFailed', 'true');
            localStorage.setItem('engine3DFailureReason', originalError.message);
            
            console.log('✅ Successfully fell back to 2D engine');
            
        } catch (fallbackError) {
            console.error('❌ Fallback to 2D engine also failed:', fallbackError);
            throw new Error(`Both engines failed: 3D(${originalError.message}), 2D(${fallbackError.message})`);
        }
    }
    
    // Check if Error is Transient (Worth Retrying)
    isTransientError(error) {
        const transientPatterns = [
            /context lost/i,
            /temporary/i,
            /timeout/i,
            /network/i,
            /loading/i
        ];
        
        return transientPatterns.some(pattern => pattern.test(error.message));
    }
    
    // Select a random model based on weights
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
    
    // Loading Screen Management - Enhanced debugging
    initializeLoading() {
        console.log('🔄 Initializing loading screen...');
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) {
            console.error('❌ Loading screen element not found!');
            return;
        }
        
        console.log('✅ Loading screen found, will hide in 2 seconds...');
        
        // Simulate loading time for dramatic effect
        setTimeout(() => {
            console.log('🎯 Adding loaded class to loading screen...');
            loadingScreen.classList.add('loaded');
            
            // Remove from DOM after transition
            setTimeout(() => {
                console.log('🗑️ Removing loading screen from DOM...');
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                    console.log('✅ Loading screen removed successfully');
                } else {
                    console.warn('⚠️ Loading screen already removed');
                }
            }, 1500);
        }, 1000); // Reduced from 2000 to 1000 for faster testing
    }
    
    // Floating Navigation System
    initializeNavigation() {
        const navTrigger = document.getElementById('navTrigger');
        const navContent = document.getElementById('navContent');
        const navClose = document.getElementById('navClose');
        
        if (!navTrigger || !navContent) return;
        
        const openNav = () => {
            this.isNavigationOpen = true;
            navTrigger.classList.add('active');
            navContent.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        const closeNav = () => {
            this.isNavigationOpen = false;
            navTrigger.classList.remove('active');
            navContent.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        navTrigger.addEventListener('click', () => {
            if (this.isNavigationOpen) {
                closeNav();
            } else {
                openNav();
            }
        });
        
        if (navClose) {
            navClose.addEventListener('click', closeNav);
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isNavigationOpen) {
                closeNav();
            }
        });
        
        // Close when clicking outside nav content
        navContent.addEventListener('click', (e) => {
            if (e.target === navContent) {
                closeNav();
            }
        });
    }
    
    // Service Block Interactions
    initializeServiceBlocks() {
        const serviceBlocks = document.querySelectorAll('.service-block');
        
        serviceBlocks.forEach(block => {
            const serviceType = block.dataset.service;
            
            block.addEventListener('click', () => {
                // Navigate to portfolio section
                if (serviceType) {
                    window.location.href = `/portfolio/${serviceType}`;
                }
            });
            
            // Enhanced hover effects
            block.addEventListener('mouseenter', () => {
                block.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            block.addEventListener('mouseleave', () => {
                block.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Contact Method Interactions
    initializeContactMethods() {
        const contactMethods = document.querySelectorAll('.contact-method');
        
        contactMethods.forEach(method => {
            method.addEventListener('mouseenter', () => {
                if (method.classList.contains('primary')) {
                    method.style.transform = 'translateX(10px)';
                }
            });
            
            method.addEventListener('mouseleave', () => {
                if (method.classList.contains('primary')) {
                    method.style.transform = 'translateX(0)';
                }
            });
        });
    }
    
    // General Avant-garde Interactions with ASCII Integration
    initializeGeneralInteractions() {
        // Subtle parallax for background elements and ASCII animation integration
        const backgroundElements = document.querySelectorAll('.composition-element');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Update ASCII animation with mouse position
            if (this.asciiEngine) {
                this.asciiEngine.updateMousePosition(e.clientX, e.clientY);
            }
            
            backgroundElements.forEach((element, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                
                element.style.transform = `translate(${x}px, ${y}px) ${element.style.transform}`;
            });
        });
        
        // Typography hover effects
        const primaryStatement = document.querySelector('.primary-statement');
        if (primaryStatement) {
            primaryStatement.addEventListener('mouseenter', () => {
                primaryStatement.style.letterSpacing = '0.02em';
            });
            
            primaryStatement.addEventListener('mouseleave', () => {
                primaryStatement.style.letterSpacing = '-0.05em';
            });
        }
        
        // Fragment content interactions
        const fragmentContent = document.querySelector('.fragment-content');
        if (fragmentContent) {
            fragmentContent.addEventListener('click', () => {
                // Rotate through different manifestos
                const manifestos = [
                    "EVERY FRAME IS A STATEMENT.<br>EVERY CUT IS AN ARGUMENT.<br>EVERY COMPOSITION CHALLENGES<br>THE COMFORTABLE NARRATIVE.",
                    "VISUAL LANGUAGE TRANSCENDS<br>SPOKEN WORDS.<br>SILENCE SPEAKS LOUDER<br>THAN EXPLANATION.",
                    "BEAUTY EXISTS IN THE<br>UNCOMFORTABLE TRUTH.<br>PERFECTION IS THE ENEMY<br>OF AUTHENTIC EXPRESSION."
                ];
                
                const currentIndex = parseInt(fragmentContent.dataset.manifestoIndex || '0');
                const nextIndex = (currentIndex + 1) % manifestos.length;
                
                fragmentContent.querySelector('p').innerHTML = manifestos[nextIndex];
                fragmentContent.dataset.manifestoIndex = nextIndex;
            });
        }
        
        // Scroll-based animations
        this.initializeScrollAnimations();
    }
    
    // Scroll-based reveal animations
    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate in
        const animateElements = document.querySelectorAll('.service-block, .contact-fragment, .fragment-content');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            observer.observe(el);
        });
    }
    
    // Cleanup method - Enhanced for Both Engines
    async destroy() {
        console.log('🧹 Cleaning up High Fashion Brutalist Interface...');
        
        // Remove event listeners and clean up ASCII engine
        if (this.asciiEngine) {
            try {
                // Stop animation first
                if (typeof this.asciiEngine.stopAnimation === 'function') {
                    this.asciiEngine.stopAnimation();
                }
                
                // Dispose engine properly (both engines support this)
                if (typeof this.asciiEngine.dispose === 'function') {
                    await this.asciiEngine.dispose();
                    console.log(`✅ ${this.use3DEngine ? '3D' : '2D'} engine disposed successfully`);
                }
                
                this.asciiEngine = null;
                this.engineInitialized = false;
                
            } catch (error) {
                console.error('⚠️ Error during engine cleanup:', error);
            }
        }
        
        // Reset body overflow
        document.body.style.overflow = '';
        
        console.log('✅ Cleanup completed');
    }
}

// Initialize the high fashion brutalist interface
const app = new HighFashionBrutalist();

// Make available globally for debugging
window.HighFashionBrutalist = app;

// Cleanup on page unload
window.addEventListener('beforeunload', async () => {
    await app.destroy();
});

// Development helpers - Enhanced for Engine System
if (typeof window !== 'undefined') {
    // Global access for debugging
    window.HighFashionBrutalist = app;
    
    // Engine switching with validation
    window.switchTo3D = async () => {
        console.log('🌟 Switching to 3D engine...');
        const webglSupport = app.detectWebGLSupport();
        if (webglSupport.supported) {
            localStorage.setItem('use3DEngine', 'true');
            localStorage.removeItem('engine3DFailed');
            location.reload();
        } else {
            console.warn('⚠️ Cannot switch to 3D: WebGL not supported');
            console.log('Reason:', webglSupport.reason);
            return { error: 'WebGL not supported', reason: webglSupport.reason };
        }
    };
    
    window.switchTo2D = () => {
        console.log('📱 Switching to 2D engine...');
        localStorage.setItem('use3DEngine', 'false');
        location.reload();
    };
    
    window.resetEnginePreference = () => {
        console.log('🔄 Resetting engine preference to auto-detect...');
        localStorage.removeItem('use3DEngine');
        localStorage.removeItem('engine3DFailed');
        localStorage.removeItem('lastWorkingEngine');
        location.reload();
    };
    
    // Enhanced stats with engine info
    window.getEngineStats = () => {
        const baseInfo = {
            currentEngine: app.use3DEngine ? '3D' : '2D',
            engineInitialized: app.engineInitialized,
            webglSupport: app.detectWebGLSupport(),
            lastWorkingEngine: localStorage.getItem('lastWorkingEngine'),
            engine3DFailed: localStorage.getItem('engine3DFailed') === 'true',
            engine3DFailureReason: localStorage.getItem('engine3DFailureReason')
        };
        
        if (app.asciiEngine && typeof app.asciiEngine.getPerformanceStats === 'function') {
            return {
                ...baseInfo,
                performance: app.asciiEngine.getPerformanceStats()
            };
        }
        
        return {
            ...baseInfo,
            performance: { error: 'No engine performance stats available' }
        };
    };
    
    // WebGL capability testing
    window.testWebGL = () => {
        return app.detectWebGLSupport();
    };
    
    // Force engine restart (useful for testing fallback)
    window.restartEngine = async () => {
        console.log('🔄 Restarting ASCII engine...');
        if (app.asciiEngine) {
            await app.destroy();
        }
        await app.initializeASCIIAnimation();
        console.log('✅ Engine restarted');
    };
    
    console.log('🛠️ Development helpers available:');
    console.log('  switchTo3D() - Force 3D engine (with WebGL validation)');
    console.log('  switchTo2D() - Force 2D engine');
    console.log('  resetEnginePreference() - Reset to auto-detect mode');
    console.log('  getEngineStats() - Get comprehensive engine information');
    console.log('  testWebGL() - Test WebGL capabilities');
    console.log('  restartEngine() - Restart current engine (for testing)');
    
    // Log current engine status
    setTimeout(() => {
        const stats = window.getEngineStats();
        console.log('🎯 Current Engine Status:', {
            engine: stats.currentEngine,
            initialized: stats.engineInitialized,
            webglSupported: stats.webglSupport.supported
        });
    }, 1000);
}
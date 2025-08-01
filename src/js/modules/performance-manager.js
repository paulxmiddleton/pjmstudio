// Performance Manager - Performance management system for 3D ASCII engine
// Mirrors and extends the performance management from the 2D ASCII engine

export class PerformanceManager {
    constructor() {
        // Performance monitoring
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.fps = 60;
        this.targetFPS = 60;
        
        // Performance modes
        this.performanceMode = 'high'; // high, medium, low
        this.autoAdjust = true;
        
        // Frame timing
        this.frameTimeBuffer = new Array(30).fill(16.67); // Rolling average for 30 frames
        this.bufferIndex = 0;
        this.avgFrameTime = 16.67;
        
        // Render timing
        this.renderStartTime = 0;
        this.renderTime = 0;
        this.renderTimeHistory = [];
        this.maxRenderTimeHistory = 10;
        
        // Memory monitoring
        this.memoryUsage = 0;
        this.maxMemoryUsage = 0;
        this.memoryCheckInterval = 60; // Check every 60 frames
        
        // Performance thresholds
        this.thresholds = {
            low: { fps: 20, renderTime: 50 },
            medium: { fps: 35, renderTime: 35 },
            high: { fps: 50, renderTime: 20 }
        };
        
        // Frame skipping
        this.skipFrames = 0;
        this.maxSkipFrames = 3;
        
        // Quality settings
        this.qualitySettings = {
            high: {
                asciiResolution: 0.1,
                shadowsEnabled: true,
                antialiasing: true,
                pixelRatio: Math.min(window.devicePixelRatio, 2),
                updateFrequency: 1
            },
            medium: {
                asciiResolution: 0.15,
                shadowsEnabled: true,
                antialiasing: false,
                pixelRatio: Math.min(window.devicePixelRatio, 1.5),
                updateFrequency: 1
            },
            low: {
                asciiResolution: 0.2,
                shadowsEnabled: false,
                antialiasing: false,
                pixelRatio: 1,
                updateFrequency: 2
            },
            mobile: {
                asciiResolution: 0.25,
                shadowsEnabled: false,
                antialiasing: false,
                pixelRatio: 1,
                updateFrequency: 3,
                reducedCharacterSet: ' .:-+*#',
                simplifiedGeometry: true,
                aggressiveCulling: true
            },
            'mobile-low-battery': {
                asciiResolution: 0.3,
                shadowsEnabled: false,
                antialiasing: false,
                pixelRatio: 1,
                updateFrequency: 4,
                reducedCharacterSet: ' .-+#',
                simplifiedGeometry: true,
                aggressiveCulling: true,
                reducedAnimations: true
            }
        };
        
        // Device detection
        this.deviceType = this.detectDeviceType();
        this.isMobile = this.deviceType === 'mobile';
        
        // Mobile-specific optimizations
        this.mobileOptimizations = {
            batteryLevel: 1.0,
            isCharging: true,
            networkType: 'unknown',
            touchDevice: 'ontouchstart' in window,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            dataSaver: navigator.connection?.saveData || false
        };
        
        // Initialize mobile optimizations
        if (this.isMobile) {
            this.initializeMobileOptimizations();
        }
        
        // Performance statistics
        this.stats = {
            frameDrops: 0,
            modeChanges: 0,
            lastModeChange: 0,
            totalFrames: 0,
            avgFPS: 60,
            minFPS: 60,
            maxFPS: 60
        };
        
        // Warning and error tracking
        this.warnings = [];
        this.maxWarnings = 5;
        
        // Adaptive settings
        this.adaptiveSettings = {
            enabled: true,
            checkInterval: 120, // Check every 2 seconds at 60fps
            stabilityFrames: 60, // Frames to wait before changing modes
            lastCheck: 0
        };
        
        console.log(`⚡ PerformanceManager: Initialized for ${this.deviceType} device`);
        
        // Set initial performance mode based on device
        this.setInitialPerformanceMode();
    }
    
    // Set initial performance mode based on device capabilities
    setInitialPerformanceMode() {
        let initialMode = 'high';
        
        if (this.isMobile) {
            initialMode = 'medium';
        }
        
        // Check WebGL capabilities
        const gl = this.getWebGLContext();
        if (gl) {
            const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
            
            if (maxTextureSize < 2048 || maxRenderbufferSize < 2048) {
                initialMode = 'low';
            }
        } else {
            initialMode = 'low';
        }
        
        this.setMode(initialMode);
        console.log(`🎯 Initial performance mode: ${initialMode}`);
    }
    
    // Detect device type
    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        
        if (mobileRegex.test(userAgent)) {
            return 'mobile';
        }
        
        // Check for performance indicators
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        
        if (cores <= 2 || memory <= 2) {
            return 'low-end';
        }
        
        return 'desktop';
    }
    
    // Initialize mobile-specific optimizations
    async initializeMobileOptimizations() {
        console.log('📱 Initializing mobile optimizations...');
        
        try {
            // Monitor battery status
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                this.mobileOptimizations.batteryLevel = battery.level;
                this.mobileOptimizations.isCharging = battery.charging;
                
                // Listen for battery changes
                battery.addEventListener('levelchange', () => {
                    this.mobileOptimizations.batteryLevel = battery.level;
                    this.adjustForBatteryLevel();
                });
                
                battery.addEventListener('chargingchange', () => {
                    this.mobileOptimizations.isCharging = battery.charging;
                    this.adjustForBatteryLevel();
                });
                
                console.log(`🔋 Battery: ${(battery.level * 100).toFixed(0)}%, charging: ${battery.charging}`);
            }
            
            // Monitor network connection
            if ('connection' in navigator) {
                const connection = navigator.connection;
                this.mobileOptimizations.networkType = connection.effectiveType || 'unknown';
                this.mobileOptimizations.dataSaver = connection.saveData || false;
                
                connection.addEventListener('change', () => {
                    this.mobileOptimizations.networkType = connection.effectiveType;
                    this.adjustForNetworkConditions();
                });
                
                console.log(`📶 Network: ${connection.effectiveType}, data saver: ${connection.saveData}`);
            }
            
            // Check for reduced motion preference
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.mobileOptimizations.reducedMotion = reducedMotionQuery.matches;
            
            reducedMotionQuery.addEventListener('change', (e) => {
                this.mobileOptimizations.reducedMotion = e.matches;
                if (e.matches) {
                    this.setPerformanceMode('mobile-low-battery');
                }
            });
            
            // Initial adjustment based on current conditions
            this.adjustForBatteryLevel();
            
            console.log('✅ Mobile optimizations initialized');
            
        } catch (error) {
            console.warn('⚠️ Some mobile optimizations failed to initialize:', error);
        }
    }
    
    // Adjust performance based on battery level
    adjustForBatteryLevel() {
        if (!this.isMobile) return;
        
        const { batteryLevel, isCharging } = this.mobileOptimizations;
        
        // If battery is very low and not charging, use ultra-conservative settings
        if (batteryLevel < 0.15 && !isCharging) {
            console.log('🔋 Low battery detected, switching to power-saving mode');
            this.setPerformanceMode('mobile-low-battery');
        } 
        // If battery is low but charging, use moderate mobile settings
        else if (batteryLevel < 0.3 && isCharging) {
            console.log('🔋 Low battery but charging, using mobile mode');
            this.setPerformanceMode('mobile');
        }
        // If battery is healthy, use normal mobile performance
        else if (batteryLevel > 0.5) {
            if (this.performanceMode === 'mobile-low-battery') {
                console.log('🔋 Battery level recovered, returning to mobile mode');
                this.setPerformanceMode('mobile');
            }
        }
    }
    
    // Adjust performance based on network conditions
    adjustForNetworkConditions() {
        if (!this.isMobile) return;
        
        const { networkType, dataSaver } = this.mobileOptimizations;
        
        // If on slow network or data saver mode, reduce quality
        if (dataSaver || networkType === 'slow-2g' || networkType === '2g') {
            console.log('📶 Slow network detected, reducing performance');
            this.setPerformanceMode('mobile-low-battery');
        }
    }
    
    // Get WebGL context for capability detection
    getWebGLContext() {
        try {
            const canvas = document.createElement('canvas');
            return canvas.getContext('webgl2') || 
                   canvas.getContext('webgl') || 
                   canvas.getContext('experimental-webgl');
        } catch (e) {
            return null;
        }
    }
    
    // Update performance metrics
    update(deltaTime) {
        this.frameCount++;
        this.stats.totalFrames++;
        
        // Record frame time
        this.recordFrameTime(deltaTime);
        
        // Calculate FPS
        this.calculateFPS();
        
        // Update render time if available
        if (this.renderStartTime > 0) {
            this.renderTime = performance.now() - this.renderStartTime;
            this.recordRenderTime(this.renderTime);
            this.renderStartTime = 0;
        }
        
        // Check memory usage periodically
        if (this.frameCount % this.memoryCheckInterval === 0) {
            this.updateMemoryUsage();
        }
        
        // Adaptive performance adjustment
        if (this.adaptiveSettings.enabled && this.autoAdjust) {
            this.adaptivePerformanceCheck();
        }
        
        // Update statistics
        this.updateStatistics();
    }
    
    // Record frame time in rolling buffer
    recordFrameTime(deltaTime) {
        this.frameTimeBuffer[this.bufferIndex] = deltaTime;
        this.bufferIndex = (this.bufferIndex + 1) % this.frameTimeBuffer.length;
        
        // Calculate average frame time
        this.avgFrameTime = this.frameTimeBuffer.reduce((a, b) => a + b) / this.frameTimeBuffer.length;
    }
    
    // Calculate current FPS
    calculateFPS() {
        this.fps = 1000 / this.avgFrameTime;
        
        // Update FPS statistics
        this.stats.avgFPS = (this.stats.avgFPS * 0.95) + (this.fps * 0.05);
        this.stats.minFPS = Math.min(this.stats.minFPS, this.fps);
        this.stats.maxFPS = Math.max(this.stats.maxFPS, this.fps);
    }
    
    // Record render time
    recordRenderTime(renderTime) {
        this.renderTimeHistory.push(renderTime);
        
        if (this.renderTimeHistory.length > this.maxRenderTimeHistory) {
            this.renderTimeHistory.shift();
        }
    }
    
    // Start render timing
    startRenderTiming() {
        this.renderStartTime = performance.now();
    }
    
    // End render timing
    endRenderTiming() {
        if (this.renderStartTime > 0) {
            this.renderTime = performance.now() - this.renderStartTime;
            this.recordRenderTime(this.renderTime);
            this.renderStartTime = 0;
        }
    }
    
    // Update memory usage
    updateMemoryUsage() {
        if (performance.memory) {
            this.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024); // MB
            this.maxMemoryUsage = Math.max(this.maxMemoryUsage, this.memoryUsage);
        }
    }
    
    // Adaptive performance checking
    adaptivePerformanceCheck() {
        const now = this.frameCount;
        
        if (now - this.adaptiveSettings.lastCheck < this.adaptiveSettings.checkInterval) {
            return;
        }
        
        this.adaptiveSettings.lastCheck = now;
        
        const currentThreshold = this.thresholds[this.performanceMode];
        const avgRenderTime = this.renderTimeHistory.length > 0 ?
            this.renderTimeHistory.reduce((a, b) => a + b) / this.renderTimeHistory.length : 0;
        
        // Check if we need to decrease performance
        if (this.fps < currentThreshold.fps || avgRenderTime > currentThreshold.renderTime) {
            this.decreasePerformance();
        }
        // Check if we can increase performance
        else if (this.performanceMode !== 'high') {
            const higherMode = this.getHigherPerformanceMode();
            if (higherMode) {
                const higherThreshold = this.thresholds[higherMode];
                if (this.fps > higherThreshold.fps * 1.2 && avgRenderTime < higherThreshold.renderTime * 0.8) {
                    this.increasePerformance();
                }
            }
        }
    }
    
    // Decrease performance mode
    decreasePerformance() {
        const newMode = this.getLowerPerformanceMode();
        if (newMode && newMode !== this.performanceMode) {
            console.log(`📉 Performance decreased: ${this.performanceMode} → ${newMode}`);
            this.setMode(newMode);
            this.addWarning(`Performance decreased to ${newMode} mode due to low FPS (${Math.round(this.fps)})`);
        }
    }
    
    // Increase performance mode
    increasePerformance() {
        const newMode = this.getHigherPerformanceMode();
        if (newMode && newMode !== this.performanceMode) {
            console.log(`📈 Performance increased: ${this.performanceMode} → ${newMode}`);
            this.setMode(newMode);
        }
    }
    
    // Get lower performance mode
    getLowerPerformanceMode() {
        switch (this.performanceMode) {
            case 'high': return 'medium';
            case 'medium': return 'low';
            case 'low': return null;
            default: return 'low';
        }
    }
    
    // Get higher performance mode
    getHigherPerformanceMode() {
        switch (this.performanceMode) {
            case 'low': return 'medium';
            case 'medium': return 'high';
            case 'high': return null;
            default: return 'high';
        }
    }
    
    // Set performance mode
    setMode(mode) {
        if (!this.qualitySettings[mode]) {
            console.warn(`Invalid performance mode: ${mode}`);
            return;
        }
        
        const oldMode = this.performanceMode;
        this.performanceMode = mode;
        
        // Update frame skipping
        this.updateFrameSkipping();
        
        // Record mode change
        if (oldMode !== mode) {
            this.stats.modeChanges++;
            this.stats.lastModeChange = this.frameCount;
        }
        
        console.log(`🎛️ Performance mode set to: ${mode}`);
    }
    
    // Update frame skipping based on performance mode
    updateFrameSkipping() {
        switch (this.performanceMode) {
            case 'high':
                this.skipFrames = 0;
                break;
            case 'medium':
                this.skipFrames = 1;
                break;
            case 'low':
                this.skipFrames = 2;
                break;
        }
    }
    
    // Check if frame should be skipped
    shouldSkipFrame() {
        if (this.skipFrames === 0) return false;
        return this.frameCount % (this.skipFrames + 1) !== 0;
    }
    
    // Get quality settings for current mode
    getQualitySettings() {
        return { ...this.qualitySettings[this.performanceMode] };
    }
    
    // Update performance statistics
    updateStatistics() {
        // Track frame drops
        if (this.fps < 30) {
            this.stats.frameDrops++;
        }
    }
    
    // Add performance warning
    addWarning(message) {
        const warning = {
            message,
            timestamp: performance.now(),
            frame: this.frameCount
        };
        
        this.warnings.push(warning);
        
        if (this.warnings.length > this.maxWarnings) {
            this.warnings.shift();
        }
        
        console.warn('⚠️ Performance warning:', message);
    }
    
    // Get current FPS
    getFPS() {
        return Math.round(this.fps);
    }
    
    // Get current render time
    getRenderTime() {
        return Math.round(this.renderTime);
    }
    
    // Get memory usage in MB
    getMemoryUsage() {
        return Math.round(this.memoryUsage);
    }
    
    // Get current performance mode
    getCurrentMode() {
        return this.performanceMode;
    }
    
    // Get performance statistics
    getStats() {
        return {
            fps: this.getFPS(),
            renderTime: this.getRenderTime(),
            memory: this.getMemoryUsage(),
            mode: this.performanceMode,
            frameCount: this.frameCount,
            frameDrops: this.stats.frameDrops,
            modeChanges: this.stats.modeChanges,
            avgFPS: Math.round(this.stats.avgFPS),
            minFPS: Math.round(this.stats.minFPS),
            maxFPS: Math.round(this.stats.maxFPS),
            skipFrames: this.skipFrames,
            warnings: this.warnings.length,
            deviceType: this.deviceType
        };
    }
    
    // Get detailed performance report
    getDetailedReport() {
        const avgRenderTime = this.renderTimeHistory.length > 0 ?
            this.renderTimeHistory.reduce((a, b) => a + b) / this.renderTimeHistory.length : 0;
        
        return {
            ...this.getStats(),
            avgRenderTime: Math.round(avgRenderTime),
            maxMemoryUsage: Math.round(this.maxMemoryUsage),
            frameTimeBuffer: [...this.frameTimeBuffer],
            renderTimeHistory: [...this.renderTimeHistory],
            recentWarnings: this.warnings.slice(-3),
            qualitySettings: this.getQualitySettings(),
            thresholds: this.thresholds[this.performanceMode]
        };
    }
    
    // Enable/disable auto-adjustment
    setAutoAdjust(enabled) {
        this.autoAdjust = enabled;
        console.log(`🔄 Auto-adjust ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    // Reset performance statistics
    resetStats() {
        this.stats = {
            frameDrops: 0,
            modeChanges: 0,
            lastModeChange: 0,
            totalFrames: 0,
            avgFPS: 60,
            minFPS: 60,
            maxFPS: 60
        };
        
        this.warnings = [];
        this.frameCount = 0;
        this.renderTimeHistory = [];
        
        console.log('📊 Performance statistics reset');
    }
    
    // Dispose and cleanup
    dispose() {
        console.log('🧹 Disposing PerformanceManager...');
        
        // Clear arrays
        this.frameTimeBuffer = null;
        this.renderTimeHistory = [];
        this.warnings = [];
        
        // Reset counters
        this.frameCount = 0;
        this.fps = 0;
        
        console.log('✅ PerformanceManager disposed');
    }
}
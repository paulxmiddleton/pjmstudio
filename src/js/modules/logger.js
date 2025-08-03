// Logger - Smart console logging with development/production awareness
// Replaces direct console.log usage with environment-aware logging

class Logger {
    constructor() {
        // Detect environment
        this.isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
        this.isProd = import.meta.env.PROD || import.meta.env.MODE === 'production';
        
        // Log levels
        this.levels = {
            ERROR: 0,   // Always shown
            WARN: 1,    // Always shown
            INFO: 2,    // Production: important info only
            DEBUG: 3,   // Development only
            TRACE: 4    // Development only
        };
        
        // Current log level based on environment
        this.currentLevel = this.isDev ? this.levels.TRACE : this.levels.INFO;
        
        // Performance tracking
        this.startTimes = new Map();
        
        console.log(`🔧 Logger initialized - Environment: ${this.isDev ? 'development' : 'production'}`);
    }
    
    // Error logging - always shown
    error(message, ...args) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(`❌ ${message}`, ...args);
        }
    }
    
    // Warning logging - always shown
    warn(message, ...args) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(`⚠️ ${message}`, ...args);
        }
    }
    
    // Info logging - production: important only, dev: all
    info(message, ...args) {
        if (this.currentLevel >= this.levels.INFO) {
            console.log(`ℹ️ ${message}`, ...args);
        }
    }
    
    // Debug logging - development only
    debug(message, ...args) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.log(`🐛 ${message}`, ...args);
        }
    }
    
    // Trace logging - development only
    trace(message, ...args) {
        if (this.currentLevel >= this.levels.TRACE) {
            console.log(`🔍 ${message}`, ...args);
        }
    }
    
    // Success logging - environment aware
    success(message, ...args) {
        if (this.isDev || this.isImportantSuccess(message)) {
            console.log(`✅ ${message}`, ...args);
        }
    }
    
    // Performance timing start
    time(label) {
        if (this.isDev) {
            this.startTimes.set(label, performance.now());
            console.time(label);
        }
    }
    
    // Performance timing end
    timeEnd(label) {
        if (this.isDev) {
            const startTime = this.startTimes.get(label);
            if (startTime) {
                const duration = performance.now() - startTime;
                console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
                this.startTimes.delete(label);
            }
            console.timeEnd(label);
        }
    }
    
    // Group logging for related logs
    group(label) {
        if (this.isDev) {
            console.group(`📁 ${label}`);
        }
    }
    
    groupEnd() {
        if (this.isDev) {
            console.groupEnd();
        }
    }
    
    // ASCII Engine specific logging
    ascii(message, ...args) {
        if (this.isDev) {
            console.log(`🎯 ASCII: ${message}`, ...args);
        }
    }
    
    // Model loading specific logging
    model(message, ...args) {
        // Show model loading info in production for debugging
        console.log(`📦 Model: ${message}`, ...args);
    }
    
    // Performance specific logging
    perf(message, ...args) {
        if (this.isDev) {
            console.log(`⚡ Performance: ${message}`, ...args);
        }
    }
    
    // 3D Engine specific logging
    engine(message, ...args) {
        if (this.isDev) {
            console.log(`🎮 Engine: ${message}`, ...args);
        }
    }
    
    // Navigation specific logging
    nav(message, ...args) {
        if (this.isDev) {
            console.log(`🧭 Navigation: ${message}`, ...args);
        }
    }
    
    // Interaction specific logging
    interaction(message, ...args) {
        if (this.isDev) {
            console.log(`🎪 Interaction: ${message}`, ...args);
        }
    }
    
    // Check if success message is important for production
    isImportantSuccess(message) {
        const importantKeywords = [
            'initialized', 'loaded', 'ready', 'connected',
            'deployed', 'build', 'production', 'completed'
        ];
        return importantKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );
    }
    
    // Production-safe table logging
    table(data, columns) {
        if (this.isDev) {
            console.table(data, columns);
        }
    }
    
    // Safe object inspection
    inspect(obj, label = 'Object') {
        if (this.isDev) {
            console.log(`🔎 ${label}:`, obj);
        }
    }
    
    // Memory usage logging
    memory() {
        if (this.isDev && performance.memory) {
            const memory = performance.memory;
            console.log(`💾 Memory: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB used / ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB total`);
        }
    }
    
    // Frame rate logging
    fps(fps) {
        if (this.isDev) {
            const color = fps > 50 ? '🟢' : fps > 30 ? '🟡' : '🔴';
            console.log(`${color} FPS: ${Math.round(fps)}`);
        }
    }
    
    // Critical system notifications (always shown)
    critical(message, ...args) {
        console.error(`🚨 CRITICAL: ${message}`, ...args);
    }
    
    // System status (production-appropriate)
    status(message, ...args) {
        if (this.isDev || this.isSystemStatus(message)) {
            console.log(`📊 Status: ${message}`, ...args);
        }
    }
    
    // Check if status is important for production
    isSystemStatus(message) {
        const statusKeywords = [
            'ready', 'online', 'offline', 'error', 'failed',
            'connected', 'disconnected', 'loading'
        ];
        return statusKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );
    }
    
    // Set log level manually
    setLevel(level) {
        if (typeof level === 'string') {
            level = this.levels[level.toUpperCase()];
        }
        if (level !== undefined) {
            this.currentLevel = level;
            this.info(`Log level set to: ${Object.keys(this.levels)[level]}`);
        }
    }
    
    // Get current environment info
    getInfo() {
        return {
            isDev: this.isDev,
            isProd: this.isProd,
            currentLevel: this.currentLevel,
            mode: import.meta.env.MODE
        };
    }
}

// Create singleton instance
const logger = new Logger();

// Export both the instance and class
export default logger;
export { Logger };
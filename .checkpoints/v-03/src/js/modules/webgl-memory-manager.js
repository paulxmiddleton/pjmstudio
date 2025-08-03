// WebGL Memory Manager - Enhanced memory management for WebGL contexts
// Handles context loss, memory cleanup, and resource optimization

import logger from './logger.js';

export class WebGLMemoryManager {
    constructor() {
        this.contexts = new Set();
        this.geometries = new Set();
        this.materials = new Set();
        this.textures = new Set();
        this.renderTargets = new Set();
        this.buffers = new Map();
        
        // Memory tracking
        this.memoryUsage = {
            geometries: 0,
            materials: 0,
            textures: 0,
            programs: 0,
            total: 0
        };
        
        // Cleanup intervals
        this.cleanupInterval = null;
        this.memoryCheckInterval = null;
        
        // Performance thresholds
        this.thresholds = {
            maxMemoryUsage: 512 * 1024 * 1024, // 512MB
            maxTextures: 100,
            maxGeometries: 50,
            cleanupInterval: 30000 // 30 seconds
        };
        
        logger.debug('WebGL Memory Manager initialized');
        this.startMemoryMonitoring();
    }
    
    // Register WebGL context for management
    registerContext(renderer) {
        if (!renderer || !renderer.getContext) {
            logger.warn('Invalid renderer provided to memory manager');
            return;
        }
        
        const gl = renderer.getContext();
        if (gl) {
            this.contexts.add(renderer);
            this.setupContextLossHandling(renderer);
            logger.debug('WebGL context registered for memory management');
        }
    }
    
    // Setup context loss and restore handling
    setupContextLossHandling(renderer) {
        const canvas = renderer.domElement;
        if (!canvas) return;
        
        canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            logger.warn('WebGL context lost detected');
            this.handleContextLoss(renderer);
        });
        
        canvas.addEventListener('webglcontextrestored', () => {
            logger.info('WebGL context restored');
            this.handleContextRestore(renderer);
        });
    }
    
    // Handle context loss
    handleContextLoss(renderer) {
        this.clearManagedResources();
        this.stopMemoryMonitoring();
        
        // Notify parent components
        if (renderer.onContextLoss) {
            renderer.onContextLoss();
        }
    }
    
    // Handle context restore
    handleContextRestore(renderer) {
        this.startMemoryMonitoring();
        
        // Notify parent components
        if (renderer.onContextRestore) {
            renderer.onContextRestore();
        }
    }
    
    // Register geometry for tracking
    registerGeometry(geometry) {
        if (geometry && !this.geometries.has(geometry)) {
            this.geometries.add(geometry);
            this.updateMemoryUsage();
            logger.trace(`Geometry registered: ${geometry.type || 'Unknown'}`);
        }
    }
    
    // Register material for tracking
    registerMaterial(material) {
        if (material && !this.materials.has(material)) {
            this.materials.add(material);
            this.updateMemoryUsage();
            logger.trace(`Material registered: ${material.type || 'Unknown'}`);
        }
    }
    
    // Register texture for tracking
    registerTexture(texture) {
        if (texture && !this.textures.has(texture)) {
            this.textures.add(texture);
            this.updateMemoryUsage();
            logger.trace(`Texture registered: ${texture.type || 'Unknown'}`);
        }
    }
    
    // Register render target for tracking
    registerRenderTarget(renderTarget) {
        if (renderTarget && !this.renderTargets.has(renderTarget)) {
            this.renderTargets.add(renderTarget);
            this.updateMemoryUsage();
            logger.trace('Render target registered');
        }
    }
    
    // Dispose geometry and remove from tracking
    disposeGeometry(geometry) {
        if (geometry && this.geometries.has(geometry)) {
            geometry.dispose();
            this.geometries.delete(geometry);
            this.updateMemoryUsage();
            logger.trace(`Geometry disposed: ${geometry.type || 'Unknown'}`);
        }
    }
    
    // Dispose material and remove from tracking
    disposeMaterial(material) {
        if (material && this.materials.has(material)) {
            material.dispose();
            this.materials.delete(material);
            this.updateMemoryUsage();
            logger.trace(`Material disposed: ${material.type || 'Unknown'}`);
        }
    }
    
    // Dispose texture and remove from tracking
    disposeTexture(texture) {
        if (texture && this.textures.has(texture)) {
            texture.dispose();
            this.textures.delete(texture);
            this.updateMemoryUsage();
            logger.trace(`Texture disposed: ${texture.type || 'Unknown'}`);
        }
    }
    
    // Dispose render target and remove from tracking
    disposeRenderTarget(renderTarget) {
        if (renderTarget && this.renderTargets.has(renderTarget)) {
            renderTarget.dispose();
            this.renderTargets.delete(renderTarget);
            this.updateMemoryUsage();
            logger.trace('Render target disposed');
        }
    }
    
    // Clear all managed resources
    clearManagedResources() {
        logger.debug('Clearing all managed WebGL resources');
        
        // Dispose geometries
        this.geometries.forEach(geometry => {
            try {
                geometry.dispose();
            } catch (error) {
                logger.warn('Error disposing geometry:', error);
            }
        });
        this.geometries.clear();
        
        // Dispose materials
        this.materials.forEach(material => {
            try {
                material.dispose();
            } catch (error) {
                logger.warn('Error disposing material:', error);
            }
        });
        this.materials.clear();
        
        // Dispose textures
        this.textures.forEach(texture => {
            try {
                texture.dispose();
            } catch (error) {
                logger.warn('Error disposing texture:', error);
            }
        });
        this.textures.clear();
        
        // Dispose render targets
        this.renderTargets.forEach(renderTarget => {
            try {
                renderTarget.dispose();
            } catch (error) {
                logger.warn('Error disposing render target:', error);
            }
        });
        this.renderTargets.clear();
        
        this.updateMemoryUsage();
        logger.info('All WebGL resources cleared');
    }
    
    // Force WebGL context loss (for testing/cleanup)
    forceContextLoss() {
        this.contexts.forEach(renderer => {
            const gl = renderer.getContext();
            if (gl) {
                const loseContext = gl.getExtension('WEBGL_lose_context');
                if (loseContext) {
                    loseContext.loseContext();
                    logger.debug('Forced WebGL context loss');
                }
            }
        });
    }
    
    // Update memory usage tracking
    updateMemoryUsage() {
        this.memoryUsage = {
            geometries: this.geometries.size,
            materials: this.materials.size,
            textures: this.textures.size,
            renderTargets: this.renderTargets.size,
            total: this.geometries.size + this.materials.size + this.textures.size + this.renderTargets.size
        };
        
        // Check for memory pressure
        this.checkMemoryPressure();
    }
    
    // Check for memory pressure and cleanup if needed
    checkMemoryPressure() {
        const usage = this.memoryUsage;
        let needsCleanup = false;
        
        if (usage.textures > this.thresholds.maxTextures) {
            logger.warn(`High texture count: ${usage.textures}/${this.thresholds.maxTextures}`);
            needsCleanup = true;
        }
        
        if (usage.geometries > this.thresholds.maxGeometries) {
            logger.warn(`High geometry count: ${usage.geometries}/${this.thresholds.maxGeometries}`);
            needsCleanup = true;
        }
        
        if (needsCleanup) {
            this.performEmergencyCleanup();
        }
    }
    
    // Perform emergency cleanup under memory pressure
    performEmergencyCleanup() {
        logger.warn('Performing emergency WebGL resource cleanup');
        
        // Force garbage collection if available
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
        
        // Notify contexts to reduce quality
        this.contexts.forEach(renderer => {
            if (renderer.onMemoryPressure) {
                renderer.onMemoryPressure();
            }
        });
        
        logger.info('Emergency cleanup completed');
    }
    
    // Start memory monitoring
    startMemoryMonitoring() {
        if (this.memoryCheckInterval) {
            clearInterval(this.memoryCheckInterval);
        }
        
        this.memoryCheckInterval = setInterval(() => {
            this.updateMemoryUsage();
            this.logMemoryStats();
        }, 5000); // Check every 5 seconds
        
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        
        this.cleanupInterval = setInterval(() => {
            this.performRoutineCleanup();
        }, this.thresholds.cleanupInterval);
        
        logger.debug('Memory monitoring started');
    }
    
    // Stop memory monitoring
    stopMemoryMonitoring() {
        if (this.memoryCheckInterval) {
            clearInterval(this.memoryCheckInterval);
            this.memoryCheckInterval = null;
        }
        
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        
        logger.debug('Memory monitoring stopped');
    }
    
    // Perform routine cleanup
    performRoutineCleanup() {
        logger.trace('Performing routine WebGL cleanup');
        
        // Remove disposed resources from tracking
        this.geometries.forEach(geometry => {
            if (geometry.isDisposed) {
                this.geometries.delete(geometry);
            }
        });
        
        this.materials.forEach(material => {
            if (material.isDisposed) {
                this.materials.delete(material);
            }
        });
        
        this.textures.forEach(texture => {
            if (texture.isDisposed) {
                this.textures.delete(texture);
            }
        });
        
        this.updateMemoryUsage();
    }
    
    // Log memory statistics
    logMemoryStats() {
        const usage = this.memoryUsage;
        
        if (usage.total > 0) {
            logger.debug(`WebGL Memory: ${usage.geometries}G ${usage.materials}M ${usage.textures}T ${usage.renderTargets}RT`);
        }
        
        // Log browser memory if available
        if (performance.memory) {
            const heapMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
            logger.debug(`Heap usage: ${heapMB}MB`);
        }
    }
    
    // Get memory statistics
    getMemoryStats() {
        return {
            ...this.memoryUsage,
            contexts: this.contexts.size,
            thresholds: this.thresholds,
            monitoring: this.memoryCheckInterval !== null
        };
    }
    
    // Set memory thresholds
    setThresholds(newThresholds) {
        this.thresholds = { ...this.thresholds, ...newThresholds };
        logger.debug('Memory thresholds updated:', this.thresholds);
    }
    
    // Dispose memory manager
    dispose() {
        logger.debug('Disposing WebGL Memory Manager');
        
        this.stopMemoryMonitoring();
        this.clearManagedResources();
        
        // Clear context references
        this.contexts.clear();
        this.buffers.clear();
        
        logger.info('WebGL Memory Manager disposed');
    }
}

// Create singleton instance
const webglMemoryManager = new WebGLMemoryManager();
export default webglMemoryManager;
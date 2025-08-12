// Interaction System - Advanced mouse interaction system for 3D ASCII engine
// Handles progressive morphing through region-based crossing detection

import * as THREE from 'three';

export class InteractionSystem {
    constructor(scene, camera, raycaster) {
        this.scene = scene;
        this.camera = camera;
        this.raycaster = raycaster;
        
        // Mouse tracking
        this.mouse = new THREE.Vector2();
        this.previousMouse = new THREE.Vector2();
        this.mouseVelocity = new THREE.Vector2();
        
        // Interaction regions
        this.interactionRegions = [];
        this.regionSize = 100; // pixels
        this.regionOverlap = 0.5; // 50% overlap
        
        // Progressive morphing
        this.interactionCount = 0;
        this.regionsCrossed = 0;
        this.morphProgress = 0;
        this.maxMorphProgress = 100;
        
        // Back-and-forth interaction detection
        this.movementHistory = [];
        this.maxMovementHistory = 20;
        this.backAndForthCounter = 0;
        this.lastDirectionX = 0;
        this.directionChangeThreshold = 0.01; // minimum movement to count as direction change
        this.backAndForthBonus = 5; // bonus morph progress for back-and-forth movement
        
        // Interaction history
        this.interactionHistory = [];
        this.maxHistoryLength = 50;
        
        // Timing
        this.lastInteractionTime = 0;
        this.interactionCooldown = 100; // ms
        
        // Effects
        this.morphingIntensity = 1.0;
        this.decayRate = 0.95;
        
        console.log('🎯 InteractionSystem: Initialized');
        this.setupInteractionRegions();
    }
    
    // Setup interaction regions for progressive morphing
    setupInteractionRegions() {
        // Create a grid of interaction regions
        const regionsX = Math.ceil(window.innerWidth / this.regionSize);
        const regionsY = Math.ceil(window.innerHeight / this.regionSize);
        
        this.interactionRegions = [];
        
        for (let x = 0; x < regionsX; x++) {
            for (let y = 0; y < regionsY; y++) {
                this.interactionRegions.push({
                    id: `${x}-${y}`,
                    x: x * this.regionSize,
                    y: y * this.regionSize,
                    width: this.regionSize,
                    height: this.regionSize,
                    visited: false,
                    visitCount: 0,
                    lastVisited: 0,
                    intensity: 0
                });
            }
        }
        
        console.log(`🎯 Created ${this.interactionRegions.length} interaction regions`);
    }
    
    // Update mouse position
    updateMousePosition(normalizedX, normalizedY) {
        // Store previous position
        this.previousMouse.copy(this.mouse);
        
        // Update current position
        this.mouse.x = normalizedX;
        this.mouse.y = normalizedY;
        
        // Calculate velocity
        this.mouseVelocity.subVectors(this.mouse, this.previousMouse);
        
        // Detect back-and-forth movement
        this.detectBackAndForthMovement();
        
        // Check for region crossings
        this.checkRegionCrossings();
    }
    
    // Detect back-and-forth mouse movement patterns
    detectBackAndForthMovement() {
        const currentMovementX = this.mouseVelocity.x;
        
        // Only track significant movements
        if (Math.abs(currentMovementX) < this.directionChangeThreshold) {
            return;
        }
        
        // Add to movement history
        this.movementHistory.push({
            x: currentMovementX,
            y: this.mouseVelocity.y,
            time: performance.now()
        });
        
        // Limit history size
        if (this.movementHistory.length > this.maxMovementHistory) {
            this.movementHistory.shift();
        }
        
        // Detect direction changes (back-and-forth pattern)
        const currentDirection = Math.sign(currentMovementX);
        
        if (this.lastDirectionX !== 0 && currentDirection !== 0 && currentDirection !== this.lastDirectionX) {
            // Direction changed - this is back-and-forth movement!
            this.backAndForthCounter++;
            
            // Award bonus morph progress for back-and-forth patterns
            if (this.backAndForthCounter % 3 === 0) { // Every 3 direction changes
                this.morphProgress = Math.min(
                    this.morphProgress + this.backAndForthBonus,
                    this.maxMorphProgress
                );
                
                console.log(`🔄 Back-and-forth detected! Counter: ${this.backAndForthCounter}, Morph: ${this.morphProgress.toFixed(1)}%`);
                
                // Trigger visual feedback if available
                this.triggerBackAndForthFeedback();
            }
        }
        
        this.lastDirectionX = currentDirection;
    }
    
    // Trigger visual feedback for back-and-forth interaction
    triggerBackAndForthFeedback() {
        // Emit custom event for visual feedback
        const feedbackEvent = new CustomEvent('back-and-forth-detected', {
            detail: {
                counter: this.backAndForthCounter,
                morphProgress: this.morphProgress,
                intensity: this.morphingIntensity
            }
        });
        document.dispatchEvent(feedbackEvent);
    }
    
    // Check if mouse has crossed into new regions
    checkRegionCrossings() {
        const currentTime = performance.now();
        
        // Convert normalized coordinates to screen coordinates
        const screenX = (this.mouse.x + 1) * window.innerWidth * 0.5;
        const screenY = (-this.mouse.y + 1) * window.innerHeight * 0.5;
        
        // Find current region
        const currentRegion = this.getRegionAt(screenX, screenY);
        
        if (currentRegion && !currentRegion.visited) {
            // Mark region as visited
            currentRegion.visited = true;
            currentRegion.visitCount++;
            currentRegion.lastVisited = currentTime;
            currentRegion.intensity = Math.min(currentRegion.intensity + 0.2, 1.0);
            
            this.regionsCrossed++;
            this.updateMorphProgress();
            
            // Add to interaction history
            this.addInteractionEvent('region_cross', {
                regionId: currentRegion.id,
                position: { x: screenX, y: screenY },
                velocity: this.mouseVelocity.length()
            });
            
            console.log(`🎯 Region crossed: ${currentRegion.id}, Total: ${this.regionsCrossed}`);
        }
    }
    
    // Get region at screen coordinates
    getRegionAt(screenX, screenY) {
        return this.interactionRegions.find(region => 
            screenX >= region.x && screenX < region.x + region.width &&
            screenY >= region.y && screenY < region.y + region.height
        );
    }
    
    // Update morphing progress based on interactions
    updateMorphProgress() {
        // Calculate progress based on regions crossed
        const regionProgress = (this.regionsCrossed / this.interactionRegions.length) * 100;
        
        // Apply easing and intensity
        this.morphProgress = Math.min(
            regionProgress * this.morphingIntensity,
            this.maxMorphProgress
        );
        
        // Update interaction count
        this.interactionCount++;
    }
    
    // Handle click interactions
    handleClick(normalizedX, normalizedY) {
        const currentTime = performance.now();
        
        // Check cooldown
        if (currentTime - this.lastInteractionTime < this.interactionCooldown) {
            return;
        }
        
        this.lastInteractionTime = currentTime;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check intersections with scene objects
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const intersection = intersects[0];
            this.addInteractionEvent('click', {
                object: intersection.object.name || 'unnamed',
                point: intersection.point,
                distance: intersection.distance
            });
            
            // Boost morph progress on successful click
            this.morphProgress = Math.min(this.morphProgress + 10, this.maxMorphProgress);
            
            console.log('🎯 Click interaction:', intersection.object.name);
        }
    }
    
    // Simulate interaction for testing
    simulateInteraction(screenX, screenY) {
        // Convert screen coordinates to normalized
        const normalizedX = (screenX / window.innerWidth) * 2 - 1;
        const normalizedY = -(screenY / window.innerHeight) * 2 + 1;
        
        this.updateMousePosition(normalizedX, normalizedY);
        this.handleClick(normalizedX, normalizedY);
    }
    
    // Add interaction event to history
    addInteractionEvent(type, data) {
        const event = {
            type,
            timestamp: performance.now(),
            data,
            morphProgress: this.morphProgress
        };
        
        this.interactionHistory.push(event);
        
        // Limit history length
        if (this.interactionHistory.length > this.maxHistoryLength) {
            this.interactionHistory.shift();
        }
    }
    
    // Update system (called each frame)
    update(deltaTime) {
        // Decay region intensities over time
        this.interactionRegions.forEach(region => {
            if (region.intensity > 0) {
                region.intensity *= this.decayRate;
                
                // Reset visited status when intensity is very low
                if (region.intensity < 0.01) {
                    region.visited = false;
                    region.intensity = 0;
                }
            }
        });
        
        // Gradually decay morph progress
        if (this.morphProgress > 0) {
            this.morphProgress *= 0.999; // Very slow decay
        }
    }
    
    // Reset all interactions
    reset() {
        console.log('🔄 Resetting interaction system...');
        
        // Reset counters
        this.interactionCount = 0;
        this.regionsCrossed = 0;
        this.morphProgress = 0;
        
        // Reset back-and-forth tracking
        this.backAndForthCounter = 0;
        this.lastDirectionX = 0;
        this.movementHistory = [];
        
        // Reset regions
        this.interactionRegions.forEach(region => {
            region.visited = false;
            region.visitCount = 0;
            region.intensity = 0;
        });
        
        // Clear history
        this.interactionHistory = [];
        
        // Reset mouse
        this.mouse.set(0, 0);
        this.previousMouse.set(0, 0);
        this.mouseVelocity.set(0, 0);
        
        console.log('✅ Interaction system reset complete');
    }
    
    // Get interaction data for external use
    getInteractionData() {
        return {
            count: this.interactionCount,
            crossings: this.regionsCrossed,
            morphProgress: Math.round(this.morphProgress),
            regionsTotal: this.interactionRegions.length,
            regionsVisited: this.interactionRegions.filter(r => r.visited).length,
            historyLength: this.interactionHistory.length,
            mouseVelocity: this.mouseVelocity.length(),
            averageIntensity: this.getAverageRegionIntensity(),
            backAndForthCounter: this.backAndForthCounter,
            movementHistoryLength: this.movementHistory.length,
            directionChanges: this.backAndForthCounter
        };
    }
    
    // Get average region intensity
    getAverageRegionIntensity() {
        const totalIntensity = this.interactionRegions.reduce((sum, region) => sum + region.intensity, 0);
        return totalIntensity / this.interactionRegions.length;
    }
    
    // Get interaction statistics
    getStatistics() {
        const recentInteractions = this.interactionHistory.filter(
            event => performance.now() - event.timestamp < 5000 // Last 5 seconds
        );
        
        return {
            ...this.getInteractionData(),
            recentInteractions: recentInteractions.length,
            interactionRate: recentInteractions.length / 5, // per second
            lastInteractionTime: this.lastInteractionTime,
            regionCoverage: (this.regionsCrossed / this.interactionRegions.length) * 100
        };
    }
    
    // Dispose and cleanup
    dispose() {
        console.log('🧹 Disposing InteractionSystem...');
        
        // Clear arrays
        this.interactionRegions = [];
        this.interactionHistory = [];
        
        // Clear references
        this.scene = null;
        this.camera = null;
        this.raycaster = null;
        
        console.log('✅ InteractionSystem disposed');
    }
}
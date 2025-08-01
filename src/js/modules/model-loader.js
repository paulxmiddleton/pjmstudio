// Model Loader - 3D model loading utility for ASCII 3D engine
// Handles GLTF, OBJ, and procedural model generation with caching and optimization

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        
        // Loaders
        this.gltfLoader = new GLTFLoader();
        this.objLoader = new OBJLoader();
        
        // Model cache
        this.modelCache = new Map();
        this.loadingPromises = new Map();
        
        // Model configurations
        this.modelConfigs = {
            cube: {
                type: 'procedural',
                generator: () => this.createCube(),
                scale: 2,
                position: [0, 0, 0]
            },
            sphere: {
                type: 'procedural',
                generator: () => this.createSphere(),
                scale: 2,
                position: [0, 0, 0]
            },
            torus: {
                type: 'procedural',
                generator: () => this.createTorus(),
                scale: 2,
                position: [0, 0, 0]
            },
            dragon: {
                type: 'gltf',
                path: '/src/assets/models/dragon-head.glb',
                fallback: () => this.createDragonFallback(),
                scale: 1,
                position: [0, 0, 0]
            },
            castle: {
                type: 'gltf',
                path: '/src/assets/models/castle.glb',
                fallback: () => this.createCastleFallback(),
                scale: 1,
                position: [0, -1, 0]
            },
            sword: {
                type: 'obj',
                path: '/src/assets/models/sword.obj',
                fallback: () => this.createSwordFallback(),
                scale: 1,
                position: [0, 0, 0]
            }
        };
        
        // Material configurations
        this.materials = {
            default: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            metal: new THREE.MeshStandardMaterial({ 
                color: 0xcccccc, 
                metalness: 0.8, 
                roughness: 0.2 
            }),
            stone: new THREE.MeshLambertMaterial({ 
                color: 0x999999,
                transparent: true,
                opacity: 0.9
            }),
            dragon: new THREE.MeshStandardMaterial({ 
                color: 0x8B4513,
                metalness: 0.1,
                roughness: 0.8
            })
        };
        
        // Statistics
        this.stats = {
            loaded: 0,
            failed: 0,
            cached: 0
        };
        
        console.log('📦 ModelLoader: Initialized with', Object.keys(this.modelConfigs).length, 'model types');
    }
    
    // Load model by name
    async loadModel(modelName) {
        console.log(`📦 Loading model: ${modelName}`);
        
        // Check if model is already loaded
        if (this.modelCache.has(modelName)) {
            console.log(`✅ Model ${modelName} loaded from cache`);
            this.stats.cached++;
            return this.modelCache.get(modelName).clone();
        }
        
        // Check if model is currently loading
        if (this.loadingPromises.has(modelName)) {
            console.log(`⏳ Model ${modelName} already loading, waiting...`);
            return await this.loadingPromises.get(modelName);
        }
        
        // Get model configuration
        const config = this.modelConfigs[modelName];
        if (!config) {
            console.warn(`⚠️ Unknown model: ${modelName}, creating default cube`);
            return this.createCube();
        }
        
        // Create loading promise
        const loadingPromise = this.loadModelByConfig(modelName, config);
        this.loadingPromises.set(modelName, loadingPromise);
        
        try {
            const model = await loadingPromise;
            
            // Cache the original model
            this.modelCache.set(modelName, model);
            this.stats.loaded++;
            
            console.log(`✅ Model ${modelName} loaded successfully`);
            return model.clone();
            
        } catch (error) {
            console.error(`❌ Failed to load model ${modelName}:`, error);
            this.stats.failed++;
            
            // Return fallback model
            return this.createFallbackModel(modelName, config);
            
        } finally {
            this.loadingPromises.delete(modelName);
        }
    }
    
    // Load model based on configuration
    async loadModelByConfig(modelName, config) {
        let model;
        
        switch (config.type) {
            case 'procedural':
                model = config.generator();
                break;
                
            case 'gltf':
                model = await this.loadGLTFModel(config.path);
                break;
                
            case 'obj':
                model = await this.loadOBJModel(config.path);
                break;
                
            default:
                throw new Error(`Unknown model type: ${config.type}`);
        }
        
        // Apply transformations
        if (config.scale !== undefined) {
            model.scale.setScalar(config.scale);
        }
        
        if (config.position) {
            model.position.set(...config.position);
        }
        
        // Apply model-specific materials
        this.applyModelMaterial(model, modelName);
        
        // Optimize for ASCII rendering
        this.optimizeForASCII(model);
        
        return model;
    }
    
    // Load GLTF model
    async loadGLTFModel(path) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                path,
                (gltf) => {
                    const model = gltf.scene;
                    this.preprocessModel(model);
                    resolve(model);
                },
                (progress) => {
                    console.log('GLTF loading progress:', progress);
                },
                (error) => {
                    console.error('GLTF loading error:', error);
                    reject(error);
                }
            );
        });
    }
    
    // Load OBJ model
    async loadOBJModel(path) {
        return new Promise((resolve, reject) => {
            this.objLoader.load(
                path,
                (object) => {
                    this.preprocessModel(object);
                    resolve(object);
                },
                (progress) => {
                    console.log('OBJ loading progress:', progress);
                },
                (error) => {
                    console.error('OBJ loading error:', error);
                    reject(error);
                }
            );
        });
    }
    
    // Preprocess loaded model
    preprocessModel(model) {
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Ensure reasonable scale
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 4) {
            const scale = 4 / maxDimension;
            model.scale.setScalar(scale);
        }
        
        // Enable shadows
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
    
    // Apply material based on model name
    applyModelMaterial(model, modelName) {
        let material;
        
        switch (modelName) {
            case 'sword':
                material = this.materials.metal;
                break;
            case 'castle':
                material = this.materials.stone;
                break;
            case 'dragon':
                material = this.materials.dragon;
                break;
            default:
                material = this.materials.default;
                break;
        }
        
        // Apply material to all meshes
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = material.clone();
            }
        });
    }
    
    // Optimize model for ASCII rendering
    optimizeForASCII(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                // Simplify materials for better ASCII conversion
                if (child.material) {
                    child.material.transparent = false;
                    child.material.alphaTest = 0;
                    
                    // Enhance contrast for better ASCII conversion
                    if (child.material.color) {
                        const color = child.material.color;
                        // Increase contrast by pushing colors towards extremes
                        color.r = color.r > 0.5 ? Math.min(1, color.r * 1.2) : Math.max(0, color.r * 0.8);
                        color.g = color.g > 0.5 ? Math.min(1, color.g * 1.2) : Math.max(0, color.g * 0.8);
                        color.b = color.b > 0.5 ? Math.min(1, color.b * 1.2) : Math.max(0, color.b * 0.8);
                    }
                }
            }
        });
    }
    
    // Create fallback model
    createFallbackModel(modelName, config) {
        console.log(`🔄 Creating fallback model for: ${modelName}`);
        
        if (config.fallback) {
            return config.fallback();
        }
        
        // Default fallback is a cube
        return this.createCube();
    }
    
    // === PROCEDURAL MODEL GENERATORS ===
    
    // Create cube
    createCube() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = this.materials.default.clone();
        const cube = new THREE.Mesh(geometry, material);
        cube.name = 'cube';
        return cube;
    }
    
    // Create sphere
    createSphere() {
        const geometry = new THREE.SphereGeometry(1.5, 16, 12);
        const material = this.materials.default.clone();
        const sphere = new THREE.Mesh(geometry, material);
        sphere.name = 'sphere';
        return sphere;
    }
    
    // Create torus
    createTorus() {
        const geometry = new THREE.TorusGeometry(1, 0.4, 8, 12);
        const material = this.materials.default.clone();
        const torus = new THREE.Mesh(geometry, material);
        torus.name = 'torus';
        return torus;
    }
    
    // === FALLBACK MODEL CREATORS ===
    
    // Create dragon head fallback
    createDragonFallback() {
        const group = new THREE.Group();
        
        // Head (stretched sphere)
        const headGeometry = new THREE.SphereGeometry(1, 12, 8);
        headGeometry.scale(1.5, 1, 1.2);
        const headMaterial = this.materials.dragon.clone();
        const head = new THREE.Mesh(headGeometry, headMaterial);
        group.add(head);
        
        // Horns (cones)
        const hornGeometry = new THREE.ConeGeometry(0.1, 0.5, 6);
        const hornMaterial = this.materials.metal.clone();
        
        const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        leftHorn.position.set(-0.3, 0.8, 0.2);
        leftHorn.rotation.z = -0.3;
        group.add(leftHorn);
        
        const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        rightHorn.position.set(0.3, 0.8, 0.2);
        rightHorn.rotation.z = 0.3;
        group.add(rightHorn);
        
        // Snout (smaller stretched sphere)
        const snoutGeometry = new THREE.SphereGeometry(0.4, 8, 6);
        snoutGeometry.scale(2, 0.8, 0.8);
        const snout = new THREE.Mesh(snoutGeometry, headMaterial);
        snout.position.set(0, -0.2, 1);
        group.add(snout);
        
        group.name = 'dragon_fallback';
        return group;
    }
    
    // Create castle fallback
    createCastleFallback() {
        const group = new THREE.Group();
        const stoneMaterial = this.materials.stone.clone();
        
        // Main keep (tall box)
        const keepGeometry = new THREE.BoxGeometry(1.5, 3, 1.5);
        const keep = new THREE.Mesh(keepGeometry, stoneMaterial);
        keep.position.set(0, 0, 0);
        group.add(keep);
        
        // Towers (cylinders)
        const towerGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 8);
        
        const positions = [
            [-1, 0, -1],
            [1, 0, -1],
            [-1, 0, 1],
            [1, 0, 1]
        ];
        
        positions.forEach(pos => {
            const tower = new THREE.Mesh(towerGeometry, stoneMaterial);
            tower.position.set(...pos);
            group.add(tower);
            
            // Tower caps (cones)
            const capGeometry = new THREE.ConeGeometry(0.5, 0.8, 8);
            const cap = new THREE.Mesh(capGeometry, stoneMaterial);
            cap.position.set(pos[0], pos[1] + 1.6, pos[2]);
            group.add(cap);
        });
        
        // Main gate (recessed box)
        const gateGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.2);
        const gateMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const gate = new THREE.Mesh(gateGeometry, gateMaterial);
        gate.position.set(0, -0.7, 0.65);
        group.add(gate);
        
        group.name = 'castle_fallback';
        return group;
    }
    
    // Create sword fallback
    createSwordFallback() {
        const group = new THREE.Group();
        const metalMaterial = this.materials.metal.clone();
        
        // Blade (long thin box)
        const bladeGeometry = new THREE.BoxGeometry(0.1, 3, 0.05);
        const blade = new THREE.Mesh(bladeGeometry, metalMaterial);
        blade.position.set(0, 0.5, 0);
        group.add(blade);
        
        // Crossguard (horizontal box)
        const guardGeometry = new THREE.BoxGeometry(1, 0.1, 0.1);
        const guard = new THREE.Mesh(guardGeometry, metalMaterial);
        guard.position.set(0, -1, 0);
        group.add(guard);
        
        // Handle (cylinder)
        const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
        const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0, -1.5, 0);
        group.add(handle);
        
        // Pommel (sphere)
        const pommelGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const pommel = new THREE.Mesh(pommelGeometry, metalMaterial);
        pommel.position.set(0, -1.9, 0);
        group.add(pommel);
        
        group.name = 'sword_fallback';
        return group;
    }
    
    // === UTILITY METHODS ===
    
    // Get model metadata
    getModelInfo(modelName) {
        const config = this.modelConfigs[modelName];
        if (!config) return null;
        
        return {
            name: modelName,
            type: config.type,
            path: config.path || 'procedural',
            cached: this.modelCache.has(modelName),
            loading: this.loadingPromises.has(modelName)
        };
    }
    
    // Get all available model names
    getAvailableModels() {
        return Object.keys(this.modelConfigs);
    }
    
    // Get loading statistics
    getStats() {
        return {
            ...this.stats,
            cached: this.modelCache.size,
            loading: this.loadingPromises.size
        };
    }
    
    // Preload specific models
    async preloadModels(modelNames) {
        console.log('🚀 Preloading models:', modelNames);
        
        const promises = modelNames.map(name => this.loadModel(name));
        
        try {
            await Promise.all(promises);
            console.log('✅ All models preloaded successfully');
        } catch (error) {
            console.warn('⚠️ Some models failed to preload:', error);
        }
    }
    
    // Clear model cache
    clearCache() {
        console.log('🧹 Clearing model cache...');
        
        // Dispose of cached models
        this.modelCache.forEach((model, name) => {
            model.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
        
        this.modelCache.clear();
        this.stats.cached = 0;
        
        console.log('✅ Model cache cleared');
    }
    
    // Dispose and cleanup
    dispose() {
        console.log('🧹 Disposing ModelLoader...');
        
        // Clear cache
        this.clearCache();
        
        // Dispose materials
        Object.values(this.materials).forEach(material => {
            material.dispose();
        });
        
        // Clear references
        this.scene = null;
        this.gltfLoader = null;
        this.objLoader = null;
        this.loadingPromises.clear();
        
        console.log('✅ ModelLoader disposed');
    }
}
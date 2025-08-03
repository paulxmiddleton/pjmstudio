// Model Assets - Explicit imports to ensure models are included in production build

// Import all existing 3D model files so Vite processes them
import swordModelUrl from '/src/assets/models/custom/sword-model.glb?url';
import pxmLogoUrl from '/src/assets/models/custom/pxm-logo2.glb?url';
import stoneTowerUrl from '/src/assets/models/custom/stone-tower.glb?url';
import castleArchersUrl from '/src/assets/models/custom/castle-archers.glb?url';
import lumpyUrl from '/src/assets/models/custom/lumpy-1.glb?url';

// Additional models available in the assets folder
import girlWithPearlUrl from '/src/assets/models/girlwithpearlearring-3d.glb?url';

// Export model URL mappings for runtime path resolution
export const MODEL_URLS = {
    'sword': swordModelUrl,
    'pxm-logo': pxmLogoUrl,
    'stone-tower': stoneTowerUrl,
    'castle-archers': castleArchersUrl,
    'lumpy': lumpyUrl,
    'girl-with-pearl': girlWithPearlUrl
};

// Helper function to get production-safe model URL
export function getModelUrl(modelName) {
    const url = MODEL_URLS[modelName];
    if (!url) {
        console.warn(`⚠️ Model URL not found for: ${modelName}`);
        return null;
    }
    return url;
}

// Helper function to preload model assets
export function preloadModelAssets() {
    console.log('🚀 Preloading model assets for production...');
    
    Object.entries(MODEL_URLS).forEach(([modelName, url]) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        console.log(`📦 Preloading: ${modelName} → ${url}`);
    });
}

console.log('📦 Model assets module loaded with', Object.keys(MODEL_URLS).length, 'models');
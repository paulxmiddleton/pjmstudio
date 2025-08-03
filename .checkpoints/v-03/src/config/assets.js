// assets.js - Asset loading and optimization configuration
export const assetConfig = {
    // Video configurations
    videos: {
        birds: {
            sources: [
                { src: '/src/assets/videos/birds.webm', type: 'video/webm' },
                { src: '/src/assets/videos/birds.mov', type: 'video/quicktime' }
            ],
            options: {
                autoplay: true,
                loop: true,
                muted: true,
                playsInline: true,
                preload: 'metadata'
            },
            styles: {
                position: 'absolute',
                top: '15%',
                left: '65%',
                transform: 'translateX(-50%)',
                width: '400px',
                height: 'auto',
                opacity: '0.7',
                mixBlendMode: 'screen',
                zIndex: '4',
                pointerEvents: 'none'
            }
        }
    },
    
    // Image lazy loading configuration
    images: {
        // Critical images (load immediately)
        critical: [
            '/src/assets/images/landing-illustration.jpg',
            '/src/assets/images/knight-body-centered.png',
            '/src/assets/images/knight-head-centered.png',
            '/src/assets/images/knight-sword-centered.png'
        ],
        
        // Secondary images (lazy load)
        lazy: [
            '/src/assets/images/dragon-silhouette.png',
            '/src/assets/images/middleton-crest.png',
            '/src/assets/images/nova-logo.png'
        ]
    },
    
    // Font loading strategy
    fonts: {
        preload: [
            '/src/assets/fonts/Tempting.woff2',
            '/src/assets/fonts/Tempting.woff'
        ],
        webFonts: [
            'UnifrakturMaguntia',
            'Cinzel:wght@400;600'
        ]
    }
};

// Asset loader utility
export class AssetLoader {
    constructor() {
        this.loadedAssets = new Set();
        this.loadingPromises = new Map();
    }
    
    // Preload critical images
    async preloadCriticalImages() {
        const promises = assetConfig.images.critical.map(src => this.loadImage(src));
        return Promise.all(promises);
    }
    
    // Load image with promise
    loadImage(src) {
        if (this.loadedAssets.has(src)) {
            return Promise.resolve();
        }
        
        if (this.loadingPromises.has(src)) {
            return this.loadingPromises.get(src);
        }
        
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.loadedAssets.add(src);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
        
        this.loadingPromises.set(src, promise);
        return promise;
    }
    
    // Create optimized video element
    createVideoElement(videoConfig) {
        const video = document.createElement('video');
        
        // Apply options
        Object.entries(videoConfig.options).forEach(([key, value]) => {
            video[key] = value;
        });
        
        // Add sources
        videoConfig.sources.forEach(source => {
            const sourceEl = document.createElement('source');
            sourceEl.src = source.src;
            sourceEl.type = source.type;
            video.appendChild(sourceEl);
        });
        
        // Apply styles
        Object.entries(videoConfig.styles).forEach(([key, value]) => {
            video.style[key] = value;
        });
        
        // Add classes
        video.className = 'birds-video';
        
        return video;
    }
    
    // Lazy load images when they come into viewport
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        if (src) {
                            this.loadImage(src).then(() => {
                                img.src = src;
                                img.removeAttribute('data-src');
                                observer.unobserve(img);
                            });
                        }
                    }
                });
            });
            
            // Observe lazy images
            assetConfig.images.lazy.forEach(src => {
                const img = document.querySelector(`img[src="${src}"]`);
                if (img) {
                    img.dataset.src = src;
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+'; // 1px transparent placeholder
                    observer.observe(img);
                }
            });
        } else {
            // Fallback for older browsers
            assetConfig.images.lazy.forEach(src => {
                this.loadImage(src);
            });
        }
    }
}

// Export singleton instance
export const assetLoader = new AssetLoader();
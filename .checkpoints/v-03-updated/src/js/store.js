// Store functionality - Shopify integration ready
import '../styles/store.scss';
import { createNotification, createScanlines } from './modules/dom-utils.js';

// Simple loading manager for store page
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.init();
    }

    init() {
        // Hide loading screen after a short delay
        setTimeout(() => {
            this.hideLoading();
        }, 500);
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                document.body.style.opacity = '1';
            }, 500);
        }
    }
}

class StoreManager {
    constructor() {
        this.loadingManager = new LoadingManager();
        this.initStore();
        this.initEventListeners();
        this.initBrutalistEffects();
        this.initTerminalEffects();
    }

    initStore() {
        // This will be used for future Shopify integration
        this.shopifyDomain = 'pjm-studio.myshopify.com'; // To be configured
        this.apiAccessToken = ''; // To be configured with actual token
        
        // Category filtering
        this.currentCategory = 'all';
        this.products = this.getAllProducts();
        
        // Brutalist store enhancement
        this.terminalLines = [];
        this.glitchInterval = null;
        this.scanlineElement = null;
        
        console.log('Store initialized with', this.products.length, 'products');
        this.updateTerminalStatus();
    }

    initEventListeners() {
        // Category filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target.dataset.category);
            });
        });

        // Newsletter signup
        const signupBtn = document.querySelector('.signup-btn');
        if (signupBtn) {
            signupBtn.addEventListener('click', this.handleNewsletterSignup.bind(this));
        }

        // Product buttons (currently disabled for coming soon)
        const productButtons = document.querySelectorAll('.add-to-cart-btn');
        productButtons.forEach(btn => {
            btn.addEventListener('click', this.handleProductAction.bind(this));
        });
    }

    getAllProducts() {
        return document.querySelectorAll('.product-card');
    }

    handleCategoryFilter(category) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter products
        this.currentCategory = category;
        this.products.forEach(product => {
            const productCategory = product.dataset.category;
            if (category === 'all' || productCategory === category) {
                product.style.display = 'block';
                // Add entrance animation
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 100);
            } else {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 300);
            }
        });

        console.log(`Filtered to category: ${category}`);
        this.updateFilterStatus(category);
        this.triggerTerminalGlitch();
    }

    handleNewsletterSignup() {
        const emailInput = document.querySelector('.email-input');
        const email = emailInput.value.trim();

        if (!email) {
            this.showNotification('Please enter your email address', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // TODO: Integrate with actual email service (e.g., Mailchimp, ConvertKit)
        this.simulateNewsletterSignup(email);
    }

    simulateNewsletterSignup(email) {
        const signupBtn = document.querySelector('.signup-btn');
        const originalText = signupBtn.textContent;
        
        signupBtn.textContent = 'Signing up...';
        signupBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            signupBtn.textContent = '✓ Subscribed!';
            signupBtn.style.background = '#3300ff'; // Neo-blue success color
            
            this.showNotification('Successfully subscribed! You\'ll be notified when the store launches.', 'success');
            
            // Clear email input
            document.querySelector('.email-input').value = '';

            // Reset button after 3 seconds
            setTimeout(() => {
                signupBtn.textContent = originalText;
                signupBtn.disabled = false;
                signupBtn.style.background = ''; // Reset to original color
            }, 3000);

        }, 1500);

        console.log(`Newsletter signup for: ${email}`);
    }

    handleProductAction(e) {
        const productCard = e.target.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        if (e.target.disabled) {
            this.showNotification(`${productTitle} is coming soon! Sign up for our newsletter to be notified.`, 'info');
        } else if (e.target.classList.contains('test-product')) {
            // Demo functionality for test product
            this.handleTestProduct(e.target, productCard);
        } else {
            // This will be implemented when Shopify is set up
            this.addToCart(productCard);
        }
    }

    handleTestProduct(button, productCard) {
        const productTitle = productCard.querySelector('.product-title').textContent;
        const originalText = button.textContent;
        
        // Simulate adding to cart
        button.textContent = 'Adding...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = '✓ Added to Cart!';
            button.style.background = '#3300ff'; // Neo-blue
            
            this.showNotification(`${productTitle} added to cart! (This is a demo - no actual purchase will be made)`, 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = ''; // Reset color
            }, 3000);
            
        }, 1000);
    }

    addToCart(productCard) {
        // Future Shopify Buy Button integration will go here
        const productTitle = productCard.querySelector('.product-title').textContent;
        console.log(`Adding to cart: ${productTitle}`);
        
        this.showNotification(`${productTitle} added to cart!`, 'success');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Create notification element - now using safe DOM creation
        const notification = createNotification(message, type);
        notification.className = `store-notification ${type}`;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#3300ff' : type === 'error' ? '#ff0000' : '#ff00f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.9rem',
            maxWidth: '400px'
        });

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    hideNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
    
    // Enhanced brutalist store effects
    initBrutalistEffects() {
        // Add industrial loading indicators
        this.createScanlines();
        this.initGlitchEffects();
        this.addSystemIndicators();
        this.initDataStreams();
    }
    
    initTerminalEffects() {
        // Create terminal typing effect for status updates
        this.initTerminalTyping();
        this.addRandomSystemMessages();
        this.createDataFlowAnimation();
    }
    
    createScanlines() {
        // Add subtle scanlines for CRT monitor effect - now using safe DOM creation
        const scanlines = createScanlines(5);
        
        const styles = document.createElement('style');
        styles.textContent = `
            .scanlines {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                opacity: 0.1;
            }
            
            .scanline {
                position: absolute;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #3300ff, transparent);
                animation: scanline-move 8s linear infinite;
            }
            
            .scanline:nth-child(1) { animation-delay: 0s; }
            .scanline:nth-child(2) { animation-delay: 1.6s; }
            .scanline:nth-child(3) { animation-delay: 3.2s; }
            .scanline:nth-child(4) { animation-delay: 4.8s; }
            .scanline:nth-child(5) { animation-delay: 6.4s; }
            
            @keyframes scanline-move {
                0% { top: -10px; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100vh; opacity: 0; }
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(scanlines);
        this.scanlineElement = scanlines;
    }
    
    initGlitchEffects() {
        // Random glitch effects on interactive elements
        const glitchTargets = document.querySelectorAll('.control-btn, .brutalist-heading, .neo-accent');
        
        this.glitchInterval = setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                const target = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
                this.applyGlitchEffect(target);
            }
        }, 2000);
    }
    
    applyGlitchEffect(element) {
        if (!element) return;
        
        const originalText = element.textContent;
        const glitchChars = ['█', '▓', '▒', '░', '╬', '╫', '╪', '┼'];
        
        // Create glitch text
        let glitchText = '';
        for (let char of originalText) {
            if (char !== ' ' && Math.random() < 0.3) {
                glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchText += char;
            }
        }
        
        // Apply glitch
        element.style.color = '#ff00f6'; // Magenta glitch
        element.textContent = glitchText;
        
        // Restore after brief moment
        setTimeout(() => {
            element.style.color = '';
            element.textContent = originalText;
        }, 100 + Math.random() * 200);
    }
    
    addSystemIndicators() {
        // Add random system indicators in corners
        const indicators = [
            'SYS_LOAD: 67%',
            'MEM_USAGE: 42%', 
            'NET_STATUS: STABLE',
            'PROC_COUNT: 12',
            'TEMP: 23°C',
            'UPTIME: 4:23:17'
        ];
        
        const indicator = document.createElement('div');
        indicator.className = 'system-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            color: #3300ff;
            opacity: 0.6;
            z-index: 10;
            background: rgba(0,0,0,0.8);
            padding: 5px 8px;
            border: 1px solid #3300ff;
        `;
        
        document.body.appendChild(indicator);
        
        // Cycle through indicators
        let currentIndex = 0;
        setInterval(() => {
            indicator.textContent = indicators[currentIndex];
            currentIndex = (currentIndex + 1) % indicators.length;
        }, 3000);
    }
    
    initDataStreams() {
        // Add data stream animation to empty areas
        const dataStream = document.createElement('div');
        dataStream.className = 'data-stream';
        dataStream.style.cssText = `
            position: fixed;
            top: 0;
            right: 20px;
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg, transparent, #3300ff, transparent);
            opacity: 0.3;
            animation: data-flow 6s linear infinite;
            pointer-events: none;
            z-index: 1;
        `;
        
        const streamStyles = document.createElement('style');
        streamStyles.textContent = `
            @keyframes data-flow {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100vh); }
            }
        `;
        
        document.head.appendChild(streamStyles);
        document.body.appendChild(dataStream);
    }
    
    initTerminalTyping() {
        // Create typing effect for terminal messages
        const terminalOutput = document.createElement('div');
        terminalOutput.className = 'terminal-output';
        terminalOutput.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #3300ff;
            opacity: 0.7;
            z-index: 10;
            background: rgba(0,0,0,0.9);
            padding: 10px;
            border: 1px solid #3300ff;
            max-width: 300px;
            min-height: 60px;
        `;
        
        document.body.appendChild(terminalOutput);
        this.terminalOutput = terminalOutput;
        
        // Start with initial message
        this.typeMessage('STORE_SYSTEM_INITIALIZED...\nLOADING_INVENTORY...');
    }
    
    typeMessage(message, callback) {
        if (!this.terminalOutput) return;
        
        this.terminalOutput.textContent = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < message.length) {
                if (message[index] === '\\' && message[index + 1] === 'n') {
                    this.terminalOutput.innerHTML += '<br>';
                    index += 2;
                } else {
                    this.terminalOutput.textContent += message[index];
                    index++;
                }
            } else {
                clearInterval(typeInterval);
                if (callback) callback();
            }
        }, 50 + Math.random() * 50); // Variable typing speed
    }
    
    addRandomSystemMessages() {
        const messages = [
            'SCANNING_PRODUCT_DATABASE...',
            'UPDATING_INVENTORY_CACHE...',
            'OPTIMIZING_PAYMENT_GATEWAY...',
            'SYNCHRONIZING_SHOPIFY_API...',
            'PROCESSING_CUSTOMER_QUEUE...',
            'VALIDATING_PRODUCT_METADATA...'
        ];
        
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance
                const message = messages[Math.floor(Math.random() * messages.length)];
                this.typeMessage(message);
            }
        }, 8000);
    }
    
    createDataFlowAnimation() {
        // Create moving data blocks in the background
        setInterval(() => {
            if (Math.random() < 0.2) { // 20% chance
                this.createDataBlock();
            }
        }, 1500);
    }
    
    createDataBlock() {
        const dataBlock = document.createElement('div');
        dataBlock.textContent = Math.random().toString(16).substr(2, 8).toUpperCase();
        dataBlock.style.cssText = `
            position: fixed;
            right: -100px;
            top: ${Math.random() * window.innerHeight}px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #3300ff;
            opacity: 0.3;
            pointer-events: none;
            z-index: 1;
            transition: all 8s linear;
        `;
        
        document.body.appendChild(dataBlock);
        
        // Animate across screen
        setTimeout(() => {
            dataBlock.style.right = '100vw';
            dataBlock.style.opacity = '0';
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            if (dataBlock.parentNode) {
                dataBlock.parentNode.removeChild(dataBlock);
            }
        }, 8500);
    }
    
    updateTerminalStatus() {
        const statusElements = document.querySelectorAll('.status-line');
        const statuses = [
            'STATUS: OPERATIONAL',
            'INVENTORY: UPDATING',
            'PAYMENT_SYSTEM: INITIALIZING'
        ];
        
        statusElements.forEach((element, index) => {
            if (statuses[index]) {
                element.textContent = statuses[index];
            }
        });
    }
    
    updateFilterStatus(category) {
        const statusElement = document.querySelector('.filter-status .status-text');
        if (statusElement) {
            const categoryName = category.toUpperCase();
            statusElement.textContent = `FILTER_STATUS: ${categoryName === 'ALL' ? 'ALL_CATEGORIES_ACTIVE' : categoryName + '_SELECTED'}`;
        }
    }
    
    triggerTerminalGlitch() {
        // Brief glitch effect when filtering
        const terminalElements = document.querySelectorAll('.brutalist-mono, .neo-accent');
        
        terminalElements.forEach(element => {
            if (Math.random() < 0.1) { // 10% chance per element
                this.applyGlitchEffect(element);
            }
        });
    }

    // Future methods for Shopify integration
    async initShopify() {
        // This will load the Shopify Buy SDK when ready
        /*
        const script = document.createElement('script');
        script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
        script.onload = () => {
            this.setupShopifyClient();
        };
        document.head.appendChild(script);
        */
    }

    setupShopifyClient() {
        // Shopify Buy SDK setup will go here
        /*
        this.shopify = ShopifyBuy.buildClient({
            domain: this.shopifyDomain,
            storefrontAccessToken: this.apiAccessToken
        });
        */
    }
}

// Initialize store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const storeManager = new StoreManager();
    
    // Make it globally available for debugging
    window.storeManager = storeManager;
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (storeManager.glitchInterval) {
            clearInterval(storeManager.glitchInterval);
        }
        if (storeManager.scanlineElement) {
            storeManager.scanlineElement.remove();
        }
    });
});
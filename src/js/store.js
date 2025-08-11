// Store functionality - Nova Design System
import '../styles/store.scss';
import { createNotification } from './modules/dom-utils.js';

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
            this.loadingScreen.classList.add('loaded');
            setTimeout(() => {
                if (this.loadingScreen) {
                    this.loadingScreen.remove();
                }
            }, 800);
        }
    }
}

class StoreManager {
    constructor() {
        this.loadingManager = new LoadingManager();
        this.initStore();
        this.initEventListeners();
        this.initNavigation();
    }

    initStore() {
        // This will be used for future Shopify integration
        this.shopifyDomain = 'pjm-studio.myshopify.com'; // To be configured
        this.apiAccessToken = ''; // To be configured with actual token
        
        // Category filtering
        this.currentCategory = 'all';
        this.products = this.getAllProducts();
        
        console.log('🛍️ Store initialized with', this.products.length, 'products');
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

        // Product buttons
        const productButtons = document.querySelectorAll('.product-btn');
        productButtons.forEach(btn => {
            btn.addEventListener('click', this.handleProductAction.bind(this));
        });
    }

    initNavigation() {
        const navTrigger = document.getElementById('navTrigger');
        const navContent = document.getElementById('navContent');
        const navClose = document.getElementById('navClose');
        
        if (!navTrigger || !navContent) return;
        
        let isNavigationOpen = false;
        
        const openNav = () => {
            isNavigationOpen = true;
            navTrigger.classList.add('active');
            navContent.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        const closeNav = () => {
            isNavigationOpen = false;
            navTrigger.classList.remove('active');
            navContent.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        navTrigger.addEventListener('click', () => {
            if (isNavigationOpen) {
                closeNav();
            } else {
                openNav();
            }
        });
        
        if (navClose) {
            navClose.addEventListener('click', closeNav);
        }
        
        // Close nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isNavigationOpen) {
                closeNav();
            }
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

        // Filter products with clean animation
        this.currentCategory = category;
        this.products.forEach(product => {
            const productCategory = product.dataset.category;
            if (category === 'all' || productCategory === category) {
                product.style.display = 'block';
                // Clean entrance animation
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 50);
            } else {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 200);
            }
        });

        console.log(`✨ Filtered to category: ${category}`);
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
        
        signupBtn.textContent = 'subscribing...';
        signupBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            signupBtn.textContent = '✓ subscribed!';
            signupBtn.style.background = '#ff00f6'; // Nova pink success color
            
            this.showNotification('Successfully subscribed! You\'ll be notified when new products launch.', 'success');
            
            // Clear email input
            document.querySelector('.email-input').value = '';

            // Reset button after 3 seconds
            setTimeout(() => {
                signupBtn.textContent = originalText;
                signupBtn.disabled = false;
                signupBtn.style.background = ''; // Reset to original color
            }, 3000);

        }, 1500);

        console.log(`📧 Newsletter signup for: ${email}`);
    }

    handleProductAction(e) {
        const productCard = e.target.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        if (e.target.disabled) {
            this.showNotification(`${productTitle} is coming soon! Sign up for our newsletter to be notified.`, 'info');
        } else if (e.target.classList.contains('available')) {
            // Demo functionality for available product
            this.handleAvailableProduct(e.target, productCard);
        } else {
            // This will be implemented when Shopify is set up
            this.addToCart(productCard);
        }
    }

    handleAvailableProduct(button, productCard) {
        const productTitle = productCard.querySelector('.product-title').textContent;
        const originalText = button.textContent;
        
        // Simulate adding to cart
        button.textContent = 'adding...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = '✓ added to cart!';
            button.style.background = '#ff00f6'; // Nova pink
            
            this.showNotification(`${productTitle} added to cart! (Demo mode - no actual purchase)`, 'success');
            
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
        console.log(`🛒 Adding to cart: ${productTitle}`);
        
        this.showNotification(`${productTitle} added to cart!`, 'success');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Create clean Nova-style notification
        const notification = createNotification(message, type);
        notification.className = `store-notification ${type}`;

        // Nova styling
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            right: '24px',
            background: type === 'success' ? '#ff00f6' : type === 'error' ? '#ef4444' : '#6b7280',
            color: 'white',
            padding: '12px 20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            fontWeight: '300',
            maxWidth: '320px',
            borderRadius: '2px'
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
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideNotification(notification);
            });
        }

        // Auto hide after 4 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 4000);
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
    
    console.log('🎯 PJM Studio Store initialized with Nova design system');
});
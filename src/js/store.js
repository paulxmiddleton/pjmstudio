// Store functionality - Shopify integration ready
import '../styles/store.scss';

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
    }

    initStore() {
        // This will be used for future Shopify integration
        this.shopifyDomain = 'pjm-studio.myshopify.com'; // To be configured
        this.apiAccessToken = ''; // To be configured with actual token
        
        // Category filtering
        this.currentCategory = 'all';
        this.products = this.getAllProducts();
        
        console.log('Store initialized with', this.products.length, 'products');
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
            signupBtn.style.background = '#10B981'; // Green success color
            
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
            button.style.background = '#10B981'; // Green
            
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
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `store-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
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
});
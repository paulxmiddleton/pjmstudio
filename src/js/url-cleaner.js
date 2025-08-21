/**
 * Universal URL Cleaner - Remove .html extensions from all URLs
 * Handles both current page URLs and navigation links
 */

class URLCleaner {
    constructor() {
        this.init();
    }

    init() {
        // Clean current URL immediately
        this.cleanCurrentURL();
        
        // Clean all navigation links on page load
        this.cleanNavigationLinks();
        
        // Set up URL handling for future navigation
        this.setupURLHandling();
        
        console.log('🔗 URL Cleaner initialized - All .html extensions removed');
    }

    cleanCurrentURL() {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        
        // Remove .html from current URL
        if (currentPath.endsWith('.html')) {
            const cleanPath = currentPath.replace(/\.html$/, '');
            const newUrl = cleanPath + currentSearch + currentHash;
            window.history.replaceState({}, '', newUrl);
            console.log(`🔗 Cleaned URL: ${currentPath} → ${cleanPath}`);
        }
        
        // Handle index.html specifically
        if (currentPath.includes('index.html')) {
            const cleanPath = currentPath.replace('/index.html', '/').replace('index.html', '/');
            const newUrl = cleanPath + currentSearch + currentHash;
            window.history.replaceState({}, '', newUrl);
            console.log(`🔗 Cleaned index URL: ${currentPath} → ${cleanPath}`);
        }
    }

    cleanNavigationLinks() {
        // Get all links on the page
        const links = document.querySelectorAll('a[href*=".html"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            let cleanHref = href;
            
            // Remove .html extension
            if (href.endsWith('.html')) {
                cleanHref = href.replace(/\.html$/, '');
            }
            
            // Handle index.html specifically
            if (href.includes('index.html')) {
                cleanHref = href.replace('/index.html', '/').replace('index.html', '/');
            }
            
            // Update the link if it changed
            if (cleanHref !== href) {
                link.setAttribute('href', cleanHref);
                console.log(`🔗 Link cleaned: ${href} → ${cleanHref}`);
            }
        });
    }

    setupURLHandling() {
        // Handle navigation events
        window.addEventListener('popstate', () => {
            this.cleanCurrentURL();
        });

        // Intercept link clicks to handle .html URLs gracefully
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href) return;
            
            const url = new URL(link.href, window.location.origin);
            
            // If it's an internal link with .html, clean it
            if (url.origin === window.location.origin && url.pathname.endsWith('.html')) {
                e.preventDefault();
                
                let cleanPath = url.pathname.replace(/\.html$/, '');
                if (cleanPath === '' || cleanPath === '/index') {
                    cleanPath = '/';
                }
                
                const cleanUrl = cleanPath + url.search + url.hash;
                window.history.pushState({}, '', cleanUrl);
                
                // Trigger a page load if needed
                if (cleanPath !== window.location.pathname) {
                    window.location.href = cleanUrl;
                }
                
                console.log(`🔗 Navigation cleaned: ${url.pathname} → ${cleanPath}`);
            }
        });
    }

    // Static method to clean any URL string
    static cleanURL(url) {
        if (!url) return url;
        
        // Remove .html extension
        let cleanUrl = url.replace(/\.html$/, '');
        
        // Handle index.html
        cleanUrl = cleanUrl.replace('/index.html', '/').replace('index.html', '/');
        
        return cleanUrl;
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new URLCleaner();
        });
    } else {
        new URLCleaner();
    }
}

export default URLCleaner;
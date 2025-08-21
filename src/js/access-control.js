/**
 * PJM Studio Access Control System
 * Password-protected lockout for work-in-progress pages
 */

class AccessControl {
    constructor() {
        // Password for accessing protected pages (change this to whatever you want)
        this.accessPassword = 'pjm2025dev';
        
        // Session storage key for access state
        this.accessKey = 'pjm_studio_access';
        
        // Pages that are publicly accessible (no password required)
        this.publicPages = [
            '/',
            '/index.html',
            '/ascii-video',
            '/ascii-video.html'
        ];
        
        this.init();
    }

    init() {
        // Check if current page needs protection
        if (this.needsProtection()) {
            // Check if user already has access
            if (!this.hasAccess()) {
                this.showLockoutScreen();
            } else {
                console.log('🔓 Access granted - Welcome back');
            }
        }
    }

    needsProtection() {
        const currentPath = window.location.pathname;
        
        // Check if current page is in public pages list
        return !this.publicPages.some(page => {
            if (page === '/') {
                return currentPath === '/' || currentPath === '/index.html';
            }
            return currentPath === page || currentPath.startsWith(page);
        });
    }

    hasAccess() {
        // Check if user has valid access token in session storage
        const accessData = sessionStorage.getItem(this.accessKey);
        if (!accessData) return false;
        
        try {
            const data = JSON.parse(accessData);
            // Check if access is still valid (expires after 24 hours)
            const now = new Date().getTime();
            return data.expires > now;
        } catch (e) {
            return false;
        }
    }

    grantAccess() {
        // Grant access for 24 hours
        const expires = new Date().getTime() + (24 * 60 * 60 * 1000);
        const accessData = {
            granted: true,
            expires: expires,
            timestamp: new Date().getTime()
        };
        
        sessionStorage.setItem(this.accessKey, JSON.stringify(accessData));
    }

    showLockoutScreen() {
        // Hide the main content
        document.body.style.overflow = 'hidden';
        
        // Create lockout overlay
        const overlay = this.createLockoutOverlay();
        document.body.appendChild(overlay);
        
        // Focus on password input after a brief delay
        setTimeout(() => {
            const passwordInput = overlay.querySelector('#accessPassword');
            if (passwordInput) {
                passwordInput.focus();
            }
        }, 300);
    }

    createLockoutOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'access-lockout-overlay';
        overlay.innerHTML = `
            <div class="lockout-container">
                <div class="lockout-header">
                    <h1 class="lockout-title">PJM.STUDIO</h1>
                    <div class="lockout-brand">VISUAL EXISTENTIALIST</div>
                </div>
                
                <div class="lockout-content">
                    <div class="lockout-message">
                        <h2>DEVELOPMENT ACCESS</h2>
                        <p>This section is currently under development.<br>
                        Enter password to access work-in-progress content.</p>
                    </div>
                    
                    <div class="lockout-form">
                        <input 
                            type="password" 
                            id="accessPassword" 
                            placeholder="development password"
                            class="password-input"
                            autocomplete="off"
                        >
                        <button id="accessSubmit" class="access-button">ACCESS</button>
                        <div id="accessError" class="access-error"></div>
                    </div>
                </div>
                
                <div class="lockout-footer">
                    <div class="public-links">
                        <a href="/" class="public-link">← return to landing</a>
                        <a href="/ascii-video" class="public-link">ascii lab →</a>
                    </div>
                    <div class="lockout-info">
                        Development build • Session-based access
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.addLockoutStyles();
        
        // Add event listeners
        this.setupLockoutEvents(overlay);
        
        return overlay;
    }

    setupLockoutEvents(overlay) {
        const passwordInput = overlay.querySelector('#accessPassword');
        const submitButton = overlay.querySelector('#accessSubmit');
        const errorDiv = overlay.querySelector('#accessError');

        const attemptAccess = () => {
            const enteredPassword = passwordInput.value.trim();
            
            if (enteredPassword === this.accessPassword) {
                // Grant access
                this.grantAccess();
                
                // Show success message
                errorDiv.innerHTML = '<span style="color: #00ff00;">✓ Access granted</span>';
                
                // Remove overlay and reload page
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                    window.location.reload();
                }, 800);
                
            } else {
                // Show error
                errorDiv.innerHTML = '<span style="color: #ff0000;">× Incorrect password</span>';
                passwordInput.value = '';
                passwordInput.focus();
                
                // Clear error after 3 seconds
                setTimeout(() => {
                    errorDiv.innerHTML = '';
                }, 3000);
            }
        };

        // Submit on button click
        submitButton.addEventListener('click', attemptAccess);
        
        // Submit on Enter key
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                attemptAccess();
            }
        });
    }

    addLockoutStyles() {
        if (document.getElementById('access-lockout-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'access-lockout-styles';
        styles.textContent = `
            .access-lockout-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #3300ff;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Bebas Neue', 'Space Grotesk', Arial, sans-serif;
            }

            .lockout-container {
                max-width: 500px;
                width: 90%;
                text-align: center;
                color: white;
                padding: 2rem;
            }

            .lockout-header {
                margin-bottom: 3rem;
            }

            .lockout-title {
                font-size: 4rem;
                font-weight: 300;
                letter-spacing: 8px;
                margin: 0;
                line-height: 1;
            }

            .lockout-brand {
                font-size: 0.875rem;
                letter-spacing: 3px;
                margin-top: 0.5rem;
                opacity: 0.8;
            }

            .lockout-content {
                margin-bottom: 3rem;
            }

            .lockout-message h2 {
                font-size: 1.5rem;
                letter-spacing: 2px;
                margin: 0 0 1rem 0;
                font-weight: 400;
            }

            .lockout-message p {
                font-family: 'Inter', Arial, sans-serif;
                font-size: 0.9rem;
                line-height: 1.4;
                opacity: 0.9;
                margin: 0 0 2rem 0;
            }

            .lockout-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;
            }

            .password-input {
                width: 100%;
                max-width: 300px;
                padding: 0.75rem 1rem;
                font-size: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                text-align: center;
                letter-spacing: 1px;
                font-family: 'SF Mono', 'Monaco', monospace;
            }

            .password-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
                font-family: 'Inter', Arial, sans-serif;
                letter-spacing: 0;
            }

            .password-input:focus {
                outline: none;
                border-color: rgba(255, 255, 255, 0.8);
                background: rgba(255, 255, 255, 0.15);
            }

            .access-button {
                padding: 0.75rem 2rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                font-size: 0.875rem;
                letter-spacing: 2px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: 'Bebas Neue', Arial, sans-serif;
            }

            .access-button:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.6);
            }

            .access-error {
                min-height: 1.5rem;
                font-family: 'SF Mono', monospace;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .lockout-footer {
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                padding-top: 2rem;
                margin-top: 2rem;
            }

            .public-links {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
                gap: 1rem;
            }

            .public-link {
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                font-size: 0.875rem;
                letter-spacing: 1px;
                transition: opacity 0.2s ease;
                font-family: 'Inter', Arial, sans-serif;
            }

            .public-link:hover {
                opacity: 1;
                color: white;
            }

            .lockout-info {
                font-size: 0.75rem;
                opacity: 0.6;
                letter-spacing: 1px;
                font-family: 'Inter', Arial, sans-serif;
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .lockout-container {
                    padding: 1.5rem;
                }

                .lockout-title {
                    font-size: 3rem;
                    letter-spacing: 4px;
                }

                .public-links {
                    flex-direction: column;
                    text-align: center;
                    gap: 0.5rem;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Static method to check if development mode is active
    static isDevelopmentMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.port === '3000' ||
               window.location.port === '3001';
    }
}

// Auto-initialize access control
if (typeof window !== 'undefined') {
    // Only run access control in production (not on localhost)
    if (!AccessControl.isDevelopmentMode()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new AccessControl();
            });
        } else {
            new AccessControl();
        }
    } else {
        console.log('🔧 Development mode - Access control disabled');
    }
}

export default AccessControl;
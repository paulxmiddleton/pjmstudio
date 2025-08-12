// DOM Utilities - Safe DOM manipulation utilities
// Replaces innerHTML usage with secure alternatives

/**
 * Safely create element with text content
 * @param {string} tagName - HTML tag name
 * @param {string} textContent - Safe text content
 * @param {string} className - CSS class name
 * @returns {HTMLElement}
 */
export function createElementWithText(tagName, textContent, className = '') {
    const element = document.createElement(tagName);
    element.textContent = textContent;
    if (className) {
        element.className = className;
    }
    return element;
}

/**
 * Safely create element with multiple children
 * @param {string} tagName - HTML tag name
 * @param {Array} children - Array of child elements or text
 * @param {string} className - CSS class name
 * @returns {HTMLElement}
 */
export function createElementWithChildren(tagName, children, className = '') {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            element.appendChild(child);
        }
    });
    
    return element;
}

/**
 * Create system indicator element safely
 * @param {string} variation - indicator variation (industrial, minimal, default)
 * @returns {HTMLElement}
 */
export function createSystemIndicator(variation = 'default') {
    const systemIndicator = document.createElement('div');
    systemIndicator.className = 'system-indicator';
    
    let childElement;
    switch (variation) {
        case 'industrial':
            childElement = createElementWithText('span', 'SYS_IND', 'indicator-text');
            break;
        case 'minimal':
            childElement = createElementWithText('span', '', 'indicator-line');
            break;
        default:
            childElement = createElementWithText('span', '', 'indicator-dot');
            break;
    }
    
    systemIndicator.appendChild(childElement);
    return systemIndicator;
}

/**
 * Create access denied modal safely
 * @param {Object} section - Section data with status and message
 * @returns {HTMLElement}
 */
export function createAccessDeniedModal(section) {
    const modal = createElementWithChildren('div', [], 'access-denied-modal');
    
    const modalContent = createElementWithChildren('div', [], 'modal-content');
    
    // Create header
    const modalHeader = createElementWithChildren('div', [], 'modal-header');
    const modalTitle = createElementWithText('span', 'ACCESS_DENIED', 'modal-title');
    const modalStatus = createElementWithText('span', section.status, 'modal-status');
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalStatus);
    
    // Create body
    const modalBody = createElementWithChildren('div', [], 'modal-body');
    const modalMessage = createElementWithText('p', section.message, 'modal-message');
    const modalInfo = createElementWithText('p', 'This section is temporarily locked during development.', 'modal-info');
    modalBody.appendChild(modalMessage);
    modalBody.appendChild(modalInfo);
    
    // Create footer
    const modalFooter = createElementWithChildren('div', [], 'modal-footer');
    const closeButton = createElementWithText('button', 'ACKNOWLEDGE', 'modal-close');
    closeButton.setAttribute('type', 'button');
    modalFooter.appendChild(closeButton);
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);
    
    return modal;
}

/**
 * Create notification element safely
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 * @returns {HTMLElement}
 */
export function createNotification(message, type = 'success') {
    const notification = createElementWithChildren('div', [], `notification ${type}`);
    
    const icon = createElementWithText('div', '✓', 'notification-icon');
    const text = createElementWithText('div', message, 'notification-text');
    const close = createElementWithText('button', '×', 'notification-close');
    close.setAttribute('type', 'button');
    close.setAttribute('aria-label', 'Close notification');
    
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(close);
    
    return notification;
}

/**
 * Create scanlines element safely
 * @param {number} count - Number of scanlines
 * @returns {HTMLElement}
 */
export function createScanlines(count = 5) {
    const scanlines = createElementWithChildren('div', [], 'scanlines');
    
    for (let i = 0; i < count; i++) {
        const scanline = createElementWithText('div', '', 'scanline');
        scanlines.appendChild(scanline);
    }
    
    return scanlines;
}

/**
 * Create WebGL context lost fallback element safely
 * @returns {HTMLElement}
 */
export function createWebGLContextLostFallback() {
    const fallbackElement = createElementWithChildren('div', [], '');
    fallbackElement.id = 'webgl-context-lost';
    fallbackElement.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #666;
        font-family: monospace;
        text-align: center;
        z-index: 1000;
    `;
    
    const title = createElementWithText('div', 'WebGL Context Lost', '');
    const subtitle = createElementWithText('div', 'Attempting recovery...', '');
    subtitle.style.cssText = 'font-size: 12px; margin-top: 10px;';
    
    fallbackElement.appendChild(title);
    fallbackElement.appendChild(subtitle);
    
    return fallbackElement;
}

console.log('📋 DOM utilities module loaded with secure element creation');
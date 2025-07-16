// main.js
import '../styles/main.scss';
import gsap from 'gsap';

// Custom Sword Cursor
const cursor = document.getElementById('customCursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Faster cursor following (reduced smoothing)
function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.25; // Increased from 0.15 for faster response
    cursorY += dy * 0.25;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Sword swipe animation on click
document.addEventListener('click', () => {
    cursor.classList.add('swiping');
    setTimeout(() => {
        cursor.classList.remove('swiping');
    }, 300);
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

// Mobile cursor fix - hide until first touch
if (window.innerWidth <= 768) {
    document.addEventListener('touchstart', () => {
        document.body.classList.add('touched');
    }, { once: true });
}

// Clean URL parameters
if (window.location.search.includes('fbclid')) {
    window.history.replaceState({}, document.title, window.location.pathname);
}

// Hide loading screen when page loads
window.addEventListener('load', () => {
    // Show body content
    document.body.style.transition = 'opacity 0.5s ease-in';
    document.body.style.opacity = '1';
    
    // Show cursor
    const cursor = document.getElementById('customCursor');
    if (cursor) {
        cursor.style.opacity = '1';
    }
    
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 300);
});

// Castle Portal Password Protection
const castlePortal = document.getElementById('castlePortal');
if (castlePortal) {
    castlePortal.addEventListener('click', (e) => {
        e.preventDefault();
        const password = prompt('Speak the password to enter the castle:');
        
        // You can change this password to whatever you want
        if (password && password.toLowerCase() === 'excalibur') {
            alert('Welcome to the inner realm! (This would redirect to your main site)');
            // window.location.href = '/main'; // Uncomment when you have the main site ready
        } else if (password) {
            alert('The castle remains sealed. Try again, brave one.');
        }
    });
}

// Knight Head & Sword Following Mouse
const knightHead = document.getElementById('knightHead');
const knightSword = document.getElementById('knightSword');

document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate angle from knight to mouse
    const angleX = (e.clientX - centerX) / window.innerWidth;
    const angleY = (e.clientY - centerY) / window.innerHeight;
    
    // Very subtle rotation for head (max 6 degrees)
    const headRotation = angleX * 6;
    
    // Pure rotation for sword (max 20 degrees from hand)
    const swordRotation = angleX * 20;
    
    gsap.to(knightHead, {
        rotation: headRotation,
        duration: 0.3,
        ease: 'power2.out'
    });
    
    gsap.to(knightSword, {
        rotation: swordRotation,
        duration: 0.3,
        ease: 'power2.out'
    });
});

// Dragon Floating Animation - Simplified to avoid conflicts
const dragon = document.getElementById('dragon');
if (dragon) {
    // Remove any GSAP animations that might conflict
    // Just use CSS hover effect instead
}

// Simplified liquid text effect for now
const comingSoonText = document.getElementById('comingSoon');

// Basic water ripple on hover
if (comingSoonText) {
    comingSoonText.addEventListener('mouseenter', () => {
        gsap.to(comingSoonText, {
            scaleY: 0.9,
            duration: 0.2,
            ease: 'power2.out'
        });
    });

    comingSoonText.addEventListener('mouseleave', () => {
        gsap.to(comingSoonText, {
            scaleY: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)'
        });
    });
}

// Debug video
const birdsVideo = document.querySelector('.birds-video');
if (birdsVideo) {
    console.log('Birds video found:', birdsVideo);
    console.log('Video sources:', birdsVideo.querySelectorAll('source'));
    
    // Try MP4 format for better compatibility
    birdsVideo.addEventListener('loadeddata', () => {
        console.log('Birds video loaded successfully!');
    });
    
    birdsVideo.addEventListener('error', (e) => {
        console.error('Video error:', e);
        console.error('Video error detail:', birdsVideo.error);
    });
}

// PARALLAX EFFECTS - WORKING VERSION
document.addEventListener('DOMContentLoaded', () => {
    // Get elements after DOM is loaded
    const heraldMsg = document.querySelector('.herald-message');
    const socialBtns = document.querySelector('.social-scrolls');
    const mainBg = document.querySelector('.main-illustration');
    
    console.log('Parallax elements found:', {
        herald: heraldMsg,
        social: socialBtns,
        background: mainBg
    });
    
    // Only add mousemove listener on desktop
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 200;
            const y = (e.clientY - window.innerHeight / 2) / 200;
            
            // Background moves normally (slightly increased)
            if (mainBg) {
                mainBg.style.transform = `scale(1.05) translate(${x * 0.4}px, ${y * 0.4}px)`;
            }
            
            // Text moves opposite (slightly decreased)
            if (heraldMsg) {
                const currentLeft = 40;
                const currentTop = 40;
                heraldMsg.style.left = `${currentLeft + (x * -0.08)}%`;
                heraldMsg.style.top = `${currentTop + (y * -0.08)}%`;
            }
            
            // Social buttons move opposite (slightly decreased)
            if (socialBtns) {
                const currentLeft = 40;
                const currentTop = 20;
                socialBtns.style.left = `${currentLeft + (x * -0.05)}%`;
                socialBtns.style.top = `${currentTop + (y * -0.05)}%`;
            }
        });
    }
});

// Medieval Sparkles Effect with Multiple Styles
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating sparkles...');
    
    const sparklesContainer = document.getElementById('sparklesContainer');
    
    if (sparklesContainer) {
        console.log('Sparkles container found!');
        
        // Simple thin crosses like in medieval manuscript
        const createCross = () => {
            const cross = document.createElement('div');
            cross.style.position = 'absolute';
            cross.style.left = Math.random() * 100 + '%';
            cross.style.top = Math.random() * 60 + '%';
            
            // Create simple + cross
            cross.innerHTML = '+';
            
            // Thin, delicate styling
            cross.style.color = '#8B2500';
            cross.style.fontSize = (Math.random() * 6 + 10) + 'px'; // Smaller: 10-16px
            cross.style.fontWeight = '300'; // Thin weight
            cross.style.fontFamily = 'serif'; // Simple font
            cross.style.opacity = '0';
            cross.style.transform = 'scale(0.5) rotate(' + (Math.random() * 45 - 22.5) + 'deg)'; // Random rotation
            cross.style.transition = 'none';
            cross.style.pointerEvents = 'none';
            
            return cross;
        };
        
        function createSparkle() {
            const sparkle = createCross();
            sparklesContainer.appendChild(sparkle);
            
            // Force reflow
            sparkle.offsetHeight;
            
            // Add transition after element is in DOM
            sparkle.style.transition = 'all 2s ease-in-out';
            
            // Fade in
            requestAnimationFrame(() => {
                sparkle.style.opacity = '0.7';
                sparkle.style.transform = 'scale(1) rotate(180deg)';
            });
            
            // Fade out
            setTimeout(() => {
                sparkle.style.opacity = '0';
                sparkle.style.transform = 'scale(0.3) rotate(360deg)';
            }, 1500);
            
            // Remove after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2500);
        }

        // Create sparkles at intervals
        setInterval(createSparkle, 400);

        // Create initial sparkles
        for (let i = 0; i < 8; i++) {
            setTimeout(createSparkle, i * 150);
        }
    }
});
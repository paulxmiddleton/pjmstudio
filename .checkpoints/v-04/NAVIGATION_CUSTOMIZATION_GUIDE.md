# Custom Navigation - Complete Customization Guide

## 🎯 Overview

This guide covers all customization options for the finalized custom navigation system. The component is designed to be highly flexible while maintaining perfect performance and instant hover responsiveness.

## 🎨 Visual Customization

### Skeleton Image Options

**Default**: Neo-blue theme
```html
<img src="/src/assets/images/nav-v1/nav skeleton neoblue v1.png" alt="Navigation">
```

**Alternative Themes**:
```html
<!-- White/Light theme -->
<img src="/src/assets/images/nav-v1/nav skeleton white v1.png" alt="Navigation">

<!-- Pink theme -->
<img src="/src/assets/images/nav-v1/nav skeleton pink v1.png" alt="Navigation">

<!-- Black theme -->
<img src="/src/assets/images/nav-v1/nav skeleton black v1.png" alt="Navigation">
```

### Color Scheme Customization

**Primary Colors**:
```scss
// Extension line color
.nav-skeleton-extension {
    background: $your-primary-color; // Change to match theme
}

// All navigation text links
.nav-link, .portfolio-link {
    color: $your-primary-color; // Base color
    
    &:hover {
        color: $white; // Hover color (usually white for contrast)
    }
}
```

**Theme Examples**:
```scss
// Pink theme
$theme-color: #ff00f6;

// Green theme  
$theme-color: #00ff00;

// Purple theme
$theme-color: #8000ff;
```

## 📐 Layout & Positioning

### Main Navigation Group
```scss
.custom-navigation {
    // MAIN GROUP CONTROLS - Move entire navigation
    top: 15px;              // VERTICAL POSITION
    left: -15px;            // HORIZONTAL POSITION  
    transform: scale(1.0);  // SIZE SCALE
    transform-origin: left top; // Scale anchor point
}
```

### Extension Line Positioning
```scss
.nav-skeleton-extension {
    // EXTENSION LINE CONTROLS
    top: 28px;              // VERTICAL POSITION
    left: 187px;            // HORIZONTAL POSITION
    width: 100px;           // LINE LENGTH
    height: 2px;            // LINE THICKNESS
    transform: rotate(-35deg); // LINE ANGLE
}
```

### Individual Navigation Links
```scss
// Each link has independent controls
.nav-link-1 { // home
    top: -10px;             // VERTICAL POSITION
    left: 35px;             // HORIZONTAL POSITION
    font-size: 16px;        // TEXT SIZE
}

.nav-link-2 { // portfolio+
    top: 49px;              // VERTICAL POSITION
    left: 117px;            // HORIZONTAL POSITION
    font-size: 16px;        // TEXT SIZE
}

// Continue for nav-link-3, nav-link-4, nav-link-5...
```

### Portfolio Subpage Links
```scss
// Portfolio group positioning
.portfolio-pages {
    top: -60px;             // GROUP VERTICAL POSITION
    left: 35px;             // GROUP HORIZONTAL POSITION
}

// Individual portfolio links
.portfolio-link-1 { // directing
    top: 50px;              // VERTICAL POSITION
    left: 250px;            // HORIZONTAL POSITION
    font-size: 16px;        // TEXT SIZE
}

// Continue for portfolio-link-2 through portfolio-link-5...
```

## ⏱️ Animation Timing Customization

### Extension Line Speed
```scss
.nav-skeleton-extension {
    transition: clip-path 0.4s ease; // DEFAULT: 0.4s
    // Examples:
    // transition: clip-path 0.2s ease; // Faster
    // transition: clip-path 0.8s ease; // Slower
}
```

### Portfolio Link Stagger Timing
```scss
// Adjust individual delays (default pattern: 0.3s → 1.1s)
.portfolio-link-1 {
    transition: color 0.1s ease, transform 0.6s ease 0.5s, opacity 0.3s ease 0.5s;
    // Changed from 0.3s to 0.5s delay
}

.portfolio-link-2 {
    transition: color 0.1s ease, transform 0.6s ease 0.7s, opacity 0.3s ease 0.7s;
    // Changed from 0.5s to 0.7s delay
}

// Continue pattern with 0.2s intervals...
```

### Reverse Animation Speed
```scss
.custom-navigation.portfolio-hiding {
    .nav-skeleton-extension {
        transition-delay: 0.8s; // DEFAULT: 0.6s
        // Wait longer before extension hides
    }
    
    .portfolio-link {
        // Adjust reverse stagger (default: 0s → 0.4s)
        &.portfolio-link-5 { transition-delay: 0s; }     // First to hide
        &.portfolio-link-4 { transition-delay: 0.15s; }  // Slower intervals
        &.portfolio-link-3 { transition-delay: 0.3s; }
        &.portfolio-link-2 { transition-delay: 0.45s; }
        &.portfolio-link-1 { transition-delay: 0.6s; }   // Last to hide
    }
}
```

### JavaScript Hover Timing
```javascript
const navigation = new CustomNavigation({
    hideDelay: 2000,        // DEFAULT: 1500ms (1.5s)
    animationDuration: 1000, // DEFAULT: 800ms cleanup
    enableLogging: false    // Production setting
});
```

## 📝 Content Customization

### Changing Navigation Links
```html
<!-- Modify main navigation -->
<div class="nav-links">
    <a href="/home.html" class="nav-link nav-link-1">home</a>
    <a href="/work.html" class="nav-link nav-link-2">work+</a>    <!-- Changed from portfolio+ -->
    <a href="/shop.html" class="nav-link nav-link-3">shop</a>    <!-- Changed from store -->
    <a href="/info.html" class="nav-link nav-link-4">info</a>    <!-- Changed from about -->
    <a href="/contact.html" class="nav-link nav-link-5">contact</a>
</div>
```

### Changing Portfolio Subpages
```html
<!-- Modify portfolio subpages -->
<div class="portfolio-pages">
    <a href="/work/films.html" class="portfolio-link portfolio-link-1">films</a>        <!-- Changed -->
    <a href="/work/commercial.html" class="portfolio-link portfolio-link-2">commercial</a> <!-- Changed -->
    <a href="/work/music-videos.html" class="portfolio-link portfolio-link-3">music videos</a> <!-- Changed -->
    <a href="/work/documentary.html" class="portfolio-link portfolio-link-4">documentary</a>   <!-- Changed -->
    <a href="/work/experimental.html" class="portfolio-link portfolio-link-5">experimental</a> <!-- Changed -->
</div>
```

### Adding/Removing Portfolio Links
```scss
// To add a 6th portfolio link
.portfolio-link-6 {
    top: 175px;             // Position below link-5
    left: 250px;            // Same horizontal as others
    font-size: 16px;
    color: $neo-blue;
    
    &:hover {
        color: $white;
        transform: translateY(0) translateX(5px);
        transition: color 0.1s ease, transform 0.1s ease;
        transition-delay: 0s !important;
    }
}

// Add to stagger animation
.custom-navigation.portfolio-hover .portfolio-link-6 {
    transition: color 0.1s ease, transform 0.6s ease 1.3s, opacity 0.3s ease 1.3s;
    // 1.3s = 0.2s after previous link (1.1s)
}

// Add to reverse animation  
.custom-navigation.portfolio-hiding .portfolio-link-6 {
    transition-delay: 0s; // First to disappear in bottom-to-top
}
```

## 🔧 Advanced Customization

### Different Page Layouts
```scss
// Smaller scale for mobile or compact layouts
.custom-navigation {
    transform: scale(0.7);
    top: 10px;
    left: 10px;
}

// Centered layout
.custom-navigation {
    left: 50%;
    transform: translateX(-50%) scale(1.0);
    transform-origin: center top;
}

// Right-aligned layout
.custom-navigation {
    right: 20px;
    left: auto;
    transform-origin: right top;
}
```

### Custom Extension Line Styles
```scss
.nav-skeleton-extension {
    // Rounded ends
    border-radius: 3px;
    
    // Shadow effect
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    
    // Gradient background
    background: linear-gradient(45deg, $neo-blue, $neo-pink);
    
    // Different angles
    transform: rotate(-45deg); // Steeper angle
    transform: rotate(-20deg); // Gentler angle
}
```

### Typography Customization
```scss
.nav-link, .portfolio-link {
    font-family: 'Your-Custom-Font', Arial, sans-serif;
    font-weight: 400;          // Lighter weight
    text-transform: lowercase; // Different casing
    letter-spacing: 1px;       // Spacing adjustment
}
```

## 🎯 Theme Presets

### Minimal White Theme
```scss
.custom-navigation {
    // White skeleton image
    .nav-skeleton img {
        filter: brightness(0) invert(1); // Convert to white
    }
    
    // White extension line
    .nav-skeleton-extension {
        background: #ffffff;
    }
    
    // White text with black hover
    .nav-link, .portfolio-link {
        color: #ffffff;
        
        &:hover {
            color: #000000;
        }
    }
}
```

### High Contrast Theme
```scss
.custom-navigation {
    // High contrast colors
    .nav-skeleton-extension {
        background: #ffff00; // Bright yellow
        height: 3px;         // Thicker line
    }
    
    .nav-link, .portfolio-link {
        color: #ffff00;
        font-weight: 900;    // Extra bold
        
        &:hover {
            color: #ff0000;  // Bright red hover
        }
    }
}
```

## ✅ Quality Assurance

### Testing Checklist
- [ ] Extension line wipes smoothly left-to-right
- [ ] Portfolio links appear with staggered timing (0.3s → 1.1s)
- [ ] Hover effects are instant (no lag or partial-fade)
- [ ] Reverse animations work bottom-to-top
- [ ] Extension line hides after 0.6s delay
- [ ] 1.5s hover persistence works correctly
- [ ] All positioning controls work as expected
- [ ] Custom colors/skeleton images display properly
- [ ] Mobile responsiveness maintained
- [ ] No console errors in browser

### Performance Notes
- Uses hardware-accelerated CSS transforms
- Minimal JavaScript overhead
- Optimized for 60fps animations
- Smart pointer-events management
- Efficient event handling system

---

**🎉 The navigation system is now completely finalized and ready for production use across all pages with full customization flexibility!**
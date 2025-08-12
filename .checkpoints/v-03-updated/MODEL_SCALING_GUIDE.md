# Device-Specific Model Scaling Guide

## Overview
The ASCII 3D engine now supports independent scaling for each 3D model on desktop vs mobile devices. You can adjust the size of "lumpy" on desktop without affecting how it looks on mobile or anywhere else.

## Current Model Configurations

### Available Models and Current Scales:

#### Basic Shapes
```javascript
cube: {
    desktop: 1.0,    // Current desktop scale
    mobile: 0.8      // Current mobile scale  
}

sphere: {
    desktop: 2.0,    // Current desktop scale
    mobile: 1.6      // Current mobile scale
}

torus: {
    desktop: 2.0,    // Current desktop scale  
    mobile: 1.6      // Current mobile scale
}
```

#### Custom 3D Models
```javascript
lumpy: {
    desktop: 2.0,    // Current desktop scale - ADJUSTABLE
    mobile: 1.5      // Current mobile scale - ADJUSTABLE
}

sword: {
    desktop: 1.8,    // Current desktop scale - ADJUSTABLE
    mobile: 1.4      // Current mobile scale - ADJUSTABLE
}

'pxm-logo': {
    desktop: 4.5,    // Current desktop scale - ADJUSTABLE
    mobile: 3.2      // Current mobile scale - ADJUSTABLE
}

'stone-tower': {
    desktop: 2.2,    // Current desktop scale - ADJUSTABLE
    mobile: 1.8      // Current mobile scale - ADJUSTABLE
}

'castle-archers': {
    desktop: 3.0,    // Current desktop scale - ADJUSTABLE  
    mobile: 2.2      // Current mobile scale - ADJUSTABLE
}

'girl-with-pearl': {
    desktop: 1.5,    // Current desktop scale - ADJUSTABLE
    mobile: 1.2      // Current mobile scale - ADJUSTABLE
}
```

## How to Adjust Model Sizes

### Step 1: Open the Model Configuration File
File location: `/src/js/modules/model-loader.js`

### Step 2: Find Your Target Model
Look for the model you want to adjust in the `modelConfigs` object (around line 33-167).

### Step 3: Modify the Scale Values
Each model has a `scale` object with `desktop` and `mobile` properties:

```javascript
lumpy: {
    // ... other properties
    scale: {
        desktop: 2.5,    // ← Change this for desktop size
        mobile: 1.8      // ← Change this for mobile size  
    },
    // ... other properties
}
```

### Step 4: Build the Project
After making changes, run:
```bash
npm run build
```

## Scale Value Guidelines

- **1.0** = Normal size (reference scale)
- **0.5** = Half size (50% smaller)
- **2.0** = Double size (100% larger)  
- **0.1-0.9** = Smaller than normal
- **1.1-5.0** = Larger than normal

## Device Detection Logic

The system automatically detects device type using:
- Touch capability: `'ontouchstart' in window`
- Screen width: `<= 768px` (mobile breakpoint)
- Both conditions must be true for mobile scaling

## Example Adjustments

### Make Lumpy Bigger on Desktop Only
```javascript
lumpy: {
    scale: {
        desktop: 2.8,    // Increased from 2.0 to 2.8
        mobile: 1.5      // Unchanged
    }
}
```

### Make Sword Smaller on Mobile Only  
```javascript
sword: {
    scale: {
        desktop: 1.8,    // Unchanged
        mobile: 1.0      // Decreased from 1.4 to 1.0
    }
}
```

### Make PXM Logo Consistent Across Devices
```javascript
'pxm-logo': {
    scale: {
        desktop: 3.5,    // Decreased from 4.5
        mobile: 3.5      // Increased from 3.2 (now same as desktop)
    }
}
```

## Debugging Information

When models load, you'll see console messages like:
```
📱 Using desktop scale: 2.0 for lumpy
🎯 Applied device-specific scale 2.0 to lumpy and stored for morph preservation
```

This confirms which scale was applied based on device detection.

## Notes

- Changes only affect the landing page ASCII 3D display
- Each model can have completely different scales per device
- The ASCII video lab page uses the same model loader but may have different display contexts
- Scale changes are applied at model load time
- Original model files are never modified, only the display scale

## Quick Reference

To adjust a specific model:
1. Open `/src/js/modules/model-loader.js`
2. Find the model name in `modelConfigs`
3. Edit `scale.desktop` or `scale.mobile` values
4. Run `npm run build`
5. Test on both desktop and mobile devices

The system is now ready for your specific scaling adjustments!
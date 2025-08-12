# ASCII 3D Video Lab

Hidden experimental 3D ASCII rendering engine with custom model upload capabilities.

## Overview

The ASCII 3D Video Lab is a terminal-aesthetic interface accessible at `/ascii-video` that provides real-time 3D model rendering through ASCII character mapping. Built with Three.js and WebGL, it features custom file upload support, performance monitoring, and interactive testing controls.

## Features

### 🎯 Core Functionality
- **Real-time 3D ASCII Rendering** - WebGL-powered ASCII character mapping
- **Custom Model Upload** - Support for `.glb`, `.gltf`, and `.obj` files
- **Interactive Testing Suite** - Complete control panel for testing and optimization
- **Performance Monitoring** - Real-time FPS, render time, and memory usage tracking
- **Terminal Aesthetic** - Neo-blue color scheme matching site design system

### 📁 File Upload Capabilities

**Supported Formats:**
- `.glb` - Binary glTF (recommended for optimized loading)
- `.gltf` - JSON glTF with separate resources
- `.obj` - Wavefront OBJ files

**Technical Specifications:**
- **Maximum File Size:** 50MB
- **Format Validation:** Client-side extension and size checking
- **Memory Management:** Automatic URL cleanup and resource disposal
- **Error Handling:** Terminal-style error messages with detailed feedback

**Upload Process:**
1. Click "upload custom shape" link in test controls
2. Select supported 3D model file
3. Automatic validation and loading
4. Real-time ASCII rendering with performance feedback

### 🎨 Visual Design

**Neo-Brutalist Terminal Aesthetic:**
- **Background:** Pure black (`#000000`)
- **Primary Color:** Neo-blue (`#3300ff`) - matching site palette
- **Typography:** Monospace font family for authentic terminal feel
- **UI Elements:** Minimal borders and controls with neo-blue accents
- **Error States:** Terminal-style error displays with consistent theming

### 🎮 Interactive Controls

**Model Testing:**
- **Preset Models:** Cube, Sphere, Torus for quick testing
- **Custom Upload:** File browser integration for personal models
- **Model Cycling:** Keyboard shortcut (`M`) for rapid model switching

**ASCII Configuration:**
- **Resolution Modes:** High (120x60), Medium (80x40), Low (60x30)
- **Character Set:** Enhanced 68-character gradient for detailed shading
- **Real-time Adjustment:** Instant resolution changes without reload

**Performance Settings:**
- **Quality Levels:** High, Medium, Low performance profiles
- **Rotation Control:** Toggle between normal and slow rotation speeds
- **Animation Control:** Start/stop animation with ESC key

**Interaction Testing:**
- **Morphing Tests:** Automated interaction sequences
- **Mouse Simulation:** Programmatic interaction testing
- **Reset Functions:** Clear interactions and return to default state

### ⌨️ Keyboard Shortcuts

| Key | Function | Description |
|-----|----------|-------------|
| `R` | Reset Engine | Reinitialize the 3D engine |
| `M` | Toggle Models | Cycle through test models |
| `P` | Performance Mode | Cycle through performance levels |
| `S` | Slow Rotation | Toggle rotation speed |
| `I` | Interaction Info | Display interaction statistics |
| `ESC` | Stop Animation | Pause the animation loop |

### 📊 Performance Monitoring

**Real-time Metrics:**
- **FPS Counter** - Frames per second display
- **Render Time** - Millisecond rendering performance
- **Memory Usage** - Current memory consumption in MB
- **Engine Status** - Current operational state
- **Interaction Count** - Number of user interactions tracked
- **Morph Progress** - ASCII morphing animation percentage

**Optimization Features:**
- **Adaptive Performance** - Automatic quality adjustment based on device capability
- **Resource Management** - Intelligent memory cleanup and URL revocation
- **Error Recovery** - Graceful degradation with detailed error reporting

## Technical Architecture

### 🏗️ Core Components

**ASCII3DEngine** (`/src/js/modules/ascii3d-engine.js`)
- Three.js scene management and WebGL rendering
- ASCII character mapping and effect processing
- Model loading and management system
- Performance optimization and monitoring

**ASCII3DTestSuite** (`/src/js/ascii-video.js`)
- UI controls and keyboard shortcuts
- File upload handling and validation
- Performance statistics and monitoring
- Terminal-style error messaging

**Supporting Modules:**
- **ModelLoader** - 3D model loading and processing
- **InteractionSystem** - Mouse/touch interaction handling
- **PerformanceManager** - Resource optimization and monitoring

### 🔧 Build Integration

**Vite Configuration:**
- Module-based loading with ES6 imports
- Three.js addon support for GLTF and OBJ loaders
- ASCII effect integration from Three.js examples
- Development server support with hot reloading

**Asset Management:**
- Automatic model file processing
- WebGL shader compilation
- Memory-optimized texture loading
- Progressive loading with fallbacks

### 🛡️ Error Handling

**Validation Layers:**
- **WebGL Support Check** - Browser compatibility validation
- **File Format Validation** - Extension and MIME type checking
- **File Size Limits** - 50MB maximum with clear error messaging
- **Memory Management** - Automatic resource cleanup and disposal

**Error Recovery:**
- **Graceful Degradation** - Fallback to error states with reload options
- **Terminal Aesthetics** - Consistent error styling matching site theme
- **Detailed Feedback** - Specific error messages for troubleshooting

## Access and Discovery

### 🔗 Current Access Method
The ASCII 3D Video Lab is currently accessible only via direct URL navigation to `/ascii-video`. This maintains its "easter egg" nature as a hidden experimental feature.

### 🚀 Planned Enhancement
**Hidden Link Integration:** A future enhancement will add a clickable "&" symbol within the landing page portfolio title that links to the ASCII video page:

**Implementation Details:**
- **Location:** Landing page (`index.html`) portfolio title: "PORTFOLIO & WEBSITE"
- **Target Element:** The "&" character in the title
- **Interaction:** Clickable link with pink hover effect (`#ff00f6`)
- **Behavior:** Direct navigation to `/ascii-video` page
- **Discovery:** Reward users who explore the typography for hidden functionality

**Technical Specification:**
```html
<!-- Planned implementation -->
<h2 class="portfolio-title">
    PORTFOLIO   
    <a href="/ascii-video" class="hidden-link">&</a><br>     
    WEBSITE
</h2>
```

**CSS Styling:**
```scss
.hidden-link {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
        color: $neo-pink; // #ff00f6
    }
}
```

## Development and Testing

### 🧪 Testing Workflow
1. **Initial Load Testing** - Verify WebGL support and engine initialization
2. **Model Loading** - Test preset models (cube, sphere, torus)
3. **Custom Upload Testing** - Validate file upload with various formats
4. **Performance Validation** - Monitor FPS and memory usage across quality levels
5. **Interaction Testing** - Verify keyboard shortcuts and UI controls
6. **Error Handling** - Test invalid files and unsupported formats

### 🔍 Debug Features
- **Console Logging** - Detailed initialization and operation logs
- **Performance Stats** - Real-time metrics display
- **Error Tracking** - Terminal-style error reporting
- **Memory Monitoring** - Resource usage and cleanup validation

### 📱 Browser Compatibility
- **WebGL Required** - Modern browser with WebGL support
- **File API Support** - For custom model upload functionality
- **ES6 Modules** - Modern JavaScript module loading
- **Progressive Enhancement** - Graceful degradation for unsupported features

## Future Enhancements

### 🎯 Planned Features
1. **Hidden Link Implementation** - "&" symbol link from landing page
2. **Additional Model Formats** - Support for more 3D file types
3. **Custom Shaders** - Advanced ASCII rendering effects
4. **Export Functionality** - Save ASCII renderings as images/videos
5. **Preset Collections** - Curated 3D model library
6. **Advanced Interactions** - Touch gestures and multi-touch support

### 🚀 Technical Improvements
1. **Web Workers** - Background model processing
2. **WebAssembly** - Performance-critical operations
3. **PWA Features** - Offline functionality and caching
4. **WebXR Integration** - VR/AR ASCII rendering
5. **Audio Visualization** - Sound-reactive ASCII animations

## Neo-Brutalist Design System Integration

The ASCII 3D Video Lab maintains consistency with the overall site design system:

**Color Palette Compliance:**
- **Primary:** Neo-blue (`#3300ff`) for UI elements and text
- **Background:** Pure black (`#000000`) for terminal aesthetic
- **Accents:** Neo-pink (`#ff00f6`) for planned hover effects
- **Error States:** Neo-red (`#ff0000`) for critical feedback

**Typography Consistency:**
- **Monospace Family** for authentic terminal experience
- **Systematic Spacing** matching site-wide grid system
- **Case Sensitivity** following neo-brutalist principles

**Interaction Philosophy:**
- **Functional Minimalism** - Controls serve specific purposes
- **Performance First** - Optimization as a core feature
- **Hidden Depth** - Easter egg nature rewards exploration
- **Professional Quality** - Production-ready implementation standards

---

*This documentation reflects the current implementation as of August 2025. The ASCII 3D Video Lab represents a unique intersection of technical experimentation and neo-brutalist design philosophy, providing both functional value and discovery reward within the PJM.STUDIO ecosystem.*
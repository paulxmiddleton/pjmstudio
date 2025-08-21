## PJM.STUDIO - Neo-Brutalist Visual Portfolio

### Identity
- **Name**: Paul Middleton
- **Brand**: "VISUAL EXISTENTIALIST" 
- **Professional Roles**: Video Editor, Director, Photographer, Graphic Designer
- **Domain**: pjm.studio

### Session Startup Instructions
- Every time we start a new session on this project, run "/prime"
- Every time we start a new session on this project, read CLAUDE.md
- Every time i prompt claude, you should think about which sub agents to implement for best results
- Before you tell me a task is done, make sure you double or triple checked that the task and actual solution were found, dont tell me its done when it isnt or when its still a bug and you didnt look

### Current Design System (2025)

**Neo-Brutalist Architecture** - High-fashion minimalism with systematic approach

#### Approved 7-Color Palette
- `$white: #FFFFFF` - Pure white, primary background
- `$black: #000000` - Pure black, primary text/borders  
- `$neo-blue: #3300ff` - Neo-brutalist blue, primary accent
- `$neo-pink: #ff00f6` - Neo-brutalist pink, secondary accent
- `$neo-red: #ff0000` - Neo-brutalist red, alert/error
- `$off-grey: #bec2c1` - Off-grey, neutral medium
- `$off-white: #e9edec` - Off-white, subtle backgrounds

#### Typography System
- **Primary**: 'Bebas Neue', 'Space Grotesk', Arial, sans-serif
- **Secondary**: 'Inter' for high-fashion sections
- **Mono**: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono'
- **Philosophy**: Extreme contrast between thin (lowercase, wide tracking) and thick (uppercase, condensed) typography

#### Page Architecture
1. **Landing Page** (`index.html`) - Neo-blue background with VISUAL EXISTENTIALIST branding
2. **Home/Portfolio** (`home.html`) - High-fashion brutalist layout with Inter typography
3. **Portfolio Sections** - Clean white backgrounds with systematic spacing
4. **ASCII 3D Video Lab** (`/ascii-video`) - Hidden terminal aesthetic with neo-blue theme

### Technical Stack

**Build System**: Vite + SCSS + JavaScript Modules
- **3D Engine**: Three.js with ASCII rendering system
- **Animation**: GSAP for interactions and transitions
- **Assets**: Optimized fonts (woff2), images (WebP/JPEG), videos (WebM)
- **Performance**: Modular architecture, lazy loading, systematic caching

### Current Features

#### Core Pages
- **Landing Portal**: Neo-blue background, minimalist branding, castle portal entry
- **Portfolio Hub**: High-fashion brutalist grid system with Inter typography  
- **Portfolio Sections**: Directing, Videography, Photography, Video Editing, Graphic Design
- **Store Integration**: Placeholder for e-commerce (Stripe integration planned)

#### Interactive Features
- **Floating Navigation**: Consistent across all pages with smooth animations
- **ASCII 3D Engine**: Custom Three.js-powered ASCII renderer with morphing animations
- **Custom File Upload**: Support for .glb, .gltf, .obj 3D model loading
- **Responsive Design**: Mobile-first with touch interactions

#### Hidden Features
- **ASCII Video Lab** (`/ascii-video`): Terminal-style interface for 3D model testing
  - Neo-blue color scheme matching site palette
  - File upload capability for custom 3D models
  - All original test controls and performance monitoring
  - Easter egg accessible only via direct URL

### Development Workflow

#### Commands
- `npm run dev` - Development server (localhost:3000)
- `npm run build` - Production build with asset optimization
- `npm run preview` - Preview production build locally

#### Checkpoint System
- `npm run checkpoint` - Create project snapshot with timestamp
- `npm run checkpoint-list` - View all saved checkpoints
- `npm run checkpoint-restore [id]` - Restore to previous state
- `npm run checkpoint-delete [id]` - Remove old checkpoints

### Recent Implementation (August 2025)

#### ASCII 3D Video Lab Implementation
- ✅ Created hidden `/ascii-video` page with terminal aesthetic
- ✅ Replaced all green colors (#00ff00) with neo-blue (#3300ff) 
- ✅ Added custom 3D model file upload (.glb, .gltf, .obj support)
- ✅ Integrated with build system and routing configuration
- ✅ Preserved all existing ASCII engine functionality and test controls
- ✅ Maintained easter egg nature (no main navigation links)

#### Store Page ASCII Background Elements (August 14, 2025 Session)
**MAJOR BREAKTHROUGH SESSION - ASCII WORKING ON STORE PAGE**
- ✅ Successfully implemented 3 ASCII background engines for store page
- ✅ Fixed horizontal line glitching artifacts with aggressive CSS anti-glitch styling
- ✅ Resolved `engineConfig undefined` error causing engine initialization failures  
- ✅ Disabled unwanted randomization timer (models stay static per user request)
- ✅ Implemented store-specific scaling (castle-archers reduced to 30% size)
- ⚠️ **CURRENT ISSUE**: Positioning problem - had 3 elements working earlier but lost during debugging
- 🎯 **NEXT SESSION**: Revert to working positioning from earlier in session (~2 hours ago when user said "great work")

**Key Files Modified**:
- `/src/js/modules/store-ascii-controller.js` - Main controller for 3 engines
- `/src/js/modules/ascii3d-engine.js` - Enhanced with debugging and positioning fixes
- `/store.html` - Contains 3 canvas elements: storeAsciiCanvas1, storeAsciiCanvas2, storeAsciiCanvas3

**Technical Findings**:
- ASCII3DEngine confirmed working (generates 8470+ character content per frame)
- All 3 engines initialize successfully (`window.testAscii()` shows controller: true, engines: 3, canvases: 3)
- Issue is DOM positioning of ASCII elements, not rendering itself
- Elements configured at positions: 20%, 50%, 80% horizontally, 40% vertically, 400x300px size

#### Technical Architecture
- ✅ Enhanced ASCII3DEngine with custom model loading methods
- ✅ File validation and error handling with terminal-style messages
- ✅ Proper URL cleanup and memory management
- ✅ Build configuration updates for deployment
- ✅ StoreAsciiController managing 3 synchronized ASCII engines

### Design Philosophy

**Neo-Brutalist Principles**:
- Raw, uncompromising aesthetic with systematic approach
- Extreme typographic contrast (thin vs. thick)
- Approved color palette strictly enforced
- High-fashion sensibility with confident restraint
- Functional minimalism over decorative elements

**User Experience**:
- Immediate visual impact with progressive enhancement
- Systematic spacing and typography for clarity
- Hidden features reward exploration (ASCII lab)
- Performance-first with sub-3-second load times

### Next Priority Tasks

#### Content Development
1. **Portfolio Content**: Replace placeholder content with actual work samples
2. **Store Implementation**: Integrate Stripe for e-commerce functionality
3. **Performance Optimization**: Lighthouse audits and Core Web Vitals optimization

#### Future Enhancements
1. **Hidden Link Enhancement**: Add "&" symbol link in landing page portfolio title to ASCII video page (pink hover effect)
2. **Advanced ASCII Features**: Additional 3D model formats, custom shaders
3. **Content Management**: Dynamic portfolio loading system

### Known Technical Details

**Performance Metrics**:
- Total JavaScript: ~83KB (31KB gzipped)
- CSS: 6.8KB (1.9KB gzipped)  
- Font optimization: Tempting.woff2 (14.8KB, 54% smaller than TTF)
- Image optimization: Landing illustration JPEG (7.3MB, 78% reduction from PNG)

**Browser Support**:
- WebGL required for ASCII 3D features
- Progressive enhancement for non-WebGL browsers
- Mobile-responsive with touch interaction support

**Development Notes**:
- All green colors systematically replaced with neo-blue
- Three.js loaders (GLTF, OBJ) integrated for custom model support
- Terminal-style error messages maintain aesthetic consistency
- File size limits (50MB) and format validation implemented


### Last Session Update (2025-08-21)
**Session Duration**: 0 minutes
**Key Changes**: Created session memory system with npm scripts for seamless context continuity
**Context**: Updated project memory for seamless session continuity

### Project Structure
```
pjm-studio/
├── index.html              # Landing page (neo-blue theme)
├── home.html               # Portfolio hub (high-fashion brutalist)
├── portfolio/              # Portfolio sections (white backgrounds)
├── ascii-video.html        # Hidden ASCII lab (terminal theme)
├── src/
│   ├── styles/
│   │   ├── _variables.scss # 7-color palette + typography system
│   │   └── main.scss       # Neo-brutalist base styles
│   ├── js/
│   │   ├── modules/        # ASCII engine, animations, interactions
│   │   └── ascii-video.js  # Custom file upload functionality
│   └── assets/
│       ├── fonts/          # Optimized web fonts (woff2)
│       ├── images/         # Optimized visuals
│       └── models/         # 3D assets for ASCII rendering
└── vite.config.js          # Build optimization + asset handling
```
- every time we end a session, i need you to update your claude.md file with current context so you understand where we left off. maybe if i say /endsession that would mean to gather and summarize what we did that session that is important to know for the next session so you understand any updates to the projects without getting outdated
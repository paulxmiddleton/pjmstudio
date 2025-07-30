## Personal Website Project

### Identity
- Name: Paul Middleton
- Professional Roles: Video Editor, Director, Photographer, Graphic Designer
- Domain: pjm.studio

### Session Startup Instructions
- Every time we start a new session on this project, run "/prime"
- Every time we start a new session on this project, read CLAUDE.md
- Every time i prompt claude, you should think about which sub agents to implement for best results

### Website Goals
- Create a comprehensive personal portfolio and online hub that is minimal yet tasteful and uses modern web design features
- Showcase professional skills across multiple disciplines
- Implement an e-commerce store for selling:
  * Stickers
  * Digital assets
  * Unique furniture pieces
  * Clothing designs
  * Graphic design products

### Portfolio Sections
- Directing
- Videography
- Photography
- Video Editing
- Graphic Design

### Additional Features
- Skills overview page
- Integrated online store
- Flexible platform for showcasing and selling creative work

### Design Inspiration and Personal Interests
- Overall website theme: Old medieval manuscript illustration style
- Personal interests:
  * Skateboarding
  * Cooking
  * Gardening
  * Video games (e.g., Call of Duty 4, Modern Warfare 2)
- Aesthetic preferences:
  * Brutalist design elements
  * Low-light photography/design
  * Color palette emphasizing blue tones
- Design Philosophy:
  * Medieval manuscript style inspiration
  * Moody aesthetics and tones
  * Clean, minimalistic design
  * Dragon-themed accents
  * Portfolio pages with clean layout and tasteful medieval theme elements

## Technical Implementation Status

### Current Architecture (Optimized July 2025)
- **Build System**: Vite with SCSS, GSAP, Three.js, Lenis
- **Structure**: Modular JavaScript architecture
- **Status**: Landing page complete with medieval theme

### Recent Optimizations Completed
1. **Code Structure**:
   - Split main.js (287 lines) into focused modules:
     * `cursor.js` - Custom sword cursor functionality
     * `animations.js` - GSAP knight & text animations  
     * `parallax.js` - Mouse-based parallax effects
     * `sparkles.js` - Medieval sparkle effects
     * `utils.js` - Loading, portal, video management
   - Fixed vite.config.js location (moved to project root)
   - Created scalable directory structure for future expansion

2. **Asset Optimization**:
   - Video: Prioritizes 36KB WebM over 3MB MOV
   - Lazy loading setup for non-critical images
   - Build optimization with proper asset chunking
   - Asset organization by type (images/fonts/videos)

3. **Performance**:
   - Total JS: ~83KB (31KB gzipped)
   - CSS: 6.8KB (1.9KB gzipped)
   - All animations and interactions working perfectly

### Development Commands
- `npm run dev` - Development server (localhost:3000)
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Checkpoint System Commands
- `/checkpoint [title]` - Create complete project snapshot with optional custom title
- `/checkpoint-list` - View all saved checkpoints with metadata
- `/checkpoint-restore <id>` - Restore project to previous checkpoint state  
- `/checkpoint-delete <id>` - Delete old checkpoints to free storage space

### Recently Completed Tasks (July 27, 2025)
1. **Font Optimization**: ✅ Converted Tempting.ttf to .woff2/.woff formats
   - Generated Tempting.woff2 (14.8KB, 54% smaller)
   - Generated Tempting.woff (18.3KB, 43% smaller)
   - Updated CSS font-face declarations for optimal loading
2. **Image Optimization**: ✅ Optimized large background image
   - Converted landing-illustration.png (33MB) to JPEG (7.3MB, 78% reduction)
   - Updated all references across portfolio pages and asset config
3. **Portfolio Pages**: ✅ Updated and optimized all portfolio sections
   - All directing/videography/photography/video-editing/graphic-design pages ready
   - Optimized background images for faster loading
   - Maintained medieval theme consistency

### Next Priority Tasks
1. **E-commerce Integration**: Research Stripe/shop integration options
2. **Performance Testing**: Run Lighthouse audits to measure improvements
3. **Content Addition**: Add actual portfolio content to replace placeholders

### Technical Notes
- Custom cursor with sword theme working
- Knight head/sword mouse tracking implemented
- Medieval sparkles system active
- Parallax effects on desktop only
- Mobile responsive with touch interactions
- Password-protected castle portal ready for main site

### Known Issues
- Sass legacy API deprecation warning (cosmetic)
- Font format warnings for missing .woff2/.woff files (performance improvement needed)

### Design Flexibility
- Graphic design capabilities:
  * Photoshop expertise for image manipulation
  * Ability to create custom design elements
  * Skilled in background removal and image editing
- Video editing capabilities:
  * Proficient in After Effects and Premiere
  * Can create and modify custom video elements
## Personal Website Project

### Identity
- Name: Paul Middleton
- Professional Roles: Video Editor, Director, Photographer, Graphic Designer
- Domain: pjm.studio

### Website Goals
- Create a comprehensive personal portfolio and online hub
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
- Overall website theme: Old medieval illustration style
- Personal interests:
  * Skateboarding
  * Cooking
  * Gardening
  * Cannabis
  * Video games (e.g., Call of Duty)
- Aesthetic preferences:
  * Brutalist design elements
  * Low-light photography/design
  * Color palette emphasizing blue tones

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

### Next Priority Tasks
1. **Font Optimization**: Convert Tempting.ttf to .woff2/.woff formats
2. **Image Optimization**: Consider WebP format for large PNGs
3. **Portfolio Pages**: Build out directing/videography/photography sections
4. **E-commerce Integration**: Research Stripe/shop integration options

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
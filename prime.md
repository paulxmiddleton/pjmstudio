# Prime Command - Codebase Context Overview

You are assisting with **PJM Studio**, a medieval-themed personal portfolio and e-commerce website for Paul Middleton, a creative professional specializing in directing, videography, photography, video editing, and graphic design.

## Project Identity & Goals
- **Domain**: pjm.studio
- **Theme**: Medieval manuscript aesthetic with brutalist design elements
- **Color Palette**: Blue tones with moody, low-light aesthetics
- **Purpose**: Portfolio showcase + e-commerce platform for stickers, digital assets, furniture, clothing, and graphic design products

## Current Technical Architecture (July 2025)

### Build System & Dependencies
- **Build Tool**: Vite with optimized configuration (vite.config.js)
- **Styling**: SCSS with modular architecture
- **JavaScript**: Modular ES6+ architecture (~83KB total, 31KB gzipped)
- **Key Libraries**: 
  - GSAP (animations)
  - Three.js (3D effects)
  - Lenis (smooth scrolling)
  - Split-type (text animations)

### File Structure
```
pjm-studio/
├── src/
│   ├── js/
│   │   ├── main.js (main entry point)
│   │   ├── modules/ (split architecture):
│   │   │   ├── cursor.js (sword cursor)
│   │   │   ├── animations.js (GSAP knight & text)
│   │   │   ├── parallax.js (mouse-based effects)
│   │   │   ├── sparkles.js (medieval particles)
│   │   │   └── utils.js (loading, portal, video)
│   │   ├── store.js (e-commerce foundation)
│   │   └── home.js, home-simple.js
│   ├── styles/ (SCSS modules)
│   ├── assets/ (optimized images, fonts, videos)
│   ├── pages/ (portfolio sections)
│   └── config/assets.js (asset loading strategy)
├── package.json (Vite + GSAP + Three.js + Lenis)
├── vite.config.js (build optimization)
├── CLAUDE.md (project instructions)
├── DEPLOYMENT.md (hosting guide)
└── STORE_IMPLEMENTATION.md (e-commerce roadmap)
```

### Development Commands
- `npm run dev` - Development server (localhost:3000)
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Current Implementation Status

### ✅ Completed Features
1. **Landing Page**: Medieval-themed with knight animations, sword cursor, parallax effects
2. **Modular Architecture**: Split from 287-line main.js into focused modules
3. **Asset Optimization**: 
   - Tempting font converted to WOFF2/WOFF (54% size reduction)
   - Landing illustration optimized from 33MB PNG to 7.3MB JPEG
   - Video prioritization (36KB WebM over 3MB MOV)
4. **Portfolio Pages**: All sections ready (directing, videography, photography, video-editing, graphic-design)
5. **Interactive Elements**: Sword cursor, knight head/sword tracking, medieval sparkles, castle portal
6. **Performance**: Optimized build with proper chunking and asset organization

### 🔄 Next Priority Tasks
1. **E-commerce Integration**: Shopify Buy Button implementation (detailed in STORE_IMPLEMENTATION.md)
2. **Content Addition**: Replace placeholder content with actual portfolio work
3. **Performance Testing**: Lighthouse audits and optimization

### 🎨 Design Philosophy
- Medieval manuscript inspiration with dragon accents
- Clean, minimalistic layout with tasteful medieval elements
- Brutalist design touches with moody aesthetics
- Mobile-responsive with touch interactions
- Professional presentation balancing creativity with usability

## Key Technical Features

### Animation System
- GSAP-powered knight animations with mouse tracking
- Medieval sparkle particle effects
- Smooth text reveals and transitions
- Desktop parallax with mobile optimization

### Asset Loading Strategy
- Critical path optimization for key images
- Lazy loading for secondary assets
- Progressive font loading (WOFF2 → WOFF → fallback)
- Optimized video delivery

### Modular JavaScript Architecture
- Each feature in dedicated module
- Clean separation of concerns
- Scalable for future expansion
- Performance-optimized loading

## Development Context

### Recent Work (July 2025)
- Major code organization refactor
- Font and image optimization passes
- Build system improvements
- Performance enhancements

### Known Issues
- Sass legacy API warning (cosmetic)
- Some placeholder content needs replacement

### User Preferences
- Prefers editing existing files over creating new ones
- Values concise, direct communication
- Appreciates medieval theme consistency
- Focus on performance and clean code

This context should provide sufficient understanding of the current codebase state, architecture decisions, and project direction for effective assistance.
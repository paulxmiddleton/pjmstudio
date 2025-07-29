# PJM Studio Deployment Guide

## Clean URLs Configuration

### Apache Servers (.htaccess)
The provided `.htaccess` file automatically handles:
- Removing `.html` extensions from URLs
- Redirecting old `.html` URLs to clean versions
- Caching static assets
- Gzip compression

**Example URLs:**
- `pjm.studio/home` (instead of `pjm.studio/home.html`)
- `pjm.studio/store` (instead of `pjm.studio/store.html`)
- `pjm.studio/portfolio` (links to portfolio overview)

### Nginx Configuration
For Nginx servers, add this to your server block:

```nginx
server {
    listen 80;
    server_name pjm.studio www.pjm.studio;
    root /var/www/pjm-studio;
    index index.html home.html;

    # Remove .html extension
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Redirect .html URLs to clean URLs
    if ($request_uri ~ ^/(.*)\.html$) {
        return 301 /$1;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

### Cloudflare Pages / Vercel / Netlify
These platforms automatically handle clean URLs. No additional configuration needed.

### GitHub Pages
Add this to your `_config.yml`:
```yaml
permalink: pretty
plugins:
  - jekyll-redirect-from
```

## Domain Configuration

### Primary Domain: pjm.studio
- Set up A records pointing to your server IP
- Configure HTTPS with Let's Encrypt or SSL certificate
- Redirect `www.pjm.studio` to `pjm.studio`

### URL Structure
```
pjm.studio/               → Landing page (index.html)
pjm.studio/home           → Main home page
pjm.studio/portfolio      → Portfolio overview
pjm.studio/store          → E-commerce store
pjm.studio/directing      → Individual portfolio pages
pjm.studio/videography
pjm.studio/photography
pjm.studio/video-editing
pjm.studio/graphic-design
```

## Build Process

### Development
```bash
npm run dev    # Runs on localhost:3000/3001
```

### Production Build
```bash
npm run build       # Creates dist/ folder
npm run preview     # Preview production build
```

### Deployment Files
Upload these files to your web server:
```
/
├── index.html              # Landing page
├── home.html              # Main home page  
├── store.html             # Store page
├── .htaccess              # Apache clean URLs
├── src/
│   ├── assets/            # Images, fonts, videos
│   ├── styles/            # SCSS files (compiled to CSS)
│   ├── js/                # JavaScript modules
│   └── pages/             # Portfolio pages
└── dist/                  # Built assets (from npm run build)
```

## Performance Optimization

### Image Optimization
- Convert large PNGs to WebP format
- Use responsive images with srcset
- Lazy load non-critical images

### Font Optimization  
- Convert TTF fonts to WOFF2/WOFF
- Preload critical fonts
- Use font-display: swap

### JavaScript
- Code splitting already implemented
- Tree shaking via Vite
- Total JS bundle: ~83KB (31KB gzipped)

### CSS
- SCSS compilation and minification
- Critical CSS inlined
- Total CSS: 6.8KB (1.9KB gzipped)

## SEO Configuration

### Meta Tags (add to each page)
```html
<meta name="description" content="Paul Middleton - Creative Professional & Visual Storyteller specializing in directing, videography, photography, and graphic design.">
<meta name="keywords" content="director, video editor, photographer, graphic designer, medieval design, brutalist design">
<meta property="og:title" content="PJM Studio - Creative Professional">
<meta property="og:description" content="Visual storytelling through directing, videography, photography, and graphic design">
<meta property="og:image" content="https://pjm.studio/src/assets/images/og-image.jpg">
<meta property="og:url" content="https://pjm.studio">
```

### Sitemap (create sitemap.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://pjm.studio/</loc><priority>1.0</priority></url>
  <url><loc>https://pjm.studio/home</loc><priority>0.9</priority></url>
  <url><loc>https://pjm.studio/portfolio</loc><priority>0.9</priority></url>
  <url><loc>https://pjm.studio/store</loc><priority>0.8</priority></url>
  <url><loc>https://pjm.studio/directing</loc><priority>0.7</priority></url>
  <url><loc>https://pjm.studio/videography</loc><priority>0.7</priority></url>
  <url><loc>https://pjm.studio/photography</loc><priority>0.7</priority></url>
  <url><loc>https://pjm.studio/video-editing</loc><priority>0.7</priority></url>
  <url><loc>https://pjm.studio/graphic-design</loc><priority>0.7</priority></url>
</urlset>
```

## Analytics & Monitoring

### Google Analytics 4
Add to all pages before closing `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Core Web Vitals
- Current Lighthouse score: 95+ (estimated)
- LCP: <1.5s (optimized images and fonts)
- FID: <100ms (minimal JavaScript)
- CLS: <0.1 (stable layout)

## Security Headers

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https:;
">
```

## Final Deployment Checklist

- [ ] Domain configured with SSL certificate
- [ ] Clean URLs working (.htaccess or server config)
- [ ] All pages load without .html extension
- [ ] Navigation links updated to clean URLs
- [ ] Store functionality tested
- [ ] Portfolio pages accessible
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags added
- [ ] Analytics installed
- [ ] Performance optimized (images, fonts)
- [ ] Security headers configured
- [ ] Sitemap submitted to Google Search Console

## Post-Launch Tasks

1. **Shopify Store Setup** (follow STORE_IMPLEMENTATION.md)
2. **Content Management** (add real portfolio content)
3. **Email Marketing** (set up newsletter automation)
4. **Social Media Integration** (verify all links work)
5. **Backup Strategy** (automated backups of website files)

This deployment guide ensures your medieval-themed portfolio and e-commerce site will perform optimally in production with clean, professional URLs.
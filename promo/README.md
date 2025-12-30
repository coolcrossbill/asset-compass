# Asset Compass - Promotional Page

A professional, responsive promotional landing page with pricing tiers for Asset Compass IT Asset Management solution.

## 📁 Files

- `index.html` - Main HTML structure (English)
- `index-ru.html` - Russian translation
- `style.css` - Complete styling with responsive design
- `script.js` - Interactive functionality and animations
- `Dockerfile` - Docker container configuration
- `docker-compose.yml` - Docker Compose orchestration
- `nginx.conf` - Nginx web server configuration
- `.dockerignore` - Docker build exclusions
- `README.md` - This file
- `DOCKER_QUICKSTART.md` - Quick Docker guide

## 🚀 Features

### Design & Layout
- **Modern, clean design** with gradient accents
- **Fully responsive** - works on desktop, tablet, and mobile
- **Smooth animations** and transitions
- **Accessible** with keyboard navigation support
- **Multi-language support** - English and Russian versions with language switcher

### Sections
1. **Navigation Bar** - Fixed header with mobile menu
2. **Hero Section** - Eye-catching headline with CTA and stats
3. **Features** - 6 feature cards highlighting key capabilities
4. **Benefits** - 4 main value propositions
5. **Pricing** - 3 pricing tiers (Starter, Professional, Enterprise)
6. **CTA Section** - Email capture with trial signup
7. **Footer** - Links and company information

### Interactive Elements
- ✅ Mobile-responsive hamburger menu
- ✅ Monthly/Annual pricing toggle (20% discount for annual)
- ✅ Email validation with notifications
- ✅ Smooth scroll navigation
- ✅ Animated elements on scroll
- ✅ Hover effects and transitions

## 🎨 Pricing Tiers

### Starter - $49/month ($39/month annual)
- Up to 100 assets
- 5 team members
- Basic reporting
- Email support
- REST API access

### Professional - $149/month ($119/month annual) ⭐ Most Popular
- Up to 1,000 assets
- Unlimited team members
- Advanced reporting & analytics
- Priority support (24/7)
- Custom integrations
- Automated discovery
- Role-based access control

### Enterprise - Custom Pricing
- Unlimited assets
- Unlimited team members
- Custom dashboards & reports
- Dedicated account manager
- On-premise deployment option
- SLA guarantees
- Advanced security features
- Custom training & onboarding

## 🌐 How to Use

### Option 1: Docker (Recommended) 🐳
The easiest way to run the promo site using Docker:

```bash
cd app/promo

# Build and run with docker-compose
docker-compose up -d

# Or build and run manually
docker build -t asset-compass-promo .
docker run -d -p 7070:80 --name promo asset-compass-promo
```

Then visit: `http://localhost:7070`

Available in multiple languages:
- 🇬🇧 English: `http://localhost:7070/`
- 🇷🇺 Russian: `http://localhost:7070/index-ru.html`

To stop:
```bash
docker-compose down
# or
docker stop promo && docker rm promo
```

### Option 2: Direct File Access
Simply open `index.html` in any modern web browser:

```bash
cd app/promo
open index.html  # macOS
# or
xdg-open index.html  # Linux
# or
start index.html  # Windows
```

### Option 3: Local Web Server
For best results, serve via a local web server:

```bash
# Using Python 3
cd app/promo
python -m http.server 7070

# Using Node.js (http-server)
npx http-server app/promo -p 7070

# Using PHP
php -S localhost:7070 -t app/promo
```

Then visit: `http://localhost:7070`

### Option 4: Deploy to Production
Deploy the `promo/` folder to any static hosting service:

- **Netlify**: Drag & drop the folder
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Push to gh-pages branch
- **AWS S3**: Upload to S3 bucket with static hosting
- **Cloudflare Pages**: Connect via Git

## 🎯 Customization

### Colors
Edit CSS variables in `style.css`:

```css
:root {
    --primary: #3b82f6;      /* Main brand color */
    --secondary: #8b5cf6;    /* Accent color */
    --dark: #0f172a;         /* Text color */
    /* ... more variables */
}
```

### Pricing
Update pricing in `index.html` by modifying the `data-monthly` and `data-annual` attributes:

```html
<span class="amount" data-monthly="49" data-annual="39">49</span>
```

### Content
All content is in `index.html` and can be easily modified:
- Hero headline and subtitle
- Feature descriptions
- Benefits list
- Pricing details
- Footer links

### Functionality
Customize behavior in `script.js`:
- Email validation rules
- Notification messages
- Animation timing
- Form submission handling

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 🔧 Technical Details

### Technologies Used
- **Pure HTML5** - Semantic markup
- **Native CSS3** - No frameworks, custom design
- **Vanilla JavaScript** - No dependencies
- **CSS Grid & Flexbox** - Modern layouts
- **CSS Custom Properties** - Easy theming
- **Intersection Observer API** - Scroll animations
- **Docker** - Containerized deployment
- **Nginx Alpine** - Lightweight web server (~23MB image)

### Performance
- ⚡ No external dependencies
- ⚡ Minimal file size (~15KB total)
- ⚡ Fast page load times
- ⚡ Optimized animations
- ⚡ Gzip compression enabled
- ⚡ Static asset caching (1 year)

### Accessibility
- ♿ Semantic HTML
- ♿ ARIA labels where needed
- ♿ Keyboard navigation support
- ♿ Focus indicators
- ♿ Responsive text sizing

## 🐳 Docker Details

### Container Information
- **Base Image**: nginx:alpine (~23MB)
- **Port**: 80 (mapped to 7070 on host)
- **Health Check**: Built-in endpoint at `/health`
- **Restart Policy**: Unless stopped manually

### Docker Commands

```bash
# Build the image
docker build -t asset-compass-promo .

# Run container
docker run -d -p 7070:80 --name promo asset-compass-promo

# View logs
docker logs promo

# Check health status
docker ps
curl http://localhost:7070/health

# Stop and remove
docker stop promo && docker rm promo

# Using docker-compose
docker-compose up -d          # Start
docker-compose logs -f        # View logs
docker-compose ps             # Check status
docker-compose down           # Stop and remove
```

### Production Deployment
The Docker setup is production-ready with:
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- ✅ Gzip compression for faster loads
- ✅ Static asset caching (1 year expiry)
- ✅ Health check endpoint for monitoring
- ✅ Graceful restart policy

## 📝 TODO (Optional Enhancements)

- [ ] Add favicon and meta tags for social sharing
- [ ] Implement actual form submission to backend
- [ ] Add customer testimonials section
- [ ] Include video demo
- [ ] Add FAQ section
- [ ] Implement live chat widget
- [ ] Add analytics tracking (Google Analytics, etc.)
- [ ] A/B testing variations
- [ ] SSL/TLS certificate setup for HTTPS
- [ ] CDN integration for global distribution

## 📄 License

Part of the Asset Compass project.

---

**Need help?** Contact the development team or refer to the main Asset Compass documentation.


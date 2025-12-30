# Asset Compass - Promotional Page

A professional, responsive promotional landing page with pricing tiers for Asset Compass IT Asset Management solution.

## 📁 Files

- `index.html` - Main HTML structure
- `style.css` - Complete styling with responsive design
- `script.js` - Interactive functionality and animations
- `README.md` - This file

## 🚀 Features

### Design & Layout
- **Modern, clean design** with gradient accents
- **Fully responsive** - works on desktop, tablet, and mobile
- **Smooth animations** and transitions
- **Accessible** with keyboard navigation support

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

### Option 1: Direct File Access
Simply open `index.html` in any modern web browser:

```bash
cd app/promo
open index.html  # macOS
# or
xdg-open index.html  # Linux
# or
start index.html  # Windows
```

### Option 2: Local Web Server
For best results, serve via a local web server:

```bash
# Using Python 3
cd app/promo
python -m http.server 8080

# Using Node.js (http-server)
npx http-server app/promo -p 8080

# Using PHP
php -S localhost:8080 -t app/promo
```

Then visit: `http://localhost:8080`

### Option 3: Deploy to Production
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

### Performance
- ⚡ No external dependencies
- ⚡ Minimal file size (~15KB total)
- ⚡ Fast page load times
- ⚡ Optimized animations

### Accessibility
- ♿ Semantic HTML
- ♿ ARIA labels where needed
- ♿ Keyboard navigation support
- ♿ Focus indicators
- ♿ Responsive text sizing

## 📝 TODO (Optional Enhancements)

- [ ] Add favicon and meta tags for social sharing
- [ ] Implement actual form submission to backend
- [ ] Add customer testimonials section
- [ ] Include video demo
- [ ] Add FAQ section
- [ ] Implement live chat widget
- [ ] Add analytics tracking (Google Analytics, etc.)
- [ ] A/B testing variations

## 📄 License

Part of the Asset Compass project.

---

**Need help?** Contact the development team or refer to the main Asset Compass documentation.


# 🚀 Quick Start Guide - Asset Compass Promo Site

Get the multi-language promo site running in seconds!

## ⚡ Super Quick Start

```bash
cd /Volumes/Code/work/ai/asset-compass/app/promo
docker-compose up -d
```

**Done!** 🎉

Visit the sites:
- 🇬🇧 **English**: http://localhost:7070/
- 🇷🇺 **Russian**: http://localhost:7070/index-ru.html
- 🇯🇵 **Japanese** (Kawaii ✨): http://localhost:7070/index-ja.html

## 📚 Documentation Index

| File | Description | When to Read |
|------|-------------|--------------|
| **README.md** | Complete documentation | Start here for overview |
| **DOCKER_QUICKSTART.md** | Docker commands | Quick Docker reference |
| **LANGUAGES.md** | Multi-language guide | Adding new languages |
| **KAWAII_FEATURES.md** | Japanese kawaii design | Understanding kawaii approach |
| **LANGUAGE_COMPARISON.md** | Side-by-side comparison | See translation differences |
| **QUICK_START.md** | This file! | Getting started fast |

## 🎯 What You Get

### 3 Language Versions
- ✅ **English** - Professional, clean, direct
- ✅ **Russian** - Formal, thorough, reliable
- ✅ **Japanese** - Kawaii, friendly, emoji-rich ✨

### All Features
- 📱 Fully responsive design
- 🎨 Modern gradient UI
- 💰 Interactive pricing toggle (monthly/annual)
- 📧 Email validation
- 🔄 Language switcher in nav
- 🚀 Fast Docker deployment
- 🎯 Production-ready nginx config

## 🌈 Language Features Comparison

| Feature | English | Russian | Japanese |
|---------|---------|---------|----------|
| Emojis | ❌ | ❌ | ✅ 50+ |
| Tone | Professional | Professional | Friendly |
| Style | Direct | Formal | Playful |
| Target | Enterprise | Enterprise | Modern Teams |

## 🎨 Preview Each Version

### English (Clean Professional)
```
Navigate Your IT Infrastructure with Confidence
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Features | Benefits | Pricing
```

### Russian (Formal)
```
Управляйте вашей IT-инфраструктурой с уверенностью
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Возможности | Преимущества | Цены
```

### Japanese (Kawaii ✨)
```
IT インフラを楽しく管理 🌈
━━━━━━━━━━━━━━━━━━━━━━━━
機能 🌟 | メリット 💝 | 料金プラン 💰
```

## 🎯 Common Tasks

### View Logs
```bash
docker-compose logs -f
```

### Rebuild After Changes
```bash
docker-compose down
docker-compose up -d --build
```

### Stop the Site
```bash
docker-compose down
```

### Check Health
```bash
curl http://localhost:7070/health
# Should return: healthy
```

### Test All Versions
```bash
# English
curl http://localhost:7070/ | grep "Navigate Your IT"

# Russian
curl http://localhost:7070/index-ru.html | grep "Управляйте"

# Japanese (check for emojis!)
curl http://localhost:7070/index-ja.html | grep "✨"
```

## 📦 What's Included

### HTML Files
- `index.html` - English version
- `index-ru.html` - Russian version
- `index-ja.html` - Japanese kawaii version

### Styling & Scripts
- `style.css` - Shared responsive design
- `script.js` - Shared interactive features

### Docker Setup
- `Dockerfile` - Nginx container config
- `docker-compose.yml` - Easy orchestration
- `nginx.conf` - Optimized web server
- `.dockerignore` - Clean builds

### Documentation
- `README.md` - Main documentation
- `DOCKER_QUICKSTART.md` - Docker reference
- `LANGUAGES.md` - Translation guide
- `KAWAII_FEATURES.md` - Kawaii design guide
- `LANGUAGE_COMPARISON.md` - Side-by-side comparison
- `QUICK_START.md` - This file

## 🎓 Learn More

### Want to understand the kawaii approach?
→ Read **KAWAII_FEATURES.md**

### Adding a new language?
→ Follow **LANGUAGES.md**

### See all translations side-by-side?
→ Check **LANGUAGE_COMPARISON.md**

### Docker questions?
→ See **DOCKER_QUICKSTART.md**

### Everything else?
→ Read **README.md**

## 🌟 Key Features by Section

### Navigation
- Fixed header with mobile menu
- Language switcher
- Smooth scroll anchors

### Hero
- Eye-catching headline
- Dual CTA buttons
- Live statistics (10K+ assets, 99.9% uptime, 500+ customers)

### Features (6 cards)
- Datacenter Management
- Server & Host Tracking
- IP Address Management
- Operating System Catalog
- Team & Assignments
- RESTful API

### Benefits (4 items)
- Real-Time Visibility
- Save Time & Money
- Compliance Ready
- Scale Effortlessly

### Pricing (3 tiers)
- Starter: $49/mo ($39 annual)
- Professional: $149/mo ($119 annual) ⭐ Most Popular
- Enterprise: Custom pricing

### CTA
- Email capture form
- Validation included
- 14-day free trial offer

### Footer
- Product links
- Company information
- Support resources
- Legal links

## 💡 Pro Tips

1. **Mobile Testing**: Resize your browser or use dev tools
2. **Language Switching**: Click the flag icons in navigation
3. **Pricing Toggle**: Switch between monthly/annual to see savings
4. **Email Form**: Try it! It validates and shows notifications
5. **Smooth Scrolling**: Click nav links to jump to sections
6. **Animations**: Scroll down to see cards animate in

## 🚀 Deployment Options

Ready for production? Deploy to:

- **Netlify**: Drag & drop `promo/` folder
- **Vercel**: `vercel deploy`
- **AWS S3**: Static website hosting
- **GitHub Pages**: Push to gh-pages branch
- **Any Docker host**: Use your existing setup

## 🎯 Next Steps

1. ✅ Start the site: `docker-compose up -d`
2. ✅ Visit all three language versions
3. ✅ Test on mobile (responsive design)
4. ✅ Try the email form
5. ✅ Toggle pricing (monthly/annual)
6. ✅ Read the documentation you need
7. ✅ Customize for your needs
8. ✅ Deploy to production!

## 🌈 Fun Facts

- **Total Emojis**: 50+ in Japanese version only
- **Lines of Code**: ~430 HTML, ~500 CSS, ~150 JS per version
- **Docker Image Size**: ~23MB (tiny!)
- **Page Load Time**: <1 second
- **Languages**: 3 (easily expandable)
- **Love**: Made with 💖

---

**Questions?** Check the other documentation files or contact the development team!

**Ready to deploy?** See README.md for production deployment options.

**Want to contribute?** Add a new language using LANGUAGES.md as your guide!

🎉 **Happy coding!** 🎉


# 🌍 Multi-Language Support

Asset Compass promo site is available in multiple languages.

## Available Languages

### 🇬🇧 English (Default)
- **File**: `index.html`
- **URL**: `http://localhost:7070/` or `http://localhost:7070/index.html`

### 🇷🇺 Русский (Russian)
- **File**: `index-ru.html`
- **URL**: `http://localhost:7070/index-ru.html`

## Language Switcher

Both versions include a language switcher in the navigation menu:
- English version shows: **🇷🇺 RU** link to switch to Russian
- Russian version shows: **🇬🇧 EN** link to switch to English

## Translation Coverage

All content has been fully translated:

✅ **Navigation**
- Features / Возможности
- Benefits / Преимущества
- Pricing / Цены
- Get Demo / Получить демо

✅ **Hero Section**
- Main headline and tagline
- Call-to-action buttons
- Statistics labels

✅ **Features Section** (6 features)
- Datacenter Management / Управление дата-центрами
- Server & Host Tracking / Учёт серверов и хостов
- IP Address Management / Управление IP-адресами
- Operating System Catalog / Каталог операционных систем
- Team & Assignments / Команды и назначения
- RESTful API / RESTful API

✅ **Benefits Section** (4 benefits)
- Real-Time Visibility / Видимость в реальном времени
- Save Time & Money / Экономия времени и денег
- Compliance Ready / Готовность к соответствию
- Scale Effortlessly / Легкое масштабирование

✅ **Pricing Section** (3 tiers)
- Starter / Стартовый
- Professional / Профессиональный
- Enterprise / Корпоративный
- All feature lists and descriptions

✅ **CTA Section**
- Call-to-action text
- Form placeholder text
- Button labels

✅ **Footer**
- All links and sections
- Copyright notice
- Tagline

## Adding New Languages

To add a new language:

1. **Copy the English version**:
   ```bash
   cp index.html index-[language-code].html
   ```

2. **Update the `<html>` tag**:
   ```html
   <html lang="[language-code]">
   ```

3. **Translate all text content**:
   - Keep all HTML structure and classes unchanged
   - Only translate text between tags
   - Keep all SVG icons as is
   - Update meta description and title

4. **Add language switcher links**:
   ```html
   <!-- In English version -->
   <a href="index-[language-code].html" class="nav-link">🇫🇷 FR</a>
   
   <!-- In new language version -->
   <a href="index.html" class="nav-link">🇬🇧 EN</a>
   ```

5. **Update Dockerfile**:
   ```dockerfile
   COPY index-[language-code].html /usr/share/nginx/html/
   ```

6. **Update README.md** with the new language

7. **Rebuild Docker container**:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

## Language Code Examples

Common language codes for future additions:
- `index-de.html` - German (Deutsch) 🇩🇪
- `index-fr.html` - French (Français) 🇫🇷
- `index-es.html` - Spanish (Español) 🇪🇸
- `index-it.html` - Italian (Italiano) 🇮🇹
- `index-pt.html` - Portuguese (Português) 🇵🇹
- `index-zh.html` - Chinese (中文) 🇨🇳
- `index-ja.html` - Japanese (日本語) 🇯🇵
- `index-ko.html` - Korean (한국어) 🇰🇷

## SEO Considerations

For production deployment, consider:

1. **Add `hreflang` tags** to each page:
   ```html
   <link rel="alternate" hreflang="en" href="https://yoursite.com/" />
   <link rel="alternate" hreflang="ru" href="https://yoursite.com/index-ru.html" />
   ```

2. **Update meta descriptions** for each language

3. **Add language-specific Open Graph tags**:
   ```html
   <meta property="og:locale" content="ru_RU" />
   <meta property="og:locale:alternate" content="en_US" />
   ```

4. **Consider URL structure**:
   - Current: `/index-ru.html`
   - Alternative: `/ru/` with nginx rewrite rules
   - Alternative: Subdomain: `ru.yoursite.com`

## Testing

Test both versions:

```bash
# Start the site
docker-compose up -d

# Test English version
curl http://localhost:7070/ | grep -i "Navigate Your IT"

# Test Russian version
curl http://localhost:7070/index-ru.html | grep -i "Управляйте"

# Test in browser
open http://localhost:7070/         # English
open http://localhost:7070/index-ru.html  # Russian
```

## Shared Resources

The following files are shared across all languages:
- `style.css` - All styling
- `script.js` - All JavaScript functionality
- All SVG icons and graphics

This ensures:
- ✅ Consistent design across languages
- ✅ Smaller total file size
- ✅ Easier maintenance
- ✅ Single source of truth for functionality

## Notes

- **Prices remain in USD** - Consider adding currency conversion for international markets
- **Phone numbers and emails** - Update for regional support teams if available
- **Date formats** - JavaScript uses browser locale automatically
- **Number formatting** - Consider localizing numbers (1,000 vs 1.000 vs 1 000)

---

For questions about translations or to report translation issues, contact the development team.


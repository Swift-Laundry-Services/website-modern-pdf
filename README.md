# Swift Laundry Services: website (version 3, modernized PDF design)

> **Version 3 of 3.** This repo is the owner's PDF design, modernized: same content, section order, colours and photos, with
> refined typography, soft animated background blobs, glass cards, Lucide icons, smooth scrolling, AI-upscaled imagery and an
> app-style mobile layout (bottom tab bar, installable PWA). Live at **https://swift-laundry-services.github.io/website-modern-pdf/**.
> The other two versions are kept separately:
> 1. Modern design: [Swift-Laundry-Services/website](https://github.com/Swift-Laundry-Services/website), live at https://swift-laundry-services.github.io/website/
> 2. PDF design (faithful to the owner's PDF): [Swift-Laundry-Services/website-pdf](https://github.com/Swift-Laundry-Services/website-pdf), live at https://swift-laundry-services.github.io/website-pdf/

Marketing website for **Swift Laundry Services**, a mobile laundry pickup and delivery service for Garfield Heights and the Cleveland suburbs.

- **Stack:** static HTML, modern CSS and vanilla JavaScript. No framework and no build step. [Lenis](https://github.com/darkroomengineering/lenis) (MIT) is self-hosted in `assets/vendor/` for smooth scrolling; [Lucide](https://lucide.dev) icons (ISC) are inlined as SVG.
- **Hosting:** GitHub Pages via GitHub Actions (`.github/workflows/pages.yml`). Every push to `main` deploys to
  **https://swift-laundry-services.github.io/website-modern-pdf/**. You can also deploy by hand from the Actions tab ("Run workflow").
- All asset and page links are **relative**, so the same files work under the `/website-modern-pdf/` project path and at a domain root
  (for example `swiftlaundryservices.com`). No custom domain or `CNAME` is configured yet.

## Structure

```
index.html            Home (hero, how it works, services, why us, wash & fold prices, review, FAQ)
about.html            About us, areas we serve
services.html         Services, wash & fold / dry cleaning / ironing prices, industries we serve
why-choose-us.html    Why choose us
contact.html          Contact details, service-area map, contact / free-quote form
order.html            "Order a pickup" form
login.html            Login / create account (placeholder: accounts are "coming soon")
404.html              Not-found page (works at any URL depth on GitHub Pages)
site.webmanifest      PWA manifest (installable to the home screen, with shortcuts)
sw.js                 Small network-first service worker (offline fallback)
robots.txt, sitemap.xml
favicon.ico
assets/
  css/styles.css      All styles (design tokens / brand colours at the top)
  js/site-config.js   <- business details, prices, form targets: EDIT HERE
  js/main.js          Behaviour (menu sheet, testimonials carousel, forms, price tables, smooth scroll, reveal animations)
  vendor/             lenis.min.js (smooth scrolling) + licences for Lenis and Lucide
  fonts/              Self-hosted Montserrat (variable, latin), SIL OFL
  img/                Logos, icons, Open Graph image
  img/design/         Images from the owner's design PDF, AI-upscaled (AVIF + WebP sizes + JPG/PNG fallback)
  img/design/icons/   SVG icons (PDF vectors + Font Awesome brand icons)
.github/workflows/pages.yml   GitHub Pages deployment
```

The header and footer are repeated in each HTML page. If you change a nav link, update it in every page.

## Run locally

Any static file server works. From the repo folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

(Opening the files directly with `file://` mostly works too, but a server is closer to production.)

## Where to edit things

All of these are in **`assets/js/site-config.js`**. Search it for `TODO`.

| What | Where in `site-config.js` |
| --- | --- |
| Phone number | `business.phoneDisplay` and `business.phoneE164` (also typed into the HTML as a no-JS fallback, so search and replace `(714) 402-7530` / `+17144027530` if it ever changes) |
| Email address | `business.email` (email links stay hidden while it's empty) |
| Street address | `business.address` (hidden while empty) |
| Hours | `business.hours` (optional) |
| Social links | `social.instagram`, `social.facebook` (icons appear on the Contact page and footer once set) |
| Testimonials | `testimonials` (one real review + clearly labelled sample placeholders; replace samples with real reviews) |
| Wash & fold prices | `pricing.washFold`, `pricing.extraPerLb` |
| Dry cleaning prices | `pricing.dryCleaning` |
| Ironing prices | `pricing.ironing` |
| Where forms send data | `forms.endpoint` or `forms.email` (see below) |
| Contact-page map | `map.embedUrl`, `map.linkUrl`, `map.caption` (see below) |

**Price confirmation:** each price has `confirmed: true/false`. While any price in a table is `false`, the site shows a small
"prices are being finalized, call to confirm" note under that table. Set each one to `true` once it's checked.

Prices mentioned elsewhere (hero "from $41.99", FAQ, Order page sidebar) are filled in from the same config when the page loads.
The numbers typed into the HTML are only a fallback for visitors without JavaScript.

### Forms (Order a pickup, Contact / Free quote, Login)

There is **no backend** yet. The forms validate input in the browser and then do one of the following, depending on `forms` in `site-config.js`:

1. **`forms.endpoint` set** (for example a Formspree or Basin form URL): the form is POSTed there and a thank-you message is shown.
2. **`forms.email` set** (and no endpoint): the visitor's email app opens with the request filled in.
3. **Neither set** (the current state): nothing is sent. The visitor sees an "online booking is almost ready" panel with a
   **Text my request** button (an SMS to the business number with the details filled in) and a **Call** button.

The **Login / Create account** page is a placeholder. Submitting shows "Customer accounts are coming soon".

### Service-area map (Contact page)

The Contact page shows a keyless Google Maps embed centred on Garfield Heights, OH (no public street address yet).
Change `map.embedUrl` in `site-config.js` (e.g. `https://maps.google.com/maps?q=123+Main+St,+Garfield+Heights,+OH&z=15&output=embed`)
and `map.linkUrl` once there is an address. No API key needed.

### Logo, email and social links

- `brand.logo`: path to a new logo image (e.g. `assets/img/logo-new.png`). Empty = current logo.
- `contact.email`: shown on the Contact page; empty shows "Coming soon".
- `social.instagram` / `social.facebook`: full profile URLs. Icons stay hidden until set. X/Twitter is intentionally not shown.

### Images

All photos come from the owner's design PDF. For this version each one was re-extracted from the PDF at its native resolution,
cropped exactly as in the design, upscaled 4x with **Real-ESRGAN** (AI super-resolution), then lightly sharpened and colour-polished.
They live in `assets/img/design/` as `NAME-WIDTH.avif` and `NAME-WIDTH.webp` (full-width photos up to 3840 px, card photos up to
2400 px) with a `NAME-1600.jpg` fallback; the transparent bag/duvet images are `.webp` + `.png`. Pages use `srcset`/`sizes`, so
phones download small files and only large or high-density screens get the big ones. Everything below the hero is lazy-loaded.
To replace a photo, export files with the same names and widths and update the `alt` text if the subject changes.

### Switching to the custom domain later

When `swiftlaundryservices.com` is pointed at GitHub Pages:

1. Add the domain in **Settings → Pages** (this creates the `CNAME`) and update DNS.
2. Search and replace `https://swift-laundry-services.github.io/website-modern-pdf/` with `https://swiftlaundryservices.com/` in the HTML files,
   `robots.txt` and `sitemap.xml` (canonical, Open Graph and JSON-LD URLs).
3. Nothing else needs to change, because paths are relative. `404.html` detects whether it's under `/website-modern-pdf/` automatically.

## Brand

| Token | Hex | Source |
| --- | --- | --- |
| Brand purple | `#3E157B` | Logo artwork (vector, from the design PDF) |
| Deep purple | `#322054` | Current coming-soon page / stacked logo background |
| Brand cyan | `#00B2E8` | Logo artwork (vector) |
| White | `#FFFFFF` | Logo |
| Ink (darkest purple, text) | `#1C1233` | Derived |
| Accessible cyan for text on white | `#0077A8` | Derived (5:1 contrast) |
| Light blue | `#8FDDF6` | Derived |
| Tints | `#EEE9F7`, `#F7F5FB`, `#DDF5FD`, `#F0FAFE` | Derived |

Fonts: **Montserrat** (weights 500–800), self-hosted, as in the design PDF.

### Logo files (`assets/img/`)

- `logo.svg` / `logo.png`: full-colour horizontal logo for light backgrounds. Vector, rebuilt from the original Illustrator artwork in the design PDF.
- `logo-white.svg` / `logo-white.png`: white + blue version for dark backgrounds, transparent background.
- `logo-mark.svg`, `logo-mark-white.svg`: icon only (washing machine, basket, suds).
- `favicon.svg`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`: app icons.
- `og-image.png`: 1200×630 social sharing image.

## Image credits

Photos and icons are taken from the owner-supplied design PDF (Swift Laundry Services). Confirm the owner holds the rights
to the stock photos used in that PDF.
UI icons: [Lucide](https://lucide.dev), ISC licence (see `assets/vendor/LICENSE-lucide.txt`).
Social icons: [Font Awesome Free](https://fontawesome.com/license/free) brand icons, CC BY 4.0.
Map: © Google (embedded map).
Fonts: [Montserrat](https://github.com/JulietaUla/Montserrat), SIL Open Font License 1.1 (see `assets/fonts/`).

## Owner TODO

1. Confirm all prices (Wash & Fold, Dry Cleaning, Ironing, duvet price): marked "to be confirmed" on the site.
2. Supply real "About us" / "What do we offer?" copy (design PDF used lorem ipsum; placeholder copy is ours).
3. Text for the 3rd "Why choose" item (PDF repeats "Save Time").
4. FAQ answers, and the "Limitations" sub-items (size, weight, unsanitary laundry) wording.
5. Confirm or remove the extra services ("More ways we can help": commercial, Airbnb/rental linens, event linens,
   delicates, sports uniforms, alterations) and the 7 extra industries behind "View all industries", and give their prices.
6. Real customer reviews to replace the "Sample review" placeholders in `testimonials` (only one review is real).
7. New logo file → `brand.logo`; email → `contact.email`; Instagram/Facebook URLs → `social`.
8. Street address (for the Contact card and map), if you want one public.
9. Confirm rights to the stock photos inside the design PDF.
10. Custom domain: not configured on purpose; decide before pointing swiftlaundryservices.com here.

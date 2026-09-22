# Wedding Invitation — Ahmad & Aisyah

A premium, single-page wedding invitation built with plain HTML5, CSS3, and
vanilla JavaScript (ES6+). No build step, no frameworks — open `index.html`
directly or serve it with VS Code Live Server.

## Project structure

```
wedding-invitation/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/
    │   ├── hero.webp
    │   ├── groom.webp
    │   ├── bride.webp
    │   ├── gallery-01.webp … gallery-06.webp
    └── music/
        └── wedding.mp3
```

The `assets/images` and `assets/music` folders are currently empty —
drop your own files in using the exact names above and everything will
pick them up automatically. Until then, the layout shows an elegant warm
gradient placeholder instead of a broken image icon, so the site still
looks intentional and works end to end.

## 1. Customization guide

Almost everything lives in **one place**: the `weddingData` object at the
top of `script.js`.

| What to change | Where |
|---|---|
| Nama pengantin, Instagram, nama orang tua | `weddingData.groom` / `weddingData.bride` in `script.js` — also update the matching text in the `<section class="couple">` block of `index.html` |
| Tanggal & waktu pernikahan (countdown) | `weddingData.weddingDate` in `script.js` |
| Waktu & lokasi Akad / Resepsi | `weddingData.akad` / `weddingData.reception` in `script.js`, and the matching text inside `<section class="event">` in `index.html` |
| Link Google Maps | `mapsUrl` inside `weddingData.akad` / `weddingData.reception` |
| Nomor rekening | `weddingData.bankAccounts` in `script.js`, and the visible numbers inside `<section class="gift">` in `index.html` |
| Alamat pengiriman kado | `.gift__address` paragraph in `index.html` |
| Foto (hero, groom, bride, gallery) | Replace files inside `assets/images/` using the same filenames, or update the `src` attributes in `index.html` |
| Musik latar | Add `assets/music/wedding.mp3` (any filename works if you update the `<source>` tag in `index.html`) |
| Ayat / quote | `.verse__text` and `.verse__source` in `index.html` |
| Warna (palette) | CSS custom properties at the top of `style.css` (`--bg`, `--accent`, `--text`, etc.) |
| Font | Google Fonts `<link>` in `index.html` `<head>` + `--font-display` / `--font-body` in `style.css` |
| RSVP endpoint | `weddingData.rsvpEndpoint` in `script.js` — set it to a Google Apps Script / Firebase / Supabase / REST URL. `submitRSVP()` already sends a `POST` with `{ name, attendance, guests, message, submittedAt }` as JSON; until you set an endpoint, it simulates a successful response so the form is fully testable. |
| Nama tamu default (jika `?to=` kosong) | `getGuestName()` in `script.js` (`'Tamu Undangan'`) |

**Guest name via URL:** share links like
`https://yourdomain.com/?to=Ismail%20ibn%20Wasil` — the name is decoded
automatically by `URLSearchParams` and inserted with `textContent` only
(never `innerHTML`), so it's safe from injected markup.

## 2. Test checklist

**Layout / responsiveness**
- [ ] 320px, 360px, 375px, 390px, 414px, 430px — no horizontal scrollbar, no overlapping text
- [ ] 768px (tablet) — two-column sections adapt correctly
- [ ] 1024px, 1280px, 1440px, 1920px, ultrawide — content stays centered, doesn't stretch awkwardly

**Core behavior**
- [ ] Opening screen locks scroll (`body.lock`) until "Buka Undangan" is tapped
- [ ] Scroll unlocks smoothly after opening, with a soft blur/fade transition
- [ ] `?to=Nama%20Tamu` renders the decoded name in both the opening screen and hero
- [ ] No `?to=` param falls back to "Tamu Undangan"
- [ ] Countdown updates every second and never shows negative numbers
- [ ] Countdown switches to "Our Wedding Day Has Arrived" after the target date

**Gallery & lightbox**
- [ ] Gallery grid shows varied, asymmetrical image sizes (not a plain 3×3 grid)
- [ ] Clicking a photo opens the custom lightbox
- [ ] Lightbox supports next / previous / close buttons, `Esc`, and arrow-key navigation
- [ ] Images use `loading="lazy"` and `aspect-ratio` so there's no layout shift

**Gift & RSVP**
- [ ] "Salin Nomor Rekening" copies the correct number and shows "Berhasil Disalin ✓" temporarily
- [ ] Accordion opens/closes smoothly and only one interaction is needed per item
- [ ] RSVP form blocks submission without a name or an attendance choice, showing inline errors
- [ ] Submitting a valid RSVP shows the loading state, then the thank-you message, without reloading the page

**Music**
- [ ] Music does not autoplay before "Buka Undangan" is clicked
- [ ] Music starts (if the browser allows it) right after opening, and the floating button toggles play/pause
- [ ] If `wedding.mp3` is missing, the site still works and the music button hides itself gracefully

**Accessibility & performance**
- [ ] Keyboard-only navigation reaches every interactive element with a visible focus ring
- [ ] `prefers-reduced-motion: reduce` disables scroll-reveal animation and instant-shows content
- [ ] All images have descriptive `alt` text; form fields have associated `<label>`s
- [ ] No console errors on load, scroll, lightbox open/close, or RSVP submit

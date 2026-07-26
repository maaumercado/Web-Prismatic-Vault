# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static, no-build marketing/informational website for **Prismatic Vault**, a 100% Mexican Pokémon TCG (cards and sealed product) retailer. Plain HTML5 + CSS3 + vanilla JS — no npm, no framework, no bundler, no backend, no database. The site is intentionally temporary/informational: it does not sell online yet, so every CTA points to WhatsApp (`https://wa.me/524494250223`) or social (Instagram, Facebook, TikTok). **Do not add Whatnot** as a channel — it was explicitly excluded by the client.

## Commands

- **Local preview**: `python3 -m http.server <port> --bind 127.0.0.1` from the project root, then open `http://127.0.0.1:<port>/index.html`. There is no build, lint, bundle, or test step — the browser reads the files as-is.
- **Deploy**: `git push origin main`. The live host (Hostinger) has Git integration configured to auto-deploy on push to `main` — no manual deploy/FTP step. Live domain: `prismaticvaulttcg.com`.

## Critical: cache-busting on every CSS/JS edit

Hostinger serves `css/style.css` and `js/main.js` with `Cache-Control: public, max-age=604800` (7 days). **Whenever either file changes, bump the `?v=` query string on every reference, in all four HTML files** (index.html, productos.html, expansiones.html, guia-tcg.html) — e.g. `css/style.css?v=20260724c` → `...d`. Skipping this means returning visitors silently keep the stale file for up to a week no matter what's pushed to GitHub. This has already caused one real "the fix isn't showing up" incident — don't skip it.

## Architecture

- **4 static pages, no templating**: `index.html` (Inicio), `productos.html`, `expansiones.html`, `guia-tcg.html`. Header/nav/footer/floating-WhatsApp-button markup is duplicated verbatim in each file — there is no include/partial mechanism, so any structural header or footer change has to be repeated by hand across all four files.
- **One shared stylesheet** (`css/style.css`, ~1200 lines), organized in labeled `/* ---- */` sections: Buttons, Header, Hero, Cards grid, Productos tiles, Callout, Social band, Footer, Floating WhatsApp, Page header, Rarity guide, Quiénes somos/historia editorial, Expansiones. Brand tokens (colors, gradients, fonts, radii) are CSS custom properties on `:root` — edit the palette there, not per-component.
- **One shared script** (`js/main.js`, vanilla JS, no dependencies): mobile hamburger menu, the Inicio hero carousel (`[data-hero-carousel]` + `data-hero-arrow` buttons + `.hero-dots`), and the Expansiones "cartas más importantes" horizontal-scroll carousel (`data-cards-arrow` / `data-cards-target`).
- Fonts (Rajdhani for headings, Inter for body) load from Google Fonts via `<link>` in every page's `<head>` — not self-hosted.

## Hero carousel — why slides use opacity, not display:none

`.hero-slide` is `position:absolute` with `opacity:0`/`1` toggling (`js/main.js` just adds/removes `.is-active`; `.hero` itself carries `aspect-ratio: 2000/900` so it reserves height without the slides being in normal flow). This is deliberate: several mobile browsers (notably iOS Safari) do not reliably fetch `<img>` resources nested inside a `display:none` ancestor, which previously caused banners 2–8 to silently never load on phones while the arrows appeared to do nothing. Don't "simplify" this back to `display:none`.

## Design language

- Palette (see `:root`): violet `#7B2FF7`, cyan `#00E5FF`, magenta `#FF2E9F`, gold `#FFD23F`, navy `#0B0B1A` / `#12122A`. `--gradient-brand` (violet→cyan→magenta) is the signature accent — used on CTAs, the Expansiones wordmark, and as the tile background behind product/category photography.
- Photo tiles (`.card-thumb` in Qué Encontrarás, `.prod-tile-icon` in Productos) intentionally use `var(--gradient-brand)` as their background, **not white** — a white tile background was explicitly rejected mid-project for breaking the dark aesthetic. Any new photo tile should follow the same gradient-background pattern.
- The "Quiénes somos" section on `index.html` is long-form editorial brand-story copy ("Nuestra historia" + "Nuestra Promesa"), not the short card-grid style used elsewhere on the page. It has its own classes for narrative rhythm: `.story` (container), `.story-lede` (opening hook line), `.story-beat` (short standalone dramatic line, centered/colored), `.story-list` (stacked short-line groups), `.story-quote` (pull-quote), `.promise-card` (bordered card for the promise section). Keep using these if that copy is edited, rather than flattening it into plain `<p>` tags.

## Guardián Prismático (mascota de marca)

- **Qué es:** el personaje-mascota oficial de Prismatic Vault — una criatura tipo lobo/zorro hecha de cristal prismático (facetas violeta/cian/magenta con detalles dorados), ojos brillantes y una cola tipo listón de energía. Tagline: *"Protector de las cartas. Guardián de la colección."* Nace de la energía prismática y custodia las cartas más valiosas de la bóveda; su misión es proteger, inspirar y guiar a los coleccionistas.
- **Pilares/lema:** Protege · Valora · Inspira · Conecta.
- **Simbolismo (de la hoja de referencia):** Cristal Prismático = las cartas, su rareza y valor único. Bóveda = seguridad, confianza y autenticidad. Energía = la fuerza que conecta a la comunidad de coleccionistas. Guardián = liderazgo, protección e inspiración.
- **Referencia visual:** hoja de marca completa en `../Prismatic Vault Marca/Guardian Prismatico/Guardian Prismatico.png` (fuera de este repo, ver convención de "Raw/unprocessed design source files" abajo). Incluye turnarounds (frente, 3/4, perfil, espalda), versión de ícono/avatar circular simplificado, y mockups de aplicación (empaque, cartas, moneda/medallón, mousepad).
- **Colores al implementarlo:** la hoja de referencia trae su propio muestrario (tonos cercanos a azul/violeta/magenta/dorado) pero **no son pixel-exactos a los tokens reales**. Cualquier uso del Guardián en HTML/CSS (íconos, glow, ilustraciones) debe mapearse a los tokens verdaderos de `:root` — `--violet` #7B2FF7, `--cyan` #00E5FF, `--magenta` #FF2E9F, `--gold` #FFD23F — nunca a los valores de la hoja de concepto directamente, para no repetir el mismo problema de deriva de marca que tuvo el Documento 5 de la Academia.
- **Estado actual:** ya está en vivo — es el banner 8 del carrusel de Inicio (`assets/banners/08-el-guardian-prismatico.jpg`, 2000×900), con el mismo tratamiento visual que la hoja de referencia. También surge como hilo narrativo dentro del proyecto de planeación "Prismatic Vault Academy" (`../Prismatic Vault Academy/`) para la Guía TCG/Academia. Es un activo de marca establecido (igual que el logo): se puede referenciar como "el Guardián Prismático" sin volver a explicar qué es, y reutilizar ese mismo banner (o nuevas piezas con el mismo estilo) en futuras secciones que lo necesiten.

## Assets

- `assets/brand/` — logo, icon, banner (source of truth for favicon and header logo).
- `assets/banners/01-...jpg` … `08-...jpg` — Inicio hero carousel, in display order, all on the same 2000×900 canvas. New/replacement banners must match that ratio or the carousel's `aspect-ratio` box will crop or letterbox them.
- `assets/encontraras/` — the 4 "Qué Encontrarás" card images.
- `assets/productos/` — the 10 Productos category photos; resized to a max 600px edge and re-exported as WebP specifically to control page weight (original sources were up to 1.2MB each at 3000px+). Don't drop full-resolution files back in here without re-optimizing.
- Most product/category photos are transparent-background cutouts (verify with e.g. PIL/`im.convert('RGBA')` corner-pixel alpha before deciding on treatment) — they're designed to sit on the `--gradient-brand` tile background, not a white/neutral one.
- Raw/unprocessed design source files (full-resolution banners, brand bible, pre-crop product photography) live **outside this repo**, in the sibling folder `../Prismatic Vault Marca/` (subfolders: Banners, Que Encontraras, Productos, Logos, Imagenes, Biblia de la Marca, Guardian Prismatico). When the user says new images are "ready," look there first.

## Git remote

`origin` is `https://github.com/maaumercado/Web-Prismatic-Vault.git`, branch `main`. Note this project folder is nested inside a much larger, unrelated folder tree (`~/Desktop/Claude Code/`) that is itself a *different*, unrelated git repository. Always run `git remote -v` / `git status` from inside this exact project folder before committing — commands here are scoped to this nested repo, not the parent one.

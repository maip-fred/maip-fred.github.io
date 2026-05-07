# maip-fred.github.io

Portfolio personal interactivo de **Alfredo Ibáñez Vargas** — estudiante de Ciencia de Datos y Matemáticas Aplicadas en ITAM, 8° semestre, CDMX.

**URL pública:** [https://maip-fred.github.io/](https://maip-fred.github.io/)

---

## Qué es esto

Un CV personal estático construido completamente en HTML5 + CSS3 + JavaScript vanilla. Sin frameworks de frontend, sin paso de build, sin npm. Cada página es un archivo `.html` autocontenido que carga CSS y JS por CDN o desde el propio repo.

La entrada al sitio es una galaxia 3D interactiva (Three.js) donde una nave espacial piloteable conecta con las distintas secciones del portfolio. Navegar el sitio es literalmente navegar el espacio.

---

## Stack tecnológico

### Core
| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura de todas las páginas |
| CSS3 custom properties | Sistema de diseño propio (tokens, tema claro/oscuro) |
| JavaScript ES6+ vanilla | Toda la interactividad — sin React, sin Vue, sin nada |
| [Three.js 0.155](https://threejs.org/) | Galaxia 3D, satélites orbitales, nave espacial piloteable |
| [AOS 2.3.4](https://michalsnik.github.io/aos/) | Animaciones al hacer scroll |
| [Lucide Icons](https://lucide.dev/) | Iconografía SVG |
| [Google Fonts](https://fonts.google.com/) | Cormorant Garamond (display) · DM Sans (body) · JetBrains Mono (mono) |
| [Devicons CDN](https://devicon.dev/) | Logos de tecnologías en las barras de skills |
| [Leaflet 1.9.4](https://leafletjs.com/) | Mapa choropleth interactivo de México (dataviz.html) |
| [D3.js v7](https://d3js.org/) | Red social force-directed de 130 nodos (dataviz.html) |
| [TailwindCSS](https://tailwindcss.com/) | Utilidades de layout via CDN (clases puntuales) |

### Infraestructura
| Tecnología | Uso |
|---|---|
| GitHub Pages | Hosting estático gratuito — rama `main` → deploy automático |
| Service Worker (Cache-first) | PWA offline-ready, `sw.js` en la raíz |
| Web Manifest | `assets/manifest.json` — instalable como app |
| [Formspree](https://formspree.io/) | Backend del formulario de contacto (pendiente ID) |
| View Transition API | Transiciones fluidas entre páginas (Chrome 111+, con fallback) |

---

## Por qué vanilla JS y sin build step

**Decisión consciente.** El sitio es un portfolio personal, no una aplicación. Las restricciones son:

- **Sin Node / npm** — cualquiera puede clonar y abrir `index.html` sin instalar nada.
- **HTTP/2 + cache compartido** — los 15 archivos CSS se cargan en paralelo y se cachean entre páginas; no hay penalización de performance por no tener bundle.
- **Mantenibilidad real** — cada módulo JS es un IIFE o `DOMContentLoaded` de propósito único. Fácil de leer, fácil de tocar.
- **Control total del DOM** — Three.js, Canvas 2D, Web Audio API, View Transition API — nada de esto se lleva bien con los abstractions de los frameworks modernos.

---

## Arquitectura de páginas

```
maip-fred.github.io/
├── galaxy.html         Entrada principal — galaxia 3D Three.js (siempre carga primero)
├── index.html          Home — hero, terminal interactiva, portal 2 columnas, globo 3D
├── about.html          Bio extendida, trayectoria, stack personal, now-section
├── skills.html         Radar SVG, barras de skills con devicons, 8 grupos de stack
├── projects.html       pkgxray featured, DataViz card, flip cards 3D, otros proyectos
├── dataviz.html        Mapa Leaflet México + red D3 force-directed + Shiny cards
├── contact.html        Formulario Formspree + panel sticky con socials
├── universo.html       Libros bento, podcasts, hobbies con fotos reales
├── build.html          Timeline técnico del proceso de construcción del sitio
├── retos.html          Desafíos matemáticos y CTF
├── finanzas.html       Análisis financiero (finanzas_gen)
├── pkgxray.html        Case study 01 — scanner Python AST, métricas PyPI en vivo
├── planck.html         Case study 02 — sistema visual corporativo (NDA parcial)
├── mascotas.html       Galería fotográfica de mascotas
├── 404.html            Glitch RGB + traceback Python falso
└── sw.js               Service Worker cache-first (versión aiv-v11)
```

---

## La galaxia — cómo funciona

### Flujo de navegación
```
localhost/ (o maip-fred.github.io/)
    ↓  index.html detecta que no viene de galaxy.html
    ↓  location.replace('galaxy.html')
galaxy.html
    ↓  Three.js renderiza satélites orbitales
    ├─ "ENTRAR AL SITIO →"  →  index.html?from=galaxy  (sin galaxia)
    ├─ Click en satélite    →  warp loader 7s  →  página destino
    └─ Nave choca satélite  →  trivia  →  correcto: warp  /  incorrecto: rebote
```

### Por qué `galaxy.html` es una página separada
Originalmente la galaxia vivía como overlay dentro de `index.html`. Esto causaba bugs de navegación en cadena: el botón "Inicio" cargaba `index.html` que volvía a mostrar la galaxia, que al cerrarse navegaba a `about.html`, etc. Mover la galaxia a su propia página rompió el ciclo — `index.html` es ahora un homepage limpio que solo redirige si el visitante no viene de la galaxia.

### Satélites y órbitas
Cada página del sitio es un satélite con órbita elíptica propia (`a`, `b`, inclinación, fase, velocidad). El nodo central `AIV` es el planeta principal. Los parámetros de órbita están en el array `NODES` de `js/galaxy.js`.

### Sistema de trivia
La trivia **solo** se activa cuando la nave espacial (controlada con `←→↑↓` o `WASD`) colisiona físicamente con un satélite en pantalla (radio de colisión: 90px en coordenadas de pantalla proyectadas). Un click directo en un satélite hace warp inmediato sin trivia. Pool de 12 preguntas de data science / matemáticas aleatorias.

### Cooldown de colisión
Al cargar `galaxy.html`, `collCd` empieza en `3.0` segundos — la nave tiene 3 segundos de inmunidad para evitar que una colisión accidental dispare trivia antes de que el usuario tome el control.

---

## Sistema CSS

### Arquitectura de 15 archivos
Todos los HTML cargan los mismos archivos en este orden (HTTP/2 los sirve en paralelo):

```
animations.css  →  keyframes, AOS, glitch, grain, mesh
tokens.css      →  design tokens (:root variables)
base.css        →  reset, nav, header, footer, botones
components.css  →  terminal, loader, cmdk, cards, media queries
effects.css     →  grain overlay, mesh blobs, cursor, matrix rain
hero.css        →  hero section, identity board
about.css       →  bio split, git-log, stack, trayectoria
skills.css      →  radar chart, barras, req-panel
projects.css    →  flip cards 3D, pkgxray, build page
contact.css     →  formulario, panel sticky
journey.css     →  journey section, universo CTA
theme.css       →  overrides tema claro con !important
```

`dataviz.html` carga adicionalmente: Leaflet CSS en `<head>`, Leaflet JS y D3 como scripts normales (sin `defer`) justo antes del script inline de la página.

### Tema claro por defecto
El sitio usa tema claro (`body { background: #F9F8F6 }`). Solo permanecen oscuros: `.hero`, `.site-footer`, `#loader`, `#mobile-menu`, y `galaxy.html` (que es 100% oscuro). Los overrides viven en `theme.css` con `!important` para ganar la cascada.

### Design tokens principales (`tokens.css`)
```css
/* Fondos */
--bg-0: #09090B;          --bg-cream: #F0EBE1;

/* Texto */
--lt-1: #1A1914;          --t-1: #EDEAE4;

/* Acentos */
--blue: #2563EB;          --blue-l: #3B82F6;
--cyan: #22D3EE;          --green: #4ADE80;
--purple: #A78BFA;        --yellow: #FCD34D;
--olive: #6B8C52;         --gold: #B8892A;

/* Tipografía */
--f-display: 'Cormorant Garamond';
--f-sans: 'DM Sans';
--f-mono: 'JetBrains Mono';
```

---

## Módulos JavaScript

### Universales — cargados en todos los HTML
| Módulo | Función |
|---|---|
| `core.js` | AOS init, Lucide icons, scroll bar, header scrolled, nav active, hamburger, page transitions (View Transition API + fallback 380ms), skill bars IntersectionObserver, typewriter engine (`window.runTypewriter`), stat counters animados, SW registration, botón satélite "volver a galaxia" |
| `sound.js` | Web Audio API opt-in. Toggle en footer. `snd.play('click'/'type'/'open'/'boot')`. Persistencia en `localStorage` |
| `cmdk.js` | Command palette `Ctrl/Cmd+K`. Fuzzy search sobre 16 items de navegación |
| `chatbot.js` | Asistente de navegación local (sin API externa). Responde a keywords. Chips: Mapa · Proyectos · DataViz · Finanzas · Mi universo · Atajos |
| `easter-egg.js` | Konami code `↑↑↓↓←→←→BA` → overlay terminal |
| `cursor.js` | Canvas trail de partículas, reticle contextual con etiquetas según elemento hover |
| `dock.js` | Floating pill nav `#floating-dock`. Aparece tras 100px de scroll |
| `magnetic.js` | Efecto magnético en botones `.btn-magnetic` (radio 90px, fuerza 0.38) |
| `scramble.js` | Efecto texto Mr-Robot en `[data-scramble]` al entrar al viewport |
| `matrix.js` | Digital rain katakana+latín. Activado desde `easter-egg.js` |

### Específicos por página
| Módulo | Página | Función |
|---|---|---|
| `galaxy.js` | `galaxy.html` | Three.js completo: escena, cámara, satélites, órbitas elípticas, nave espacial, sistema de trivia, warp loader, detección de colisión, dismissGalaxy |
| `loader.js` | `index.html` | Boot sequence systemd-style, una vez por sesión (`sessionStorage`) |
| `particles.js` | `index.html` | Canvas `#hero-canvas`, partículas reactivas al mouse que forman palabras según hora del día |
| `terminal.js` | `index.html` | Terminal interactiva con 16 comandos, historial `↑↓`, tab-autocomplete |
| `radar.js` | `skills.html` | SVG radar chart animado con IntersectionObserver. 5 ejes: Data Science, DataViz & Geo, Security, Frontend, DevOps |
| `pkgxray-demo.js` | `projects.html` | Demo en vivo: fetch a `pypi.org/pypi/{pkg}/json` |
| `contact.js` | `contact.html` | Validación del formulario estilo terminal, submit a Formspree |
| `pypi-metrics.js` | `pkgxray.html` | Fetch `pypi.org/pypi/pkgxray/json` → métricas en vivo (descargas, versión, fecha) |
| `finanzas-demo.js` | `finanzas.html` | Calculadora de análisis financiero interactiva |

---

## Features implementadas

- **Galaxia 3D navegable** — Three.js con satélites orbitales, nave piloteable, warp loader de 7s
- **Sistema de trivia** — acceso a páginas mediante preguntas de data science al colisionar con satélites
- **Terminal interactiva** — 16 comandos (`help`, `cat about`, `ls projects`, `ssh`, `ping`, etc.), historial, tab-complete
- **Boot sequence** — loader systemd-style al primera carga de sesión
- **Command palette** — `⌘/Ctrl+K` con fuzzy search sobre todo el sitio
- **Partículas reactivas** — canvas en el hero que forma palabras según la hora (mañana/tarde/noche)
- **Radar chart SVG** — animado con IntersectionObserver, 5 ejes de habilidades
- **Barras de skills** — devicons CDN, animación slide al entrar al viewport
- **Mapa choropleth** — Leaflet + GeoJSON, 32 estados de México con datos Censo INEGI 2020
- **Red social D3** — 130 nodos, 6 comunidades, física interactiva, drag + hover tooltips
- **Flip cards 3D** — proyectos con perspectiva CSS 3D
- **Globo 3D** — Canvas 2D con perspectiva manual, 9 anillos + 12 meridianos, tilt 27°
- **Cursor reticle** — 8 etiquetas contextuales (LINK / CODE / IMG / etc.)
- **Floating dock** — pill nav que aparece al hacer scroll
- **Efecto magnético** — botones que atraen el cursor (Web API de eventos de mouse)
- **Scramble text** — reveal tipo Mr-Robot al entrar al viewport
- **Sound design** — Web Audio API opt-in, sintetizador de clicks/teclado/warp
- **Easter eggs** — Konami code (overlay terminal), devtools greeting con ASCII art
- **PWA** — manifest + Service Worker cache-first, instalable como app
- **View Transition API** — transiciones de página nativas (Chrome 111+) con fallback
- **Métricas PyPI en vivo** — fetch a la API de PyPI para pkgxray
- **Formulario de contacto** — validación visual terminal-style + Formspree

---

## Estructura de estilos del portfolio (skills.html)

Las 8 tablas de stack están organizadas en **3 columnas independientes** (cada una es un `flex-direction:column`), evitando el problema clásico del CSS Grid donde una tabla más alta "estira" toda la fila:

```
Columna 1               Columna 2               Columna 3
──────────────────      ──────────────────      ──────────────────
Lenguajes (4)           Web & Frontend (7)      DevOps & BD (3)
Data Science (4)        Testing & QA (2)        Otros (3)
Visualización (4)       Geo & Redes (4)
```

---

## Service Worker

`sw.js` implementa **cache-first** para todos los assets estáticos. Versión actual: `aiv-v11`. Al modificar JS o CSS, incrementar la versión para que los navegadores descarten el cache anterior.

Assets en cache: todas las páginas HTML, los 15 CSS, los 20 JS, favicon, manifest.

---

## Correr localmente

```bash
# Clonar
git clone https://github.com/maip-fred/maip-fred.github.io.git
cd maip-fred.github.io

# Opción 1 — VS Code Live Server (recomendado)
# Clic derecho en index.html → "Open with Live Server"
# URL: http://localhost:5500

# Opción 2 — Python
python3 -m http.server 8080
# URL: http://localhost:8080

# Opción 3 — Node
npx serve .
```

> **Nota sobre Three.js:** la galaxia carga Three.js desde jsDelivr CDN. Sin conexión a internet no renderizará. Para uso 100% offline habría que servir `three.min.js` localmente.

---

## Deploy

El repo `maip-fred/maip-fred.github.io` es un **User Pages repo** de GitHub. Cualquier push a `main` dispara el deploy automático de GitHub Pages — sin configuración adicional, sin Actions custom.

```bash
# Flujo de actualización
git add .
git commit -m "descripción"
git push
# El sitio se actualiza en ~1 minuto en https://maip-fred.github.io/
```

---

## Pendientes

| Item | Descripción |
|---|---|
| **Foto de perfil** | Subir a `assets/img/foto-perfil.jpg` (cuadrada, mín. 600×600) |
| **CV PDF** | Subir a `assets/docs/cv-alfredo-ibanez.pdf` |
| **Formspree** | Reemplazar `REPLACE_WITH_YOUR_ID` en `contact.html` con el ID real |
| **Cal.com** | Crear cuenta y conectar el widget en `contact.html` |
| **Asciinema** | Grabar demo de pkgxray y descomentar el player en `pkgxray.html` |
| **OG image** | Convertir `assets/og-image.svg` a PNG 1200×630 para link previews |

---

## Decisiones de arquitectura

| Decisión | Razón |
|---|---|
| Galaxia en `galaxy.html` separada | Evita el loop de redirección que ocurría cuando la galaxia vivía dentro de `index.html` como overlay |
| `?from=galaxy` como señal de navegación | Evita el loop infinito `index.html → galaxy.html → index.html` sin usar `sessionStorage` (que solo funcionaba en primera visita) |
| CSS dividido en 15 archivos | Cada archivo tiene responsabilidad única. HTTP/2 los sirve en paralelo; el cache compartido entre páginas los convierte en un asset cargado una sola vez por sesión |
| Inline styles en el botón "volver a galaxia" | El CSS de posicionamiento en cascade puede ser sobreescrito por otros bloques; inline `position:fixed` es la única garantía real |
| `collCd = 3.0` al iniciar | Evita que la nave dispare trivia en el primer frame si aparece cerca de un satélite en coordenadas de pantalla |
| Trivia solo en colisión de nave, no en click | Click directo → warp inmediato (UX directa). Colisión → trivia (mecánica de juego). Las dos rutas coexisten intencionalmente |
| No se usa `document.referrer` | Poco confiable en `file://` (localhost) y en navegación de primer tab. Se descartó en favor de query params |
| Three.js via CDN, no bundled | Sin build step. El CDN de jsDelivr tiene excelente cache global. Tradeoff: requiere internet para la galaxia |

---

## Licencia

MIT — ver [LICENSE](LICENSE)

---

*Construido con HTML, CSS, JavaScript vanilla, Three.js y demasiado café.*

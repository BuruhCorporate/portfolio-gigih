# Gigih Satriono, portfolio

One-page portfolio set in a small 3D model city. Each building is a stop in Gigih's career: the tyre factory where he started, MNC's media house, the BPH Migas office, the Bank Mandiri tower, a tech park whose rooftop billboards play the project dashboards, a campus, a workshop for skills, and a post office for contact. As you scroll, the camera flies from building to building and a little figure of Gigih walks the roads to meet you there. Light theme, red accent.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # layout maths: road routes, car loops, window and dash placement
npm run build    # static site in dist/ (also regenerates vercel.json and public/_headers)
npm run preview  # serve dist/ with the production CSP meta tag
```

## Where to change things

| To change | Edit |
|---|---|
| Name, tagline, summary, email, LinkedIn, nav | `src/data/profile.ts` |
| Jobs | `src/data/experience.ts` (newest first, `end: null` = current role). Each job needs a `job-<id>` stop and building in `city.json`. |
| Projects | `src/data/projects.ts` (`featured: true` = own panel and tech-park tower, `screen` = which dashboard it shows) |
| Skills, degree, certifications | `src/data/skills.ts`, `src/data/credentials.ts` |
| Places on the hero map key | `mapStops` in `src/App.tsx` |
| Fallback image | `src/data/media.ts` |
| Colours, type scale, spacing, gaps between stops | `src/styles/tokens.css` (`--dwell`, `--dwell-short`) |
| Buildings, roads, trees, cars, the figure, lighting | `src/scene/city.json` (units ≈ metres, seconds, radians) |
| Camera framing and place name per stop | `stops` in `src/scene/city.json` |
| What the billboards and project previews show | `src/scene/screens.json` |
| Security headers and CSP | `security-headers.json`, then `npm run build` |

Content shapes are typed in `src/types/portfolio.ts`; city and screen shapes in `src/scene/config.ts`. Data flows one way: `data/*` → `App.tsx` → section props → UI components.

### How a stop works

Any element with `data-stop="<id>"` is a stop. `useActiveStop` reports the lowest one on screen; `CityStage` passes it to the scene, where `CameraRig` flies to `stops[id]`, the red pin moves to the matching building, and the figure walks there along the roads (`roadPath`). Clicking a building or a map-key button calls `scrollToStop`, which scrolls the page to that panel and focuses it.

## Structure

```
src/
  types/        content interfaces
  data/         all copy and content, poster path, credits
  hooks/        useActiveStop, useActiveSection, useMediaQuery, useReducedMotion, useProjectFilter, useClipboard, useSmoothScroll
  lib/          formatMonth, scrollToStop
  components/
    layout/     Navbar (floating pill), Section (gap + panel), Footer
    ui/         Button, TagList, ProjectFilter, PlaceTag, ScreenPreview
    sections/   Hero (with map key), About, ExperienceTimeline (a panel per company), Projects, Skills, Credentials, Contact
  scene/
    CityStage   fixed canvas behind the page, lazy load, WebGL fallback
    CityScene   canvas, lights, camera rig, pin, hover label
    Building    rise-in, hover lift, click to visit
    Parts       renders the part lists in city.json (boxes with windows, prisms, signs, billboards, ...)
    Ground      diorama base, roads, plots, trees
    Cars, Character
    geometry.ts pure maths (tested in tests/)
    city.json, screens.json, config.ts, drawScreen.ts
  styles/       tokens.css, global.css
tests/          node:test checks for geometry.ts
public/         hdri/studio.hdr, images/city.webp, gigih.jpg
scripts/write-headers.mjs
```

## Assets and licenses

| File | Source | License |
|---|---|---|
| `public/hdri/studio.hdr` | Poly Haven, studio_small_09 | CC0 |
| `public/images/city.webp` | rendered from this site | own work |

Everything in the city (buildings, the figure, cars, trees, signs) is modelled in code. Company names appear as plain text on signs; no logos are used. The dashboards are illustrations, not screenshots of client systems.

## Security

- Fonts are self-hosted (`@fontsource-variable`); the page makes no third-party requests.
- Strict Content Security Policy: scripts, styles, images, fonts and fetches from `'self'` only; no media, workers, objects or forms. One exception: `'unsafe-inline'` in `style-src`, because React, three.js and drei set inline style attributes. `data:` in `img-src` covers the inline SVG favicon.
- `nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, strict `Referrer-Policy`, locked-down `Permissions-Policy`, HSTS, `Cross-Origin-Opener-Policy`.
- Headers ship as `vercel.json` (Vercel) and `public/_headers` (Netlify, Cloudflare Pages), plus a CSP meta tag in the built `index.html` for any other host.
- External links use `rel="noopener noreferrer"`. `npm audit` reports 0 vulnerabilities.

## Behavior notes

- three.js loads in a separate chunk after the page text has painted.
- Performance: the canvas keeps to a pixel budget (lower DPR on large screens) and drops to 1x if the frame rate sags. The still city's shadows are drawn only while something in it moves; cars and the figure use soft blob shadows.
- Nav links and city clicks both land the target panel 22% down the viewport.
- Buildings rise out of the ground on load. Hover one to lift it and see its name; click to jump to its panel. Click the figure to make it wave.
- Every building can also be reached without a mouse: the hero map key and the nav are ordinary buttons and links.
- Reduced motion: no rise-in, the camera cuts instead of flying, the figure appears at each stop instead of walking, cars stand still, smooth scrolling is off.
- Without WebGL, a still render of the city (`public/images/city.webp`) sits behind the page.

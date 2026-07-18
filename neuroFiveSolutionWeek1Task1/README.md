# NovaPulse — AI Analytics Platform

NovaPulse is a production-ready responsive SaaS landing page for an AI-powered analytics platform. It combines a custom dashboard visual, feature overview, workflow, pricing, testimonials, and conversion-focused calls to action.

## Features

- Mobile-first layout for phones, tablets, and desktops
- Sticky glass navigation with animated mobile menu
- Code-rendered analytics dashboard illustration
- Reusable UI primitives and data-driven cards
- Intersection Observer reveals with reduced-motion support
- Semantic HTML, keyboard navigation, focus states, and accessible labels

## Tech stack

- React 19 and Vite
- CSS Modules and CSS custom properties
- Lucide React icons
- Inter Google Font
- Modern JavaScript and React Hooks

## Folder structure

```text
src/
├── assets/{icons,images}/
├── components/
│   ├── common/{Button,Container,SectionHeading}/
│   ├── Navbar/ Hero/ TrustedBrands/ Features/
│   └── HowItWorks/ Pricing/ Testimonials/ CTA/ Footer/
├── hooks/useScrollReveal.js
├── styles/{globals.css,variables.css}
├── utils/constants.js
├── App.jsx
└── main.jsx
```

## Setup

Node.js 18 or newer is recommended.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

The optimized site is generated in `dist/`.

## Deploy on Vercel

Push the repository to GitHub, GitLab, or Bitbucket and import it into Vercel. Vercel detects Vite automatically. Use `npm run build` as the build command and `dist` as the output directory. No environment variables are required.

## Design decisions

The visual system combines deep navy with violet-to-cyan accents, translucent surfaces, restrained glow, and generous spacing. The dashboard preview uses HTML, CSS, and SVG so it stays sharp at every viewport and avoids a large image request. Shared tokens keep color, spacing, radius, and motion consistent.

## Responsive strategy

Styles start with the phone layout and enhance at 768px and 1025px. Grids collapse into readable flows, navigation becomes an accessible menu, CTAs stack on narrow screens, and type scales fluidly with `clamp()`. Width-constrained containers prevent horizontal overflow.

## Screenshots

Add final deployment captures under `docs/screenshots/` for desktop, tablet, and mobile.

## Future improvements

- Connect trial CTAs to authentication
- Add a live product demo and real analytics data
- Add CMS-driven testimonials and pricing
- Add automated accessibility and visual regression tests

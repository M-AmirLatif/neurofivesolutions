# Country Explorer

A polished, responsive React dashboard that displays live country data from the REST Countries API. Built as NeuroFive Solutions Internship Week 1, Task 2.

## Features

- Fetches and displays live data for every country
- Instant country-name search and region filtering
- Country cards with flags, capitals, regions, population, and currencies
- Dedicated loading, API error, retry, and no-results states
- Responsive four-, two-, and one-column layouts
- Accessible labels, focus states, semantic markup, and reduced-motion support
- Memoized filtering, memoized cards, and lazy-loaded flag images

## Tech Stack

React 19, Vite, CSS Modules, Axios, Lucide React, React Hooks, ES6+, and CSS variables.

## Folder Structure

```text
src/
├── components/
│   ├── CountryCard/  CountryGrid/  EmptyState/
│   ├── ErrorMessage/ Footer/       Loader/
│   ├── Navbar/       SearchBar/
├── hooks/useCountries.js
├── services/countryService.js
├── styles/variables.css and globals.css
├── utils/constants.js
├── App.jsx
└── main.jsx
```

## API Used

[REST Countries API](https://restcountries.com/) via the `v3.1/all` endpoint. The request selects only the fields used by the interface.

## Installation

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

Import the repository into Vercel, set the framework preset to **Vite**, and deploy. Vercel detects the build command (`npm run build`) and output directory (`dist`) automatically.

## Design Decisions

The interface uses a modern dashboard layout with a high-contrast editorial hero, a sticky glass-effect navigation bar, soft card shadows, and the requested blue palette. Fetching is isolated in a custom hook, API logic is isolated in a service, and every UI state has a dedicated component.

## Responsive Strategy

The country grid uses four columns on desktop, two below 1050px, and one below 580px. Search controls stack on small screens, while typography and hero statistics adapt without horizontal overflow.

## Future Improvements

- Add country detail pages
- Add sorting and favorites
- Cache responses for offline access
- Add theme switching and additional language support

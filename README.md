# Auto Generate Report (React + Vite + TypeScript)

A single-page app to upload CSV/XLSX, clean/process data, visualize insights, and export professional PDF/CSV reports.

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```
Outputs to `dist/`.

## Netlify Deployment
- SPA redirect is configured via `public/_redirects` and `netlify.toml`.
- Suggested settings when connecting the repo in Netlify UI:
  - Base directory: `project`
  - Build command: `npm run build`
  - Publish directory: `project/dist`

## Tech Stack
- React 18, TypeScript, Vite, Tailwind CSS
- Recharts, Papa Parse, XLSX, jsPDF (+ autotable)

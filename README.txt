# Anesthesia PWA package

## Contents
- `index.html`: the supplied anesthesia calculator, with PWA metadata and service-worker registration added.
- `manifest.webmanifest`: install name, display mode and icons.
- `service-worker.js`: app-shell caching and runtime caching for external assets (Tailwind CDN and Google Fonts).

## Deploy
Upload the *contents* of this folder to the root of a static HTTPS host (GitHub Pages is one option). Do not open `index.html` as a local file; service workers require HTTPS (or localhost).

## Install on iPhone
1. Open the deployed HTTPS address in Safari while online.
2. Wait for the page to finish loading, then reload once so the service worker can take control.
3. Use the app while online once so external Tailwind/font assets can be cached.
4. In Safari, Share -> Add to Home Screen -> Add.
5. Launch from the new home-screen icon. Test offline after the first successful online load.

## Important limitations
- The original calculator's calculation and clinical content was not rewritten.
- The source loads Tailwind CSS and Google Fonts from external CDNs. The service worker caches these as they are fetched online; offline use is not guaranteed until each external asset has been loaded and cached at least once. First launch requires internet.
- The original file does not implement persistent patient-record storage (no localStorage, sessionStorage, IndexedDB, or database logic was found). Reloading/closing may therefore lose entered values. No patient-data persistence was added.
- This is a packaging conversion, not clinical validation. Verify every formula, dose, concentration, recommendation and local protocol independently before clinical use. Do not rely on it as the sole basis for prescribing or patient care.

# 3D Black Metropolis

A walkable reconstruction of Philadelphia's Black Metropolis around Lombard Street, c. 1850, built from 477 building footprints traced from the 1860 Hexamer & Locher atlas.

## Files
- index.html — page shell and UI
- app.js — the 3D scene (Three.js, loaded from unpkg CDN via the import map in index.html)
- style.css — UI styles
- buildings.geojson — footprints, materials, heights and names
- 1838Logo.png — favicon

## Deploy
Push to the repo root and enable GitHub Pages (Settings → Pages → Deploy from branch → main / root). No build step. The old three.module.js / three.core.js files are no longer needed and can be deleted.

## Styles
The Style button switches between Documentary, Storybook, Atlas, Daguerreotype and Dusk treatments of the same streets; the choice is remembered in the browser.

## Controls
W A S D / arrow keys to walk (Shift to hurry) · drag to look · click the street to walk there · scroll to glide · click the minimap to jump · "View from above" then click a building to go to its front door · Places panel lists named sites.

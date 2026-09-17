# Philadelphia Black Metropolis — Walk

A browser-based architectural prototype using 477 supplied building footprints.

## Upload to GitHub

1. Unzip this download and open the Walk folder.
2. Open https://github.com/1838-Black-Metropolis-Hub/Walk .
3. Use **Add file → Upload files** to upload the contents of the Walk folder, including the entire **public** folder. Upload the extracted files, not the ZIP.
4. Commit your upload. The repository root should contain README.md and public/index.html.

The existing repository contents could not be inspected when this package was prepared. Review any matching filenames before replacing existing work.

## Deploy on Cloudflare Pages

Create a Pages project connected to the Walk repository. These instructions are for Pages, not a Workers deployment:

- Framework preset: None
- Production branch: select the branch containing your upload
- Build command: `exit 0`
- Build output directory: `public`
- Root directory: leave blank (repository root)
- No environment variables or package installation required

Deploy and open the resulting pages.dev address. Use a separate Pages project for this walkthrough so the existing main website keeps its current deployment configuration. A normal Pages deployment is publicly accessible unless you configure access restrictions.

Official instructions: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

## Explore

Drag to look. Use W/A/S/D or arrow keys to walk; Shift moves faster. Walk here enables mouse look; Escape releases it. Touch devices show direction buttons. View from above opens the overview; Return to Lombard resets the view. About this reconstruction explains the evidence and provisional choices.

## Files

- public/index.html: interface
- public/style.css: interface styling
- public/app.js: building generation, rendering, navigation and collision checks
- public/buildings.geojson: supplied footprints and properties
- public/three.module.js and three.core.js: Three.js r180, bundled locally
- public/THREE-LICENSE.txt: bundled library license

No build step, API key, external tile service, account integration, or Sites hosting is required. No reference photographs are included in the package.

## Historical and implementation limits

This is an early scale and layout study, not a validated reconstruction of 1838. Footprints come from the supplied GeoJSON based on the 1860 Hexamer & Locher atlas. Supplied heights are feet to the roofline, converted to meters; inferred roofs extend above them. Names and uses have not been verified for 1838–1840.

Façades, colors, window and door placement, roof forms, and chimneys are procedural approximations informed by the supplied references. Dormers and building-specific landmark architecture remain to be modeled. Ground is a provisional shared surface: detailed streets, sidewalks and yards remain to be added. Doors are not enterable; collision checks are basic. This prototype is best reviewed on a desktop with WebGL support.

Building 195 has unknown material (value 3), shown in gray on its main walls. Building 236 uses primary height 36 feet; height2 is 48. The original data is preserved. Polygon exterior rings are used; interior holes are not modeled in this prototype.

Validation: JavaScript syntax, local asset references, GeoJSON feature count and ZIP integrity checked. The local street view was visually inspected. Full device testing and Cloudflare deployment have not been performed.

Map sources:
- https://www.philageohistory.org/rdic-images/view-image.cfm/HXL1860v1-pl04
- https://www.philageohistory.org/rdic-images/view-image.cfm/HXL1860v1-pl05

Three.js is distributed under its included MIT license. This notice does not assign a license to the user's building data or project.

## Update: roofs, trees and logo

Replace the existing public/app.js and public/index.html, and add public/1838Logo.png. Alternatively upload the whole public folder from this package, replacing matching files. Cloudflare Pages will deploy the committed update through the existing GitHub connection.

Roofs now follow each footprint's oriented bounds with low provisional pitches; irregular buildings use a shallow single slope. Roof end faces have texture coordinates, and chimney placement is checked against footprints. These are visual approximations pending individual roof research. Mature trees have branching trunks and irregular canopies; locations are interpretive and checked against building footprints. Your original logo is used unchanged as the browser favicon and touch icon.

The updated local view was visually inspected with trees and lower rooflines visible. Browser icons may require a hard refresh to clear the previous cached icon.

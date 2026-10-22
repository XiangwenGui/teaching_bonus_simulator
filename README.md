# My Little Art Studio

A static, English-language visual teaching-bonus calculator. Select a teacher level, course and 0–20 students. No build step, account, backend or database is required.

## Publish with GitHub Pages

1. Extract the ZIP locally. Upload its contents, including the `icons` folder, to the repository root. Do not upload the ZIP itself.
2. Ensure `index.html` sits directly in the repository root.
3. Open Settings → Pages. Under Build and deployment, choose Deploy from a branch, then main and / (root). Save.
4. Wait for the deployment to finish and open the published URL shown by GitHub.

The relative asset paths and manifest start URL support GitHub Pages repository subdirectories. No code changes are needed for a normal project URL.

## Add to a phone home screen

On iPhone, open the published HTTPS site in Safari, use Share → Add to Home Screen, and enable Open as Web App if offered. On Android Chrome, use the browser menu to install/add to Home screen; wording and availability vary by browser. The manifest, icons and standalone display preference are included. This is a web app, not an App Store package. Internet access is required; offline caching is not implemented.

## Calculation

Exp / Digital 1: max(0, students − 3). All other courses, including Digital 2: max(0, students − 4).
Per-class bonus = counted students × teacher factor × 2026 course factor. Eligibility assumes the teacher passed the new teacher assessment and personally taught that class. Retention is separate. The two-week example assumes the same student count and factors for both weekly classes. Display values use two decimal places; official payroll rounding rules have not been defined.

## Edit

- game.js: rule data, calculator, shared illustrations and mobile interaction.
- style.css: desktop/mobile layout and envelope cards.
- index.html: English copy and structure.
- manifest.webmanifest and icons/: home-screen metadata and icons.

Selection state resets on refresh. No real attendance, payroll or personal student data is collected by this application. The public site and client-side rule values are visible to visitors.

## Dependencies

Phaser 3.86.0 is included locally as phaser.min.js under the MIT license; its copyright/license header is retained. No external runtime dependency download is needed.

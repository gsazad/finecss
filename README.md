# FineCSS

FineCSS is a lightweight, dependency-free CSS framework built for enterprise interfaces that demand predictable overrides, accessibility, and rapid prototyping. It ships as a single CSS file (`finecss/css/finecss.css`) plus a minimal vanilla JavaScript helper (`finecss/js/finecss.js`) that wires dropdowns, modals, carousels, toasts, and scrollspy.

## Quick start

1. Copy the CSS and JS links into your HTML:

```html
<link rel="stylesheet" href="/finecss/css/finecss.css">
<script src="/finecss/js/finecss.js"></script>
<script>FineCSS.init();</script>
```

2. Build layouts with the responsive grid (`.fc-container`, `.fc-row`, `.fc-col-*`) and utilities (`.u-fc-*`) documented in `docs.html`.

3. Use the component classes (`.fc-btn`, `.fc-alert`, `.fc-card`, `.fc-table`, etc.) for consistent styling and accessibility out of the box.

4. For interactive pieces, add the documented data attributes (`data-fc`, `data-fc-toggle`, `data-fc-target`) and rely on `FineCSS.init()` for wiring.

## Assets

- `finecss/css/finecss.css`: design tokens, grid, utilities, component styles, and helpers for modals, toasts, and dropdowns.
- `finecss/js/finecss.js`: vanilla JS that initializes interactive components, handles keyboard interactions, and offers a `FineCSS.showToast()` helper.
- `docs.html`: living documentation page with demos, code snippets, and examples for every module.
- `one.html` / `shopping.html`: demo pages showing FineCSS-powered landing pages for hosting and e-commerce experiences.

## Contribution

Feel free to extend components or utilities—just keep selectors low-specificity, rely on the design tokens, and avoid additional build steps so FineCSS stays copy/paste friendly.

# FineCSS

FineCSS is a very lightweight, component-based CSS framework designed to help teams ship enterprise-grade interfaces quickly without adding build steps or dependencies. It provides predictable tokens, responsive layout primitives, reusable components, and a small vanilla-JS helper for key interactions.

## Why FineCSS?

- **Why it exists:** To offer a single-file CSS framework with a clear accessibility posture, consistent naming, and enterprise-friendly override behavior. Ideal for teams that need stability, low specificity, and ease of copy/paste integration.
- **What it is not:** It intentionally does not attempt to be an opinionated design system, a dense utility library like Tailwind, or a large JavaScript UI stack.
- **How it differs from Bootstrap:** Unlike Bootstrap's component/bundle mix, FineCSS ships as one CSS file with minimal JS, lower specificity, and a stricter naming convention.
- **How it differs from Tailwind:** Rather than generating utility classes for every possible combination, FineCSS provides a curated set of utilities plus components with consistent tokens.
- **How it differs from heavy UI frameworks:** There are no build steps, no runtime frameworks, and no bundled dependencies—just plain CSS and vanilla JavaScript.

## Core Principles

- Lightweight: minimal CSS/JS footprint, no preprocessors.
- Component-based: predictable `.fc-*` base + modifiers.
- Accessible by default: focus-visible, contrast, reduced-motion support.
- No dependencies: pure CSS and vanilla JS.
- Predictable CSS: low specificity, design tokens, stable overrides.
- Enterprise-friendly: consistent grid, spacing, and utilities.

## Features Overview

- 12-column responsive grid (`.fc-container`, `.fc-row`, `.fc-col-*`).
- Core components: alerts, buttons, cards, forms, navbars, tables, etc.
- Utility helpers: spacing, display, flex, borders, positioning, visibility.
- Vanilla JS for dropdowns, modals, carousel, toast, and scrollspy.
- Keyboard + screen-reader support baked in.
- Responsive by default with clear breakpoints and gutter controls.

## Quick Start

**Option A: Local files**

```html
<link rel="stylesheet" href="/finecss/css/finecss.css">
<script src="/finecss/js/finecss.js"></script>
<script>FineCSS.init()</script>
```

**Option B: Static hosting / GitHub Pages**

Host the repository directly (e.g., via GitHub Pages) and reference the CSS/JS files with absolute paths. Point your pages to `/finecss/css/finecss.css` and `/finecss/js/finecss.js`, then call `FineCSS.init()` after the script loads.

## Documentation

See `docs.html` for:

- live rendered examples for layout, typography, utilities, tables, cards, and more;
- documented component markup with `.fc-*` classes and `.is-*` states;
- copy/paste-ready HTML plus accessibility notes for each interactive section.

## Accessibility Commitment

- Keyboard navigation: dropdowns, modals, toasts, and carousel all listen for Enter/Space, Escape, and Tab focus traps.
- ARIA usage: roles and attributes are applied (e.g., `role="menu"`, `aria-expanded`, `aria-live`).
- Focus visibility: `:focus-visible` outlines plus `.fc-focus-ring` utility.
- Reduced motion: `@media (prefers-reduced-motion: reduce)` turns off animations/transitions.
- Contrast awareness: tokens target WCAG AA ratios for text/body and call-to-action colors.

## Project Structure

```
finecss/
├── css/
│   └── finecss.css
├── js/
│   └── finecss.js
docs.html
README.md
```

- `finecss/css/finecss.css`: tokens, base resets, grid, utilities, components, dropdown/modal/toast/carousel styles.
- `finecss/js/finecss.js`: vanilla JS initializer that wires data attributes, keyboard handling, and exposes `FineCSS.showToast()`.
- `docs.html`: living documentation with demos, code blocks, and interactive examples.
- `README.md`: this file.

## Contribution Guidelines

- Keep any CSS changes lightweight and rely on existing tokens.
- Avoid introducing extra JavaScript dependencies.
- Accessibility is non-negotiable—maintain focus behavior, ARIA, and contrast.
- Keep PRs focused and small so the framework stays easy to review.

## Versioning & Stability

FineCSS is an early-stage framework that follows semantic versioning intent. We aim to keep the CSS selectors and public JS API stable—breaking changes are scheduled for major versions only.

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Edge, Safari). No legacy Internet Explorer support.

## License

Open-source—see the repository’s license file for details.

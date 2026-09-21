# Frontend UI Update Documentation

This document summarizes the frontend code changes made to improve structure, layout, responsiveness, navigation, and theme support for the NursePath web app.

## Update Date

- **Date added:** September 21, 2026
- **Documentation created:** September 21, 2026
- **Scope:** Frontend structure, responsive UI layout, sidebar navigation, and light/dark theme support

## Summary

The frontend was reorganized from a single large HTML file into separate HTML, CSS, and JavaScript files. The user interface was also improved with a collapsible sidebar, centered responsive content, mobile-friendly layouts, and a light/dark mode toggle.

These changes are focused on maintainability and user experience. The existing clinical tool logic, OTC reference behavior, authentication flow, and calculator functions were preserved.

## Files Added

Date added: September 21, 2026

- `frontend/css/styles.css`
  - Contains the extracted CSS from the original inline style blocks.
  - Includes new layout rules for the sidebar, centered content, responsiveness, and light mode.

- `frontend/js/script-1.js`
  - Contains early startup logic.
  - Handles ghost-auth pre-check and applies the saved theme before the page finishes loading.

- `frontend/js/script-2.js`
  - Contains service worker registration logic.
  - Adds the light/dark mode toggle behavior and local theme persistence.

- `frontend/js/script-3.js`
  - Contains authentication/session-related app logic extracted from the original HTML.

- `frontend/js/script-4.js`
  - Contains the main frontend app logic extracted from the original HTML.

- `frontend/js/script-5.js`
  - Contains the secondary service worker/debug registration block extracted from the original HTML.

- `FRONTEND_UI_UPDATE.md`
  - Documents the frontend restructuring and UI improvements.

## Files Changed

Date changed: September 21, 2026

- `frontend/index.html`
  - Removed inline CSS and inline JavaScript.
  - Added external stylesheet and script references.
  - Replaced the top tab navigation with a collapsible sidebar.
  - Added sidebar navigation buttons for Clinical Tools and OTC Medicines.
  - Added placeholder sidebar options for future features.
  - Moved logout controls into the bottom of the sidebar.
  - Added a nonworking `Switch account` button as a future reference control.
  - Added a `Light mode` / `Dark mode` toggle button above `Switch account`.

- `frontend/css/styles.css`
  - Added sidebar layout styling.
  - Added responsive desktop, tablet, and mobile content rules.
  - Added centered content behavior for desktop screens.
  - Added mobile single-column tool cards.
  - Added light mode theme overrides.

- `frontend/js/script-1.js`
  - Added early theme application using `localStorage`.
  - Prevents the saved light mode from briefly flashing dark before the full app loads.

- `frontend/js/script-2.js`
  - Added theme toggle logic.
  - Saves the selected theme in `localStorage` using the `nursepath_theme` key.
  - Updates the toggle button label between `Light mode` and `Dark mode`.

## UI Improvements

### 1. Code Structure

The original `frontend/index.html` contained inline CSS and JavaScript. These were separated into dedicated files:

- HTML remains responsible for app structure.
- CSS handles styling and layout.
- JavaScript handles behavior and app logic.

This makes the project easier to read, maintain, debug, and extend.

### 2. Collapsible Sidebar

A new sidebar was added to replace the old top navigation.

Behavior:

- Collapsed by default.
- Expands when the user hovers over it or focuses inside it.
- Contains the main navigation buttons.
- Keeps account controls at the bottom.

Sidebar controls:

- Clinical Tools
- OTC Medicines
- Placeholder buttons for future options
- Light/Dark mode toggle
- Switch account placeholder
- Logout

### 3. Centered Desktop Layout

The main frontend content is now centered within the available screen space beside the sidebar.

Desktop improvements:

- Added controlled maximum content width.
- Added desktop-only top spacing.
- Improved visual balance under the fixed top banner.
- Prevented content from drifting too far left or right.

### 4. Mobile Responsiveness

Mobile layout improvements were added so the app works better on narrow screens.

Mobile behavior:

- Sidebar becomes narrower.
- Main content uses the remaining viewport width.
- Tool cards switch to a single-column layout.
- Header/logo scales down.
- Duty/Study toggle becomes full-width.
- Card and button spacing is adjusted for touch screens.

Tool card grid behavior:

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

### 5. Light/Dark Mode

A theme toggle was added to the sidebar.

Behavior:

- Shows `Light mode` when the app is currently dark.
- Shows `Dark mode` when the app is currently light.
- Saves the selected theme in `localStorage`.
- Restores the selected theme after page reload.

Theme storage key:

```text
nursepath_theme
```

Light mode updates:

- App background
- Sidebar
- Top banner
- Tool cards
- OTC panels
- Study panels
- Inputs and textareas
- Common text utility colors
- Borders and panel shadows

## Technical Notes

The theme is applied using an HTML attribute:

```html
<html data-theme="light">
```

When dark mode is active, the `data-theme` attribute is removed. This keeps the original dark UI as the default theme.

The light mode CSS uses attribute selectors such as:

```css
html[data-theme="light"] .np-app-layout { ... }
```

This avoids rewriting the whole existing stylesheet and keeps the light mode layer scoped.

## Verification

JavaScript syntax checks were run with:

```bash
node --check frontend/js/script-1.js
node --check frontend/js/script-2.js
node --check frontend/js/script-3.js
node --check frontend/js/script-4.js
node --check frontend/js/script-5.js
```

All checked JavaScript files passed syntax validation.

## Compatibility Notes

The following existing behavior was kept:

- Clinical tools tab switching
- OTC medicine tab switching
- Authentication/session behavior
- Logout behavior
- Service worker registration
- Offline-first app structure
- Existing calculator and reference logic

The sidebar buttons reuse the existing tab IDs:

```text
tab-tools
tab-otc
```

This preserves compatibility with the existing JavaScript tab-switching logic.

## Suggested GitHub Commit Message

```text
Refactor frontend layout and add responsive sidebar theme toggle
```

## Suggested Pull Request Description

```text
This update restructures the frontend into separate HTML, CSS, and JavaScript files, then improves the UI with a collapsible sidebar, centered responsive layout, mobile-friendly tool cards, and a persistent light/dark mode toggle.

The existing app behavior is preserved, including tab switching, authentication/session flow, logout, service worker registration, clinical tools, and OTC reference logic.

Validation:
- Ran node --check against extracted JavaScript files.
- Confirmed the sidebar keeps the existing tab IDs used by the current navigation logic.
```

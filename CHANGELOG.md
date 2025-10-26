Of course. Here is the updated `CHANGELOG.md` file with the latest fix for the authentication flow.

---
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Testing Framework**: Integrated **Vitest** and **React Testing Library** to enable unit and component testing across the application.
- **Initial Test Suite**: Created test files for core components, including `DailyJournal.jsx` and `RecoveryWorkbook.jsx`, to verify rendering, data loading, and user interactions.
- **`CHANGELOG.md`**: This file was created to track project updates and version history.

### Changed
- **UI Color Scheme**: Overhauled the entire application's color palette to a new, modern theme.
    - Updated `tailwind.config.js` with the new color palette including 'serene-teal', 'healing-green', and 'hopeful-coral'.
    - Replaced old color classes (e.g., `bg-teal-600`, `text-gray-800`) with the new theme colors across all `.jsx` components.
    - Updated the global background color in `src/index.css` to 'soft-linen' (`#F4F0E9`).
- **Journal Display**: Modified the `DailyJournal.jsx` component to display the text content of each journal entry directly in the list view, which was previously missing.

### Fixed
- **Authentication Flow**: Corrected a critical bug in `AuthContext.jsx` that caused users to be redirected to the login page after a successful login or page refresh. The loading state is now correctly managed, ensuring the app waits for Firebase to confirm authentication status before rendering any pages.
- **Social Sign-In Loop**: Resolved a race condition with Google and Facebook sign-in redirects. Removed the redirect handling logic from `Login.jsx` to make `AuthContext.jsx` the single source of truth for all authentication state changes.
- **`package.json` Syntax**: Fixed a JSON parsing error by adding a missing comma in the `scripts` section.
- **Vite Configuration**: Resolved a syntax error in `vite.config.js` and populated the `icons` array in the PWA manifest for better PWA support.
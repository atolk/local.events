# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-03-22

### Added

- Authentication flow and UI.
- Map: set user home location via right-click.
- Event map markers with selection animations; marker icon refactor and dedicated `EventMapMarker` component.
- Background texture for the app shell.
- Planning guidelines for implementation work (`docs` / Cursor rules).

### Changed

- Marker logic extracted into separate components for clearer map UI.

### Fixed

- Auth UI stacking order (z-index) so modals and overlays behave correctly.

[0.1.0]: https://github.com/atolk/local.events/releases/tag/v0.1.0

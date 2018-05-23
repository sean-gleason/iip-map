# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Distinct API endpoints allowing for multiple map projects on one site
- Filtering of markers based on topic and date
- Ability to edit/update/delete existing markers
- Internationalization and localization

### Changed
- Force download of CSV file when exporting project data
- Plugin deactivation hook to give option to delete all project and map data

## [1.0.0] - 2018-05-24
### Added
- Map data custom post type with metadata saved to custom table
- Admin dashboard to configure map projects and generate map shortcodes
- Ability to import project data via the [Screendoor API](http://dobtco.github.io/screendoor-api-docs/)
- Custom WordPress API endpoint to relay map data to embedded map
- Custom WordPress shortcode to embed map projects on posts
- Frontend rendering of map, with marker clustering and spidering

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Filtering of markers based on topic and date
- Internationalization and localization
- Region-based dropdown to automatically add latitude and longitude in shortcode generator
- Add on/off toggle for clustering
- Add alert about API rate-limits when map type is set to Google Maps

### Changed
- Add plugin deactivation hook to give option to delete all project and map data
- Pull out only required methods from the OpenLayers library to reduce the amount of JavaScript loaded onto the page
- Add default values to shortcode generator

## [1.1.1] - 2018-06-13
### Changed
- Recenter map on InfoWindow when clicking on marker (in OpenLayers and Google Maps)
- Reorder information on InfoWindows and make contact block conditional

### Fixed
- Venue address in geocoder pulling wrong post metadata value

## [1.1.0] - 2018-06-06
### Added
- Map type dropdown to shortcode generator
- Ability to edit the location of or entirely delete existing markers
- InfoWindow popups and clustering on OpenLayers maps

### Changed
- Set event duration field to accept radio options rather than text input

### Fixed
- When set to noon, event time was being converted to midnight

## [1.0.3] - 2018-06-01
### Added
- Distinct API endpoints allowing for multiple map projects on one site
- Option to display map using OpenLayers rather than Google Maps

### Changed
- Display date in InfoWindow in 'Month DD' format rather than YYYY-MM-DD

### Fixed
- Force download of file with data when exporting project data
- Venue address was displaying the wrong value in the administrative panel

## [1.0.2] - 2018-05-25
### Changed
- Increase geocoding batch size from 10 responses to 100 responses
- Switch from fetch to an AJAX call when retrieving map data (promise was throwing CORS error)

## [1.0.1] - 2018-05-24
### Added
- Host name an event parameter

### Fixed
- Allow for non-default table prefixes when generating API endpoint
- Add CSS rule to prevent zoom and other Google map icons from appearing blurry
- Add closing <div> tag to shortcode output to allow for content to be added below the map

### Security
- Add nonces to internal AJAX calls

## [1.0.0] - 2018-05-24
### Added
- Map data custom post type with metadata saved to custom table
- Admin dashboard to configure map projects and generate map shortcodes
- Ability to import project data via the [Screendoor API](http://dobtco.github.io/screendoor-api-docs/)
- Custom WordPress API endpoint to relay map data to embedded map
- Custom WordPress shortcode to embed map projects on posts
- Frontend rendering of map, with marker clustering and spidering

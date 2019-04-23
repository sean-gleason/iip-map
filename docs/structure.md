# Plugin Structure
This plugin is divided into four principal directories, namely:

1. Admin - Contains the code for the plugin's administrative interface.
1. Public - Contains the code for the plugin's frontend user interface.
1. Includes - Manages the plugin by means of the main plugin class (includes/class-iip-map.php), which defines the core functionality of the plugin and the loader file (includes/class-iip-map-loader.php), which feeds the admin and public hooks in from their respective classes into the main class file.
1. Docs - Contains the documentation for the plugin.

Additionally, at the root level the plugin contains a iip-map.php file, which registers plugin and begins its execution.

The file structure can be represented as such:

```bash
├── iip-map.php # Imports classes and initiates plugin
├── package.json # Consolidated build scripts
├── version.js # Node scripts to update the version number throughout the plugin and tag new releases
├── admin # Plugin admin panel
│   │
│   ├── class-iip-map-admin.php # Enqueues and localizes admin JS/CSS
│   ├── css # 
│   ├── map-data-post-type.php
│   ├── ajax
│   │   ├── change-marker-data.php
│   │   ├── export-map-data.php
│   │   ├── save-map-data.php
│   │   └── screendoor-save-metadata.php
│   │
│   ├── js
│   │   ├── config # Admin Webpack configs
│   │   ├── data-export.js
│   │   ├── dist # Production & dev builds of admin JS and CSS bundle
│   │   ├── geocode.js
│   │   ├── package.json # Admin build scripts and dependencies
│   │   ├── public # Static assets used by admin panel dev server
│   │   │
│   │   ├── src # Admin panel React app
│   │   │   ├── Components
│   │   │   ├── Containers
│   │   │   ├── index.css
│   │   │   ├── index.js
│   │   │   └── utils
│   │   │
│   │   └── update-marker.js
│   │
│   └── partials
│       ├── keys-admin.php
│       └── main-save-metadata.php
│
├── docs # Plugin documentation
│
├── includes # Plugin hooks and actions
│   │
│   ├── class-iip-map-activator.php # Creates table in database for map data
│   ├── class-iip-map-deactivator.php # Cleans up database when plugin is uninstalled
│   ├── class-iip-map-loader.php # Register all actions and filters for the plugin.
│   └── class-iip-map.php # Defines all hooks for the plugin
│
├── public # Plugin frontend 
│   ├── css
│   ├── embed-map.php
│   ├── generate-api.php
│   │
│   └── js
│       ├── dist  # Production & dev builds of frontend JS and CSS bundle
│       ├── draw-gmap.js
│       ├── draw-ol-map.js
│       ├── markerclusterer.js
│       └── ol-popup.js
└── static # Static image assets
```

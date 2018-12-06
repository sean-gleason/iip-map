import React from 'react';

const ShortcodeGenerator = ( ) => (
  <div className="iip-map-admin-shortcode-box" id="map-shortcode-box">
    <h4 className="iip-map-admin-metabox-header hndle ui-sortable-handle">Shortcode Generator</h4>
    <div className="iip-map-admin-shortcode-container">
      <div className="iip-map-admin-shortcode-row">
        <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_height">
          Map Height:
          <input id="iip-map-height" type="text" name="_iip_map_height" className="iip-map-admin-shortcode-input" placeholder="600" value="700" />
        </label>
      </div>

      <div className="iip-map-admin-shortcode-row">
        <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_zoom">
          Map Zoom:
          <input id="iip-map-zoom" type="text" name="_iip_map_zoom" className="iip-map-admin-shortcode-input" placeholder="2" value="3" />
        </label>
      </div>

      <div className="iip-map-admin-shortcode-row">
        <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_lat">
          Map Center Latitude:
          <input id="iip-map-lat" type="text" name="_iip_map_lat" className="iip-map-admin-shortcode-input" placeholder="30" value="30" />
        </label>
      </div>

      <div className="iip-map-admin-shortcode-row">
        <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_lng">
          Map Center Longitude:
          <input id="iip-map-lng" type="text" name="_iip_map_lng" className="iip-map-admin-shortcode-input" placeholder="0" value="20" />
        </label>
      </div>

      <div className="iip-map-admin-shortcode-row">
        <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_type">
          Map Type:
          <select id="iip-map-type" name="_iip_map_type" className="iip-map-admin-shortcode-select">
            <option value="ol">ol</option>
            <option value="gmap">Google Maps</option>
            <option value="ol">OpenLayers</option>
          </select>
        </label>
      </div>
    </div>
  </div>
);

export default ShortcodeGenerator;

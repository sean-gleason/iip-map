import React from 'react';
import { object } from 'prop-types';

const ShortcodeGenerator = ( { data } ) => (
  <div className="iip-map-admin-shortcode-box" id="map-shortcode-box">
    <h4 className="iip-map-admin-metabox-header hndle ui-sortable-handle">Shortcode Generator</h4>
    <div className="iip-map-admin-shortcode-container">
      <div className="iip-map-admin-shortcode-params">
        <div className="iip-map-admin-shortcode-row">
          <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_height">
            Map Height:
            <input
              className="iip-map-admin-shortcode-input"
              id="iip-map-height"
              name="_iip_map_height"
              placeholder="600"
              type="text"
              value="700"
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_zoom">
            Map Zoom:
            <input
              className="iip-map-admin-shortcode-input"
              id="iip-map-zoom"
              name="_iip_map_zoom"
              placeholder="2"
              type="text"
              value={ data.zoom }
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_lat">
            Map Center Latitude:
            <input
              className="iip-map-admin-shortcode-input"
              id="iip-map-lat"
              name="_iip_map_lat"
              placeholder="0"
              type="text"
              value={ data.lat }
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_lng">
            Map Center Longitude:
            <input
              id="iip-map-lng"
              className="iip-map-admin-shortcode-input"
              name="_iip_map_lng"
              placeholder="0"
              type="text"
              value={ data.lng }
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          { /* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */ }
          <label className="iip-map-admin-shortcode-label" htmlFor="_iip_map_type">
            Map Type:
            <select id="iip-map-type" name="_iip_map_type" className="iip-map-admin-shortcode-select">
              <option value="ol">OpenLayers</option>
              <option value="gmap">Google Maps</option>
            </select>
          </label>
        </div>
      </div>

      <div className="iip-map-admin-shortcode-output-container" style={ { textAlign: 'center' } }>
        <strong>Paste this shortcode into your post/page:</strong>
        <pre className="iip-map-admin-shortcode-output">
          { `[map id=18595 height= zoom=${data.zoom} lat=${data.lat} lng=${data.lng} type='gmap']` }
        </pre>
      </div>
    </div>
  </div>
);

ShortcodeGenerator.propTypes = {
  data: object
};

export default ShortcodeGenerator;

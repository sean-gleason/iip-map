import React from 'react';
import { object } from 'prop-types';

const ShortcodeGenerator = ( { data } ) => (
  <div className="iip-map-admin-shortcode-box" id="map-shortcode-box">
    <h4 className="iip-map-admin-metabox-header">Shortcode Generator</h4>
    <div className="iip-map-admin-shortcode-container">
      <div className="iip-map-admin-shortcode-params">
        <div className="iip-map-admin-shortcode-row">
          <label className="iip-map-admin-shortcode-label" htmlFor="mapHeight">
            Map Height (in pixels):
            <input
              className="iip-map-admin-shortcode-input"
              id="iip-map-height"
              name="mapHeight"
              placeholder="700"
              type="text"
              value={ data.height }
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          <label className="iip-map-admin-shortcode-label" htmlFor="mapZoom">
            Map Zoom:
            <input
              className="iip-map-admin-shortcode-input"
              id="iip-map-zoom"
              name="mapZoom"
              placeholder="2"
              type="text"
              value={ data.zoom }
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          <label className="iip-map-admin-shortcode-label" htmlFor="mapLat">
            Map Center Latitude:
            <input
              className="iip-map-admin-shortcode-input"
              id="iip-map-lat"
              name="mapLat"
              placeholder="0"
              type="text"
              value={ data.lat }
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          <label className="iip-map-admin-shortcode-label" htmlFor="mapLng">
            Map Center Longitude:
            <input
              id="iip-map-lng"
              className="iip-map-admin-shortcode-input"
              name="mapLng"
              placeholder="0"
              type="text"
              value={ data.lng }
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          { /* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */ }
          <label className="iip-map-admin-shortcode-label" htmlFor="mapType">
            Map Type:
            <select id="iip-map-type" name="mapType" className="iip-map-admin-shortcode-select">
              {/* { data.type === 'gmap'
                ? <option value="gmap">Google Maps</option>
                : <option value="ol">OpenLayers</option>
              } */}
              <option value="ol">OpenLayers</option>
              <option value="gmap">Google Maps</option>
            </select>
          </label>
        </div>
      </div>

      <div className="iip-map-admin-shortcode-output-container" style={ { textAlign: 'center' } }>
        <strong>Paste this shortcode into your post/page:</strong>
        <pre className="iip-map-admin-shortcode-output">
          { `[map id=18595 height=${data.height} zoom=${data.zoom} lat=${data.lat} lng=${data.lng} type=${data.type}]` }
        </pre>
      </div>
    </div>
  </div>
);

ShortcodeGenerator.propTypes = {
  data: object
};

export default ShortcodeGenerator;

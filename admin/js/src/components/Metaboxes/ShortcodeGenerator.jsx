import React from 'react';
import { func, object } from 'prop-types';

const ShortcodeGenerator = ( { callback, data } ) => (
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
              onChange={ callback }
              placeholder="700"
              type="text"
              value={ data.mapHeight }
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
              readOnly
              type="text"
              value={ data.mapZoom }
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
              onChange={ callback }
              placeholder="0"
              type="text"
              value={ data.mapLat }
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
              onChange={ callback }
              placeholder="0"
              type="text"
              value={ data.mapLng }
            />
          </label>
        </div>

        <div className="iip-map-admin-shortcode-row">
          { /* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */ }
          <label className="iip-map-admin-shortcode-label" htmlFor="mapType">
            Map Type:
            <select id="iip-map-type" name="mapType" className="iip-map-admin-shortcode-select">
              { data.mapType === 'gmap'
                ? <option value="gmap">Google Maps</option>
                : <option value="ol">OpenLayers</option>
              }
              <option value="ol">OpenLayers</option>
              <option value="gmap">Google Maps</option>
            </select>
          </label>
        </div>
      </div>

      <div className="iip-map-admin-shortcode-output-container" style={ { textAlign: 'center' } }>
        <strong>Paste this shortcode into your post/page:</strong>
        <pre className="iip-map-admin-shortcode-output">
          { `[map id=${data.mapId} height=${data.mapHeight} zoom=${data.mapZoom} lat=${data.mapLat} lng=${data.mapLng} type=${data.mapType}]` }
        </pre>
      </div>
    </div>
  </div>
);

ShortcodeGenerator.propTypes = {
  callback: func,
  data: object
};

export default ShortcodeGenerator;

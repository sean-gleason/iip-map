import React, { Component } from 'react';

import MapBox from '../Components/Metaboxes/MapBox';
import ShortcodeGenerator from '../Components/Metaboxes/ShortcodeGenerator';

import { adminMap } from '../utils/map';
import { getMapMeta } from '../utils/globals';

class ConfigureMap extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      mapProps: {
        height: getMapMeta.height,
        lat: getMapMeta.lat,
        lng: getMapMeta.lng,
        type: getMapMeta.type,
        zoom: getMapMeta.zoom
      }
    };

    this.getMapProps = this.getMapProps.bind( this );
  }

  componentDidMount() {
    const map = adminMap();
    map.on( 'moveend', this.getMapProps );
  }

  getMapProps( evt ) {
    const { map } = evt;
    const view = map.getView();
    const viewCenter = view.getCenter();
    const viewZoom = view.getZoom();

    const lat = Math.round( viewCenter[1] * 1e2 ) / 1e2;
    const lng = Math.round( viewCenter[0] * 1e2 ) / 1e2;
    const zoom = Math.round( viewZoom );

    this.setState( prevState => ( {
      mapProps: {
        ...prevState.mapProps,
        lat: lat,
        lng: lng,
        zoom: zoom
      }
    } ) );
  }

  render() {
    const { mapProps } = this.state;

    return (
      <div className="postbox">
        <h2 className="iip-map-admin-metabox-header">Configure Your Map</h2>
        <div className="inside">
          <div className="iip-map-admin-configure-box">
            <MapBox />
            <ShortcodeGenerator data={ mapProps } />
          </div>
        </div>
      </div>
    );
  }
}

export default ConfigureMap;

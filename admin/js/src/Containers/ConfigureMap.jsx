import React, { Component } from 'react';

import MapBox from '../Components/Metaboxes/MapBox';
import ShortcodeGenerator from '../Components/Metaboxes/ShortcodeGenerator';
import { adminMap } from '../utils/map';

class ConfigureMap extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      mapProps: { lat: 0, lng: 0, zoom: 2 }
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

    const mapProps = {
      lat: Math.round( viewCenter[1] * 1e2 ) / 1e2,
      lng: Math.round( viewCenter[0] * 1e2 ) / 1e2,
      zoom: Math.round( viewZoom )
    };

    this.setState( {
      mapProps
    } );
  }

  render() {
    const { mapProps } = this.state;

    return (
      <div className="postbox">
        <h2 className="iip-map-admin-metabox-header hndle ui-sortable-handle">Configure Your Map</h2>
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

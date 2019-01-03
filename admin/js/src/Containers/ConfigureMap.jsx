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
        mapHeight: getMapMeta.height,
        mapId: getMapMeta.id,
        mapLat: getMapMeta.lat,
        mapLng: getMapMeta.lng,
        mapType: getMapMeta.type,
        mapZoom: getMapMeta.zoom
      }
    };

    this.getMapProps = this.getMapProps.bind( this );
    this.handleInputChange = this.handleInputChange.bind( this );
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

    const newLat = Math.round( parseFloat( viewCenter[1] ) * 1e2 ) / 1e2;
    const newLng = Math.round( parseFloat( viewCenter[0] ) * 1e2 ) / 1e2;
    const newZoom = Math.round( viewZoom );

    this.setState( prevState => ( {
      mapProps: {
        ...prevState.mapProps,
        mapLat: newLat,
        mapLng: newLng,
        mapZoom: newZoom
      }
    } ) );
  }

  handleInputChange( e ) {
    const { name } = e.target;
    const { value } = e.target;

    this.setState( prevState => ( {
      mapProps: {
        ...prevState.mapProps,
        [name]: value
      }
    } ) );
  }

  render() {
    const { mapProps } = this.state;

    return (
      <div className="postbox">
        <h2 className="iip-map-admin-metabox-header">Set Your Map View</h2>
        <div className="inside">
          <div className="iip-map-admin-configure-box">
            <MapBox />
            <ShortcodeGenerator callback={ this.handleInputChange } data={ mapProps } />
          </div>
        </div>
      </div>
    );
  }
}

export default ConfigureMap;

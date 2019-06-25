import React, { Component } from 'react';

import MapBox from './MapBox';
import ShortcodeGenerator from './ShortcodeGenerator';

import { adminMap } from '../../../utils/map';
import { getMapMeta } from '../../../utils/globals';

class ConfigureMap extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      mapProps: {
        mapHeight: getMapMeta.height,
        mapId: getMapMeta.id,
        mapLat: getMapMeta.lat,
        mapLng: getMapMeta.lng,
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

    // Gets the inital map center and zoom values
    const view = map.getView();
    const viewCenter = view.getCenter();
    const viewZoom = view.getZoom();

    // Gets new lat, lng, and zoom values (rounded to 2 decimal places for lat & lng, whole number for zoom)
    const newLat = Math.round( parseFloat( viewCenter[1] ) * 1e2 ) / 1e2;
    const newLng = Math.round( parseFloat( viewCenter[0] ) * 1e2 ) / 1e2;
    const newZoom = Math.round( viewZoom );

    // Wraps the longitude so that lng value always valid, even when users scroll across the whole map
    function normalizeLng( value ) {
      const rotation = Math.floor( ( value + 180 ) / 360 );
      const normalized = value - ( rotation * 360 );
      const rounded = Math.round( normalized * 1e2 ) / 1e2;

      return rounded;
    }

    // Sets the updated lat, lng, and zoom values
    this.setState( prevState => ( {
      mapProps: {
        ...prevState.mapProps,
        mapLat: newLat,
        mapLng: normalizeLng( newLng ),
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
      <div className="iip-map-admin-column-wide">
        <div className="iip-map-admin-configure-box">
          <MapBox />
          <ShortcodeGenerator callback={ this.handleInputChange } data={ mapProps } />
        </div>
      </div>
    );
  }
}

export default ConfigureMap;

// Gets the map parameters from the server
export const mapParams = ( function getParams() {
  const params = window.iipMapParams || {};
  const mapMeta = params.mapMeta || {};
  return mapMeta;
}() );

// Creates getters for map parameters
class MapMeta {
  constructor( meta ) {
    this._meta = meta;
  }

  get meta() {
    return this._meta;
  }

  get height() {
    if ( this._meta.height ) {
      return this._meta.height;
    }
    return 700;
  }

  get lat() {
    if ( this._meta.lat ) {
      return this._meta.lat;
    }
    return 0;
  }

  get lng() {
    if ( this._meta.lng ) {
      return this._meta.lng;
    }
    return 0;
  }

  get type() {
    if ( this._meta.type ) {
      return this._meta.type;
    }
    return 'ol';
  }

  get zoom() {
    if ( this._meta.zoom ) {
      return this._meta.zoom;
    }
    return 2;
  }
}

export const getMapMeta = new MapMeta( mapParams );

// Get API keys
export const screendoorKey = ( function getKey() {
  const params = window.iipMapParams || {};
  const key = params.screendoorApi || {};
  return key;
}() );

export const googleKey = ( function getKey() {
  const params = window.iipMapParams || {};
  const key = params.googleApi || {};
  return key;
}() );

/*
 * This file creates getter functions used to access variables passed by WordPress into the global scope
 */

// ----------- IIP MAP GLOBAL METAVALUES ---------- //

// Gets the global meta values for IIP maps from the server
export const mapGlobalMeta = ( function getGlobals() {
  const globals = window.iipMapParams || {};
  const mapGlobals = globals.mapGlobals || {};
  return mapGlobals;
}() );

// Creates getters for global meta
class MapGlobalMeta {
  constructor( meta ) {
    this._meta = meta;
  }

  get meta() {
    return this._meta;
  }

  get ajaxUrl() {
    if ( this._meta.ajaxUrl ) {
      return this._meta.ajaxUrl;
    }
    return null;
  }

  get screendoorKey() {
    if ( this._meta.screendoorApi ) {
      return this._meta.screendoorApi;
    }
    return null;
  }

  get screendoorNonce() {
    if ( this._meta.screendoorNonce ) {
      return this._meta.screendoorNonce;
    }
    return null;
  }

  get googleKey() {
    if ( this._meta.googleApi ) {
      return this._meta.googleApi;
    }
    return null;
  }
}

export const getMapGlobalMeta = new MapGlobalMeta( mapGlobalMeta );


// ----------- MAP VIEW METAVALUES ---------- //

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

  get formType() {
    if ( this._meta.formType ) {
      return this._meta.formType;
    }
    return '';
  }

  get height() {
    if ( this._meta.height ) {
      return this._meta.height;
    }
    return 700;
  }

  get id() {
    if ( this._meta.id ) {
      return this._meta.id;
    }
    return '';
  }

  get lat() {
    if ( this._meta.lat ) {
      const { lat } = this._meta;
      return parseFloat( lat );
    }
    return 0;
  }

  get lng() {
    if ( this._meta.lng ) {
      const { lng } = this._meta;
      return parseFloat( lng );
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

// ----------- INPUT FIELD METAVALUES ---------- //

// Gets the input field mappings from the server
export const inputFields = ( function getFields() {
  const params = window.iipMapParams || {};
  const mapFieldsMeta = params.mapFieldsMeta || {};
  return mapFieldsMeta;
}() );

// Creates getters for input field mappings
class MapFieldsMeta {
  constructor( meta ) {
    this._meta = meta;
  }

  get meta() {
    return this._meta;
  }

  get availableArr() {
    if ( this._meta.available_arr ) {
      return this._meta.available_arr;
    }
    return [];
  }

  get dateArr() {
    if ( this._meta.date_arr ) {
      return this._meta.date_arr;
    }
    return [];
  }

  get fields() {
    if ( this._meta.fields_obj ) {
      return this._meta.fields_obj;
    }
    return {};
  }

  get locationArr() {
    if ( this._meta.location_arr ) {
      return this._meta.location_arr;
    }
    return [];
  }

  get nameArr() {
    if ( this._meta.name_arr ) {
      return this._meta.name_arr;
    }
    return [];
  }

  get otherArr() {
    if ( this._meta.other_arr ) {
      return this._meta.other_arr;
    }
    return [];
  }

  get projectId() {
    if ( this._meta.project_id ) {
      return this._meta.project_id;
    }
    return null;
  }

  get timeArr() {
    if ( this._meta.time_arr ) {
      return this._meta.time_arr;
    }
    return [];
  }
}

const screedoor = inputFields.screendoor || {};
export const getScreendoorFields = new MapFieldsMeta( screedoor );

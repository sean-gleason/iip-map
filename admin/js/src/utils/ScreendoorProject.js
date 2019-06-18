import axios from 'axios';
import {
  getMapGlobalMeta,
  getScreendoorFields,
  getScreendoorCard,
  getMapMeta, getMapEvents
} from './globals';
import { getFormData, getObjectFromArray } from './helpers';

const SCREENDOOR_URL = 'https://screendoor.dobt.co/api/projects/';

export class ScreendoorProject {
  constructor() {
    this.postId = getMapMeta.id || null;
    this.apiKey = getMapGlobalMeta.screendoorKey;
    this.projectId = getScreendoorFields.projectId;
    this.form = getScreendoorFields ? getScreendoorFields.formArr : [];
    this.mapping = getScreendoorFields ? {
      additionalFields: getScreendoorFields.otherArr,
      availableFields: getScreendoorFields.availableArr,
      dateFields: getScreendoorFields.dateArr,
      fields: getScreendoorFields.fields,
      form: this.form,
      locationFields: getScreendoorFields.locationArr,
      nameFields: getScreendoorFields.nameArr,
      timeFields: getScreendoorFields.timeArr
    } : {};
    this.card = getScreendoorCard ? {
      titleSection: getScreendoorCard.title,
      dateSection: getScreendoorCard.date,
      timeSection: getScreendoorCard.time,
      locationSection: getScreendoorCard.location,
      additionalSection: getScreendoorCard.additional,
      added: getScreendoorCard.addedArr
    } : null;

    this.events = getMapEvents;
  }

  update = ( updates ) => {
    Object.keys( updates ).forEach( ( key ) => {
      this[key] = updates[key];
    } );
  };

  /**
   * Save field mapping and card configuration in WordPress via AJAX call.
   * @param saveData { projectId, form, card, mapping }
   * @returns {Promise<AxiosResponse<T>>}
   */
  save = ( saveData ) => {
    if ( !this.postId ) {
      return Promise.reject( new Error( 'No post id' ) );
    }

    const dataObj = {
      postId: this.postId
    };
    if ( 'form' in saveData ) {
      this.form = saveData.form;
      dataObj.form = this.form;
    }
    if ( 'card' in saveData ) {
      this.card = saveData.card;
      dataObj.card = this.card;
    }

    if ( 'projectId' in saveData ) {
      const newProject = this.projectId !== saveData.projectId;
      this.projectId = saveData.projectId;
      dataObj.projectId = this.projectId;
      if ( newProject ) {
        dataObj.deleteEvents = 1;

        // maybe merge stuff instead?
        saveData.mapping = this.getDefaultMapping( saveData.form );

        this.card = this.getCardFromMapping( this.mapping );
        dataObj.card = 0;
      } else {
        this.card = null;
      }
    }

    if ( 'mapping' in saveData ) {
      dataObj.deleteEvents = 1;
      this.mapping = saveData.mapping;
      const {
        fields, additionalFields, availableFields, dateFields, locationFields, nameFields, timeFields
      } = this.mapping;
      dataObj.mapping = {
        fields,
        availableFields,
        dateFields,
        locationFields,
        nameFields,
        additionalFields,
        timeFields
      };
      if ( !( 'card' in dataObj ) ) {
        // if a card previously existed, save a default card based on existing and new mapping
        // otherwise, save null
        dataObj.card = this.card ? this.getCardFromMapping( this.mapping, this.card ) : 0;
        this.card = null;
      }
    }

    console.log( 'saving', dataObj );

    // Get WP admin AJAX URL and data
    const url = getMapGlobalMeta.ajaxUrl;

    // Create the form that constitutes the AJAX request body
    const formData = getFormData( dataObj );
    formData.append( 'action', 'iip_map_save_fields_ajax' );
    formData.append( 'security', getMapGlobalMeta.screendoorNonce );

    // AJAX POST request to save screendoor project data
    return axios.post( url, formData ).then( resp => resp.data );
  };

  saveEvents = events => axios.post( getMapGlobalMeta.ajaxUrl, getFormData( {
    events,
    security: getMapGlobalMeta.screendoorNonce,
    action: 'iip_map_save_events_ajax',
    postId: this.postId,
    projectId: this.projectId
  } ) ).then( resp => resp.data );

  request = ( type, params = {}, projectId = this.projectId ) => axios.get( `${SCREENDOOR_URL}${projectId}/${type}`, {
    params: { v: 0, api_key: this.apiKey, ...params },
    timeout: 5000
  } ).then( resp => resp.data );

  getEventsRequester = ( perPage = 1 ) => page => this.request( 'responses', { page, per_page: perPage } );

  getSample = mapping => new Promise( ( resolve, reject ) => {
    this.request( 'responses', { per_page: 1 } )
      .then( ( result ) => {
        if ( !result || result.length < 1 ) return reject();
        const {
          nameFields, locationFields, dateFields, timeFields, additionalFields
        } = mapping;
        const mapFields = ( resps, map ) => {
          const fields = [];
          map.forEach( ( { field, name } ) => {
            if ( field in resps ) fields.push( { field, label: name, value: resps[field] } );
          } );
          return fields;
        };
        const events = [];
        result.forEach( ( eventData ) => {
          const { responses } = eventData;
          events.push( {
            ext_id: eventData.id,
            groups: [
              {
                name: 'title',
                fields: mapFields( responses, nameFields )
              },
              {
                name: 'location',
                fields: mapFields( responses, locationFields )
              },
              {
                name: 'date',
                fields: mapFields( responses, dateFields )
              },
              {
                name: 'time',
                fields: mapFields( responses, timeFields )
              },
              {
                name: 'added',
                fields: mapFields( responses, additionalFields )
              }
            ]
          } );
        } );
        resolve( events );
      } )
      .catch( ( err ) => {
        console.error( err );
        reject( err );
      } );
  } );

  geocode = () => axios.post( getMapGlobalMeta.ajaxUrl, getFormData( {
    security: getMapGlobalMeta.screendoorNonce,
    action: 'iip_map_geocode_events_ajax',
    postId: this.postId,
    projectId: this.projectId
  } ) ).then( resp => resp.data );

  getDefaultMapping = ( form ) => {
    const fields = getObjectFromArray( form );
    const available = Array.from( form );
    return {
      form,
      fields,
      availableFields: available,
      additionalFields: [],
      dateFields: [],
      locationFields: [],
      nameFields: [],
      timeFields: []
    };
  };

  /**
   * Retreive fields from the Screendoor API
   * @returns {Promise<Array | never>}
   */
  getFields = projectId => this.request( 'form', null, projectId ).then( ( response ) => {
    if ( 'field_data' in response ) {
      // eslint-disable-next-line camelcase
      return response.field_data.map( ( { label, id, field_type } ) => ( {
        field: id, name: label, fieldType: field_type
      } ) );
    }
    return [];
  } );

  /**
   * Generate default Card meta based on what is available in the provided mapping.
   * @param data
   * @param state
   * @returns object
   */
  getCardFromMapping = ( data, state = null ) => {
    const titleHasFields = !!( ( data.nameFields && data.nameFields.length > 0 ) );
    const dateHasFields = !!( ( data.dateFields && data.dateFields.length > 0 ) );
    const timeHasFields = !!( ( data.timeFields && data.timeFields.length > 0 ) );
    const locationHasFields = !!( ( data.locationFields && data.locationFields.length > 0 ) );
    const addHasFields = !!( ( data.additionalFields && data.additionalFields.length > 0 ) );
    const card = {
      titleSection: {
        postTitle: '',
        preTitle: '',
        hasFields: titleHasFields,
        toggled: titleHasFields
      },
      dateSection: {
        heading: 'When:',
        hasFields: dateHasFields,
        toggled: dateHasFields
      },
      timeSection: {
        timeFormat: '12hour',
        hasFields: timeHasFields,
        toggled: timeHasFields
      },
      locationSection: {
        heading: 'Where:',
        hasFields: locationHasFields,
        toggled: locationHasFields
      },
      additionalSection: {
        hasFields: addHasFields,
        toggled: addHasFields
      },
      added: []
    };
    if ( state ) {
      Object.keys( card ).forEach( ( key ) => {
        if ( key === 'added' ) return;
        // the toggle is always dependent on whether or not the section has mapped fields
        let toggle = card[key].hasFields;
        if ( card[key].hasFields === state[key].hasFields ) {
          // if both had fields at the time of toggling, we can trust the previous toggle state
          toggle = state[key].toggled;
        }
        card[key] = {
          ...card[key],
          ...state[key],
          hasFields: card[key].hasFields,
          toggled: toggle
        };
      } );
      if ( addHasFields ) {
        state.added.forEach( ( item ) => {
          const exists = data.additionalFields.find( f => f.field === item.field );
          if ( exists ) card.added.push( item );
        } );
      }
    }
    return card;
  };

  parseSection = ( map, fields, type = null ) => {
    const vals = [];
    switch ( type ) {
      case 'date': return '';
      case 'time': return '';
      default:
        map.forEach( ( { field } ) => {
          if ( field in fields && fields[field] ) {
            vals.push( fields[field].replace( /^[ \t\r\n]+|[ \t\r\n]+$/g, '' ) );
          }
        } );
        return vals.join( ', ' );
    }
  };

  /**
   * Populate from raw event data according to the field mapping storing only requested field values.
   * @param id
   * @param responses
   * @returns {{ext_id: *, location: string, title: string, fields: {}}}
   */
  applyMapping = ( { id, responses } ) => {
    const event = {
      ext_id: id,
      title: '',
      location: '',
      fields: {}
    };
    Object.keys( this.mapping ).forEach( ( key ) => {
      if ( key === 'fields' || key === 'availableFields' ) return;
      this.mapping[key].forEach( ( { field } ) => {
        if ( field in responses ) {
          event.fields[field] = responses[field];
        }
      } );
    } );
    event.title = this.parseSection( this.mapping.nameFields, event.fields );
    event.location = this.parseSection( this.mapping.locationFields, event.fields );
    return event;
  };
}
const screendoorProject = new ScreendoorProject();

export default screendoorProject;

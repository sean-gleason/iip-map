import axios from 'axios';
import {
  getMapGlobalMeta,
  getScreendoorFields,
  getScreendoorCard,
  getMapMeta, getMapEvents
} from './globals';
import { getFormData } from './screendoor';

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

  update = ( {
    form, mapping, card, projectId
  } ) => {
    this.form = form;
    this.mapping = mapping;
    this.card = card;
    this.projectId = projectId;
  };

  /**
   * Save field mapping and card configuration in WordPress via AJAX call.
   * @param form
   * @param card
   * @param mapping
   * @param projectId
   * @returns {Promise<AxiosResponse<T>>}
   */
  save = ( {
    form, card, mapping, projectId
  } ) => {
    const {
      fields, additionalFields, availableFields, dateFields, locationFields, nameFields, timeFields
    } = mapping;
    this.projectId = projectId;
    this.form = form;
    this.card = card;
    this.mapping = mapping;

    if ( !this.card ) {
      this.card = this.getCardFromMapping( this.mapping );
    }

    const dataObj = {
      projectId: this.projectId,
      form: this.form,
      card: this.card,
      postId: this.postId,
      mapping: {
        fields,
        available: availableFields,
        date: dateFields,
        location: locationFields,
        name: nameFields,
        other: additionalFields,
        time: timeFields
      }
    };

    if ( !this.postId ) {
      return Promise.reject( new Error( 'No post id' ) );
    }

    // Get WP admin AJAX URL and data
    const url = getMapGlobalMeta.ajaxUrl;

    // Create the form that constitutes the AJAX request body
    const formData = getFormData( dataObj );
    formData.append( 'action', 'save_screendoor_ajax' );
    formData.append( 'security', getMapGlobalMeta.screendoorNonce );

    // AJAX POST request to save screendoor project data
    return axios.post( url, formData ).then( resp => resp.data );
  };

  request = ( type, params = {} ) => axios.get( `${SCREENDOOR_URL}${this.projectId}/${type}`, {
    params: { v: 0, api_key: this.apiKey, ...params },
    timeout: 5000
  } ).then( resp => resp.data );

  /**
   * Retreive a specific number of events from the Screendoor API.
   * @param perPage
   * @param page
   * @returns {Promise<any | never>}
   */
  getEvents = ( perPage = 1, page = 1 ) => this.request( 'responses', { page, per_page: perPage } );

  getEventsPager = ( perPage = 1 ) => {
    const doRequest = page => this.request( 'responses', { page, per_page: perPage } );
    return {
      page: 0,
      next() {
        this.page += 1;
        return doRequest( this.page );
      }
    };
  };

  getGeocoder = () => axios.post( getMapGlobalMeta.ajaxUrl, getFormData( {
    security: getMapGlobalMeta.screendoorNonce,
    action: 'geocode_events_ajax',
    postId: this.postId,
    projectId: this.projectId
  } ) ).then( resp => resp.data );

  /**
   * Retreive fields from the Screendoor API
   * @returns {Promise<Array | never>}
   */
  getFields = () => this.request( 'form' ).then( ( response ) => {
    const fields = [];
    if ( 'field_data' in response ) {
      const fieldData = response.field_data;
      fieldData.forEach( ( { label, id } ) => fields.push( { field: id, name: label } ) );
    }
    return fields;
  } );

  /**
   * Generate default Card meta based on what is available in the provided mapping.
   * @param data
   * @param state
   * @returns object
   */
  getCardFromMapping = ( data, state = null ) => {
    const result = {
      titleSection: {
        postTitle: '',
        preTitle: '',
        toggled: !!( ( data.nameFields && data.nameFields.length > 0 ) )
      },
      dateSection: {
        heading: 'When:',
        toggled: !!( ( data.dateFields && data.dateFields.length > 0 ) )
      },
      timeSection: {
        timeFormat: '12hour',
        toggled: !!( ( data.timeFields && data.timeFields.length > 0 ) )
      },
      locationSection: {
        heading: 'Where:',
        toggled: !!( ( data.locationFields && data.locationFields.length > 0 ) )
      },
      additionalSection: {
        toggled: !!( ( data.additionalFields && data.additionalFields.length > 0 ) )
      },
      added: []
    };
    if ( state ) {
      result.titleSection.postTitle = state.titleSection.postTitle;
      result.titleSection.preTitle = state.titleSection.preTitle;
      state.added.forEach( ( item ) => {
        const exists = data.additionalFields.find( f => f.field === item.field );
        if ( exists ) result.added.push( item );
      } );
    }
    return result;
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

  saveEvents = events => axios.post( getMapGlobalMeta.ajaxUrl, getFormData( {
    events,
    security: getMapGlobalMeta.screendoorNonce,
    action: 'save_screendoor_events_ajax',
    postId: this.postId,
    projectId: this.projectId
  } ) ).then( resp => resp.data );
}
const screendoorProject = new ScreendoorProject();

export default screendoorProject;

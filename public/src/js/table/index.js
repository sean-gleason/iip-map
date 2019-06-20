import React, { Component } from 'react';
import SearchIcon from '../../../images/search.svg';

// Import shortcode parameters
const mapID = iip_map_params.map_id; // eslint-disable-line no-undef, camelcase
const baseURL = `/wp-json/iip-map/v1/maps/${mapID}`; // eslint-disable-line prefer-template
const { mapping } = iip_map_params; // eslint-disable-line no-undef, camelcase
const { card } = iip_map_params; // eslint-disable-line no-undef, camelcase

// convert 12 to 24 hour format if user chooses to
const convertTime12to24 = ( time12h ) => {
  const [time, modifier] = time12h.split( ' ' );
  let [hours, minutes] = time.split( ':' ); // eslint-disable-line prefer-const
  if ( hours === '12' ) {
    hours = '00';
  }
  if ( modifier === 'PM' ) {
    hours = parseInt( hours, 10 ) + 12;
  }
  return `${hours}:${minutes}`;
};

// map mapped fields to available fields based on screendoor ID
const parseSection = ( sectionMap, fields ) => {
  const vals = [];

  sectionMap.forEach( ( { fieldType, field } ) => {
    // http://dobtco.github.io/screendoor-api-docs/#spec-for-the-response-hash
    switch ( fieldType ) {
      case 'text':
      case 'paragraph':
      case 'dropdown':
      case 'email':
      case 'phone':
      case 'numeric':
      case 'website':
        if ( field in fields && fields[field] ) {
          vals.push( fields[field].replace( /^[ \t\r\n]+|[ \t\r\n]+$/g, '' ) );
        }
        break;
      case 'date':
      case 'time':
      case 'address':
      case 'price':
        if ( field in fields && fields[field] ) {
          vals.push( fields[field] );
        }
        break;
      case 'radio':
        if ( field in fields && fields[field] ) {
          vals.push( fields[field] );
        }
        break;
      default:
        if ( field in fields && fields[field] ) {
          vals.push( fields[field] );
        }
        return '';
    }
  } );
  return vals;
};

const buildSection = ( field, sectionName = '' ) => {
  switch ( sectionName ) {
    case 'date':
      return card.date.toggled ? `${field[0].month}/${field[0].day}/${field[0].year}` : '';
    case 'time':
      if ( card.time.toggled === true ) {
        if ( card.time.timeFormat === '24hour' ) {
          const time = convertTime12to24( `${field[0].hours}:${field[0].minutes} ${field[0].am_pm}` );
          return `${time}`;
        }
        if ( card.time.timeFormat === '12hour' ) {
          return `${field[0].hours}:${field[0].minutes} ${field[0].am_pm}`;
        }
      } else {
        return '';
      }
      break;
    default: return '';
  }
};

// build additional data section
// broken into it's own function due to the need to lop through mapped fields
const buildAdditional = ( field ) => {
  let fieldArr;
  let markup = '';
  const added = card.added_arr;
  if ( field.constructor === Array ) {
    fieldArr = field;
    // pull out field id
    added.forEach( ( o, i ) => {
      // check that field has value before proceeding
      if ( fieldArr[i] ) {
        if ( fieldArr[i].checked ) {
          markup += `${fieldArr[i]}`;
        } else {
          markup += `${fieldArr[i]}`;
        }
      }
    } );
  } else {
    fieldArr = field.split( ',' );
    added.forEach( ( o, i ) => {
      markup += `${fieldArr[i]}`;
    } );
  }
  return markup;
};

class Table extends Component {
  state = {
    isLoading: true,
    filter: '',
    events: [],
    error: null
  };

  componentDidMount() {
    this.fetchEvents();
  }

  handleChange = ( event ) => {
    this.setState( { filter: event.target.value } );
  };

  fetchEvents() {
    fetch( baseURL )
      .then( response => response.json() )
      .then( data => this.setState( {
        events: data.features,
        isLoading: false
      } ) )
      .catch( error => this.setState( { error, isLoading: false } ) );
  }

  render() {
    const {
      isLoading, events, error, filter
    } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = events.filter( event => Object.keys( event )
      .some( key => JSON.stringify( event[key] ).toLowerCase().includes( lowercasedFilter ) ) );

    return (
      <React.Fragment>
        <div className="table-controls"><input style={ { backgroundImage: `url(${SearchIcon})` } } className="event-table__filter" placeholder="Type to search" value={ filter } onChange={ this.handleChange } /></div>
        <div className="event-table">
          { error ? <p>{ error.message }</p> : null }
          { !isLoading ? (
            <React.Fragment>
              <div className="column-labels">
                <div className="label">Name & Description</div>
                <div className="label">Topic</div>
                <div className="label">Date & Time</div>
                <div className="label">Location</div>
                <div className="label">Additional Info</div>
              </div>
            </React.Fragment>
          ) : null }
          { !isLoading ? (
            filteredData.map( ( event ) => {
              const { fields } = event.properties;
              const titleField = parseSection( mapping.name_arr, fields );
              const dateField = parseSection( mapping.date_arr, fields );
              const timeField = parseSection( mapping.time_arr, fields );
              const additionalData = parseSection( mapping.other_arr, fields );
              console.log(additionalData);
              return (
                <div className="event-table__row event">
                  <h3>{ titleField }</h3>
                  <div className="topic">{ event.properties.topic }</div>
                  <div className="date">
                    { buildSection( dateField, 'date' ) }
                    <br />
                    { buildSection( timeField, 'time' ) }
                  </div>
                  <div className="location">
                    { event.properties.location }
                  </div>
                  <div className="contact">
                    { buildAdditional( additionalData ) }
                  </div>
                </div>
              );
            } )
          ) : (
            <h3>Loading...</h3>
          ) }
        </div>
      </React.Fragment>
    );
  }
}

export default Table;

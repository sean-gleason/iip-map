// ie 11 compatibility
import 'isomorphic-fetch';
import { polyfill } from 'es6-promise';


polyfill();

import React, { Component } from 'react';
import SearchIcon from '../../../images/search.svg';

// Import shortcode parameters
const mapID = iip_map_params.map_id; // eslint-disable-line no-undef, camelcase
const baseURL = `/wp-json/iip-map/v1/maps/${mapID}`; // eslint-disable-line prefer-template
const { mapping } = iip_map_params; // eslint-disable-line no-undef, camelcase
const { card } = iip_map_params; // eslint-disable-line no-undef, camelcase
// today's date
const todaysDate = new Date();
// we are making the assumption that events take place in the current year
const currentYear = todaysDate.getFullYear();

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
      return card.date.toggled ? `${field[0].month}/${field[0].day}/${currentYear}` : '';
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

const pages = ( filteredData, pageNavMarker, totalPages ) => {
  let pagesArray = [];
  for ( let i = 1; i <= totalPages; i += 1 ) {
    pagesArray.push( i );
  }

  if ( pagesArray.length > 5 ) {
    pagesArray = pagesArray.slice( pageNavMarker, ( pageNavMarker + 5 ) );
  }

  return pagesArray;
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
          markup += `\n${fieldArr[i].checked}`;
        } else {
          markup += `\n${fieldArr[i]}`;
        }
      }
    } );
  } else {
    fieldArr = field.split( ',' );
    added.forEach( ( o, i ) => {
      markup += `\n${fieldArr[i]}`;
    } );
  }
  return markup;
};

class Table extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      isLoading: true,
      filter: '',
      events: [],
      error: null,
      checked: true,
      page: 0,
      offset: 100,
      pageNavMarker: 0,
      activeId: null
    };
    this.handleCheckboxChange = this.handleCheckboxChange.bind( this );
  }

  componentDidMount() {
    this.fetchEvents();
  }

  handleChange = ( event ) => {
    this.setState( { filter: event.target.value } );
  };

  handleCheckboxChange = ( event ) => {
    this.setState( { checked: !event.target.checked } );
    this.setState( { page: 0 } );
    this.setState( { offset: 100 } );
    this.setState( { pageNavMarker: 0 } );
    this.setState( { activeId: null } );
  };

  changePage = ( event ) => {
    // need to fix becouse this is async and there maybe a delay
    let targetPage = event.target.value - 1;
    targetPage *= 100;
    let targetOffset = targetPage;
    targetOffset += 100;
    this.setState( { page: targetPage } );
    this.setState( { offset: targetOffset } );
    this.setState( { pageNavMarker: ( event.target.value - 3 > 0 ) ? event.target.value - 3 : 0 } );
    this.setState( { activeId: event.target.value } );
  }

  changePagePrev = () => {
    const currentPageNavMarker = this.state.pageNavMarker;
    if ( currentPageNavMarker - 5 > 0 ) {
      this.setState( { pageNavMarker: ( currentPageNavMarker - 5 ) } );
    } else {
      this.setState( { pageNavMarker: 0 } );
    }
  }

  changePageNext = ( totalPages ) => {
    const pageNavMarker = this.state.pageNavMarker;
    if ( ( pageNavMarker + 5 ) >= totalPages ) {
      this.setState( { pageNavMarker: totalPages } );
    } else {
      this.setState( { pageNavMarker: ( pageNavMarker + 5 ) } );
    }
  }

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
      isLoading, events, error, filter, checked
    } = this.state;

    const lowercasedFilter = filter.toLowerCase();
    let filteredData = events.filter( event => Object.keys( event )
      .some( key => JSON.stringify( event[key] ).toLowerCase().includes( lowercasedFilter ) ) );

    if ( checked ) {
      filteredData = filteredData.filter( ( eventData ) => {
        const { fields } = eventData.properties;
        const dateField = parseSection( mapping.date_arr, fields );
        if ( dateField.length < 1 || !dateField[0].month || !dateField[0].day ) {
          return true;
        }
        const eventDate = new Date( currentYear, ( dateField[0].month - 1 ), dateField[0].day );
        return todaysDate <= eventDate;
      } );
    }


    const totalPages = Math.ceil( filteredData.length / 100 );
    const pageNavStart = <button type="button" onClick={ e => this.changePagePrev() }>Prev </button>;
    const pageNavEnd = <button type="button" onClick={ e => this.changePageNext( totalPages ) }>  Next</button>;

    return (
      <React.Fragment>
        <div className="table-controls">
          <div className="counter">
            Viewing
            <span>{ filteredData.length }</span>
            Results
          </div>
          <input
            style={ { backgroundImage: `url(${SearchIcon})` } }
            className="event-table__filter"
            placeholder="Type to search"
            value={ filter }
            onChange={ this.handleChange }
          />

        </div>
        <div className="table-check-wrap">
          <label htmlFor="tableCheck">
            <input id="tableCheck" type="checkbox" value={ checked } onChange={ this.handleCheckboxChange } />
            Show All Events
          </label>
        </div>
        <div className="pagesWrapper">
          { filteredData.length > 100 && this.state.pageNavMarker !== 0 ? pageNavStart : null }
          { filteredData.length > 100 ? (
            pages( filteredData, this.state.pageNavMarker, totalPages ).map( page => (
              <button
                type="button"
                key={ page.toString() }
                onClick={ e => this.changePage( e, 'value' ) }
                value={ page.toString() }
                className={ this.state.activeId === page.toString() ? 'is-active' : '' }
              >
                { page }
              </button>
            ) )
          ) : null }
          { filteredData.length > 100 && !( ( this.state.pageNavMarker + 5 ) >= totalPages ) ? pageNavEnd : null }
        </div>
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
            filteredData.slice( this.state.page, this.state.offset ).map( ( event ) => {
              const { fields } = event.properties;
              const titleField = event.properties.title;
              const dateField = parseSection( mapping.date_arr, fields );
              const timeField = parseSection( mapping.time_arr, fields );
              const additionalData = parseSection( mapping.other_arr, fields );
              return (
                <div
                  className="event-table__row event"
                  key={ event.properties.ext_id }
                  data-sdid={ event.properties.ext_id }
                >
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
                    { buildAdditional( additionalData ).split( '\n' ).map( row => (
                      <div key={ Math.random() * 1000 }>
                        { row }
                      </div>
                    ) ) }
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

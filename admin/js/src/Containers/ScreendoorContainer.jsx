import React, { Component } from 'react';

import FormSelector from '../Components/Metaboxes/FormSelector';
import ScreendoorFieldMapper from './Modals/ScreendoorFieldMapper';
import ScreendoorConfigureCard from './Modals/ScreendoorConfigureCard';

import { getData } from '../utils/screendoor';
import { getMapGlobalMeta, getScreendoorFieldsMeta } from '../utils/globals';

class ScreendoorContainer extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      apiKey: getMapGlobalMeta.screendoorKey,
      data: [],
      display: 'mapper',
      projectId: getScreendoorFieldsMeta.projectId
    };

    this.selectView = this.selectView.bind( this );
    this.setProjectId = this.setProjectId.bind( this );
    this.handleScreendoor = this.handleScreendoor.bind( this );
  }

  setProjectId( event ) {
    this.setState( { projectId: event.target.value } );
  }

  selectView( event ) {
    this.setState( { display: event } );
  }

  handleScreendoor() {
    const { apiKey, projectId } = this.state;

    this._loadData( projectId, apiKey );
  }

  _loadData( projectId, apiKey ) {
    function handleErrors( response ) {
      if ( !response.ok ) {
        throw Error( response.statusText );
      }
      return response.json();
    }

    fetch( `https://screendoor.dobt.co/api/projects/${projectId}/form?&v=0&api_key=${apiKey}` )
      .then( handleErrors )
      .then( response => this.setState( { data: getData( response ) } ) )
      .catch( error => console.log( error ) );
  }

  render() {
    const {
      apiKey, data, display, projectId
    } = this.state;

    return (
      <div className="iip-map-admin-screendoor">
        <FormSelector
          apiKey={ apiKey }
          formType="screendoor"
          getFields={ this.handleScreendoor }
          projectId={ projectId }
          selectView={ this.selectView }
          setId={ this.setProjectId }
        />
        <div className="iip-map-admin-screendoor-modal">
          { ( display === 'mapper' ) && (
            <ScreendoorFieldMapper data={ data } />
          ) }
          { ( display === 'card' ) && (
            <ScreendoorConfigureCard />
          ) }
        </div>
      </div>
    );
  }
}

export default ScreendoorContainer;

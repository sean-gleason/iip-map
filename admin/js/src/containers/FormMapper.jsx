import React, { Component } from 'react';

import FormSelector from '../Components/Metaboxes/FormSelector';
import ScreendoorModal from './Modals/ScreendoorModal';

import { getData } from '../utils/screendoor';
import { getMapGlobalMeta, getScreendoorFieldsMeta } from '../utils/globals';

class FormMapper extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      apiKey: getMapGlobalMeta.screendoorKey,
      data: [],
      formType: '',
      projectId: getScreendoorFieldsMeta.projectId,
      showModal: false
    };

    this.setProjectId = this.setProjectId.bind( this );
    this.chooseFormType = this.chooseFormType.bind( this );
    this.handleScreendoor = this.handleScreendoor.bind( this );
  }

  setProjectId( event ) {
    this.setState( { projectId: event.target.value } );
  }

  chooseFormType( event ) {
    this.setState( { formType: event.target.value } );
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
      .then( response => this.setState( { data: getData( response ), showModal: true } ) )
      .catch( error => console.log( error ) );
  }

  render() {
    const {
      apiKey, data, formType, projectId, showModal
    } = this.state;

    return (
      <div className="postbox">
        <h2 className="iip-map-admin-metabox-header">Map Input Fields</h2>
        <div className="inside">
          <p>Use this form to map the form values from your data input source.</p>
          { /* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */ }
          <label htmlFor="iip-map-admin-form-select">
            Select input type:
            <select id="iip-map-admin-form-select" onChange={ this.chooseFormType } value={ formType }>
              <option value="">- Select Input -</option>
              <option value="formidable">Formidable</option>
              <option value="screendoor">Screendoor</option>
            </select>
          </label>

          { ( formType === 'screendoor' ) && (
            <div className="iip-map-admin-screendoor">
              <FormSelector
                apiKey={ apiKey }
                formType="screendoor"
                projectId={ projectId }
                setId={ this.setProjectId }
                getFields={ this.handleScreendoor }
              />
              <ScreendoorModal
                apiKey={ apiKey }
                data={ data }
                projectId={ projectId }
                show={ showModal }
              />
            </div>
          ) }

          { ( formType === 'formidable' ) && (
            <FormSelector formType="formidable" projectId={ projectId } setId={ this.setProjectId } />
          ) }

          <div id="formmapper-grid" className="" />
        </div>
      </div>
    );
  }
}

export default FormMapper;

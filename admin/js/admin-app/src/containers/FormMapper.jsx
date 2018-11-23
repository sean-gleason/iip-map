import React, { Component } from 'react';

import FormSelector from '../components/Metaboxes/FormSelector';
import ScreendoorModal from '../components/Modals/ScreendoorModal';

import { getData } from '../utils/screendoor';
import { screendoorApiKey } from '../utils/globals';

class FormMapper extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      apiKey: screendoorApiKey,
      formType: '',
      projectId: '',
      showModal: false,
      data: null
    };

    this.setProjectId = this.setProjectId.bind( this );
    this.chooseFormType = this.chooseFormType.bind( this );
    this.handleScreendoor = this.handleScreendoor.bind( this );
  }

  componentDidUpdate( prevProps, prevState ) {
    const { apiKey, projectId } = this.state;

    if ( projectId !== prevState.projectId ) {
      this._loadData( projectId, apiKey );
    }
  }

  setProjectId( event ) {
    this.setState( { projectId: event.target.value } );
  }

  chooseFormType( event ) {
    this.setState( { formType: event.target.value } );
  }

  handleScreendoor() {
    this.setState( { showModal: true } );
  }

  _loadData( projectId, apiKey ) {
    fetch( `https://screendoor.dobt.co/api/projects/${projectId}/form?&v=0&api_key=${apiKey}` )
      .then( r => r.json() )
      .then( response => this.setState( { data: getData( response ) } ) );
  }

  render() {
    const {
      apiKey, data, formType, projectId, showModal
    } = this.state;

    return (
      <div className="postbox">
        <h2 className="iip-map-admin-metabox-header hndle ui-sortable-handle">Map Input Fields</h2>
        <div className="inside">
          <p>Use this form to map the form values from your data input source.</p>
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

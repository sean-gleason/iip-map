import React, { Component } from 'react';

import FormSelector from '../components/Metaboxes/FormSelector';
import ScreendoorModal from '../components/Modals/ScreendoorModal';

class FormMapper extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      formType: '',
      projectId: ''
    };

    this.setProjectId = this.setProjectId.bind( this );
    this.chooseFormType = this.chooseFormType.bind( this );
  }

  setProjectId( event ) {
    this.setState( { projectId: event.target.value } );
  }

  chooseFormType( event ) {
    this.setState( { formType: event.target.value } );
  }

  render() {
    const { formType, projectId } = this.state;

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
              <FormSelector formType="screendoor" projectId={ projectId } setId={ this.setProjectId } />
              <ScreendoorModal projectId={ projectId } />
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

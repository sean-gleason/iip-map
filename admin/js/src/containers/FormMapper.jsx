import React, { Component } from 'react';

import { MapContext } from '../Components/AdminSections/MapAdminMain';
import FormidableContainer from './FormidableContainer';
import ScreendoorContainer from './ScreendoorContainer';

import { getMapMeta } from '../utils/globals';

class FormMapper extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      formType: getMapMeta.formType
    };

    this.chooseFormType = this.chooseFormType.bind( this );
  }

  chooseFormType( event ) {
    this.setState( { formType: event.target.value } );
  }

  render() {
    const { formType } = this.state;

    return (
      <div className="postbox">
        <h2 className="iip-map-admin-metabox-header">Map Input Fields</h2>
        <div className="inside">
          <p>Use this form to map the form values from your data input source.</p>
          { /* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */ }
          <label htmlFor="formType">
            Select input type:
            <select
              id="iip-map-admin-form-select"
              name="formType"
              onChange={ this.chooseFormType }
              value={ formType }
            >
              <option value="">- Select Input -</option>
              <option value="formidable">Formidable</option>
              <option value="screendoor">Screendoor</option>
            </select>
          </label>

          { ( formType === 'screendoor' ) && (
            <MapContext.Consumer>
              { ( {
                project, setProject, setUpdated
              } ) => (
                <ScreendoorContainer
                  project={ project }
                  setProject={ setProject }
                  conSetUpdated={ setUpdated }
                />
              ) }
            </MapContext.Consumer>
          ) }

          { ( formType === 'formidable' ) && (
            <FormidableContainer
              projectId=""
            />
          ) }

          <div id="formmapper-grid" className="" />
        </div>
      </div>
    );
  }
}

export default FormMapper;

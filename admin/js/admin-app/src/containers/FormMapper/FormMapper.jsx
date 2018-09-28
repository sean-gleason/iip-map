import React, { Component } from 'react';

import FieldInput from '../../components/FieldInput/FieldInput';
import FormSelector from '../../components/FormSelector/FormSelector';

class FormMapper extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      formType: null
    };

    this.chooseFormType = this.chooseFormType.bind(this);
  }

  chooseFormType( event ) {
    this.setState({ formType: event.target.value });
  }

  render() {
    const { formType } = this.state; 

    return (
      <div className="iip-map-admin-formmapper postbox">
        <p>Use this form to map the form values from your data input source.</p>
        <label>Select input type</label>
        <select onChange={ this.chooseFormType } value={ this.state.formType } >
          <option value="">- Select Input -</option>
          <option value="formidable">Formidable</option>
          <option value="screendoor">Screendoor</option>
        </select>
        
        { ( formType === 'screendoor' ) && (
          <FormSelector formType={'screendoor'} />
        ) }
        
        { ( formType === 'formidable' ) && (
          <FormSelector formType={'formidable'} />
        ) }
        
        <FieldInput />
        <div id="formmapper-grid" className=""/>
      </div>
    )
  }
}

export default FormMapper;
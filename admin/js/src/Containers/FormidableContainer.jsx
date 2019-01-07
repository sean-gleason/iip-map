import React, { Component } from 'react';

import FormSelector from '../Components/Metaboxes/FormSelector';

class FormidableContainer extends Component {
  render() {
    return (
      <div className="iip-map-admin-screendoor">
        <FormSelector
          formType="formidable"
        />
      </div>
    );
  }
}

export default FormidableContainer;

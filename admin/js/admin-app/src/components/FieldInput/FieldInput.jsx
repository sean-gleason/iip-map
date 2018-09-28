import React from 'react';

import { mapFormFields } from '../../utils/formmapper';

const FieldInput = props => (
  <div className="map-screendoor-fields">
    <form>
      <label>
        Field Name:
        <input id="" name="" />
      </label>
      <label>
        Field Id:
        <input id="" name="" />
      </label>
    </form>
    
    <button
      className="button button-primary button-large"
      type="button"
      id="iip-map-add-field"
    >Add Field</button>
  </div>
)

export default FieldInput;
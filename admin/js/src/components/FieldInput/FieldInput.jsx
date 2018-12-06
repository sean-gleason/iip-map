import React from 'react';

import { mapFormFields } from '../../utils/formmapper';

const FieldInput = props => (
  <div className="iip-map-admin-screendoor-fields">
    <form>
      <label htmlFor="iip-map-admin-field-name">
        Field Name:
        <input id="iip-map-admin-field-name" name="" />
      </label>
      <label htmlFor="iip-map-admin-field-id">
        Field Id:
        <input id="iip-map-admin-field-id" name="" />
      </label>
    </form>

    <button
      className="button button-primary button-large"
      type="button"
      id="iip-map-admin-add-field"
    >
      Add Field
    </button>
  </div>
);

export default FieldInput;

import React from 'react';

import { capitalize } from '../../utils/texttransforms';

const FormSelector = ( { formType } ) => (
  <div id={ `${formType}-project-selector` }>
    <form>
      <label>
        { capitalize(formType) } Project ID:
        <input id={ `${formType}-project-id` } name={ `${formType}-project-id` } />
      </label>
    </form>
    
    <button
      className="button button-primary button-large"
      type="button"
      id={ `iip-map-select-${formType}-project` }
    >Select This Project</button>

  </div>
)

export default FormSelector;
import React from 'react';
import { object } from 'prop-types';

const ScreendoorModal = ( { data } ) => (
  <div className="iip-map-admin-screendoor-modal">
    { data && (
      <ul>
        { data.map( el => (
          <li>
            { el.name }
            { ' - ' }
            { el.field }
          </li>
        ) ) }
      </ul>
    ) }
  </div>
);

ScreendoorModal.propTypes = {
  data: object
};

export default ScreendoorModal;

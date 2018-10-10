import React, { Component } from 'react';
import { string } from 'prop-types';

import { getScreendoorFields } from '../../utils/screendoor';

class ScreendoorModal extends Component { 

  render() {
    const { projectId } = this.props;
    let fields = [];

    if ( projectId ) {
      fields = getScreendoorFields( projectId, '' );
      console.log(fields);
    }

    return (
      <div className="iip-map-admin-screendoor-modal">
        { fields && (
          <ul>
            { fields.map( name => <li>{ name }</li> ) }
          </ul>
        ) }
      </div>
    );
  }
}

ScreendoorModal.propTypes = {
  projectId: string
};

export default ScreendoorModal;

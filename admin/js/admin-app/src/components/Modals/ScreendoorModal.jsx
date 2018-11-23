import React, { Component } from 'react';
import { bool, string } from 'prop-types';

import { getScreendoorFields } from '../../utils/screendoor';

class ScreendoorModal extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      fields: null
    };
  }

  static getDerivedStateFromProps( props, state ) {
    if ( props.show !== state.prevShow ) {
      return {
        fields: null,
        prevShow: props.show
      };
    }
    return null;
  }

  componentDidMount() {
    const { show } = this.props;

    this._loadAsyncData( show );
  }

  componentDidUpdate( prevProps, prevState ) {
    const { fields } = this.state;
    const { show } = this.props;

    if ( fields === null ) {
      this._loadAsyncData( show );
    }
  }

  componentWillUnmount() {
    if ( this._asyncRequest ) {
      this._asyncRequest.cancel();
    }
  }

  // async componentDidUpdate( prevProps ) {
  //   const { apiKey, projectId, show } = this.props;

  //   if ( show !== prevProps.show && show === true ) {
  //     const fieldList = await getScreendoorFields( projectId, apiKey );

  //     this.setState( {
  //       fields: fieldList
  //     } );
  //   }
  // }

  async _loadAsyncData( show ) {
    const { apiKey, projectId } = this.props;

    if ( !show ) {
      return;
    }

    const fields = await getScreendoorFields( projectId, apiKey );
    console.log(fields);
  }

  render() {
    return (
      <div className="iip-map-admin-screendoor-modal">
        {/* { fields && (
          <ul>
            { fields.map( name => <li>{ name }</li> ) }
          </ul>
        ) } */}
      </div>
    );
  }
}

ScreendoorModal.propTypes = {
  apiKey: string,
  projectId: string,
  show: bool
};

export default ScreendoorModal;

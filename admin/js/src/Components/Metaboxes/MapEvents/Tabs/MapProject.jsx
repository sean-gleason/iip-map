import React, { Fragment, useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import TabControls from './TabControls';

const MapProject = ( { projectId, doSave, setDirtyTab } ) => {
  const [id, setId] = useState( projectId !== null ? projectId : '' );
  const [errors, setErrors] = useState( [] );

  const checkErrors = () => {
    if ( !id.match( /^[0-9]+$/ ) ) {
      setErrors( ['Invalid project ID'] );
      return true;
    }
    setErrors( [] );
    return false;
  };

  const handleSave = () => {
    if ( !checkErrors() ) {
      doSave( id )
        .then( () => setDirtyTab( false ) )
        .catch( ( err ) => {
          if ( err.error ) {
            setErrors( [`API Error: ${err.error}`] );
          } else {
            setErrors( [err.toString()] );
          }
        } );
    }
  };

  const handleChange = ( e ) => {
    const newId = e.target.value;
    setId( newId );
    setDirtyTab( newId !== projectId );
  };

  useEffect( () => {
    if ( !projectId && !id ) return;
    checkErrors();
  }, [id] );

  const showWarning = projectId && id && projectId !== id;

  return (
    <Fragment>
      <div className="react-tabs__tab-panel--inner">
        <label className="iip-map-admin-label" htmlFor="screendoor-project-id">
          Screendoor Project ID:
          <input
            className={ `iip-map-admin-project-input${errors.length ? ' invalid' : ''}` }
            id="screendoor-project-id"
            name="screendoor-project-id"
            onChange={ handleChange }
            type="text"
            value={ id }
          />
        </label>
      </div>
      <TabControls handleSave={ handleSave } errors={ errors }>
        <div className="iip-map-admin-mapping__error" style={ { visibility: showWarning ? 'visible' : 'hidden' } }>
          Warning: Saving a new project ID will delete any existing events associated with this map.
        </div>
      </TabControls>
    </Fragment>
  );
};

MapProject.propTypes = {
  projectId: PropTypes.string,
  setDirtyTab: PropTypes.func,
  doSave: PropTypes.func
};

export default MapProject;

import React, { Fragment, useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import TabControls from './TabControls';
import { useMapState } from '../../../../context/MapProvider';

const MapProject = ( {
  projectId, doSave, setDirtyTab, publishReminder
} ) => {
  const [id, setId] = useState( projectId !== null ? projectId : '' );
  const [errors, setErrors] = useState( [] );

  const { eventCounts } = useMapState();

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

  const warningText = 'Warning: Saving a new project ID will delete any existing events associated with this map.';
  const showWarning = projectId && id && projectId !== id && eventCounts.total !== '0';

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
      <TabControls
        handleSave={ handleSave }
        errors={ errors }
        warning={ showWarning ? warningText : null }
        publishReminder={ publishReminder }
      />
    </Fragment>
  );
};

MapProject.propTypes = {
  projectId: PropTypes.string,
  setDirtyTab: PropTypes.func,
  publishReminder: PropTypes.bool,
  doSave: PropTypes.func
};

export default MapProject;

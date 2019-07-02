import React, { Fragment, useReducer, useRef } from 'react';
import { importScreenDoorData } from '../../utils/helpers';

const DataImporter = () => {
  const [action, setAction] = useReducer( ( prevState, update ) => ( { ...prevState, ...update } ), {
    loading: false,
    error: false,
    message: null
  } );
  const setActionLoading = () => setAction( { loading: true, error: false, message: 'Importing...' } );
  const setActionError = err => setAction( { loading: false, error: !!err, message: err || '' } );
  const setActionResult = msg => setAction( { loading: false, error: false, message: msg || '' } );

  const inputFile = useRef( null );

  const handleFileSelect = ( e ) => {
    const { files } = e.target;
    if ( files && files.length > 0 ) {
      setActionLoading();
      importScreenDoorData( files[0] )
        .then( ( result ) => {
          if ( result.success ) {
            setActionResult( 'Import successful' );
          } else if ( result.error ) {
            setActionError( `Import Failed: \n${result.error}` );
          } else {
            setActionError( 'Import failed' );
          }
        } )
        .catch( ( err ) => {
          if ( err ) {
            setActionError( `Import Failed: \n${err.toString()}` );
          } else {
            setActionError( 'Import failed' );
          }
        } );
    }
  };

  const handleImport = () => {
    inputFile.current.value = null;
    setActionResult();
    inputFile.current.click();
  };

  return (
    <div className="iip-map-admin-column-side">
      <div className="iip-map-admin-small-metabox">
        <p>
          Click the button below to import Screendoor CSV data.
        </p>

        <div className="iip-map-admin-marker-row">
          <button
            type="button"
            className="button button-primary button-large"
            id="iip-map-admin-import-screendoor-data"
            disabled={ action.loading }
            onClick={ handleImport }
          >
            Import Screendoor Data
            <input
              id="iip-map-admin-import-screendoor-data-input"
              className="hidden"
              accept=".csv,text/csv"
              type="file"
              ref={ inputFile }
              disabled={ action.loading }
              onChange={ handleFileSelect }
            />
          </button>
        </div>
        <div className="iip-map-admin-marker-row">
          { action.message && (
            <div className={ `iip-map-admin-marker-${action.error ? 'error' : 'success'}` }>
              { action.message.split( '\n' ).map( str => (
                <Fragment key={ Math.random() }>
                  { str }
                  <br />
                </Fragment>
              ) ) }
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default DataImporter;

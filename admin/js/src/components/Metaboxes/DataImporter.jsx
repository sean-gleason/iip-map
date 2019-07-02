import React, { useReducer } from 'react';
import { importData } from '../../utils/helpers';

const DataImporter = () => {
  const [action, setAction] = useReducer( ( prevState, update ) => ( { ...prevState, ...update } ), {
    loading: false,
    error: false,
    message: null
  } );
  const setActionLoading = () => setAction( { loading: true, message: null } );
  const setActionError = err => setAction( { loading: false, error: !!err, message: err || '' } );
  const setActionResult = msg => setAction( { loading: false, error: false, message: msg } );

  const handleFileSelect = ( e ) => {
    const { files } = e.target;
    if ( files && files.length > 0 ) {
      setActionLoading();
      setActionError();
      importData( files[0] )
        .then( ( result ) => {
          if ( result.success ) {
            setActionResult( 'Import successful.' );
          } else if ( result.error ) {
            setActionError( `Import Failed: ${result.error}` );
          }
        } )
        .catch( ( err ) => {
          if ( err ) setActionError( err.toString() );
          else setActionError( 'Import failed.' );
        } );
    }
  };

  return (
    <div className="iip-map-admin-column-side">
      <div className="iip-map-admin-small-metabox">
        <p>
          Click the button below to import Screendoor CSV data.
        </p>
        <button
          type="button"
          className="button button-primary button-large"
          id="iip-map-admin-import-screendoor-data"
          disabled={ action.loading }
        >
          Import Screendoor Data
          <input
            id="iip-map-admin-import-screendoor-data-input"
            className="hidden"
            accept=".csv,text/csv"
            type="file"
            disabled={ action.loading }
            onChange={ handleFileSelect }
          />
        </button>
        <div className="iip-map-admin-marker-row">
          { action.message && (
            <div className={ `iip-map-admin-marker-${action.error ? 'error' : 'success'}` }>
              { action.message }
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default DataImporter;

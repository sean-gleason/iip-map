import React, { useReducer } from 'react';
import { saveAs } from 'file-saver';
import { exportData } from '../../utils/helpers';

const DataExporter = ( ) => {
  const [state, setState] = useReducer( ( prevState, update ) => ( { ...prevState, ...update } ), {
    loading: false,
    error: false,
    message: ''
  } );

  const handleExport = () => {
    setState( { loading: true, error: false, message: 'Export processing...' } );
    exportData()
      .then( ( response ) => {
        setState( {
          loading: false,
          error: false,
          message: 'Export successful.'
        } );
        saveAs( new Blob( [response.data] ), response.headers['content-filename'] || 'export.csv' );
      } )
      .catch( ( err ) => {
        setState( {
          loading: false,
          error: true,
          message: `Error: ${err.response.data}`
        } );
      } );
  };

  return (
    <div className="iip-map-admin-column-side">
      <div className="iip-map-admin-small-metabox">
        <p>
          Click the button below to export the data for this map as a CSV.
          This dataset includes all venue and event information for each event in this project.
        </p>
        <div className="iip-map-admin-marker-row">
          { state.message && (
            <div className={ `iip-map-admin-marker-${state.error ? 'error' : 'success'}` }>
              { state.message }
            </div>
          ) }
        </div>
        <button
          className="button button-primary button-large"
          id="iip-map-admin-export-project-data"
          type="button"
          disabled={ state.loading }
          onClick={ handleExport }
        >
          Export Project Data
        </button>
      </div>
    </div>
  );
};

export default DataExporter;

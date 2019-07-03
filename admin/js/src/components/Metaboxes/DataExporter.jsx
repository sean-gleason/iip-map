import React, { useReducer } from 'react';
import { saveAs } from 'file-saver';
import { exportData } from '../../utils/helpers';
import { useMapState } from '../../context/MapProvider';

const DataExporter = ( ) => {
  const { projectId, eventCounts } = useMapState();
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
          message: 'Export successful'
        } );
        saveAs( new Blob( [response.data] ), response.headers['content-filename'] || 'export.csv' );
      } )
      .catch( ( err ) => {
        setState( {
          loading: false,
          error: true,
          message: `Export failed: ${err.response.data}`
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
        <div className="iip-map-admin-row">
          Total Events:
          <b>
            { ` ${eventCounts.total}` }
          </b>
          <br />
          <button
            className="button button-primary button-large"
            id="iip-map-admin-export-project-data"
            type="button"
            disabled={ !projectId || eventCounts.total === '0' }
            onClick={ handleExport }
          >
            Export Event Data
          </button>
        </div>
        <div className="iip-map-admin-row">
          { state.message && (
            <div className={ `iip-map-admin-${state.error ? 'error' : 'success'}` }>
              { state.message }
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default DataExporter;

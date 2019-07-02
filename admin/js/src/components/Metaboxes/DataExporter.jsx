import React from 'react';
import { useMapState } from '../../context/MapProvider';

const DataExporter = () => {
  const { projectId, eventCounts } = useMapState();
  return (
    <div className="iip-map-admin-column-side">
      <div className="iip-map-admin-small-metabox">
        { /* <h2 className="iip-map-admin-metabox-header">Export Project Data</h2> */ }
        <p>
          Click the button below to export the data for this map as a CSV.
          This dataset includes all venue and event information for each event in this project.
        </p>
        <div className="iip-map-admin-marker--row">
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
          >
            Export Event Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataExporter;

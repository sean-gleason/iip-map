import React from 'react';

const DataExporter = ( ) => (
  <div className="postbox">
    <h2 className="iip-map-admin-metabox-header hndle ui-sortable-handle">Export Project Data</h2>
    <div className="inside">
      <p>Click the button below to export the data for this map as a CSV. This dataset includes all venue and event information for each event in this project.</p>
      <button
        className="button button-primary button-large"
        id="iip-map-admin-export-project-data"
        type="button"
      >
        Export Project Data
      </button>
    </div>
  </div>
);

export default DataExporter;

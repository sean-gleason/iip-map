import React from 'react';
import { importScreenDoorData } from '../../utils/helpers';

const DataImporter = () => {
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if(files && files.length > 0) {
      importScreenDoorData(files[0]).then(() => {
        // TODO:
      });
    }
  };

  return (
    <div className="iip-map-admin-column-side">
      <div className="iip-map-admin-small-metabox">
        <p>
          Click the button below to import Screendoor CSV data.
        </p>
        <label
          for="iip-map-admin-import-screendoor-data-input"
          className="button button-primary button-large"
          id="iip-map-admin-import-screendoor-data">
          Import Screendoor Data
        </label>
        <input
          id="iip-map-admin-import-screendoor-data-input"
          class="hidden"
          accept=".csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          type="file"
          onChange={ handleFileSelect } />
      </div>
    </div>
  );
};

export default DataImporter;

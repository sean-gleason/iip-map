import React, { useState } from 'react';

import ConfigureMap from '../../Containers/ConfigureMap';
import FormMapper from '../../Containers/FormMapper';
import Events from '../Metaboxes/Events';

import { getMapEvents } from '../../utils/globals';
import screendoorProject from '../../utils/ScreendoorProject';

export const MapContext = React.createContext( {} );

const MapAdminMain = () => {
  const [updated, setUpdated] = useState( getMapEvents.updated );
  const [project, setProject] = useState( screendoorProject );

  const handleSetProject = ( update ) => {
    setProject( update );
    setUpdated( true );
  };

  return (
    <div className="iip-map-admin-column-wide">
      <ConfigureMap />
      <MapContext.Provider value={ {
        project,
        setProject: handleSetProject,
        updated,
        setUpdated
      } }
      >
        <FormMapper />
        <Events />
      </MapContext.Provider>
    </div>
  );
};

export default MapAdminMain;

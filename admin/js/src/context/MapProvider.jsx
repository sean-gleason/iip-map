import React, { useReducer } from 'react';
import * as PropTypes from 'prop-types';

import screendoorProject from '../utils/ScreendoorProject';

const MapStateContext = React.createContext();
const MapDispatchContext = React.createContext();

const MapProvider = ( { children } ) => {
  const project = screendoorProject;
  const [state, dispatch] = useReducer( ( prevState, update ) => ( { ...prevState, ...update } ), {
    projectId: project.projectId,
    mappingValid: !project.getMappingErrors( project.mapping ).length,
    eventCounts: {
      total: project.events.total,
      geocoded: project.events.geocoded
    }
  } );

  const dispatchMapping = mapping => dispatch( { mapping, mappingValid: !project.getMappingErrors( mapping ).length } );
  const dispatchCounts = eventCounts => dispatch( { eventCounts } );

  const dispatchers = {
    dispatch,
    dispatchMapping,
    dispatchCounts
  };
  return (
    <MapStateContext.Provider value={ state }>
      <MapDispatchContext.Provider value={ dispatchers }>
        { children }
      </MapDispatchContext.Provider>
    </MapStateContext.Provider>
  );
};
MapProvider.propTypes = {
  children: PropTypes.oneOfType( [
    PropTypes.element,
    PropTypes.arrayOf( PropTypes.element )
  ] )
};

function useMapState() {
  const context = React.useContext( MapStateContext );

  if ( context === undefined ) {
    throw new Error( 'useMapState must be used within a MapProvider' );
  }

  return context;
}

function useMapDispatch() {
  const context = React.useContext( MapDispatchContext );

  if ( context === undefined ) {
    throw new Error( 'useMapDispatch must be used within a MapProvider' );
  }

  return context;
}

export { MapProvider, useMapState, useMapDispatch };

export default MapProvider;

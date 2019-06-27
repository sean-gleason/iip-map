import React, { Fragment, useEffect, useReducer } from 'react';
import * as PropTypes from 'prop-types';

const StatusTimer = ( { label, text, running } ) => {
  const [state, setState] = useReducer(
    ( prevState, update ) => ( { ...prevState, ...update } ), {
      text: null,
      running: false,
      id: 0,
      status: null
    }
  );

  useEffect( () => {
    if ( text !== state.text && text ) {
      setState( {
        text,
        status: text,
        running
      } );
    }
  }, [
    text, running, state.text, state.running, state.id, state.status
  ] );

  useEffect( () => {
    if ( text !== state.text && state.id && state.running ) {
      clearInterval( state.id );
    }
  }, [text, state.text] );

  useEffect( () => {
    if ( state.running ) {
      const dots = [];
      const id = setInterval( () => {
        dots.push( '.' );
        if ( dots.length > 5 ) dots.splice( 0 );
        setState( {
          status: `${state.text}${dots.join( '' )}`
        } );
      }, 250 );
      setState( { id } );
      return () => clearInterval( id );
    }
  }, [state.running, state.text] );

  return (
    <Fragment>
      <span>
        <b>{ label }</b>
      </span>
      <div style={ { whiteSpace: 'pre-wrap', display: 'inline-block' } }>
        { state.status }
      </div>
    </Fragment>
  );
};

StatusTimer.propTypes = {
  label: PropTypes.string,
  text: PropTypes.string,
  running: PropTypes.bool
};

StatusTimer.defaultProps = {
  label: 'Status: '
};

export default StatusTimer;

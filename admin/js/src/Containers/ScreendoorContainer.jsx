import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

import FormSelector from '../Components/Metaboxes/FormSelector';
import ScreendoorFieldMapper from './Modals/ScreendoorFieldMapper';

import ScreendoorConfigureCard from './Modals/ScreendoorConfigureCard';

import './ScreendoorContainer.scss';

const ScreendoorContainer = ( { project, setProject } ) => {
  const [loaded, setLoaded] = useState( null );
  const [display, setDisplay] = useState( 'mapper' );
  const [errors, setErrors] = useState( [] );
  const [dirty, setDirty] = useState( false );
  const [projectId, setProjectId] = useState( project.projectId );
  const [form, setForm] = useState( project.form );
  const [mapping, setMapping] = useState( project.mapping );
  const [card, setCard] = useState( project.card );

  const handleProjectId = ( event ) => {
    setProjectId( event.target.value );
  };

  const handleScreendoor = () => {
    project.getFields()
      .then( data => setForm( data ) )
      .catch( ( err ) => {
        console.error( err );
        setForm( [] );
        setCard( null );
      } );
  };

  const getMapping = () => mapping;

  const checkErrors = () => {
    const { nameFields, locationFields } = mapping;
    const errs = [];
    if ( !nameFields.length ) {
      errs.push( 'name' );
    }
    if ( !locationFields.length ) {
      errs.push( 'location' );
    }
    setErrors( errs );
    return errs.length !== 0;
  };

  const saveData = () => {
    if ( checkErrors() ) return;
    project.save( {
      form, card, mapping, projectId
    } )
      .then( ( result ) => {
        if ( result.success ) {
          setDirty( false );
          setProject( project );
        } else {
          console.error( result );
        }
      } )
      .catch( err => console.error( err ) );
  };

  const resetMapping = ( defaultMapping ) => {
    setMapping( defaultMapping );
    setCard( project.getCardFromMapping( defaultMapping, card ) );
    setDirty( true );
  };

  useEffect( () => {
    project.update( {
      mapping, card, projectId, form
    } );
  }, [
    mapping, card, projectId, form
  ] );

  useEffect( () => {
    if ( !loaded ) {
      setLoaded( true );
    } else {
      checkErrors();
    }
  }, [mapping] );

  return (
    <div className="iip-map-admin-screendoor">
      <FormSelector
        formType="screendoor"
        getFields={ handleScreendoor }
        projectId={ projectId }
        selectView={ setDisplay }
        setId={ handleProjectId }
        dirty={ dirty }
        errors={ errors.length > 0 }
        saveData={ saveData }
      />
      <div className="iip-map-admin-screendoor-modal">
        { ( display === 'mapper' ) && (
          <ScreendoorFieldMapper
            form={ form }
            id={ projectId }
            errors={ errors }
            reset={ resetMapping }
            setDirty={ setDirty }
            setMapping={ setMapping }
            getMapping={ getMapping }
          />
        ) }
        { ( display === 'card' ) && (
          <ScreendoorConfigureCard
            id={ projectId }
            mapping={ mapping }
            card={ card }
            setDirty={ setDirty }
            setCard={ setCard }
            getCardFromMapping={ project.getCardFromMapping }
          />
        ) }
      </div>
    </div>
  );
};

ScreendoorContainer.propTypes = {
  project: PropTypes.shape( {
    mapping: PropTypes.object,
    card: PropTypes.object,
    postId: PropTypes.number,
    projectId: PropTypes.string,
    form: PropTypes.array,
    save: PropTypes.func,
    update: PropTypes.func,
    getEvents: PropTypes.func,
    getFields: PropTypes.func
  } ),
  setProject: PropTypes.func
};

export default ScreendoorContainer;

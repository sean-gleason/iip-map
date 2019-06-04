import React, { useEffect, useState } from 'react';

import FormSelector from '../Components/Metaboxes/FormSelector';
import ScreendoorFieldMapper from './Modals/ScreendoorFieldMapper';
import ScreendoorConfigureCard from './Modals/ScreendoorConfigureCard';

import { getFields, saveScreendoorFields } from '../utils/screendoor';
import {
  getMapGlobalMeta,
  getScreendoorFields,
  getScreendoorCard,
  getMapMeta
} from '../utils/globals';

import './ScreendoorContainer.scss';

const ScreendoorContainer = ( props ) => {
  const apiKey = getMapGlobalMeta.screendoorKey;
  const [loaded, setLoaded] = useState( null );
  const [display, setDisplay] = useState( 'mapper' );
  const [projectId, setProjectId] = useState( getScreendoorFields.projectId );
  const [errors, setErrors] = useState( [] );
  const [dirty, setDirty] = useState( false );
  const [form, setForm] = useState( getScreendoorFields.formArr );
  const [mapping, setMapping] = useState( {
    additionalFields: getScreendoorFields.otherArr,
    availableFields: getScreendoorFields.availableArr,
    dateFields: getScreendoorFields.dateArr,
    fields: getScreendoorFields.fields,
    locationFields: getScreendoorFields.locationArr,
    nameFields: getScreendoorFields.nameArr,
    timeFields: getScreendoorFields.timeArr
  } );
  const [card, setCard] = useState( getScreendoorCard ? {
    titleSection: getScreendoorCard.title,
    dateSection: getScreendoorCard.date,
    timeSection: getScreendoorCard.time,
    locationSection: getScreendoorCard.location,
    additionalSection: getScreendoorCard.additional,
    added: getScreendoorCard.addedArr
  } : null );

  const handleProjectId = ( event ) => {
    setProjectId( event.target.value );
  };

  const handleScreendoor = () => {
    getFields( projectId, apiKey )
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
    const {
      fields, additionalFields, availableFields, dateFields, locationFields, nameFields, timeFields
    } = mapping;

    if ( checkErrors() ) return;

    const dataObj = {
      projectId,
      form,
      card,
      postId: getMapMeta.id,
      mapping: {
        fields,
        available: availableFields,
        date: dateFields,
        location: locationFields,
        name: nameFields,
        other: additionalFields,
        time: timeFields
      }
    };
    saveScreendoorFields( dataObj )
      .then( ( result ) => {
        if ( result.success ) {
          setDirty( false );
        } else {
          console.error( result );
        }
      } )
      .catch( err => console.error( err ) );
  };

  const resetMapping = ( defaultMapping ) => {
    setMapping( defaultMapping );
    setCard( ScreendoorConfigureCard.getStateFromMapping( defaultMapping, card ) );
    setDirty( true );
  };

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
        apiKey={ apiKey }
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
          />
        ) }
      </div>
    </div>
  );
};

export default ScreendoorContainer;

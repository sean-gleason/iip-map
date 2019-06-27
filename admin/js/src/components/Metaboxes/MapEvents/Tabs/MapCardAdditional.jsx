import React from 'react';
import * as PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

const MapCardAdditional = ( {
  position, value, index, kgen, handleInput, handleDeleteItem, mapping
} ) => (
  <Draggable key={ `draggable${value.dragId}` } draggableId={ value.dragId } index={ index }>
    { provided => (
      <div
        className="iip-map-admin-column-item"
        ref={ provided.innerRef }
        { ...provided.draggableProps }
        { ...provided.dragHandleProps }
      >
        <div className="iip-map-admin-card-preview-meta" key={ position }>
          <div className="iip-map-admin-new-section-header">
            <p className="iip-map-admin-card-preview-toggle-sublabel">
              { `Custom Section #${position}` }
            </p>
            <button
              className="iip-event-close-btn"
              data-group="added"
              data-index={ index }
              onClick={ handleDeleteItem }
              type="button"
            >
                X
            </button>
          </div>
          <label
            className="iip-map-admin-label"
            htmlFor="field"
            key={ kgen( 'field' ) }
          >
              Choose field:
            <select
              className="iip-map-admin-project-input"
              key={ kgen( 'fieldselect' ) }
              data-group="added"
              data-index={ index }
              name="field"
              value={ value.field }
              onChange={ handleInput }
            >
              <option value="">Please select a field</option>
              { mapping.additionalFields.map( ( item, i ) => (
                <option
                  value={ item.field }
                  key={ kgen( 'fieldselectopt', i ) }
                >
                  { item.name }
                </option>
              ) ) }
            </select>
          </label>
          <label
            className="iip-map-admin-label"
            htmlFor="heading"
            key={ kgen( 'heading' ) }
          >
              Section header (optional):
            <input
              className="iip-map-admin-project-input"
              key={ kgen( 'heading', 'input' ) }
              data-group="added"
              data-index={ index }
              name="heading"
              type="text"
              value={ value.heading }
              onChange={ handleInput }
            />
          </label>
          <label
            className="iip-map-admin-label stacked"
            htmlFor="inlinePre"
            key={ kgen( 'inlinePre', '' ) }
          >
              Inline text before item (optional):
            <textarea
              className="iip-map-admin-project-textarea"
              key={ kgen( 'inlinePre', 'text' ) }
              data-group="added"
              data-index={ index }
              name="inlinePre"
              value={ value.inlinePre }
              onChange={ handleInput }
            />
          </label>
          <label
            className="iip-map-admin-label stacked"
            key={ kgen( 'inlinePost', '' ) }
            htmlFor="inlinePost"
          >
              Inline text after item (optional):
            <textarea
              className="iip-map-admin-project-textarea"
              key={ kgen( 'inlinePost', 'text' ) }
              data-group="added"
              data-index={ index }
              name="inlinePost"
              value={ value.inlinePost }
              onChange={ handleInput }
            />
          </label>
        </div>
      </div>
    ) }
  </Draggable>
);

MapCardAdditional.propTypes = {
  position: PropTypes.number,
  value: PropTypes.object,
  index: PropTypes.number,
  kgen: PropTypes.func,
  handleInput: PropTypes.func,
  handleDeleteItem: PropTypes.func,
  mapping: PropTypes.object
};

export default MapCardAdditional;

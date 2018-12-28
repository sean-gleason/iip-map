import React from 'react';

import { deleteUrl } from '../../utils/handleSubmit';

const SubmitBox = () => (
  <div className="postbox" id="submitdiv">
    <h2 className="hndle">
      <span>Publish</span>
    </h2>
    <div className="inside">
      <div className="submitbox" id="submitpost">
        <div id="major-publishing-actions">
          <div id="delete-action">
            { deleteUrl }
          </div>
          <div id="publishing-action">
            <span className="spinner" />
            <input
              id="original_publish"
              name="original_publish"
              type="hidden"
              value="Publish"
            />
            <input
              className="button button-primary button-large"
              id="publish"
              name="publish"
              type="submit"
              value="Publish"
            />
          </div>
          <div className="clear" />
        </div>
      </div>
    </div>
  </div>
);

export default SubmitBox;

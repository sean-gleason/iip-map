import React from 'react';

export const checkIfPost = ( url ) => {
  const regex = /(post\.php\?post=)/g;
  const found = url.match( regex );

  return found;
};

export const deleteUrl = ( function getDeleteUrl() {
  const currentPage = window.location.href;
  const isPost = checkIfPost( currentPage );

  let deleteLink;

  if ( isPost ) {
    deleteLink = <a className="submitdelete deletion" href={ currentPage }>Move to Trash </a>;
  } else {
    deleteLink = '';
  }

  return deleteLink;
}() );

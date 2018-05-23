<?php

// Checks save status
$is_revision = wp_is_post_revision( $post_id );
$is_valid_nonce = ( isset( $_POST[ 'geocoder_info_nonce' ] ) && wp_verify_nonce( $_POST[ 'geocoder_info_nonce' ], 'iip_map' ) ) ? 'true' : 'false';

// Exits script depending on save status
if ( $is_revision || !$is_valid_nonce ) {
  return;
}

if( !empty( $_POST['_iip_map_geocoder_trigger'] ) ) {
  update_post_meta ( $post_id, '_iip_map_geocoder_trigger', sanitize_text_field( $_POST['_iip_map_geocoder_trigger'] ) );
}

if( !empty( $_POST['_iip_map_geocoder_complete'] ) ) {
  update_post_meta ( $post_id, '_iip_map_geocoder_complete', sanitize_text_field( $_POST['_iip_map_geocoder_complete'] ) );
}

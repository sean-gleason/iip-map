<?php

// Checks save status
$is_revision = wp_is_post_revision( $post_id );
$is_valid_nonce = ( isset( $_POST[ 'map_shortcode_nonce' ] ) && wp_verify_nonce( $_POST[ 'map_shortcode_nonce' ], 'iip_map' ) ) ? 'true' : 'false';

// Exits script depending on save status
if ( $is_revision || !$is_valid_nonce ) {
  return;
}

if( !empty( $_POST['_iip_map_height'] ) ) {
  update_post_meta ( $post_id, '_iip_map_height', sanitize_text_field( $_POST['_iip_map_height'] ) );
}

if( !empty( $_POST['_iip_map_zoom'] ) ) {
  update_post_meta ( $post_id, '_iip_map_zoom', sanitize_text_field( $_POST['_iip_map_zoom'] ) );
}

if( !empty( $_POST['_iip_map_lat'] ) ) {
  update_post_meta ( $post_id, '_iip_map_lat', sanitize_text_field( $_POST['_iip_map_lat'] ) );
}

if( !empty( $_POST['_iip_map_lng'] ) ) {
  update_post_meta ( $post_id, '_iip_map_lng', sanitize_text_field( $_POST['_iip_map_lng'] ) );
}

if( !empty( $_POST['_iip_map_type'] ) ) {
  update_post_meta ( $post_id, '_iip_map_type', sanitize_text_field( $_POST['_iip_map_type'] ) );
}

<?php

// Checks save status
$is_revision = wp_is_post_revision( $post_id );

// Checks for nonce
$is_valid_nonce = ( isset( $_POST[ 'map_main_nonce' ] ) && wp_verify_nonce( $_POST[ 'map_main_nonce' ], 'iip_map' ) ) ? 'true' : 'false';

// Exits script depending on save and nonce status
if ( $is_revision || !$is_valid_nonce ){
  return;
}

// Get serialized array of post meta values
$map_meta = get_post_meta( $post_id, '_iip_map_meta' );

$map_meta[ 'id' ] = $post_id;

// Add map items to map params array
if( !empty( $_POST[ 'mapHeight' ] ) ) {
  $map_meta[ 'height' ] = ( sanitize_text_field( $_POST[ 'mapHeight' ] ) );
}

if( !empty( $_POST[ 'mapZoom' ] ) ) {
  $map_meta[ 'zoom' ] = ( sanitize_text_field( $_POST[ 'mapZoom' ] ) );
}

if( !empty( $_POST[ 'mapLat' ] ) ) {
  $map_meta[ 'lat' ] = ( sanitize_text_field( $_POST[ 'mapLat' ] ) );
}

if( !empty( $_POST[ 'mapLng' ] ) ) {
  $map_meta[ 'lng' ] = ( sanitize_text_field( $_POST[ 'mapLng' ] ) );
}

if( !empty( $_POST[ 'mapType' ] ) ) {
  $map_meta[ 'type' ] = ( sanitize_text_field( $_POST[ 'mapType' ] ) );
}

// Send updated array of post meta values
update_post_meta( $post_id, '_iip_map_meta', $map_meta );

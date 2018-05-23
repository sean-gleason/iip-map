<?php

// Checks save status
$is_revision = wp_is_post_revision( $post_id );
$is_valid_nonce = ( isset( $_POST[ 'map_project_info_nonce' ] ) && wp_verify_nonce( $_POST[ 'map_project_info_nonce' ], 'iip_map' ) ) ? 'true' : 'false';

// Exits script depending on save status
if ( $is_revision || !$is_valid_nonce ) {
  return;
}

// Sanitize and store map post metadata values
if( !empty( $_POST['_iip_map_screendoor_project'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_project', sanitize_text_field( $_POST['_iip_map_screendoor_project'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_venue'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_venue', sanitize_text_field( $_POST['_iip_map_screendoor_venue'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_address'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_address', sanitize_text_field( $_POST['_iip_map_screendoor_address'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_city'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_city', sanitize_text_field( $_POST['_iip_map_screendoor_city'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_region'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_region', sanitize_text_field( $_POST['_iip_map_screendoor_region'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_country'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_country', sanitize_text_field( $_POST['_iip_map_screendoor_country'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_event'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_event', sanitize_text_field( $_POST['_iip_map_screendoor_event'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_desc'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_desc', sanitize_text_field( $_POST['_iip_map_screendoor_desc'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_date'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_date', sanitize_text_field( $_POST['_iip_map_screendoor_date'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_time'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_time', sanitize_text_field( $_POST['_iip_map_screendoor_time'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_duration'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_duration', sanitize_text_field( $_POST['_iip_map_screendoor_duration'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_topic'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_topic', sanitize_text_field( $_POST['_iip_map_screendoor_topic'] ) );
}

if( !empty( $_POST['_iip_map_screendoor_contact'] ) ) {
  update_post_meta ( $post_id, '_iip_map_screendoor_contact', sanitize_text_field( $_POST['_iip_map_screendoor_contact'] ) );
}

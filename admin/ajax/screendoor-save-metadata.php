<?php

class IIP_Map_Save_Fields {
  function save_screendoor_ajax() {
    check_ajax_referer( 'iip-map-screendoor-nonce', 'security' );

    // Get WP post id
    $id = $_POST[ 'postId' ];

    // Get serialized array of screendoor meta values
    $fields_meta = unserialize( get_post_meta( $id, '_iip_map_fields_meta', true ) );
    
    // Add map items to map params array
    if( !empty( $_POST[ 'available' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'available_arr' ] = ( json_decode( stripslashes ( $_POST[ 'available' ] ) ) );
    }
    
    if( !empty( $_POST[ 'date' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'date_arr' ] = ( json_decode( stripslashes ( $_POST[ 'date' ] ) ) );
    }

    if( !empty( $_POST[ 'time' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'time_arr' ] = ( json_decode( stripslashes ( $_POST[ 'time' ] ) ) );
    }

    if( !empty( $_POST[ 'fields' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'fields_obj' ] = ( json_decode( stripslashes ( $_POST[ 'fields' ] ) ) );
    }
    
    if( !empty( $_POST[ 'location' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'location_arr' ] = ( json_decode( stripslashes( $_POST[ 'location' ] ) ) );
    }

    if( !empty( $_POST[ 'name' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'name_arr' ] = ( json_decode( stripslashes( $_POST[ 'name' ] ) ) );
    }

    if( !empty( $_POST[ 'other' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'other_arr' ] = ( json_decode( stripslashes ( $_POST[ 'other' ] ) ) );
    }

    if( !empty( $_POST[ 'projectId' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'project_id' ] = ( sanitize_text_field( $_POST[ 'projectId' ] ) );
    }

    // Send updated array of post meta values
    update_post_meta( $id, '_iip_map_fields_meta', $fields_meta );
  }

}
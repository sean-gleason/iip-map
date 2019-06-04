<?php

class IIP_Map_Save_Fields {
  function save_screendoor_ajax() {
    check_ajax_referer( 'iip-map-screendoor-nonce', 'security' );

//    file_put_contents( ABSPATH . 'meta.txt', print_r( $_POST, 1 ) . "\r\n\r\n" );

    // Get WP post id
    $id = $_POST[ 'postId' ];

    // Get serialized array of screendoor meta values
    $fields_meta = get_post_meta( $id, '_iip_map_fields_meta', true );
    if ( !$fields_meta ) {
      $fields_meta = [
        'screendoor' => [ 'mapping' => [], 'card' => [] ],
        'formidable' => [ 'mapping' => [], 'card' => [] ]
      ];
    }

    if( !empty( $_POST[ 'projectId' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'project_id' ] = ( sanitize_text_field( $_POST[ 'projectId' ] ) );
    }
    if( !empty( $_POST[ 'form' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'form_arr' ] = ( json_decode( stripslashes ( $_POST[ 'form' ] ) ) );
    }

    if ( !empty( $_POST['mapping'] ) ) {
      $mapping = json_decode(stripslashes($_POST['mapping']));

      // Add map items to map params array
      $fields_meta['screendoor']['mapping']['available_arr'] = $mapping->available;
      $fields_meta['screendoor']['mapping']['date_arr'] = $mapping->date;
      $fields_meta['screendoor']['mapping']['time_arr'] = $mapping->time;
      $fields_meta['screendoor']['mapping']['location_arr'] = $mapping->location;
      $fields_meta['screendoor']['mapping']['name_arr'] = $mapping->name;
      $fields_meta['screendoor']['mapping']['other_arr'] = $mapping->other;
      $fields_meta['screendoor']['mapping']['fields_obj'] = $mapping->fields;
    }




    if ( !empty( $_POST['card'] ) ) {
      $card = json_decode(stripslashes($_POST['card']));

      // Get serialized array of screendoor meta values
      $fields_meta['screendoor']['card']['titleSection'] = $card->titleSection;
      $fields_meta['screendoor']['card']['dateSection'] = $card->dateSection;
      $fields_meta['screendoor']['card']['timeSection'] = $card->timeSection;
      $fields_meta['screendoor']['card']['locationSection'] = $card->locationSection;
      $fields_meta['screendoor']['card']['additionalSection'] = $card->additionalSection;
      $fields_meta['screendoor']['card']['added_arr'] = $card->added;
    }
    // Send updated array of post meta values
    update_post_meta( $id, '_iip_map_fields_meta', $fields_meta );

//    file_put_contents( ABSPATH . 'meta.txt', print_r( $fields_meta, 1 ) . "\r\n\r\n", FILE_APPEND );
    wp_send_json_success();
  }

}

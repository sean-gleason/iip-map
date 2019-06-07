<?php

class IIP_Map_Save_Fields {
  static function get_screendoor_meta_object( $data, $fields_meta = null ) {
    // Get serialized array of screendoor meta values
    if ( !$fields_meta ) {
      $fields_meta = [
        'screendoor' => [ 'mapping' => [], 'card' => [] ],
        'formidable' => [ 'mapping' => [], 'card' => [] ]
      ];
    }

    if( !empty( $data[ 'projectId' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'project_id' ] = ( sanitize_text_field( $data[ 'projectId' ] ) );
    }
    if( !empty( $data[ 'form' ] ) ) {
      $fields_meta[ 'screendoor' ][ 'form_arr' ] = ( json_decode( stripslashes ( $data[ 'form' ] ) ) );
    }

    if ( !empty( $data['mapping'] ) ) {
      $mapping = json_decode(stripslashes($data['mapping']));

      // Add map items to map params array
      $fields_meta['screendoor']['mapping']['available_arr'] = $mapping->available;
      $fields_meta['screendoor']['mapping']['date_arr'] = $mapping->date;
      $fields_meta['screendoor']['mapping']['time_arr'] = $mapping->time;
      $fields_meta['screendoor']['mapping']['location_arr'] = $mapping->location;
      $fields_meta['screendoor']['mapping']['name_arr'] = $mapping->name;
      $fields_meta['screendoor']['mapping']['other_arr'] = $mapping->other;
      $fields_meta['screendoor']['mapping']['fields_obj'] = $mapping->fields;
    }

    if ( !empty( $data['card'] ) ) {
      $card = json_decode(stripslashes($data['card']));

      $fields_meta['screendoor']['card']['title'] = $card->titleSection;
      $fields_meta['screendoor']['card']['date'] = $card->dateSection;
      $fields_meta['screendoor']['card']['time'] = $card->timeSection;
      $fields_meta['screendoor']['card']['location'] = $card->locationSection;
      $fields_meta['screendoor']['card']['additional'] = $card->additionalSection;
      $fields_meta['screendoor']['card']['added_arr'] = $card->added;
    }

    return $fields_meta;
  }

  function save_screendoor_ajax() {
    check_ajax_referer( 'iip-map-screendoor-nonce', 'security' );
    file_put_contents( ABSPATH . 'meta.txt', print_r( $_POST, 1 ) . "\r\n" );

    $id = $_POST[ 'postId' ];

    $original = get_post_meta( $id, '_iip_map_fields_meta', true );
    $fields_meta = IIP_Map_Save_Fields::get_screendoor_meta_object( $_POST, $original );

    // Send updated array of post meta values
    update_post_meta( $id, '_iip_map_fields_meta', $fields_meta );
    update_post_meta( $id, '_iip_map_fields_updated', 1 );

    file_put_contents( ABSPATH . 'meta.txt', print_r( get_post_meta( $id, '_iip_map_fields_meta', true ), 1 ) . "\r\n", FILE_APPEND );
    wp_send_json_success();
  }

  function save_screendoor_events_ajax() {
    global $wpdb;
    check_ajax_referer( 'iip-map-screendoor-nonce', 'security' );

    $id = $_POST[ 'postId' ];
    $project_id = $_POST['projectId'];
    $events = json_decode( stripslashes( $_POST['events'] ) );

    file_put_contents( ABSPATH . 'event.txt', print_r( $events, 1 ) . "\r\n", FILE_APPEND );
    $values = [];
    foreach ( $events as $event ) {
      $fields = serialize( $event->fields );
      $title = $wpdb->_real_escape( $event->title );
      $loc = $wpdb->_real_escape( $event->location );
      $values[] = "($id, $event->ext_id, $project_id, '$title', '$loc','$fields')";
    }
    $values = implode( ',', $values );
    $query = "INSERT INTO {$wpdb->prefix}iip_map_data (post_id, ext_id, project_id, title, location, fields) VALUES $values ON DUPLICATE KEY UPDATE title=VALUES(title), fields=VALUES(fields), location=VALUES(location)";
    $result = $wpdb->query( $query );
    wp_send_json_success( $result );
  }

}

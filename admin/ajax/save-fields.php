<?php

class IIP_Map_Save_Fields {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  static function get_map_fields_meta($data, $fields_meta = null ) {
    // Get serialized array of screendoor meta values
    if ( !$fields_meta ) {
      $fields_meta = [ 'mapping' => [], 'card' => [] ];
    }

    if( !empty( $data[ 'projectId' ] ) ) {
      $fields_meta[ 'project_id' ] = ( sanitize_text_field( $data[ 'projectId' ] ) );
    }
    if( !empty( $data[ 'form' ] ) ) {
      $fields_meta[ 'form_arr' ] = ( json_decode( stripslashes ( $data[ 'form' ] ) ) );
    }

    if ( array_key_exists( 'mapping', $data ) ) {
      if ( $data['mapping'] ) {
        $mapping = json_decode(stripslashes($data['mapping']));

        // Add map items to map params array
        $fields_meta['mapping']['available_arr'] = $mapping->availableFields;
        $fields_meta['mapping']['topic_arr'] = $mapping->topicFields;
        $fields_meta['mapping']['date_arr'] = $mapping->dateFields;
        $fields_meta['mapping']['time_arr'] = $mapping->timeFields;
        $fields_meta['mapping']['location_arr'] = $mapping->locationFields;
        $fields_meta['mapping']['name_arr'] = $mapping->nameFields;
        $fields_meta['mapping']['other_arr'] = $mapping->additionalFields;
        $fields_meta['mapping']['fields_obj'] = $mapping->fields;
      } else {
        $fields_meta['mapping'] = null;
      }
    }

    if ( array_key_exists( 'card', $data ) ) {
      if ( $data['card'] ) {
        $card = json_decode(stripslashes($data['card']));

        $fields_meta['card']['title'] = $card->titleSection;
        $fields_meta['card']['date'] = $card->dateSection;
        $fields_meta['card']['time'] = $card->timeSection;
        $fields_meta['card']['location'] = $card->locationSection;
        $fields_meta['card']['additional'] = $card->additionalSection;
        $fields_meta['card']['added_arr'] = $card->added;
      } else {
        $fields_meta['card'] = null;
      }
    }
    return $fields_meta;
  }

  function save_fields_ajax() {
    check_ajax_referer( 'iip-map-screendoor-nonce', 'security' );

    $id = $_POST[ 'postId' ];

    $original = get_post_meta( $id, '_iip_map_fields_meta', true );
    $fields_meta = IIP_Map_Save_Fields::get_map_fields_meta( $_POST, $original );

    // Send updated array of post meta values
    $result = update_post_meta( $id, '_iip_map_fields_meta', $fields_meta );

    global $wpdb;
    if ( !$result && $fields_meta != $original ) {
      wp_send_json( ['success' => false, 'error' => $wpdb->last_error]);
      exit;
    }
    if ( isset($_POST['deleteEvents'] ) ) {
      $wpdb->delete( $this->table_name, ['post_id' => $id] );
    }
    $event_counts = $wpdb->get_row( "SELECT COUNT(*) as total, COUNT(location_geo) as geocoded FROM $this->table_name WHERE post_id = $id" );
    wp_send_json( [ 'success' => true, 'events' => $event_counts ] );
  }

}

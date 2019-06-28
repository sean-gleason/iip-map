<?php

class IIP_Map_Import {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  function import_data_ajax() {
  	check_ajax_referer( 'iip-map-marker-nonce', 'security' );

    global $wpdb;

    $post_id = $_POST['post_id'];
    $file = $_FILES['file'];

    if ( !$post_id ) {
      wp_send_json( [ 'success' => false, 'error' => 'Invalid post ID.' ] );
    }

    if ( $file['error'] > 0 ) {
      wp_send_json( [ 'success' => false, 'error' => $file['error'] ] );
    }

    if ( !in_array($file['type'], array('text/plain', 'text/csv') ) ) {
      wp_send_json( [ 'success' => false, 'error' => 'File must be .csv format.' ] );
    }

    $values = [];
    $map_meta = get_post_meta( $post_id, '_iip_map_fields_meta', true );
    $columns = implode(', ', array('post_id', 'project_id', 'ext_id', 'fields'));
    $fh = fopen($file['tmp_name'], 'r+');
    $header = [];
    if( ($row = fgetcsv($fh)) !== FALSE ) {
      foreach ( $row as $key => $value ) {
        $header[$value] = $key;
      }

      if ( !in_array( 'Response ID', $row ) ) {
        wp_send_json( [ 'success' => false, 'error' => 'Missing required fields.' ] );
      }

    } else {
      wp_send_json( [ 'success' => false, 'error' => 'Missing header row.' ] );
    }
    $mapping_keys = [ 'topic_arr', 'date_arr', 'time_arr', 'location_arr', 'name_arr', 'other_arr' ];
    $field_names = [];
    $field_data = [];
    foreach ($mapping_keys as $map_key) {
      foreach ($map_meta[$map_key] as $field) {
        if ( !in_array($field->name, array_keys($header)) ) {
          wp_send_json( [ 'success' => false, 'error' => 'Missing required fields.' ] );
        }
        $field_names[] = $field->name;
        $field_data[$field->name] = $field;
      }
    }

    while( ($row = fgetcsv($fh)) !== FALSE ) {
      $event_fields = [];
      foreach ( $field_data as $key => $value ) {
        $event_fields[$value->field] = $row[$header[$key]];
      }
      $event_fields = $wpdb->_real_escape(serialize( (object) $values));
      $reponse_id = $row[ $header[ 'Response ID' ] ];
      $values[] = "($post_id, {$map_meta['mapping']['project_id']}, $reponse_id, '$event_fields' )";
    }

    $values = implode( ',', $values );
    $query = "INSERT INTO $this->table_name ($columns) VALUES $values ON DUPLICATE KEY UPDATE fields=VALUES(fields)";
    $created = $wpdb->query( $query );
    $updated = count( $events ) - $created;

    $event_counts = $wpdb->get_row( "SELECT COUNT(*) as total, COUNT(location_geo) as geocoded FROM $this->table_name WHERE post_id = $post_id" );
    wp_send_json( [ 'success' => true, 'created' => $created, 'updated' => $updated, 'events' => $event_counts ] );
  }

}

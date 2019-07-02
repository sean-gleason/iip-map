<?php

class IIP_Map_Import {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  function collapse( $fields, $values ) {
    $args = [];
    foreach ( $fields as $field ) {
      $args[] = trim( $values[$field->field] );
    }
    return implode( ', ', $args );
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

    if ( !in_array( $file['type'], array( 'text/plain', 'text/csv' ) ) ) {
      wp_send_json( [ 'success' => false, 'error' => 'File must be .csv format.' ] );
    }

    $map_meta = get_post_meta( $post_id, '_iip_map_fields_meta', true );
    if ( !$map_meta ) {
      wp_send_json( [ 'success' => false, 'error' => 'Project must be selected, and fields mapped before events can be imported.' ] );
    }
    $project_id = $map_meta['project_id'];
    if ( !$project_id ) {
      wp_send_json( [ 'success' => false, 'error' => 'Project ID has not been saved.' ] );
    }
    if ( !array_key_exists( 'mapping', $map_meta ) || !$map_meta['mapping'] ) {
      wp_send_json( [ 'success' => false, 'error' => 'Project fields must be mapped before events can be imported.' ] );
    }
    $fh = fopen( $file['tmp_name'], 'r+' );


    $values = [];
    $header = [];
    $missing_fields = [];
    if ( ($row = fgetcsv( $fh )) !== FALSE ) {
      foreach ( $row as $key => $value ) {
        $header[$value] = $key;
      }
      if ( !in_array( 'Response ID', $row ) ) {
        $missing_fields[] = 'Response ID';
      }
    } else {
      wp_send_json( [ 'success' => false, 'error' => 'Empty CSV file.' ] );
    }

    $mapping_keys = [ 'topic_arr', 'date_arr', 'time_arr', 'location_arr', 'name_arr', 'other_arr' ];
    $field_names = [];
    $field_data = [];
    foreach ( $mapping_keys as $map_key ) {
      foreach ( $map_meta['mapping'][$map_key] as $field ) {
        if ( !in_array( $field->name, array_keys( $header ) ) ) {
          $missing_fields[] = $field->name;
        }
        $field_names[] = $field->name;
        $field_data[$field->name] = $field;
      }
    }

    if ( count( $missing_fields ) > 0 ) {
      wp_send_json( [ 'success' => false, 'error' => "Missing required fields: \r\n" . implode( "\r\n", $missing_fields ) ] );
    }

    try {
      while ( ($row = fgetcsv( $fh )) !== FALSE ) {
        $response_id = $wpdb->_real_escape( $row[$header['Response ID']] );
        $event_fields = [];
        foreach ( $field_data as $key => $value ) {
          $data = $row[$header[$key]];
          if ( $value->fieldType === 'time' ) {
            if ( preg_match( '/^([0-9]+):([0-9]+) ([A-Za-z]+)$/', $data, $matches ) && count( $matches ) === 4 ) {
              $data = [ 'am_pm' => $matches[3], 'hours' => $matches[1], 'minutes' => $matches[2] ];
            } else {
              $data = [ 'am_pm' => '', 'hours' => '', 'minutes' => '' ];
            }
          } else if ( $value->fieldType === 'date' ) {
            if ( preg_match( '/^([0-9]+)\/([0-9]+)\/?([0-9]+)?$/', $data, $matches ) ) {
              if ( count( $matches ) === 4 ) {
                $data = [ 'day' => $matches[2], 'month' => $matches[1], 'year' => $matches[3] ];
              } else if ( count( $matches ) === 3 ) {
                $data = [ 'day' => $matches[2], 'month' => $matches[1], 'year' => date( 'y' ) ];
              } else {
                $data = [ 'day' => '0', 'month' => '0', 'year' => date( 'y' ) ];
              }
            } else {
              $data = [ 'day' => '0', 'month' => '0', 'year' => date( 'y' ) ];
            }
          }
          $event_fields[$value->field] = $data;
        }


        $topic = $wpdb->_real_escape( $this->collapse( $map_meta['topic_arr'], $event_fields ) );
        $location = $wpdb->_real_escape( $this->collapse( $map_meta['location_arr'], $event_fields ) );

        $event_fields = $wpdb->_real_escape( serialize( (object)$event_fields ) );
        $insert = "($post_id, '$response_id', $project_id, '$topic', '$location', '$event_fields' )";
        $values[] = $insert;
      }

      $total = count( $values );
      $values = implode( ',', $values );
      $query = "INSERT INTO $this->table_name (post_id, ext_id, project_id, topic, location, fields) VALUES $values ON DUPLICATE KEY UPDATE topic=VALUES(topic), fields=VALUES(fields), location=VALUES(location)";

      $created = $wpdb->query( $query );
      $updated = $total - $created;
    } catch ( Exception $e ) {
      wp_send_json( [ 'success' => false, 'error' => $e->getMessage() ] );
    }
    wp_send_json( [ 'success' => true, 'created' => $created, 'updated' => $updated ] );
  }

}

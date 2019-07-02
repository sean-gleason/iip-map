<?php

class IIP_Map_Export {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  function mash_object( $obj ) {
    $result = [];
    if ( is_object( $obj ) || is_array( $obj ) ) {
      foreach ( $obj as $key => $val ) {
        $result[] = "$key: " . $this->mash_object( $val );
      }
      return implode( "\r\n", $result );
    } else if ( is_array( $obj ) ) {
      foreach ( $obj as $val ) {
        $result[] = $this->mash_object( $val );
      }
      return implode( "\r\n", $result );
    } else {
      return $obj;
    }
  }

  function export_data_ajax() {
    check_ajax_referer( 'iip-map-export-nonce', 'security' );

    global $wpdb;

    $post_id = $_POST['post_id'];
    if ( !$post_id ) {
      wp_die( 'Invalid map ID.', 400 );
    }

    $map_meta = get_post_meta( $post_id, '_iip_map_fields_meta', true );
    if ( !$map_meta || !array_key_exists( 'mapping', $map_meta ) ) {
      wp_die( 'Mapping does not exist. Fields must be mapped before an export can be created.', 400 );
    }

    $query = $wpdb->prepare( "SELECT id,post_id,ext_id,title,location,topic,lat,lng,fields FROM `$this->table_name` WHERE post_id = %s", $post_id );
    $export_data = $wpdb->get_results( $query, ARRAY_A );

    // Set header row values
    $csv_fields = array();
    $csv_fields[] = 'ID';
    $csv_fields[] = 'Map ID';
    $csv_fields[] = 'Response ID';
    $csv_fields[] = 'Title';
    $csv_fields[] = 'Location';
    $csv_fields[] = 'Topic';
    $csv_fields[] = 'Latitude';
    $csv_fields[] = 'Longitude';

    $mapping = $map_meta['mapping'];
    $mapping_keys = [ 'topic_arr', 'date_arr', 'time_arr', 'location_arr', 'name_arr', 'other_arr' ];
    $fields = [];
    foreach ( $mapping_keys as $key ) {
      foreach ( $mapping[$key] as $field ) {
        $fields[$field->field] = $field;
      }
    }
    foreach ( $fields as $field_id => $field ) {
      $csv_fields[] = $field->name;
    }

    $output_filename = 'Data_for_Map_' . $post_id . '.csv';

    // Set CSV header info
    header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
    header( 'Content-Description: File Transfer' );
    header( 'Content-Type: application/csv; charset=utf-8' );
    header( 'Content-Disposition: attachment; filename=' . $output_filename );
    header( 'Content-Filename: ' . $output_filename );
    header( 'Expires: 0' );
    header( 'Pragma: public' );

    $output_handle = fopen( 'php://output', 'w' );

    // Insert header row
    fputcsv( $output_handle, $csv_fields );

    try {
      // Parse results to csv format
      foreach ( $export_data as $row ) {
        $field_vals = unserialize( $row['fields'] );
        unset( $row['fields'] );
        $row = array_values( $row ); // Cast the Object to an array
        foreach ( $fields as $field_id => $field ) {
          $val = $field_vals->$field_id;
          if ( $field->fieldType === 'date' ) {
            $row[] = "$val->month/$val->day/$val->year";
          } else if ( $field->fieldType === 'time' ) {
            $row[] = "$val->hours:$val->minutes $val->am_pm";
          } else if ( is_object( $val ) || is_array( $val ) ) {
            $row[] = $this->mash_object( $val );
          } else {
            $row[] = $val;
          }
        }

        fputcsv( $output_handle, $row ); // Add row to file
      }

      // Close output file stream
      fclose( $output_handle );
    } catch ( Exception $e ) {
      wp_die( $e, 400 );
    }

    wp_die();
  }
}

<?php

class IIP_Map_Export {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  function export_data_ajax() {
    check_ajax_referer( 'iip-map-export-nonce', 'security' );

    global $wpdb;

    $map_id = $_POST['map_id'];

//    $query = $wpdb->prepare("SELECT * FROM `$this->table_name` WHERE map_id = %s", $map_id);
    $query = $wpdb->prepare("SELECT id,map_id,ext_id,title,location,topic,lat,lng FROM `$this->table_name` WHERE map_id = %s", $map_id);
    $export_data = $wpdb->get_results($query, ARRAY_A);

    // Set header row values
    $csv_fields = array();
    $csv_fields[] = 'id';
    $csv_fields[] = 'map_id';
    $csv_fields[] = 'ext_id';
    $csv_fields[] = 'title';
    $csv_fields[] = 'location';
    $csv_fields[] = 'topic';
    $csv_fields[] = 'lat';
    $csv_fields[] = 'lng';
    $output_filename = 'Data_for_Map_' . $map_id . '.csv';

    // Set CSV header info
    header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
    header( 'Content-Description: File Transfer' );
    header( 'Content-Type: application/csv; charset=utf-8' );
    header( 'Content-Disposition: attachment; filename=' . $output_filename );
    header( 'Expires: 0' );
    header( 'Pragma: public' );

    $output_handle = fopen( 'php://output', 'w' );

    // Insert header row
    fputcsv( $output_handle, $csv_fields );

    // Parse results to csv format
    foreach ($export_data as $row) {
    	$leadArray = (array) $row; // Cast the Object to an array
    	fputcsv( $output_handle, $leadArray ); // Add row to file
    }

    // Close output file stream
    fclose( $output_handle );

    wp_die();
  }
}

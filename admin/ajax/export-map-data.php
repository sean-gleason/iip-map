<?php

class IIP_Map_Export {
  function export_data_ajax() {
    global $wpdb;

    $map_id = $_POST['map_id'];
    $table = $wpdb->prefix.'iip_map_data';

    $query = $wpdb->prepare("SELECT * FROM `$table` WHERE map_id = %s", $map_id);
    $export_data = $wpdb->get_results($query, ARRAY_A);

    // Set header row values
    $csv_fields = array();
    $csv_fields[] = 'id';
    $csv_fields[] = 'map_id';
    $csv_fields[] = 'venue_name';
    $csv_fields[] = 'venue_address';
    $csv_fields[] = 'venue_city';
    $csv_fields[] = 'venue_region';
    $csv_fields[] = 'venue_country';
    $csv_fields[] = 'lat';
    $csv_fields[] = 'lng';
    $csv_fields[] = 'event_name';
    $csv_fields[] = 'event_desc';
    $csv_fields[] = 'event_date';
    $csv_fields[] = 'event_time';
    $csv_fields[] = 'event_duration';
    $csv_fields[] = 'event_topic';
    $csv_fields[] = 'contact';
    $output_filename = 'Data_for_Map_' . $map_id . '.csv';

    // Set CSV header info
    header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
    header( 'Content-Description: File Transfer' );
    header( 'Content-Type: application/csv' );
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

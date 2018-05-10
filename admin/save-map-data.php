<?php

class IIP_Map_Ajax {
  function map_ajax() {
  	global $wpdb;

    $table = $wpdb->prefix.'iip_map_data';

    $map_id = $_POST['map_id'];
    $venue_city = $_POST['venue_city'];
    $venue_region = $_POST['venue_region'];
    $venue_country = $_POST['venue_country'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    $wpdb->insert(
    	$table,
    	array(
    		'map_id' => $map_id,
    		'venue_city' => $venue_city,
        'venue_region' => $venue_region,
        'venue_country' => $venue_country,
        'lat' => $lat,
        'lng' => $lng
    	),
    	array(
    		'%d',
    		'%s',
        '%s',
        '%s',
        '%f',
        '%f'
    	)
    );

    wp_die();
  }

}

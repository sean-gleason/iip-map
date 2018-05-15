<?php

class IIP_Map_Ajax {
  function map_ajax() {
  	global $wpdb;

    $table = $wpdb->prefix.'iip_map_data';

    $map_id = $_POST['map_id'];
    $venue = $_POST['venue'];
    $venue_address = $_POST['venue_address'];
    $venue_city = $_POST['venue_city'];
    $venue_region = $_POST['venue_region'];
    $venue_country = $_POST['venue_country'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    $event = $_POST['event'];
    $description = $_POST['description'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $duration = $_POST['duration'];
    $topic = $_POST['topic'];
    $contact = $_POST['contact'];

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

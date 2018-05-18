<?php

class IIP_Map_Import {
  function map_ajax() {
  	global $wpdb;

    $table = $wpdb->prefix.'iip_map_data';

    $map_id = $_POST['map_id'];
    $venue_name = $_POST['venue_name'];
    $venue_address = $_POST['venue_address'];
    $venue_city = $_POST['venue_city'];
    $venue_region = $_POST['venue_region'];
    $venue_country = $_POST['venue_country'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    $event_name = $_POST['event_name'];
    $event_desc = $_POST['event_desc'];
    $event_date = $_POST['event_date'];
    $event_time = $_POST['event_time'];
    $event_duration = $_POST['event_duration'];
    $event_topic = $_POST['event_topic'];
    $contact = $_POST['contact'];

    $wpdb->insert(
    	$table,
    	array(
    		'map_id' => $map_id,
    		'venue_name' => $venue_name,
        'venue_address' => $venue_address,
        'venue_city' => $venue_city,
        'venue_region' => $venue_region,
        'venue_country' => $venue_country,
        'lat' => $lat,
        'lng' => $lng,
        'event_name' => $event_name,
        'event_desc'=> $event_desc,
        'event_date' => $event_date,
        'event_time' => $event_time,
        'event_duration' => $event_duration,
        'event_topic' => $event_topic,
        'contact' => $contact
    	),
    	array(
    		'%d',
    		'%s',
        '%s',
        '%s',
        '%s',
        '%s',
        '%f',
        '%f',
        '%s',
        '%s',
        '%s',
        '%s',
        '%s',
        '%s',
        '%s',
    	)
    );

    wp_die();
  }

}

<?php

class IIP_Map_Import {
  function map_ajax() {
  	global $wpdb;
    $table = $wpdb->prefix.'iip_map_data';

    $data = $_POST['data'];

    foreach ($data as $entry) {

      // Convert date to proper format
      $date_array = $entry['event_date'];
      if ($date_array != null) {
        $event_date = date('Y-m-d', mktime(null, null, null, $date_array['month'], $date_array['day'], $date_array['year']));
      } else {
        $event_date = '0000-00-00';
      };

      // Convert time to proper format
      $time_array = $entry['event_time'];
      if ($time_array != null) {
        if ($time_array['am_pm'] == 'PM') {
          $hours = $time_array['hours'] + 12;
        } else {
          $hours = $time_array['hours'];
        }
        $event_time = date('H:i:s', mktime($hours, $time_array['minutes'], 00, null, null, null));
      } else {
        $event_time = '00:00:00';
      }

      // Get topic from array
      $topic_array = $entry['event_topic'];
      if ($topic_array != null) {
        $event_topic = $topic_array['checked'][0];
      } else {
        $event_topic = null;
      }

      $wpdb->insert(
      	$table,
      	array(
      		'map_id' => $entry['map_id'],
      		'venue_name' => $entry['venue_name'],
          'venue_address' => $entry['venue_address'],
          'venue_city' => $entry['venue_city'],
          'venue_region' => $entry['venue_region'],
          'venue_country' => $entry['venue_country'],
          'lat' => $entry['lat'],
          'lng' => $entry['lng'],
          'event_name' => $entry['event_name'],
          'event_desc'=> $entry['event_desc'],
          'event_date' => $event_date,
          'event_time' => $event_time,
          'event_duration' => $entry['event_duration'],
          'event_topic' => $event_topic,
          'contact' => $entry['contact']
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
    }

    wp_die();
  }

}

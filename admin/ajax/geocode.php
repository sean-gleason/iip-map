<?php

class IIP_Map_Geocode {
  function geocode_events_ajax() {
    global $wpdb;
    check_ajax_referer( 'iip-map-screendoor-nonce', 'security' );
    $api_key = get_option( 'iip_map_mapbox_api_key' );
    if ( !$api_key ) {
      wp_send_json_error( [ 'success' => false, 'error' => 'Missing MapBox API key.' ] );
    }
    $table_name = "{$wpdb->prefix}iip_map_data";

    $api_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    $post_id = $_POST[ 'postId' ];
    $query = "SELECT * FROM $table_name WHERE post_id = $post_id";
    $events = $wpdb->get_results( $query );
    $count = 0;
    $geocoded = 0;
    $attempted = 0;
    $incomplete = [];
    $geos = [];
    foreach ( $events as $event ) {
      $count++;
      if ( $event->location === $event->location_geo ) continue;
      $attempted++;
      $response = wp_remote_get( "{$api_url}{$event->location}.json?access_token=$api_key" );
      $loc = $wpdb->_real_escape( $event->location );
      $body = json_decode( $response['body'] );
      if ( count( $body->features ) > 0 ) {
        $feature = $body->features[0];
        $lat = $feature->center[0];
        $lng = $feature->center[1];
        $geos[] = [
          'loc' => $event->location,
          'lat' => $lat,
          'lng' => $lng,
          'place_name' => $feature->place_name
        ];
        $query = "UPDATE $table_name SET location_geo = '$loc', lat = $lat, lng = $lng WHERE id = $event->id";
        $wpdb->query( $query );
        $geocoded++;
      } else {
        $query = "UPDATE $table_name SET location_geo = '$loc', lat = NULL, lng = NULL WHERE id = $event->id";
        $wpdb->query( $query );
        $event->reason = isset( $body->message ) ? $body->message : 'Not found';
        $incomplete[] = $event;
      }
      if ( $attempted >= 20 ) break;
    }

    $events = $wpdb->get_row( "SELECT COUNT(*) as total, COUNT(location_geo) as geocoded FROM {$wpdb->prefix}iip_map_data WHERE post_id = $post_id" );
    wp_send_json( [
      'success' => true,
      'count' => $count,
      'geocoded' => $geocoded,
      'attempted' => $attempted,
      'geos' => $geos,
      'incomplete' => $incomplete,
      'events' => $events
    ] );
    exit;
  }
}

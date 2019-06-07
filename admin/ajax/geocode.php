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
    $geos = [];
    foreach ( $events as $event ) {
      $count++;
      if ( $event->location === $event->location_geo ) continue;
      $attempted++;
      $response = wp_remote_get( "{$api_url}{$event->location}.json?access_token=$api_key" );
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
        $query = "UPDATE $table_name SET location_geo = '$event->location', lat = $lat, lng = $lng WHERE id = $event->id";
        $wpdb->query( $query );
        $geocoded++;
      }
      file_put_contents( ABSPATH . 'geo.txt', print_r( $body, 1 ) . "\r\n" );
      if ( $attempted >= 20 ) break;
    }
    file_put_contents( ABSPATH . 'geo.txt', print_r( $geos, 1 ), FILE_APPEND );
    wp_send_json( [
      'success' => true,
      'count' => $count,
      'gecoded' => $geocoded,
      'attempted' => $attempted,
      'geos' => $geos
    ] );
    exit;
  }
}

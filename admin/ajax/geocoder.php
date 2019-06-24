<?php

class IIP_Map_Geocoder {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  function geocode_events_ajax() {
    global $wpdb;
    check_ajax_referer( 'iip-map-screendoor-nonce', 'security' );
    $api_key = get_option( 'iip_map_mapbox_api_key' );
    if ( !$api_key ) {
      wp_send_json( [ 'success' => false, 'error' => 'Missing MapBox API key.' ] );
    }

    $api_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    $post_id = $_POST[ 'postId' ];
    $query = "SELECT * FROM $this->table_name WHERE post_id = $post_id";
    $events = $wpdb->get_results( $query );
    $count = 0;
    $geocoded = 0;
    $attempted = 0;
    $skipped = 0;
    $incomplete = [];
    $geos = [];
    $more = false;
    foreach ( $events as $event ) {
      $count++;
      if ( $event->location === $event->location_geo ) {
        $skipped++;
        continue;
      }
      $attempted++;
      try {
          $response = wp_remote_get("{$api_url}{$event->location}.json?access_token=$api_key");
          if ($response instanceof WP_Error) {
              $event->reason = $response->get_error_message();
              $incomplete[] = $event;
              continue;
          }
          $loc = $wpdb->_real_escape($event->location);
          $body = json_decode($response['body']);
          if (count($body->features) > 0) {
              $feature = $body->features[0];
              $lat = $feature->center[0];
              $lng = $feature->center[1];
              $geos[] = [
                  'loc' => $event->location,
                  'lat' => $lat,
                  'lng' => $lng,
                  'place_name' => $feature->place_name
              ];
              $query = "UPDATE $this->table_name SET location_geo = '$loc', lat = $lat, lng = $lng WHERE id = $event->id";
              $wpdb->query($query);
              $geocoded++;
          } else {
              $query = "UPDATE $this->table_name SET location_geo = '$loc', lat = NULL, lng = NULL WHERE id = $event->id";
              $wpdb->query($query);
              $event->reason = isset($body->message) ? $body->message : 'Not found';
              $incomplete[] = $event;
          }
      } catch (Exception $e) {
          $event->reason = $e->getMessage();
          $incomplete[] = $event;
      }
      if ( $attempted >= IIP_MAP_GEOCODER_BATCH_SIZE ) {
        $more = true;
        break;
      }
    }

    $events = $wpdb->get_row( "SELECT COUNT(*) as total, COUNT(location_geo) as geocoded FROM $this->table_name WHERE post_id = $post_id" );
    wp_send_json( [
      'success' => true,
      'count' => $count,
      'geocoded' => $geocoded,
      'attempted' => $attempted,
      'geos' => $geos,
      'incomplete' => $incomplete,
      'skipped' => $skipped,
      'events' => $events,
      'more' => $more
    ] );
    exit;
  }
}

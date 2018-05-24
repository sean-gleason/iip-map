<?php

class IIP_Map_API_Route extends WP_REST_Controller {

  public function create_map_endpoint() {
    // Define API URL parameters
    $version = '1';
    $namespace = 'iip-map/v' . $version;
    $base = 'map/';

    $args = array(
      'post_type' => 'iip_map_data',
      'post_status' => 'publish',
      'fields' => 'ids'
    );

    $maps = get_posts( $args );

    foreach( $maps as $map ) {

      $get_item_args = array('map_id' => $map);

      register_rest_route( $namespace, '/' . $base . $map, array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => array($this, 'get_map_data'),
        'args' => $get_item_args,
      ) );
    }
  }

  public function get_map_data( $request ) {
    $item = $get_item_args;
    $data = array();

    $itemdata = $this->prepare_item_for_response( $item, $request );
    $data[] = $this->prepare_response_for_collection( $itemdata );

    return new WP_REST_Response( $data, 200 );
  }

  public function prepare_item_for_response( $item, $request ) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'iip_map_data';

    $query = "SELECT map_id, venue_name, venue_address, venue_city, venue_region, venue_country, lat, lng, event_name, event_desc, event_date, event_time, event_duration, event_topic, contact FROM $table_name";
    $list = $wpdb->get_results($query);
    return $list;
  }

}

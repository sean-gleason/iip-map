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
    // var_dump($map);
    register_rest_route( $namespace, '/' . $base . $map, array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => array($this, 'get_map_data'),
      'args' => $get_item_args,
    ) );

    }

  } // End create_map_endpoint

  public function get_map_data( $request ) {
    $item = $get_item_args;
    $data = array();

    $itemdata = $this->prepare_item_for_response( $item, $request );
    $data[] = $this->prepare_response_for_collection( $itemdata );

    return new WP_REST_Response( $data, 200 );

  }

  public function prepare_item_for_response( $item, $request ) {
    global $wpdb;
    $query = "SELECT map_id, lat, lng, venue_city FROM `wp_iip_map_data`";
    $list = $wpdb->get_results($query);
    return $list;
  }

  // public function read_map_json() {
  //
  //   $url = IIP_MAP_URL . 'public/map-data/markers'. $maps .'.json';
  //   var_dump($url);
  //   // $request = wp_remote_get( $url );
    //
    // $body = wp_remote_retrieve_body( $request );
    // $data = json_decode($body);

    // return $data;
  // } // End read_map_json


} // End IIP_Map_API Class

<?php

class IIP_Map_API {

  function read_map_json() {
    $map_id = 2;

    $url = IIP_MAP_URL . '/public/map-data/markers' . $map_id . '.json';

    $request = wp_remote_get( $url );

    $body = wp_remote_retrieve_body( $request );
    $data = json_decode($body);

    return $data;
  }

  public function create_endpoint() {
    $version = '1';
    $namespace = 'iip-map/v' . $version;
    $base = 'map/';
    $map_id = 2;
    register_rest_route( $namespace, '/' . $base . $map_id, array(
      'methods' => 'GET',
      'callback' => array($this, 'read_map_json'),
    ) );
  }

}

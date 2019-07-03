<?php

class IIP_Map_API_Route extends WP_REST_Controller {

  public function create_map_endpoint() {
    // Define API URL parameters
    $version = '1';
    $namespace = 'iip-map/v' . $version;
    $base = 'maps';

    register_rest_route( $namespace, '/' . $base, array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => array( $this, 'get_maps' ),
    ) );

    register_rest_route( $namespace, '/' . $base . '/(?P<id>[\d]+)', array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => array( $this, 'get_map_data' ),
    ) );
  }

  public function get_maps( $request ) {
    $args = array(
      'post_type' => 'iip_map_data',
      'post_status' => 'publish',
    );

    $data = [];

    $maps = get_posts( $args );

    if ( empty( $maps ) ) {
      return rest_ensure_response( $data );
    }

    foreach ( $maps as $map ) {
      $data[] = $this->prepare_response_for_collection( $map );
    }

    return rest_ensure_response( $data );
  }

  public function get_map_data( $request ) {
    $id = (int)$request['id'];

    $map = get_post( $id );

    if ( empty( $map ) ) {
      return rest_ensure_response( [] );
    }

    $response = $this->prepare_item_for_response( $map, $request );

    return $response;
  }

  public function prepare_item_for_response( $item, $request ) {
    $id = (int)$request['id'];

    global $wpdb;

    $table_name = $wpdb->prefix . 'iip_map_data';

    $query = "SELECT * FROM $table_name WHERE post_id = $id";
    $list = $wpdb->get_results( $query );
    $events = [];
    $count = 0;
    foreach ( $list as $row ) {
      $count++;
      $events[] = [
        'type' => 'Feature',
        'geometry' => [
          'type' => 'Point',
          'coordinates' => [
            // prevent events from having exact same coordinates
            0 => strval( $row->lat + ($count / 15000) ),
            1 => $row->lng,
          ],
        ],
        'properties' => [
          'id' => $row->id,
          'project_id' => $row->project_id,
          'ext_id' => $row->ext_id,
          'title' => $row->title,
          'location' => $row->location,
          'topic' => $row->topic,
          'fields' => unserialize( $row->fields ),
        ],
      ];
    }
    return [ 'type' => 'FeatureCollection', 'features' => $events ];
  }

  public function prepare_response_for_collection( $response ) {
    if ( !($response instanceof WP_REST_Response) ) {
      return $response;
    }

    $data = (array)$response->get_data();

    return $data;
  }

}

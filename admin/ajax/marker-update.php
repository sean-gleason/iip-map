<?php

class IIP_Map_Marker_Update {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  function get_marker_ajax(){
    check_ajax_referer( 'iip-map-marker-nonce', 'security' );

    global $wpdb;

    $ext_id = $_POST['id'];
    $post_id = $_POST['post_id'];

    if ( !$post_id ) {
      wp_send_json( [ 'success' => false, 'error' => 'Invalid post ID.' ] );
    }
    if ( !$ext_id ) {
      wp_send_json( [ 'success' => false, 'error' => 'Invalid marker ID.' ] );
    }

    $query = $wpdb->prepare("SELECT * FROM `$this->table_name` WHERE post_id = %d AND ext_id = %d",$post_id, $ext_id);
    $marker_data = $wpdb->get_row($query);
    if ( $marker_data ) {
      $marker_data->fields = unserialize( $marker_data->fields );
    }

    wp_send_json( ['success' => true, 'event' => $marker_data ] );
  }

  function update_marker_ajax(){
    check_ajax_referer( 'iip-map-marker-nonce', 'security' );

    global $wpdb;

    $id = $_POST['id'];
    $title = $_POST['title'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    if ( !$id ) {
      wp_send_json( [ 'success' => false, 'error' => 'Invalid ID.' ] );
    }

    if ( $lat == '' || $lng == '' || !is_numeric( $lat ) || !is_numeric( $lng ) ) {
      wp_send_json( [ 'success' => false, 'error' => 'Latitude and longitude must be numbers.' ] );
    }

    if ( !$title ) {
      wp_send_json( [ 'success' => false, 'error' => 'Event name is required.' ] );
    }

    $result = $wpdb->update(
      $this->table_name,
      [
        'title' => $title,
        'lat' => $lat,
        'lng' => $lng
      ],
      ['id' => $id],
      ['%s', '%f', '%f'],
      ['%d']
    );

    wp_send_json( ['success' => true, 'result' => $result] );
  }

  function delete_marker_ajax(){
    check_ajax_referer( 'iip-map-marker-nonce', 'security' );

    global $wpdb;

    $id = $_POST['id'];

    if ( !$id ) {
      wp_send_json( [ 'success' => false, 'error' => 'Invalid ID.' ] );
    }

    $result = $wpdb->delete( $this->table_name, ['id' => $id], ['%d'] );

    wp_send_json( ['success' => true, 'result' => $result] );
  }
}

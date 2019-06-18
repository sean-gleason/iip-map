<?php

class IIP_Map_Marker_Update {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  function get_marker_ajax(){
    check_ajax_referer( 'iip-map-update-nonce', 'security' );

    global $wpdb;

    $id = $_POST['id'];

    $query = $wpdb->prepare("SELECT title, lat, lng FROM `$this->table_name` WHERE id = %d", $id);
    $marker_data = $wpdb->get_results($query);

    echo json_encode($marker_data);

    wp_die();
  }

  function update_marker_ajax(){
    check_ajax_referer( 'iip-map-update-nonce', 'security' );

    global $wpdb;

    $id = $_POST['id'];
    $event_name = $_POST['event_name'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    $query = $wpdb->prepare("UPDATE `$this->table_name` SET title = %s, lat = %f, lng = %f  WHERE id = %d", $event_name, $lat, $lng, $id);
    $marker_data = $wpdb->get_results($query);

    wp_die();
  }

  function delete_marker_ajax(){
    check_ajax_referer( 'iip-map-update-nonce', 'security' );

    global $wpdb;

    $id = $_POST['id'];

    $query = $wpdb->prepare("DELETE FROM `$this->table_name` WHERE id = %d", $id);
    $wpdb->query($query);

    wp_die();
  }
}

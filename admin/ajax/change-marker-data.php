<?php

class IIP_Map_Marker_Update {
  function get_marker_ajax(){
    check_ajax_referer( 'iip-map-update-nonce', 'security' );

    global $wpdb;

    $id = $_POST['id'];
    $table = $wpdb->prefix.'iip_map_data';

    $query = $wpdb->prepare("SELECT event_name, lat, lng FROM `$table` WHERE id = %d", $id);
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

    $table = $wpdb->prefix.'iip_map_data';

    $query = $wpdb->prepare("UPDATE `$table` SET event_name = %s, lat = %f, lng = %f  WHERE id = %d", $event_name, $lat, $lng, $id);
    $marker_data = $wpdb->get_results($query);

    wp_die();
  }

  function delete_marker_ajax(){
    check_ajax_referer( 'iip-map-update-nonce', 'security' );

    global $wpdb;

    $id = $_POST['id'];
    $table = $wpdb->prefix.'iip_map_data';

    $query = $wpdb->prepare("DELETE FROM `$table` WHERE id = %d", $id);
    $wpdb->query($query);

    wp_die();
  }
}

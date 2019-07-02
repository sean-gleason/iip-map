<?php

class IIP_Map_Save_Events {
  private $table_name;

  public function __construct() {
    $this->table_name = IIP_MAP_EVENTS_TABLE;
  }

  function save_events_ajax() {
    global $wpdb;
    check_ajax_referer( 'iip-map-screendoor-nonce', 'security' );
    $id = $_POST[ 'postId' ];
    $project_id = $_POST['projectId'];
    $events = json_decode( stripslashes( $_POST['events'] ) );

    $values = [];
    foreach ( $events as $event ) {
      $fields = $wpdb->_real_escape( serialize( $event->fields ) );
      $title = $wpdb->_real_escape( $event->title );
      $loc = $wpdb->_real_escape( $event->location );
      $topic = $wpdb->_real_escape( $event->topic );
      $values[] = "($id, $event->ext_id, $project_id, '$title', '$topic', '$loc', '$fields')";
    }

    $query = "SELECT COUNT(id) FROM $this->table_name WHERE post_id = %d";
    $prevTotal = $wpdb->get_var( $wpdb->prepare( $query, $id ) );
    $prevTotal = $prevTotal ?: 0;

    $values = implode( ',', $values );
    $query = "INSERT INTO $this->table_name (post_id, ext_id, project_id, title, topic, location, fields) VALUES $values ON DUPLICATE KEY UPDATE title=VALUES(title), topic=VALUES(topic), fields=VALUES(fields), location=VALUES(location)";
    $result = $wpdb->query( $query );

    $query = "SELECT COUNT(*) as total, COUNT(location_geo) as geocoded FROM $this->table_name WHERE post_id = %d";
    $event_counts = $wpdb->get_row( $wpdb->prepare( $query, $id ) );
    $created = $event_counts->total - $prevTotal;
    wp_send_json( [ 'success' => true, 'created' => $created, 'updated' => $result - $created, 'events' => $event_counts ] );
  }
}

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
    $values = implode( ',', $values );
    $query = "INSERT INTO $this->table_name (post_id, ext_id, project_id, title, topic, location, fields) VALUES $values ON DUPLICATE KEY UPDATE title=VALUES(title), topic=VALUES(topic), fields=VALUES(fields), location=VALUES(location)";
    $created = $wpdb->query( $query );
    $updated = count( $events ) - $created;

    $event_counts = $wpdb->get_row( "SELECT COUNT(*) as total, COUNT(location_geo) as geocoded FROM $this->table_name WHERE post_id = $id" );
    wp_send_json( [ 'success' => true, 'created' => $created, 'updated' => $updated, 'events' => $event_counts ] );
  }
}

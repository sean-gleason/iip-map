<?php

// Fired during plugin activation. This class defines all code necessary to run during the plugin's activation.
class IIP_Map_Activator {

  public static function activate() {

    global $iip_map_db_version;
    $iip_map_db_version = '1.0';

    function iip_map_create_db() {
      global $wpdb;
      global $iip_map_db_version;

      $table_name = $wpdb->prefix . 'iip_map_data';

      $charset_collate = $wpdb->get_charset_collate();

      $sql = "CREATE TABLE IF NOT EXISTS $table_name (
              id int(11) NOT NULL AUTO_INCREMENT,
              map_id mediumint(9),
              venue_name varchar(255),
              venue_address varchar(255),
              venue_city varchar(255),
              venue_region varchar(255),
              venue_country varchar(255),
              lat float,
              lng float,
              host_name varchar(255),
              event_name varchar(255),
              event_desc text,
              event_date date,
              event_time time,
              event_duration varchar(255),
              event_topic text,
              contact varchar(255),
              PRIMARY KEY  (id),
              KEY map_id (map_id)
      ) $charset_collate;";

      require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
      dbDelta( $sql );

      add_option( 'iip_map_db_version', $iip_map_db_version );
    }

  }

}

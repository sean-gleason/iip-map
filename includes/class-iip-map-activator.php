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
              map_id mediumint(9) NOT NULL,
              event_name varchar(30),
              event_desc text,
              event_date date DEFAULT '0000-00-00',
              event_time time DEFAULT '00:00:00',
              event_duration varchar(10),
              event_topic text,
              venue_name varchar(50),
              venue_address varchar(50),
              venue_city varchar(30),
              venue_region varchar(30),
              venue_country varchar(30),
              lat float NOT NULL,
              lng float NOT NULL,
              contact varchar(30),
              PRIMARY KEY  (id),
              KEY map_id (map_id)
      ) $charset_collate;";

      require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
      dbDelta( $sql );

      add_option( 'jal_db_version', $jal_db_version );
    }
    
  }

}

<?php

// Embedded Google Map on page
class IIP_Map_Embed {

  public function __construct( $plugin_name, $version ) {
    $this->plugin = $plugin;
    $this->version = $version;
    $this->enqueue_scripts();
  }

  public function enqueue_scripts() {
    add_action( 'init', array( $this, 'register_map_embed_js' ) );
  }

  public function register_map_embed_js() {
    // Pass Screendoor API key and project info from admin page to geocoder
    wp_register_script( 'geocode-screendoor-entries', IIP_MAP_URL . 'js/geocode.js', array(), null, true );

    wp_localize_script( 'geocode-screendoor-entries', 'iip_map_params', array(
      'screendoor_project' => get_option( 'iip_map_screendoor_project' ),
      'screendoor_api_key' => get_option( 'iip_map_screendoor_api_key' ),
      'screendoor_city' => get_option( 'iip_map_screendoor_city' ),
      'screendoor_region' => get_option( 'iip_map_screendoor_region' ),
      'screendoor_country' => get_option( 'iip_map_screendoor_country' ),
      'google_api_key' => get_option( 'iip_map_google_maps_api_key' )
    ));

    wp_register_script( 'draw-map', IIP_MAP_URL . 'js/draw-map.js', array(), null, true );

    // Add Google Maps API script to page footer
    // wp_register_script( 'load-api-script', 'https://maps.googleapis.com/maps/api/js?key=' . get_option('iip_map_google_maps_api_key') . '&callback=initMap', array(), null, true );
  }

  // The output of the map shortcode
  public function iip_map_shortcode( $args ) {
    $attr = shortcode_atts( array(
      'id'     => '',
      'height' => 600,
      'zoom'   => 2,
      'lat'    => 30,
      'lng'    => 0
    ), $args );

    $map = $attr['id'];
    $height = $attr['height'];
    $zoom = $attr['zoom'];
    $lat = $attr['lat'];
    $lng = $attr['lng'];

    wp_localize_script( 'draw-map', 'iip_map_params', array(
      'google_api_key' => get_option( 'iip_map_google_maps_api_key' ),
      'map_zoom' => $zoom,
      'map_center_lat' => $lat,
      'map_center_lng' => $lng
    ));

    // wp_enqueue_script( 'geocode-screendoor-entries' );
    wp_enqueue_script( 'draw-map' );
    // wp_enqueue_script( 'load-api-script' );

    $html .= '<div id="map" style="height: ' . $height . 'px" class="iip-map-container" data-map-id="' . $map . '">';

    return $html;

  }

  // Register the map shortcode
  public function iip_map_added_shortcodes() {
    add_shortcode( 'map', array( $this, 'iip_map_shortcode' ) );
  }
}

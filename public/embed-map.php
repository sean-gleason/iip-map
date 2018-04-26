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
    // Pull Google Maps & Screendoor API keys from admin settings
    wp_localize_script( 'map-embed-js', 'iip-map', array(
      'iip_map_google_maps_api_key' => get_option( 'iip_map_google_maps_api_key' ),
      'iip_map_screendoor_api_key'  => get_option( 'iip_map_screendoor_api_key' )
    ));

    // Add Google Maps API script to page footer
    wp_register_script( 'load-api-script', 'https://maps.googleapis.com/maps/api/js?key=' . get_option('iip_map_google_maps_api_key') . '&callback=initMap', array(), null, true );

  }

  // The output of the map shortcode
  public function iip_map_shortcode( $args ) {
    $attr = shortcode_atts( array(
      'id'     => '',
      'height' => '',
      'zoom'   => '',
      'lat'    => '',
      'lng'    => ''
    ), $args );

    $map = $attr['id'];
    $height = $attr['height'];
    $zoom = $attr['zoom'];
    $lat = $attr['lat'];
    $lng = $attr['lng'];

    wp_enqueue_script( 'load-api-script' );

    $html .= '<div id="map" style="height: ' . $height . 'px" class="iip-map-container" data-map-id="' . $map . '">';
    $html .=
      '<script>
        function initMap() {
          var map = new google.maps.Map(document.getElementById("map"), {
            zoom: ' . $zoom . ' ,
            center: { lat: ' . $lat . ', lng: ' . $lng . ' }
          });
        }
      </script>';

    return $html;

  }

  // Register the map shortcode
  public function iip_map_added_shortcodes() {
    add_shortcode( 'map', array( $this, 'iip_map_shortcode' ) );
  }
}

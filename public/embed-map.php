<?php

// Embedded Google Map on page
class IIP_Map_Embed {

  public function __construct( $plugin_name, $version ) {
    $this->plugin_name = $plugin_name;
    $this->version = $version;
  }

  // Register script that embeds the map
  public function iip_map_register_embed() {
    wp_register_script( 'draw-map', plugin_dir_url( __FILE__ ) . 'js/dist/draw-map.min.js', array(), null, true );

    wp_register_script( 'marker-clusterer', plugin_dir_url( __FILE__ ) . 'js/dist/markerclusterer.min.js', array(), null, false);

    wp_register_script( 'marker-spiderfy', plugin_dir_url( __FILE__ ) . 'js/dist/overlapping-marker-spiderfy.min.js', array(), null, true);

    wp_enqueue_style( 'iip-map-frontend', plugin_dir_url( __FILE__ ) . 'css/iip-map-frontend.css', array(), $this->version, 'all' );
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

    // Set shortcode attributes as variables
    $map = $attr['id'];
    $height = $attr['height'];
    $zoom = $attr['zoom'];
    $lat = $attr['lat'];
    $lng = $attr['lng'];

    // Pass variables to map drawing file
    wp_localize_script( 'draw-map', 'iip_map_params', array(
      'google_api_key' => get_option( 'iip_map_google_maps_api_key' ),
      'map_id' => $map,
      'map_zoom' => $zoom,
      'map_center_lat' => $lat,
      'map_center_lng' => $lng
    ));

    // Load MarkerClusterer and return map
    wp_enqueue_script( 'marker-clusterer' );
    wp_enqueue_script( 'draw-map' );
    wp_enqueue_script( 'marker-spiderfy' );

    $html = '<div id="map" style="height: ' . $height . 'px" class="iip-map-container" data-map-id="' . $map . '"></div>';
    return $html;

  }

  // Register the map shortcode
  public function iip_map_add_shortcode() {
    add_shortcode( 'map', array( $this, 'iip_map_shortcode' ) );
  }
}

<?php

// Embedded Google Map on page
class IIP_Map_Embed {

  public function __construct( $plugin_name, $version ) {
    $this->plugin_name = $plugin_name;
    $this->version = $version;
  }

  // Register script that embeds the map
  public function iip_map_register_embed() {
    wp_register_script( 'draw-map', plugin_dir_url( __FILE__ ) . 'js/dist/draw-map.js', array(), null, true );

    wp_enqueue_style( 'iip-mapbox-frontend', 'https://api.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css', array(), null, 'all' );

    wp_enqueue_style( 'iip-map-frontend', plugin_dir_url( __FILE__ ) . 'css/iip-map-frontend.css', array(), $this->version, 'all' );

    wp_enqueue_style( 'ol-frontend', plugin_dir_url( __FILE__ ) . 'css/ol.css', array(), $this->version, 'all' );
  }

  // The output of the map shortcode
  public function iip_map_shortcode( $args ) {
    $attr = shortcode_atts( array(
      'id'     => '',
      'height' => 600,
      'zoom'   => 2,
      'lat'    => 30,
      'lng'    => 0,
      'type'   => 'mapbox'
    ), $args );

    // Set shortcode attributes as variables
    $map = $attr['id'];
    $height = $attr['height'];
    $zoom = $attr['zoom'];
    $lat = $attr['lat'];
    $lng = $attr['lng'];
    $type = $attr['type'];

    // Pass variables to map drawing file (for Google Maps)
    wp_localize_script( 'draw-map', 'iip_map_params', array(
      'mapbox_api_key' => get_option( 'iip_map_mapbox_api_key' ),
      'map_id' => $map,
      'map_zoom' => $zoom,
      'map_center_lat' => $lat,
      'map_center_lng' => $lng
    ));

    if ($type == 'mapbox' || $type == '') {
      wp_enqueue_script( 'mapbox' );
      wp_enqueue_script( 'draw-map' );
    }

    $html = '<div id="map" style="height: ' . $height . 'px" class="iip-map-container" data-map-id="' . $map . '"><div id="popup"></div></div>';
    return $html;

  }

  // Register the map shortcode
  public function iip_map_add_shortcode() {
    add_shortcode( 'map', array( $this, 'iip_map_shortcode' ) );
  }
}

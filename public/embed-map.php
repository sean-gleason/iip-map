<?php

// Embedded Google Map on page
class IIP_Map_Embed {

  public function __construct( $plugin_name, $version ) {
    $this->plugin_name = $plugin_name;
    $this->version = $version;
  }

  // Register script that embeds the map
  public function iip_map_register_embed() {
    wp_register_script( 'draw-map', plugin_dir_url( __FILE__ ) . 'dist/js/draw-map.js', array(), null, true );

    wp_register_script( 'table', plugin_dir_url( __FILE__ ) . 'dist/js/table.js', array(), null, true );

    wp_register_script( 'table-toggle', plugin_dir_url( __FILE__ ) . 'dist/js/table-button.js', array(), null, false );

    wp_enqueue_style( 'iip-mapbox-frontend', 'https://api.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css', array(), null, 'all' );

    wp_enqueue_style( 'table-frontend', plugin_dir_url( __FILE__ ) . 'dist/css/table.css', array(), $this->version, 'all' );
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

    $mapping = get_post_meta( $map, '_iip_map_fields_meta', true );

    // Pass variables to map drawing file (for Google Maps)
    wp_localize_script( 'draw-map', 'iip_map_params', array(
      'mapbox_api_key' => get_option( 'iip_map_mapbox_api_key' ),
      'map_id' => $map,
      'map_zoom' => $zoom,
      'map_center_lat' => $lat,
      'map_center_lng' => $lng,
      'mapping' => $mapping['screendoor']['mapping'],
      'card' => $mapping['screendoor']['card'],
    ));

    if ($type == 'mapbox' || $type == '') {
      wp_enqueue_script( 'mapbox' );
      wp_enqueue_script( 'draw-map' );
      wp_enqueue_script( 'table-toggle' );
      wp_enqueue_script( 'table' );
    }

    $html = '<div class="map-wrapper"><div id="filter-group" class="filter-group"><select style="background-image: url(/wp-content/plugins/iip-map/public/svg/arrow-down.svg);" id="topic-select"><option value="">- Select a topic -</option></select></div><div id="map" style="height: ' . $height . 'px" class="iip-map-container" data-map-id="' . $map . '"><div id="popup"></div></div></div><div class="table-wrapper"><button id="toggle-table">View this map as a table</button><div id="event-list" class="hidden"></div></div>';
    return $html;

  }

  // Register the map shortcode
  public function iip_map_add_shortcode() {
    add_shortcode( 'map', array( $this, 'iip_map_shortcode' ) );
  }
}

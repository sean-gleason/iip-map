<?php

class IIP_Map_Admin {

  private $plugin_name;
  private $version;

  //Initialize the class and set its properties.
  public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

  // Register the stylesheets for the admin area.
  public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/iip-map-admin.css', array(), $this->version, 'all' );
	}

  // Add to admin menu
  public function added_menu_page() {
    add_menu_page(
      __('IIP Map', 'iip-map'),
      __('Embed a Map', 'iip-map'),
      'activate_plugins',
      'iip-map-settings',
      array( $this, 'display_options_partial' ),
      'dashicons-location-alt'
    );
  }

  // Add API keys section to the plugin settings page
  public function added_settings_sections() {
    add_settings_section(
      __( 'iip_map_api_keys', 'iip-map' ),
      __( 'API Keys', 'iip-map' ),
      function() {
        echo '<p>Enter your API keys below. If you do not have a Google Maps API key, you can acquire one at the <a href="https://developers.google.com/maps/documentation/javascript/" target="_blank">Google Maps developer site</a>.</p>';
      }, $this->plugin_name );
  }

  //Create and register the fields on the plugin settings page
  public function added_settings_fields() {
    // Google Maps API Key
    add_settings_field(
      __( 'iip_map_google_maps_api_key' ),
      __( 'Google Maps API Key' ),
      array( $this, 'google_api_key_markup' ),
      $this->plugin_name,
      'iip_map_api_keys',
      array( 'label_for' => 'iip_map_google_maps_api_key' )
    );

    // Screendoor API Key
    add_settings_field(
      __( 'iip_map_screendoor_api_key' ),
      __( 'Screendoor API Key' ),
      array( $this, 'screendoor_api_key_markup' ),
      $this->plugin_name,
      'iip_map_api_keys',
      array( 'label_for' => 'iip_map_screendoor_api_key' )
    );

    register_setting( $this->plugin_name, 'iip_map_google_maps_api_key', 'sanitize_text_field' );
    register_setting( $this->plugin_name, 'iip_map_screendoor_api_key', 'sanitize_text_field' );
  }

  // HTML markup for the Google Maps API key field
  public function google_api_key_markup() {
    $key = get_option( 'iip_map_google_maps_api_key' );

    $html = '<fieldset>';
      $html .= '<input ';
        $html .= 'type="text" ';
        $html .= 'name="iip_map_google_maps_api_key" ';
        $html .= 'id="iip_map_google_maps_api_key" ';
        $html .= 'class="iip-map-textfield" ';
        $html .= 'value="' . $key . '">';
    $html .= '</fieldset>';

    echo $html;
  }

  // HTML markup for the Google Maps API key field
  public function screendoor_api_key_markup() {
    $key = get_option( 'iip_map_screendoor_api_key' );

    $html = '<fieldset>';
      $html .= '<input ';
        $html .= 'type="text" ';
        $html .= 'name="iip_map_screendoor_api_key" ';
        $html .= 'id="iip_map_screendoor_api_key" ';
        $html .= 'class="iip-map-textfield" ';
        $html .= 'value="' . $key . '">';
    $html .= '</fieldset>';

    echo $html;
  }

  // The admin area view for the plugin settings page
  public function display_options_partial() {
    include_once IIP_MAP_DIR . 'admin/partials/iip-map-admin-display.php';
  }

  // The output of the map shortcode
  public function iip_map_shortcode( $args ) {
    $attr = shortcode_atts( array(
      'id' => ''
    ), $args );

    $html .= '<div id="iip-map-container" class="iip-map-container" data-map-id="' . $attr['id'] . '"';
    $html .= '></div>';

    return $html;
  }

  // Register the course shortcode
  public function iip_map_added_shortcodes() {
    add_shortcode( 'map', array( $this, 'iip_map_shortcode' ) );
  }
}

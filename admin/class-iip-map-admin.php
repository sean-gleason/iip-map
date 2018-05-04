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

  // Add to API keys sub-menu to Maps post type admin
  public function added_admin_menu() {
    add_submenu_page(
      'edit.php?post_type=iip_map_data',
      __('Settings', 'iip-map'),
      __('Settings', 'iip-map'),
      'activate_plugins',
      'iip-map-keys',
      array( $this, 'display_keys_partial' )
    );
  }

  // Add API keys section to the plugin settings page
  public function added_settings_sections() {
    add_settings_section(
      'iip_map_api_keys',
      __( 'API Keys', 'iip-map' ),
      function() {
        echo '<p>Enter your API keys below. If you do not have a Google Maps API key, you can acquire one at the <a href="https://developers.google.com/maps/documentation/javascript/" target="_blank">Google Maps developer site</a>.</p>';
      },
      'iip-map-keys'
    );
  }

  //Create and register the fields on the plugin settings page
  public function added_settings_fields() {
    // Google Maps API Key
    add_settings_field(
      'iip_map_google_maps_api_key',
      __( 'Google Maps API Key', 'iip-map' ),
      array( $this, 'google_api_key_markup' ),
      'iip-map-keys',
      'iip_map_api_keys',
      array( 'label_for' => 'iip_map_google_maps_api_key' )
    );

    // Screendoor API Key
    add_settings_field(
      'iip_map_screendoor_api_key',
      __( 'Screendoor API Key', 'iip-map'),
      array( $this, 'screendoor_api_key_markup' ),
      'iip-map-keys',
      'iip_map_api_keys',
      array( 'label_for' => 'iip_map_screendoor_api_key' )
    );

    register_setting( 'iip-map-keys', 'iip_map_google_maps_api_key', 'sanitize_text_field' );
    register_setting( 'iip-map-keys', 'iip_map_screendoor_api_key', 'sanitize_text_field' );
  }

  // HTML markup for the API key fields
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
  public function display_keys_partial() {
    include_once IIP_MAP_DIR . 'admin/partials/iip-map-admin-display-keys.php';
  }
}

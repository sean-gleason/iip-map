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
  public function added_admin_menu() {
    add_menu_page(
      __('Configure Map', 'iip-map'),
      __('Add Map', 'iip-map'),
      'activate_plugins',
      'iip-map-configs',
      array( $this, 'display_configs_partial' ),
      'dashicons-location-alt'
    );

    add_submenu_page(
      'iip-map-configs',
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
    add_settings_section(
      'iip_map_setup',
      __( 'Configure Your Map', 'iip-map' ),
      function() {
        echo '<p>Test</p>';
      },
      'iip-map-setup'
    );
  }

  //Create and register the fields on the plugin settings page
  public function added_settings_fields() {
    // Screendoor Project ID
    add_settings_field(
      'iip_map_screendoor_project',
      __( 'Screendoor Project ID', 'iip-map'),
      array( $this, 'screendoor_project_markup' ),
      'iip-map-setup',
      'iip_map_setup',
      array( 'label_for' => 'iip_map_screendoor_project' )
    );

    // Screendoor city field
    add_settings_field(
      'iip_map_screendoor_city',
      __( 'Screendoor City Field ID', 'iip-map'),
      array( $this, 'screendoor_city_markup' ),
      'iip-map-setup',
      'iip_map_setup',
      array( 'label_for' => 'iip_map_screendoor_city' )
    );

    // Screendoor region field
    add_settings_field(
      'iip_map_screendoor_region',
      __( 'Screendoor Region Field ID', 'iip-map'),
      array( $this, 'screendoor_region_markup' ),
      'iip-map-setup',
      'iip_map_setup',
      array( 'label_for' => 'iip_map_screendoor_region' )
    );

    // Screedoor country field
    add_settings_field(
      'iip_map_screendoor_country',
      __( 'Screendoor Country Field ID', 'iip-map'),
      array( $this, 'screendoor_country_markup' ),
      'iip-map-setup',
      'iip_map_setup',
      array( 'label_for' => 'iip_map_screendoor_country' )
    );

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

    register_setting( 'iip-map-setup', 'iip_map_screendoor_project', 'sanitize_text_field' );
    register_setting( 'iip-map-setup', 'iip_map_screendoor_city', 'sanitize_text_field' );
    register_setting( 'iip-map-setup', 'iip_map_screendoor_region', 'sanitize_text_field' );
    register_setting( 'iip-map-setup', 'iip_map_screendoor_country', 'sanitize_text_field' );

    register_setting( 'iip-map-keys', 'iip_map_google_maps_api_key', 'sanitize_text_field' );
    register_setting( 'iip-map-keys', 'iip_map_screendoor_api_key', 'sanitize_text_field' );
  }


  // HTML markup for Screendoor data fields
  public function screendoor_project_markup() {
    $key = get_option( 'iip_map_screendoor_project' );

    $html = '<fieldset>';
      $html .= '<input ';
        $html .= 'type="text" ';
        $html .= 'name="iip_map_screendoor_project" ';
        $html .= 'id="iip_map_screendoor_project" ';
        $html .= 'class="iip-map-textfield" ';
        $html .= 'value="' . $key . '">';
    $html .= '</fieldset>';

    echo $html;
  }

  public function screendoor_city_markup() {
    $key = get_option( 'iip_map_screendoor_city' );

    $html = '<fieldset>';
      $html .= '<input ';
        $html .= 'type="text" ';
        $html .= 'name="iip_map_screendoor_city" ';
        $html .= 'id="iip_map_screendoor_city" ';
        $html .= 'class="iip-map-textfield" ';
        $html .= 'value="' . $key . '">';
    $html .= '</fieldset>';

    echo $html;
  }

  public function screendoor_region_markup() {
    $key = get_option( 'iip_map_screendoor_region' );

    $html = '<fieldset>';
      $html .= '<input ';
        $html .= 'type="text" ';
        $html .= 'name="iip_map_screendoor_region" ';
        $html .= 'id="iip_map_screendoor_region" ';
        $html .= 'class="iip-map-textfield" ';
        $html .= 'value="' . $key . '">';
    $html .= '</fieldset>';

    echo $html;
  }

  public function screendoor_country_markup() {
    $key = get_option( 'iip_map_screendoor_country' );

    $html = '<fieldset>';
      $html .= '<input ';
        $html .= 'type="text" ';
        $html .= 'name="iip_map_screendoor_country" ';
        $html .= 'id="iip_map_screendoor_country" ';
        $html .= 'class="iip-map-textfield" ';
        $html .= 'value="' . $key . '">';
    $html .= '</fieldset>';

    echo $html;
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
  public function display_configs_partial() {
    include_once IIP_MAP_DIR . 'admin/partials/iip-map-admin-display-configs.php';
  }

  public function display_keys_partial() {
    include_once IIP_MAP_DIR . 'admin/partials/iip-map-admin-display-keys.php';
  }
}

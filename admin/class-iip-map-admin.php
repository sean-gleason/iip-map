<?php

class IIP_Map_Admin {

  private $plugin_name;
  private $version;

  //Initialize the class and set its properties.
  public function __construct( $plugin_name, $version ) {
    $this->plugin_name = $plugin_name;
    $this->version = $version;
  }

  public function iip_map_admin_enqueue( $hook_suffix ){
    $cpt = 'iip_map_data';

    if( in_array($hook_suffix, array('post.php', 'post-new.php') ) ){
      $screen = get_current_screen();

      if( is_object( $screen ) && $cpt == $screen->post_type ){

        // Register the stylesheets for the admin area.
        wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/iip-map-admin.css', array(), $this->version, 'all' );

        // Enque geocoding script
        wp_enqueue_script( 'geocode-screendoor-entries', IIP_MAP_URL . 'js/geocode.js', array(), null, true );

      }
    }
  }

  // Add to API keys sub-menu to Maps post type admin
  public function iip_map_admin_menu() {
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
  public function iip_map_settings_sections() {
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
  public function iip_map_settings_fields() {
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

  public function get_map_variables() {
    global $post;
    $map_id = $post->ID;
    $project_id = get_post_meta( $post->ID, '_iip_map_screendoor_project', true);
    $city_field = get_post_meta( $post->ID, '_iip_map_screendoor_city', true);
    $region_field = get_post_meta( $post->ID, '_iip_map_screendoor_region', true);
    $country_field = get_post_meta( $post->ID, '_iip_map_screendoor_country', true);

    // Pass Screendoor API key and project info from admin page to geocoder
    wp_localize_script( 'geocode-screendoor-entries', 'iip_map_params', array(
      'map_data_id' => $map_id,
      'screendoor_project' => $project_id,
      'screendoor_city' => $city_field,
      'screendoor_region' => $region_field,
      'screendoor_country' => $country_field,
      'screendoor_api_key' => get_option( 'iip_map_screendoor_api_key' ),
      'google_api_key' => get_option( 'iip_map_google_maps_api_key' ),
      'ajax_url' => admin_url( 'admin-ajax.php' )
    ));
  }


}

<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://github.com/IIP-Design/
 * @since      1.0.0
 *
 * @package    IIP_Map
 * @subpackage IIP_Map/public
 */

class IIP_Map_Public {

  // The ID & version of this plugin.
  private $plugin_name;
  private $version;

  /**
   * Initialize the class and set its properties.
   *
   * @since    1.0.0
   * @param      string    $plugin_name       The name of the plugin.
   * @param      string    $version    The version of this plugin.
   */

  public function __construct( $plugin_name, $version ) {
      $this->plugin_name = $plugin_name;
      $this->version = $version;
  }

  // Register the JavaScript for the public-facing side of the site.
  public function enqueue_scripts() {
    global $post;

    if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'map' ) ) {
      $this->react_enqueue_and_localize();
    }
  }

  public function enqueue_styles() {
	  wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'iip-map-public.css', array(), $this->version, 'all' );
  }

  /**
   * Add react-map class to the body element
   *
   * @since   1.0.0
   */

  public function set_body_class( $classes ) {
    global $post;

    if ( has_shortcode( $post->post_content, 'map' ) ) {
      $new_classes = array_merge( $classes, array( 'react-map' ) );
      return $new_classes;
    } else {
      return $classes;
    }
  }

  // Enqueue the hashed React course file and pass the API URL to the script
  private function react_enqueue_and_localize() {
    wp_enqueue_script( 'iip-map', plugin_dir_url( __FILE__ ) . 'map-app/build/index.html');
  }
}

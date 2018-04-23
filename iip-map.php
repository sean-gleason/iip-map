<?php
/**
 * Plugin Name: Map Embed for IIP Properties
 * Description: Adds ability to embed a Google map onto a WordPress site
 * Version: 1.0.0
 * Author: Marek Rewers
 * Text Domain: iip-map
 * License: GPLv2 or laters
 */

 // If this file is called directly, abort.
 if ( ! defined( 'WPINC' ) ) {
 	die;
 }

 // Define constants
 define( 'IIP_MAP_DIR', plugin_dir_path( dirname( __FILE__ ) ) . 'iip-map/' );
 define( 'IIP_MAP_URL', plugin_dir_url( dirname( __FILE__ ) ) . 'iip-map/' );

 require plugin_dir_path( __FILE__ ) . 'includes/class-iip-map.php';


 /**
  * Begins execution of the plugin.
  *
  * Since everything within the plugin is registered via hooks,
  * then kicking off the plugin from this point in the file does
  * not affect the page life cycle.
  *
  * @since    1.0.0
  */

 function run_iip_map() {
 	$plugin = new IIP_Map();
 	$plugin->run();
 }

 run_iip_map();

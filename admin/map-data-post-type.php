<?php
class IIP_Map_Post_Type {

  // Post type name.
	public $name = 'iip_map_data';

  public function create_map_post_type(){
    $labels = array(
      'name'               => _x( 'IIP Map Data', 'post type general name', 'iip-map' ),
      'singular_name'      => _x( 'Map Data', 'post type singular name', 'iip-map' ),
      'menu_name'          => _x( 'Map Embed', 'admin menu', 'iip-map' ),
      'name_admin_bar'     => _x( 'Map Data', 'add new on admin bar', 'iip-map' ),
      'add_new_item'       => __( 'Add New Map', 'iip-map' ),
      'new_item'           => __( 'New Map', 'iip-map' ),
      'edit_item'          => __( 'Edit Map', 'iip-map' ),
      'view_item'          => __( 'View Map', 'iip-map' ),
      'all_items'          => __( 'All Maps', 'iip-map' ),
      'search_items'       => __( 'Search Maps', 'iip-map' ),
      'not_found'          => __( 'No Maps found.', 'iip-map' ),
      'not_found_in_trash' => __( 'No Maps found in Trash.', 'iip-map' )
    );

    $args   = array(
      'labels'               => $labels,
      'description'          => __( 'Configure Map', 'iip-map' ),
      'public'               => false,
      'publicly_queryable'   => false,
      'show_ui'              => true,
      'show_in_menu'         => true,
      'show_in_nav_menus'    => true,
      'show_in_admin_bar'    => true,
      'exclude_from_search'  => true,
      'query_var'            => false,
      'rewrite'              => array( 'slug' => 'map' ),
      'capability_type'      => 'post',
      'has_archive'          => false,
      'hierarchical'         => false,
      'can_export'           => true,
			'delete_with_user'     => false,
      'menu_position'        => 6,
      'register_meta_box_cb' => array( $this, 'map_add_metaboxes' ),
      'menu_icon'            => 'dashicons-location-alt',
      'supports'             => 'title'
    );

    register_post_type( $this->name, $args );
  }

  // Register the stylesheets for the admin area.
  public function enqueue_styles() {
    wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/iip-map-admin.css', array(), $this->version, 'all' );
  }

  public function map_add_metaboxes() {
    add_meta_box(
      'iip_map_project_info',
      __( 'Screendoor Project Information', 'iip-map' ),
      array( $this, 'project_info_metabox' ),
      $this->name,
      'normal',
      'high'
    );
    add_meta_box(
      'iip_map_shortcode',
      __( 'Shortcode Generator', 'iip-map' ),
      array( $this, 'shortcode_metabox' ),
      $this->name,
      'side',
      'low'
    );
  }

  public function project_info_metabox( $post ) {
    wp_nonce_field( 'map_project_info', 'map_project_info_nonce' );

    $map_id = $post->ID;
    $screendoor_project = get_post_meta( $post->ID, '_iip_map_screendoor_project', true);
    $screendoor_city = get_post_meta( $post->ID, '_iip_map_screendoor_city', true);
    $screendoor_region = get_post_meta( $post->ID, '_iip_map_screendoor_region', true);
    $screendoor_country = get_post_meta( $post->ID, '_iip_map_screendoor_country', true);

    ?>
    <div class="map-project-info-box" id="map-project-info-box">

      <div class="map-admin-clearfix">
        <label for="_iip_map_screendoor_project"><?php _e( 'Screendoor Project ID:', 'iip-map' )?></label>
        <input
          id="iip-map-screendoor-project"
          type="text"
          name="_iip_map_screendoor_project"
          class="map-admin-project-info-input"
          value="<?php if ( isset ( $screendoor_project ) ) echo $screendoor_project; ?>"
        /><br/>
      </div>

      <div class="map-admin-clearfix">
        <label for="_iip_map_screendoor_city"><?php _e( 'Screendoor City Field ID:', 'iip-map' )?></label>
        <input
          id="iip-map-screendoor-city"
          type="text"
          name="_iip_map_screendoor_city"
          class="map-admin-project-info-input"
          value="<?php if ( isset ( $screendoor_city ) ) echo $screendoor_city; ?>"
        /><br/>
      </div>

      <div class="map-admin-clearfix">
        <label for="_iip_map_screendoor_region"><?php _e( 'Screedoor Region Field ID:', 'iip-map' )?></label>
        <input
          id="iip-map-screendoor-region"
          type="text"
          name="_iip_map_screendoor_region"
          class="map-admin-project-info-input"
          value="<?php if ( isset ( $screendoor_region ) ) echo $screendoor_region; ?>"
        /><br/>
      </div>

      <div class="map-admin-clearfix">
        <label for="_iip_map_screendoor_country"><?php _e( 'Screendoor Country Field ID:', 'iip-map' )?></label>
        <input
          id="iip-map-screendoor-country"
          type="text"
          name="_iip_map_screendoor_country"
          class="map-admin-project-info-input"
          value="<?php if ( isset ( $screendoor_country ) ) echo $screendoor_country; ?>"
        /><br/>
      </div>

    </div>
    <?php
  }

  public function shortcode_metabox( $post ) {
    wp_nonce_field( 'map_shortcode', 'map_shortcode_nonce' );

    $map_id = $post->ID;
    $map_height = get_post_meta( $post->ID, '_iip_map_height', true);
    $map_zoom = get_post_meta( $post->ID, '_iip_map_zoom', true);
    $map_lat = get_post_meta( $post->ID, '_iip_map_lat', true);
    $map_lng = get_post_meta( $post->ID, '_iip_map_lng', true);

    ?>
    <div class="map-shortcode-box" id="map-shortcode-box">

      <div class="map-admin-clearfix">
        <label class="map-admin-shortcode-label" for="_iip_map_height"><?php _e( 'Map Height:', 'iip-map' )?></label>
        <input
          id="iip-map-height"
          type="text"
          name="_iip_map_height"
          class="map-admin-shortcode-input"
          value="<?php if ( isset ( $map_height ) ) echo $map_height; ?>"
        /><br/>
      </div>

      <div class="map-admin-clearfix">
        <label class="map-admin-shortcode-label" for="_iip_map_zoom"><?php _e( 'Map Zoom:', 'iip-map' )?></label>
        <input
          id="iip-map-zoom"
          type="text"
          name="_iip_map_zoom"
          class="map-admin-shortcode-input"
          value="<?php if ( isset ( $map_zoom ) ) echo $map_zoom; ?>"
        /><br/>
      </div>

      <div class="map-admin-clearfix">
        <label class="map-admin-shortcode-label" for="_iip_map_lat"><?php _e( 'Map Center Latitude:', 'iip-map' )?></label>
        <input
          id="iip-map-lat"
          type="text"
          name="_iip_map_lat"
          class="map-admin-shortcode-input"
          value="<?php if ( isset ( $map_lat ) ) echo $map_lat; ?>"
        /><br/>
      </div>

      <div class="map-admin-clearfix">
        <label class="map-admin-shortcode-label" for="_iip_map_lng"><?php _e( 'Map Center Longitude:', 'iip-map' )?></label>
        <input
          id="iip-map-lng"
          type="text"
          name="_iip_map_lng"
          class="map-admin-shortcode-input"
          value="<?php if ( isset ( $map_lng ) ) echo $map_lng; ?>"
        /><br/>
      </div>

      <div class="map-admin-shortcode-output">
        <label class="map-shortcode-output-label" for="iip_map_shortcode_output"><?php _e( 'Your Shortcode Is:', 'iip-map' )?></label><br/>
        <div class="map-shortcode-output">
          <?php echo '[map id=' . $map_id . ' height=' . $map_height . ' lat=' . $map_lat . ' lng=' . $map_lng . ']';?>
        </div>
      </div>

    </div>
    <?php
  }

  public function save_map_project_info_meta( $post_id, $post_object ) { // second parameter has useful info about current post

    // Checks save status
   	$is_revision = wp_is_post_revision( $post_id );
   	$is_valid_nonce = ( isset( $_POST[ 'map_project_info_nonce' ] ) && wp_verify_nonce( $_POST[ 'map_project_info_nonce' ], 'map_project_info' ) ) ? 'true' : 'false';

    // Exits script depending on save status
   	if ( $is_revision || !$is_valid_nonce ) {
   		return;
   	}

    if( !empty( $_POST['_iip_map_screendoor_project'] ) ) {
      update_post_meta ( $post_id, '_iip_map_screendoor_project', sanitize_text_field( $_POST['_iip_map_screendoor_project'] ) );
    }

    if( !empty( $_POST['_iip_map_screendoor_city'] ) ) {
      update_post_meta ( $post_id, '_iip_map_screendoor_city', sanitize_text_field( $_POST['_iip_map_screendoor_city'] ) );
    }

    if( !empty( $_POST['_iip_map_screendoor_region'] ) ) {
      update_post_meta ( $post_id, '_iip_map_screendoor_region', sanitize_text_field( $_POST['_iip_map_screendoor_region'] ) );
    }

    if( !empty( $_POST['_iip_map_screendoor_country'] ) ) {
      update_post_meta ( $post_id, '_iip_map_screendoor_country', sanitize_text_field( $_POST['_iip_map_screendoor_country'] ) );
    }
  }

  public function save_map_shortcode_meta( $post_id, $post_object ) { // second parameter has useful info about current post

    // Checks save status
   	$is_revision = wp_is_post_revision( $post_id );
   	$is_valid_nonce = ( isset( $_POST[ 'map_shortcode_nonce' ] ) && wp_verify_nonce( $_POST[ 'map_shortcode_nonce' ], 'map_shortcode' ) ) ? 'true' : 'false';

    // Exits script depending on save status
   	if ( $is_revision || !$is_valid_nonce ) {
   		return;
   	}

    if( !empty( $_POST['_iip_map_height'] ) ) {
      update_post_meta ( $post_id, '_iip_map_height', sanitize_text_field( $_POST['_iip_map_height'] ) );
    }

    if( !empty( $_POST['_iip_map_zoom'] ) ) {
      update_post_meta ( $post_id, '_iip_map_zoom', sanitize_text_field( $_POST['_iip_map_zoom'] ) );
    }

    if( !empty( $_POST['_iip_map_lat'] ) ) {
      update_post_meta ( $post_id, '_iip_map_lat', sanitize_text_field( $_POST['_iip_map_lat'] ) );
    }

    if( !empty( $_POST['_iip_map_lng'] ) ) {
      update_post_meta ( $post_id, '_iip_map_lng', sanitize_text_field( $_POST['_iip_map_lng'] ) );
    }
  }
}

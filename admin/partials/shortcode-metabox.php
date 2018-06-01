<?php

wp_nonce_field( 'map_shortcode', 'map_shortcode_nonce' );

$map_id = $post->ID;
$map_height = get_post_meta( $post->ID, '_iip_map_height', true);
$map_zoom = get_post_meta( $post->ID, '_iip_map_zoom', true);
$map_lat = get_post_meta( $post->ID, '_iip_map_lat', true);
$map_lng = get_post_meta( $post->ID, '_iip_map_lng', true);
$map_type = get_post_meta( $post->ID, '_iip_map_type', true);

?>
<div class="map-shortcode-box" id="map-shortcode-box">

  <div class="map-admin-shortcode-container">
    <div class="map-admin-shortcode-row">
      <label class="map-admin-shortcode-label" for="_iip_map_height"><?php _e( 'Map Height:', 'iip-map' )?></label>
      <input
        id="iip-map-height"
        type="text"
        name="_iip_map_height"
        class="map-admin-shortcode-input"
        value="<?php if ( isset ( $map_height ) ) echo $map_height; ?>"
      /><br/>
    </div>

    <div class="map-admin-shortcode-row">
      <label class="map-admin-shortcode-label" for="_iip_map_zoom"><?php _e( 'Map Zoom:', 'iip-map' )?></label>
      <input
        id="iip-map-zoom"
        type="text"
        name="_iip_map_zoom"
        class="map-admin-shortcode-input"
        value="<?php if ( isset ( $map_zoom ) ) echo $map_zoom; ?>"
      /><br/>
    </div>

    <div class="map-admin-shortcode-row">
      <label class="map-admin-shortcode-label" for="_iip_map_lat"><?php _e( 'Map Center Latitude:', 'iip-map' )?></label>
      <input
        id="iip-map-lat"
        type="text"
        name="_iip_map_lat"
        class="map-admin-shortcode-input"
        value="<?php if ( isset ( $map_lat ) ) echo $map_lat; ?>"
      /><br/>
    </div>

    <div class="map-admin-shortcode-row">
      <label class="map-admin-shortcode-label" for="_iip_map_lng"><?php _e( 'Map Center Longitude:', 'iip-map' )?></label>
      <input
        id="iip-map-lng"
        type="text"
        name="_iip_map_lng"
        class="map-admin-shortcode-input"
        value="<?php if ( isset ( $map_lng ) ) echo $map_lng; ?>"
      /><br/>
    </div>

    <div class="map-admin-shortcode-row">
      <label class="map-admin-shortcode-label" for="_iip_map_type"><?php _e( 'Map Type:', 'iip-map' )?></label>
      <select id="iip-map-type" name="_iip_map_type" class="map-admin-shortcode-select">
        <?php
          if ( !empty ( $map_type ) ) {
            echo '<option value="' . $map_type . '">' . $map_type . '</option>';
          } else {
            echo '<option> - Select - </option>';
          }
        ?>
        <option value="gmap">Google Maps</option>
        <option value="ol">OpenLayers</option>
      </select>
    </div>
  </div> <!-- End map-admin-shortcode-container -->

  <div class="map-admin-shortcode-output">
    <label class="map-shortcode-output-label" for="iip_map_shortcode_output"><?php _e( 'Your Shortcode Is:', 'iip-map' )?></label><br/>
    <div class="map-shortcode-output">
      <?php echo '[map id=' . $map_id . ' height=' . $map_height . ' zoom=' . $map_zoom . ' lat=' . $map_lat . ' lng=' . $map_lng . ' type=\'' . $map_type . '\']';?>
    </div>
  </div>

</div>

<?php

wp_nonce_field( 'geocoder_info', 'geocoder_info_nonce' );

function get_entry_number( $map_id ) {
  global $wpdb;
  $table = $wpdb->prefix.'iip_map_data';

  $query = "SELECT COUNT(*) FROM $table WHERE map_id = $map_id";
  $event_num = $wpdb->get_var($query);
  return $event_num;
}

$map_id = $post->ID;
$event_num = get_entry_number( $map_id );

$trigger_status = get_post_meta( $post->ID, '_iip_map_geocoder_trigger', true);
$complete_status = get_post_meta( $post->ID, '_iip_map_geocoder_complete', true);

?>
<div class="map-project-info-box" id="map-project-info-box">

  <div class="map-screendoor-fields-container">
    <div class="map-screendoor-fields">
      <div class="map-input-div">
        <label class="map-admin-label" for="_iip_map_screendoor_project"><?php _e( 'Screendoor Trigger Status:', 'iip-map' )?></label>
        <select id="iip-map-geocoder-trigger" name="_iip_map_geocoder_trigger" class="map-admin-geocoder-select">
          <?php if ( isset ( $trigger_status ) ) echo '<option value="' . $trigger_status . '">' . $trigger_status . '</option>'; ?>
        </select>
      </div>
    </div>

    <div class="map-screendoor-fields">
      <div class="map-input-div">
        <label class="map-admin-label" for="_iip_map_screendoor_city"><?php _e( 'Screendoor Completed Status:', 'iip-map' )?></label>
        <select id="iip-map-geocoder-complete" name="_iip_map_geocoder_complete" class="map-admin-geocoder-select">
          <?php if ( isset ( $complete_status ) ) echo '<option value="' . $complete_status . '">' . $complete_status . '</option>'; ?>
        </select>
      </div>
    </div>
  </div> <!-- end map-screendoor-fields-container -->

  <div class="map-admin-clearfix">
    <button class="button button-primary button-large" id="iip-map-geocode" type="button" name="geocode"><?php _e( 'Geocode Events', 'iip-map' )?></button>
  </div>
  <label for="_iip_map_geocoder_return" style="margin-left: 10px; font-weight: 600;"><?php _e( 'Geocoding Status:', 'iip-map' )?></label>
  <div class="inside" style="margin-right: 10px;">
    <div> <?php _e( 'There are', 'iip-map' )?> <?php echo $event_num ?> <?php _e( 'events saved to this map.', 'iip-map' )?> </div>
    <pre id="geocoder-return"><?php _e( 'Log:', 'iip-map' )?><br /></pre>
  </div>

</div>

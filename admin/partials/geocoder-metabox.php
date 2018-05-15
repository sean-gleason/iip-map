<?php

wp_nonce_field( 'geocoder_info', 'geocoder_info_nonce' );

function get_entry_number( $map_id ) {
  global $wpdb;
  $query = "SELECT COUNT(*) FROM `wp_iip_map_data` WHERE map_id = $map_id";
  $event_num = $wpdb->get_var($query);
  return $event_num;
}

$map_id = $post->ID;
$event_num = get_entry_number( $map_id );

?>
<div class="map-project-info-box" id="map-project-info-box">

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_project"><?php _e( 'Screendoor Trigger Status:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-geocoder-trigger"
        type="text"
        name="_iip_map_geocoder_trigger"
        class="map-admin-project-info-input"
        value="<?php ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_city"><?php _e( 'Screendoor Completed Status:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-geocoder-complete"
        type="text"
        name="_iip_map_geocoder_complete"
        class="map-admin-project-info-input"
        value="<?php ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <button class="button button-primary button-large" id="iip-map-geocode" type="button" name="geocode">Geocode Events</button>
  </div>
  <label for="_iip_map_geocoder_return" style="margin-left: 10px; font-weight: 600;"><?php _e( 'Geocoding Status:', 'iip-map' )?></label>
  <div class="inside" style="margin-right: 10px;">
    <div> There are <?php echo $event_num ?> events saved to this map.</div>
    <pre id="geocoder-return">Log:<br /></pre>
  </div>

</div>

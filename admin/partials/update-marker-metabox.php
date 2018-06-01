<?php

wp_nonce_field( 'map_update_marker', 'map_update_marker_nonce' );

?>
<div class="map-update-marker-box" id="map-update-marker-box">

  <div class="map-admin-clearfix">
    <p class="map-update-marker-text"><?php _e( 'Enter the id of the event you would like to update:', 'iip-map' )?></p>
    <input
      id="iip-map-event-id"
      type="text"
    />
  </div>
  <div class="map-admin-clearfix">
    <button class="button button-primary button-large" id="iip-map-update-marker" type="button" name="export"><?php _e( 'Find Event', 'iip-map' )?></button>
  </div>

</div>

<?php

wp_nonce_field( 'map_update_marker', 'map_update_marker_nonce' );

?>
<div class="map-update-marker-box" id="map-update-marker-box">
<form class="map-admin-form">

</form>

  <div class="map-admin-shortcode-row">
    <p class="map-update-marker-text"><?php _e( 'Enter the id of the event you would like to update:', 'iip-map' )?></p>
    <input
      id="iip-map-event-id"
      type="text"
      class="map-update-marker-input"
      name="_iip_map_event_id"
    />
    <div id="map-update-marker-spinner" class="map-admin-spinner"></div>
  </div>

  <div class="map-admin-shortcode-container map-admin-hidden">
    <div class="map-admin-shortcode-row">
      <label class="map-update-marker-values"><?php _e( 'Event Name:', 'iip-map' )?></label>
      <input
        id="iip-map-event-name"
        type="text"
        class="map-update-marker-values"
        name="_iip_map_event_name"
        value=""
      />
    </div>
    <div class="map-admin-shortcode-row">
      <label class="map-update-marker-values"><?php _e( 'Latitude:', 'iip-map' )?></label>
      <input
        id="iip-map-event-lat"
        type="text"
        class="map-update-marker-values"
        name="_iip_map_event_lat"
        value=""
      />
    </div>
    <div class="map-admin-shortcode-row">
      <label class="map-update-marker-values"><?php _e( 'Longitude:', 'iip-map' )?></label>
      <input
        id="iip-map-event-lng"
        type="text"
        class="map-update-marker-values"
        name="_iip_map_event_lng"
        value=""
      />
    </div>
    <div class="map-admin-shortcode-row map-admin-button-row">
      <button class="button button-medium" id="iip-map-update-marker" type="button" name="update-marker"><?php _e( 'Update Marker', 'iip-map' )?></button>
      <button class="button button-medium" id="iip-map-delete-marker" type="button" name="delete-marker"><?php _e( 'Delete Marker', 'iip-map' )?></button>
    </div>
  </div>

  <div class="map-admin-clearfix">
    <button class="button button-primary button-large map-update-marker-button" id="iip-map-find-event" type="button" name="find-event"><?php _e( 'Find Event', 'iip-map' )?></button>
  </div>

</form>
</div>

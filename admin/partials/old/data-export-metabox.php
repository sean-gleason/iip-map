<?php

wp_nonce_field( 'map_data_export', 'map_data_export_nonce' );

?>
<div class="map-data-export-box" id="map-data-export-box">

  <p class="map-data-export-text"><?php _e( 'Click the button below to export the data for this map as a CSV. This dataset includes all venue and event information for each event in this project.', 'iip-map' )?></p>
  <div class="map-admin-clearfix">
    <button class="button button-primary button-large" id="iip-map-export" type="button" name="export"><?php _e( 'Export Project Data', 'iip-map' )?></button>
    <div id="map-export-spinner" class="map-admin-spinner"></div>
  </div>

</div>

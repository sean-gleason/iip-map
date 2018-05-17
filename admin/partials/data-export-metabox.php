<?php

wp_nonce_field( 'map_data_export', 'map_data_export_nonce' );

?>
<div class="map-data-export-box" id="map-data-export-box">

  <p class="map-data-export-text"> Click the button below to export the data for this map as a CSV. This dataset includes all venue and event information for each event in this project.</p>
  <div class="map-admin-clearfix">
    <button class="button button-primary button-large" id="iip-map-export" type="button" name="export">Export Project Data</button>
  </div>

</div>

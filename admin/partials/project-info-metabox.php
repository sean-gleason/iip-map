<?php

wp_nonce_field( 'map_project_info', 'map_project_info_nonce' );

$map_id = $post->ID;
$screendoor_project = get_post_meta( $post->ID, '_iip_map_screendoor_project', true);
$screendoor_venue = get_post_meta( $post->ID, '_iip_map_screendoor_venue', true);
$screendoor_address = get_post_meta( $post->ID, '_iip_map_screendoor_venue', true);
$screendoor_city = get_post_meta( $post->ID, '_iip_map_screendoor_city', true);
$screendoor_region = get_post_meta( $post->ID, '_iip_map_screendoor_region', true);
$screendoor_country = get_post_meta( $post->ID, '_iip_map_screendoor_country', true);
$screendoor_event = get_post_meta( $post->ID, '_iip_map_screendoor_event', true);
$screendoor_desc = get_post_meta( $post->ID, '_iip_map_screendoor_desc', true);
$screendoor_date = get_post_meta( $post->ID, '_iip_map_screendoor_date', true);
$screendoor_time = get_post_meta( $post->ID, '_iip_map_screendoor_time', true);
$screendoor_duration = get_post_meta( $post->ID, '_iip_map_screendoor_duration', true);
$screendoor_topic = get_post_meta( $post->ID, '_iip_map_screendoor_topic', true);
$screendoor_contact = get_post_meta( $post->ID, '_iip_map_screendoor_contact', true);

?>
<div class="map-project-info-box" id="map-project-info-box">

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_project"><?php _e( 'Screendoor Project ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
      id="iip-map-screendoor-project"
        type="text"
        name="_iip_map_screendoor_project"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_project ) ) echo $screendoor_project; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_venue"><?php _e( 'Screendoor Venue Name Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-venue"
        type="text"
        name="_iip_map_screendoor_venue"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_venue ) ) echo $screendoor_venue; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_address"><?php _e( 'Screendoor Venue Address Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-address"
        type="text"
        name="_iip_map_screendoor_address"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_address ) ) echo $screendoor_address; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_city"><?php _e( 'Screendoor Venue City Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-city"
        type="text"
        name="_iip_map_screendoor_city"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_city ) ) echo $screendoor_city; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_region"><?php _e( 'Screedoor Venue Region Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-region"
        type="text"
        name="_iip_map_screendoor_region"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_region ) ) echo $screendoor_region; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_country"><?php _e( 'Screendoor Country Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-country"
        type="text"
        name="_iip_map_screendoor_country"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_country ) ) echo $screendoor_country; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_event"><?php _e( 'Screendoor Event Name Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-event"
        type="text"
        name="_iip_map_screendoor_event"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_event ) ) echo $screendoor_event; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_desc"><?php _e( 'Screendoor Event Description Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-desc"
        type="text"
        name="_iip_map_screendoor_desc"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_desc ) ) echo $screendoor_desc; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_date"><?php _e( 'Screendoor Event Date Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-date"
        type="text"
        name="_iip_map_screendoor_date"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_date ) ) echo $screendoor_date; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_time"><?php _e( 'Screendoor Event Time Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-time"
        type="text"
        name="_iip_map_screendoor_time"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_time ) ) echo $screendoor_time; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_duration"><?php _e( 'Screendoor Event Duration Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-duration"
        type="text"
        name="_iip_map_screendoor_duration"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_duration ) ) echo $screendoor_duration; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_topic"><?php _e( 'Screendoor Event Topic Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-topic"
        type="text"
        name="_iip_map_screendoor_topic"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_topic ) ) echo $screendoor_topic; ?>"
      />
    </div><br/>
  </div>

  <div class="map-admin-clearfix">
    <label class="map-admin-label" for="_iip_map_screendoor_contact"><?php _e( 'Screendoor Event Contact Field ID:', 'iip-map' )?></label>
    <div class="map-input-div">
      <input
        id="iip-map-screendoor-contact"
        type="text"
        name="_iip_map_screendoor_contact"
        class="map-admin-project-info-input"
        value="<?php if ( isset ( $screendoor_contact ) ) echo $screendoor_contact; ?>"
      />
    </div><br/>
  </div>

</div>

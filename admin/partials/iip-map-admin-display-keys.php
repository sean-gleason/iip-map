<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://github.com/IIP-Design/
 * @since      1.0.0
 *
 * @package    IIP_Map
 * @subpackage IIP_Map/admin/partials
 */
?>

<div class="wrap">
  <h2>
    <?php echo esc_html( get_admin_page_title() ); ?>
  </h2>

  <form action="options.php" method="post">
    <?php
      do_settings_sections( 'iip-map-keys', 'iip_map_api_keys' );
      settings_fields( 'iip-map-keys' );
      submit_button();
    ?>
  </form>
</div>

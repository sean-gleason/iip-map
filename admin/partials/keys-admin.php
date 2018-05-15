<?php

// Markup for the API key inputs
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

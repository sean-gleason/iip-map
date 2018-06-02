const exportDataBtn = document.getElementById('iip-map-export');
exportDataBtn.addEventListener('click', getMapProjectData);

// Pull project information from the database
function getMapProjectData() {
  const mapExportSpinner = document.getElementById('map-export-spinner');
  mapExportSpinner.style.display = 'block';
  statusDisplay('Initiating data export...');

  let projectId = iip_map_params.map_data_id;
  let data = {
    'action': 'export_data_ajax',
    'map_id': projectId,
    'security': iip_map_params.export_nonce
  }

  jQuery.ajax(
    {
      type: 'post',
      url: iip_map_params.ajax_url,
      data: data,
      success: function(data) {
        var uri = 'data:application/csv,' + data;
        window.location.href = uri;
        mapExportSpinner.style.display = 'none';
        statusDisplay('Exported complete!');
      },
      error: function(jqXHR, status, err) {
        mapExportSpinner.style.display = 'none';
        statusDisplay("Failed due to " + status + "! \n" + err);
      }

    }
  );
}

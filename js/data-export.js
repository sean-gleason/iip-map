const exportDataBtn = document.getElementById('iip-map-export');
exportDataBtn.addEventListener('click', getMapProjectData);

let projectId = export_params.map_data_id;

// Pull project information from the database
function getMapProjectData() {
  let data = {
    'action': 'export_data_ajax',
    'map_id': projectId
  }

  jQuery.ajax(
    {
      type: 'post',
      url: export_params.ajax_url,
      data: data,
      success: function() {
          console.log("Download worked!");
          // window.location.href = "/Data_for_Map_" + projectId + ".csv";
      },
      error: function(jqXHR, status, err) {
          console.log("Failed due to " + status + "! \n" + err);
      }

    }
  );
}

jQuery(document).ready(function($) {

  var endpoint = 'https://screendoor.dobt.co/api/projects/' + iip_map_params.screendoor_project + '/responses?per_page=5&v=0&api_key=' + iip_map_params.screendoor_api_key;

  var mapId = iip_map_params.map_data_id
  var cityField = iip_map_params.screendoor_city[0];
  var regionField = iip_map_params.screendoor_region[0];
  var countryField = iip_map_params.screendoor_country[0];

  // Make request to Screendoor API
  var request = new XMLHttpRequest();
  request.open('GET', endpoint);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    var data = request.response;

    populateSQLTable(data);
  }

  function populateSQLTable(jsonObj) {
    jsonObj.forEach(function(item) {

      var map_id = mapId;
      var venue_city = item.responses[cityField];
      var venue_region = item.responses[regionField];
      var venue_country = item.responses[countryField];

      var data = {
    		'action': 'map_ajax',
    		'map_id': map_id,
        'venue_city': venue_city,
        'venue_region': venue_region,
        'venue_country': venue_country,
    	};

      jQuery.ajax(
        {
          type: 'post',
          dataType: 'json',
          url: iip_map_params.ajax_url,
          data: data
        }
      );

    });
  }
});

// Add click event to Find Event button
const getMarkerBtn = document.getElementById('iip-map-find-event');
getMarkerBtn.addEventListener('click', getMarkerData);

// Add click event to Update Marker button
const updateMarkerBtn = document.getElementById('iip-map-update-marker');
updateMarkerBtn.addEventListener('click', updateMarker);

// Add click event to Delete Marker button
const deleteMarkerBtn = document.getElementById('iip-map-delete-marker');
deleteMarkerBtn.addEventListener('click', deleteMarker);

const hiddenDiv = document.querySelector('.map-admin-hidden');
const eventIdInput = document.getElementById('iip-map-event-id');
const eventIdSpinner = document.getElementById('map-update-marker-spinner');

const eventName = document.getElementById('iip-map-event-name');
const eventLat = document.getElementById('iip-map-event-lat');
const eventLng = document.getElementById('iip-map-event-lng');

let eventNonce = iip_map_params.update_nonce;

function getMarkerData() {
  let eventId = document.getElementById('iip-map-event-id').value;

  activateSpinner()
  statusDisplay('Fetching data for event #' + eventId + '...');

  let data = {
    'action': 'get_marker_ajax',
    'id': eventId,
    'security': eventNonce
  }

  jQuery.ajax({
    type: 'post',
    url: iip_map_params.ajax_url,
    data: data,
    success: function(data) {
      populateMarkerData(JSON.parse(data));
      restoreEventInput();
      hiddenDiv.style.display = 'block';
      statusDisplay('Successfully fetched data for event #' + eventId)
    },
    error: function(jqXHR, status, err) {
      statusDisplay('Failed to fetch data due to ' + status + '! \n' + err);
      restoreEventInput()
    }
  });
}

// Update marker
function updateMarker() {
  let eventId = document.getElementById('iip-map-event-id').value;

  activateSpinner()
  statusDisplay('Updating data for event #' + eventId + '...');

  let data = {
    'action': 'update_marker_ajax',
    'id': eventId,
    'security': eventNonce
  }

  jQuery.ajax({
    type: 'post',
    url: iip_map_params.ajax_url,
    data: data,
    success: function(data) {
      statusDisplay('Successfully update marker #' + eventId)
      restoreEventInput()
    },
    error: function(jqXHR, status, err) {
      statusDisplay('Failed due to ' + status + '! \n' + err);
      restoreEventInput()
    }
  });

  // Collapse marker data div
  hiddenDiv.style.display = 'none';
}

// Delete marker
function deleteMarker() {
  let eventId = document.getElementById('iip-map-event-id').value;

  activateSpinner()
  statusDisplay('Deleting event #' + eventId + '...');

  let data = {
    'action': 'delete_marker_ajax',
    'id': eventId,
    'security': eventNonce
  }

  jQuery.ajax({
    type: 'post',
    url: iip_map_params.ajax_url,
    data: data,
    success: function(data) {
      statusDisplay('Successfully deleted marker #' + eventId)
      restoreEventInput()
    },
    error: function(jqXHR, status, err) {
      statusDisplay('Failed due to ' + status + '! \n' + err);
      restoreEventInput()
    }
  });

  // Collapse marker data div
  hiddenDiv.style.display = 'none';
}

function populateMarkerData(data) {
  eventName.value = data[0].event_name;
  eventLat.value = data[0].lat;
  eventLng.value = data[0].lng;

  eventName.innerHTML = eventName.value;
  eventLat.innerHTML = eventLat.value;
  eventLng.innerHTML = eventLng.value;
}

// Swap in spinner for input field
function activateSpinner() {
  eventIdInput.style.display = 'none';
  eventIdSpinner.style.display = 'block';
}

// Swap input field back
function restoreEventInput() {
  eventIdInput.style.display = 'block';
  eventIdSpinner.style.display = 'none';
}

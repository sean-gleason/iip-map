import Map from 'ol/Map';
import Overlay from 'ol/Overlay.js';
import Feature from 'ol/Feature';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source.js';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from 'ol/style.js';
import { defaults as defaultInteractions } from 'ol/interaction.js';

// Import shortcode parameters
const map_id = iip_map_params.map_id;
const zoom = iip_map_params.map_zoom;
const lat = iip_map_params.map_center_lat;
const lng = iip_map_params.map_center_lng;

// Pull map data from iip-maps API
const mapDataEndpoint = '/wp-json/iip-map/v1/maps/' + map_id;
let mapDataXHR = new XMLHttpRequest();
mapDataXHR.open('GET', mapDataEndpoint);
mapDataXHR.responseType = 'json';
mapDataXHR.send();

mapDataXHR.onload = function() {
  const mapDataData = mapDataXHR.response;

  plotMarkers(mapDataData);
};

const markerSource = new VectorSource();

// define styles
// not used at the moment
const markerStyle = new Style( {
  image: new Icon( ( {
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    opacity: 1,
    src: '/wp-content/plugins/iip-map/static/map-pin.png'
  } ) )
} );

const markerLayer = new VectorLayer({
  source: markerSource,
  style: markerStyle,
});

const baseLayer = new TileLayer( {
  source: new OSM()
} );

const clusterSource = new Cluster({
  distance: (50),
  source: markerSource
});

let styleCache = {};
const clusterLayer = new VectorLayer({
  source: clusterSource,
  style: function(feature) {
    const size = feature.get('features').length;
    let style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: '#fff'
          }),
          fill: new Fill({
            color: '#0081FF'
          })
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff'
          })
        })
      });
      styleCache[size] = style;
    }
    return style;
  }
});

const map = new Map( {
  interactions: defaultInteractions( {
    doubleClickZoom: true,
    dragPan: true,
    keyboardPan: true,
    keyboardZoom: true,
    mouseWheelZoom: false,
  } ),
  target: 'public-map',
  layers: [
    baseLayer,
    clusterLayer
  ],
  view: new View( {
    center: [lat, lng],
    zoom: zoom
  } )
} );

// Plot markers onto map
function plotMarkers(m) {
  m.forEach(function (item) {
    const coordinates = [item.lat, item.lng];

    // Conditionals for the InfoWindows
    if ( item.event_topic !== null && item.event_topic !== '' ) {
      topicLine = '<h3 class="iip-map-ol-popup-header">Topic: ' + item.event_topic + '</h3>';
    } else {
      topicLine = '<div></div>';
    }

    if ( item.event_duration !== null && item.event_duration !== '' ) {
      durationLine = 'Estimated duration: ' + item.event_duration + '</p>';
    } else {
      durationLine = '';
    }

    if ( item.host_name !== null && item.host_name !== '' ) {
      hostLine = item.host_name;
    } else {
      hostLine = '';
    }

    if ( item.contact !== null && item.contact !== '' ) {
      contactLine = item.contact;
    } else {
      contactLine = '';
    }

    if ( hostLine !== '' && contactLine !== '' ) {
      contactBlock = '<h3 class="iip-map-ol-popup-header">Contact: </h3>' +
          '<p>' + hostLine + '<br />' +
          contactLine + '</p>';
    } else if ( hostLine === '' && contactLine !== '' ) {
      contactBlock = '<h3 class="iip-map-ol-popup-header">Contact: </h3>' +
          '<p>' + contactLine + '</p>';
    } else if ( hostLine !== '' && contactLine === '' )  {
      contactBlock = '<h3 class="iip-map-ol-popup-header">Contact: </h3>' +
          '<p>' + hostLine + '</p>';
    } else {
      contactBlock = '';
    }

    // Convert date from YYYY-MM-DD format
    let locale = 'en-us';
    let eventDate = new Date(item.event_date + "T" + item.event_time + "Z");

    let eventDay = eventDate.getDate();
    let eventMonth = eventDate.toLocaleString(locale, { month: 'long' });
    let dateLine = eventMonth + ' ' + eventDay;
    let eventHour = eventDate.getHours();
    let eventMinutes = ('0' + eventDate.getMinutes()).slice(-2);
    let timeLine = eventHour + ':' + eventMinutes;

    // Text of the InfoWindow
    let windowText = '<div id="bodyContent-' + item.id + '" class="iip-map-ol-popup-body">' +
        topicLine +
        '<p>' + item.event_desc + '</p>'+
        '<h3 class="iip-map-ol-popup-header">When: </h3>' +
        '<p> On ' + dateLine + ' at ' + timeLine + '. <br />' +
        durationLine +
        '<h3 class="iip-map-ol-popup-header">Where: </h3>' +
        '<p>' + item.venue_name + '<br />' +
        item.venue_city + '<br />' +
        contactBlock +
        '</div>';

    // Div for InfoWindow
    let windowContent = '<div class="iip-map-ol-popup" id="infowindow-' + item.id + '">' +
        '<h1 id="firstHeading" class="iip-map-ol-popup-header">' + item.event_name + ' - ' + dateLine + '</h1>' +
        windowText +
        '</div>';

    const poi = new Feature({
      geometry: new Point([coordinates]),
      id: item.id,
      title: item.event_name,
      content: windowContent,
      date: dateLine,
      text: windowText
    });

    markerSource.addFeature(poi);
  });
}

// Add click event to markers to show infowindow
map.on('click', function(evt) {

  let popup = new Overlay();
  map.addOverlay(popup);

  let coord = evt.coordinate;

  //Set event listener for eech marker
  let feature = map.forEachFeatureAtPixel(
      evt.pixel,
      function(feature, layer) {
        return feature;
      }
  );

  if (feature) {

    let data = feature.get('features');
    let content = data[0].N.content;
    let featureNum = data.length;

    // Show infowindow if only one event in cluster
    if (featureNum === 1) {
      popup.show(coord, content);
      centerMap();

      // Show accoridon of events if multiple events in cluster
    } else {
      let titleList = document.createElement('div');
      titleList.className = 'iip-map-ol-popup';

      for ( let i = 0; i < featureNum; i++) {

        let itemId = data[i].N.id;
        let itemTitle = '<h1 class="marker-event-title iip-map-ol-popup-header" id="title-marker-' + itemId + '">' + data[i].N.title + ' - ' + data[i].N.date + '<span class="arrow">\u25B2</span> </h1>';
        let itemText = '<div class="marker-text" id="text-marker-' + itemId + '">' + data[i].N.text + '</div>';
        let itemContainer = '<div class="marker-accordion closed">' + itemTitle + itemText + '</div>';

        titleList.insertAdjacentHTML('afterbegin', itemContainer);

      }
      popup.show(coord, titleList);
      centerMap();

      // Toggle description text when clicking on event title
      let accItem = document.getElementsByClassName('marker-accordion');
      let accHead = document.getElementsByClassName('marker-event-title');
      for (let i = 0; i < accHead.length; i++) {
        accHead[i].addEventListener('click', toggleItem, false);
      }

      function toggleItem() {

        let itemClass = this.parentNode.className;

        for (let i = 0; i < accItem.length; i++) {
          accItem[i].className = 'marker-accordion closed';
        }
        if (itemClass == 'marker-accordion closed') {
          this.parentNode.className = 'marker-accordion opened';
        }
      }

    }

  } else {
    popup.hide();
  }

  function centerMap() {
    // Center the map on infowindow
    let mapSize = map.getSize();
    let mapCenterX = mapSize[0] / 2;
    let mapCenterY = mapSize[1] / 4;

    mapCenter.centerOn(coord, map.getSize(), [mapCenterX, mapCenterY]);
  }

});
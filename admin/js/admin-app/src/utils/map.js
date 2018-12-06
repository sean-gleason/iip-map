import Map from 'ol/Map';
import View from 'ol/View';
import Zoom from 'ol/control/Zoom';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const adminMap = () => {
  const baseLayer = new TileLayer( {
    source: new XYZ( {
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    } )
  } );

  const baseView = new View( {
    center: [0, 0],
    zoom: 2
  } );

  const olMap = new Map( {
    target: 'admin-map',
    controls: [new Zoom()],
    layers: [baseLayer],
    view: baseView
  } );

  return olMap;
};

export const getMapProps = ( map ) => {
  const view = map.getView();
  const viewCenter = view.getCenter();
  const viewZoom = view.getZoom();

  const mapProps = {
    lat: viewCenter[1],
    lng: viewCenter[0],
    zoom: viewZoom
  };

  console.log( mapProps );
};

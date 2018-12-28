import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import Zoom from 'ol/control/Zoom';

export const adminMap = () => {
  const baseLayer = new TileLayer( {
    source: new XYZ( {
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    } )
  } );

  const baseView = new View( {
    center: [0, 0],
    projection: 'EPSG:4326',
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

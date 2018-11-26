import { Map, View } from 'ol';
import Zoom from 'ol/control/Zoom';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const adminMap = () => {
  const baseLayer = new TileLayer( {
    source: new XYZ( {
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    } )
  } );

  const olMap = new Map( {
    target: 'admin-map',
    controls: [new Zoom()],
    layers: [baseLayer],
    view: new View( {
      center: [0, 0],
      zoom: 2
    } )
  } );

  return olMap;
};

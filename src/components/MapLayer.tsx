import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type Location = [string, number, number, string, number, string];

type MapLayerProps = {
  center: [number, number];
  zoom: number;
  locations: Location[];
};

const MapLayer: React.FC<MapLayerProps> = ({ center, zoom, locations }) => {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {locations.map((location, index) => {
        return (
          <Marker key={index} position={[location[1], location[2]]}>
            <Popup>
              <h2>{location[0]}</h2>
              <p>{location[3]}</p>
              <p>{location[4]}</p>
              <p>{location[5]}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapLayer;

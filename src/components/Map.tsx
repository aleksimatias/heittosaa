import { useState, useEffect } from "react";
import "@fontsource/raleway/600.css";
import "@fontsource/open-sans/700.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Spinner, Heading, Text, Flex, Box } from "@chakra-ui/react";
import "../Leaflet.css";
import locationData from "../locations.json";
import { MarkerWithWeather } from "./Marker";
import { LocationType } from "../types";

export function MapLoadingContainer() {
  return (
    <Flex bg="#252525" w="100vw" h="90vh" justify="center" align="center" flexDir="column" textAlign="center">
      <Spinner color="textAbout" />
      <Heading mt="5" color="textAbout">
        Ladataan..
      </Heading>
      <Text mt="2.5" color="textAbout">
        Hyväksy paikannuspyyntö keskittääksesi karttanäkymän.
      </Text>
    </Flex>
  );
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function Map({ selectedMarker }: { selectedMarker: LocationType | null }) {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(6);

  useEffect(() => {
    if (selectedMarker && typeof selectedMarker[1] === "number" && typeof selectedMarker[2] === "number") {
      setCenter([selectedMarker[1], selectedMarker[2]]);
      setZoom(12);
    }
  }, [selectedMarker]);

  useEffect(() => {
    const defaultCoordinates: [number, number] = [62.35, 25.9];
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
        setZoom(12);
      },
      (error) => {
        console.error("Error obtaining geolocation: ", error);
        setCenter(defaultCoordinates);
      }
    );
  }, []);

  if (center === null) {
    return <MapLoadingContainer />;
  }

  return (
    <>
      <Box h="100vh">
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
        >
          <ChangeView center={center} zoom={zoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {locationData.map((location, index) => {
            if (typeof location[1] === "number" && typeof location[2] === "number") {
              return <MarkerWithWeather key={index} location={location as LocationType} />;
            }
            return null;
          })}
        </MapContainer>
      </Box>
    </>
  );
}

export default Map;

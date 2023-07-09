import { useState } from "react";
import { Flex, useDisclosure } from "@chakra-ui/react";
import "@fontsource/raleway/600.css";
import "@fontsource/open-sans/700.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Map from "./components/Map";
import Drawer from "./components/drawer/Drawer";
import { LocationType } from "./types";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<LocationType | null>(null);

  const handleClose = () => {
    onClose();
    setIsLoading(false);
  };

  return (
    <>
      <Flex flexDir="column" pos="relative" w="100vw" h="100vh" bg="#252525" overflowX="hidden">
        <Header onOpen={onOpen} isLoading={isLoading} setIsLoading={setIsLoading} />
        <Drawer isOpen={isOpen} onClose={handleClose} setSelectedMarker={setSelectedMarker} />
        <Map selectedMarker={selectedMarker} />
        <Footer />
      </Flex>
    </>
  );
}

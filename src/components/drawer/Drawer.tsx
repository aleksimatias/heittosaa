import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Box,
  Input,
  InputGroup,
  Drawer as ChakraDrawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Text,
  InputLeftElement,
  Flex,
  Tag,
  Icon,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import locationData from "../../locations.json";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { MdError } from "react-icons/md";
import { LocationType } from "../../types";
import Fuse from "fuse.js";
import { FixedSizeList as List } from "react-window";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Drawer({
  isOpen,
  onClose,
  setSelectedMarker,
}: {
  isOpen: boolean;
  onClose: () => void;
  setSelectedMarker: (value: LocationType | null) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [sortOrder, setSortOrder] = useState("0-asc");
  const [fuse, setFuse] = useState<Fuse<(string | number | null)[]> | null>(null);

  const handleClearSearch = () => {
    setSearch("");
  };

  useEffect(() => {
    const options = {
      keys: ["0"],
      includeScore: true,
      shouldSort: true,
      threshold: 0.3,
    };
    const fuseInstance = new Fuse(locationData, options);
    setFuse(fuseInstance);
  }, []);

  const results = useMemo(() => {
    return search ? fuse?.search(search).map((result) => result.item) : locationData;
  }, [search, fuse]);

  const filteredLocations = results || locationData;

  const sortedLocations = useMemo(() => {
    const ratingValueMap: Record<string, number> = {
      AAA1: 19,
      AA1: 18,
      AA2: 17,
      AA3: 16,
      A1: 15,
      A2: 14,
      A3: 13,
      BB1: 12,
      BB2: 11,
      BB3: 10,
      B1: 9,
      B2: 8,
      B3: 7,
      C1: 6,
      C2: 5,
      C3: 4,
      D1: 3,
      D2: 2,
      D3: 1,
    };

    return [...filteredLocations].sort((a, b) => {
      const [index, order] = sortOrder.split("-");
      const numIndex = Number(index);

      if (a[numIndex] === null || b[numIndex] === null) return 0;
      if (order === "asc") {
        if (a[numIndex] !== null && b[numIndex] !== null) {
          if (numIndex === 4) {
            return Number(a[numIndex]) - Number(b[numIndex]);
          } else if (numIndex === 5) {
            return (
              ratingValueMap[a[numIndex] as keyof typeof ratingValueMap] -
              ratingValueMap[b[numIndex] as keyof typeof ratingValueMap]
            );
          } else {
            return (a[numIndex] as string).localeCompare(b[numIndex] as string);
          }
        }
      } else {
        if (a[numIndex] !== null && b[numIndex] !== null) {
          if (numIndex === 4) {
            return Number(b[numIndex]) - Number(a[numIndex]);
          } else if (numIndex === 5) {
            return (
              ratingValueMap[b[numIndex] as keyof typeof ratingValueMap] -
              ratingValueMap[a[numIndex] as keyof typeof ratingValueMap]
            );
          } else {
            return (b[numIndex] as string).localeCompare(a[numIndex] as string);
          }
        }
      }

      return 0;
    });
  }, [filteredLocations, sortOrder]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listItem = ({ index, style }: any) => {
    const location = sortedLocations[index];
    return (
      <Flex
        borderBottom="1px solid"
        borderColor="textAbout"
        maxW="450"
        key={index}
        style={style}
        justify="flex-start"
        align="center"
        m={0}
      >
        <Flex m={2} gap={1} flexDir="row" w="60px" textAlign="left">
          {location[5] != null && location[5] != "" && location[5] != "-" ? (
            <Tag ml="-3px" fontSize="2xs" size="sm" colorScheme="blue" px={2} py={1}>
              {location[5]}
            </Tag>
          ) : (
            <Tag fontSize="2xs" size="sm" colorScheme="blue" px={2} py={1}>
              ?
            </Tag>
          )}
          <Tag fontSize="2xs" size="sm" colorScheme="orange" px={2} py={1}>
            {location[4]}
          </Tag>
        </Flex>
        <Text
          color={selectedLocation === location ? "#252525" : "white"}
          borderRadius="5"
          mb="2px"
          p="2px"
          cursor="default"
          fontSize="12px"
          ml={2}
          bg={selectedLocation === location ? "blue.100" : "#252525"}
          onClick={() => setSelectedLocation(location as LocationType)}
          maxW="170px"
        >
          {location[0]}
        </Text>
      </Flex>
    );
  };

  return (
    <>
      <ChakraDrawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bgColor="#252525" color="white">
          <DrawerCloseButton />
          <DrawerHeader pb={"40px"} borderBottomWidth="1px">
            Listanäkymä
          </DrawerHeader>

          <DrawerBody pt="16px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.500" />
              </InputLeftElement>
              <Input mb="2" placeholder="Hae ratoja" value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && search.length > 0 && (
                <InputRightElement>
                  <CloseIcon cursor="pointer" onClick={handleClearSearch} fontSize="12px" color="gray.500" />
                </InputRightElement>
              )}
            </InputGroup>

            <Flex alignItems="center">
              <Select
                onChange={(e) => setSortOrder(e.target.value)}
                value={sortOrder}
                backgroundColor="textAbout"
                color="#252525"
                width="100%"
                mb="2"
              >
                <option value="0-asc">Radan nimi (A-Ö)</option>
                <option value="0-desc">Radan nimi (Ö-A)</option>
                <option value="5-desc">Rataluokitus laskeva</option>
                <option value="5-asc">Rataluokitus nouseva</option>
                <option value="4-desc">Väylien määrä laskeva</option>
                <option value="4-asc">Väylien määrä nouseva</option>
              </Select>
            </Flex>

            <Box
              border="1px solid"
              borderRadius="5"
              borderColor="gray.200"
              maxW="500"
              w="500"
              maxH="80%"
              overflow="hidden"
            >
              {sortedLocations.length > 0 ? (
                <List height={500} itemCount={sortedLocations.length} itemSize={50} width={500}>
                  {listItem}
                </List>
              ) : (
                <Flex justify="center" align="center" direction="column" m={2}>
                  <Icon as={MdError} color="grey.500" boxSize={6} />
                  <Text color="white" mt={2}>
                    Ei hakutuloksia hakusanalla
                  </Text>
                  <Text color="white">"{search}".</Text>
                </Flex>
              )}
            </Box>
          </DrawerBody>

          <DrawerFooter pt="10px" borderTopWidth="1px">
            <Button variant="outline" color="white" _hover={{ bgColor: "whiteAlpha.200" }} mr={3} onClick={onClose}>
              Peruuta
            </Button>
            <Button
              border="1px solid"
              borderColor="transparent"
              bgColor="textAbout"
              color="#252525"
              onClick={() => {
                setSelectedMarker(selectedLocation);
                onClose();
              }}
              _hover={{ borderColor: "blobColor", color: "blobColor" }}
              _active={{ borderColor: "blobColor", color: "blobColor" }}
              _selected={{ borderColor: "blobColor", color: "blobColor" }}
            >
              Hyväksy
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
}

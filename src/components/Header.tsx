import { Box, Flex, Spinner, Button, Image } from "@chakra-ui/react";
import "@fontsource/raleway/600.css";
import "@fontsource/open-sans/700.css";
import { VscListSelection } from "react-icons/vsc";
import logo from "../assets/logo.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ onOpen, isLoading, setIsLoading }: any) {
  const handleButtonClick = () => {
    setIsLoading(true);
    onOpen();
  };

  return (
    <Flex bgColor="#3f3f3f" pos="fixed" w="100%" pl="5" py="5" justifyContent="space-between" top="0" zIndex="999">
      <Box justifyItems="flex-start" pl="5">
        <Image aria-label="logo" src={logo} w="50%" objectFit="contain" transform="scale(1.5)" />
      </Box>
      <Box justifySelf="flex-end" pr={5}>
        {isLoading ? (
          <Spinner color="textAbout" />
        ) : (
          <Button
            fontSize="lg"
            variant="outline"
            mt="1"
            py="2"
            onClick={handleButtonClick}
            bg="transparent"
            borderColor="textAbout"
            color="textAbout"
            aria-label="menu"
            leftIcon={<VscListSelection size="22px" />}
            _hover={{ bgColor: "blobColor", borderColor: "white", color: "white" }}
            _active={{ bgColor: "blobColor", borderColor: "white", color: "white" }}
            _selected={{ bgColor: "blobColor", borderColor: "white", color: "white" }}
          >
            Radat
          </Button>
        )}
      </Box>
    </Flex>
  );
}

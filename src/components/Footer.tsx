import { Box, chakra, Flex, Image, Text, useColorModeValue, VisuallyHidden } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { ReactNode } from "react";

const SocialButton = ({ children, label, href }: { children: ReactNode; label: string; href: string }) => {
  return (
    <chakra.button
      mb="-1"
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Flex
      h="80px"
      align="center"
      justify="space-between"
      w="100%"
      overflowX="hidden"
      bg="#252525"
      color="textAbout"
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor="textAbout"
      px="5"
      overflow="hidden"
      pos="fixed"
      bottom="0"
      zIndex="999"
    >
      <Box>
        <a href="https://www.buymeacoffee.com/aleksimatias" target="_blank" rel="noreferrer">
          <Image
            src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
            alt="Buy Me A Coffee"
            width="217px"
            height="60px"
            objectFit="contain"
            py="2"
            ml="-6"
          />
        </a>
      </Box>
      <Flex mr="0" alignItems="flex-end" flexDirection="column">
        <SocialButton label={"GitHub"} href={"#"}>
          <FaGithub />
        </SocialButton>
        <Text pb="1" color="textAbout">
          © 2023 aleksimatias
        </Text>
      </Flex>
    </Flex>
  );
}

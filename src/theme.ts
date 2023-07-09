import { extendTheme } from "@chakra-ui/react";
import { overrides } from "./overrides";

const theme = extendTheme(
  {
    colors: {
      textPrimary: "#2D3748",
      textSecondary: "#718096",
      textAbout: "#FFECCC",
      textFlutter: "#FFFFFF",
      bgPrimary: "#F7FAFC",
      bgSecondary: "#EDF2F7",
      bgTertiary: "#252525",
      bgAbout: "#C19A6B",
      bgFlutter: "#0d47a1",
      bgReact: "#1C2C4C",
      blobColor: "#504538",
    },
    fonts: {
      heading: "Open Sans, sans-serif",
      body: "Raleway, sans-serif",
      mono: "Menlo, monospace",
    },
    styles: {
      global: {
        "html, body": {
          color: "textPrimary",
          backgroundColor: "bgPrimary",
          lineHeight: "tall",
        },
        h1: {
          fontFamily: "heading",
          lineHeight: "none",
          fontWeight: "bold",
          fontSize: "4xl",
          color: "textPrimary",
        },
        h2: {
          fontFamily: "body",
          fontSize: "2xl",
          color: "textSecondary",
        },
        p: {
          fontFamily: "body",
          color: "textSecondary",
        },
      },
    },
  },
  overrides
);

export default theme;

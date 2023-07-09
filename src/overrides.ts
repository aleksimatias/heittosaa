export const overrides = {
  styles: {
    global: {
      /* Works on Firefox */
      body: {
        scrollbarWidth: "thin",
        scrollbarColor: "blue.500 transparent",
      },
      /* Works on Chrome, Edge, and Safari */
      "body::-webkit-scrollbar": {
        width: "12px",
      },
      "body::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "body::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(30, 36, 61, 0.5)",
        borderRadius: "20px",
        border: "3px solid transparent",
        backgroundClip: "content-box",
      },
      "body::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "rgba(30, 36, 61, 0.7)",
      },
    },
  },
};

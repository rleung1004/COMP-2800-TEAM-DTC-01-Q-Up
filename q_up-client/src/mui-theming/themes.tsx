import { createMuiTheme } from "@material-ui/core/styles";


  
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#FFFFFF",
      main: "#2b2c2c",
      dark: "#606060",
      contrastText: "#FFFFFF"
    },
    secondary: {
        main: "#EEF13E",
        contrastText:"#FFFFFF"
    },
  },
  overrides: {
    MuiButton: {
      root: {
        border: "thin solid #EEF13E",
        "&&:focus-visible": {
            "outline": "thin dotted black"
          }
      },
    },
    MuiTextField: {
      root: {
          "&&>div::before": {
              borderColor: "#EEF13E",
          },
          "&&>div:hover::before": {
            borderColor: "#c4c4c4"
          },
          "&&>label:not(.Mui-focused)": {
              color:"white"
          },
          "&& input": {
              color:"white"
          }
      }
    }
  },
});

export default () => theme;

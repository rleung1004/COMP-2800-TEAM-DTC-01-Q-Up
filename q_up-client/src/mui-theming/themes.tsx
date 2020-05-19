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
        dark: "#242323",
        contrastText:"#000"
    },
  },
  overrides: {
    MuiButton: {
      root: {
        border: "thin solid #EEF13E",
        minWidth: '12rem',
        "&&:focus-visible": {
            "outline": "thin dotted black"
          }
      },
    },
    MuiTextField: {
      root: {
          minWidth: '12rem',
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
    },
    MuiFormControl:{
      root:{
        "&&>div::before":{
          borderColor: "#EEF13E"
        },
        "&&>div:hover::before": {
          borderColor: "#c4c4c4"
        },
        "&&>.MuiFormLabel-root, &&>div": {
            color:"white"
        },
        "&&>div>div:focus":{
          backgroundColor:"#242323"
        }
      }
    },
    MuiSelect: {
      select: {
        minWidth: '12rem'
      }
    },
    MuiDialogTitle: {
      root: {
        color:"#FFF"
      }
    },
    MuiTypography: {
      body1: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
      },
      body2: {
        fontSize: '1.1rem'
      },
      h2: {
        fontSize: '1.8rem'
      },
      h3: {
        fontSize: '1.6rem'
      },
      h4: {
        fontSize: '1.3',
        fontWeight: 'bold'
      }
    }
  },
});

export default () => theme;

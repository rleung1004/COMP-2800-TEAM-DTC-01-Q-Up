import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
} from "react";
import app from "../firebase";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ConsumerNav from "../components/consumerNav";
import axios from "axios";
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import PhoneMaskedInput, { unMaskPhone } from "src/components/PhoneMaskedInput";

// Mui stylings
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  pageTitle: {
    margin: "20px auto 20px auto",
  },
  textField: {
    margin: "20px auto 20px auto",
  },
  button: {
    margin: "20px auto 20px auto",
  },
}));

/**
 * Render a consumer edit profile page.
 *
 * Accessible to: customers
 */
const ConsumerEditProfilePage = ({ history }: any) => {
  const classes = useStyles();

  // error type definition to be used in input feedback
  interface errors {
    phoneNumber?: string;
    postalCode?: string;
  }
  const errorObject: errors = {};

  //fetch flag
  const [getData, setGetData] = useState(true);

  // form data
  const [formState, setFormState] = useState({
    phoneNumber: "",
    postalCode: "",
    loading: false,
    errors: errorObject,
  });
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  /**
   * sync input data with form data
   *
   * Each input is assigned a name analog to the form data it represents.
   * On change the proper property in form data is access by using the name of the event emitter.
   * @param event an event with target
   */
  const handleOnFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // handle skip button click
  const handleCancelOnClick = useCallback(() => {
    if (window.confirm("Are you sure?")) {
      history.push("/consumerProfile");
    }
  }, [history]);

  // handle sumbit click
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      if (!window.confirm("Are you sure? Can't be undone.")) {
        return;
      }
      event.preventDefault();
      setFormState((prevState) => ({ ...prevState, loading: true }));
      const userData = {
        phoneNumber: unMaskPhone(formState.phoneNumber),
        postalCode: formState.postalCode.toUpperCase(),
      };
      console.log(userData);

      axios
        .put("/updateCustomer", userData, axiosConfig)
        .then(() => {
          history.push("/consumerProfile");
        })
        .catch((err: any) => {
          console.log(err);
          if (err.response.status && err.response.status === 332) {
            window.alert("Please login again to continue, your token expired");
            app.auth().signOut().catch(console.error);
            return;
          }
          setFormState((prevState) => ({
            ...prevState,
            errors: err.response.data,
            loading: false,
          }));
        });
    },
    [history, axiosConfig, formState]
  );

  // fetch data to prepopulate form
  useEffect(() => {
    if (!getData) {
      return;
    }
    return () => {
      setGetData(false);
      axios
        .get("/getCustomer", axiosConfig)
        .then((res: any) => {
          const data = res.data.customerData;
          setFormState({
            phoneNumber: data.phoneNumber ? data.phoneNumber : "",
            postalCode: data.postalCode ? data.postalCode : "",
            loading: false,
            errors: errorObject,
          });
        })
        .catch((err: any) => {
          console.log(err);
          if (err.response.status && err.response.status === 332) {
            window.alert("Please login again to continue, your token expired");
            app.auth().signOut().catch(console.error);
            return;
          }
          window.alert("Connection error");
        });
    };
  }, [axiosConfig, errorObject, getData]);

  if (JSON.parse(sessionStorage.user).type !== "customer") {
    history.push("/login");
  }

  return (
    <>
      <Header Nav={ConsumerNav} logout />
      <main>
        <Grid container direction="column" justify="center" alignItems="center">
          <form
            className={classes.root}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Grid
              container
              className="form"
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Typography variant="h2" className={classes.pageTitle}>
                Your info
              </Typography>
              <TextField
                color="secondary"
                id="phone"
                label="Phone number"
                name="phoneNumber"
                onChange={handleOnFieldChange}
                value={formState.phoneNumber}
                className={classes.textField}
                helperText={formState.errors.phoneNumber}
                error={!!formState.errors.phoneNumber}
                InputProps={{ inputComponent: PhoneMaskedInput as any }}
              />
              <TextField
                color="secondary"
                id="postalCode"
                label="Postal/Zip Code"
                name="postalCode"
                onChange={handleOnFieldChange}
                value={formState.postalCode}
                className={classes.textField}
                helperText={formState.errors.postalCode}
                error={!!formState.errors.postalCode}
              />
              <Typography variant="caption">Email cannot be changed</Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Update
              </Button>
            </Grid>
          </form>
          <Button variant="contained" onClick={handleCancelOnClick}>
            Cancel
          </Button>
        </Grid>
      </main>
      <Footer />
    </>
  );
};

export default withRouter(ConsumerEditProfilePage);

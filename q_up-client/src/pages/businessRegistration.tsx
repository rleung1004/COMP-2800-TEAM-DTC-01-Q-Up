import React, {useState, FormEvent, ChangeEvent, useEffect} from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import axios from "axios";
import "../styles/businessDashboard.scss";
import PhoneMaskedInput, { unMaskPhone } from "src/components/PhoneMaskedInput";


//Mui stylings
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
  provSelect: {
    minWidth: "4.5rem",
  },
  catSelect: {
    minWidth: "10.5rem",
  },
}));

/**
 * Render a business registration page.
 * 
 * Accessible to: managers
 */
export default function BusinessRegistrationPage() {
  const classes = useStyles();
  const array: Array<any> = [];
  const [dropdownData, setDropDownData] = useState({
    businessCategories: array,
    provinces: array,
  });
  const [getDropdownData, setGetDropdownData] = useState(true);
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  // error type definition to be used in input feedback
  interface errors {
    hours?: {
      startTime?: string;
      endTime?: string;
    };
    category?: string;
    email?: string;
    address?: {
      unit?: string;
      streetAddress?: string;
      city?: string;
      province?: string;
      postalCode?: string;
    };
    phoneNumber?: string;
    website?: string;
    averageWaitTime?: Number;
  }

  const errorObject: errors = {};

  // form data
  const [formState, setFormState] = useState({
    category: "",
    description: "",
    email: "",
    hours: {
      startTime: [
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
      ],
      endTime: ["00:01", "00:01", "00:01", "00:01", "00:01", "00:01", "00:01"],
    },
    address: {
      unit: "",
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
    },
    phoneNumber: "(1  )    -    ",
    website: "",
    averageWaitTime: "",
    loading: false,
    errors: errorObject,
  });

  /**
   * sync input data with form data
   * 
   * Each input is assigned a name analog to the form data it represents.
   * On change the proper property in form data is access by using the name of the event emitter.
   * @param event an event with target
   */
  const handleOnFieldChange = (event: any) => {
    const fieldNameTokens = event.target.name.split("-");
    const fieldCategory = fieldNameTokens[0];
    const name =
      fieldNameTokens.length !== 2 ? event.target.name : fieldNameTokens[1];
    const value = event.target.value;
    if (fieldCategory === "address") {
      setFormState((prevState) => ({
        ...prevState,
        address: { ...prevState.address, [name]: value },
      }));
    } else {
      setFormState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  /**
   * sync hour input data with form data
   * 
   * Each input is assigned a name analog to the form data it represents.
   * On change the proper property in form data is access by using the name of the event emitter.
   * @param event an event with target
   */
  const handleHourChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldNameTokens = event.target.name.split("-");
    const newValue = event.target.value;
    const timeType = fieldNameTokens[2];
    const weekdays = fieldNameTokens[1] === "weekday";
    const oldHours = formState.hours;
    const newHours = [""];
    if (weekdays) {
      for (let index = 1; index < 6; index++) {
        newHours[index] = newValue;
      }
      if (timeType === "startTime") {
        newHours[0] = oldHours.startTime[0];
        newHours[6] = oldHours.startTime[0];
      } else {
        newHours[0] = oldHours.endTime[0];
        newHours[6] = oldHours.endTime[0];
      }
      setFormState((prevState) => ({
        ...prevState,
        hours: { ...prevState.hours, [timeType]: newHours },
      }));
    } else {
      newHours[0] = newValue;
      newHours[6] = newValue;
      if (timeType === "startTime") {
        for (let index = 1; index < 6; index++) {
          newHours[index] = oldHours.startTime[1];
        }
      } else {
        for (let index = 1; index < 6; index++) {
          newHours[index] = oldHours.startTime[1];
        }
      }
      setFormState((prevState) => ({
        ...prevState,
        hours: { ...prevState.hours, [timeType]: newHours },
      }));
    }
  };

  /**
   * sync average wait time input data with form data
   * 
   * Each input is assigned a name analog to the form data it represents.
   * On change the proper property in form data is access by using the name of the event emitter.
   * 
   * Allowed range: 0 < 59
   * Only numbers allowed
   * Allows blank to avoid UX issues
   * 
   * @param event an event with target
   */
  const handleaverageWaitTImeChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    if (newValue === "") {
      setFormState((prevState) => ({
        ...prevState,
        averageWaitTime: newValue,
      }));
      return;
    }
    const newChar = newValue[newValue.length - 1];
    if (!("0" <= newChar && newChar <= "9")) {
      setFormState((prevState) => ({
        ...prevState,
        averageWaitTime: newValue.slice(0, -1),
      }));
      return;
    }
    const valueAsInt = parseInt(newValue);
    if (valueAsInt < 1) {
      setFormState((prevState) => ({ ...prevState, averageWaitTime: "1" }));
    } else if (valueAsInt > 59) {
      setFormState((prevState) => ({ ...prevState, averageWaitTime: "59" }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        averageWaitTime: newValue,
      }));
    }
  };

  // submit handler
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // validation
    if (formState.averageWaitTime === ' ') {
      setFormState((prevState:any) => ({
        ...prevState, errors: {
          ...prevState.errors,
          averageWaitTime: "Must enter a value"
        }
      })); 
      return;     
    }

    setFormState((prevState) => ({ ...prevState, loading: true }));

    // map package
    const userData = {
      phoneNumber: unMaskPhone(formState.phoneNumber),
      address: formState.address,
      category: formState.category,
      website: formState.website,
      hours: formState.hours,
      description: formState.description,
      email: formState.email,
      averageWaitTime: parseInt(formState.averageWaitTime),
    };

    // request
    axios
      .post("/registerBusiness", userData, axiosConfig)
      .then(() => {
        console.log("success registering business");

        window.location.href = "/businessDashboard";
      })
      .catch((err: any) => {
        console.log(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          window.location.href = '/login';
          return;
        }
        window.alert("Form error");
        setFormState((prevState) => ({
          ...prevState,
          errors: err.response.data,
          loading: false,
        }));
      });
  };

  useEffect(()=> {
    if (!getDropdownData) {
      return;
    }
    setGetDropdownData(false);
    axios
        .get('/getBusinessEnums', axiosConfig)
        .then(res => setDropDownData(res.data))
        .catch((err: any) => {
          console.log(err);
          if (err.response.status === 332) {
            window.alert("Please login again to continue, your token expired");
            window.location.href = '/login';
            return;
          }
          window.alert("Connection error");
        });
  }, [axiosConfig, getDropdownData]);
  return (
    <>
      <Header />
      <main>
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
              id="filled-multiline-static"
              label="Description"
              multiline
              rows={4}
              name="description"
              defaultValue="Default Value"
              value={formState.description}
              onChange={handleOnFieldChange}
            />
            <TextField
              required
              color="secondary"
              id="phone"
              label="Phone number"
              name="phoneNumber"
              onChange={handleOnFieldChange}
              value={formState.phoneNumber}
              className={classes.textField}
              helperText={formState.errors.phoneNumber}
              error={!!formState.errors.phoneNumber}
              InputProps={{inputComponent: PhoneMaskedInput as any} }
            />
            <TextField
              required
              color="secondary"
              id="email"
              label="Public email"
              name="email"
              onChange={handleOnFieldChange}
              value={formState.email}
              className={classes.textField}
              helperText={formState.errors.email}
              error={!!formState.errors.email}
            />
            <TextField
              required
              color="secondary"
              id="website"
              label="Website"
              name="website"
              onChange={handleOnFieldChange}
              value={formState.website}
              className={classes.textField}
              helperText={formState.errors.website}
              error={!!formState.errors.website}
            />
            <Grid item xs={12}>
              <FormControl className={classes.catSelect}>
                <InputLabel required color="secondary" id="category">
                  Business Category
                </InputLabel>
                <Select
                  color="secondary"
                  labelId="category-label"
                  id="category-select"
                  name="category"
                  value={formState.category}
                  onChange={handleOnFieldChange}
                >
                  {dropdownData.businessCategories.map((cat, key) => {
                    return (
                      <MenuItem key={key} value={cat}>
                        {cat}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <br />

            <Grid container item justify="center">
              <Typography variant="h6" align="center">
                Address
              </Typography>
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  id="unit"
                  label="Unit"
                  name="address-unit"
                  onChange={handleOnFieldChange}
                  value={formState.address.unit}
                  className={classes.textField}
                  helperText={formState.errors.address?.unit}
                  error={!!formState.errors.address?.unit}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  id="streetAddress"
                  label="Street address"
                  name="address-streetAddress"
                  onChange={handleOnFieldChange}
                  value={formState.address.streetAddress}
                  className={classes.textField}
                  helperText={formState.errors.address?.streetAddress}
                  error={!!formState.errors.address?.streetAddress}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="secondary"
                  id="City"
                  label="City"
                  name="address-city"
                  onChange={handleOnFieldChange}
                  value={formState.address.city}
                  className={classes.textField}
                  helperText={formState.errors.address?.city}
                  error={!!formState.errors.address?.city}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.provSelect}>
                  <InputLabel required color="secondary" id="province-label">
                    Prov.
                  </InputLabel>
                  <Select
                    color="secondary"
                    labelId="province-label"
                    id="province-select"
                    name="address-province"
                    value={formState.address.province}
                    onChange={handleOnFieldChange}
                  >
                    {dropdownData.provinces.map((prov, key) => {
                      return (
                        <MenuItem key={key} value={prov}>
                          {prov}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Grid item xs={12}>
                  <TextField
                    color="secondary"
                    id="postalCode"
                    label="Postal Code"
                    name="address-postalCode"
                    onChange={handleOnFieldChange}
                    value={formState.address.postalCode}
                    className={classes.textField}
                    helperText={formState.errors.address?.postalCode}
                    error={!!formState.errors.address?.postalCode}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container item direction="column">
                <br />
                <Typography variant="h6">Operation hours</Typography>
                <br />
                <Typography variant="body1">Weekdays</Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      color="secondary"
                      id="time"
                      label="Start time"
                      type="time"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 900,
                      }}
                      name="hours-weekday-startTime"
                      onChange={handleHourChange}
                      value={formState.hours.startTime[1]}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      color="secondary"
                      id="time"
                      label="Close time"
                      type="time"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 900,
                      }}
                      name="hours-weekday-endTime"
                      onChange={handleHourChange}
                      value={formState.hours.endTime[1]}
                      required
                    />
                  </Grid>
                </Grid>
                <Typography variant="body1">Weekends</Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      color="secondary"
                      id="time"
                      label="Start time"
                      type="time"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 900,
                      }}
                      name="hours-weekend-startTime"
                      onChange={handleHourChange}
                      value={formState.hours.startTime[0]}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      color="secondary"
                      id="time"
                      label="Close time"
                      type="time"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 900,
                      }}
                      name="hours-weekend-endTime"
                      onChange={handleHourChange}
                      value={formState.hours.endTime[0]}
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item direction="column">
                <br />
                <Typography variant="h6">
                  Estimated Serving Frequency(SF)
                </Typography>
                <Typography variant="caption">
                  Estimated Serving Frequency measures how often you can serve a
                  new frequency. This will be used to estimate wait times until
                  our app has sufficient data.
                </Typography>
                <Grid container item justify="center" alignItems="center">
                  <TextField
                    label="SF in Minutes"
                    name="servingFrequency"
                    color="secondary"
                    size="small"
                    onChange={handleaverageWaitTImeChange}
                    value={formState.averageWaitTime}
                    required
                  />
                  <Typography variant="body1">minutes</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Submit
            </Button>
          </Grid>
        </form>
      </main>
      <Footer />
    </>
  );
}

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
} from "react";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../Auth";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/loginPage.scss";
import app from "../firebase";
import FirebaseLogin from "../components/socialMediaLogin";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
// material-ui components
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

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
  customError: {
    color: "red",
    fontSize: "0.8em",
  },
}));

/**
 * Render a login page.
 *
 * Accessible to: All users
 */
const LoginPage = ({ history }: any) => {
  const classes = useStyles();

  // error type definition to be used in input feedback for login form
  interface errors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    userType?: string;
    general?: string;
  }
  let errorObject: errors = {};

  // form data
  const [formState, setFormState] = useState({
    password: "",
    email: "",
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
  const handleOnFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // handle submit click
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      setFormState((prevState) => ({ ...prevState, loading: true }));

      const userData = {
        email: formState.email,
        password: formState.password,
      };
      axios
        .post("/login", userData)
        .then(async (res: any) => {
          try {
            await app
              .auth()
              .signInWithEmailAndPassword(userData.email, userData.password);
          } catch (err) {
            alert(err);
          }
          switch (res.data.userType) {
            case "manager":
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  token: res.data.generatedToken,
                  type: "manager",
                })
              );
              history.push("/businessDashBoard");
              break;
            case "employee":
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  token: res.data.generatedToken,
                  type: "employee",
                })
              );
              history.push("/teller");
              break;
            case "display":
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  token: res.data.generatedToken,
                  type: "display",
                })
              );
              break;
            case "booth":
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  token: res.data.generatedToken,
                  type: "booth",
                })
              );
              history.push("/boothDashBoard");
              break;
            default:
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  token: res.data.generatedToken,
                  type: res.data.userType,
                  email: res.data.userEmail,
                })
              );
              history.push("/consumerDashboard");
              break;
          }
        })
        .catch((err) => {
          console.log(err);

          setFormState((prevState) => ({
            ...prevState,
            errors: err.response.data,
            loading: false,
          }));
        });
    },
    [formState.email, formState.password, history]
  );
  // if user is authenticated redirect them to their home route (does not save current route into history) 
  const currentUser = useContext(AuthContext);

  if (currentUser) {
    switch (JSON.parse(sessionStorage.user).type) {
      case "manager":
        return <Redirect to="/businessDashboard" />;
      case "employee":
        return <Redirect to="/teller" />;
      case "booth":
        return <Redirect to="/boothDashboard" />;
      default:
        return <Redirect to="/consumerDashboard" />;
    }
  }

  return (
    <>
      <Header />
      <main>
        <Grid container direction="column" justify="center" alignItems="center">
          <form
            className={classes.root}
            noValidate
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
                Login
              </Typography>
              <TextField
                required
                id="email"
                label="Email"
                name="email"
                onChange={handleOnFieldChange}
                value={formState.email}
                className={classes.textField}
                helperText={formState.errors.email}
                error={formState.errors.email ? true : false}
                color="secondary"
              />

              <TextField
                required
                id="password"
                label="Password"
                name="password"
                type="password"
                onChange={handleOnFieldChange}
                value={formState.password}
                helperText={formState.errors.password}
                error={formState.errors.password ? true : false}
                color="secondary"
              />

              {formState.errors.general && (
                <Typography variant="body2" className={classes.customError}>
                  {formState.errors.general}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Login
              </Button>
            </Grid>
          </form>
          <FirebaseLogin />
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.goBack()}
          >
            Back
          </Button>

          <div className="text-center last-element">
            Don't have an account? Sign up <Link to="/signup">here</Link>
          </div>
        </Grid>
      </main>
      <Footer />
    </>
  );
};

export default withRouter(LoginPage);

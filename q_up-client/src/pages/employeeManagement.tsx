import React, { useEffect, useState, ChangeEvent } from "react";
import app from "../firebase";
import Footer from "../components/Footer";
import Header from "../components/Header";
import BusinessNav from "../components/businessNav";
import {
  Typography,
  Grid,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import EmployeeListRow from "../components/employeeListRow";
import "../styles/employeeManagement.scss";
import { Redirect } from "react-router-dom";

// Mui stylings
const useStyles = makeStyles(() => ({
  button: {
    margin: "20px auto 20px auto",
  },
  textField: {
    margin: "20px auto 20px auto",
  },
}));

/**
 * Render an employee management page.
 *
 * Accessible to: Managers
 */
export default function EmployeeManagementPage() {
  // error type definition to be used in input feedback for new employee form
  interface addErrors {
    email?: string;
    password?: string;
  }

  const addErrorObj: addErrors = {};
  const classes = useStyles();
  const array: Array<any> = [];

  const [employeeList, setEmployeeList] = useState(array);
  const [selected, setSelected] = useState({ id: -1 });
  const [getData, setGetData] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    email: "",
    password: "",
    errors: addErrorObj,
  });

  // custom confirm
  const confirm = () => {
    return window.confirm("Are you sure? it cannot be undone.");
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
    },
  };

  // handle add employee cancel button click
  const handleAddCancel = () => {
    setAddDialogOpen(false);
  };

  // handle add employee button click
  const addClick = () => {
    setAddDialogOpen(true);
  };

  /**
   * sync input data with form data
   *
   * Each input is assigned a name analog to the form data it represents.
   * On change the proper property in form data is access by using the name of the event emitter.
   * @param event an event with target
   */
  const handleAddFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setAddForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handle add employee form submit
  const handleAddSubmit = () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    const packet = {
      employeeEmail: addForm.email,
      password: addForm.password,
    };

    axios
      .post("/registerEmployee", packet, axiosConfig)
      .then(() => {
        window.alert("Employee registered.");
        setGetData(true);
        setAddDialogOpen(false);
        setAddForm({
          email: "",
          password: "",
          errors: addErrorObj,
        });
      })
      .catch((err: any) => {
        console.log(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut();
          return;
        }
        window.alert("Connection error. Could not register employee.");
      });
  };

  // handle delete employee click
  const deleteClick = () => {
    const index = selected.id;
    if (index === -1) {
      window.alert("Select an employee first.");
      return;
    }
    if (!confirm()) {
      return;
    }

    const data = {
      employeeEmail: employeeList[index].email,
    };

    axios
      .put("/deleteEmployee", data, axiosConfig)
      .then(() => {
        setGetData(true);
      })
      .catch((err: any) => {
        console.log(err);
        if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut();
          return;
        }
        window.alert("Connection error");
      });
  };

  /**
   * Suply a curried function to be passed to each employee row.
   *
   * This function allows only one employee to be selected at a time
   * @param selectorID a unique number
   */
  const selectHandler = (selectorID: number) => () => {
    setSelected({ id: selectorID });
  };

  // fetch  employees data
  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);

    axios
      .get("/getEmployees", axiosConfig)
      .then((res: any) => {
        let employees = res.data.employees;
        let employeeList: Array<object> = [];

        for (const employee in employees) {
          employeeList.push(employees[employee]);
        }

        setEmployeeList(employeeList);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 404) {
          window.alert(
            "Could not find any employees, please add new employees to your business."
          );
        } else if (err.response.status === 401) {
          window.alert("You are unauthorized, please login as a manager.");
        } else if (err.response.status === 332) {
          window.alert("Please login again to continue, your token expired");
          app.auth().signOut();
          return;
        } else {
          window.alert("Connection error. Please try again.");
        }
      });
  }, [axiosConfig, getData]);

  if (JSON.parse(sessionStorage.user).type !== "manager") {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header Nav={BusinessNav} logout />
      <main>
        <header>
          <Typography variant="h2">Employees</Typography>
        </header>
        <Grid container justify="center">
          <Grid item xs={12} md={8} lg={6}>
            <section>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={addClick}
                  >
                    Add new
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={deleteClick}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </section>
          </Grid>
        </Grid>
        <section>
          <Grid container justify="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Paper className="employeePaper">
                {employeeList.map((employee: any, key: number) => {
                  return (
                    <EmployeeListRow
                      key={key}
                      selectHandler={selectHandler(key)}
                      data={employee}
                      isSelected={key === selected.id}
                    />
                  );
                })}
              </Paper>
            </Grid>
          </Grid>
        </section>
      </main>

      <Dialog
        open={addDialogOpen}
        onClose={handleAddCancel}
        PaperProps={{ style: { backgroundColor: "#242323" } }}
      >
        <DialogTitle>New employee</DialogTitle>
        <DialogContent>
          <Grid container direction="column">
            <TextField
              color="secondary"
              id="newEmployeeName"
              label="Employee email"
              name="email"
              onChange={handleAddFormChange}
              value={addForm.email}
              className={classes.textField}
              helperText={addForm.errors.email}
              error={!!addForm.errors.email}
            />
            <TextField
              type="password"
              color="secondary"
              id="newPassText"
              label="New password"
              name="password"
              onChange={handleAddFormChange}
              value={addForm.password}
              className={classes.textField}
              helperText={addForm.errors.password}
              error={!!addForm.errors.password}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleAddCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={handleAddSubmit}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}

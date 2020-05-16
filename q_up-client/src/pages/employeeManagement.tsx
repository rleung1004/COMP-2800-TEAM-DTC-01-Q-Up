import React, { useEffect, useState, ChangeEvent } from "react";
// import { Link } from 'react-router-dom';
import Footer from "../components/static/Footer";
import Header from "../components/static/Header";
import BusinessNav from "../components/businessNav";
import { Typography, Grid, Button, makeStyles, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@material-ui/core";
import axios from "axios";
import { mockEmployees } from "src/mockData";
import EmployeeListRow from "../components/employeeListRow";
import "../styles/employeeManagement.scss";


const useStyles = makeStyles(() => ({
  button: {
     margin: '20px auto 20px auto',
  },
  textField: {
    margin: "20px auto 20px auto",
  },
}));
export default function EmployeeManagementPage() {
  interface passwordErrors {
    newEmail?: string,
    newPassword?: string;
    newPasswordConfirm?: string;
  }

  interface addErrors {
    email?: string;
    password?: string;
  }

  const addErrorObj: addErrors = {};
  const passErrorObj:passwordErrors = {};
  const classes = useStyles();
  const array: Array<any> = [];
  const [employeeList, setEmployeeList] = useState(array);
  const [selected, setSelected] = useState({ id: -1 });
  const [getData, setGetData] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [passDialogOpen, setPassDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newEmail: "",
    newPassword: "",
    newPasswordConfirm: "",
    errors: passErrorObj,
  });
  const [addForm, setAddForm] = useState({
    email: "",
    password: "",
    errors: addErrorObj
  });

  const confirm = () => {
    return window.confirm("Are you sure? it cannot be undone.");
  };

  // const axiosConfig = {
  //   headers: {
  //     Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
  //   },
  // };

  const axiosConfig = {
    headers: {
      Authorization: "",
    },
  };

  const editClick = () => {
    const index = selected.id;
    if (index === -1) {
      window.alert("Select an employee first.");
      return;
    }
    setPassDialogOpen(true);
  };

  const handlePassChangeCancel = () => {
    setPassDialogOpen(false);
  };

  const handlePassFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setPasswordForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const handlePasswordSubmit = () => {
    const index = selected.id;
    if (index === -1 || index > employeeList.length) {
      window.alert("Form error. Please start again");
      setPassDialogOpen(false);
      setPasswordForm({
        newEmail: "",
        newPassword: "",
        newPasswordConfirm: "",
        errors: passErrorObj,
      });
      return;
    }
    if (!confirm()) {
      return;
    }
    const packet = {
      employeeEmail: employeeList[index].email,
      employeeNewEmail: "",
      password: passwordForm.newPassword,
      confirmPassword: passwordForm.newPasswordConfirm,
    };
    axios
      .put("/updateEmployee", packet, axiosConfig)
      .then((res) => {
        console.log(res.data);

        window.alert("Password successfully changed");
        setPassDialogOpen(false);
      })
      .catch((err: any) => {
        window.alert("Connection error");
        console.log(err);
      });
  };
  
  const handleAddCancel = () => {
    setAddDialogOpen(false);
  }
  
  const addClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value =  event.target.value;
    setAddForm((prevState:any) => ({
      ...prevState, [name]: [value]
    }));
  }

  const handleAddSubmit = () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    const packet = {
      employeeEmail: addForm.email,
      password: addForm.password
    }

    axios.post('/registerEmployee', packet, axiosConfig)
    .then(() => {
      window.alert("Employee registered.");
      setGetData(true);
    })
    .catch((err:any) => {
      console.log(err);
      window.alert("Connection error. Could not register employee.");
    });
  }

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
      email: employeeList[index].email
    }
    
    axios.put('/deleteEmployee', data, axiosConfig)
    .then(() => {
      setGetData(true);
    })
    .catch((err:any) => {
      console.log(err);
      window.alert("Connection error");
    });
  };

  const selectHandler = (selectorID: number) => () => {
    setSelected({ id: selectorID });
  };

  useEffect(() => {
    if (!getData) {
      return;
    }
    setGetData(false);
    setEmployeeList(mockEmployees());
  }, [axiosConfig, getData]);

  return (
    <>
      <Header Nav={BusinessNav} logout/>
      <header>
        <Typography variant="h2">Employees</Typography>
      </header>
      <section>
        <Grid container>
        <Grid item xs={12} sm={4}>
            <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={addClick}
            >
            Add new
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={editClick}
            >
              Change password
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
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
      <section>
        <section>
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
        </section>
      </section>
      <Dialog
        open={passDialogOpen}
        onClose={handlePassChangeCancel}
        PaperProps={{ style: { backgroundColor: "#242323" } }}
      >
        <DialogTitle>Edit employee</DialogTitle>
        <DialogContent>
          <Grid container direction="column">
            <Typography variant="caption">
              To not modify the email, leave new email empty
            </Typography>
            <TextField
              color="secondary"
              id="newEmail"
              label="New email"
              name="newEmail"
              onChange={handlePassFormChange}
              value={passwordForm.newEmail}
              className={classes.textField}
              helperText={passwordForm.errors.newEmail}
              error={passwordForm.errors.newEmail ? true : false}
            />
            <TextField
              type="password"
              color="secondary"
              id="newPassConfirm"
              label="Cornfirm password"
              name="newPasswordConfirm"
              onChange={handlePassFormChange}
              value={passwordForm.newPasswordConfirm}
              className={classes.textField}
              helperText={passwordForm.errors.newPasswordConfirm}
              error={passwordForm.errors.newPasswordConfirm ? true : false}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handlePassChangeCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={handlePasswordSubmit}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

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
            onChange={handlePassFormChange}
            value={addForm.email}
            className={classes.textField}
            helperText={addForm.errors.email}
            error={addForm.errors.email ? true : false}
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
              error={addForm.errors.password ? true : false}
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

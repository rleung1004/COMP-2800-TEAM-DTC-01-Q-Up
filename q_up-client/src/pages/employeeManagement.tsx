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
    // oldPassword?: string,
    newPassword?: string;
    newPasswordConfirm?: string;
  }

  interface addErrors {
    name?: string;
    password?: string;
    passwordConfirm?: string; 
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
    // oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
    errors: passErrorObj,
  });
  const [addForm, setAddForm] = useState({
    name: "",
    password: "",
    passwordConfirm: "",
    errors: addErrorObj
  });

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

  const handlePasswordChange = () => {
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
    if (!window.confirm("Are you sure?")) {
      return;
    }
    const packet = {
      // oldPassword: passwordForm.oldPassword,
      password: passwordForm.newPassword,
      confirmPassword: passwordForm.newPasswordConfirm,
    };
    axios
      .put("/changePassword", packet, axiosConfig)
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

  const HandleAddSubmit = () => {

  }

  const confirm = () => {
    return window.confirm("Are you sure? it cannot be undone.");
  };

  const deleteClick = () => {
    if (!confirm()) {
      return;
    }
    axios.delete('/deleteEmployee')
    .then(() => {
      setGetData(true);
    })
    .catch(err => {
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
  }, [axiosConfig]);

  return (
    <>
      <Header Nav={BusinessNav} />
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
            onClick={handlePasswordChange}
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
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container direction="column">
            {/* <TextField
          type="password"
            color="secondary"
            id="oldPassText"
            label="Old password"
            name="oldPassword"
            onChange={handlePassFormChange}
            value={passwordForm.oldPassword}
            className={classes.textField}
            helperText={passwordForm.errors.oldPassword}
            error={passwordForm.errors.oldPassword ? true : false}
          /> */}
            <TextField
              type="password"
              color="secondary"
              id="newPassText"
              label="New password"
              name="newPassword"
              onChange={handlePassFormChange}
              value={passwordForm.newPassword}
              className={classes.textField}
              helperText={passwordForm.errors.newPassword}
              error={passwordForm.errors.newPassword ? true : false}
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
            label="Employee name"
            name="name"
            onChange={handlePassFormChange}
            value={addForm.name}
            className={classes.textField}
            helperText={addForm.errors.name}
            error={addForm.errors.name ? true : false}
          />
            <TextField
              type="password"
              color="secondary"
              id="newPassText"
              label="New password"
              name="newPassword"
              onChange={handleAddFormChange}
              value={addForm.password}
              className={classes.textField}
              helperText={addForm.errors.password}
              error={addForm.errors.password ? true : false}
            />
            <TextField
              type="password"
              color="secondary"
              id="passwordConfirm"
              label="confirm password"
              name="passwordConfirm"
              onChange={handleAddFormChange}
              value={addForm.passwordConfirm}
              className={classes.textField}
              helperText={addForm.errors.passwordConfirm}
              error={addForm.errors.passwordConfirm ? true : false}
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
            onClick={HandleAddSubmit}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}

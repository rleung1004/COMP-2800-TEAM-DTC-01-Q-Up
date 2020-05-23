import React, { useState, ChangeEvent } from "react";
import { TextField, Button, Box } from "@material-ui/core";
import axios from 'axios';
import app from "../firebase";

enum boothStates{
   loading,
   closed,
   accepting,
   serving
}

export default function BoothEnterName(props: any) {
   const axiosConfig = {
      headers: {
         Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
   };
   const [name, setName] = useState("");
   const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
   };

   // handle enter queue button click, to be passed to child BoothEnterName
   const onEnterQueue = (state: any) => {
      const packet = {
       userName : name.charAt(0).toUpperCase() + name.substr(1).toLowerCase(),
      };
      axios
         .put('/boothEnterQueue', packet, axiosConfig)
         .then((res) => {
            const data = res.data.BoothSlotInfo;
            props.setBoothInfo((prevState:any) => ({
               ...prevState,
               state: boothStates.serving,
               name: data.customer,
               ticketNumber: data.ticketNumber,
               password: data.password,
            }));
         })
         .catch((err) => {
            console.error(err);
             if (err.response.status && err.response.status === 332) {
                 window.alert("Please login again to continue, your token expired");
                 app.auth().signOut().catch(console.error);
                 return;
             }
            window.alert(err.response.data.general);
         });
         props.setBoothInfo((prevState:any) => ({ ...prevState, standBy: !state.standBy }));
   };
  return (
    <>
      <section className="boothInfoSectionContent">
        <Box pt={20}>
          <TextField
            color="secondary"
            id="name"
            label="Enter Your name"
            name="name"
            value={name}
            onChange={onNameChange}
          />
        </Box>
        <br />
        <Box pb={20}>
          <Button
            color="primary"
            variant="contained"
            onClick={onEnterQueue}
          >
            Queue Up
          </Button>
        </Box>
      </section>
    </>
  );
}

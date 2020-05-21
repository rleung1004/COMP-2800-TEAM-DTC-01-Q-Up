import React, { useEffect, useState } from "react";
import app from "./firebase";

export const AuthContext = React.createContext<firebase.User | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unlisten = app.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => {
      unlisten();
    };
  }, []);
  
  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};

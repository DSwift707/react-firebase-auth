import React, { useContext } from "react";
import app from "./base";
import { AuthContext } from "./Auth";

const Home = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <>
      <h1>Home</h1>
      <button onClick={() => app.auth().signOut()}>Sign out of {currentUser.email}</button>
    </>
  );
};

export default Home;

import React, { useContext } from "react";
import app from "./base";
import { AuthContext } from "./Auth";
import PinTree from "./components/PinTree";
import SimpleMap from "./components/GoogleMap";

const Home = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <>
      <h1>Home</h1>
      <button onClick={() => app.auth().signOut()}>Sign out of {currentUser.email}</button>
      <SimpleMap />
    </>
  );
};

export default Home;

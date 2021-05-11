import React, { useContext } from "react";
import app from "./base";
import { AuthContext } from "./Auth";
import SimpleMap from "./components/GoogleMap";
import { Button } from "@material-ui/core";

const Home = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <>
      <div className="main-header">
        <h1 className="main-title">Forestree.io</h1>
        <Button color="default" variant="contained" className="logout-button" onClick={() => app.auth().signOut()}>Log Out</Button>
      </div>
      <SimpleMap />
    </>
  );
};

export default Home;

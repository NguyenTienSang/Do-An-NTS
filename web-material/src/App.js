import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import Page from './components/mainpages/Pages'
// import Auth_Page from './components/auth_page/Auth_Pages'
import { GlobalState } from "./GlobalState";
import Header from "./components/header/Header";
import NavBar from "./components/navbar/NavBar";




function App() {
  // const [isLogged] = state.userAPI.isLogged;
  // const [isAdmin] = state.userAPI.isAdmin;
  return (
    <DataProvider>
      <Router>
          <div className="App">
                  <Page/>
          </div>
      </Router>
    </DataProvider>
        //  <Route exact path='/login' component={Login}/>
  );
}

export default App;

import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";

// import CreateProduct from "./createProduct/CreateProduct";
import { GlobalState } from "../../GlobalState";
import Login from "../mainpages/auth/Login";


function Pages() {
    // const state = useContext(GlobalState);
    // console.log(state);
    
    // const [isAdmin] = state.userAPI.isAdmin;
    return (
        <Switch>
            <Route path="/login" exact component={Login } />
        </Switch>

    )
}

export default Pages;
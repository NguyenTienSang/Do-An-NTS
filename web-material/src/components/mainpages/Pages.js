import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";

// import CreateProduct from "./createProduct/CreateProduct";
import { GlobalState } from "../../GlobalState";
import HomePage from "./homepage/HomePage";
import Employees from "./nhanvien/Employees";
import AddEmployee from "./nhanvien/AddEmployee";

import Materials from "./vattu/Materials";
// import AddMaterial from "./vattu/AddMaterial";
import AddMaterial from "./vattu/AddMaterial";

import Stores from "./daily/Stores";
import WareHouses from "./kho/WareHouse";
import PhieuNhapXuat from "./phieu/PhieuNhapXuat";
import ThongKe from "./thongke/ThongKe";
import Login from "./auth/Login";
import NotFound from "./utils/not_found/NotFound";

import Header from "../header/Header";
import NavBar from "../navbar/NavBar";

function Pages() {
    const state = useContext(GlobalState);
    console.log(state);
    const [isLogged] = state.userAPI.isLogged;
    const [isAdmin] = state.userAPI.isAdmin;
    return (
        <Switch>
            <Route path="/" exact component={isLogged ?  HomePage : Login } />
              
            <Route path="/nhanvien" exact component={isAdmin ?  Employees : NotFound}/>
            <Route path="/add_employee" exact component={AddEmployee}/>
            <Route path="/add_material" exact component={AddMaterial} />
            <Route path="/vattu" exact component={Materials} />
            <Route path="/daily" exact component={isAdmin ?  Stores : NotFound} />
            <Route path="/kho" exact component={isAdmin ?  WareHouses : NotFound} />
            <Route path="/phieunhapxuat" exact component={PhieuNhapXuat} />
            <Route path="/login" exact component={isLogged ?  HomePage : Login} />  
            <Route path="/thongke" exact component={isAdmin ?  ThongKe : NotFound}/>
            
            <Route path="*" exact component={NotFound} />
           
        </Switch>

    )
}

export default Pages;
import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";

// import CreateProduct from "./createProduct/CreateProduct";
import { GlobalState } from "../../GlobalState";
import HomePage from "./homepage/HomePage";
import Employees from "./nhanvien/Employees";
// import AddEmployee from "./nhanvien/AddEmployee";

import ChangePassword from "./auth/ChangePassword";

import Materials from "./vattu/Materials";
// import AddMaterial from "./vattu/AddMaterial";
import AddMaterial from "./vattu/AddMaterial";
import DetailEmployee from "./nhanvien/DetailEmployee";

import Stores from "./daily/Stores";
import WareHouses from "./kho/WareHouse";

import ImportBill from "./phieu/phieunhap/ImportBill";
import CreateImportBill from "./phieu/phieunhap/CreateImportBill";
import DetailImportBill from "./phieu/phieunhap/DetailImportBill";

import DetailWareHouse from "./kho/DetailWareHouse";

import ExportBill from "./phieu/phieuxuat/ExportBill";
import CreateExportBill from "./phieu/phieuxuat/CreateExportBill";

import Statistic from "./thongke/Statistic";
import StatisticMaterial from "./thongke/StatisticMaterial";
import StatisticMaterialDetail from "./thongke/StatisticMaterialDetail";
import StatisticBill from "./thongke/StatisticBill";
import StatisticTurnOver from "./thongke/StatisticTurnOver";
import StatisticProfitYear from "./thongke/StatisticProfitYear";
import StatisticProfitStage from "./thongke/StatisticProfitStage";

import Login from "./auth/Login";
import NotFound from "./utils/not_found/NotFound";

function Pages() {
  const state = useContext(GlobalState);
  console.log(state);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  return (
    <Switch>
      <Route path="/trangchu" exact component={isLogged ? HomePage : Login} />
      <Route path="/" exact component={isLogged ? HomePage : Login} />

      <Route path="/nhanvien" exact component={Employees} />
      <Route path="/doimatkhau" exact component={ChangePassword} />

      {/* <Route path="/add_employee" exact component={AddEmployee}/> */}
      <Route path="/detail_employee/:_id" exact component={DetailEmployee} />
      <Route path="/add_material" exact component={AddMaterial} />
      <Route path="/vattu" exact component={Materials} />
      <Route path="/daily" exact component={isAdmin ? Stores : NotFound} />
      <Route path="/kho" exact component={WareHouses} />
      <Route path="/phieunhap" exact component={ImportBill} />
      <Route path="/ctphieunhap" exact component={DetailImportBill} />
      <Route path="/lapphieunhap" exact component={CreateImportBill} />

      <Route path="/phieuxuat" exact component={ExportBill} />
      <Route path="/lapphieuxuat" exact component={CreateExportBill} />
      <Route
        path="/chitietkho/:madaily/:makho"
        exact
        component={DetailWareHouse}
      />

      <Route path="/login" exact component={isLogged ? HomePage : Login} />
      <Route path="/thongke" exact component={isAdmin ? Statistic : NotFound} />
      <Route
        path="/thongkevattu"
        exact
        component={isAdmin ? StatisticMaterial : NotFound}
      />

      <Route
        path="/thongkevattutrongcackho/:_id"
        exact
        component={StatisticMaterialDetail}
      />

      <Route
        path="/thongkephieunhanvien"
        exact
        component={isAdmin ? StatisticBill : NotFound}
      />

      {/* StatisticTurnOver */}

      <Route
        path="/thongkedoanhthu"
        exact
        component={isAdmin ? StatisticTurnOver : NotFound}
      />

      <Route
        path="/thongkeloinhuannam"
        exact
        component={isAdmin ? StatisticProfitYear : NotFound}
      />

      <Route
        path="/thongkeloinhuangiaidoan"
        exact
        component={isAdmin ? StatisticProfitStage : NotFound}
      />

      <Route path="*" exact component={NotFound} />
    </Switch>
  );
}

export default Pages;

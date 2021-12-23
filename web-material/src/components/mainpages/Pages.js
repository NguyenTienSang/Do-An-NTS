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
import DetailWareHouse from "./kho/DetailWareHouse";

import ImportBill from "./phieu/phieunhap/ImportBill";
import CreateImportBill from "./phieu/phieunhap/CreateImportBill";
import DetailImportBill from "./phieu/phieunhap/DetailImportBill";

import PrintToImportBill from "./phieu/phieunhap/PrintToImportBill";

import ExportBill from "./phieu/phieuxuat/ExportBill";
import CreateExportBill from "./phieu/phieuxuat/CreateExportBill";
import PrintToExportBill from "./phieu/phieuxuat/PrintToExportBill";

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

  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  return (
    <Switch>
      <Route path="/trangchu" exact component={isAdmin ? HomePage : Login} />
      <Route path="/" exact component={isAdmin ? HomePage : Login} />

      <Route
        path="/nhanvien"
        exact
        component={isLogged ? Employees : NotFound}
      />
      <Route
        path="/doimatkhau"
        exact
        component={isLogged ? ChangePassword : Login}
      />

      {/* <Route path="/add_employee" exact component={AddEmployee}/> */}
      <Route
        path="/detail_employee/:_id"
        exact
        component={isAdmin ? DetailEmployee : NotFound}
      />
      <Route
        path="/add_material"
        exact
        component={isAdmin ? AddMaterial : NotFound}
      />
      <Route path="/vattu" exact component={isLogged ? Materials : NotFound} />
      <Route path="/daily" exact component={isAdmin ? Stores : NotFound} />
      <Route path="/kho" exact component={isLogged ? WareHouses : NotFound} />
      <Route
        path="/phieunhap"
        exact
        component={isLogged ? ImportBill : NotFound}
      />
      <Route path="/ctphieunhap" exact component={DetailImportBill} />
      <Route
        path="/lapphieunhap"
        exact
        component={isLogged ? CreateImportBill : NotFound}
      />

      <Route
        path="/inphieunhap/:_id"
        exact
        component={isLogged ? PrintToImportBill : NotFound}
      />

      <Route
        path="/inphieuxuat/:_id"
        exact
        component={isLogged ? PrintToExportBill : NotFound}
      />

      <Route
        path="/phieuxuat"
        exact
        component={isLogged ? ExportBill : NotFound}
      />
      <Route
        path="/lapphieuxuat"
        exact
        component={isLogged ? CreateExportBill : NotFound}
      />
      <Route
        path="/chitietkho/:madaily/:makho"
        exact
        component={isLogged ? DetailWareHouse : NotFound}
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
        component={isLogged ? StatisticMaterialDetail : NotFound}
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

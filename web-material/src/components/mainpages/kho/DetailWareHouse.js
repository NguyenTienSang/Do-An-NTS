import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import WareHouseItem from "./WareHouseItem";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";

function DetailWareHouse() {
  const state = useContext(GlobalState);
  const [warehouses] = state.warehouseAPI.warehouses;
  if (warehouses.length !== 0)
  {
    console.log('warehouses :',warehouses);
  }
  return (
    <div className="layout">
    <div className="layout-first"><NavBar/></div>
    <div className="layout-second">
      <Header/>
            Chi tiết kho
      </div>
    </div>
  )
}

export default DetailWareHouse;
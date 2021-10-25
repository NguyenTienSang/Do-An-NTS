import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";

function ThongKe() {
  return (
    <div className="layout">
             <div className="layout-first"><NavBar/></div>
             <div className="layout-second">
               <Header/>
               <h1>Thống Kê</h1>
             </div>
   </div>
  )
}

export default ThongKe;
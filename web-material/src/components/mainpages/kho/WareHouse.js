import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import WareHouseItem from "./WareHouseItem";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";

function WareHouses() {
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
        <div className="warehouses">
            <div className="header_list">
              <p style={{flex:0.5}}>STT</p>
              <p>Tên kho</p>
              <p>Hình ảnh</p>
              <p>Đại lý</p>
              <p>Địa chỉ</p>
              <p>SĐT</p>
              <p style={{flex:0.6}}>Cập nhật</p>
              <p style={{flex:0.6}}>Xóa</p>
              <p style={{flex:0.6}}>Xem kho</p>
            </div>
            {warehouses.map((warehouse,index) => {
                return( 
                  <WareHouseItem
                    key={warehouse._id}
                    warehouse={warehouse}
                    stt={index}
                  />
                )
            })}
        </div>


      </div>
    </div>
  )
}

export default WareHouses;
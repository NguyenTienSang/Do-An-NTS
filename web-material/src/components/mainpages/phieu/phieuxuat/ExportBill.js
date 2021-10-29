import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../../GlobalState";
import ExportBillItem from "./ExportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";

function ExporttBill() {
  const state = useContext(GlobalState);
  const [importbills] = state.exportbillAPI.exportbills;
  if (importbills.length !== 0)
  {
    console.log('importbills :',importbills);
  }
  return (
    <div className="layout">
    <div className="layout-first"><NavBar/></div>
    <div className="layout-second">
      <Header/>
        <div className="importbills">
            <div className="header_list">
              <p style={{flex:0.5}}>STT</p>
              <p>Tên phiếu</p>
              <p>Ngày lập</p>
              <p>Nhân viên</p>
              <p>Đại lý</p>
              <p style={{flex:0.6}}>Chi tiết</p>
            </div>
            {importbills.map((importbill,index) => {
              {
                console.log('phiếu nhập1 : ',importbill);
              }
                return( 
                  <ExportBillItem
                    key={importbill._id}
                    importbill={importbill}
                    stt={index}
                  />
                )
            })}
        </div>


      </div>
    </div>
  )
}

export default ExporttBill;
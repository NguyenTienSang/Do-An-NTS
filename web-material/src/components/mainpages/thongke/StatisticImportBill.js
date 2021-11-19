import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { GlobalState } from "../../../GlobalState";
import ImportBillItem from "../phieu/phieunhap/ImportBillItem";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header"
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';

function StatisticImportBill() {
  const state = useContext(GlobalState);
  const [importbills] = state.importbillAPI.importbills;
  if (importbills.length !== 0)
  {
    console.log('importbills.length !== 0 :',importbills);
  }
  return (
    <div className="layout">
    <div className="layout-first"><NavBar/></div>
    <div className="layout-second">
      <Header/>
        <div className="importbills">
        <div className="header-title">
              <div className="title-tab">
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Danh Sách Phiếu Nhập</h2>
              </div>
              

            </div>
            <div className="header_list">
              <p style={{flex:0.5}}>STT</p>
              <p>Tên phiếu</p>
              <p>Ngày lập</p>
              <p>Nhân viên</p>
              <p>Đại lý</p>
              <p>Kho</p>
              <p>Tổng Tiền</p>
              <p style={{flex:0.6}}>Chi tiết</p>
            </div>
            {importbills.map((importbill,index) => {
              {
                console.log('phiếu nhập1 : ',importbill);
              }
                return(
                  <>
                  <ImportBillItem
                    key={importbill._id}
                    importbill={importbill}
                    stt={index}
                  />
                  </> 
                )
            })}
        </div>


      </div>
    </div>
  )
}

export default StatisticImportBill;
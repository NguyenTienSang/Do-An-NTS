import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { GlobalState } from "../../../../GlobalState";
import ExportBillItem from "./ExportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';


function ExporttBill() {
  const state = useContext(GlobalState);
  const [exportbills] = state.exportbillAPI.exportbills;

 

  if (exportbills.length !== 0)
  {
    console.log('exportbills :',exportbills);
  }
  return (
    <div className="layout">
    <div className="layout-first"><NavBar/></div>
    <div className="layout-second">
      <Header/>
        <div className="exportbills">
        <div className="header-title">
              <div className="title-tab">
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Danh Sách Phiếu Nhập</h2>
              </div>
              
              <button className='add-item'><Link to={'/lapphieuxuat'} style={{color:'#fff'}}> <BiBookAdd  style={{marginRight:'5px',marginTop:'5px'}}/>Lập Phiếu Xuất</Link></button>
           
              
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
            {exportbills.map((exportbill,index) => {
              {
                console.log('phiếu nhập1 : ',exportbill);
              }
                return( 
                    <>
                  <ExportBillItem
                    key={exportbill._id}
                    exportbill={exportbill}
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

export default ExporttBill;
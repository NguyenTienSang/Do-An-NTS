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
  const [searchTerm,setSearchTerm] = useState("");
  const [exportbills] = state.exportbillAPI.exportbills;

 

  if (exportbills.length !== 0)
  {
    console.log('exportbills :',exportbills);
  }
  return (
    <div className="layout">
    <div className="layout-first"><Header/></div>
    <div className="layout-second">
    <NavBar/>
        <div className="exportbills">
        <div className="header-title">
        <div className="row search-exportbill">
          {/* <label>Tìm nhân viên</label> */}
                <input
                  type="text"
                  name="id"
                  placeholder="Nhập ID phiếu xuất"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  onChange={(event)=> {
                    setSearchTerm(event.target.value);
                    // document.getElementById("list-material").style.display = "block";
                  }}
                />
        </div>
              <div className="title-tab">
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Danh Sách Phiếu Xuất</h2>
              </div>
              
              <button className='add-item'><Link to={'/lapphieuxuat'} style={{color:'#fff'}}> <BiBookAdd  style={{marginRight:'5px',marginTop:'5px'}}/>Lập Phiếu Xuất</Link></button>
           
            </div>
            <div className="header_list">
            <p style={{width:"70px"}}>STT</p>
            <p style={{width:"160px"}}>ID</p>
              <p style={{flex:1}}>Ngày lập</p>
              <p style={{flex:1}}>Nhân viên</p>
              <p style={{flex:1}}>Đại lý</p>
              <p style={{flex:1}}>Kho</p>
              <p style={{flex:1}}>Tổng Tiền</p>
              <p style={{flex:1}}>Chi tiết</p>
            </div>
            {exportbills.filter(exportbill=>{
              if(searchTerm === "") 
              {
                  return exportbill;
              }
              else if(exportbill._id.toLowerCase().includes(searchTerm.toLowerCase()))
              {
                  return exportbill;
              }
          }).map((exportbill,index) => {
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
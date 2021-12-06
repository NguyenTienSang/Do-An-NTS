import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { GlobalState } from "../../../../GlobalState";
import ImportBillItem from "./ImportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';

function ImportBill() {
  const state = useContext(GlobalState);
  const [searchTerm,setSearchTerm] = useState("");

  const [importbills] = state.importbillAPI.importbills;
  if (importbills.length !== 0)
  {
    console.log('importbills.length !== 0 :',importbills);
  }

 

  return (
    <div className="layout">
    <div className="layout-first"><Header/></div>
    <div className="layout-second">
    <NavBar/>
        <div className="importbills">
        <div className="header-title">
        <div className="row search-importbill">
          {/* <label>Tìm nhân viên</label> */}
                <input
                  type="text"
                  name="id"
                  placeholder="Nhập từ khóa tìm kiếm"
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
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Danh Sách Phiếu Nhập</h2>
              </div>
              
              <button className='add-item'><Link to={'/lapphieunhap'} style={{color:'#fff'}}> <BiBookAdd  style={{marginRight:'5px',marginTop:'5px'}}/>Lập Phiếu Nhập</Link></button>
           
              
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
            {importbills.filter(importbill=>{
              if(searchTerm === "") 
              {
                  return importbill;
              }
              else if(
                importbill._id.toLowerCase().includes(searchTerm.toLowerCase())
                || importbill.manv.hoten.toLowerCase().includes(searchTerm.toLowerCase())
                || importbill.manv.madaily.tendl.toLowerCase().includes(searchTerm.toLowerCase())
                || importbill.makho.tenkho.toLowerCase().includes(searchTerm.toLowerCase())

                )
              {
                  return importbill;
              }
          }).map((importbill,index) => {
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

export default ImportBill;
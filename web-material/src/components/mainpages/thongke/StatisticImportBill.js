import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { GlobalState } from "../../../GlobalState";
import ImportBillItem from "../phieu/phieunhap/ImportBillItem";
import ExportBillItem from "../phieu/phieuxuat/ExportBillItem";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header"
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';
import moment from 'moment'
import DatePicker from "react-datepicker";
// import { Button } from 'react-bootstrap';
import {IoMdArrowDropdown} from 'react-icons/io';
import {AiOutlineFileSearch} from 'react-icons/ai';


import "react-datepicker/dist/react-datepicker.css";


function StatisticImportBill() {
  const state = useContext(GlobalState);
  const [importbills] = state.importbillAPI.importbills;
  const [searchTerm,setSearchTerm] = useState("");
  const [manv,setMaNV] = useState("");
  const [optionbill,setOptionBill] = useState("PhieuNhap");
  const [billsfilter,setBillsFilter] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openalert,setOpenAlert] = useState(false);
  const [message,setMessage] = useState("");

  const filterbill = async () => {
    
    if(manv === "")
    {
      // alert('Vui lòng nhập mã nhân viên')
      setMessage("Vui lòng nhập mã nhân viên")
      setOpenAlert(true);
    }
    else if(startDate.getTime() > endDate.getTime())
    {
      // alert('Thời gian không hợp lệ')
      setMessage("Thời gian không hợp lệ")
      setOpenAlert(true);
    }
    else {
      const startDateFilter =  moment(startDate).format('YYYY-MM-DD');
      const endDateFilter =  moment(endDate).format('YYYY-MM-DD');
      const res = await axios.post('/api/thongke/phieunhapnhanvien',
          { manv,startDateFilter,endDateFilter,optionbill}
    );
          setBillsFilter(res.data);
    }
  }

  return (
    <>
    <div className="layout">
    <div className="layout-first"><Header/></div>
    <div className="layout-second">
    <NavBar/>
        <div className="statistic_importbills">
      
      <div className="filter-container">
      <div className="row search-importbills">
          <label>Mã NV </label>
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập mã nhân viên"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  onChange={(event)=> {
                    setMaNV(event.target.value)
                    // setSearchTerm(event.target.value);
                    // document.getElementById("list-material").style.display = "block";
                  }}
                />
        </div>

      <div className="filter-date">
      <div className="filter-date-component">
        <label>Từ:</label>
        <DatePicker
          className="datepicker"
          selected={startDate}
          dateFormat="dd-MM-yyyy"
          onChangeRaw={(e) => e.preventDefault()}
          minDate={new Date("01-01-2010")}
          maxDate={new Date()}
          inputs
          onChange={(date) => {
          setStartDate(date)
          }
          }
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        </div>
    <div className="filter-date-component">
    <label>Đến:</label>
    <DatePicker
          className="datepicker"
          selected={endDate}
          dateFormat="dd-MM-yyyy"
          onChangeRaw={(e) => e.preventDefault()}
          minDate={new Date("01-01-2010")}
          maxDate={new Date()}
          onChange={(date) => {
            setEndDate(date)
          }
          }
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />  
      </div>
      </div>

      <select
             className="select_bill"
            // value={optionbill}
            defaultValue={"PhieuNhap"}
            onChange={(event)=> {
              setOptionBill(event.target.value)
            }}
          >
          
           
            <option value="PhieuNhap" selected>Phiếu Nhập</option>
            <option value="PhieuXuat">Phiếu Xuất</option>
          </select>

        <button onClick={filterbill} className="statistic-button" > <AiOutlineFileSearch/></button>

      
      </div>


        <div className="header-title">
        <div className="row search-importbills">
                <input
                  type="text"
                  name="tenpn"
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
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Danh Sách Phiếu {optionbill === "PhieuNhap" ? "Nhập" : "Xuất"}</h2>
              </div>
              

            </div>
            <div className="header_list">
              <p style={{flex:0.5}}>STT</p>
              <p>ID</p>
              <p>Ngày lập</p>
              <p>Nhân viên</p>
              <p>Đại lý</p>
              <p>Kho</p>
              <p>Tổng Tiền</p>
              <p style={{flex:0.6}}>Chi tiết</p>
            </div>
        
            {
              optionbill === 'PhieuNhap' ? 
                (    billsfilter?.filter(importbill=>{
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
                  
                    return(
                      <>
                      <ImportBillItem
                        key={importbill._id}
                        importbill={importbill}
                        stt={index}
                      />
                      </> 
                    )
                }))
                : 
                (    billsfilter?.filter(exportbill=>{
                  if(searchTerm === "") 
                  {
                      return exportbill;
                  }
                  else if(exportbill.tenpx.toLowerCase().includes(searchTerm.toLowerCase()))
                  {
                      return exportbill;
                  }
              }).map((exportbill,index) => {
                  
                    return(
                      <>
                      <ExportBillItem
                        key={exportbill._id}
                        exportbill={exportbill}
                        stt={index}
                      />
                      </> 
                    )
                }))
            }


        
        </div>


      </div>
    </div>

           

      {
      openalert ?  
      <div className="modal_container__notification modal_active" id="modal_container__notification">
      <div className="modal__notification">
        <p className="title-notification">Thông báo</p>
        <p>{message}</p>
        <div className="option-button">
            <button id="add" onClick={() =>{
              //  document.getElementById("modal_container__notification").classList.remove("modal_active");
               setOpenAlert(false);
            }} >OK</button>
            {/* <button id="close"  >Hủy</button> */}
        </div>
      </div>
      </div>
      : <></>
    }

    </>
  )
}

export default StatisticImportBill;
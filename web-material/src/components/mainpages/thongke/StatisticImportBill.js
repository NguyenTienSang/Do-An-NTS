import axios from "axios";
import React, { useContext, useState } from "react";
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
  const [optionbill,setOptionBill] = useState("TatCa");
  const [billsfilter,setBillsFilter] = useState(importbills);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
 


  const filterbill = async () => {

    if(startDate.getTime() > endDate.getTime())
    {
      alert('Thời gian không hợp lệ')
    }
    else {
      const startDateFilter =  moment(startDate).format('YYYY-MM-DD');
      const endDateFilter =  moment(endDate).format('YYYY-MM-DD');
      console.log('testdate1 : ',startDateFilter)
      const res = await axios.post('/api/thongke/phieunhapnhanvien',
          { manv,startDateFilter,endDateFilter,optionbill}
    );
          setBillsFilter(res.data);
          console.log('res.data : ',res.data)
    }
  }

  return (
    <div className="layout">
    <div className="layout-first"><NavBar/></div>
    <div className="layout-second">
      <Header/>
        <div className="importbills">
      
      <div className="filter-container">
      <div className="search-importbills">
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
            // value={optionbill}
            defaultValue={"TatCa"}
            onChange={(event)=> {
              setOptionBill(event.target.value)
            }}
          >
          
            <option value="TatCa" selected>Tất cả</option>
            <option value="PhieuNhap">Phiếu Nhập</option>
            <option value="PhieuXuat">Phiếu Xuất</option>
          </select>

        <button onClick={filterbill} className="statistic-button" > <AiOutlineFileSearch/></button>

      
      </div>


        <div className="header-title">
        <div className="row search-importbills">
          <label>Tên Phiếu</label>
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập tên phiếu"
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
        
            {
              optionbill === 'PhieuNhap' ? 
                (    billsfilter.filter(importbill=>{
                  if(searchTerm === "") 
                  {
                      return importbill;
                  }
                  else if(importbill.tenpn.toLowerCase().includes(searchTerm.toLowerCase()))
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
                : (
                  optionbill === 'PhieuXuat' ? (
                    billsfilter.filter(exportbill=>{
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
                    })
                  ) : (
                    billsfilter.filter(importbill=>{
                      if(searchTerm === "") 
                      {
                          return importbill;
                      }
                      else if(importbill.tenpn.toLowerCase().includes(searchTerm.toLowerCase()))
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
                    })
                  )
                )
            }


        
        </div>


      </div>
    </div>
  )
}

export default StatisticImportBill;
import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

import NavBar from '../../navbar/NavBar';
import Header from '../../header/Header';

function DetailEmployee() {
    const params = useParams();
    const state = useContext(GlobalState);
    const [employees] = state.employeeAPI.employees;
    const [detailEmployee, setDetailEmployee] = useState([]);
  
    useEffect(() => {
      console.log("re render");
      if (params._id) {
        employees.forEach((employee) => {
          if (employee._id === params._id) setDetailEmployee(employee);
        });
      }
    }, [params._id, employees]);

    if (detailEmployee.length === 0) return null;
    console.log('Thông tin chi tiết nhân viên',detailEmployee);
    return (
        <>
            <div>
                <div className="layout">
                    <div className="layout-first"><Header/></div>
                    <div className="layout-second">
                    <NavBar/>
                        <div className="infor-detail">
                            <img src={detailEmployee.images.url} alt="" /> 
                            <p style={{display:'flex',justifyContent:"center",fontSize:"25px"}}>{detailEmployee.hoten}</p>
                            {/* <div className="row"> 
                              
                            </div> */}
                            <div className="row">
                                <p>ID: {detailEmployee._id}</p>
                                <p>Đại lý: {detailEmployee.madaily.tendl}</p>
                            </div>

                            <div className="row" >
                            <p>Quyền: {detailEmployee.role}</p>
                            <p>SĐT: {detailEmployee.sodienthoai}</p>
                            </div>

                            <div className="row" >
                            <p>Địa chỉ: {detailEmployee.diachi}</p>
                            <p>CMND: {detailEmployee.cmnd}</p>
                            </div>
                        
                            <div className="row" >
                            <p>Tình trạng: {detailEmployee.tinhtrang}</p>
                            </div>
                            
                         
                          
                        </div>
                      
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailEmployee;

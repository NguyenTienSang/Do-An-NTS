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
                        <p>Họ tên: {detailEmployee.hoten}</p>
                        <p>Đại lý: {detailEmployee.madaily.tendl}</p>
                      
                        <img src={detailEmployee.images.url} alt="" /> 
                        <p>Quyền: {detailEmployee.role}</p>
                        <p>SĐT: {detailEmployee.sodienthoai}</p>
                        <p>Địa chỉ: {detailEmployee.diachi}</p>
                        <p>Tình trạng: {detailEmployee.tinhtrang}</p>
                        </div>
                      
                        <div className="button-function" style={{display:"flex",flexDirection:"column"}}>
                            <button>Xóa</button>
                            <button>Cập nhật</button>
                            <button>Thống kê hóa đơn</button>
                            <button>Năng suất công việc</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailEmployee;

import axios from "axios";
import React, { useContext, useState, useEffect  } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { GlobalState } from "../../../../GlobalState";
import {DatePickerComponent} from "@syncfusion/ej2-react-calendars"
import ImportBillItem from "./ImportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';

const initialImportBill = {
  tenpn:"",
  ngay:"",
  manv:"",
  makho:"",
};


function CreateImportBill() {
  const state = useContext(GlobalState);
  // const [importbills] = state.importbillAPI.addImportBill;
  const [importbill, setImportBill] = useState(initialImportBill);
  const [warehouses] = state.warehouseAPI.warehouses;
  // const [inforuser] = state.userAPI.inforuser;
  const [newwarehouses,setNewWareHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const iduser =  (JSON.parse(localStorage.getItem('inforuser'))).madaily._id;
  const test =  warehouses.filter((warehouse,index) => (iduser === warehouse.madaily._id) ? warehouse : undefined)
  
  // {
  //   // console.log('newwarehouses : ',typeof(newwarehouses));//Này là object
  //       if(iduser === warehouse.madaily._id)
  //       {
  //         // console.log('Kho '+(index+1),typeof(warehouse));//Này là object
  //         setNewWareHouses([...newwarehouses,warehouse]);
  //       }
  // })


  const param = useParams();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setImportBill({ ...importbill, [name]: value });
  };

  console.log('test : ',typeof(test));
  
  // const filterwarehouses = () => {
  //   const iduser =  (JSON.parse(localStorage.getItem('inforuser'))).madaily._id;
  //   console.log('thông tin đại lý : ', (JSON.parse(localStorage.getItem('inforuser'))).madaily._id);
  //   warehouses.map((warehouse,index) => {
  //     // console.log('newwarehouses : ',typeof(newwarehouses));//Này là object
  //         if(iduser === warehouse.madaily._id)
  //         {
  //           // console.log('Kho '+(index+1),typeof(warehouse));//Này là object
  //           setNewWareHouses({...newwarehouses,warehouse});
  //         }
  //   })
  // }

  

 
  return (
    <div className="layout">
    <div className="layout-first"><NavBar/></div> 
    <div className="layout-second">
      <Header/>
      <div className="create-importbill">
      <p>Nhập Thông Tin Phiếu Nhập</p>
      <DatePickerComponent placeholder="Nhập ngày lập phiếu"></DatePickerComponent>
     
    
      {/* <div className="row">
          <label htmlFor="stores">Kho</label>
          <select
            name="madaily"
            value={importbill.makho}
            onChangimport UserAPI from './../../../../api/UserAPI';
e={handleChangeInput}
          >
            <option value="" disabled selected hidden>Vui lòng chọn kho</option>
            {newwarehouses.map((warehouse) => (
              <option value={warehouse._id}>
                {newwarehouses.tenkho}
              </option>
            ))}
          </select>
        </div> */}

      </div>
      </div>
    </div>
  )
}

export default CreateImportBill;
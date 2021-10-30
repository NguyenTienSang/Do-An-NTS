import axios from "axios";
import React, { useContext, useState, useEffect  } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { GlobalState } from "../../../../GlobalState";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const AddToImportBill = (data) => {
  const itemimportbill = {
    material: data,
    quantity:  1
  }
 
  try {
    const dataimportbill = localStorage.getItem('importbill');

 
      if (dataimportbill !== null) {
        let check = 0;
        const importbill = JSON.parse(dataimportbill)
        importbill.map(item => {
          if(item.material._id == itemimportbill.material._id)
          {
            item.quantity++;
            check = 1;
          }
        })
        if(check == 0)
        {
          importbill.push(itemimportbill);
        }
        localStorage.setItem('importbill',JSON.stringify(importbill));
      }
      else{
        const importbill  = []
        importbill.push(itemimportbill);
        localStorage.setItem('importbill',JSON.stringify(importbill));
      }
  } catch (error) {
    alert(error)
  }

}


function CreateImportBill() {
  const state = useContext(GlobalState);
  // const [importbills] = state.importbillAPI.addImportBill;

  const [searchTerm,setSearchTerm] = useState("");
  const [importbill, setImportBill] = useState(initialImportBill);
  const [materials] = state.materialAPI.materials;
  const [warehouses] = state.warehouseAPI.warehouses;
  // const [inforuser] = state.userAPI.inforuser;
  const [currentDate,setcurrentDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const iduser =  (JSON.parse(localStorage.getItem('inforuser'))).madaily._id;
  const newwarehouses =  warehouses.filter((warehouse,index) => (iduser === warehouse.madaily._id) ? warehouse : undefined)
  
  useEffect(() => {
    const day = new Date().getDate()-1;
    const month = new Date().getMonth()+1;
    const year = new Date().getFullYear();
    const testdate =  month + '-'+ day + '-'+year;
    console.log('testdate : ',testdate);
    setcurrentDate(testdate);
   },[])


  // const [startDate, setStartDate] = useState(new Date());
  const [dataDate,setDate] = useState(new Date());
  const ExampleCustomInput = ({ value, onClick }) => (
    <button className="example-custom-input" onClick={onClick}>
      {
        console.log('value : ',value)
      }
      {value}
    </button>
  );
 



  const param = useParams();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setImportBill({ ...importbill, [name]: value });
  };

  console.log('Danh sách vật tư : ',materials);
 
  return (
    <div className="layout">
    <div className="layout-first"><NavBar/></div> 
    <div className="layout-second">
      <Header/>
      <div className="create-importbill">
      <div className="row">
              <input
                type="text"
                name="tenpn"
                placeholder="Nhập tên vật tư"
                id="tenpn"
                required
                // value={importbill.tenpn}
                onChange={(event)=> {
                  setSearchTerm(event.target.value);
                }}
              />
      </div>

      {
           materials.filter(material=>{
            if(searchTerm == "") 
            {
                return material;
            }
            else if(material.tenvt.toLowerCase().includes(searchTerm.toLowerCase()))
            {
                return material;
            }
        }).map(material=>(
          <div onClick={() => AddToImportBill(material)}>
            {material.tenvt}
            {material.soluong}
          </div>
        ))
         }           

      <p>Nhập Thông Tin Phiếu Nhập</p>

      <div className="row">
              <label htmlFor="title">Địa chỉ</label>
              <input
                type="text"
                name="tenpn"
                placeholder="Nhập địa chỉ"
                id="tenpn"
                required
                value={importbill.tenpn}
                onChange={handleChangeInput}
              />
            </div>

   

      <DatePicker
          selected={dataDate}
          dateFormat='dd/MM/yyyy'
          placeholder="Nhập ngày"
          minDate={new Date("10-20-2021")}
          maxDate={new Date(currentDate)}
          onChange={date => setDate(date)}
          customInput={<ExampleCustomInput />}
        />

      <div className="row">
          <label htmlFor="newwarehouses">Kho</label>
          <select
            name="madaily"
            value={importbill.warehouse}
            onChange={handleChangeInput}>
            
            {newwarehouses.map((warehouse) => (
              <option value={warehouse._id}>
                {warehouse.tenkho}
              </option>
            ))}
          </select>
        </div>
        

      </div>
      </div>
    </div>
  )
}

export default CreateImportBill;
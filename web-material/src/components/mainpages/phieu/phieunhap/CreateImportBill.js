import axios from "axios";
import React, { useContext, useState, useEffect  } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { GlobalState } from "../../../../GlobalState";
import DatePicker from "react-datepicker";
// import Moment from 'react-moment';
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
import ImportBillItem from "./ImportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';
import {IoMdArrowDropdown} from 'react-icons/io';
import {RiDeleteBin6Line} from 'react-icons/ri';






function CreateImportBill() {

  const initialImportBill = {
    tenpn:"",
    ngay:"10-20-2021",
    manv:JSON.parse(localStorage.getItem('inforuser'))._id,
    makho:"",
  };

  const state = useContext(GlobalState);
  // const [importbills] = state.importbillAPI.addImportBill;


 
  const [materials] = state.materialAPI.materials;
  const [warehouses] = state.warehouseAPI.warehouses;
  const [loading, setLoading] = useState(false);
  const [user,setUser] =  useState(JSON.parse(localStorage.getItem('inforuser')));
  const [startDate, setStartDate] = useState("");
  const [dhdn, setDHDN] = useState("");
  const [searchTerm,setSearchTerm] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [importbill, setImportBill] = useState({
    tenpn:"",
    ngay: new Date(),
    manv:JSON.parse(localStorage.getItem('inforuser'))._id,
    makho:"",
  });
  const [detailimportbill, setDetailImportBill] = useState([]);


  const newwarehouses =  warehouses.filter((warehouse,index) => (user.madaily._id === warehouse.madaily._id) ? warehouse : undefined)
  
  const SubmitImportBill = () => {
    console.log('dhdn : ',dhdn);
    
  }

  const DateImportBill = (date) => {
   
    const datetest = moment(date).format('DD-MM-yyy');
    console.log('test : ',typeof(date));
    console.log('test1 : ',date);
    setDHDN(datetest);
    setStartDate(date);
  }

  const AddToImportBill = (material) => {
    if(!onSearch)
    {
      document.getElementById("list-material").style.display = "none";
      document.getElementById("inputsearch").value = "";
    }
    const exist = detailimportbill.find((x) => x._id === material._id);
        if(exist) {
      
            setDetailImportBill(
              detailimportbill.map((x) => 
                x._id === material._id ? {...exist, qty: exist.qty + 1 } : x
              )
          )
        }
        else {
          setDetailImportBill([...detailimportbill, {...material,qty:1}]);
        }
  }

  const RemoveToImportBill = (material) => {
    const exist = detailimportbill.find((x) => x._id === material._id);
      if (exist.qty === 1) {
        setDetailImportBill(detailimportbill.filter((x) => x._id !== material._id));
      } else {
        setDetailImportBill(
          detailimportbill.map((x) =>
            x._id === material._id ? { ...exist, qty: exist.qty - 1 } : x
          )
        );
      }
  }


  useEffect(() => {
    const day = new Date().getDate();
    const month = new Date().getMonth()+1;
    const year = new Date().getFullYear();

    const testdate = year + '-' +  month + '-'+ day;
    console.log('testdate : ',testdate);
    // setcurrentDate(testdate);
   },[])


  // const [startDate, setStartDate] = useState(new Date());
  const [dataDate,setDate] = useState(new Date());
  const ExampleCustomInput = ({ value, onClick }) => (
    <button className="button-date-picker" onClick={onClick}>
      {value}
      <IoMdArrowDropdown/>
    </button>
  );

  const param = useParams();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if(e.target.type === 'date')
    {
      setImportBill({ ...importbill, [name]: (e.target.value.slice(8, 10)  + '-' + e.target.value.slice(5, 7) + '-' + e.target.value.slice(0, 4)) });
    }
    else {
      setImportBill({ ...importbill, [name]: value });
    }
   
  };
 
  console.log('Danh sách vật tư : ',materials);
 
  return (
    <div className="layout">
    <div className="layout-first"><NavBar/></div> 
    <div className="layout-second">
      <Header/>
      <div className="create-importbill">
        <div className="row search-material">
          <label>Tìm vật tư</label>
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập tên vật tư"
                  id="inputsearch"
                  required
                  // value={importbill.tenpn}
                  onChange={(event)=> {
                    setSearchTerm(event.target.value);
                    document.getElementById("list-material").style.display = "block";
                    // {onSearch ? }
                  }}
                />
        </div>
        <div className="list-material" id="list-material">
          <div className="header-list-material">
            <p>Tên VT</p>
            <p>Hình ảnh</p>
            <p>Số lượng tồn</p>
            <p>Giá nhập</p>
          </div>
        {
          materials.filter(material=>{
              if(searchTerm == "") 
              {
                  return null;
              }
              else if(material.tenvt.toLowerCase().includes(searchTerm.toLowerCase()))
              {
                  return material;
              }
          }).map((material,index)=>(
            <div className="item-material" onClick={() =>
            {
              setOnSearch(false)
              AddToImportBill(material)
            }}>
            
              <p>{material.tenvt}</p>
              <p><img width="80" height="40" src={material.images.url} alt=""></img></p>
              <p>{material.soluong} {material.donvi}</p>
              <p>{material.gianhap} VND</p>
            </div>
          ))
        }            
        </div>
     
      <div className="form-bill">
      <p className="header-title">Nhập Thông Tin Phiếu Nhập</p>

      <div className="row">
              <label htmlFor="title">Tên phiếu nhập</label>
              <input
                type="text"
                name="tenpn"
                placeholder="Nhập tên phiếu nhập"
                id="tenpn"
                required
                value={importbill.tenpn}
                onChange={handleChangeInput}
              />
      </div>


    <div className="row">
    <label htmlFor="title">Ngày lập</label>

          {/* <input type='date' name="ngay"
          value={importbill.ngay} 
          // min="2017-04-01" max="2017-04-30"
          required pattern="\d{4}-\d{2}-\d{2}"
          onChange={handleChangeInput}/> */}
   
 <DatePicker
        className="date-picker"
        format="DD-MM-YYYY"
        placeholder="Nhập ngày"
        minDate={new Date("10-20-2021")}
        // maxDate={new Date(currentDate)}
        dateFormat="dd/MM/yyyy"
        selected={startDate}
        onChange={(date) => DateImportBill(date)}
        value={importbill.ngay}
       
        customInput={<ExampleCustomInput />}
      />



    </div>

    <div className="row">
        <label htmlFor="newwarehouses">Kho</label>
        <select
          name="madaily"
          value={importbill.warehouse}
          onChange={handleChangeInput}>
           <option value="" disabled selected hidden>Vui lòng chọn kho</option>
          {newwarehouses.map((warehouse) => (
            <option value={warehouse._id}>
              {warehouse.tenkho}
            </option>
          ))}
        </select>
    </div>

    <div className="row thongtinnv">
        <label className="id">ID: {user._id}</label>
        <label htmlFor="newwarehouses">Họ tên: {user.hoten}
        {
            console.log('Nhân Viên : ',user.hoten)
        }</label>
    </div>
      {
         <div className="list-item-bill">
         <h3>Danh sách vật tư</h3>
         <div className="header-item-bill">
           <p>STT</p>
           <p>Tên VT</p>
           <p>Hình Ảnh</p>
           <p>Đơn Giá</p>
           <p>Số Lượng</p>
           <p>Tổng Tiền</p>
         </div>
          {
            detailimportbill.map((item,index) => {
              return (
               <div className="item-bill">
               <div>{index+1}</div>
             <div>{item.tenvt}</div>
             <img width="160" height="100" src={item.images.url} alt=""></img>
            
            <div>
            {item.gianhap}VND
            </div>
       
            <button onClick={() => RemoveToImportBill(item)} className="remove">
              -
            </button>{' '}
             <div>{item.qty}</div>
             <button onClick={() => AddToImportBill(item)} className="add">
              +
            </button>
       
            <div>
            {item.gianhap *  item.qty} VND
            </div>

            <div>
              <RiDeleteBin6Line className="delete-item" onClick={() => {setDetailImportBill(detailimportbill.filter((x) => x._id !== item._id))}}/>
              
            </div>

              </div>
              )
             }
             )
          }
       </div>
      }  

     </div>
     <div className="button-option">
     <button onClick={() =>
            {
              SubmitImportBill()
            }}>Lập Phiếu</button>
      <button>Hủy</button>
     </div>
      </div>
      </div>
    </div>
  )
}

export default CreateImportBill;
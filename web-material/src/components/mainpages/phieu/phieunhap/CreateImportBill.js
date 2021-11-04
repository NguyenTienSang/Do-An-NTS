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
    ngay:"",
    manv:JSON.parse(localStorage.getItem('inforuser'))._id,
    makho:"",
  };

  const state = useContext(GlobalState);
  const [materials] = state.materialAPI.materials;
  const [warehouses] = state.warehouseAPI.warehouses;
  const [importbills] = state.importbillAPI.importbills;
  const [detailimportbill, setDetailImportBill] = useState([]);
  const [newdetailimportbill, setNewDetailImportBill] = useState();
  const [loading, setLoading] = useState(false);
  const [user,setUser] =  useState(JSON.parse(localStorage.getItem('inforuser')));
  const [startDate, setStartDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [currentDate, setCurrentDate] = useState((new Date()));
  const [hdn, setHDN] = useState(new Date("10-20-2021"));
  const [searchTerm,setSearchTerm] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [importbill, setImportBill] = useState({
    tenpn:'PN' +(importbills.length + 1),
    ngay: moment(new Date()).format('DD-MM-yyy'),
    manv:JSON.parse(localStorage.getItem('inforuser'))._id,
    makho:""
  });
  


  const newwarehouses =  warehouses.filter((warehouse,index) => (user.madaily._id === warehouse.madaily._id) ? warehouse : undefined)
  
  const SubmitImportBill = () => {
    console.log('importbill : ',importbill);
    console.log('detailimportbill : ',detailimportbill);
    // console.log('newdetailimportbill : ',newdetailimportbill);
    // setImportBill({...importbill,ctpn : detailimportbill});
    // {...importbill,makho : detailimportbill}
    // setImportBill(...importbill)

  }

  useEffect(() => {
    const date = new Date();
    const day = new Date().getDate();
    const month = new Date().getMonth()+1;
    const year = new Date().getFullYear();
    console.log('currentDate : ',currentDate);

   
    setStartDate(
      day+'-'+month+'-'+year
    )

    console.log('importbills : ',importbills.length);
  },[])


  

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
      setImportBill({ ...importbill, [name]: value });
  };
 
 
 
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
                disabled
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
        maxDate={new Date()}
        dateFormat="dd-MM-yyyy"
        selected={currentDate}
        onChange={(date) =>
          {
            setCurrentDate(date)
            console.log('date : ',typeof(date))

            // const datetest = moment(date).format('DD-MM-yyy');
            // console.log('datetest : ',datetest)
            setImportBill({ ...importbill, ngay : moment(date).format('DD-MM-yyy')});

          }
           
        }
        value={currentDate}
       
        customInput={<ExampleCustomInput />}
      />



    </div>

    <div className="row">
        <label htmlFor="newwarehouses">Kho</label>
        <select
          name="makho"
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
              detailimportbill.map(item => 
              //   {
              //   setDetailImportBill({item,_id : item._id,gianhap : item.gianhap,qty : item.qty})
              //   // setNewDetailImportBill({...newdetailimportbill,_id : item._id,gianhap : item.gianhap,qty : item.qty})
              // }
              ({
                _id : item._id,gianhap : item.gianhap,qty : item.qty
              })
              )
              // setImportBill({...importbill,ctpn : newdetailimportbill})
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
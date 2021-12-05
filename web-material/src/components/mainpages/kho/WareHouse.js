import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom"

import {GlobalState} from "../../../GlobalState"
import WareHouseItem from "./WareHouseItem";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";
import Loading from "../utils/loading/Loading";
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';

const initialWareHouse = {
tenkho:"",
madaily:"",
diachi:"",
sodienthoai:""
};

function WareHouses() {
  const state = useContext(GlobalState);
  const [warehouse, setWareHouse] = useState(initialWareHouse);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const param = useParams();
  const [searchTerm,setSearchTerm] = useState("");
  const [stores] = state.storeAPI.stores;
  const [onEdit, setOnEdit] = useState(false);
  const [warehouses] = state.warehouseAPI.warehouses;
  const [callback, setCallback] = state.warehouseAPI.callback;

// console.log('warehouses : ',warehouses)

  const [openalert,setOpenAlert] = useState(false);

  const [message,setMessage] = useState("");
  
  const inforuser = JSON.parse(localStorage.getItem('inforuser'));

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      warehouses.forEach((warehouse) => {
        if (warehouse._id === param.id) {
          setWareHouse(warehouse);
          setImages(warehouse.images);
        }
      });
    } else {
      setOnEdit(false);
      setWareHouse(initialWareHouse);
      setImages(false);
    }
  }, [param.id, warehouses]);


  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("Bạn không phải là Admin");
      const file = e.target.files[0];

      if (!file) return alert("File không tồn tài");

      if (file.size > 1024 * 1024)
        return alert("Size quá lớn");//1mb

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("Định dạng file không đúng");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      console.log('dữ liệu ảnh : ',res.data);
      console.log('dữ liệu ảnh url : ',res.data.url);
      setImages(res.data);
    } catch (err) {
      // alert(err.response.data.message);

      setMessage(err.response.data.message)
      setOpenAlert(true);
    }
  };

  
  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert("Bạn không phải Admin");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      // alert(err.response.data.message);

      setMessage(err.response.data.message)
      setOpenAlert(true);

    }
  };

  const handleChangeInput = (e) => {
    console.log('e.target : ',e.target)
    const { name, value } = e.target;
    console.log('name : ',name);
    console.log('value : ',value);
    setWareHouse({ ...warehouse, [name]: value });
    console.log('Thông tin kho : ',warehouse);
  };


  
  const styleUpload = {
    display: images ? "block" : "none",
  };



  const AddWareHouse = () => {
    setOnEdit(false);
    setWareHouse(initialWareHouse);
    setLoading(false);
    document.getElementById("modal_container__warehouse").classList.add("modal_active");
  }

  const EditWareHouse = (data_warehouse_edit) => {
    console.log('dữ liệu vật tư edit : ',data_warehouse_edit)
    setOnEdit(true);
    setWareHouse(data_warehouse_edit);
    setImages(data_warehouse_edit.images);
    document.getElementById("modal_container__warehouse").classList.add("modal_active");
  }

  const CloseModalWareHouse = () => {
    document.getElementById("modal_container__warehouse").classList.remove("modal_active");
  }

  const AddToListWareHouse = async (e) => {
    console.log(e);
       
      console.log('warehouse : ',warehouse)
        // //Thêm mới
        if(!onEdit)
        {
          try {
            const res = await axios.post(
                     "/api/kho",
                     { ...warehouse, images },
                     {
                       headers: { Authorization: token },
                     }
                   );
                  //  alert(res.data.message);

                   setMessage(res.data.message)
                   setOpenAlert(true);


                   document.getElementById("modal_container__warehouse").classList.remove("modal_active");
                   setCallback(!callback);
                  //  history.push("/vattu");
           } catch (err) {
              //  alert(err.response.data.message);

               setMessage(err.response.data.message)
               setOpenAlert(true);

           }
        }
        //Cập nhật thông tin đại lý
        if(onEdit)
        {
          try {
            const res = await axios.put(
                     `/api/kho/${warehouse._id}`,
                     { ...warehouse, images },
                     {
                       headers: { Authorization: token },
                     }
                   );
                  //  alert(res.data.message);

                   setMessage(res.data.message)
                   setOpenAlert(true);

                   document.getElementById("modal_container__warehouse").classList.remove("modal_active");
                   setCallback(!callback);
           } catch (err) {
              //  alert(err.response.data.message);

               setMessage(err.response.data.message)
               setOpenAlert(true);

           }
        }  
  }


  const DeleteWareHouse = async (id, public_id) => {
    try {
      setLoading(true);
      //Xóa ảnh trên cloudinary
      const destroyImg = axios.post(
        "/api/destroy",
        {
          public_id,
        },
        { headers: { Authorization: token } }
      );
      //Xóa vật tư trong db
      const deletewarehouse = await axios.delete(
               `/api/kho/${id}`,
               {
                 headers: { Authorization: token },
               }
             );
            //  alert(res.data.message);
             await destroyImg;
            // alert(deletewarehouse.data.message);

            setMessage(deletewarehouse.data.message)
            setOpenAlert(true);

             setCallback(!callback);
             setLoading(false);
     } catch (err) {
        //  alert(err.response.data.message);

        setMessage(err.response.data.message)
        setOpenAlert(true);

     }
  }

 
  return (
    <>
    <div className="layout">
    <div className="layout-first"><Header/></div>
    <div className="layout-second">
    <NavBar/>
        <div className="warehouses">
        <div className="header-title">

        <div className="row search-warehouse">
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập tên kho"
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
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Kho</h2>
              </div>
           
              {
                isAdmin ? <button className='add-item' onClick={AddWareHouse}><BiBookAdd  style={{marginRight:'5px',marginTop:'5px'}}/>Thêm Kho</button> : null
              }
            
            </div>

            <div className="warehouse-header_list">
              <p style={{width:"70px"}}>STT</p>
              <p style={{width:"160px"}}>ID</p>
              <p style={{flex:1}}>Tên kho</p>
              <p style={{width:"160px"}}>Hình ảnh</p>
              <p style={{flex:1}}>Đại lý</p>
              <p style={{flex:1}}>Địa chỉ</p>
              <p style={{flex:1}}>SĐT</p>
              {/* {
                isAdmin ? 
                <>
                    <p style={{flex:0.6}}>Cập nhật</p>
                </>
                : null
              } */}
              <p style={{flex:1}}>Chức Năng</p>
            </div>
            {warehouses?.filter(warehouse=>{
            if(searchTerm === "") 
            {
                return warehouse;
            }
            else if(
              warehouse._id.toLowerCase().includes(searchTerm.toLowerCase())
              || warehouse.tenkho.toLowerCase().includes(searchTerm.toLowerCase())
              || warehouse.madaily.tendl.toLowerCase().includes(searchTerm.toLowerCase())
              || warehouse.diachi.toLowerCase().includes(searchTerm.toLowerCase())
              || warehouse.sodienthoai.toLowerCase().includes(searchTerm.toLowerCase())
              
            )
            {
                return warehouse;
            }
        }).map((warehouse,index) => {
                 if(isAdmin)
                 {
                  return( 
                    <WareHouseItem
                      key={warehouse._id}
                      warehouse={warehouse}
                      stt={index}
                      EditWareHouse={EditWareHouse}
                      DeleteWareHouse={DeleteWareHouse}
                    />
                  )
                  }
                  else {
                    if(warehouse.madaily._id.toString() === inforuser.madaily._id.toString())
                    {
                      return( 
                        <WareHouseItem
                          key={warehouse._id}
                          warehouse={warehouse}
                          stt={index}
                          EditWareHouse={EditWareHouse}
                          DeleteWareHouse={DeleteWareHouse}
                        />
                      )
                    }
                  }
            })}
        </div>


      </div>
    </div>

    <div className="modal_container__warehouse" id="modal_container__warehouse">
          <div className="modal_warehouse">
            <h2 className="title_add__warehouse">{onEdit ? "Cập Nhật Thông Tin Kho" : "Thêm Kho"}</h2>
            <div className="row">
              <label htmlFor="title">Tên kho</label>
              <input
                type="text"
                name="tenkho"
                placeholder="Nhập tên kho"
                id="tenkho"
                required
                value={warehouse.tenkho}
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
              <label htmlFor="diachi">Địa chỉ</label>
              <input
                type="text"
                name="diachi"
                placeholder="Nhập địa chỉ"
                id="diachi"
                required
                value={warehouse.diachi}
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
          <label htmlFor="stores">Đại lý</label>
          <select
          className="select_daily__kho"
            name="madaily"
            value={warehouse.daily}
            onChange={handleChangeInput}
          >
            <option value="" disabled selected hidden>Vui lòng chọn đại lý</option>
            {stores.map((daily) => (
              <option value={daily._id}>
                {daily.tendl}
              </option>
            ))}
          </select>
        </div>


            <div className="row">
              <label htmlFor="sodienthoai">Số điện thoại</label>
              <input
                // type="number"
                name="sodienthoai"
                placeholder="Nhập số điện thoại"
                id="sodienthoai"
                required
                value={warehouse.sodienthoai}
                maxlength="10"
                onChange={handleChangeInput}
              />
            </div>

            
            <div className="upload">
              <h1>Hình ảnh</h1>
              <input type="file" name="file" id="file_up" onChange={handleUpload} />
              
             
              {loading ? (
                <div id="file_img">
                  <Loading />
                </div>
              ) : (
                <div id="file_img" style={styleUpload}>
                  <img src={images ? images.url : ""} alt=""></img>
                  <span onClick={handleDestroy}>X</span>
                </div>
              )}
            </div>


            <div className="option-button">
                <button id="add" onClick={AddToListWareHouse}>{onEdit ? 'Cập Nhật' : 'Thêm'}</button>
                <button id="close"   onClick={CloseModalWareHouse}>Hủy</button>
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
               document.getElementById("modal_container__notification").classList.remove("modal_active");
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

export default WareHouses;
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
sodienthoai:0
};

function WareHouses() {
  const state = useContext(GlobalState);
  const [warehouse, setWareHouse] = useState(initialWareHouse);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const param = useParams();

  const [stores] = state.storeAPI.stores;
  const [onEdit, setOnEdit] = useState(false);
  const [warehouses] = state.warehouseAPI.warehouses;
  const [callback, setCallback] = state.warehouseAPI.callback;
  

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
      alert(err.response.data.message);
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
      alert(err.response.data.message);
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
    document.getElementById("modal_container").classList.add("modal_active");
  }

  const EditWareHouse = (data_warehouse_edit) => {
    console.log('dữ liệu vật tư edit : ',data_warehouse_edit)
    setOnEdit(true);
    setWareHouse(data_warehouse_edit);
    setImages(data_warehouse_edit.images);
    document.getElementById("modal_container").classList.add("modal_active");
  }

  const CloseModalWareHouse = () => {
    document.getElementById("modal_container").classList.remove("modal_active");
  }

  const AddToListWareHouse = async (e) => {
    console.log(e);
        // alert('Thêm thành công : '+employee.tenvt);
        // console.log('Dữ liệu thêm mới : ',{...employee, images });
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
                   alert(res.data.message);
                   document.getElementById("modal_container").classList.remove("modal_active");
                   setCallback(!callback);
                  //  history.push("/vattu");
           } catch (err) {
               alert(err.response.data.message);
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
                   alert(res.data.message);
                   document.getElementById("modal_container").classList.remove("modal_active");
                   setCallback(!callback);
           } catch (err) {
               alert(err.response.data.message);
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
            alert(deletewarehouse.data.message);
             setCallback(!callback);
             setLoading(false);
     } catch (err) {
         alert(err.response.data.message);
     }
  }

 
  return (
    <>
    <div className="layout">
    <div className="layout-first"><NavBar/></div>
    <div className="layout-second">
      <Header/>
        <div className="warehouses">

        <div className="header-title">
              <div className="title-tab">
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Kho</h2>
              </div>
           
              <button className='add-item' onClick={AddWareHouse}><BiBookAdd  style={{marginRight:'5px',marginTop:'5px'}}/>Thêm Kho</button>
            
            </div>

            <div className="header_list">
              <p style={{flex:0.5}}>STT</p>
              <p>Tên kho</p>
              <p>Hình ảnh</p>
              <p>Đại lý</p>
              <p>Địa chỉ</p>
              <p>SĐT</p>
              <p style={{flex:0.6}}>Cập nhật</p>
              <p style={{flex:0.6}}>Xóa</p>
              <p style={{flex:0.6}}>Xem kho</p>
            </div>
            {warehouses?.map((warehouse,index) => {
                return( 
                  <WareHouseItem
                    key={warehouse._id}
                    warehouse={warehouse}
                    stt={index}
                    EditWareHouse={EditWareHouse}
                    DeleteWareHouse={DeleteWareHouse}
                  />
                )
            })}
        </div>


      </div>
    </div>

    <div className="modal_container" id="modal_container">
          <div className="modal">
            <h2>{onEdit ? "Cập Nhật Thông Tin Kho" : "Thêm Kho"}</h2>
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
                type="number"
                name="sodienthoai"
                placeholder="Nhập số điện thoại"
                id="sodienthoai"
                required
                value={warehouse.sodienthoai}
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
    </>
  )
}

export default WareHouses;
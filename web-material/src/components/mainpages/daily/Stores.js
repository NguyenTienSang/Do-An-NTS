import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom"

import { GlobalState } from "../../../GlobalState";
import StoreItem from "./StoreItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';

const initialStore = {
  tendl:"",
  diachi:"",
  sodienthoai:0
};

function Stores() {
  const state = useContext(GlobalState);
  const [store, setStore] = useState(initialStore);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const history = useHistory();
  const param = useParams();

  const [stores] = state.storeAPI.stores;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.storeAPI.callback;


  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      stores.forEach((store) => {
        if (store._id === param.id) {
          setStore(store);
          setImages(store.images);
        }
      });
    } else {
      setOnEdit(false);
      setStore(initialStore);
      setImages(false);
    }
  }, [param.id, stores]);

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
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };

  const AddStore = () => {
    setOnEdit(false);
    setStore(initialStore);
    setImages(false);
    setLoading(false);
    document.getElementById("modal_container").classList.add("modal_active");
  }

  const EditStore = (data_store_edit) => {
    console.log('dữ liệu vật tư edit : ',data_store_edit)
    setOnEdit(true);
    setStore(data_store_edit);
    setImages(data_store_edit.images);
    document.getElementById("modal_container").classList.add("modal_active");
  }

  const CloseModalStore = () => {
    document.getElementById("modal_container").classList.remove("modal_active");
  }

  const AddToListStore = async () => {
        // alert('Thêm thành công : '+material.tenvt);
        console.log('Dữ liệu thêm mới : ',{...store, images });
      
        //Thêm mới
        if(!onEdit)
        {
          try {
            const res = await axios.post(
                     "/api/daily",
                     { ...store, images },
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
        //Cập nhật thông tin vật tư
        if(onEdit)
        {
          try {
            const res = await axios.put(
                     `/api/daily/${store._id}`,
                     { ...store, images },
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


  const DeleteStore = async (id, public_id) => {
    // alert('Xóa thành công'+' id : '+id+' public_id : '+public_id);
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
      const deletestore = await axios.delete(
               `/api/daily//${id}`,
               {
                 headers: { Authorization: token },
               }
             );
            //  alert(res.data.message);
             await destroyImg;
            alert(deletestore.data.message);
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
      <div className="stores">
      <div className="header-title">
              <div className="title-tab">
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Đại Lý</h2>
              </div>
           
              <button className='add-item' onClick={AddStore}><BiBookAdd  style={{marginRight:'5px',marginTop:'5px'}}/>Thêm Đại Lý</button>
            
            </div>

          <div className="header_list">
            <p style={{flex:0.5}}>STT</p>
            <p>Tên đại lý</p>
            <p>Hình ảnh</p>
            <p>Địa chỉ</p>
            <p>SĐT</p>
            <p style={{flex:0.6}}>Cập nhật</p>
            <p style={{flex:0.6}}>Xóa</p>
          </div>
          {
          stores.map((store,index) => {
              return(
                <StoreItem
                  key={store._id}
                  store={store}
                  stt={index}
                  EditStore={EditStore}
                  DeleteStore={DeleteStore}
                />
              )
          })}
      </div>
    </div>
  </div>

  <div className="modal_container" id="modal_container">
          <div className="modal">
            <h2>{onEdit ? "Cập Nhật Thông Tin Đại Lý" : "Thêm Đại Lý"}</h2>
            <div className="row">
              <label htmlFor="title">Tên đại lý</label>
              <input
                type="text"
                name="tendl"
                placeholder="Nhập tên đại lý"
                autoComplete="off"
                id="tendl"
                required
                value={store.tendl}
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
              <label htmlFor="diachi">Địa chỉ</label>
              <input
                type="text"
                name="diachi"
                placeholder="Nhập địa chỉ"
                autoComplete="off"
                id="diachi"
                required
                value={store.diachi}
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
              <label htmlFor="sodienthoai">Số điện thoại</label>
              <input
                type="number"
                name="sodienthoai"
                placeholder="Nhập số điện thoại"
                autoComplete="off"
                id="sodienthoai"
                required
                value={store.sodienthoai}
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
                <button id="add" onClick={AddToListStore}>{onEdit ? 'Cập nhật' : 'Thêm'}</button>
                <button id="close"   onClick={CloseModalStore}>Hủy</button>
            </div>

          </div>
  </div>
  </>
  )
}

export default Stores;
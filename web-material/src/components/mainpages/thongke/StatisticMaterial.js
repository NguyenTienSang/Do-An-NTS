import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { GlobalState } from "../../../GlobalState";
// import MaterialItem from "./MaterialItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';


function StatisticMaterial() {

  const state = useContext(GlobalState);
  // const [material, setMaterial] = useState(initialMaterial);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const history = useHistory();
  const param = useParams();

  const [stores] = state.storeAPI.stores;
  const [warehouses] = state.warehouseAPI.warehouses;
  const [materials] = state.materialAPI.materials;
  const [importbills] = state.importbillAPI.importbills;
  // const [statisticmaterials] = state.statisticAPI.statisticmaterials;

  const [materialsfilter,setMaterialsFilter] = useState(materials)
  const [searchTerm,setSearchTerm] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [madailyfilter,setMaDaiLyFilter] = useState("allstores");
  const [makhofilter,setMaKhoFilter] = useState("allwarehouses");

 
  const handlechangestore = (e) => {
    // console.log('materials thay đổi đại lý : ',materials);
    console.log('materialsfilter thay đổi đại lý : ',materialsfilter)
    console.log('e.target.value : ',e.target.value)
    setMaDaiLyFilter(e.target.value);
    setMaKhoFilter('allwarehouses');//Nếu mà thay đổi đại lý thì kho sẽ trở về là 'Tất cả kho'
  };
  const handlechangewarehouse = (e) => {
    setMaKhoFilter(e.target.value);
  };

  useEffect(async() => {
    const res = await axios.post('/api/thongke/vattu',
           {madailyfilter, makhofilter}
    );
    console.log('Dữ liệu thống kê : ',res)
    console.log('madailyfilter : ',madailyfilter);
    console.log('makhofilter : ',makhofilter);
    setMaterialsFilter(res.data);
},[madailyfilter,makhofilter])

  return (
    <div className="layout">
             <div className="layout-first"><Header/></div>
             <div className="layout-second">
             <NavBar/>
               
          <div className="materials">
          <p className="title-statistic-material">Thống kê vật tư</p>
        <div className="container-filter">
          <div className="row search-material">
          <label>Tìm vật tư : </label>
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập tên vật tư"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  onChange={(event)=> {
                    setSearchTerm(event.target.value);
                  }}
                />
            </div>
          <div className="filter-select">
          <label>Đại lý : </label>
          <select className="select-store"
              // value={madailyfilter}
              defaultValue={"allstores"}
              onChange={handlechangestore}>
              <option value="allstores" >Tất cả đại lý</option>
              {stores.map((store) => (
                <option value={store._id} key={store._id}>
                  {store.tendl}
                </option>
              ))}
            </select>
            <label>Kho : </label>
            <select
              name="makho"
              defaultValue={"allwarehouses"}
              onChange={handlechangewarehouse}>
              (
                  <option value="allwarehouses">Tất cả kho</option>
                {warehouses.map((warehouse) => 
                (
                    madailyfilter == warehouse.madaily._id 
                    ? 
                        <option value={warehouse._id} key={warehouse._id}>
                      {warehouse.tenkho}
                      </option>
                    :
                    null
                )
                )}
                )
            </select>
            </div> 
        </div>


            <div className="header-title">
              <div className="title-tab">
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Vật Tư</h2>
              </div>
            </div>


            <div className="header_list">
              <p style={{flex:0.5}}>STT</p>
              <p>Tên vật tư</p>
              <p>Hình ảnh</p>
              <p>Số lượng tồn</p>
              <p>Giá nhập</p>
              <p>Giá xuất</p>
              <p style={{flex:0.6}}>Trạng thái</p>
            </div>
            {
              materialsfilter.filter(material=>{
              if(searchTerm === "") 
              {
                  return material;
              }
              else if(material.tenvt.toLowerCase().includes(searchTerm.toLowerCase()))
              {
                  return material;
              }
          }).map((material,index) => {
                return(
                  <div className="material_item">
                  <div style={{flex:0.5}} className="material_item_element">
                  <h2>{index+1}</h2>
                  </div>
                  <div className="material_item_element">
                  <h2>{material.tenvt}</h2>
                  </div>
                  <div className="material_item_element">
                    <img src={material.images.url} alt="" />
                  </div>
                   
                  <div className="material_item_element">
                  {material.soluong} {material.donvi}
                  </div>
                  
                  <div className="material_item_element">
                  {material.gianhap} VND
                  </div>
                    <div className="material_item_element">
                    {material.giaxuat} VND
                    </div>
                    <div style={{flex:0.6}} className="material_item_element">
                    {material.trangthai}
                    </div>
                </div>
                )
            })}
        </div>
             </div>
   </div>
  )
}

export default StatisticMaterial;
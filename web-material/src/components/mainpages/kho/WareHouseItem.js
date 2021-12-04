import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaUserEdit} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {AiOutlineEye} from 'react-icons/ai';

function WareHouseItem({warehouse,stt,EditWareHouse,DeleteWareHouse}) {

  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;

    return (
        <div className="warehouse_item">
        <div style={{width:"70px"}} className="warehouse_item_element">
        <p>{stt+1}</p>
        </div>
        <div style={{width:"160px"}} className="warehouse_item_element  id_warehouse">
        <p>{warehouse._id}</p>
        </div>
        <div style={{flex:1}} className="warehouse_item_element">
        <p>{warehouse.tenkho}</p>
        </div>
        <div  style={{width:"160px"}} className="warehouse_item_element">
          <img src={warehouse.images.url} alt="" />
        </div>
         
        <div style={{flex:1}} className="warehouse_item_element">
            {warehouse.madaily.tendl}
        </div>

        <div style={{flex:1}} className="warehouse_item_element">
            {warehouse.diachi} 
        </div>
          <div style={{flex:1}} className="warehouse_item_element">
          {warehouse.sodienthoai}
          </div>

   
          <div style={{flex:1}} className="warehouse_item_element">
          {
           isAdmin ? 
           <>
              <button style={{fontSize:36}} onClick={() => EditWareHouse(warehouse)}><FaUserEdit style={{color: "rgb(15, 184, 0)"}}/></button>
              <button style={{fontSize:36}} onClick={() => DeleteWareHouse(warehouse._id,warehouse.images.public_id)}><RiDeleteBin6Line style={{color: "red"}}/></button>
            
           </>
           : null
         }
          <Link to={'/chitietkho'}><button style={{fontSize:36}}><AiOutlineEye style={{color: "rgb(26, 148, 255)"}}/></button></Link>
    
          </div>
        
        
          
      </div>
    )
}

export default WareHouseItem;

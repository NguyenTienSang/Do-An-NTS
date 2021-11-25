import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaUserEdit} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {GrView} from 'react-icons/gr';

function WareHouseItem({warehouse,stt,EditWareHouse,DeleteWareHouse}) {

  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;

    return (
        <div className="warehouse_item">
        <div style={{flex:0.5}} className="warehouse_item_element">
        <h2>{stt+1}</h2>
        </div>
        <div className="warehouse_item_element">
        <h2>{warehouse.tenkho}</h2>
        </div>
        <div className="warehouse_item_element">
          <img src={warehouse.images.url} alt="" />
        </div>
         
        <div className="warehouse_item_element">
            {warehouse.madaily.tendl}
        </div>

        <div className="warehouse_item_element">
            {warehouse.diachi} 
        </div>
          <div className="warehouse_item_element">
          {warehouse.sodienthoai}
          </div>
        
         {
           isAdmin ? 
           <>
            <div style={{flex:0.6}} className="warehouse_item_element">
              <button style={{fontSize:30}} onClick={() => EditWareHouse(warehouse)}><FaUserEdit/></button>
            </div>
            <div style={{flex:0.6}} className="warehouse_item_element">
              <button onClick={() => DeleteWareHouse(warehouse._id,warehouse.images.public_id)} style={{fontSize:30}}><RiDeleteBin6Line/></button>
            </div>
             
           </>
           : null
         }
          <div style={{flex:0.6}} className="warehouse_item_element">
          <Link to={'/chitietkho'}> <button><GrView/></button></Link>
          </div>
      </div>
    )
}

export default WareHouseItem;

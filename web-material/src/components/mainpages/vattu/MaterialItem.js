import React, { useContext, useState } from "react";
import { GlobalState } from '../../../GlobalState';

import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaRegEdit} from 'react-icons/fa';

function MaterialItem({material,stt,EditMaterial,DeleteMaterial}) {

  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;

    return (
      <div className="material_item">
        <div style={{flex:0.5}} className="material_item_element">
        <h2>{stt+1}</h2>
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
         {
           isAdmin ?
           <>
             <div style={{flex:0.6}} className="material_item_element">
            <button style={{fontSize:30}} onClick={() => EditMaterial(material)}><FaRegEdit/></button>
            </div>
            <div style={{flex:0.6}} className="material_item_element">
            <button onClick={() => DeleteMaterial(material._id,material.images.public_id)} style={{fontSize:30}}><RiDeleteBin6Line/></button>
            </div>
           </>
           : null
         }
      </div>
 
    )
}

export default MaterialItem

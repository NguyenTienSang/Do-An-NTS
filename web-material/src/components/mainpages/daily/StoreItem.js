import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";

import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaRegEdit} from 'react-icons/fa';

function StoreItem({store,stt,EditStore,DeleteStore}) {
  const state = useContext(GlobalState);

    return (
      <div className="store_item">
          <div style={{flex:0.5}} className="store_item_element">
          <h2>{stt+1}</h2>
          </div>
        <div className="store_item_element">
        <h2>{store.tendl}</h2>
        </div>
        <div className="store_item_element">
          <img src={store.images.url} alt="" />
        </div>
         
        <div className="store_item_element">
         {store.diachi}
        </div>
       
        <div className="store_item_element">
          {store.sodienthoai}
        </div>
        <div style={{flex:0.6}} className="store_item_element">
          <button style={{fontSize:30}} onClick={() => EditStore(store)}><FaRegEdit/></button>
        </div>
        <div style={{flex:0.6}} className="store_item_element">
          <button onClick={() => DeleteStore(store._id,store.images.public_id)} style={{fontSize:30}}><RiDeleteBin6Line/></button>
         </div>
      </div>
    )
}

export default StoreItem

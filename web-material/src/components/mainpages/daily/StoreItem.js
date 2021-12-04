import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";

import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaRegEdit} from 'react-icons/fa';

function StoreItem({store,stt,EditStore,DeleteStore}) {
  const state = useContext(GlobalState);

    return (
      <div className="store_item">
          <div style={{width:"70px"}} className="store_item_element">
          <p>{stt+1}</p>
          </div>
          <div style={{width:"160px"}} className="store_item_element id_store">
        <p>{store._id}</p>
        </div>
        <div style={{flex:1}} className="store_item_element">
        <p>{store.tendl}</p>
        </div>
        <div style={{flex:1}} className="store_item_element">
          <img src={store.images.url} alt="" />
        </div>
         
        <div style={{flex:1}} className="store_item_element">
         {store.diachi}
        </div>
       
        <div style={{flex:1}} className="store_item_element">
          {store.sodienthoai}
        </div>
        <div style={{flex:1}} className="store_item_element">
          <button style={{fontSize:30}} onClick={() => EditStore(store)}><FaRegEdit style={{color: "rgb(15, 184, 0)"}}/></button>
          <button onClick={() => DeleteStore(store._id,store.images.public_id)} style={{fontSize:30}}><RiDeleteBin6Line style={{color: "red"}}/></button>
        </div>
      </div>
    )
}

export default StoreItem

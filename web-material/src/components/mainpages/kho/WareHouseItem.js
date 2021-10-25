import React from 'react'
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaUserEdit} from 'react-icons/fa';

function WareHouseItem({warehouse,stt}) {
    return (
        <div className="warehouse_item">
        <div style={{flex:0.5}} className="warehouse_item_element">
        <h2>{stt+1}</h2>
        </div>
        <div className="warehouse_item_element">
        <h2>{warehouse.tenkho}</h2>
        </div>
        <div className="warehouse_item_element">
          <img src={warehouse.images} alt="" />
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
          <div style={{flex:0.6}} className="warehouse_item_element">
            <button style={{fontSize:30}}><FaUserEdit/></button>
          </div>
          <div style={{flex:0.6}} className="warehouse_item_element">
          <button style={{fontSize:30}}><RiDeleteBin6Line/></button>
          </div>
          <div style={{flex:0.6}} className="warehouse_item_element">
          <button>Chi tiết</button>
          </div>
      </div>
    )
}

export default WareHouseItem;

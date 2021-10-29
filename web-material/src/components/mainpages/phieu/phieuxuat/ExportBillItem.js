import React from 'react'
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaUserEdit} from 'react-icons/fa';
import {GrView} from 'react-icons/gr';



function ExportBillItem({importbill,stt}) {
  console.log('phiếu nhập : ',importbill);
    return (
        <div className="importbill_item">
        <div style={{flex:0.5}} className="importbill_item_element">
        <p>{stt+1}</p>
        </div>
        <div className="importbill_item_element">
        <p>{importbill.tenpx}</p>
        </div>
        <div className="importbill_item_element">
        <p>{(importbill.ngay).slice(8,10)}-{(importbill.ngay).slice(5,7)}-{(importbill.ngay).slice(0,4)}</p>
        </div>

        <div className="importbill_item_element">
        <p>{importbill.manv.hoten}</p>
        </div>

        <div className="importbill_item_element">
        <p>{importbill.manv.madaily.tendl}</p>
        </div>
         
    
      
          <div style={{flex:0.6}} className="importbill_item_element">
          <button><GrView/></button>
          </div>
      </div>
    )
}

export default ExportBillItem;

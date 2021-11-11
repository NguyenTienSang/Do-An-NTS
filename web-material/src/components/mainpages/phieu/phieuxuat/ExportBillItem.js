import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaUserEdit} from 'react-icons/fa';
import {GrView} from 'react-icons/gr';
import DetailExportBill from './DetailExportBill';


function ExportBillItem({exportbill,stt}) {

  const [detailexport,setDetailExport] = useState(false);

  const Format = (number) => {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
}

  console.log('phiếu nhập : ',exportbill);
    return (
      <div>
        <div className="exportbill_item">
        <div style={{flex:0.5}} className="exportbill_item_element">
        <p>{stt+1}</p>
        </div>
        <div className="exportbill_item_element">
        <p>{exportbill.tenpx}</p>
        </div>
        <div className="exportbill_item_element">
        <p>{(exportbill.ngay).slice(8,10)}-{(exportbill.ngay).slice(5,7)}-{(exportbill.ngay).slice(0,4)}</p>
        </div>

        <div className="exportbill_item_element">
        <p>{exportbill.manv.hoten}</p>
        </div>

        <div className="exportbill_item_element">
        <p>{exportbill.manv.madaily.tendl}</p>
        </div>
         
        <div className="exportbill_item_element">
        <p>{exportbill.makho.tenkho}</p>
        </div>

        <div className="exportbill_item_element">
                  <p>{
                      Format(onLoadTotal())
                  }   
                      </p>
                  </div>
      
                  <div style={{flex:0.6}} className="exportbill_item_element">
                    {/* <button onClick={() => ViewDetailImportBill(importbill)}> <GrView/></button> */}
                    <button onClick={() => {
                            setDetailExport(!detailexport)
                    }}> <GrView/></button>
            </div>
      </div>
      <div>
        
           {
             detailexport  ? <DetailExportBill key={exportbill._id}  exportbill={exportbill}/> : <></>
           }
          </div>
      </div>
    )
    function onLoadTotal() {
      var totalcost = 0;
      exportbill.ctpx.map(epbill => {
  totalcost+= epbill.giaxuat*epbill.soluong;
  })
  return totalcost;
    }
}

export default ExportBillItem;

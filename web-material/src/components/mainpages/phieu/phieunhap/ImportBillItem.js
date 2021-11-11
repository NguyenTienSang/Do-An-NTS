import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaUserEdit} from 'react-icons/fa';
import {GrView} from 'react-icons/gr';
import {BiHide} from 'react-icons/bi';
import DetailImportBill from './DetailImportBill';

function ImportBillItem({importbill,stt}) {

    const [detailimport,setDetailImport] = useState(false);

    const Format = (number) => {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
  }

  console.log('phiếu nhập : ',importbill);
    return (
      <div>
        <div className="importbill_item">
                  <div style={{flex:0.5}} className="importbill_item_element">
                  <p>{stt+1}</p>
                  </div>
                  <div className="importbill_item_element">
                  <p>{importbill.tenpn}</p>
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

                  <div className="importbill_item_element">
                  <p>{importbill.makho.tenkho}</p>
                  </div>
                  
                  <div className="importbill_item_element">
                  <p>{
                     Format(onLoadTotal())
                  }   
                      </p>
                  </div>
                    <div style={{flex:0.6}} className="importbill_item_element">
                    {/* <button onClick={() => ViewDetailImportBill(importbill)}> <GrView/></button> */}
                    <button onClick={() => {
                            setDetailImport(!detailimport)
                    }}>{detailimport ? <GrView/> : <BiHide/>} </button>
                    </div>
          </div>
          <div>
        
           {
             detailimport  ? <DetailImportBill key={importbill._id}  importbill={importbill}/> : <></>
           }
          </div>
      </div>
      
    )
    function onLoadTotal() {
      var totalcost = 0;
      importbill.ctpn.map(ipbill => {
  totalcost+= ipbill.gianhap*ipbill.soluong;
  })
  return totalcost;
    }
     
}

export default ImportBillItem;

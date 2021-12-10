import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { BsEyeSlash } from "react-icons/bs";
import DetailImportBill from "./DetailImportBill";

function ImportBillItem({ importbill, stt }) {
  const [detailimport, setDetailImport] = useState(false);

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" +
        String(number)
          .replace(/(.)(?=(\d{3})+$)/g, "$1.")
          .slice(2) +
        " VND"
      );
  };
  // console.log('phiếu nhập : ',importbill);
  return (
    <div>
      <div className="importbill_item">
        <div style={{ width: "70px" }} className="importbill_item_element">
          <p>{stt + 1}</p>
        </div>
        <div style={{ width: "160px" }} className="importbill_item_element">
          <p>{importbill._id}</p>
        </div>
        <div style={{ flex: 1 }} className="importbill_item_element">
          <p>
            {importbill.ngay.slice(8, 10)}-{importbill.ngay.slice(5, 7)}-
            {importbill.ngay.slice(0, 4)}
          </p>
        </div>

        <div style={{ flex: 1 }} className="importbill_item_element">
          <p>{importbill.manv._id}</p>
        </div>

        <div style={{ flex: 1 }} className="importbill_item_element">
          <p>{importbill.manv.madaily.tendl}</p>
        </div>

        <div style={{ flex: 1 }} className="importbill_item_element">
          <p>{importbill.makho.tenkho}</p>
        </div>

        <div style={{ flex: 1 }} className="importbill_item_element">
          <p>{Format(onLoadTotal())}</p>
        </div>
        <div style={{ flex: 1 }} className="importbill_item_element">
          {/* <button onClick={() => ViewDetailImportBill(importbill)}> <GrView/></button> */}
          <button
            onClick={() => {
              setDetailImport(!detailimport);
            }}
          >
            {detailimport ? (
              <AiOutlineEye
                style={{ fontSize: 36, color: "rgb(26, 148, 255)" }}
              />
            ) : (
              <BsEyeSlash style={{ fontSize: 36, color: "red" }} />
            )}{" "}
          </button>
        </div>
      </div>
      <div>
        {detailimport ? (
          <DetailImportBill key={importbill._id} importbill={importbill} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
  function onLoadTotal() {
    var totalcost = 0;
    importbill?.ctpn?.map((ipbill) => {
      totalcost += ipbill.gianhap * ipbill.soluong;
    });
    return totalcost;
  }
}

export default ImportBillItem;

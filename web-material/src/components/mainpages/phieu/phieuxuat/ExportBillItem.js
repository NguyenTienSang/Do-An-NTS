import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { BsEyeSlash } from "react-icons/bs";
import DetailExportBill from "./DetailExportBill";

function ExportBillItem({ exportbill, stt }) {
  const [detailexport, setDetailExport] = useState(false);

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  return (
    <div>
      <div className="exportbill_item">
        <div style={{ width: "70px" }} className="exportbill_item_element">
          <p>{stt + 1}</p>
        </div>
        <div style={{ width: "160px" }} className="exportbill_item_element">
          <p>{exportbill._id}</p>
        </div>
        <div style={{ flex: 1 }} className="exportbill_item_element">
          <p>
            {exportbill.ngay.slice(8, 10)}-{exportbill.ngay.slice(5, 7)}-
            {exportbill.ngay.slice(0, 4)}
          </p>
        </div>

        <div style={{ flex: 1 }} className="exportbill_item_element">
          <p>{exportbill.manv._id}</p>
        </div>

        <div style={{ flex: 1 }} className="exportbill_item_element">
          <p>{exportbill.manv.madaily.tendl}</p>
        </div>

        <div style={{ flex: 1 }} className="exportbill_item_element">
          <p>{exportbill.makho.tenkho}</p>
        </div>

        <div style={{ flex: 1 }} className="exportbill_item_element">
          <p>{Format(onLoadTotal())}</p>
        </div>

        <div style={{ flex: 1 }} className="exportbill_item_element">
          {/* <button onClick={() => ViewDetailImportBill(importbill)}> <GrView/></button> */}
          <button
            onClick={() => {
              setDetailExport(!detailexport);
            }}
          >
            {" "}
            {detailexport ? (
              <AiOutlineEye
                style={{ fontSize: 36, color: "rgb(26, 148, 255)" }}
              />
            ) : (
              <BsEyeSlash style={{ fontSize: 36, color: "red" }} />
            )}
          </button>
        </div>
      </div>
      <div>
        {detailexport ? (
          <DetailExportBill key={exportbill._id} exportbill={exportbill} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
  function onLoadTotal() {
    var totalcost = 0;
    exportbill?.ctpx?.map((epbill) => {
      totalcost += epbill.giaxuat * epbill.soluong;
    });
    return totalcost;
  }
}

export default ExportBillItem;

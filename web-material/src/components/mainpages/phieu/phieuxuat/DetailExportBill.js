import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import ExportBillItem from "./ExportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";

function DetailExportBill(exportbill) {
  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  return (
    <div className="detail-exportbill">
      <div className="title-detail">
        <p>Chi Tiết Phiếu Xuất {exportbill.exportbill._id}</p>
      </div>
      <div className="header-detail-exportbill">
        <p style={{ flex: 0.5 }}>STT</p>
        <p>Tên VT</p>
        <p>Hình Ảnh</p>
        <p>Giá Xuất</p>
        <p>Số Lượng</p>
        <p>Số Tiền</p>
      </div>
      {console.log("detailexportbill : ", exportbill.exportbill.ctpx[0])}
      {exportbill.exportbill.ctpx.map((item, stt) => {
        return (
          <div className="item-detail">
            <div className="item-detail-element" style={{ flex: 0.5 }}>
              {stt + 1}
            </div>
            <div className="item-detail-element">{item.mavt.tenvt}</div>
            <div className="item-detail-element">
              <img
                width="80"
                height="40"
                src={item.mavt.images.url}
                alt=""
              ></img>
            </div>
            <div className="item-detail-element">{Format(item.giaxuat)}</div>
            <div className="item-detail-element">{item.soluong}</div>
            <div className="item-detail-element">
              {Format(item.giaxuat * item.soluong)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DetailExportBill;

import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import ImportBillItem from "./ImportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";

function DetailImportBill(importbill) {
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

  return (
    <div className="detail-importbill">
      <div className="title-detail">
        <p>Chi Tiết Phiếu Nhập {importbill.importbill._id}</p>
      </div>
      <div className="header-detail-importbill">
        <p style={{ flex: 0.5 }}>STT</p>
        <p>Tên VT</p>
        <p>Hình Ảnh</p>
        <p>Giá Nhập</p>
        <p>Số Lượng</p>
        <p>Tổng Tiền</p>
      </div>
      {console.log("detailimportbill : ", importbill.importbill.ctpn[0])}
      {importbill.importbill.ctpn.map((item, stt) => {
        return (
          <div className="item-detail">
            <div className="item-detail-element" style={{ flex: 0.5 }}>
              {stt + 1}
            </div>
            <div className="item-detail-element">{item.mavt.tenvt}</div>
            <div className="item-detail-element" style={{ width: "160px" }}>
              <img src={item.mavt.images.url} alt=""></img>
            </div>
            <div className="item-detail-element">{Format(item.gianhap)}</div>
            <div className="item-detail-element">{item.soluong}</div>
            <div className="item-detail-element">
              {Format(item.gianhap * item.soluong)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DetailImportBill;

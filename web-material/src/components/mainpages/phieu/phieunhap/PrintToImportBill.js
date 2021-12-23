import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import { FiPrinter } from "react-icons/fi";
import moment from "moment";
// import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
export default function PrintToImportBill() {
  const state = useContext(GlobalState);
  const [importbills] = state.importbillAPI.importbills;
  const [importbill, setImportBill] = useState();
  const params = useParams();

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  useEffect(async () => {
    if (params._id) {
      importbills.forEach((importbill) => {
        if (importbill._id === params._id) {
          setImportBill(importbill);
          console.log("setImportBill(importbill) : ", importbill);
        }
      });
    }
  }, [params._id, importbills]);

  const onTotalBill = (importbill) => {
    var totalcost = 0;
    importbill?.ctpn?.map((ipbill) => {
      totalcost += ipbill.gianhap * ipbill.soluong;
    });
    return totalcost;
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <button
        onClick={handlePrint}
        className="print_button"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <FiPrinter style={{ fontSize: 36, color: "rgb(26, 148, 255)" }} />
      </button>
      <div ref={componentRef} className="print_to_importbill">
        <p style={{ display: "flex", justifyContent: "center" }}>
          Thông Tin Phiếu Nhập : {importbill?._id}
        </p>
        {importbill ? (
          <>
            <div className="header_bill">
              <div className="header_bill__item">
                <p>Mã NV : {importbill.manv._id}</p>
                <p>Họ tên : {importbill.manv.hoten}</p>
              </div>
              <div className="header_bill__item">
                <p>{importbill.manv.madaily.tendl}</p>
                <p>
                  Ngày lập : {importbill.ngay.slice(8, 10)}-
                  {importbill.ngay.slice(5, 7)}-{importbill.ngay.slice(0, 4)}
                </p>
              </div>

              <div className="header_bill__item">
                <p>Giới tính : {importbill.manv.gioitinh}</p>
                <p>SĐT : {importbill.manv.sodienthoai}</p>
              </div>

              <div className="header_bill__item">
                <p>Họ tên kh : {importbill.hotenkh}</p>
                <p>SĐT KH : {importbill.sodienthoaikh}</p>
              </div>
            </div>
            <div className="title_header__detail">
              <p style={{ flex: 0.5 }}>STT</p>
              <p style={{ flex: 1 }}>Tên VT</p>
              <p style={{ flex: 1 }}>Giá Nhập</p>
              <p style={{ flex: 1 }}>Số Lượng</p>
              <p style={{ flex: 1 }}>Tổng Tiền</p>
            </div>
            {importbill.ctpn.map((item, stt) => {
              return (
                <div className="item-detail">
                  <div className="item-detail-element" style={{ flex: 0.5 }}>
                    {stt + 1}
                  </div>
                  <div className="item-detail-element" style={{ flex: 1 }}>
                    {item.mavt.tenvt}
                  </div>

                  <div className="item-detail-element" style={{ flex: 1 }}>
                    {Format(item.gianhap)}
                  </div>
                  <div className="item-detail-element" style={{ flex: 1 }}>
                    {item.soluong}
                  </div>
                  <div className="item-detail-element" style={{ flex: 1 }}>
                    {Format(item.gianhap * item.soluong)}
                  </div>
                </div>
              );
            })}
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                borderTop: "1px solid #999",
                backgroundColor: "rgb(26, 148, 255)",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
                color: "#fff",
                height: "36px",
                alignItems: "center",
              }}
            >
              Tổng cộng : {Format(onTotalBill(importbill))}
            </p>
          </>
        ) : null}
      </div>
    </>
  );
}

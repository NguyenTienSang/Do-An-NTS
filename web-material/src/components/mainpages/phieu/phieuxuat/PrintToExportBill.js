import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import { FiPrinter } from "react-icons/fi";
import moment from "moment";
// import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
export default function PrintToImportBill() {
  const state = useContext(GlobalState);
  const [exportbills] = state.exportbillAPI.exportbills;
  const [exportbill, setExportBill] = useState();
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
      exportbills.forEach((exportbill) => {
        if (exportbill._id === params._id) {
          setExportBill(exportbill);
          console.log("setImportBill(exportbill) : ", exportbill);
        }
      });
    }
  }, [params._id, exportbills]);

  const onTotalBill = (exportbill) => {
    var totalcost = 0;
    exportbill?.ctpx?.map((exbill) => {
      totalcost += exbill.giaxuat * exbill.soluong;
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
      <div ref={componentRef} className="print_to_exportbill">
        <p style={{ display: "flex", justifyContent: "center" }}>
          Thông Tin Phiếu Xuất : {exportbill?._id}
        </p>
        {exportbill ? (
          <>
            <div className="header_bill">
              <div className="header_bill__item">
                <p>Mã NV : {exportbill.manv._id}</p>
                <p>Họ tên : {exportbill.manv.hoten}</p>
              </div>
              <div className="header_bill__item">
                <p>{exportbill.manv.madaily.tendl}</p>
                <p>
                  Ngày lập : {exportbill.ngay.slice(8, 10)}-
                  {exportbill.ngay.slice(5, 7)}-{exportbill.ngay.slice(0, 4)}
                </p>
              </div>

              <div className="header_bill__item">
                <p>Giới tính : {exportbill.manv.gioitinh}</p>
                <p>SĐT : {exportbill.manv.sodienthoai}</p>
              </div>

              <div className="header_bill__item">
                <p>Họ tên kh : {exportbill.hotenkh}</p>
                <p>SĐT KH : {exportbill.sodienthoaikh}</p>
              </div>
            </div>
            <div className="title_header__detail">
              <p style={{ flex: 0.5 }}>STT</p>
              <p style={{ flex: 1 }}>Tên VT</p>
              <p style={{ flex: 1 }}>Giá Xuất</p>
              <p style={{ flex: 1 }}>Số Lượng</p>
              <p style={{ flex: 1 }}>Tổng Tiền</p>
            </div>
            {exportbill?.ctpx?.map((item, stt) => {
              return (
                <div className="item-detail">
                  <div className="item-detail-element" style={{ flex: 0.5 }}>
                    {stt + 1}
                  </div>
                  <div className="item-detail-element" style={{ flex: 1 }}>
                    {item.mavt.tenvt}
                  </div>

                  <div className="item-detail-element" style={{ flex: 1 }}>
                    {Format(item.giaxuat)}
                  </div>
                  <div className="item-detail-element" style={{ flex: 1 }}>
                    {item.soluong}
                  </div>
                  <div className="item-detail-element" style={{ flex: 1 }}>
                    {Format(item.giaxuat * item.soluong)}
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
              Tổng cộng : {Format(onTotalBill(exportbill))}
            </p>
          </>
        ) : (
          <div>KHông có</div>
        )}
      </div>
    </>
  );
}

import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { GlobalState } from "../../../../GlobalState";
import ImportBillItem from "./ImportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import { FaFileExport } from "react-icons/fa";

import Pagination from "../../../common/Pagination";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function ImportBill() {
  const state = useContext(GlobalState);
  const inforuser = JSON.parse(localStorage.getItem("inforuser"));

  const [importbills] = state.importbillAPI.importbills;
  const [callback, setCallback] = state.importbillAPI.callback;

  const [listImportBillSearch, setListImportBillSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCallback(!callback);
  }, []);

  //============ XUẤT FILE ==============
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const DATE = moment(new Date()).format("DD-MM-YYYY");
  const customData = (dataImport) => {
    let dataExport = [];

    let count = -1;
    for (var i = 0; i < dataImport.listImportBillSearch.length; i++) {
      count++;
      dataExport[count] = {};
      dataExport[count] = {
        STT: i + 1,
        ID: dataImport.listImportBillSearch[i]._id,
        "Ngày Lập": `${dataImport.listImportBillSearch[i].ngay.slice(
          8,
          10
        )}-${dataImport.listImportBillSearch[i].ngay.slice(
          5,
          7
        )}-${dataImport.listImportBillSearch[i].ngay.slice(0, 4)}`,
        "Id Nhân Viên": dataImport.listImportBillSearch[i].manv._id,
        "Đại Lý": dataImport.listImportBillSearch[i].manv.madaily.tendl,
        Kho: dataImport.listImportBillSearch[i].makho.tenkho,
        "Tổng Cộng": onLoadTotal(dataImport.listImportBillSearch[i]),
      };

      count++;
      dataExport[count] = {
        STT: "STT",
        ID: "Tên Vật Tư",
        "Ngày Lập": "Giá nhập",
        "Id Nhân Viên": "Số lượng",
        "Đại Lý": "Tổng tiền",
        Kho: "",
        "Tổng Cộng": "",
      };

      count++;

      for (var j = 0; j < dataImport.listImportBillSearch[i].ctpn.length; j++) {
        dataExport[count] = {
          STT: j + 1,
          ID: dataImport.listImportBillSearch[i].ctpn[j].mavt.tenvt,
          "Ngày Lập": Format(
            dataImport.listImportBillSearch[i].ctpn[j].gianhap
          ),
          "Id Nhân Viên": dataImport.listImportBillSearch[i].ctpn[j].soluong,
          "Đại Lý": Format(
            dataImport.listImportBillSearch[i].ctpn[j].gianhap *
              dataImport.listImportBillSearch[i].ctpn[j].soluong
          ).toString(),
          Kho: "",
          "Tổng Cộng": "",
        };
        count++;
      }
    }

    return dataExport;
  };

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  const onLoadTotal = (detailimportbill) => {
    var totalcost = 0;
    detailimportbill?.ctpn?.map((ipbill) => {
      totalcost += ipbill.gianhap * ipbill.soluong;
    });
    return Format(totalcost);
  };

  const exportToCSV = (csvData, fileName) => {
    // customData(csvData);
    const ws = XLSX.utils.json_to_sheet(customData(csvData));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  //============================================

  const [currentPage, setCurrentPage] = useState(1);
  const [importbillsPerPage] = useState(10);

  // Get current posts
  const indexOfLastImportbill = currentPage * importbillsPerPage;
  const indexOfFirstImportbill = indexOfLastImportbill - importbillsPerPage;

  // Lấy ra danh sách kho có trong từ khóa search
  useEffect(() => {
    if (inforuser.role === "user") {
      setListImportBillSearch(
        importbills?.filter((importbill) => {
          if (
            searchTerm === "" &&
            inforuser.madaily._id.toString() ===
              importbill.manv.madaily._id.toString()
          ) {
            return importbill;
          } else if (
            (importbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${importbill.ngay.slice(8, 10)}-${importbill.ngay.slice(
                5,
                7
              )}-${importbill.ngay.slice(0, 4)}`.includes(
                searchTerm.toLowerCase()
              ) ||
              importbill.manv._id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              importbill.manv.madaily.tendl
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              importbill.makho.tenkho
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            inforuser.madaily._id.toString() ===
              importbill.manv.madaily._id.toString()
          ) {
            return importbill;
          }
        })
      );
    } else {
      setListImportBillSearch(
        importbills?.filter((importbill) => {
          if (searchTerm === "") {
            return importbill;
          } else if (
            importbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${importbill.ngay.slice(8, 10)}-${importbill.ngay.slice(
              5,
              7
            )}-${importbill.ngay.slice(0, 4)}`.includes(
              searchTerm.toLowerCase()
            ) ||
            importbill.manv._id
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            importbill.manv.madaily.tendl
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            importbill.makho.tenkho
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ) {
            console.log("importbill.ngay : ", importbill.ngay.slice(8, 10));
            return importbill;
          }
        })
      );
    }

    setCurrentPage(1); //Khởi tạo lại trang hiện tại là 1
  }, [searchTerm, importbills]);

  //Gán list vào trang hiện tại

  const currentImportbills = listImportBillSearch?.slice(
    indexOfFirstImportbill,
    indexOfLastImportbill
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="layout">
      <div className="layout-first">
        <Header />
      </div>
      <div className="layout-second">
        <NavBar />
        <div className="importbills">
          <div className="header-title">
            <div className="row search-importbill">
              <input
                type="text"
                name="id"
                placeholder="Nhập từ khóa tìm kiếm"
                id="inputsearch"
                required
                autoComplete="off"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </div>

            <div className="title-tab">
              <h2 style={{ display: "flex", alignItems: "center" }}>
                <GiExplosiveMaterials style={{ marginRight: "5px" }} />
                Danh Sách Phiếu Nhập
              </h2>
            </div>

            <button className="add-item">
              <Link to={"/lapphieunhap"} style={{ color: "#fff" }}>
                {" "}
                <BiBookAdd style={{ marginRight: "5px", marginTop: "5px" }} />
                Lập Phiếu Nhập
              </Link>
            </button>

            <button
              className="add-item"
              onClick={() => {
                exportToCSV(
                  { listImportBillSearch },
                  `DanhSachPhieuNhap_${DATE}`
                );
              }}
            >
              <FaFileExport style={{ marginRight: "5px", marginTop: "5px" }} />
              Xuất File
            </button>
          </div>
          <div className="header_list">
            <p style={{ width: "70px" }}>STT</p>
            <p style={{ width: "160px" }}>ID</p>
            <p style={{ flex: 1 }}>Ngày lập</p>
            <p style={{ flex: 1 }}>Nhân viên</p>
            <p style={{ flex: 1 }}>Đại lý</p>
            <p style={{ flex: 1 }}>Kho</p>
            <p style={{ flex: 1 }}>Tổng Cộng</p>
            <p style={{ flex: 1 }}>Chức năng</p>
          </div>
          {currentImportbills?.map((importbill, index) => {
            return (
              <>
                <ImportBillItem
                  key={index}
                  importbill={importbill}
                  stt={(currentPage - 1) * importbillsPerPage + index}
                />
              </>
            );
          })}
          {listImportBillSearch.length > 0 ? (
            <Pagination
              itemsPerpage={importbillsPerPage}
              totalItems={listImportBillSearch?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "18px",
                border: "1px solid #999",
                borderTop: "none",
              }}
            >
              Chưa có phiếu nhập
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImportBill;

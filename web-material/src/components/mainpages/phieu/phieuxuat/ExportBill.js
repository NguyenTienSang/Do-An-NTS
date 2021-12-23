import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { GlobalState } from "../../../../GlobalState";
import ExportBillItem from "./ExportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import { FaFileExport } from "react-icons/fa";
import Pagination from "../../../common/Pagination";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function ExporttBill() {
  const state = useContext(GlobalState);
  const inforuser = JSON.parse(localStorage.getItem("inforuser"));
  const [exportbills] = state.exportbillAPI.exportbills;
  const [callback, setCallback] = state.exportbillAPI.callback;
  const [listExportBillSearch, setListExportBillSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [exportbillsPerPage] = useState(10);

  useEffect(() => {
    setCallback(!callback);
  }, []);
  // Get current posts
  const indexOfLastExportbill = currentPage * exportbillsPerPage;
  const indexOfFirstExportbill = indexOfLastExportbill - exportbillsPerPage;

  //============ XUẤT FILE ==============
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const DATE = moment(new Date()).format("DD-MM-YYYY");
  const customData = (dataImport) => {
    let dataExport = [];

    let count = -1;
    for (var i = 0; i < dataImport.listExportBillSearch.length; i++) {
      count++;
      dataExport[count] = {};
      dataExport[count] = {
        STT: i + 1,
        ID: dataImport.listExportBillSearch[i]._id,
        "Ngày Lập": `${dataImport.listExportBillSearch[i].ngay.slice(
          8,
          10
        )}-${dataImport.listExportBillSearch[i].ngay.slice(
          5,
          7
        )}-${dataImport.listExportBillSearch[i].ngay.slice(0, 4)}`,
        "Id Nhân Viên": dataImport.listExportBillSearch[i].manv._id,
        "Đại Lý": dataImport.listExportBillSearch[i].manv.madaily.tendl,
        Kho: dataImport.listExportBillSearch[i].makho.tenkho,
        "Tổng Cộng": onLoadTotal(dataImport.listExportBillSearch[i]),
      };

      count++;
      dataExport[count] = {
        STT: "STT",
        ID: "Tên Vật Tư",
        "Ngày Lập": "Giá xuất",
        "Id Nhân Viên": "Số lượng",
        "Đại Lý": "Tổng tiền",
        Kho: "",
        "Tổng Cộng": "",
      };

      count++;

      for (var j = 0; j < dataImport.listExportBillSearch[i].ctpx.length; j++) {
        dataExport[count] = {
          STT: j + 1,
          ID: dataImport.listExportBillSearch[i].ctpx[j].mavt.tenvt,
          "Ngày Lập": Format(
            dataImport.listExportBillSearch[i].ctpx[j].giaxuat
          ),
          "Id Nhân Viên": dataImport.listExportBillSearch[i].ctpx[j].soluong,
          "Đại Lý": Format(
            dataImport.listExportBillSearch[i].ctpx[j].giaxuat *
              dataImport.listExportBillSearch[i].ctpx[j].soluong
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

  const onLoadTotal = (detailexportbill) => {
    var totalcost = 0;
    detailexportbill?.ctpx?.map((exbill) => {
      totalcost += exbill.giaxuat * exbill.soluong;
    });
    return Format(totalcost);
  };

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(customData(csvData));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  //============================================

  // Lấy ra danh sách kho có trong từ khóa search
  useEffect(() => {
    if (inforuser.role === "user") {
      setListExportBillSearch(
        exportbills?.filter((exportbill) => {
          if (
            searchTerm === "" &&
            inforuser.madaily._id.toString() ===
              exportbill.manv.madaily._id.toString()
          ) {
            return exportbill;
          } else if (
            (exportbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${exportbill.ngay.slice(8, 10)}-${exportbill.ngay.slice(
                5,
                7
              )}-${exportbill.ngay.slice(0, 4)}`.includes(
                searchTerm.toLowerCase()
              ) ||
              exportbill.manv._id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              exportbill.manv.madaily.tendl
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              exportbill.makho.tenkho
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            inforuser.madaily._id.toString() ===
              exportbill.manv.madaily._id.toString()
          ) {
            return exportbill;
          }
        })
      );
    } else {
      setListExportBillSearch(
        exportbills?.filter((exportbill) => {
          if (searchTerm === "") {
            return exportbill;
          } else if (
            (exportbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${exportbill.ngay.slice(8, 10)}-${exportbill.ngay.slice(
                5,
                7
              )}-${exportbill.ngay.slice(0, 4)}`.includes(
                searchTerm.toLowerCase()
              ) ||
              exportbill.manv._id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              exportbill.manv.madaily.tendl
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              exportbill.makho.tenkho
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            inforuser.madaily._id.toString() ===
              exportbill.manv.madaily._id.toString()
          ) {
            return exportbill;
          }
        })
      );
    }

    setCurrentPage(1); //Khởi tạo lại trang hiện tại là 1
  }, [searchTerm, exportbills]);

  //Gán list vào trang hiện tại
  const currentExportbills = listExportBillSearch?.slice(
    indexOfFirstExportbill,
    indexOfLastExportbill
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
        <div className="exportbills">
          <div className="header-title">
            <div className="row search-exportbill">
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
                Danh Sách Phiếu Xuất
              </h2>
            </div>

            <button className="add-item">
              <Link to={"/lapphieuxuat"} style={{ color: "#fff" }}>
                {" "}
                <BiBookAdd style={{ marginRight: "5px", marginTop: "5px" }} />
                Lập Phiếu Xuất
              </Link>
            </button>

            <button
              className="add-item"
              onClick={() => {
                exportToCSV(
                  { listExportBillSearch },
                  `DanhSachPhieuXuat_${DATE}`
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
            <p style={{ flex: 1 }}>Tổng Tiền</p>
            <p style={{ flex: 1 }}>Chi tiết</p>
          </div>
          {currentExportbills.map((exportbill, index) => {
            return (
              <>
                <ExportBillItem
                  key={exportbill._id}
                  exportbill={exportbill}
                  stt={(currentPage - 1) * exportbillsPerPage + index}
                />
              </>
            );
          })}
          {listExportBillSearch.length > 0 ? (
            <Pagination
              itemsPerpage={exportbillsPerPage}
              totalItems={listExportBillSearch?.length}
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
              Chưa có phiếu xuất
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExporttBill;

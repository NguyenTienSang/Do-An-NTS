import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ImportBillItem from "../phieu/phieunhap/ImportBillItem";
import ExportBillItem from "../phieu/phieuxuat/ExportBillItem";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import moment from "moment";
import DatePicker from "react-datepicker";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { FaFileExport } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { AiOutlineFileSearch } from "react-icons/ai";
import Pagination from "../../common/Pagination";

import "react-datepicker/dist/react-datepicker.css";

function StatisticBill() {
  const state = useContext(GlobalState);
  const [importbills] = state.importbillAPI.importbills;
  const [searchTerm, setSearchTerm] = useState("");
  const [manv, setMaNV] = useState("");
  const [optionbill, setOptionBill] = useState("PhieuNhap");
  const [billsfilter, setBillsFilter] = useState([]);
  const [listStatisticBillSearch, setListStatisticBillSearch] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openalert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");

  //============ XUẤT FILE ==============
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const DATE = moment(new Date()).format("DD-MM-YYYY");
  const customData = (dataImport) => {
    let dataExport = [];

    let count = -1;
    for (var i = 0; i < dataImport.billsfilter.length; i++) {
      count++;
      dataExport[count] = {};
      dataExport[count] = {
        STT: i + 1,
        ID: dataImport.billsfilter[i]._id,
        "Ngày Lập": `${dataImport.billsfilter[i].ngay.slice(
          8,
          10
        )}-${dataImport.billsfilter[i].ngay.slice(
          5,
          7
        )}-${dataImport.billsfilter[i].ngay.slice(0, 4)}`,
        "Id Nhân Viên": dataImport.billsfilter[i].manv._id,
        "Đại Lý": dataImport.billsfilter[i].manv.madaily.tendl,
        Kho: dataImport.billsfilter[i].makho.tenkho,
        "Tổng Cộng": onLoadTotal(dataImport.billsfilter[i]),
      };

      count++;
      dataExport[count] = {
        STT: "STT",
        ID: "Tên Vật Tư",
        "Ngày Lập": optionbill === "PhieuNhap" ? "Giá nhập" : "Giá xuất",
        "Id Nhân Viên": "Số lượng",
        "Đại Lý": "Tổng tiền",
        Kho: "",
        "Tổng Cộng": "",
      };

      count++;

      if (optionbill === "PhieuNhap") {
        for (var j = 0; j < dataImport.billsfilter[i].ctpn.length; j++) {
          dataExport[count] = {
            STT: j + 1,
            ID: dataImport.billsfilter[i].ctpn[j].mavt.tenvt,
            "Ngày Lập": Format(dataImport.billsfilter[i].ctpn[j].gianhap),
            "Id Nhân Viên": dataImport.billsfilter[i].ctpn[j].soluong,
            "Đại Lý": Format(
              dataImport.billsfilter[i].ctpn[j].gianhap *
                dataImport.billsfilter[i].ctpn[j].soluong
            ).toString(),
            Kho: "",
            "Tổng Cộng": "",
          };
          count++;
        }
      } else {
        for (var j = 0; j < dataImport.billsfilter[i].ctpx.length; j++) {
          dataExport[count] = {
            STT: j + 1,
            ID: dataImport.billsfilter[i].ctpx[j].mavt.tenvt,
            "Ngày Lập": Format(dataImport.billsfilter[i].ctpx[j].giaxuat),
            "Id Nhân Viên": dataImport.billsfilter[i].ctpx[j].soluong,
            "Đại Lý": Format(
              dataImport.billsfilter[i].ctpx[j].giaxuat *
                dataImport.billsfilter[i].ctpx[j].soluong
            ).toString(),
            Kho: "",
            "Tổng Cộng": "",
          };
          count++;
        }
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

  const filterbill = async () => {
    if (manv === "") {
      // alert('Vui lòng nhập mã nhân viên')
      setMessage("Vui lòng nhập mã nhân viên");
      setOpenAlert(true);
    } else if (startDate.getTime() > endDate.getTime()) {
      // alert('Thời gian không hợp lệ')
      setMessage("Thời gian không hợp lệ");
      setOpenAlert(true);
    } else {
      const startDateFilter = moment(startDate).format("YYYY-MM-DD");
      const endDateFilter = moment(endDate).format("YYYY-MM-DD");
      console.log("startDateFilter : ", startDateFilter);
      console.log("endDateFilter : ", endDateFilter);
      const res = await axios.post("/api/thongke/phieunhapnhanvien", {
        manv,
        startDateFilter,
        endDateFilter,
        optionbill,
      });
      console.log("res.data : ", res.data);
      setBillsFilter(res.data);
    }
  };

  //================= PHÂN TRANG ======================
  const [currentPage, setCurrentPage] = useState(1);
  const [statisticbillsPerPage] = useState(10);

  // Get current posts
  const indexOfLastImportbill = currentPage * statisticbillsPerPage;
  const indexOfFirstImportbill = indexOfLastImportbill - statisticbillsPerPage;

  // Lấy ra danh sách kho có trong từ khóa search
  useEffect(() => {
    setListStatisticBillSearch(
      billsfilter?.filter((importbill) => {
        if (searchTerm === "") {
          return importbill;
        } else if (
          importbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          return importbill;
        }
      })
    );
    setCurrentPage(1); //Khởi tạo lại trang hiện tại là 1
  }, [searchTerm, billsfilter]);

  //Gán list vào trang hiện tại

  const currentImportbills = listStatisticBillSearch?.slice(
    indexOfFirstImportbill,
    indexOfLastImportbill
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //===================================================

  return (
    <>
      <div className="layout">
        <div className="layout-first">
          <Header />
        </div>
        <div className="layout-second">
          <NavBar />
          <div className="statistic_importbills">
            <div className="filter-container">
              <div className="row search-importbills">
                <label>ID NV </label>
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập ID nhân viên"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  onChange={(event) => {
                    setMaNV(event.target.value);
                    // setSearchTerm(event.target.value);
                    // document.getElementById("list-material").style.display = "block";
                  }}
                />
              </div>

              <div className="filter-date">
                <div className="filter-date-component">
                  <label>Từ:</label>
                  <DatePicker
                    className="datepicker"
                    selected={startDate}
                    minDate={new Date("01-01-2010")}
                    maxDate={new Date()}
                    onChangeRaw={(e) => e.preventDefault()}
                    dateFormat="dd-MM-yyyy"
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    // inputs
                    onChange={(date) => {
                      setStartDate(date);
                    }}
                  />
                </div>
                <div className="filter-date-component">
                  <label>Đến:</label>
                  <DatePicker
                    className="datepicker"
                    selected={endDate}
                    dateFormat="dd-MM-yyyy"
                    onChangeRaw={(e) => e.preventDefault()}
                    minDate={new Date("01-01-2010")}
                    maxDate={new Date()}
                    onChange={(date) => {
                      setEndDate(date);
                    }}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>

              <select
                className="select_bill"
                // value={optionbill}
                defaultValue={"PhieuNhap"}
                onChange={(event) => {
                  setOptionBill(event.target.value);
                  setBillsFilter([]);
                  setListStatisticBillSearch([]);
                }}
              >
                <option value="PhieuNhap" selected>
                  Phiếu Nhập
                </option>
                <option value="PhieuXuat">Phiếu Xuất</option>
              </select>

              <button onClick={filterbill} className="statistic-button">
                {" "}
                <AiOutlineFileSearch />
              </button>
            </div>

            <div className="header-title">
              <div className="row search-importbills">
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập từ khóa tìm kiếm"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    // document.getElementById("list-material").style.display = "block";
                  }}
                />
              </div>
              <div className="title-tab statistic-bill-employee">
                <h2 style={{ display: "flex", alignItems: "center" }}>
                  <GiExplosiveMaterials style={{ marginRight: "5px" }} />
                  Danh Sách Phiếu {optionbill === "PhieuNhap" ? "Nhập" : "Xuất"}
                </h2>
                <button
                  className="add-item"
                  onClick={() => {
                    if (billsfilter.length > 0) {
                      exportToCSV(
                        { billsfilter },
                        `ThongKePhieuNhanVien_${DATE}`
                      );
                    } else {
                      setMessage("Dữ liệu đang trống không thể xuất");
                      setOpenAlert(true);
                    }
                  }}
                >
                  <FaFileExport
                    style={{ marginRight: "5px", marginTop: "5px" }}
                  />
                  Xuất File
                </button>
              </div>
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

            {optionbill === "PhieuNhap"
              ? listStatisticBillSearch?.map((importbill, index) => {
                  return (
                    <>
                      <ImportBillItem
                        key={importbill._id}
                        importbill={importbill}
                        stt={index}
                      />
                    </>
                  );
                })
              : listStatisticBillSearch?.map((exportbill, index) => {
                  return (
                    <>
                      <ExportBillItem
                        key={exportbill._id}
                        exportbill={exportbill}
                        stt={index}
                      />
                    </>
                  );
                })}

            {listStatisticBillSearch.length > 0 ? (
              <Pagination
                itemsPerpage={statisticbillsPerPage}
                totalItems={listStatisticBillSearch?.length}
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
                {optionbill === "PhieuNhap" ? (
                  <div>Chưa có phiếu nhập</div>
                ) : (
                  <div>Chưa có phiếu xuất</div>
                )}
                {/*  */}
              </div>
            )}
          </div>
        </div>
      </div>

      {openalert ? (
        <div
          className="modal_container__notification modal_active"
          id="modal_container__notification"
        >
          <div className="modal__notification">
            <p className="title-notification">Thông báo</p>
            <p>{message}</p>
            <div className="option-button">
              <button
                id="add"
                onClick={() => {
                  //  document.getElementById("modal_container__notification").classList.remove("modal_active");
                  setOpenAlert(false);
                }}
              >
                OK
              </button>
              {/* <button id="close"  >Hủy</button> */}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default StatisticBill;

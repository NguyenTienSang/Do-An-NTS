import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { GlobalState } from "../../../GlobalState";
// import MaterialItem from "./MaterialItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import { FaFileExport } from "react-icons/fa";
import DatePicker from "react-datepicker";
import ExportBillItem from "../phieu/phieuxuat/ExportBillItem";
import moment from "moment";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { AiOutlineFileSearch } from "react-icons/ai";

function StatisticTurnOver() {
  const state = useContext(GlobalState);

  const [timeStatistic, setTimeStatistic] = useState(new Date());
  const [stores] = state.storeAPI.stores;

  const [madailyfilter, setMaDaiLyFilter] = useState("");
  const [dataStatistic, setDataStatistic] = useState([]);
  const [optionStatistic, setOptionStatistic] = useState("Thang");

  const [openalert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  //============ XUẤT FILE ==============
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const customData = (dataImport) => {
    let dataExport = [];
    if (optionStatistic === "Ngay") {
      let count = -1;
      for (var i = 0; i < dataImport.dataStatistic.length; i++) {
        count++;
        dataExport[count] = {};
        dataExport[count] = {
          STT: i + 1,
          ID: dataImport.dataStatistic[i]._id,
          "Ngày Lập": `${dataImport.dataStatistic[i].ngay.slice(
            8,
            10
          )}-${dataImport.dataStatistic[i].ngay.slice(
            5,
            7
          )}-${dataImport.dataStatistic[i].ngay.slice(0, 4)}`,
          "Id Nhân Viên": dataImport.dataStatistic[i].manv._id,
          "Đại Lý": dataImport.dataStatistic[i].manv.madaily.tendl,
          Kho: dataImport.dataStatistic[i].makho.tenkho,
          "Tổng Cộng": TotalCostBill(dataImport.dataStatistic[i]),
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

        for (var j = 0; j < dataImport.dataStatistic[i].ctpx.length; j++) {
          dataExport[count] = {
            STT: j + 1,
            ID: dataImport.dataStatistic[i].ctpx[j].mavt.tenvt,
            "Ngày Lập": Format(dataImport.dataStatistic[i].ctpx[j].giaxuat),
            "Id Nhân Viên": dataImport.dataStatistic[i].ctpx[j].soluong,
            "Đại Lý": Format(
              dataImport.dataStatistic[i].ctpx[j].giaxuat *
                dataImport.dataStatistic[i].ctpx[j].soluong
            ).toString(),
            Kho: "",
            "Tổng Cộng": "",
          };
          count++;
        }

        // Tổng Doanh Thu : {Format(onLoadTotal())}
      }
      dataExport[count] = {
        Kho: "Tổng Doanh Thu : ",
        "Tổng Cộng": Format(onLoadTotal()),
      };
    } else if (optionStatistic === "Thang") {
      dataExport = dataImport.dataStatistic.map((data) => ({
        Ngày: data.ngay,
        "Số Phiếu Xuất": data.sophieuxuat,
        "Tổng Tiền Xuất": Format(data.tongtienxuat),
      }));
      dataExport[dataExport.length] = {
        "Số Phiếu Xuất": "Tổng Doanh Thu : ",
        "Tổng Tiền Xuất": Format(onLoadTotal()),
      };
    } else if (optionStatistic === "Nam") {
      dataExport = dataImport.dataStatistic.map((data) => ({
        Tháng: data.thang,
        "Số Phiếu Xuất": data.sophieuxuat,
        "Tổng Tiền Xuất": Format(data.tongtienxuat),
      }));

      dataExport[dataExport.length] = {
        "Số Phiếu Xuất": "Tổng Doanh Thu : ",
        "Tổng Tiền Xuất": Format(onLoadTotal()),
      };
    }

    return dataExport;
  };

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(customData(csvData));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  //======================================

  const handlechangestore = (e) => {
    setMaDaiLyFilter(e.target.value);
    setDataStatistic([]);
  };

  const TotalCostBill = (detailexportbill) => {
    var totalcost = 0;
    detailexportbill?.ctpx?.map((exbill) => {
      totalcost += exbill.giaxuat * exbill.soluong;
    });
    return Format(totalcost);
  };

  const onLoadTotal = () => {
    let total = 0;

    if (optionStatistic === "Ngay") {
      dataStatistic?.map((exportbill) => {
        exportbill?.ctpx?.map((epbill) => {
          total += epbill.giaxuat * epbill.soluong;
        });
      });

      return total;
    } else if (optionStatistic === "Thang" || optionStatistic === "Nam") {
      dataStatistic.map((item) => {
        console.log("typeof(item.tongtienxuat) : ", typeof item.tongtienxuat);
        total += item.tongtienxuat;
      });
    }

    return total;
  };

  const StatisticTurnOver = async () => {
    if (madailyfilter !== "") {
      try {
        const res = await axios.post("/api/thongke/thongkedoanhthu", {
          madailyfilter,
          timestatistic:
            optionStatistic === "Ngay"
              ? moment(timeStatistic).format("YYYY-MM-DD")
              : optionStatistic === "Thang"
              ? moment(timeStatistic).format("YYYY-MM")
              : moment(timeStatistic).format("YYYY"),
          optionstatistic: optionStatistic,
        });
        console.log(res.data);
        setDataStatistic(res.data);
      } catch (error) {
        setMessage(<p className="message">{error.response.data.message}</p>);
        setOpenAlert(true);
      }
    }
  };

  return (
    <>
      <div className="layout">
        <div className="layout-first">
          <Header />
        </div>
        <div className="layout-second">
          <NavBar />
          <div className="statistic_turnover">
            <div className="header-title">
              <div className="container-filter">
                <p className="label">Thống Kê Doanh Thu</p>

                <div className="time_statistic">
                  <p>Thời gian : </p>

                  {optionStatistic === "Ngay" ? (
                    <DatePicker
                      className="date-picker"
                      minDate={new Date("10-20-2017")}
                      maxDate={new Date()}
                      onChangeRaw={(e) => e.preventDefault()}
                      dateFormat="dd-MM-yyyy"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={timeStatistic}
                      onChange={(date) => {
                        setTimeStatistic(date);
                        setDataStatistic([]);
                      }}
                      value={timeStatistic}
                    />
                  ) : optionStatistic === "Thang" ? (
                    <DatePicker
                      className="date-picker"
                      selected={timeStatistic}
                      onChange={(date) => {
                        setTimeStatistic(date);
                        setDataStatistic([]);
                      }}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      showTwoColumnMonthYearPicker
                      maxDate={new Date()}
                      value={timeStatistic}
                    />
                  ) : (
                    <DatePicker
                      className="date-picker"
                      maxDate={new Date()}
                      showYearPicker
                      dateFormat="yyyy"
                      yearItemNumber={9}
                      selected={timeStatistic}
                      onChangeRaw={(e) => e.preventDefault()}
                      onChange={(date) => {
                        setTimeStatistic(date);
                        setDataStatistic([]);
                      }}
                      value={timeStatistic}
                    />
                  )}
                </div>

                <div className="filter-select" style={{ width: "100px" }}>
                  <select
                    className="select-store"
                    // value={optionbill}
                    defaultValue={"Thang"}
                    onChange={(event) => {
                      setOptionStatistic(event.target.value);
                      setDataStatistic([]);
                    }}
                  >
                    <option value="Ngay">Ngày</option>
                    <option value="Thang" selected>
                      Tháng
                    </option>
                    <option value="Nam">Năm</option>
                  </select>
                </div>

                <div className="filter-select">
                  <label>Đại lý : </label>
                  <select
                    className="select-store"
                    defaultValue={""}
                    onChange={handlechangestore}
                  >
                    <option value="" disabled selected hidden>
                      Vui lòng chọn đại lý
                    </option>
                    {stores.map((store) => (
                      <option value={store._id} key={store._id}>
                        {store.tendl}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={StatisticTurnOver}
                  className="statistic-button"
                >
                  <AiOutlineFileSearch />
                </button>

                <button
                  style={{ marginRight: "0px" }}
                  className="export-file-statisticyear"
                  onClick={() => {
                    if (dataStatistic.length > 0) {
                      exportToCSV(
                        { dataStatistic },
                        optionStatistic === "Ngay"
                          ? `DoanhThu${moment(timeStatistic).format(
                              "YYYY-MM-YYYY"
                            )}`
                          : optionStatistic === "Thang"
                          ? `DoanhThu${moment(timeStatistic).format("YYYY-MM")}`
                          : `DoanhThu${moment(timeStatistic).format("YYYY")}`
                      );
                    } else {
                      setMessage(
                        <p className="message">
                          Dữ liệu đang trống <br />
                          không thể xuất
                        </p>
                      );
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
              {optionStatistic == "Ngay" ? (
                <>
                  <p style={{ width: "70px" }}>STT</p>
                  <p style={{ width: "160px" }}>ID</p>
                  <p style={{ flex: 1 }}>Ngày lập</p>
                  <p style={{ flex: 1 }}>Nhân viên</p>
                  <p style={{ flex: 1 }}>Đại lý</p>
                  <p style={{ flex: 1 }}>Kho</p>
                  <p style={{ flex: 1 }}>Tổng Cộng</p>
                  <p style={{ flex: 1 }}>Chi tiết</p>
                </>
              ) : optionStatistic == "Thang" ? (
                <>
                  <p style={{ flex: 1 }}>Ngày</p>
                  <p style={{ flex: 1 }}>Tổng số phiếu</p>
                  <p style={{ flex: 1 }}>Doanh thu</p>
                </>
              ) : (
                <>
                  <p style={{ flex: 1 }}>Tháng</p>
                  <p style={{ flex: 1 }}>Tổng số phiếu</p>
                  <p style={{ flex: 1 }}>Doanh thu</p>
                </>
              )}
            </div>
            {optionStatistic === "Ngay"
              ? dataStatistic?.map((exportbill, index) => {
                  return (
                    <>
                      <ExportBillItem
                        key={exportbill._id}
                        exportbill={exportbill}
                        stt={index}
                        // stt={(currentPage - 1) * exportbillsPerPage + index}
                      />
                    </>
                  );
                })
              : optionStatistic === "Thang"
              ? dataStatistic?.map((dataitem, index) => {
                  return (
                    <div className="statistic_column">
                      <p style={{ flex: 1 }}>{dataitem.ngay}</p>
                      <p style={{ flex: 1 }}>{dataitem.sophieuxuat}</p>
                      <p style={{ flex: 1 }}>{Format(dataitem.tongtienxuat)}</p>
                    </div>
                  );
                })
              : dataStatistic?.map((dataitem, index) => {
                  return (
                    <div className="statistic_column">
                      <p style={{ flex: 1 }}>{dataitem.thang}</p>
                      <p style={{ flex: 1 }}>{dataitem.sophieuxuat}</p>
                      <p style={{ flex: 1 }}>{Format(dataitem.tongtienxuat)}</p>
                    </div>
                  );
                })}

            <div className="statistic_turn__over">
              Tổng Doanh Thu : {Format(onLoadTotal())}
            </div>
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
            {message}
            <div className="option-button">
              <button
                id="add"
                onClick={() => {
                  document
                    .getElementById("modal_container__notification")
                    .classList.remove("modal_active");
                  setOpenAlert(false);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default StatisticTurnOver;

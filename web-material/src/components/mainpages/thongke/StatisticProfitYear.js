import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { GlobalState } from "../../../GlobalState";
// import MaterialItem from "./MaterialItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { FaFileExport } from "react-icons/fa";
import DatePicker from "react-datepicker";
import moment from "moment";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function StatisticProfitYear() {
  const state = useContext(GlobalState);

  const [yearstatistic, setYearStatistic] = useState(new Date());
  const [stores] = state.storeAPI.stores;
  const [kindStatistic, setKindStatistic] = useState("Bang");
  const [madailyfilter, setMaDaiLyFilter] = useState("allstores");
  const [dataStatistic, setDataStatistic] = useState([]);
  const [openalert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");

  //============ XUẤT FILE ==============
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const DATE = moment(new Date()).format("DD-MM-YYYY");

  const customData = (dataImport) => {
    let dataExport = [];
    // console.log("dataImport : ", dataImport.dataStatistic);

    dataExport = dataImport.dataStatistic.map((data) => ({
      Tháng: data.thang,
      "Số Phiếu Nhập": data.sophieunhap,
      "Chi Phí Nhập": Format(data.chiphinhap),
      "Số Phiếu Xuất": data.sophieuxuat,
      "Chi Phí Xuất": Format(data.chiphixuat),
      "Lợi Nhuận Tháng": Format(data.chiphixuat - data.chiphinhap),
    }));

    dataExport[dataExport.length] = {
      Tháng: "",
      "Số Phiếu Nhập": "",
      "Chi Phí Nhập": "",
      "Số Phiếu Xuất": "",
      "Chi Phí Xuất":
        "Lợi nhuận cả năm : " + parseInt(moment(yearstatistic).format("YYYY")),
      "Lợi Nhuận Tháng": Format(onLoadTotal()),
    };
    // {Format(onLoadTotal())}

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

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  const handlechangestore = (e) => {
    setMaDaiLyFilter(e.target.value);
  };

  useEffect(async () => {
    if (madailyfilter !== "") {
      // console.log("madailyfilter : ", madailyfilter);
      const res = await axios.post(
        "/api/thongke/loinhuannam",
        {
          madailyfilter,
          yearstatistic: parseInt(moment(yearstatistic).format("YYYY")),
        }
        // {madailyfilter,yearstatistic : 2021}
      );

      // console.log("res.data : ", res.data);
      setDataStatistic(res.data);
    }
  }, [madailyfilter, yearstatistic, kindStatistic]);

  return (
    <>
      <div className="layout">
        <div className="layout-first">
          <Header />
        </div>
        <div className="layout-second">
          <NavBar />
          <div className="statistic_profit_year">
            <div className="header-title">
              <div className="date_picker__statistic">
                <span>Năm</span>
                <DatePicker
                  // className="date_picker__statistic"
                  maxDate={new Date()}
                  showYearPicker
                  dateFormat="yyyy"
                  yearItemNumber={9}
                  selected={yearstatistic}
                  onChangeRaw={(e) => e.preventDefault()}
                  onChange={(date) => {
                    setYearStatistic(date);
                  }}
                  value={yearstatistic}
                />
              </div>

              <div className="filter-select" style={{ width: "100px" }}>
                <select
                  className="select-store"
                  // value={optionbill}
                  defaultValue={"Bang"}
                  onChange={(event) => {
                    setKindStatistic(event.target.value);
                    setDataStatistic([]);
                  }}
                >
                  <option value="Bang">Bảng</option>
                  <option value="BieuDo">Biểu đồ</option>
                </select>
              </div>

              <div className="title-tab">
                <p style={{ display: "flex", alignItems: "center" }}>
                  <AiOutlineMoneyCollect />
                  Lợi Nhuận Năm {parseInt(moment(yearstatistic).format("YYYY"))}
                </p>
              </div>

              <div className="filter-select">
                <select
                  className="select-store"
                  // value={madailyfilter}
                  defaultValue={"madailyfilter"}
                  onChange={handlechangestore}
                >
                  {/* <option value="allstores" disabled selected hidden>
                    Vui lòng chọn đại lý
                  </option> */}
                  <option value="allstores" selected>
                    Tất cả đại lý
                  </option>
                  {stores.map((store, index) => (
                    <option value={store._id} key={index}>
                      {store.tendl}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="export-file-statisticyear"
                onClick={() => {
                  if (dataStatistic.length > 0) {
                    exportToCSV(
                      { dataStatistic },
                      `LoiNhuanNam_${moment(yearstatistic).format("YYYY")}`
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

            <div></div>

            {kindStatistic === "Bang" ? (
              <>
                <div className="header_list">
                  <p style={{ width: "100px" }}>Tháng</p>
                  <p style={{ width: "130px" }}>Số Phiếu Nhập</p>
                  <p style={{ flex: 1 }}>Tổng Tiền Nhập</p>
                  <p style={{ width: "130px" }}>Số Phiếu Xuất</p>
                  <p style={{ flex: 1 }}>Tổng Tiền Xuất</p>
                  <p style={{ flex: 1 }}>Lợi Nhuận Tháng</p>
                </div>
                {dataStatistic?.map((item, index) => (
                  <div className="material_item">
                    <div
                      style={{ width: "100px" }}
                      className="material_item_element"
                    >
                      {item.thang}
                    </div>
                    <div
                      style={{ width: "130px" }}
                      className="material_item_element"
                    >
                      {item.sophieunhap}
                    </div>

                    <div style={{ flex: 1 }} className="material_item_element">
                      {Format(item.chiphinhap)}
                    </div>

                    <div
                      style={{ width: "130px" }}
                      className="material_item_element"
                    >
                      {item.sophieuxuat}
                    </div>
                    <div style={{ flex: 1 }} className="material_item_element">
                      {Format(item.chiphixuat)}
                    </div>
                    <div style={{ flex: 1 }} className="material_item_element">
                      {Format(item.chiphixuat - item.chiphinhap)}
                    </div>
                  </div>
                ))}
                <div className="statistic_profit__year">
                  Lợi nhuận cả năm{" "}
                  {parseInt(moment(yearstatistic).format("YYYY"))} :{" "}
                  {Format(onLoadTotal())}
                </div>
              </>
            ) : (
              <div className="statistic_chart">
                <ResponsiveContainer width="100%" height="100%" aspect={4 / 1}>
                  <LineChart
                    width={500}
                    height={300}
                    data={dataStatistic.map((item) => {
                      return {
                        Tháng: item.thang,
                        "Số phiếu nhập": item.sophieunhap,
                        "Tổng tiền nhập": item.chiphinhap,
                        "Số phiếu xuất": item.sophieuxuat,
                        "Tổng tiền xuất": item.chiphixuat,
                        "Lợi nhuận": item.chiphixuat - item.chiphinhap,
                      };
                    })}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Tháng" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => {
                        return new Intl.NumberFormat("en").format(value);
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Số phiếu nhập"
                      stroke="orange"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Tổng tiền nhập"
                      stroke="red"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Số phiếu xuất"
                      stroke="blue"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Tổng tiền xuất"
                      stroke="#1a94ff"
                    />

                    <Line type="monotone" dataKey="Lợi nhuận" stroke="green" />

                    {/* <Line type="monotone" dataKey="Lợi nhuận" stroke="red" /> */}
                  </LineChart>
                </ResponsiveContainer>
                <div className="explain_table">
                  <p>Đơn vị tính</p>
                  <div className="explain_content">
                    <p>Tiền : VND</p>
                    <p>Số phiếu : Phiếu</p>
                  </div>
                </div>
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
            {message}
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

  function onLoadTotal() {
    var total = 0;
    dataStatistic.map((item) => {
      total += item.chiphixuat - item.chiphinhap;
    });

    return total;
  }
}

export default StatisticProfitYear;

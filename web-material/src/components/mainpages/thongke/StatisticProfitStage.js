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
import moment from "moment";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { AiOutlineFileSearch } from "react-icons/ai";
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

function StatisticProfitStage() {
  const state = useContext(GlobalState);

  const [startyearstatistic, setStartYearStatistic] = useState(new Date());
  const [endyearstatistic, setEndYearStatistic] = useState(new Date());
  const [stores] = state.storeAPI.stores;

  const [madailyfilter, setMaDaiLyFilter] = useState("");
  const [dataStatistic, setDataStatistic] = useState([]);
  const [kindStatistic, setKindStatistic] = useState("Bang");

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
  const DATE = moment(new Date()).format("DD-MM-YYYY");

  const customData = (dataImport) => {
    let dataExport = [];
    console.log("dataImport : ", dataImport.dataStatistic);

    dataExport = dataImport.dataStatistic.map((data) => ({
      Năm: data.nam,
      "Số Phiếu Nhập": data.sophieunhap,
      "Chi Phí Nhập": Format(data.chiphinhap),
      "Số Phiếu Xuất": data.sophieuxuat,
      "Chi Phí Xuất": Format(data.chiphixuat),
      "Lợi Nhuận Năm": Format(data.chiphixuat - data.chiphinhap),
    }));

    dataExport[dataExport.length] = {
      Năm: "",
      "Số Phiếu Nhập": "",
      "Chi Phí Nhập": "",
      "Số Phiếu Xuất": "",
      "Chi Phí Xuất":
        "Lợi nhuận từ : " +
        moment(startyearstatistic).format("YYYY") +
        "-" +
        moment(endyearstatistic).format("YYYY"),
      "Lợi Nhuận Năm": Format(onLoadTotal()),
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

  const handlechangestore = (e) => {
    setMaDaiLyFilter(e.target.value);
  };

  useEffect(async () => {}, [
    madailyfilter,
    startyearstatistic,
    endyearstatistic,
  ]);

  const statisprofitstage = async () => {
    if (madailyfilter !== "") {
      if (
        parseInt(moment(startyearstatistic).format("YYYY")) >
        parseInt(moment(endyearstatistic).format("YYYY"))
      ) {
        setOpenAlert(true);
        setMessage(<p className="message">Thời gian không hợp lệ</p>);
      } else {
        const res = await axios.post(
          "/api/thongke/loinhuangiaidoan",
          {
            madailyfilter,
            startyearstatistic: parseInt(
              moment(startyearstatistic).format("YYYY")
            ),
            endyearstatistic: parseInt(moment(endyearstatistic).format("YYYY")),
          }
          // {madailyfilter,yearstatistic : 2021}
        );
        setDataStatistic(res.data);
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
          <div className="materials">
            <div className="header-title">
              <div className="container-filter">
                <p className="label">Lợi Nhuận </p>
                <div className="time_statistic">
                  <p> Từ :</p>
                  <DatePicker
                    className="date-picker"
                    maxDate={new Date()}
                    showYearPicker
                    dateFormat="yyyy"
                    yearItemNumber={9}
                    selected={startyearstatistic}
                    onChangeRaw={(e) => e.preventDefault()}
                    onChange={(date) => {
                      setStartYearStatistic(date);
                    }}
                    value={startyearstatistic}
                  />
                </div>

                <div className="time_statistic">
                  <p>Đến : </p>
                  <DatePicker
                    className="date-picker"
                    // format="DD-MM-YYYY"
                    maxDate={new Date()}
                    showYearPicker
                    dateFormat="yyyy"
                    yearItemNumber={9}
                    selected={endyearstatistic}
                    onChange={(date) => {
                      setEndYearStatistic(date);
                    }}
                    value={endyearstatistic}
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

                <div className="filter-select">
                  <label>Đại lý : </label>
                  <select
                    className="select-store"
                    // value={madailyfilter}
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
                  onClick={statisprofitstage}
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
                        `LoiNhuanNam_${moment(startyearstatistic).format(
                          "YYYY"
                        )}-${moment(endyearstatistic).format("YYYY")}`
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

            {kindStatistic === "Bang" ? (
              <>
                <div className="header_list">
                  <p style={{ width: "120px" }}>Năm</p>
                  <p style={{ width: "130px" }}>Số Phiếu Nhập</p>
                  <p style={{ flex: 1 }}>Tổng Tiền Nhập</p>
                  <p style={{ width: "130px" }}>Số Phiếu Xuất</p>
                  <p style={{ flex: 1 }}>Tổng Tiền Xuất</p>
                  <p style={{ flex: 1 }}>Lợi Nhuận Năm</p>
                </div>
                {dataStatistic?.map((item) => (
                  <div className="material_item">
                    <div
                      style={{ width: "120px" }}
                      className="material_item_element"
                    >
                      {item.nam}
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
                  Lợi nhuận từ{" "}
                  {parseInt(moment(startyearstatistic).format("YYYY"))} -{" "}
                  {parseInt(moment(endyearstatistic).format("YYYY"))} :{" "}
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
                        Năm: item.nam,
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
                    <XAxis dataKey="Năm" />
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

  function onLoadTotal() {
    var total = 0;
    dataStatistic.map((item) => {
      total += item.chiphixuat - item.chiphinhap;
    });

    return total;
  }
}

export default StatisticProfitStage;

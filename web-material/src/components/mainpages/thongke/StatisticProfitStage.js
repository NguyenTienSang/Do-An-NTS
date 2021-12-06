import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { GlobalState } from "../../../GlobalState";
// import MaterialItem from "./MaterialItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import DatePicker from "react-datepicker";
import moment from "moment";
import { AiOutlineFileSearch } from "react-icons/ai";

function StatisticProfitStage() {
  const state = useContext(GlobalState);
  // const [token] = state.token;
  // const [material, setMaterial] = useState(initialMaterial);

  const [startyearstatistic, setStartYearStatistic] = useState(new Date());
  const [endyearstatistic, setEndYearStatistic] = useState(new Date());
  const [stores] = state.storeAPI.stores;

  const [madailyfilter, setMaDaiLyFilter] = useState("");
  const [dataStatistic, setDataStatistic] = useState([]);

  const [openalert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");

  const Format = (number) => {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
  };

  const handlechangestore = (e) => {
    setMaDaiLyFilter(e.target.value);
  };

  useEffect(async () => {
    // console.log('yearstatistic : ', )
    console.log("madailyfilter : ", madailyfilter);
  }, [madailyfilter, startyearstatistic, endyearstatistic]);

  const statisprofitstage = async () => {
    if (madailyfilter !== "") {
      if (
        parseInt(moment(startyearstatistic).format("YYYY")) >
        parseInt(moment(endyearstatistic).format("YYYY"))
      ) {
        setOpenAlert(true);
        setMessage("Thời gian không hợp lệ");
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

        console.log("res.data : ", res.data);
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
              </div>
            </div>

            <div className="header_list">
              <p style={{ width: "120px" }}>Năm</p>
              <p style={{ width: "130px" }}>Số Phiếu Nhập</p>
              <p style={{ flex: 1 }}>Tổng Tiền Nhập</p>
              <p style={{ width: "130px" }}>Số Phiếu Xuất</p>
              <p style={{ flex: 1 }}>Tổng Tiền Xuất</p>
              <p style={{ flex: 1 }}>Doanh Thu Tháng</p>
            </div>
            {dataStatistic?.map((item, index) => (
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
              Doanh thu từ {parseInt(moment(startyearstatistic).format("YYYY"))}{" "}
              - {parseInt(moment(endyearstatistic).format("YYYY"))} :{" "}
              {Format(onLoadTotal())}
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
            <p>{message}</p>
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

export default StatisticProfitStage;

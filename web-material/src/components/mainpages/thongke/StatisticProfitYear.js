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

function StatisticProfitYear() {
  const state = useContext(GlobalState);
  // const [token] = state.token;
  // const [material, setMaterial] = useState(initialMaterial);

  const [yearstatistic, setYearStatistic] = useState(new Date());
  const [stores] = state.storeAPI.stores;

  const [madailyfilter, setMaDaiLyFilter] = useState("");
  const [dataStatistic, setDataStatistic] = useState([]);

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

  const handlechangestore = (e) => {
    setMaDaiLyFilter(e.target.value);
  };

  useEffect(async () => {
    // console.log('yearstatistic : ', )

    if (madailyfilter !== "") {
      console.log("madailyfilter : ", madailyfilter);
      const res = await axios.post(
        "/api/thongke/loinhuannam",
        {
          madailyfilter,
          yearstatistic: parseInt(moment(yearstatistic).format("YYYY")),
        }
        // {madailyfilter,yearstatistic : 2021}
      );

      console.log("res.data : ", res.data);
      setDataStatistic(res.data);
    }
  }, [madailyfilter, yearstatistic]);

  return (
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

            <div className="item_second">
              <div className="title-tab">
                <p style={{ display: "flex", alignItems: "center" }}>
                  Lợi Nhuận Năm {parseInt(moment(yearstatistic).format("YYYY"))}
                </p>
              </div>

              <div className="filter-select">
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
            </div>
          </div>

          <div className="header_list">
            <p style={{ width: "100px" }}>Tháng</p>
            <p style={{ width: "130px" }}>Số Phiếu Nhập</p>
            <p style={{ flex: 1 }}>Tổng Tiền Nhập</p>
            <p style={{ width: "130px" }}>Số Phiếu Xuất</p>
            <p style={{ flex: 1 }}>Tổng Tiền Xuất</p>
            <p style={{ flex: 1 }}>Doanh Thu Tháng</p>
          </div>
          {dataStatistic?.map((item, index) => (
            <div className="material_item">
              <div style={{ width: "100px" }} className="material_item_element">
                {item.thang}
              </div>
              <div style={{ width: "130px" }} className="material_item_element">
                {item.sophieunhap}
              </div>

              <div style={{ flex: 1 }} className="material_item_element">
                {Format(item.chiphinhap)}
              </div>

              <div style={{ width: "130px" }} className="material_item_element">
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
            Doanh thu cả năm {parseInt(moment(yearstatistic).format("YYYY"))} :{" "}
            {Format(onLoadTotal())}
          </div>
        </div>
      </div>
    </div>
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

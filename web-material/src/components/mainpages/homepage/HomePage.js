import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { GlobalState } from "../../../GlobalState";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { GiExplosiveMaterials } from "react-icons/gi";
import { IoStorefrontOutline } from "react-icons/io5";
import { FaWarehouse } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { AiFillCaretRight } from "react-icons/ai";
import { GiMoneyStack } from "react-icons/gi";
import moment from "moment";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function HomePage() {
  const today = moment();
  console.log("today : ", today.format("DD-MM-YYYY"));
  const state = useContext(GlobalState);
  const [dataStatistic, setDataStatistic] = useState([]);
  const [dataStatisticToday, setDataStatisticToday] = useState([]);
  const [stores] = state.storeAPI.stores;
  const [madailyfilter, setMaDaiLyFilter] = useState("allstores");

  const currentYear = new Date().getFullYear();

  const handlechangestore = (e) => {
    setMaDaiLyFilter(e.target.value);
  };

  useEffect(async () => {
    const res = await axios.get("/api/thongke/dulieuhomnay");
    console.log("res.data1 : ", res.data);
    setDataStatisticToday(res.data);
  }, []);

  useEffect(async () => {
    if (madailyfilter !== "") {
      const res = await axios.post("/api/thongke/trangchu", {
        madailyfilter,
      });

      // console.log("res.data : ", res.data);
      setDataStatistic(res.data);
    }
  }, [madailyfilter]);

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  return (
    <div className="layout">
      <div className="layout-first">
        <Header />
      </div>
      <div className="layout-second">
        <NavBar />
        <div className="homepage">
          {dataStatistic === undefined ? (
            <></>
          ) : (
            <>
              <div className="first_statistic">
                <div
                  className="item_statistic"
                  style={{ backgroundColor: "red" }}
                >
                  <Link to="/daily">
                    <labeL>
                      Số đại lý : {dataStatistic ? dataStatistic.countdaily : 0}
                      <IoStorefrontOutline />
                    </labeL>
                  </Link>
                </div>

                <div
                  className="item_statistic"
                  style={{ backgroundColor: "orange" }}
                >
                  <Link to="/kho">
                    <labeL>
                      Số kho : {dataStatistic ? dataStatistic.countkho : 0}{" "}
                      <FaWarehouse />
                    </labeL>
                  </Link>
                </div>

                <div
                  className="item_statistic"
                  style={{ backgroundColor: "rgb(7, 179, 1)" }}
                >
                  <Link to="/nhanvien">
                    {" "}
                    <labeL>
                      Số nhân viên :{" "}
                      {dataStatistic ? dataStatistic.countnhanvien : 0}{" "}
                      <BsFillPersonLinesFill />
                    </labeL>
                  </Link>
                </div>
              </div>

              <div className="statistic_chart__homepage">
                <div className="header_chart">
                  <p>Dữ liệu thống kê năm {currentYear}</p>
                  <div className="filter-select">
                    <select
                      className="select-store"
                      value={madailyfilter}
                      defaultValue={""}
                      onChange={handlechangestore}
                    >
                      <option value="allstores" selected>
                        Tất cả đại lý
                      </option>
                      {stores.map((store) => (
                        <option value={store._id} key={store._id}>
                          {store.tendl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="100%" aspect={4 / 1}>
                  <LineChart
                    width={500}
                    height={300}
                    data={dataStatistic?.statisticProfitYear?.map((item) => {
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
                  </LineChart>
                </ResponsiveContainer>
                <div className="explain_table">
                  <div className="explain_content">
                    <p style={{ color: "rgb(7, 179, 1)" }}>Đơn vị tính</p>
                    <p>Tiền : VND</p>
                    <p>Số phiếu : Phiếu</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {dataStatisticToday === undefined ? (
            <></>
          ) : (
            <div className="statistic_chart__homepage">
              <div className="header_chart">
                <p>Dữ liệu thống kê hôm nay {today.format("DD-MM-YYYY")}</p>
              </div>
              <ResponsiveContainer width="100%" height="100%" aspect={4 / 1}>
                <LineChart
                  width={500}
                  height={300}
                  data={dataStatisticToday.map((item) => {
                    return {
                      "Tên đại lý": item.tendl,
                      "Số phiếu nhập": item.sophieunhap,
                      "Tổng tiền nhập": item.chiphinhap,
                      "Số phiếu xuất": item.sophieuxuat,
                      "Tổng tiền xuất": item.chiphixuat,
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
                  <XAxis dataKey="Tên đại lý" />
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
                </LineChart>
              </ResponsiveContainer>
              <div className="explain_table">
                <div className="explain_content">
                  <p style={{ color: "rgb(7, 179, 1)" }}>Đơn vị tính</p>
                  <p>Tiền : VND</p>
                  <p>Số phiếu : Phiếu</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

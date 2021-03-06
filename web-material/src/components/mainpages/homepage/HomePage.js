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
  // console.log("today : ", today.format("DD-MM-YYYY"));
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
    // console.log("res.data1 : ", res.data);
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
                    <div>
                      S??? ?????i l?? : {dataStatistic ? dataStatistic.countdaily : 0}
                      <IoStorefrontOutline />
                    </div>
                  </Link>
                </div>

                <div
                  className="item_statistic"
                  style={{ backgroundColor: "orange" }}
                >
                  <Link to="/kho">
                    <div>
                      S??? kho : {dataStatistic ? dataStatistic.countkho : 0}{" "}
                      <FaWarehouse />
                    </div>
                  </Link>
                </div>

                <div
                  className="item_statistic"
                  style={{ backgroundColor: "rgb(7, 179, 1)" }}
                >
                  <Link to="/nhanvien">
                    {" "}
                    <div>
                      S??? nh??n vi??n :{" "}
                      {dataStatistic ? dataStatistic.countnhanvien : 0}{" "}
                      <BsFillPersonLinesFill />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="statistic_chart__homepage">
                <div className="header_chart">
                  <p>D??? li???u th???ng k?? n??m {currentYear}</p>
                  <div className="filter-select">
                    <select
                      className="select-store"
                      value={madailyfilter}
                      defaultValue={""}
                      onChange={handlechangestore}
                    >
                      <option value="allstores" selected>
                        T???t c??? ?????i l??
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
                        Th??ng: item.thang,
                        "S??? phi???u nh???p": item.sophieunhap,
                        "T???ng ti???n nh???p": item.chiphinhap,
                        "S??? phi???u xu???t": item.sophieuxuat,
                        "T???ng ti???n xu???t": item.chiphixuat,
                        "L???i nhu???n": item.chiphixuat - item.chiphinhap,
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
                    <XAxis dataKey="Th??ng" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => {
                        return new Intl.NumberFormat("en").format(value);
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="S??? phi???u nh???p"
                      stroke="orange"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="T???ng ti???n nh???p"
                      stroke="red"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="S??? phi???u xu???t"
                      stroke="blue"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="T???ng ti???n xu???t"
                      stroke="#1a94ff"
                    />

                    <Line type="monotone" dataKey="L???i nhu???n" stroke="green" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="explain_table">
                  <div className="explain_content">
                    <p style={{ color: "rgb(7, 179, 1)" }}>????n v??? t??nh</p>
                    <p>Ti???n : VND</p>
                    <p>S??? phi???u : Phi???u</p>
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
                <p>D??? li???u th???ng k?? h??m nay {today.format("DD-MM-YYYY")}</p>
              </div>
              <ResponsiveContainer width="100%" height="100%" aspect={4 / 1}>
                <LineChart
                  width={500}
                  height={300}
                  data={dataStatisticToday.map((item) => {
                    return {
                      "T??n ?????i l??": item.tendl,
                      "S??? phi???u nh???p": item.sophieunhap,
                      "T???ng ti???n nh???p": item.chiphinhap,
                      "S??? phi???u xu???t": item.sophieuxuat,
                      "T???ng ti???n xu???t": item.chiphixuat,
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
                  <XAxis dataKey="T??n ?????i l??" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => {
                      return new Intl.NumberFormat("en").format(value);
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="S??? phi???u nh???p"
                    stroke="orange"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="T???ng ti???n nh???p"
                    stroke="red"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="S??? phi???u xu???t"
                    stroke="blue"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="T???ng ti???n xu???t"
                    stroke="#1a94ff"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="explain_table">
                <div className="explain_content">
                  <p style={{ color: "rgb(7, 179, 1)" }}>????n v??? t??nh</p>
                  <p>Ti???n : VND</p>
                  <p>S??? phi???u : Phi???u</p>
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

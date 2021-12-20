import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { GiExplosiveMaterials } from "react-icons/gi";
import { IoStorefrontOutline } from "react-icons/io5";
import { FaWarehouse } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { AiFillCaretRight } from "react-icons/ai";
import { GiMoneyStack } from "react-icons/gi";

function HomePage() {
  const [dataStatistic, setDataStatistic] = useState("");

  const currentMonth = new Date().getMonth;

  useEffect(async () => {
    const res = await axios.get("/api/thongke/trangchu");
    //
    console.log("res.data1 : ", res.data);
    setDataStatistic(res.data);
  }, []);

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
          <p className="title_homepage__statistic">Dữ liệu hệ thống đại lý</p>
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

              <div className="second_statistic">
                <p className="title_second__statistic">Dữ liệu tháng 12</p>
                <div className="row">
                  <div className="item_statistic">
                    <Link to="/phieunhap">
                      <labeL>
                        Số phiếu nhập :
                        {dataStatistic
                          ? dataStatistic?.statisticProfit?.sophieunhap
                          : 0}
                        <GiNotebook />
                      </labeL>
                    </Link>
                  </div>

                  <div className="item_statistic">
                    <labeL>
                      Tổng tiền nhập :
                      {Format(
                        dataStatistic
                          ? dataStatistic?.statisticProfit?.chiphinhap
                          : 0
                      )}
                      <GiMoneyStack />
                    </labeL>
                  </div>
                </div>

                <div className="row">
                  <div className="item_statistic">
                    <Link to="/phieuxuat">
                      <labeL>
                        Số phiếu xuất :
                        {dataStatistic
                          ? dataStatistic?.statisticProfit?.sophieuxuat
                          : 0}
                        <GiNotebook />
                      </labeL>
                    </Link>
                  </div>

                  <div className="item_statistic">
                    <labeL>
                      Tổng tiền xuất :
                      {Format(
                        dataStatistic
                          ? dataStatistic?.statisticProfit?.chiphixuat
                          : 0
                      )}
                      <GiMoneyStack />
                    </labeL>
                  </div>
                </div>

                <div className="row">
                  <div className="item_statistic">
                    <labeL>
                      Lợi nhuận :
                      {Format(
                        dataStatistic
                          ? dataStatistic?.statisticProfit?.chiphixuat -
                              dataStatistic?.statisticProfit?.chiphinhap
                          : 0
                      )}
                      <GiMoneyStack />
                    </labeL>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

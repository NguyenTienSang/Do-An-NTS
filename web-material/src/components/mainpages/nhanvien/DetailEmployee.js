import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import { IoIosBarcode } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
import { TiLocationOutline } from "react-icons/ti";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdOutlinePersonPin, MdOutlineContactPhone } from "react-icons/md";
import { AiOutlineIdcard } from "react-icons/ai";
import { IoMaleFemaleSharp } from "react-icons/io5";
//
//
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";

function DetailEmployee() {
  const params = useParams();
  const state = useContext(GlobalState);
  const [employees] = state.employeeAPI.employees;
  const [detailEmployee, setDetailEmployee] = useState([]);
  const [dataStatistic, setDataStatistic] = useState("");
  const date = new Date();

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  useEffect(async () => {
    console.log("re render");
    if (params._id) {
      employees.forEach((employee) => {
        if (employee._id === params._id) setDetailEmployee(employee);
      });
    }

    await axios
      .post("/api/thongke/phieunhanvien", {
        manv: params._id,
      })
      .then((res) => {
        setDataStatistic(res.data);
      })
      .catch((error) => {
        console.log("error.response : ", error.response.data.message);
      });
  }, [params._id, employees]);

  return (
    <>
      <div>
        <div className="layout">
          <div className="layout-first">
            <Header />
          </div>
          <div className="layout-second">
            <NavBar />
            <div className="infor-detail">
              <img src={detailEmployee?.images?.url} alt="" />
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "25px",
                }}
              >
                {detailEmployee?.hoten}
              </p>

              <div className="first_layout_statistic">
                <div className="row">
                  <p>
                    <IoIosBarcode />
                    ID: {detailEmployee?._id}
                  </p>
                  <p>
                    <IoStorefrontOutline /> Đại lý:
                    {detailEmployee?.madaily?.tendl}
                  </p>
                </div>

                <div className="row">
                  <p>
                    <RiAdminLine /> Quyền: {detailEmployee?.role}
                  </p>
                  <p>
                    <IoMaleFemaleSharp /> Giới tính: {detailEmployee?.gioitinh}
                  </p>
                </div>

                <div className="row">
                  <p>
                    <MdOutlineContactPhone /> SĐT: {detailEmployee?.sodienthoai}
                  </p>
                  <p>
                    <AiOutlineIdcard /> CMND: {detailEmployee?.cmnd}
                  </p>
                </div>
                <div className="row">
                  <p>
                    <MdOutlinePersonPin /> Trạng thái:
                    {detailEmployee?.trangthai}
                  </p>
                  <p>
                    <MdOutlinePersonPin /> Tài khoản:
                    {detailEmployee?.username}
                  </p>
                </div>

                <div className="row">
                  <p>
                    <HiOutlineMail /> Email: {detailEmployee?.email}
                  </p>
                  <p>
                    <TiLocationOutline /> Địa chỉ: {detailEmployee?.diachi}
                  </p>
                </div>
              </div>

              <div className="second_layout__statistic">
                <div className="item_bill item_day">
                  <div className="row">
                    <p>Doanh số ngày : {date.getDate()}</p>
                  </div>
                  <div className="row">
                    <p>
                      Số phiếu nhập :{" "}
                      {dataStatistic
                        ? dataStatistic?.statisticProfit?.sophieunhapday
                        : 0}
                    </p>
                    <p>
                      Tổng tiền nhập :{" "}
                      {dataStatistic
                        ? Format(dataStatistic?.statisticProfit?.chiphinhapday)
                        : 0}
                    </p>
                  </div>

                  <div className="row">
                    <p>
                      Số phiếu xuất :{" "}
                      {dataStatistic
                        ? dataStatistic?.statisticProfit?.sophieuxuatday
                        : 0}
                    </p>
                    <p>
                      Tổng tiền xuất :{" "}
                      {dataStatistic
                        ? Format(dataStatistic?.statisticProfit?.chiphixuatday)
                        : "0 VND"}
                    </p>
                  </div>

                  <div className="row">
                    <p>
                      Lợi nhuận ngày :{" "}
                      {dataStatistic
                        ? Format(
                            dataStatistic?.statisticProfit?.chiphixuatday -
                              dataStatistic?.statisticProfit?.chiphinhapday
                          )
                        : "0 VND"}
                    </p>
                  </div>
                </div>

                <div className="item_bill item_month">
                  <div className="row">
                    <p>Doanh số tháng : {date.getMonth() + 1}</p>
                  </div>
                  <div className="row">
                    <p>
                      Số phiếu nhập :{" "}
                      {dataStatistic
                        ? dataStatistic?.statisticProfit?.sophieunhapmonth
                        : 0}
                    </p>
                    <p>
                      Tổng tiền nhập :{" "}
                      {dataStatistic
                        ? Format(
                            dataStatistic?.statisticProfit?.chiphinhapmonth
                          )
                        : "0 VND"}
                    </p>
                  </div>
                  <div className="row">
                    <p>
                      Số phiếu xuất :{" "}
                      {dataStatistic
                        ? dataStatistic?.statisticProfit?.sophieuxuatmonth
                        : 0}
                    </p>
                    <p>
                      Tổng tiền xuất :{" "}
                      {dataStatistic
                        ? Format(
                            dataStatistic?.statisticProfit?.chiphixuatmonth
                          )
                        : "0 VND"}
                    </p>
                  </div>
                  <div className="row">
                    <p>
                      Lợi nhuận tháng :{" "}
                      {dataStatistic
                        ? Format(
                            dataStatistic?.statisticProfit?.chiphixuatmonth -
                              dataStatistic?.statisticProfit?.chiphinhapmonth
                          )
                        : "0 VND"}
                    </p>
                  </div>
                </div>

                <div className="item_bill item_year">
                  <div className="row">
                    <p>Doanh số năm {date.getFullYear()}</p>
                  </div>
                  <div className="row">
                    <p>
                      Số phiếu nhập :{" "}
                      {dataStatistic
                        ? dataStatistic?.statisticProfit?.sophieunhapyear
                        : 0}
                    </p>
                    <p>
                      Tổng tiền nhập :{" "}
                      {dataStatistic
                        ? Format(dataStatistic?.statisticProfit?.chiphinhapyear)
                        : "0 VND"}
                    </p>
                  </div>

                  <div className="row">
                    <p>
                      Số phiếu xuất :{" "}
                      {dataStatistic
                        ? dataStatistic?.statisticProfit?.sophieuxuatyear
                        : 0}
                    </p>
                    <p>
                      Tổng tiền xuất :{" "}
                      {dataStatistic
                        ? Format(dataStatistic?.statisticProfit?.chiphixuatyear)
                        : "0 VND"}
                    </p>
                  </div>

                  <div className="row">
                    <p>
                      Lợi nhuận năm :{" "}
                      {dataStatistic
                        ? Format(
                            dataStatistic?.statisticProfit?.chiphixuatyear -
                              dataStatistic?.statisticProfit?.chiphinhapyear
                          )
                        : "0 VND"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailEmployee;

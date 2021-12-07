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

  useEffect(async () => {
    console.log("re render");
    if (params._id) {
      employees.forEach((employee) => {
        if (employee._id === params._id) setDetailEmployee(employee);
      });
    }

    // const res = await axios.get('/api/thongke/phieunhanvien');
    // //
    // console.log('res.data1 : ',res.data)
    // setDataStatistic(res.data);

    await axios
      .post("/api/thongke/phieunhanvien", {
        manv: params._id,
      })
      .then((res) => {
        // setDataStatistic(res.data);
        // console.log('thống kê phiếu nhân viên : ',res.data)
        // res.data?.map(item => {
        //         console.log('item.thang : ',item.thang)
        // })
        setDataStatistic(res.data);
      })
      .catch((error) => {
        console.log("error.response : ", error.response.data.message);
        // Alert.alert('Thông báo ',error);
      });
  }, [params._id, employees]);

  // if (detailEmployee.length === 0) return null;
  // console.log('Thông tin chi tiết nhân viên',detailEmployee);
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
                    <IoStorefrontOutline /> Đại lý:{" "}
                    {detailEmployee?.madaily?.tendl}
                  </p>
                </div>

                <div className="row">
                  <p>
                    <RiAdminLine /> Quyền: {detailEmployee?.role}
                  </p>
                  <p>
                    <IoMaleFemaleSharp /> Giới tính:
                    {detailEmployee?.gioitinh}
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
                    <HiOutlineMail /> Email: {detailEmployee?.email}
                  </p>
                  <p>
                    <TiLocationOutline /> Địa chỉ: {detailEmployee?.diachi}
                  </p>
                </div>
                <div className="row">
                  <p>
                    <MdOutlinePersonPin /> Tình trạng:{" "}
                    {detailEmployee?.tinhtrang}
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
                      {dataStatistic?.statisticProfit?.sophieunhapday}
                    </p>
                    <p>
                      Tổng tiền nhập :{" "}
                      {dataStatistic?.statisticProfit?.chiphinhapday}
                    </p>
                  </div>

                  <div className="row">
                    <p>
                      Số phiếu xuất :{" "}
                      {dataStatistic?.statisticProfit?.sophieuxuatday}
                    </p>
                    <p>
                      Tổng tiền xuất :{" "}
                      {dataStatistic?.statisticProfit?.chiphixuatday}
                    </p>
                  </div>

                  <div className="row">
                    <p>
                      {" "}
                      Lợi nhuận ngày :{" "}
                      {dataStatistic?.statisticProfit?.chiphixuatday -
                        dataStatistic?.statisticProfit?.chiphinhapday}
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
                      {dataStatistic?.statisticProfit?.sophieunhapmonth}
                    </p>
                    <p>
                      Tổng tiền nhập :{" "}
                      {dataStatistic?.statisticProfit?.chiphinhapmonth}
                    </p>
                  </div>
                  <div className="row">
                    <p>
                      Số phiếu xuất :{" "}
                      {dataStatistic?.statisticProfit?.sophieuxuatmonth}
                    </p>
                    <p>
                      Tổng tiền xuất :{" "}
                      {dataStatistic?.statisticProfit?.chiphixuatmonth}
                    </p>
                  </div>
                  <div className="row">
                    <p>
                      Lợi nhuận tháng :{" "}
                      {dataStatistic?.statisticProfit?.chiphixuatmonth -
                        dataStatistic?.statisticProfit?.chiphinhapmonth}
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
                      {dataStatistic?.statisticProfit?.sophieunhapyear}
                    </p>
                    <p>
                      Tổng tiền nhập :{" "}
                      {dataStatistic?.statisticProfit?.chiphinhapyear}
                    </p>
                  </div>

                  <div className="row">
                    <p>
                      Số phiếu xuất :{" "}
                      {dataStatistic?.statisticProfit?.sophieuxuatyear}
                    </p>
                    <p>
                      Tổng tiền xuất :{" "}
                      {dataStatistic?.statisticProfit?.chiphixuatyear}
                    </p>
                  </div>

                  <div className="row">
                    <p>
                      Lợi nhuận năm :{" "}
                      {dataStatistic?.statisticProfit?.chiphixuatyear -
                        dataStatistic?.statisticProfit?.chiphinhapyear}
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

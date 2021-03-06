import React, { useContext, useState, useEffect } from "react";
import { NavLink, Link, useLocation, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";

import {
  BsFillPersonLinesFill,
  BsJournalArrowUp,
  BsJournalArrowDown,
  BsPersonSquare,
} from "react-icons/bs";
import { GiExplosiveMaterials } from "react-icons/gi";
import { IoStorefrontOutline, IoGolfOutline } from "react-icons/io5";
import { FaWarehouse } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { VscGraphLine } from "react-icons/vsc";
import {
  AiFillCaretRight,
  AiFillCaretDown,
  AiOutlineColumnWidth,
} from "react-icons/ai";
import { SiMaterialui } from "react-icons/si";

import { GlobalState } from "../../GlobalState";

function NavBar() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  const params = useParams();

  const location = useLocation();
  // console.log("location : ", location);
  const [openbill, setOpenBill] = useState(
    location.pathname === "/phieunhap" ||
      location.pathname === "/lapphieunhap" ||
      location.pathname === "/phieuxuat" ||
      location.pathname === "/lapphieuxuat"
      ? true
      : false
    // if(location.pathname === "/phieunhap" ||)
  );

  const [openstatistic, setOpenStatistic] = useState(
    location.pathname === "/thongkephieunhanvien" ||
      location.pathname === "/thongkevattu" ||
      location.pathname === `/thongkevattutrongcackho/${params._id}` ||
      location.pathname === "/thongkedoanhthu" ||
      location.pathname === "/thongkeloinhuannam" ||
      location.pathname === "/thongkeloinhuangiaidoan"
      ? true
      : false

  );


  return (
    <div className="navbar">
      {isAdmin ? (
        <div className="item-navbar">
          <NavLink to="/trangchu">
            <FaHome />
            Trang chủ
          </NavLink>
        </div>
      ) : null}

      <div className="item-navbar">
        <NavLink
          to="/nhanvien"
          className={
            location.pathname === `/detail_employee/${params._id}`
              ? "active"
              : null
          }
        >
          <BsFillPersonLinesFill />
          Nhân Viên
        </NavLink>
      </div>

      <div className="item-navbar">
        <NavLink to="/vattu">
          <GiExplosiveMaterials />
          Vật Tư
        </NavLink>
      </div>
      {isAdmin ? (
        <div className="item-navbar">
          <NavLink to="/daily">
            <IoStorefrontOutline />
            Đại Lý
          </NavLink>
        </div>
      ) : null}

      <div className="item-navbar">
        <NavLink
          to="/kho"
          className={
            location.pathname ===
            `/chitietkho/${params.madaily}/${params.makho}`
              ? "active"
              : null
          }
        >
          <FaWarehouse />
          Kho
        </NavLink>
      </div>

      <div
        className="item-navbar"
        onClick={() => {
          setOpenBill(!openbill);
          setOpenStatistic(false);
        }}
      >
        <p>
          <GiNotebook />
          Phiếu
          {openbill ? <AiFillCaretDown /> : <AiFillCaretRight />}
        </p>
      </div>

      <div
        className="item-navbar"
        style={{ display: openbill ? "block" : "none" }}
      >
        <NavLink
          to="/phieunhap"
          className={location.pathname === "/lapphieunhap" ? "active" : null}
        >
          <BsJournalArrowDown />
          Phiếu Nhập
        </NavLink>
      </div>

      <div
        className="item-navbar"
        style={{ display: openbill ? "block" : "none" }}
      >
        <NavLink
          to="/phieuxuat"
          className={location.pathname === "/lapphieuxuat" ? "active" : null}
        >
          <BsJournalArrowUp />
          Phiếu Xuất
        </NavLink>
      </div>

      {isAdmin ? (
        <>
          <div
            className="item-navbar"
            onClick={() => {
              setOpenStatistic(!openstatistic);
              setOpenBill(false);
            }}
          >
            <p>
              <VscGraphLine />
              Thống Kê
              {openstatistic ? <AiFillCaretDown /> : <AiFillCaretRight />}
            </p>
          </div>

          <div
            className="item-navbar "
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink to="/thongkephieunhanvien">
              <BsPersonSquare />
              Nhân Viên Lập Phiếu
            </NavLink>
          </div>

          <div
            className="item-navbar "
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink
              to="/thongkevattu"
              className={
                location.pathname === `/thongkevattutrongcackho/${params._id}`
                  ? "active"
                  : null
              }
            >
              <SiMaterialui />
              Vật Tư Tồn
            </NavLink>
          </div>

          <div
            className="item-navbar item_bill"
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink to="/thongkedoanhthu">
              <IoGolfOutline />
              Doanh Thu
            </NavLink>
          </div>

          <div
            className="item-navbar item_bill"
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink to="/thongkeloinhuannam">
              <RiMoneyDollarBoxFill />
              Lợi Nhuận Năm
            </NavLink>
          </div>

          <div
            className="item-navbar item_bill"
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink to="/thongkeloinhuangiaidoan">
              <AiOutlineColumnWidth />
              Lợi Nhuận Giai Đoạn
            </NavLink>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default NavBar;

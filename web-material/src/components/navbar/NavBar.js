import React, { useContext, useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
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

  const location = useLocation();
  console.log("location : ", location);
  const [openbill, setOpenBill] = useState(
    location.pathname === "/phieunhap" || location.pathname === "/phieuxuat"
      ? true
      : false
    // if(location.pathname === "/phieunhap" ||)
  );

  const [openstatistic, setOpenStatistic] = useState(
    location.pathname === "/thongkephieunhanvien" ||
      location.pathname === "/thongkevattu" ||
      location.pathname === "/thongkeloinhuannam" ||
      location.pathname === "/thongkeloinhuangiaidoan"
      ? true
      : false
    // if(location.pathname === "/phieunhap" ||)
  );

  return (
    <div className="navbar">
      <div className="item-navbar">
        <NavLink
          activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
          to="/trangchu"
        >
          <FaHome />
          Trang chủ
        </NavLink>
      </div>

      <div className="item-navbar">
        <NavLink
          activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
          to="/nhanvien"
        >
          <BsFillPersonLinesFill />
          Nhân Viên
        </NavLink>
      </div>

      <div className="item-navbar">
        <NavLink
          activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
          to="/vattu"
        >
          <GiExplosiveMaterials />
          Vật Tư
        </NavLink>
      </div>
      {isAdmin ? (
        <div className="item-navbar">
          <NavLink
            activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
            to="/daily"
          >
            <IoStorefrontOutline />
            Đại Lý
          </NavLink>
        </div>
      ) : null}

      <div className="item-navbar">
        <NavLink
          activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
          to="/kho"
        >
          <FaWarehouse />
          Kho
        </NavLink>
      </div>

      {/* ----------------------------- CODE NEW ------------------------------------- */}
      <div
        className="item-navbar"
        onClick={() => {
          setOpenBill(!openbill);
          setOpenStatistic(false);
        }}
      >
        <GiNotebook />
        Phiếu
        {openbill ? <AiFillCaretDown /> : <AiFillCaretRight />}
      </div>

      <div
        className="item-navbar"
        style={{ display: openbill ? "block" : "none" }}
      >
        <NavLink
          activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
          to="/phieunhap"
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
          activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
          to="/phieuxuat"
        >
          <BsJournalArrowUp />
          Phiếu Xuất
        </NavLink>
      </div>

      {/* GrDocumentDownload,GrDocumentPerformance */}
      {/* ------------------------------------------------------------------ */}

      {isAdmin ? (
        <>
          <div
            className="item-navbar"
            onClick={() => {
              setOpenStatistic(!openstatistic);
              setOpenBill(false);
            }}
          >
            <VscGraphLine />
            Thống Kê
            {openstatistic ? <AiFillCaretDown /> : <AiFillCaretRight />}
          </div>

          <div
            className="item-navbar "
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink
              activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
              to="/thongkephieunhanvien"
            >
              <BsPersonSquare />
              Nhân Viên
            </NavLink>
          </div>

          <div
            className="item-navbar "
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink
              activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
              to="/thongkevattu"
            >
              <SiMaterialui />
              Vật Tư
            </NavLink>
          </div>

          <div
            className="item-navbar item_bill"
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink
              activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
              to="/thongkeloinhuannam"
            >
              <IoGolfOutline />
              Lợi Nhuận Năm
            </NavLink>
          </div>

          <div
            className="item-navbar item_bill"
            style={{ display: openstatistic ? "block" : "none" }}
          >
            <NavLink
              activeStyle={{ backgroundColor: "#0198fc", color: "#fff" }}
              to="/thongkeloinhuangiaidoan"
            >
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

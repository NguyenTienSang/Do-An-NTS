import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { IoIosBarcode } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
import { TiLocationOutline } from "react-icons/ti";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdOutlinePersonPin, MdOutlineContactPhone } from "react-icons/md";
import { AiOutlineIdcard } from "react-icons/ai";
import { IoMaleFemaleSharp } from "react-icons/io5";

function InforUser() {
  const inforuser = JSON.parse(localStorage.getItem("inforuser"));

  const CloseModalMaterial = () => {
    document
      .getElementById("modal_container__inforuser")
      .classList.remove("modal_active");
  };

  return (
    <>
      <div
        className="modal_container__inforuser"
        id="modal_container__inforuser"
      >
        <div className="modal__inforuser">
          <img src={inforuser?.images?.url} alt="" />
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "25px",
              color: "rgb(26, 148, 255)",
            }}
          >
            {inforuser?.hoten}
          </p>

          <div className="first_layout_statistic">
            <div className="row">
              <p>
                <IoIosBarcode />
                ID: {inforuser?._id}
              </p>
              <p>
                <IoStorefrontOutline /> Đại lý: {inforuser?.madaily?.tendl}
              </p>
            </div>

            <div className="row">
              <p>
                <RiAdminLine /> Quyền: {inforuser?.role}
              </p>
              <p>
                <IoMaleFemaleSharp /> Giới tính: {inforuser?.gioitinh}
              </p>
            </div>

            <div className="row">
              <p>
                <MdOutlineContactPhone /> SĐT: {inforuser?.sodienthoai}
              </p>
              <p>
                <AiOutlineIdcard /> CMND: {inforuser?.cmnd}
              </p>
            </div>

            <div className="row">
              <p>
                <HiOutlineMail /> Email: {inforuser?.email}
              </p>
              <p>
                <TiLocationOutline /> Địa chỉ: {inforuser?.diachi}
              </p>
            </div>
            <div className="row">
              <p>
                <MdOutlinePersonPin /> Trạng thái:
                {inforuser?.trangthai}
              </p>
            </div>

            <div className="option_button">
              <button
                id="add"
                onClick={() => {
                  document
                    .getElementById("modal_container__inforuser")
                    .classList.remove("modal_active");
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InforUser;

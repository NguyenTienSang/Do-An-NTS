import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";

import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

function MaterialItem({ material, stt, EditMaterial, DeleteMaterial }) {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  return (
    <div className="material_item">
      <div style={{ width: "70px" }} className="material_item_element">
        {stt + 1}
      </div>
      <div
        style={{ width: "160px" }}
        className="material_item_element id_material"
      >
        <p>{material._id}</p>
      </div>
      <div style={{ flex: 1 }} className="material_item_element">
        <p>{material.tenvt}</p>
      </div>
      <div style={{ width: "160px" }} className="material_item_element">
        <img src={material.images.url} alt="" />
      </div>

      <div style={{ flex: 1 }} className="material_item_element">
        {material.soluong} {material.donvi}
      </div>

      <div style={{ flex: 1 }} className="material_item_element">
        {Format(material.gianhap)}
      </div>
      <div style={{ flex: 1 }} className="material_item_element">
        {Format(material.giaxuat)}
      </div>
      <div style={{ flex: 1 }} className="material_item_element">
        {material.trangthai}
      </div>
      {isAdmin ? (
        <>
          <div
            style={{ flex: 1 }}
            className="material_item_element option_material"
          >
            <button
              style={{ fontSize: 36 }}
              onClick={() => EditMaterial(material)}
            >
              <FaRegEdit style={{ color: "rgb(15, 184, 0)" }} />
            </button>
            <button
              style={{ fontSize: 36 }}
              onClick={() =>
                DeleteMaterial(material._id, material.images.public_id)
              }
            >
              <RiDeleteBin6Line style={{ color: "red" }} />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default MaterialItem;

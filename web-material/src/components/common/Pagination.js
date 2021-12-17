import React from "react";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

function Pagination({ itemsPerpage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerpage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination_container">
      <BsCaretLeftFill
        style={
          currentPage > 1
            ? { color: "rgb(26, 148, 255)", cursor: "pointer" }
            : {
                color: "#999",
                cursor: "default",
              }
        }
        onClick={() => {
          if (currentPage > 1) {
            paginate(currentPage - 1);
          }
        }}
      />
      <ul className="pagination_number">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <p
              style={
                currentPage === number
                  ? { backgroundColor: "rgb(26, 148, 255)", color: "#fff" }
                  : {}
              }
              onClick={() => paginate(number)}
            >
              {number}
            </p>
          </li>
        ))}
      </ul>
      <BsCaretRightFill
        style={
          currentPage === pageNumbers.length
            ? {
                color: "#999",
                cursor: "default",
              }
            : { color: "rgb(26, 148, 255)", cursor: "pointer" }
        }
        onClick={() => {
          if (currentPage < pageNumbers.length) {
            paginate(currentPage + 1);
          }
        }}
      />
    </div>
  );
}

export default Pagination;

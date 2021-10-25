import React from 'react';
import NotFoundPage from '../../../../assets/laptopsleep.png';
function NotFound() {
    return (
        <div className="not-found">
           <img src={NotFoundPage} alt="Girl in a jacket"></img>
          <h1> Không tìm thấy trang</h1>
        </div>
    );
}

export default NotFound;
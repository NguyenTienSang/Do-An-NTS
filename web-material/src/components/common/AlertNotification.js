import React from 'react'

function AlertNotification(props) {
    return (
        // <div    className={props.check ?  "modal_container__notification .modal_active" : "modal_container__notification"}  id="modal_container__notification">
        <div className="modal_container__notification .modal_active"  id="modal_container__notification">
        <div className="modal__notification">
          <p className="title-notification">Thông báo</p>
          <p>{props.message}</p>
          <div className="option-button">
              <button id="add" >OK</button>
             
          </div>
        </div>
</div>
    )
}

export default AlertNotification

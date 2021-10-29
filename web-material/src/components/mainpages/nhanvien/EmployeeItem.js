import React from 'react';
import { Link } from 'react-router-dom';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaUserEdit} from 'react-icons/fa';
import {GrView} from 'react-icons/gr';

function EmployeeItem({employee,stt,EditEmployee,DeleteEmployee}) {
    console.log(employee);
    return (
        <div className="employee_item">
        <div style={{flex:0.5}} className="employee_item_element">
        <h2>{stt+1}</h2>
        </div>
        <div className="employee_item_element">
        <h2>{employee.hoten}</h2>
        </div>
        <div className="employee_item_element">
          <img src={employee.images.url} alt="" />
        </div>
         
        <div className="employee_item_element">
            {employee.madaily.tendl}
        </div>

        <div style={{flex:0.5}} className="employee_item_element">
            {employee.role} 
        </div>
          <div className="employee_item_element">
          {employee.tinhtrang}
          </div>
          <div style={{flex:0.6}} className="employee_item_element">
            <button style={{fontSize:30}} style={{fontSize:30}} onClick={() => EditEmployee(employee)}><FaUserEdit/></button>
          </div>
          <div style={{flex:0.6}} className="employee_item_element">
          <button onClick={() => DeleteEmployee(employee._id,employee.images.public_id)}><RiDeleteBin6Line/></button>
          </div>
          <div style={{flex:0.6}} className="employee_item_element">
          <button><Link to={`/detail_employee/${employee._id}`}><GrView/></Link></button>
          </div>
      </div>
    )
}

export default EmployeeItem

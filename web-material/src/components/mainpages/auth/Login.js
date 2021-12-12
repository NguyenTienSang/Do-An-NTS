import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [openalert, setOpenAlert] = useState(false);

  const [message, setMessage] = useState("");

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { ...user });
      localStorage.setItem("inforuser", JSON.stringify(res.data.user));
      localStorage.setItem("firstLogin", true);
      
        if (res.data.user.role === "admin") {
          window.location.href = "/trangchu";
        } else if (res.data.user.role === "user") {
          window.location.href = "/nhanvien";
        }
      
    } catch (error) {
      // alert(error.response.data.message);
      setMessage(error.response.data.message);
      setOpenAlert(true);
    }
  };

  return (
    <>
      <div className="login-wrap">
        <div className="login-html">
          <h1>QUẢN LÝ ĐẠI LÝ THU MUA PHẾ LIỆU</h1>
          <form onSubmit={loginSubmit}>
            <div className="login-form">
              <h2>Đăng Nhập</h2>
              <div className="sign-in-htm">
                <div className="group">
                  <label for="user" className="label">
                    Username
                  </label>
                  <input
                    id="user"
                    type="text"
                    className="input"
                    name="username"
                    value={user.username}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="group">
                  <label for="pass" className="label">
                    Mật khẩu
                  </label>
                  <input
                    id="pass"
                    type="password"
                    className="input"
                    data-type="password"
                    name="password"
                    value={user.password}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="group">
                  <input type="submit" className="button" value="Đăng Nhập" />
                </div>
                <div className="hr"></div>
                <div className="foot-lnk">
                  <a href="#forgot">Quên mật khẩu ?</a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {openalert ? (
        <div
          className="modal_container__notification modal_active"
          id="modal_container__notification"
        >
          <div className="modal__notification">
            <p className="title-notification">Thông báo</p>
            <p>{message}</p>
            <div className="option-button">
              <button
                id="add"
                onClick={() => {
                  //  document.getElementById("modal_container__notification").classList.remove("modal_active");
                  setOpenAlert(false);
                }}
              >
                OK
              </button>
              {/* <button id="close"  >Hủy</button> */}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Login;

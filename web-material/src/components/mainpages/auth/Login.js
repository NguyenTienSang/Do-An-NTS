import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [resetPassword, setResetPassword] = useState({
    username: "",
    email: "",
    sodienthoai: "",
    cmnd: "",
  });

  const [openalert, setOpenAlert] = useState(false);

  const [message, setMessage] = useState("");

  const [messageforget, setMessageForget] = useState("");

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onResetPassword = (e) => {
    const { name, value } = e.target;
    setResetPassword({ ...resetPassword, [name]: value });
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
      setMessage(<p className="message">{error.response.data.message}</p>);
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
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      document
                        .getElementById("modal_container__resetpassword")
                        .classList.add("modal_active");
                    }}
                  >
                    Quên mật khẩu ?
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div
        className="modal_container__resetpassword"
        id="modal_container__resetpassword"
      >
        <div className="modal_resetpassword">
          <p className="title_resetpassword">Quên mật khẩu</p>

          <div className="row">
            <label>Username : </label>
            <input
              type="text"
              name="username"
              placeholder="Nhập username"
              maxLength="25"
              required
              value={resetPassword.username}
              onChange={onResetPassword}
            />
          </div>

          <div className="row">
            <label>Email : </label>
            <input
              type="text"
              name="email"
              autoComplete="off"
              placeholder="Nhập email"
              maxLength="32"
              required
              value={resetPassword.email}
              onChange={onResetPassword}
            />
          </div>

          <div className="row">
            <label>Số điện thoại : </label>
            <input
              type="text"
              name="sodienthoai"
              autoComplete="off"
              placeholder="Nhập số điện thoại"
              id="sodienthoai"
              required
              maxLength="10"
              value={resetPassword.sodienthoai}
              onChange={onResetPassword}
            />
          </div>

          <div className="row">
            <label>Cmnd : </label>
            <input
              type="text"
              name="cmnd"
              autoComplete="off"
              placeholder="Nhập chứng minh nhân dân"
              required
              maxLength="9"
              value={resetPassword.cmnd}
              onChange={onResetPassword}
            />
          </div>

          <div className="option_button">
            <button
              id="add"
              onClick={async () => {
                // console.log("resetPassword : ", resetPassword);

                try {
                  console.log("resetPassword : ", resetPassword);
                  const res = await axios.post("/api/auth/forgotpassword", {
                    ...resetPassword,
                  });
                  setMessageForget(res.data.message);
                } catch (error) {
                  setMessageForget(error.response.data.message);
                }
              }}
            >
              Gửi Mail
            </button>

            <button
              id="add"
              onClick={() => {
                setResetPassword({
                  username: "",
                  email: "",
                  sodienthoai: "",
                  cmnd: "",
                });
                setMessageForget("");
                document
                  .getElementById("modal_container__resetpassword")
                  .classList.remove("modal_active");
              }}
            >
              Đóng
            </button>
          </div>

          <div className="message_reset__email">
            {messageforget.length > 0 ? messageforget : null}
          </div>
        </div>
      </div>

      {openalert ? (
        <div
          className="modal_container__notification modal_active"
          id="modal_container__notification"
        >
          <div className="modal__notification">
            <p className="title-notification">Thông báo</p>
            {message}
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

import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import axios from "axios";


const Login = () => {

    const [user, setUser] = useState({
        username: '',
        password: ''
    });

    

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }

    const loginSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log('hi nts',user);
            // const res = await axios.get('/api/employee');
            console.log('User : ',user);
            console.log('User 2 : ',{...user})
            await axios.post("/api/auth/login", { ...user });
            localStorage.setItem('firstLogin', true);
            window.location.href = "/trangchu";
       
        } catch (error) {
            alert(error.response.data.msg);
        }
      };

    return (
        <div className="login-wrap">
            <div className="login-html">
            <h1>QUẢN LÝ ĐẠI LÝ THU MUA PHẾ LIỆU</h1>
                <form onSubmit={loginSubmit}>
                    <div className="login-form">
                    <h2 >Đăng Nhập</h2>
                        <div className="sign-in-htm">
                            <div className="group"> 
                                <label for="user" className="label">Tài khoản</label>
                                <input id="user" type="text" className="input" 
                                name ="username"
                                value={user.username}
                                onChange={onChangeInput}
                                />
                            </div>

                            <div className="group">
                                <label for="pass" className="label">Mật khẩu</label>
                                <input id="pass" type="password" className="input" data-type="password"
                                 name ="password"
                                value={user.password}
                                onChange={onChangeInput}
                                />
                            </div>

                            <div className="group">
                                <input type="submit" className="button" value="Đăng Nhập"/>
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
    )
}

export default Login

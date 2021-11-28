const NhanVien = require("../models/NhanVien")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authCtrl = {
  register: async (req, res) => {
    try {
      const {hoten,madaily,diachi,username,password,role,sodienthoai,cmnd,tinhtrang,images} = req.body;

      if(!hoten)
      {
          return res.status(400)
          .json({success: false,message:"Họ tên trống"})
      }
      if(!madaily)
      {
          return res.status(400)
          .json({success: false,message:"Mã đại lý trống"})
      }
      if(!diachi)
      {
          return res.status(400)
          .json({success: false,message:"Địa chỉ trống"})
      }
      if(!username)
      {
          return res.status(400)
          .json({success: false,message:"Username trống"})
      }
      if(!password)
      {
          return res.status(400)
          .json({success: false,message:"Mật khẩu trống"})
      }
      // if (password.length < 6) {
      //   return res
      //     .status(400)
      //     .json({ msg: "Mật khẩu không được ngắn hơn 6 kí tự" });
      // }
      if(!role)
      {
          return res.status(400)
          .json({success: false,message:"Quyền trống"})
      }
      if(!sodienthoai)
      {
          return res.status(400)
          .json({success: false,message:"Số điện thoại trống"})
      }
      if(sodienthoai.length != 10)
      {
          return res.status(400)
          .json({message:"Số điện thoại phải đúng 10 số"})
      }  

      if(!cmnd)
      {
          return res.status(400)
          .json({success: false,message:"CMND trống"})
      }
      if(!tinhtrang)
      {
          return res.status(400)
          .json({success: false,message:"Trình trạng trống"})
      }
      if(!images)
      {
          return res.status(400)
          .json({success: false,message:"Ảnh trống"})
      }


      //Kiểm tra username không trùng
    const ktusername = await NhanVien.findOne({ username })
		if (ktusername)
    {
      return res
      .status(400)
      .json({ success: false, message: 'Username đã tồn tại' })
    }
		//Kierm tra số điện thoại không trùng
    const ktsodienthoai= await NhanVien.findOne({ sodienthoai })        
    if (ktsodienthoai)
    {
      return res
      .status(400)
      .json({ success: false, message: 'Số điện thoại đã tồn tại' })
    }
              
    //Kiểm tra cmnd không trùng
    const ktcmnd= await NhanVien.findOne({ cmnd })        
    if (ktcmnd)
    {
      return res
      .status(400)
      .json({ success: false, message: 'Chứng minh nhân dân đã tồn tại' })       
    }
                                        
            
		// Tất cả điều kiện đều thỏa mãn
		const hashedPassword = await bcrypt.hash(password, 10);
    const newnhanvien = new NhanVien({hoten,madaily,diachi,username,password: hashedPassword,role,sodienthoai,cmnd,tinhtrang,images});
		//Lưu vào mongodb
    await newnhanvien.save();

    //Tạo ra jsonwebtoken để xác thực
    const accesstoken = createAccessToken({ id: newnhanvien._id });
    const refreshtoken = createRefreshToken({ id: newnhanvien._id });

      res.cookie('refreshtoken', refreshtoken, {
          httpOnly: true,
          path: '/api/auth/refresh_token'
      })
    console.log('Đã lưu cookie',req.cookies.refreshtoken);
      res.json({message: 'Đã thêm thành công',accesstoken})

      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('req.body : ', req.body);
      if (!username) return res.status(400).json({ msg: "Username không được trống" });

      if (!password) return res.status(400).json({ msg: "Password không được trống" });

      //Kiểm tra tài khoản username
      const user = await NhanVien.findOne({ username });
      if (!user) return res.status(400).json({ msg: "Username không tồn tại " });

      //Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Sai mật khẩu" });

      //If login success, create access token and refresh token
      //Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

     
      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/api/auth/refresh_token'
    })
    console.log('user : ',user);
      // console.log('Đã lưu cookie',req.cookies.refreshtoken);
      res.json({accesstoken,user})
      // console.log(accesstoken);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: '/api/auth/refresh_token' });
    return res.json({ msg: "Đăng xuất thành công" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
},
  refreshToken: (req, res) =>{
 
    try {
      const rf_token = req.cookies.refreshtoken;

      console.log('rf_token : ',rf_token);

      if (!rf_token)
        return res.status(400).json({ msg: "Vui lòng đăng nhập hoặc đăng ký" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, nhanvien) => {
        if (err)
          return res.status(400).json({ msg: "Vui lòng đăng nhập hoặc đăng ký" });

        const accesstoken = createAccessToken({ id: nhanvien.id });

        res.json({accesstoken });
        // res.json({nhanvien, accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }

  },

  getEmployee: async (req, res) => {
    try {
      const nhanvien = await NhanVien.findById(req.nhanvien.id).populate('madaily').select("-password");
      
      if (!nhanvien) return res.status(400).json({ msg: "Nhân viên không tồn tại !!!" });

      res.json(nhanvien);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

};

const createAccessToken = (nhanvien) =>{
  return jwt.sign(nhanvien, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}
const createRefreshToken = (nhanvien) =>{
  return jwt.sign(nhanvien, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}


module.exports = authCtrl;

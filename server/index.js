require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");

   
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vcrn5.mongodb.net/materials-manage?retryWrites=true&w=majority`,{
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('Đã kết nối MongoDB');  
    } catch (error) {
           console.log(error.message);
           process.exit(1); 
    }
}

//Kết nối đến Mongodb
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
    fileUpload({
      useTempFiles: true,
    })
  );


app.use('/api/auth',require('./routes/authRouter'));
app.use('/api',require('./routes/nhanvienRouter'));
app.use('/api',require('./routes/vattuRouter'));
app.use('/api',require('./routes/dailyRouter'));
app.use('/api',require('./routes/khoRouter'));
app.use("/api", require("./routes/upload"));
// app.use('/api/kho',khoRouter);
// app.use('/api/phieunhap',phieunhapRouter);
// app.use('/api/ctphieunhap',ctphieunhapRouter);
// app.use('/api/phieuxuat',phieuxuatRouter);
// app.use('/api/ctphieuxuat',ctphieuxuatRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
  }


    
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đã kết nối port :  ${PORT}`));

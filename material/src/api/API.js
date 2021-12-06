//API
//Đăng nhập
export const APISTATE = 'http://192.168.1.4:5000';

//Aunthentication
// export const APILogin = `${APISTATE}/api/auth/login`;
export const APIGetUser = `${APISTATE}/api/nhanvien/login`;
export const APIChangePass = `${APISTATE}/api/nhanvien/changepass`;

//User
export const APIInforUser = `${APISTATE}/api/auth/infor`;

//Quản lý đại lý
export const APINhanVien = `${APISTATE}/api/nhanvien`;
export const APIDaiLy = `${APISTATE}/api/daily`;
export const APIKho = `${APISTATE}/api/kho`;
export const APIVattu = `${APISTATE}/api/vattu`;
export const APIThemNhanVien = `${APISTATE}/api/auth/register`;
export const APIPN = `${APISTATE}/api/phieunhap`;
export const APICTPN = `${APISTATE}/api/ctphieunhap`;
export const APIPX = `${APISTATE}/api/phieuxuat`;
export const APICTPX = `${APISTATE}/api/ctphieuxuat`;

//Upload & xóa ảnh
export const APIUpload = `${APISTATE}/api/upload`;
export const APIDestroy = `${APISTATE}/api/destroy`;

//Thống kê
// statisticProfitYear
export const APITKLNN = `${APISTATE}/api/thongke/loinhuannam`;
// statisticProfitYear
export const APITKLNGD = `${APISTATE}/api/thongke/loinhuangiaidoan`;

export const APISTATISTIC = `${APISTATE}/api/api/thongke`;

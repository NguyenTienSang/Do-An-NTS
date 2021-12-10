//API
//Đăng nhập
export const APISTATE = 'http://192.168.1.5:5000/api';

//Aunthentication
export const APILogin = `${APISTATE}/auth/login`;
export const APIToken = `${APISTATE}/auth/refresh_token`;
export const APIGetUser = `${APISTATE}/nhanvien/login`;
export const APIChangePass = `${APISTATE}/nhanvien/changepass`;

//User
export const APIInforUser = `${APISTATE}/auth/infor`;

//Quản lý đại lý
export const APIDaiLy = `${APISTATE}/daily`;

export const APINhanVien = `${APISTATE}/nhanvien`;

export const APIKho = `${APISTATE}/kho`;
export const APIVattu = `${APISTATE}/vattu`;
export const APIThemNhanVien = `${APISTATE}/auth/register`;

//Phiếu nhập
export const APIPN = `${APISTATE}/phieunhap`;
export const APICTPN = `${APISTATE}/ctphieunhap`;
export const TimVatTuPN = `${APISTATE}/thongke/timkiemvattuphieunhap`;

export const APIPX = `${APISTATE}/phieuxuat`;
export const APICTPX = `${APISTATE}/ctphieuxuat`;

//Thống kê tồn kho
export const APISTISTICWAREHOUSE = `${APISTATE}/thongke/vattu`;

//Upload & xóa ảnh
export const APIUpload = `${APISTATE}/upload`;
export const APIDestroy = `${APISTATE}/destroy`;

//Thống kê
//Thống kê phiếu nhân viên
export const APITKPNV = `${APISTATE}/thongke/phieunhapnhanvien`;

//Thống kê phiếu nhân viên
export const APITKVTT = `${APISTATE}/thongke/vattu`;
// /thongke/vattu

// statisticProfitYear
export const APITKLNN = `${APISTATE}/thongke/loinhuannam`;
// statisticProfitYear
export const APITKLNGD = `${APISTATE}/thongke/loinhuangiaidoan`;

export const APISTATISTIC = `${APISTATE}/thongke`;

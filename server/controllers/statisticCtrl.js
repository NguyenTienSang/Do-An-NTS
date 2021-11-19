const VatTu = require('../models/VatTu');
const PhieuNhap = require('../models/PhieuNhap');
const PhieuXuat = require('../models/PhieuXuat');
const NhanVien = require('../models/NhanVien');

const statisticCtrl = {
    statisticMaterials: async (req, res) => {
        //Chưa trừ số lượng xuất -> SAI (NHỚ BỔ SUNG)
        try {
            const {madailyfilter,makhofilter} = req.body;
            console.log('Mã đại lý thực hiện thống kê : ',madailyfilter)
            console.log('Mã kho thực hiện thống kê : ',makhofilter)
            if(madailyfilter === "allstores")
            {
                console.log('Chọn toàn đại lý')
                const vattu = await VatTu.find();
                res.json(vattu)
                // console.log('listmaterialfilter : ',vattu);
            }
            else {
                if(makhofilter === "allwarehouses")
                {
                    console.log('Chọn đại lý cụ thể')
                    const listmaterialfilter = [];
                    const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'ctpn',populate: {path: 'mavt'}});
                    console.log('phieunhap : ',phieunhap)
                    const filterpn = phieunhap.filter(pn => {
                        {
                            console.log('pn.manv.madaily : ',pn.manv.madaily)
                        }
                            return madailyfilter == pn.manv.madaily;
                    })
                    console.log('filterpn : ',filterpn)
                    filterpn.map(pn => {
                        pn.ctpn.map(ctpn => {
                           const timvattu =  listmaterialfilter.find(listmaterialitem => {
                                        if(ctpn.mavt._id === listmaterialitem._id)
                                        {
                                            console.log('---------- Tìm Thấy -----------')
                                            listmaterialitem.soluong+=ctpn.soluong;
                                        }
                                        return ctpn.mavt._id === listmaterialitem._id;
                            })
                           
                            if(timvattu === undefined)
                            {
                                listmaterialfilter.push({_id: ctpn.mavt._id, tenvt: ctpn.mavt.tenvt, soluong: ctpn.soluong, gianhap: ctpn.mavt.gianhap, giaxuat: ctpn.mavt.giaxuat,donvi:  ctpn.mavt.donvi, trangthai: ctpn.mavt.trangthai,images: ctpn.mavt.images})
                                // console.log('listmaterialfilter : ',listmaterialfilter)
                            }
                        })
                    })
                    console.log('listmaterialfilter : ',listmaterialfilter)
                    res.json(listmaterialfilter)
                }
                else
                {
                        const listmaterialfilter = [];
                        const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'ctpn',populate: {path: 'mavt'}});
                       
                        const filterpn = phieunhap.filter(pn => {
                                return makhofilter == pn.makho;
                        })

                        filterpn.map(pn => {
                            pn.ctpn.map(ctpn => {
                               const timvattu =  listmaterialfilter.find(listmaterialitem => {
                                            if(ctpn.mavt._id === listmaterialitem._id)
                                            {
                                                listmaterialitem.soluong+=ctpn.soluong;
                                            }
                                            return ctpn.mavt._id === listmaterialitem._id;
                                })
                               
                                if(timvattu === undefined)
                                {
                                    listmaterialfilter.push({_id: ctpn.mavt._id, tenvt: ctpn.mavt.tenvt, soluong: ctpn.soluong, gianhap: ctpn.mavt.gianhap, giaxuat: ctpn.mavt.giaxuat,donvi:  ctpn.mavt.donvi, trangthai: ctpn.mavt.trangthai,images: ctpn.mavt.images})
                                }
                            })
                        })
                        console.log('listmaterialfilter : ',listmaterialfilter)
                        res.json(listmaterialfilter)
                }
            }
           
        } catch (error) {
            res.status(500).json({ message: 'Thống kê thất bại' })
        }
    },


    statisticImportBillEmployees: async (req, res) => {
    /*Thống kê phiếu nhập, phiếu xuất của nhân viên
    Chi ra 2 option phiếu nhập, phiếu xuất
    theo giai đoạn 
    */
        try {
            const {manhanvien} = req.body;
            const phieunhap = await PhieuNhap.find({"manv" : manhanvien, "ngay":{$gte:"2021-07-11",$lt:"2021-12-31"}})
            res.json(phieunhap);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
    /* */
   /* Truyền vào mã đại lý, mã kho
    Nếu đại lý == allstores là tất cả đại lý -> trả vật danh sách vật tư của toàn đại lý

    Trường hợp là đại lý cụ thể
    +Tất cả kho: Lọc danh sách phiếu nhập -> Nếu mà mã kho.daily == id đại lý
    thì trả về mảng tạm
    -> Tìm kiếm nếu vật có trong mảng tạm đó thì tăng số lượng lên, nếu không thì thêm mới

        Lọc phiếu xuất -> Nếu mà
    + Kho cụ thể: Lọc danh sách

    */
}

module.exports = statisticCtrl;
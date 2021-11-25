const VatTu = require('../models/VatTu');
const PhieuNhap = require('../models/PhieuNhap');
const PhieuXuat = require('../models/PhieuXuat');
const NhanVien = require('../models/NhanVien');

const statisticCtrl = {

    searchMaterialImportBills: async (req, res) => {

        //lấy danh sách vật tư của cửa hàng gán bằng 0
        const vattu = await VatTu.find();
        // res.json(vatti)
        // vattu.map(vattuitem => {
        //     vattuitem.soluong = 0;
        // })
        

        const {makhofilter} = req.body;

        
        // console.log('Mã đại lý thực hiện thống kê : ',madailyfilter)
        console.log('Mã kho thực hiện thống kê : ',makhofilter)

        //Tiến hành lấy danh sách vật tư đã có trong kho

        console.log('Chọn kho cụ thể')
        const listmaterialfilter = [];
        const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'ctpn',populate: {path: 'mavt'}});
        const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'ctpx',populate: {path: 'mavt'}});
        console.log('PhieuNhap : ',phieunhap);
        console.log('PhieuXuat : ',phieuxuat);
        //Lọc phiếu nhập
        const filterpn = phieunhap?.filter(pn => {
                return makhofilter == pn.makho;
        })

          //Lọc phiếu xuất
          const filterpx = phieuxuat?.filter(px => {
            return makhofilter == px.makho;
    })
       
    
        //Lọc ra những vật tư có trong phiếu nhập
        // try {
            filterpn?.map(pn => {
                pn.ctpn?.map(ctpn => {
                   const timvattu =  listmaterialfilter.find(listmaterialitem => {
                                if(ctpn.mavt._id === listmaterialitem._id)
                                {
                                    listmaterialitem.soluong+=ctpn.soluong;//Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
                                }
                                return ctpn.mavt._id === listmaterialitem._id;
                    })
                   
                    if(timvattu === undefined)
                    {
                        listmaterialfilter.push({_id: ctpn.mavt._id, tenvt: ctpn.mavt.tenvt, soluong: ctpn.soluong, gianhap: ctpn.mavt.gianhap, giaxuat: ctpn.mavt.giaxuat,donvi:  ctpn.mavt.donvi, trangthai: ctpn.mavt.trangthai,images: ctpn.mavt.images})
                    }
                })
            })
        // } catch (error) {
        //     console.log('error.message: ',error.message);
        // }

       
      

    // console.log('filterpx : ',filterpx)

    // console.log('------------------------');
    // console.log('filterpn : ',filterpn);
    // console.log('filterpx : ',filterpx);
    //Lọc ra những vật tư có trong phiếu xuất
    filterpx?.map(px => {
        px.ctpx?.map(ctpx => {
           listmaterialfilter.find(listmaterialitem => {
                        // console.log(ctpx);
                        // console.log('ctpx.mavt._id : ',ctpx.mavt._id);
                        // console.log('listmaterialitem._id : ',listmaterialitem._id);
                        // console.log('typeof(ctpx.mavt._id) : ',typeof(ctpx.mavt._id));
                        // console.log('typeof(listmaterialitem._id) : ',typeof(listmaterialitem._id));
                        // console.log('ctpx.mavt._id.toString() : ',ctpx.mavt._id.toString());
                        // console.log('listmaterialitem._id.toString() : ',listmaterialitem._id.toString());
                        if(ctpx.mavt._id.toString() === listmaterialitem._id.toString())
                        {
                            console.log('Vô nè')
                            listmaterialitem.soluong-=ctpx.soluong;
                        }
                        return ctpx.mavt._id === listmaterialitem._id;
            })
           
          
        })
    })


    //Tiến hành gán vật tư có trong danh sách vật tư của kho thì lấy số lượng đó cho bằng số lượng vật tư tìm kiếm
    //Những vật  tư không có sẽ có giá trị là 0

    


        console.log('listmaterialfilter : ',listmaterialfilter)
        // res.json(listmaterialfilter)



     vattu.map(vattuitem => {
        const checkExistMaterial = listmaterialfilter.find(materialfilteritem => {
            return materialfilteritem._id.toString() === vattuitem._id.toString();
        })
        if(checkExistMaterial === undefined)
        {
            vattuitem.soluong = 0;
        }
        else {
            vattuitem.soluong = checkExistMaterial.soluong;
        }
        })

        return res.json(vattu);





        // if(madailyfilter === "allstores")
        // {
        //     console.log('Chọn toàn đại lý')
        //     const vattu = await VatTu.find();
        //     res.json(vattu)
        //     // console.log('listmaterialfilter : ',vattu);
        // }
        // else {
        //     if(makhofilter === "allwarehouses")
        //     {
        //         console.log('Chọn đại lý cụ thể')
        //         const listmaterialfilter = [];
        //         const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'ctpn',populate: {path: 'mavt'}});
        //         const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'ctpx',populate: {path: 'mavt'}});
        //         console.log('phieunhap : ',phieunhap);
        //         console.log('phieuxuat : ',phieuxuat);

        //         //Lấy danh sách phiếu nhập trong đại lý
        //         const filterpn = phieunhap.filter(pn => {
        //                 return madailyfilter == pn.manv.madaily;
        //         })

        //         const filterpx = phieuxuat.filter(px => {
                    
        //                 return madailyfilter == px.manv.madaily;
        //         })
        //         console.log('filterpn : ',filterpn)
        //         //Lọc phiếu nhập
        //         filterpn?.map(pn => {
        //             pn.ctpn?.map(ctpn => {
        //                const timvattu =  listmaterialfilter.find(listmaterialitem => {
        //                             if(ctpn.mavt._id === listmaterialitem._id)
        //                             {
        //                                 console.log('---------- Tìm Thấy -----------')
        //                                 listmaterialitem.soluong+=ctpn.soluong;
        //                             }
        //                             return ctpn.mavt._id === listmaterialitem._id;
        //                 })
                       
        //                 if(timvattu === undefined)
        //                 {
        //                     listmaterialfilter.push({_id: ctpn.mavt._id, tenvt: ctpn.mavt.tenvt, soluong: ctpn.soluong, gianhap: ctpn.mavt.gianhap, giaxuat: ctpn.mavt.giaxuat,donvi:  ctpn.mavt.donvi, trangthai: ctpn.mavt.trangthai,images: ctpn.mavt.images})
        //                     // console.log('listmaterialfilter : ',listmaterialfilter)
        //                 }
        //             })
        //         })

        //         //Lọc phiếu xuất
        //         filterpx?.map(px => {
        //             px.ctpx?.map(ctpx => {
        //                listmaterialfilter.find(listmaterialitem => {
        //                             if(ctpx.mavt._id === listmaterialitem._id)
        //                             {
        //                                 listmaterialitem.soluong-=ctpx.soluong;//Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
        //                             }
        //                             return ctpx.mavt._id === listmaterialitem._id;
        //                 })
        //             })
        //         })
        //         console.log('listmaterialfilter : ',listmaterialfilter)
        //         res.json(listmaterialfilter)
        //     }
        //     else//Chọn đại lý, chọn kho cụ thể
        //     {
        //         console.log('Chọn kho cụ thể')
        //             const listmaterialfilter = [];
        //             const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'ctpn',populate: {path: 'mavt'}});
        //             const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'ctpx',populate: {path: 'mavt'}});
        //             console.log('PhieuNhap : ',phieunhap);
        //             console.log('PhieuXuat : ',phieuxuat);
        //             //Lọc phiếu nhập
        //             const filterpn = phieunhap?.filter(pn => {
        //                     return makhofilter == pn.makho;
        //             })

        //               //Lọc phiếu xuất
        //               const filterpx = phieuxuat?.filter(px => {
        //                 return makhofilter == px.makho;
        //         })
                   
        //           console.log('filterpn : ',filterpn.length)

        //             // try {
        //                 filterpn?.map(pn => {
        //                     pn.ctpn?.map(ctpn => {
        //                        const timvattu =  listmaterialfilter.find(listmaterialitem => {
        //                                     if(ctpn.mavt._id === listmaterialitem._id)
        //                                     {
        //                                         listmaterialitem.soluong+=ctpn.soluong;//Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
        //                                     }
        //                                     return ctpn.mavt._id === listmaterialitem._id;
        //                         })
                               
        //                         if(timvattu === undefined)
        //                         {
        //                             listmaterialfilter.push({_id: ctpn.mavt._id, tenvt: ctpn.mavt.tenvt, soluong: ctpn.soluong, gianhap: ctpn.mavt.gianhap, giaxuat: ctpn.mavt.giaxuat,donvi:  ctpn.mavt.donvi, trangthai: ctpn.mavt.trangthai,images: ctpn.mavt.images})
        //                         }
        //                     })
        //                 })
        //             // } catch (error) {
        //             //     console.log('error.message: ',error.message);
        //             // }

                   
                  

        //         console.log('filterpx : ',filterpx)

        //         console.log('------------------------');
        //         // console.log('filterpn : ',filterpn);
        //         // console.log('filterpx : ',filterpx);
        //         filterpx?.map(px => {
        //             px.ctpx?.map(ctpx => {
        //                listmaterialfilter.find(listmaterialitem => {
        //                             // console.log(ctpx);
        //                             // console.log('ctpx.mavt._id : ',ctpx.mavt._id);
        //                             // console.log('listmaterialitem._id : ',listmaterialitem._id);
        //                             // console.log('typeof(ctpx.mavt._id) : ',typeof(ctpx.mavt._id));
        //                             // console.log('typeof(listmaterialitem._id) : ',typeof(listmaterialitem._id));
        //                             // console.log('ctpx.mavt._id.toString() : ',ctpx.mavt._id.toString());
        //                             // console.log('listmaterialitem._id.toString() : ',listmaterialitem._id.toString());
        //                             if(ctpx.mavt._id.toString() === listmaterialitem._id.toString())
        //                             {
        //                                 console.log('Vô nè')
        //                                 listmaterialitem.soluong-=ctpx.soluong;
        //                             }
        //                             return ctpx.mavt._id === listmaterialitem._id;
        //                 })
                       
                      
        //             })
        //         })
        //             console.log('listmaterialfilter : ',listmaterialfilter)
        //             res.json(listmaterialfilter)
        //     }
        // }


    },

    statisticMaterials: async (req, res) => {
        //Chưa trừ số lượng xuất -> SAI (NHỚ BỔ SUNG)
        try {
            const {madailyfilter,makhofilter} = req.body;

            // console.log('mã đại lý test ')
            // console.log('Test : ',req.body);

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
                    const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'ctpx',populate: {path: 'mavt'}});
                    console.log('phieunhap : ',phieunhap);
                    console.log('phieuxuat : ',phieuxuat);

                    //Lấy danh sách phiếu nhập trong đại lý
                    const filterpn = phieunhap.filter(pn => {
                            return madailyfilter == pn.manv.madaily;
                    })

                    const filterpx = phieuxuat.filter(px => {
                        
                            return madailyfilter == px.manv.madaily;
                    })
                    console.log('filterpn : ',filterpn)
                    //Lọc phiếu nhập
                    filterpn?.map(pn => {
                        pn.ctpn?.map(ctpn => {
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

                    //Lọc phiếu xuất
                    filterpx?.map(px => {
                        px.ctpx?.map(ctpx => {
                           listmaterialfilter.find(listmaterialitem => {
                                        if(ctpx.mavt._id === listmaterialitem._id)
                                        {
                                            listmaterialitem.soluong-=ctpx.soluong;//Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
                                        }
                                        return ctpx.mavt._id === listmaterialitem._id;
                            })
                        })
                    })
                    console.log('listmaterialfilter : ',listmaterialfilter)
                    res.json(listmaterialfilter)
                }
                else//Chọn đại lý, chọn kho cụ thể
                {
                    console.log('Chọn kho cụ thể')
                        const listmaterialfilter = [];
                        const phieunhap = await PhieuNhap.find().populate('manv').populate({path :'ctpn',populate: {path: 'mavt'}});
                        const phieuxuat = await PhieuXuat.find().populate('manv').populate({path :'ctpx',populate: {path: 'mavt'}});
                        console.log('PhieuNhap : ',phieunhap);
                        console.log('PhieuXuat : ',phieuxuat);
                        //Lọc phiếu nhập
                        const filterpn = phieunhap?.filter(pn => {
                                return makhofilter == pn.makho;
                        })

                          //Lọc phiếu xuất
                          const filterpx = phieuxuat?.filter(px => {
                            return makhofilter == px.makho;
                    })
                       
                      console.log('filterpn : ',filterpn.length)

                        // try {
                            filterpn?.map(pn => {
                                pn.ctpn?.map(ctpn => {
                                   const timvattu =  listmaterialfilter.find(listmaterialitem => {
                                                if(ctpn.mavt._id === listmaterialitem._id)
                                                {
                                                    listmaterialitem.soluong+=ctpn.soluong;//Nếu vật tư trong phiếu xuất tìm thấy trong listmaterialfilter thì trừ ra
                                                }
                                                return ctpn.mavt._id === listmaterialitem._id;
                                    })
                                   
                                    if(timvattu === undefined)
                                    {
                                        listmaterialfilter.push({_id: ctpn.mavt._id, tenvt: ctpn.mavt.tenvt, soluong: ctpn.soluong, gianhap: ctpn.mavt.gianhap, giaxuat: ctpn.mavt.giaxuat,donvi:  ctpn.mavt.donvi, trangthai: ctpn.mavt.trangthai,images: ctpn.mavt.images})
                                    }
                                })
                            })
                        // } catch (error) {
                        //     console.log('error.message: ',error.message);
                        // }

                       
                      

                    console.log('filterpx : ',filterpx)

                    console.log('------------------------');
                    // console.log('filterpn : ',filterpn);
                    // console.log('filterpx : ',filterpx);
                    filterpx?.map(px => {
                        px.ctpx?.map(ctpx => {
                           listmaterialfilter.find(listmaterialitem => {
                                        // console.log(ctpx);
                                        // console.log('ctpx.mavt._id : ',ctpx.mavt._id);
                                        // console.log('listmaterialitem._id : ',listmaterialitem._id);
                                        // console.log('typeof(ctpx.mavt._id) : ',typeof(ctpx.mavt._id));
                                        // console.log('typeof(listmaterialitem._id) : ',typeof(listmaterialitem._id));
                                        // console.log('ctpx.mavt._id.toString() : ',ctpx.mavt._id.toString());
                                        // console.log('listmaterialitem._id.toString() : ',listmaterialitem._id.toString());
                                        if(ctpx.mavt._id.toString() === listmaterialitem._id.toString())
                                        {
                                            console.log('Vô nè')
                                            listmaterialitem.soluong-=ctpx.soluong;
                                        }
                                        return ctpx.mavt._id === listmaterialitem._id;
                            })
                           
                          
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
        Đếm số phiếu nhập
        Đếm số phiếu xuất
        Tổng giá trị phiếu nhập
        Tổng giá trị phiếu xuất

        Trường hợp tất cả
        Đếm số phiếu nhập
        Tổng giá trị phiếu nhập
        Đếm số phiếu xuất
        Tổng giá trị phiếu xuất
        Tổng lợi nhuận
    */
        try {
            const {manv,startDateFilter,endDateFilter,optionbill} = req.body;
            console.log("manv : ",manv);
            console.log("startDateFilter : ",startDateFilter);
            console.log("startDateFilter : ",typeof(startDateFilter));
            console.log("endDateFilter : ",endDateFilter);
            console.log("endDateFilter : ",typeof(endDateFilter));
            console.log("optionbill : ",optionbill);
            //Trường hợp phiếu nhập
            if(optionbill === 'PhieuNhap')
            {
                const phieunhap = await PhieuNhap.find({"manv" : manv, "ngay":{$gte:startDateFilter,$lt:endDateFilter}}).populate('manv').populate({path :'manv',populate: {path: 'madaily'}}).populate('makho').populate('ctpn').populate({path :'ctpn',populate: {path: 'mavt'}})
                // const phieunhap = await PhieuNhap.find({"manv" : manv, "ngay":{$gte:startDateFilter,$lt:endDateFilter}})
                console.log('phieunhap : ',phieunhap)
                res.json(phieunhap);
            }
            else if(optionbill === 'PhieuXuat')
            {
                const phieuxuat = await PhieuXuat.find({"manv" : manv, "ngay":{$gte:startDateFilter,$lt:endDateFilter}}).populate('manv').populate({path :'manv',populate: {path: 'madaily'}}).populate('makho').populate('ctpx').populate({path :'ctpx',populate: {path: 'mavt'}})
                console.log('phieuxuat : ',phieuxuat)
                res.json(phieuxuat);
            }
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
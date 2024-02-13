"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { HiXMark } from "react-icons/hi2";
import { MdEditSquare } from "react-icons/md";
import Swal from 'sweetalert2';
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { IoReload } from "react-icons/io5";
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { IoEye } from "react-icons/io5";
import Link from 'next/link';
export default function Lots() {
    const params = useParams();
    const [currentPage, setCurrentPage] = useState();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [valuetock, setValueStock] = useState();
    const [action, setAction] = useState('import');

    const handleRadioChange = (event) => {
        setAction(event.target.value);
    };

    // load type
    const [types, setTypes] = useState([]);

    //add product
    const [lotname, setLotName] = useState();
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();

    const [historydata, setHistoryData] = useState([]);
    const fetchData = async (page) => {
        setLoading(true);

        const response = await axios.post(`http://localhost:3000/api/lots`, {
            productid: params.id,
            page: page,
            per_page: perPage,
            delay: 1,
        });
        setData(response.data.data);
        setTypes(response.data.type);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const handlePageChange = page => {
        fetchData(page);
        setCurrentPage(page);
    };
    const thaidateformat = (getdate) => {
        const dateObject = new Date(getdate);
        const thaiFormattedDate = dateObject.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });

        return thaiFormattedDate;
    }
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const response = await axios.post(`http://localhost:3000/api/lots`, {
            productid: params.id,
            page: page,
            per_page: newPerPage,
            delay: 1
        });

        setData(response.data.data);
        setPerPage(newPerPage);
        setLoading(false);
    };
    const handleSearch = async (query) => {
        setLoading(true);

        const response = await axios.post(`http://localhost:3000/api/lots`, {
            productid: params.id,
            page: currentPage,
            per_page: perPage,
            delay: 1,
            search: query, // Add the search query parameter
        });

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const InsertLot = async (e) => {
        e.preventDefault();
        console.log(lotname, quantity, price, params.id)
        const response = await axios.post("http://localhost:3000/api/lots/insert", {
            productid: params.id,
            lotname: lotname,
            quantity: quantity,
            price: price,
        })
        if (response.data.status === "success") {
            document.getElementById("modaladdlot").close();
            await Swal.fire({
                title: "เพิ่ม Lot สินค้าสำเร็จ",
                text: response.data.message,
                icon: "success",
            })
            setLotName("")
            setPrice("")
            setQuantity("")
            fetchData(currentPage)
        } else {
            document.getElementById("modaladdlot").close();
            await Swal.fire({
                title: "พบข้อผิดพลาด",
                text: response.data.message,
                icon: "error",
            })
            setLotName("")
            setPrice("")
            setQuantity("")
            fetchData(currentPage)
        }
    }
    const loadHistory = async (e, id) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:3000/api/lots/history", {
            lotid: id,
        })
        console.log(response.data.data)
        setHistoryData(response.data.data)
    }
    const DeleteLot = async (id, e) => {
        e.preventDefault();
        Swal.fire({
            title: "ต้องการที่จะลบสินค้านี้หรือไม่?",
            text: "หากลบสินค้าแล้ว Lots ที่เกี่ยวข้องจะหายไปด้วย",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.post("http://localhost:3000/api/lots/delete/", {
                    lotid: id,
                })
                if (response.data.status === "success") {
                    await Swal.fire({
                        title: "ลบสำเร็จ!",
                        text: "สินค้าของคุณถูกลบแล้ว.",
                        icon: "success"
                    });
                    fetchData(currentPage);
                } else {
                    await Swal.fire({
                        title: "ลบไม่สำเร็จ!",
                        text: response.data.message,
                        icon: "warning",
                    });
                    fetchData(currentPage);
                }
            }
        });
    }
    const handleManageStock = async (e, lotid) => {
        const response = await axios.post("http://localhost:3000/api/lots/updatestock", {
            productId: params.id,
            lotid: lotid,
            value: valuetock,
            action: action
        })
        if (response.data.status === "success") {
            document.getElementById("manageproduct_" + lotid).close();
            await Swal.fire({
                title: "อัพเดท Stock สำเร็จ",
                text: response.data.message,
                icon: "success",
            });
            fetchData(currentPage);
        } else {
            document.getElementById("manageproduct_" + lotid).close();
            await Swal.fire({
                title: "พบข้อผิดพลาด",
                text: response.data.message,
                icon: "error",
            })
            fetchData(currentPage);
        }
    }
    useEffect(() => {
        fetchData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            name: 'LOT',
            selector: row => row.lotname,
            sortable: true,
        },
        {
            name: 'รหัสสินค้า',
            selector: row => row.product.id,
            sortable: true,
        },
        {
            name: 'ประเภท',
            selector: row => row.product.Types.name,
            sortable: true,
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.product.productname,
            sortable: true,
        },
        {
            name: 'ราคา (บาท/ต่อชิ้น)',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'จำนวนทั้งหมด',
            selector: row => row.initial_quantity,
            sortable: true,
        },
        {
            name: 'คงเหลือ',
            selector: row => row.current_quantity,
            sortable: true,
        },
        {
            name: 'อัพเดทล่าสุด',
            selector: row => {
                const dateObject = new Date(row.updated_at);
                const thaiFormattedDate = dateObject.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                });

                return thaiFormattedDate;
            },
            sortable: true,
        },
        {
            name: 'Manage',
            cell: cellInfo => [
                <React.Fragment key={cellInfo.id}>
                    <button key={"viewdetail_" + cellInfo.id} name={"viewdetialbtn_" + cellInfo.id} onClick={(e) => { document.getElementById('viewdetail_' + cellInfo.id).showModal(); loadHistory(e, cellInfo.id) }} className="ml-1 btn btn-square btn-sm btn-success text-white"><IoEye /></button>,
                    , <dialog id={"viewdetail_" + cellInfo.id} className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">ประวัติสินค้า</h3>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>วันที่</th>
                                            <th>ราคา(บาท/ชิ้น)</th>
                                            <th>จำนวน</th>
                                            <th>ราคารวม</th>
                                        </tr>
                                    </thead>
                                    {historydata.length > 0 ? (
                                        historydata.map((history, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <th>{thaidateformat(history[index].created_at)}</th>
                                                    <th>{history[index].lot.price}</th>
                                                    <td>{history[index].quantity}</td>
                                                    <td>{history.sumall}</td>
                                                </tr>
                                            </tbody>
                                        ))
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td align='center' colSpan="4">No history data available</td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                            <div className="modal-action">
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                    , < button key={"managestock" + cellInfo.id} name={"managestockbtn_" + cellInfo.id} onClick={() => document.getElementById('manageproduct_' + cellInfo.id).showModal()} className="ml-1 btn btn-square btn-sm btn-warning text-white"><MdEditSquare /></button >
                    , <dialog id={"manageproduct_" + cellInfo.id} className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Import / Export</h3>
                            <div className='grid gap-x-8 gap-y-4 grid-cols-2'>
                                <div>
                                    <div className="label">
                                        <span className="label-text">Action</span>
                                    </div>
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className="label-text">นำเข้า</span>
                                            <input
                                                key={`import_${cellInfo.id}`}
                                                type="radio"
                                                onChange={handleRadioChange}
                                                defaultValue="import"
                                                checked={action === 'import'}
                                                name={`radio-${cellInfo.id}`}
                                                className="radio checked:bg-red-500"
                                            />
                                        </label>
                                    </div>
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className="label-text">นำออก</span>
                                            <input
                                                key={`export_${cellInfo.id}`}
                                                type="radio"
                                                onChange={handleRadioChange}
                                                defaultValue="export"
                                                checked={action === 'export'}
                                                name={`radio-${cellInfo.id}`}
                                                className="radio checked:bg-blue-500"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="label">
                                    <span className="label-text">จำนวน</span>
                                </div>
                                <input onChange={(e) => setValueStock(e.target.value)} type="number" placeholder="0 piece" maxLength={11} className="input input-bordered w-full max-w-lg" required />
                            </div>

                            <div className="modal-action">
                                <button onClick={(e) => handleManageStock(e, cellInfo.id)} className="btn btn-success text-white">บันทึก</button>
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                    , <button key={"delete_" + cellInfo.id} onClick={(e) => DeleteLot(cellInfo.id, e)} id={"delete_" + cellInfo.id} className="ml-1 btn btn-square btn-sm btn-error text-white">
                        <HiXMark />
                    </button></React.Fragment>]
            ,

        }
    ];

    return <Navbar>
        <div className="text-sm breadcrumbs">
            <ul>
                <li><Link href='/'>Home</Link></li>
                <li><a>Product</a></li>
            </ul>
        </div>
        <div className="join">
            <button onClick={() => document.getElementById('modaladdlot').showModal()} className="btn btn-outline join-item btn-neutral btn-md mb-3"><TbSquareRoundedPlusFilled size={24} /> เพิ่ม Lot สินค้า</button>
        </div>
        <br />
        <dialog id="modaladdlot" className="modal">
            <div className="modal-box  max-w-sm">
                <h3 className="font-bold text-lg mb-2">เพิ่ม Lot สินค้า</h3>
                <div>
                    <div className="label">
                        <span className="label-text">Lot/Serial Number</span>
                    </div>
                    <input value={lotname} onChange={(e) => setLotName(e.target.value)} type="text" placeholder="LOTXXXXXX" className="input input-bordered w-full max-w-xs" required />
                </div>
                <div>
                    <div className="label">
                        <span className="label-text">จำนวน</span>
                    </div>
                    <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" min={1} maxLength={11} placeholder="กรอกจำนวน" className="input input-bordered w-full max-w-xs" required />
                </div>
                <div>
                    <div className="label">
                        <span className="label-text">ราคา/ต่อหน่วย</span>
                    </div>
                    <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min={1} placeholder="0.00" className="input input-bordered w-full max-w-xs" required />
                </div>
                <div className="modal-action">
                    <button onClick={InsertLot} className="btn btn-success text-white">เพิ่ม Lot ใหม่</button>
                    <form method="dialog">

                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog >
        <div className='flex justify-between'>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="input input-bordered w-full max-w-xs mb-3 mr-2"
                />
            </div>
            <div>
                <button className='btn btn-md text-white btn-warning mr-4' onClick={() => fetchData(1)}><IoReload size={20} /> Refresh</button>
            </div>
        </div>
        <DataTable
            title={"รหัสสินค้า " + params.id}
            columns={columns}
            data={data}
            progressPending={loading}
            progressComponent={<span className="loading loading-dots loading-lg"></span>}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            highlightOnHover
            defaultSortFieldId={1}
            noDataComponent="สินค้านี้ยังไม่ได้เพิ่ม Lot"

        />
    </Navbar>
}
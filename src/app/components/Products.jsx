"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { HiXMark } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";
import Swal from 'sweetalert2';
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { IoReload } from "react-icons/io5";
export default function Products() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    // load type
    const [types, setTypes] = useState([]);

    //add product
    const [productname, setProductName] = useState();
    const [isTypeInputMode, setIsTypeInputMode] = useState(false);
    const [selectType, setSelectType] = useState('');

    const fetchData = async (page) => {
        setLoading(true);

        const response = await axios.post(`http://localhost:3000/api/product`, {
            page: page,
            per_page: perPage,
            delay: 1,

        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        setData(response.data.data);
        setTypes(response.data.type);
        setTotalRows(response.data.total);
        setLoading(false);
    };
    const handleToggleTypeMode = () => {
        setIsTypeInputMode(!isTypeInputMode);
        setSelectType('');
    };
    const handleTypeChange = (e) => {
        setSelectType(e.target.value);
    };
    const handlePageChange = page => {
        fetchData(page);
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const response = await axios.post(`http://localhost:3000/api/product`, {
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

        const response = await axios.post(`http://localhost:3000/api/product`, {
            page: currentPage,
            per_page: perPage,
            delay: 1,
            search: query, // Add the search query parameter
        });

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const InsertProduct = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:3000/api/product/insert", {
            productname: productname,
            type: selectType
        })
        if (response.data.status === "success") {
            document.getElementById("modaladdproduct").close();
            await Swal.fire({
                title: "เพิ่มสินค้าสำเร็จ",
                text: response.data.message,
                icon: "success",
            })
            setProductName("");
            setSelectType("");
            fetchData(currentPage)
        } else {
            document.getElementById("modaladdproduct").close();
            await Swal.fire({
                title: "พบข้อผิดพลาด",
                text: response.data.message,
                icon: "error",
            })
            setProductName("");
            setSelectType("");
            fetchData(currentPage)
        }
    }
    const DeleteProduct = async (id, e) => {
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
                const response = await axios.post("http://localhost:3000/api/product/delete/", {
                    productid: id,
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
                        text: response.data.msg,
                        icon: "warning",
                    });
                    fetchData(currentPage);
                }
            }
        });
    }
    useEffect(() => {
        fetchData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            name: 'รหัสสินค้า',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'ประเภท',
            selector: row => row.Types.name,
            sortable: true,
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.productname,
            sortable: true,
        },
        {
            name: 'จำนวนทั้งหมด',
            selector: row => row.initial_quantity_sum,
            sortable: true,
        },
        {
            name: 'คงเหลือ',
            selector: row => row.current_quantity_sum,
            sortable: true,
        },
        {
            name: 'Manage',
            cell: cellInfo => [
                < button key={"viewdetail_" + cellInfo.id} onClick={() => router.push(`/product/detail/${cellInfo.id}`)} className="ml-1 btn btn-square btn-sm btn-warning text-white"><FaEye /></button >
                , <button key={"delete_" + cellInfo.id} onClick={(e) => DeleteProduct(cellInfo.id, e)} id={"delete_" + cellInfo.id} className="ml-1 btn btn-square btn-sm btn-error text-white">
                    <HiXMark />
                </button>],
        }
    ];

    return <>
        <div className="join">
            <button onClick={() => document.getElementById('modaladdproduct').showModal()} className="btn btn-outline join-item btn-neutral btn-md mb-3"><TbSquareRoundedPlusFilled size={24} /> เพิ่มสินค้าใหม่</button>
        </div>
        <br />
        <dialog id="modaladdproduct" className="modal">
            <div className="modal-box  max-w-sm">
                <h3 className="font-bold text-lg mb-2">เพิ่มสินค้า</h3>
                <form action="" id='insertForm'>
                    <div className='grid grid-flow-row-dense grid-row-2 grid-cols-3'>
                        <div className='col-span-2'>
                            <div className="flex items-center"> {/* Use flex to align items horizontally */}
                                {isTypeInputMode ? (
                                    <input
                                        type="text"
                                        placeholder="ประเภทสินค้า"
                                        className="input input-bordered w-full max-w-xl"
                                        value={selectType}
                                        onChange={handleTypeChange}
                                        required
                                    />
                                ) : (
                                    <select
                                        value={selectType}
                                        onChange={(e) => setSelectType(e.target.value)}
                                        className="select select-bordered w-full max-w-xl"
                                        required
                                    >
                                        <option disabled value="">เลือกประเภทสินค้า</option>
                                        {types.map((type) => (
                                            <option key={type.id} value={type.name}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                        <div>
                            <button onClick={handleToggleTypeMode} className="btn btn-netural ml-2 w-full"> {/* Add ml-2 for left margin */}
                                {isTypeInputMode ? 'กลับ' : '+ เพิ่ม'}
                            </button>
                        </div>
                        <div className="col-span-3">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">ชื่อสินค้า*</span>
                                </div>
                                <input
                                    type="text"
                                    value={productname}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Type here"
                                    className="input input-bordered w-full max-w-xs"
                                    required
                                />
                            </label>
                        </div>
                    </div>
                </form>

                <div className="modal-action">
                    <button onClick={InsertProduct} className="btn btn-success text-white">เพิ่มสินค้า</button>
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
            title="สินค้าทั้งหมด"
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
            noDataComponent="ไม่พบสินค้าในระบบ"

        />
    </>
}
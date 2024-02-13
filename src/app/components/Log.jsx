import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

export default function LogsComponents() {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const fethData = async (page) => {
        setLoading(true);

        const response = await axios.post(`/api/log`, {
            page: page,
            per_page: perPage,
            delay: 1,
        });
        console.log(response.data)
        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const handlePageChange = page => {
        fethData(page);
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const response = await axios.post(`/api/log`, {
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

        const response = await axios.post(`/api/log`, {
            page: currentPage,
            per_page: perPage,
            delay: 1,
            search: query, // Add the search query parameter
        });

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    useEffect(() => {
        fethData(1); // fetch page 1 of users
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const columns = [
        {
            name: 'วันที่',
            selector: row => {
                // Assuming row.updatedAt is a string in the format "2024-01-30T02:29:42.792Z"
                const dateObject = new Date(row.created_at);
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
            name: 'การทำรายการ',
            selector: row => row.action,
            sortable: true,
        },
        {
            name: 'Lot/Serial Number',
            selector: row => row.lot.lotname,
            sortable: true,
        },
        {
            name: 'รหัสสินค้า',
            selector: row => row.lot.product.id,
            sortable: true,
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.lot.product.productname,
            sortable: true,
        },
        {
            name: 'จำนวน',
            selector: row => {
                return row.quantity <= 0 ? "-" : row.quantity
            },
            sortable: true,
        },

    ];

    return <>
        <input
            type="text"
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
            className="input input-bordered w-full max-w-xs mb-3"
        />

        <DataTable
            title="ประวัติการจัดการสินค้า"
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
            noDataComponent="ไม่มีประวัติการจัดการสินค้า"

        />
    </>
}
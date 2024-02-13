import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FcMenu, FcShipped } from "react-icons/fc";
import Link from "next/link";
import { FaHistory } from "react-icons/fa";
export default function Navbar({ children }) {

    return <div className="drawer lg:drawer-open ">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <label htmlFor="my-drawer-2" className="btn btn-neutral-content drawer-button lg:hidden">
            <FcMenu />
        </label>
        <div className="drawer-content ml-5 mt-5">
            {/* Page content here */}
            {children}
        </div>
        <div className="drawer-side ">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-white text-base-content shadow-md">
                <li><h1 className='text-xl font-bold'><FcShipped size={42} /> StockManagement</h1></li>
                {/* Sidebar content here */}
                <li className='text-base mt-5'><Link href="/"><AiFillHome size={18} /> Dashboard</Link></li>
                <li></li>
                <li className='text-base'><Link href="/log"><FaHistory  size={18} /> Logs</Link></li>
                <li></li>
            </ul>
        </div>
    </div>
}
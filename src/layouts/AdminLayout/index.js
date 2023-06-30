// 空白布局 整个页面都需要自己写

import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useState } from "react";
import * as classNames from "classnames";



const AdminLayout = () => {
    document.title = "Notes Sync Share Admin"
    const navigate = useNavigate();

    const [activeMenu, setActiveMent] = useState("dashboard");

    const switchMenu = (menu) => {
        navigate(`/admin/${menu}`)
        setActiveMent(menu);
    }
    return (
        <div className="h-screen flex flex-col bg-base-200">
            <Header></Header>
            <div className="flex-1 flex">
                <ul className="menu  w-56 h-full rounded-r-md">
                    <li><a className={`${activeMenu == "dashboard" ? "active" : ""}`} onClick={() => switchMenu("dashboard")}>Dashboard</a></li>
                    <li ><a className={`${activeMenu == "notes" ? "active" : ""}`} onClick={() => switchMenu("notes")}> Notes</a></li>
                    <li><a className={`${activeMenu == "gitConfig" ? "active" : ""}`} onClick={() => switchMenu("gitConfig")}>Git Config</a></li>
                </ul>
                <div className="p-4 bg-base-200 w-full"><Outlet></Outlet></div>
            </div>
            <Footer></Footer>
        </div>
    );
};
export default AdminLayout;

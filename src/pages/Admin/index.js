import { Outlet } from "react-router-dom";

export default function Admin() {
    return <div className="flex-1 ">
        <ul className="menu bg-base-200 w-56 h-full rounded-r-md">
            <li><a>Dashboard</a></li>
            <li ><a className="active"> Notes</a></li>
            <li><a>Git Config</a></li>
        </ul>
        <Outlet></Outlet>
    </div>
}
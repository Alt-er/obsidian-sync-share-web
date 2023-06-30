// 空白布局 整个页面都需要自己写

import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";


const ShareLayout = () => {
    return (
        <>
            <Header></Header>
            <Outlet />
            <Footer></Footer>
        </>
    );
};


export default ShareLayout;

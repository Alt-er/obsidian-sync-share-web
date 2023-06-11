// 空白布局 整个页面都需要自己写

import { useState } from "react";
import { Outlet } from "react-router-dom";

import NavMain from "@/layouts/ManagerLayout/NavMain";

import styles from "./index.less";
import TopHeader from "./TopHeader";

const ManagerLayout = (props) => {
    console.log("重新渲染");

    return (
        <div className={styles.cosyvManager}>
            <TopHeader />
            <NavMain />
            <div className={styles.navShadow} />
            <div className={styles.cosyvMain}>
                <div className={styles.cosyvContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ManagerLayout;

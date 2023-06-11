import { BlockOutlined, CaretDownOutlined, DesktopOutlined, DownOutlined, FileTextOutlined, LoginOutlined, MessageOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { message, Tooltip } from "antd";
import classNames from "classnames";
import { copy } from "clipboard";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import CosyDropdown from "@/components/CosyDropdown";
import { userInfoAtom } from "@/recoil/user";
import { notificationAnnouncement } from "@/services/manager";
import { useRequest } from "@/utils/request";

import styles from "./index.less";

const headerImgArr = [
    {
        imgText: `${process.env.STATIC_BASE}/manager/lbText1.png`,
        img: `url(${process.env.STATIC_BASE}/manager/lb1.png)`,
    },
    {
        imgText: `${process.env.STATIC_BASE}/manager/lbText2.png`,
        img: `url(${process.env.STATIC_BASE}/manager/lb2.png)`,
    },
    {
        imgText: `${process.env.STATIC_BASE}/manager/lbText3.png`,
        img: `url(${process.env.STATIC_BASE}/manager/lb3.png)`,
    },
    {
        imgText: `${process.env.STATIC_BASE}/manager/lbText4.png`,
        img: `url(${process.env.STATIC_BASE}/manager/lb4.png)`,
    },
    {
        imgText: `${process.env.STATIC_BASE}/manager/lbText5.png`,
        img: `url(${process.env.STATIC_BASE}/manager/lb5.png)`,
    },
];

const TopHeader = () => {
    const [displayImgIndex, setDisplayImgIndex] = useState(0);
    const [announcementList, setAnnouncementList] = useState([""]);
    const userId = useRef();
    const imgIntervalRef = useRef();

    const [notificationWrapper, notificationWrapperLoading] = useRequest(notificationAnnouncement);
    const [userInfoData, setUserInfoData] = useRecoilState(userInfoAtom);

    const userMenu = [
        { key: "user", label: "用户中心", icon: <UserOutlined /> },
        { key: "logout", label: "退出", icon: <LoginOutlined /> },
    ];

    const helpMenu = [
        { key: "helpDoc", label: "帮助文档", icon: <FileTextOutlined /> },
        { key: "contact", label: "联系客服", icon: <PhoneOutlined /> },
        { key: "forum", label: "社区论坛", icon: <MessageOutlined /> },
    ];

    const workspaceMenu = [
        { key: "12412412532", label: "默认工作空间", icon: <DesktopOutlined /> },
        // { key: "add", label: "新建与管理" },
    ];
    /**
     * 图片轮播
     */
    useEffect(() => {
        if (headerImgArr.length > 1) {
            const id = setTimeout(() => {
                setDisplayImgIndex((displayImgIndex + 1) % 6);
            }, 5000);
            imgIntervalRef.current = id;
            return () => clearTimeout(imgIntervalRef.current);
        }
    }, [displayImgIndex]);

    useEffect(() => {
        const res1 = notificationWrapper();
        res1.then((r) => {
            const { data, status } = r;
            if (status == 200 && data) {
                setAnnouncementList(data);
            } else {
                message.error(data);
            }
        });
    }, []);
    const menuClick = (key) => {
        console.log(key);
        switch (key) {
            case "add":
                // 新建工作空间
                console.log("新建工作空间");
                window.open("/visual/manager/workspace");
                break;
            case "user":
                window.open("/visual/manager/userContent");
                break;
            case "logout":
                window.location.href = "/logout";
                break;
            default:
                break;
        }
    };

    // console.log("Header渲染了");
    return (
        <div>
            <div className={styles.cosyvHeader}>
                <div className={styles.cosyvHeader}>
                    <div className={styles.logo}>
                        {announcementList && announcementList.length > 0 ? (
                            <div className={styles.topTip}>
                                <strong className={styles.tipStrong}>公告</strong>
                                <div className={styles.cosyvMarquee}>
                                    <span className={styles.content} style={{ animationDuration: "50s" }} title={announcementList[0]}>
                                        {announcementList[0]}
                                        <span className={styles.contentSpace} />
                                        {announcementList[0]}
                                        <span className={styles.contentSpace} />
                                        {announcementList[0]}
                                        <span className={styles.contentSpace} />
                                    </span>
                                </div>
                            </div>
                        ) : undefined}
                    </div>
                    <div className={styles.user}>
                        <CosyDropdown
                            onClick={({ key }) => menuClick(key)}
                            overlay={workspaceMenu}
                            arrow={{ pointAtCenter: true }}
                        // placement="bottomLeft"
                        >
                            <div className={styles.headerItem}>
                                <BlockOutlined style={{ color: `#2681ff` }} />
                                <span className={styles.userName} title="默认工作空间">
                                    默认工作空间
                                </span>
                                <CaretDownOutlined />
                            </div>
                        </CosyDropdown>
                        <CosyDropdown
                            onClick={({ key }) => menuClick(key)}
                            overlay={userInfoData.userid && userInfoData.userid == "admin" ? userMenu : userMenu.slice(1)}
                            arrow={{ pointAtCenter: true }}
                            customdom={
                                <div className={styles.userInfo}>
                                    <div className={styles.field}>用户ID</div>
                                    <Tooltip overlayClassName="cosyvToolTip" color="#1b3964" title="点击复制" placement="left">
                                        <div
                                            className={styles.val}
                                            ref={userId}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copy(e.target.innerText);
                                                message.success("复制成功");
                                            }}
                                        >
                                            {userInfoData.userid}
                                        </div>
                                    </Tooltip>
                                </div>
                            }
                        >
                            <div className={styles.headerItem}>
                                <DownOutlined style={{
                                    color: `#fff`,
                                    background: `#fa9c3a`,
                                    borderRadius: `50%`,
                                    overflow: `hidden`,
                                    padding: `2px`
                                }} />
                                {/* <DownOutlined /> */}
                                <span className={styles.userName} title={userInfoData.name}>
                                    {userInfoData.name}
                                </span>
                                <CaretDownOutlined style={{ verticalAlign: "middle" }} />
                            </div>
                        </CosyDropdown>

                        <CosyDropdown overlay={helpMenu} arrow={{ pointAtCenter: true }}>
                            <div className={styles.headerItem}>
                                <span className={styles.userName}>帮助</span>
                                <CaretDownOutlined style={{ verticalAlign: "middle" }} />
                            </div>
                        </CosyDropdown>
                    </div>
                </div>
            </div>
            {headerImgArr && headerImgArr?.length > 0 ? (
                <div className={styles.cosyvNav}>
                    {headerImgArr.map((item, index) => (
                        <div key={index} className={classNames(styles.headImg, index == displayImgIndex ? styles.navShow : styles.navHide)}>
                            <img className={styles.navImgText} src={item.imgText} alt="" />
                            <div className={styles.navImg} style={{ backgroundImage: item.img }} />
                        </div>
                    ))}
                    {headerImgArr?.length > 1 ? (
                        <ul className={styles.navUl}>
                            {headerImgArr.map((item, index) => (
                                <li key={index} className={styles.navLi}>
                                    <span onClick={() => setDisplayImgIndex(index)} className={classNames(styles.navSpan, index == displayImgIndex ? styles.navAnimation : styles.navBlank)} />
                                </li>
                            ))}
                        </ul>
                    ) : undefined}
                </div>
            ) : undefined}
        </div>
    );
};

export default TopHeader;

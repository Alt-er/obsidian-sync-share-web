import { AccountBookOutlined, AppstoreAddOutlined, BankOutlined, DownOutlined, LaptopOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, NavLink, useLocation } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";

import { notificationAnnouncement } from "@/services/manager";
import { useRequest } from "@/utils/request";

import styles from "./index.less";

const opt = {};
let initialVal = true;
const routerData = [
    {
        pathname: "/manager/project",
    },
    {
        pathname: "/manager/data",
    },
    {
        pathname: "/manager/com",
    },
    {
        pathname: "/manager/case",
    },
];
const NavMain = () => {
    console.log("Header渲染了");
    const location = useLocation();
    if (initialVal) {
        opt.currentIndex = routerData.findIndex((item) => item.pathname == location.pathname);
        initialVal = false;
    }

    const jValue = 0.85;
    const kValue = 10;
    const lValue = 4;

    console.log(location);
    // canvas导航
    const calcTabs = () => {
        const link = document.querySelectorAll(".nav-main .nav-span");
        const arr = [];
        let num = 0;
        link.forEach((item) => {
            arr.push(num);
            num += item.offsetWidth;
        });

        arr[0] = -20;
        arr.push(num);
        opt.tabWidthList = arr;
        opt.tabHeight = link[0].offsetHeight + 0;
        opt.height = opt.tabHeight + 20;
        opt.width = window.innerWidth;
    };
    const initCanvas = (canvas, width, height) => {
        const { devicePixelRatio } = window;
        const canvasObj = canvas.getContext("2d");
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvasObj.scale(devicePixelRatio, devicePixelRatio);
    };
    const createPattern = (canvas) => {
        const num1 = 140;
        const num2 = 63;
        const num3 = 1;
        let canvasDom = document.createElement("canvas");
        canvasDom.width = num1;
        canvasDom.height = num2;
        canvasDom.style.width = `${num1 / num3}px`;
        canvasDom.style.height = `${num2 / num3}px`;
        const canvasContext = canvasDom.getContext("2d");
        canvasContext.scale(1, 1);
        canvasContext.lineWidth = 0.4;
        for (let g = 3, h = 0.8, j = 1; j < 30; j++) {
            // 设置或返回用于笔触的颜色、渐变或模式
            canvasContext.strokeStyle = `RGBA(22, 120, 160, ${h})`;
            // 开始一条路径
            canvasContext.beginPath();
            // 把路径移动到画布中的指定点，不创建线条
            canvasContext.moveTo(0, j * g);
            // 添加一个新点，然后在画布中创建从该点到最后指定点的线条
            canvasContext.lineTo(num1, j * g);
            // 绘制已定义的路径
            canvasContext.stroke();
            // 创建从当前点回到起始点的路径
            canvasContext.closePath();
            if (j > 10) h -= 0.1;
        }
        const i = canvas.getContext("2d").createPattern(canvasDom, "repeat-x");
        opt.pattern = i;
        canvasDom = null;
    };
    const getCurSpeed = (aNum, bNum) => {
        const c = Math.abs(aNum) > Math.abs(jValue * bNum) ? lValue * opt.avgSpeed : kValue * opt.avgSpeed;
        return c;
    };
    const calCurve = (aNum, bNum, cNum, dNum, eNum, fNum) => {
        eNum.bezierCurveTo(aNum + fNum, bNum, cNum - fNum, dNum, cNum, dNum);
    };
    const draw2 = (canvasObj, trueorfalse) => {
        const navindex = opt.currentIndex;
        const tableHeight = opt.tabHeight;
        const fNum = 0;
        const gNum = 40;
        const iNum = 20;
        const jNum = 0.5;
        const kNum = 2.5;
        let lNum = 0;
        canvasObj.beginPath();
        canvasObj.moveTo(-50, opt.height + 10);
        canvasObj.lineTo(-50, tableHeight + jNum);
        if (opt.animating) {
            const m = getCurSpeed(opt.curDisX, opt.distance);
            lNum = Math.min(Math.abs(opt.distance), Math.abs(opt.curDisX + m)) * Math.sign(m);
        }
        canvasObj.lineTo(fNum + opt.tabWidthList[navindex] + lNum - gNum / 2, tableHeight + jNum);
        calCurve(fNum + opt.tabWidthList[navindex] + lNum - gNum / 2, tableHeight + jNum, fNum + opt.tabWidthList[navindex] + lNum + gNum / 2, kNum + jNum, canvasObj, iNum);
        if (opt.animating) {
            const o = opt.tabWidthList[opt.nextIndex + 1] - opt.tabWidthList[opt.nextIndex];
            canvasObj.lineTo(fNum + opt.tabWidthList[navindex] + o + lNum - gNum / 2, kNum + jNum);
            calCurve(fNum + opt.tabWidthList[navindex] + o + lNum - gNum / 2, kNum + jNum, fNum + opt.tabWidthList[navindex] + o + lNum + gNum / 2, tableHeight + jNum, canvasObj, iNum);
        } else {
            canvasObj.lineTo(fNum + opt.tabWidthList[navindex + 1] + lNum - gNum / 2, kNum + jNum);
            calCurve(fNum + opt.tabWidthList[navindex + 1] + lNum - gNum / 2, kNum + jNum, fNum + opt.tabWidthList[navindex + 1] + lNum + gNum / 2, tableHeight + jNum, canvasObj, iNum);
        }
        canvasObj.lineTo(opt.width + 10, tableHeight + jNum);
        canvasObj.lineTo(opt.width + 10, opt.height + 10);
        canvasObj.closePath();
        canvasObj.stroke();
        if (trueorfalse) canvasObj.fill();
        if (opt.animating && trueorfalse) opt.curDisX = lNum;
        if (Math.abs(lNum) >= Math.abs(opt.distance)) {
            opt.animating = false;
            opt.currentIndex = opt.nextIndex;
        }
    };
    const drawHightlight = (num) => {
        const canvasContext = opt.canvas.getContext("2d");
        const num1 = 0.3;
        // clearRect 在给定的矩形内清除指定的像素,这里清完了
        canvasContext.clearRect(0, 0, 2 * opt.width, 2 * opt.height);
        canvasContext.shadowColor = "rgba(38, 129, 255, 1)";
        canvasContext.shadowBlur = 5;
        canvasContext.strokeStyle = "#2681ff";
        canvasContext.lineWidth = 0.8;
        canvasContext.fillStyle = "none";
        draw2(canvasContext, false);
        const te = canvasContext.createLinearGradient(0, 0, opt.width, opt.height);
        const num2 = num - num1;
        te.addColorStop(Math.min(1, Math.max(0, 0 + num2)), "rgba(0,0,0,0)");
        te.addColorStop(Math.min(1, Math.max(0, 0 + num2)), "rgba(0,0,0,0)");
        te.addColorStop(Math.min(1, Math.max(0, 0 + num2 + 0.1)), "#8ED6FF");
        te.addColorStop(Math.min(1, 0 + num2 + num1), "#8ED6FF");
        te.addColorStop(Math.min(1, 0 + num2 + num1 + 0.1), "rgba(0,0,0,0)");
        te.addColorStop(1, "rgba(0,0,0,0)");
        canvasContext.lineWidth = 1.5;
        canvasContext.strokeStyle = te;
        canvasContext.fillStyle = opt.pattern;
        draw2(canvasContext, true);
    };
    const draw = (num) => {
        drawHightlight(num);
        opt.timer = requestAnimationFrame(() => {
            draw((num + 0.005) % 1.6);
        });
    };

    const resize = () => {
        if (opt.timer) {
            cancelAnimationFrame(opt.timer);
            calcTabs();
            initCanvas(opt.canvas, opt.width, opt.height);
            draw(0);
        }
    };
    const calcAVGSpeed = (aNum) => {
        let bNum = (lValue * jValue * aNum + kValue * (1 - jValue) * aNum) / (kValue * lValue * 20);
        return (bNum = Math.max(Math.abs(bNum), 2.5) * Math.sign(bNum)), bNum;
    };
    const toggle = (navindex) => {
        if (typeof navindex !== "undefined" && navindex !== opt.currentIndex && opt.tabWidthList && opt.tabWidthList.length && (!opt.animating || navindex !== opt.nextIndex)) {
            opt.animating = true;
            opt.distance = opt.tabWidthList[navindex] - opt.tabWidthList[opt.currentIndex];
            opt.avgSpeed = calcAVGSpeed(opt.distance);
            opt.curDisX = 0;
            opt.nextIndex = navindex;
        }
    };
    useEffect(() => {
        // setTimeout(() => {
        opt.canvas = document.getElementById("canvas");
        calcTabs();
        initCanvas(opt.canvas, opt.width, opt.height);
        createPattern(opt.canvas);
        draw(0);
        // // }, 200);
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize); // 卸载
        };
    }, []);
    // const announcementList = ["1.  「重要通知」DataV 线上数据库将于12.28 晚 8 点至晚 10 点期间进行升级维护，请尽量避开该时段，感谢您的理解 2. DataV 「新版4.0」已重磅发布 3. DataV 仅支持谷歌 Chrome 浏览器版本 56 以上。 4. 用户使用中如遇到问题，推荐直接提交工单。也可前往钉钉群提问，钉钉群号：21931738 。"];

    return (
        <div className={classNames(styles.navMain, "nav-main")}>
            <canvas id="canvas" style={{ position: "absolute", left: `0px`, zIndex: -1 }} />
            <span
                className={classNames("nav-span", styles.navSpan)}
                onClick={() => {
                    toggle(0);
                }}
            >
                <NavLink
                    to="/manager/project"
                    // className={classNames(styles.navLink)}
                    className={({ isActive }) => (isActive ? classNames(styles.navLink, styles.activeNavLink) : styles.navLink)}
                    style={() => {
                        if (location?.pathname == "/manager" || location?.pathname == "/manager/") {
                            return {
                                color: "#fff",
                            };
                        }
                    }}
                >
                    <BankOutlined className={styles.icon} />
                    我的可视化
                </NavLink>
            </span>
            <span
                className={classNames("nav-span", styles.navSpan)}
                onClick={() => {
                    toggle(1);
                }}
            >
                <NavLink
                    to="/manager/data"
                    className={({ isActive }) => (isActive ? classNames(styles.navLink, styles.activeNavLink) : styles.navLink)}
                    // style={(isActive) => ({ color: isActive ? 'red' : '#fff' })}
                >
                    <BankOutlined className={styles.icon} />
                    我的数据
                </NavLink>
            </span>
            <span
                className={classNames("nav-span", styles.navSpan)}
                onClick={() => {
                    toggle(2);
                }}
            >
                <NavLink
                    to="/manager/com"
                    className={({ isActive }) => (isActive ? classNames(styles.navLink, styles.activeNavLink) : styles.navLink)}
                    // style={(isActive) => ({ color: isActive ? 'red' : '#fff' })}
                >
                    <BankOutlined className={styles.icon} />
                    我的资产
                </NavLink>
            </span>
            <span
                className={classNames("nav-span", styles.navSpan)}
                onClick={() => {
                    toggle(3);
                }}
            >
                <NavLink to="/manager/case" className={({ isActive }) => (isActive ? classNames(styles.navLink, styles.activeNavLink) : styles.navLink)}>
                    <BankOutlined className={styles.icon} />
                    教程
                </NavLink>
            </span>
        </div>
    );
};

export default NavMain;

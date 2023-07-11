import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { pluginSourceCodeUrl, serverVersion } from "../../../github";
import { useThemeStore } from "@/store/theme";
import { shallow } from "zustand/shallow";

const SystemIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
        />
    </svg>
);

const MoonIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
    </svg>
);

const SunIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
    </svg>
);

const themeIcons = {
    light: (
        <>
            <SunIcon className="w-5 h-5 text-base mr-1"></SunIcon>
        </>
    ),
    dark: (
        <>
            <MoonIcon className="w-5 h-5 text-base mr-1"></MoonIcon>
        </>
    ),
    system: (
        <>
            <SystemIcon className="w-5 h-5 text-base mr-1"></SystemIcon>
        </>
    ),
};

export default function Header() {
    const [userSelectedTheme, setUserSelectedTheme] = useThemeStore(({ userSelectedTheme, setUserSelectedTheme }) => [userSelectedTheme, setUserSelectedTheme], shallow);

    const [isLatestVersion, setIsLatestVersion] = useState(true);

    useEffect(() => {
        try {
            (async () => {

                // 从 share.cosy.plus 获取版本信息
                const res = await fetch("https://share.cosy.plus/api/user/getNewVersion");
                const json = await res.json();

                const { version } = json;
                if (serverVersion === version) {
                    // console.info("Currently the latest version")
                } else {
                    // console.info("Currently not the latest version")
                    setIsLatestVersion(false);
                }

                // 暂时不用后台查询方法,因为docker hub 被墙了
                // const res = await fetch("/api/user/getNewVersion");
                // const json = await res.json();
                // const [letest, newVersion] = json.results;
                // if (serverVersion.endsWith(letest.name) || serverVersion.endsWith(newVersion.name)) {
                //     // console.info("Currently the latest version")
                // } else {
                //     // console.info("Currently not the latest version")
                //     setIsLatestVersion(false);
                // }
            })()
        } catch (e) {
            console.error("getNewVersion error", e);
        }

    }, [])

    return (
        <div className="navbar bg-base-200 sticky top-0 z-50">
            <div className="flex-1">
                <div className="indicator ">
                    <span className={`indicator-item badge badge-warning top-2 ${isLatestVersion ? "hidden" : ""}`}>new</span>
                    <a href="https://hub.docker.com/r/alterzz/obsidian-sync-share-server/tags" target="_blank" className="btn btn-ghost normal-case text-xl">Notes Share</a>
                </div>
            </div>
            <div className="flex justify-end flex-1 px-2">
                <div className="flex items-stretch">
                    <a className="btn btn-ghost rounded-btn" href={pluginSourceCodeUrl}>
                        <svg viewBox="0 0 16 16" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                        <span className="hidden sm:inline">GITHUB</span>
                    </a>
                    <div className="dropdown dropdown-end">
                        <label tabIndex="0" className="btn btn-ghost rounded-btn ">
                            {themeIcons[userSelectedTheme]}
                            <span className="hidden sm:inline">{userSelectedTheme}</span>
                        </label>
                        <ul tabIndex="0" className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                            <li>
                                <a
                                    className={userSelectedTheme == "light" ? " active " : ""}
                                    onClick={() => {
                                        setUserSelectedTheme("light");
                                    }}
                                >
                                    {themeIcons["light"]}Light
                                </a>
                            </li>
                            <li>
                                <a
                                    className={userSelectedTheme == "dark" ? " active" : ""}
                                    onClick={() => {
                                        setUserSelectedTheme("dark");
                                    }}
                                >
                                    {themeIcons["dark"]}Dark
                                </a>
                            </li>
                            <li>
                                <a
                                    className={userSelectedTheme == "system" ? " active " : ""}
                                    onClick={() => {
                                        setUserSelectedTheme("system");
                                    }}
                                >
                                    {themeIcons["system"]}System
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
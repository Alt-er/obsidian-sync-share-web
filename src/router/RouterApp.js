import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";

import NoAuth from "@/pages/403";
import LoadingPage from "@/pages/LoadingPage";
// import { userInfoAtom } from "@/recoil/user";
// import { userInfo } from "@/services/manager";
// import { useRequest } from "@/utils/request";

import routerConfig from "./routerConfig";

const fallbackStyle = { paddingTop: 100, textAlign: "center" };
export default function RouterApp() {
    // const [userInfoData, setUserInfoData] = useRecoilState(userInfoAtom);

    // const [initUser, setInitUser] = useState(true);
    // const [auth, setAuth] = useState(true);
    // const [userInfoWrapper, userInfoWrapperLoading] = useRequest(userInfo);
    // useEffect(() => {
    //     const res = userInfoWrapper();
    //     res.then((r) => {
    //         const { data, status } = r;
    //         if (status == 200 && data) {
    //             if (!data.userid) {
    //                 setAuth(false);
    //             } else {
    //                 setUserInfoData(data);
    //             }
    //         } else {
    //             setAuth(false);
    //         }
    //         setInitUser(false);
    //     });
    // }, []);
    // if (initUser) {
    //     return (
    //         <LoadingPage />
    //     );
    // }
    const auth = true;
    const element = useRoutes(routerConfig);
    return auth ? <React.Suspense fallback={<LoadingPage />}>{element}</React.Suspense> : <NoAuth />;
}

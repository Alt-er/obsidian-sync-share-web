import BlankLayout from "@/layouts/BlankLayout";
import ShareLayout from "@/layouts/ShareLayout";
import Home from "@/pages/Home";
import Share from "@/pages/Share";
import TsTest from "@/pages/TsTest";
import React from "react";
import { Navigate } from "react-router-dom";

// const MyCase = React.lazy(() => import("@/pages/Manager/MyCase"));
// const MyComs = React.lazy(() => import("@/pages/Manager/MyComs"));
// const MyData = React.lazy(() => import("@/pages/Manager/MyData"));
// const MyProject = React.lazy(() => import("@/pages/Manager/MyProject"));
// 异步加载会导致nav导航动画失效 暂时这样写
// import MyCase from "@/pages/Manager/MyCase";
// import MyComs from "@/pages/Manager/MyComs";
// import MyData from "@/pages/Manager/MyData";
// import MyProject from "@/pages/Manager/MyProject";

// import RouterTestComp1 from "@/pages/RouterTestComp1";
// import RouterTestHome from "@/pages/RouterTestHome";

// 异步加载组件，避免首页加载过慢
// const Manager = React.lazy(() => import("@/pages/Manager"));
// const ManagerLayout = React.lazy(() => import("@/layouts/ManagerLayout"));

// const DataSource = React.lazy(() => import("@/pages/Manager/MyData/DataSetManager/DataSource"));
// const CreateScreen = React.lazy(() => import("@/pages/Manager/MyProject/CreateScreen"));
// const Workspace = React.lazy(() => import("@/pages/Manager/Workspace"));
// const UserContent = React.lazy(() => import("@/pages/Manager/UserContent"));
// const Designer = React.lazy(() => import("@/pages/Designer"));
// const RendererWarpper = React.lazy(() => import("@/pages/RendererWarpper"));
// const ShareWarpper = React.lazy(() => import("@/pages/ShareWarpper"));
// const BlankLayout = React.lazy(() => import("@/layouts/BlankLayout"));
const NoFoundPage = React.lazy(() => import("@/pages/404"));

// const Home = isProduction ? React.lazy(() => import('@/pages/404')) : require('@/pages/404').default;

// 平级路由 只需要 path 和 element

// 嵌套路由 需要多一个children属性 , 并且父组件中必须渲染  <Outlet /> ,此时父节点的element相当于子节点的容器，可以实现布局

// api
// useParams 获取url参数
// const navigate = useNavigate(); 调整url 传参 navigate("/dd" , {replace:true,state:1})
// let location = useLocation(); 获取url 和参数 const {state} =location

export default [
    {
        path: "/",
        element: <Navigate to="/share/welcome/index" />,
    },
    {
        path: "/share/:username/:shareLinkId",
        element: <ShareLayout />,
        children: [{ index: true, element: <Share /> }],
    },

    // {
    //     path: "/tstest", // 主页
    //     element: <BlankLayout />,
    //     children: [{ index: true, element: <TsTest /> }],
    // },
    { path: "404", element: <NoFoundPage /> },
    { path: "*", element: <NoFoundPage /> },
];

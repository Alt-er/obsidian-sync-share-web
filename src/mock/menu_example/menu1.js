import MOCK from "mockjs";

MOCK.mock("/cosy/menuTest1", "get", {
    status: 200,
    message: "success",
    data: [{ name: "首页" }, { name: "个人中心" }],
});

MOCK.mock("/cosy/menuTest3", "post", {
    status: 200,
    message: "success",
    data: [{ name: "首页" }, { name: "个人中心" }],
});

MOCK.mock("/cosy/menuTest3", {
    status: 200,
    message: "success",
    data: [{ name: "首页" }, { name: "个人中心" }],
});

MOCK.mock("/cosy/menuTest4", (options) => {
    console.info("options:", options);
    return {
        status: 200,
        message: "success",
        data: [{ name: "首页" }, { name: "个人中心" }],
    };
});

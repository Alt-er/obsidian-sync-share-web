// 只有开发环境 并且允许Mock才启用
if (process.env.NODE_ENV === "development" && process.env.MOCK === true) {
    import("./mock");
}

import("./bootstrap");

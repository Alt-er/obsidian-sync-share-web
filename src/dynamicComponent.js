import React from "react";

// 获取执行环境
// console.info(process.env.NODE_ENV);

// 改造版本  不用一直刷新页面
async function loadComponent(scope, module) {
    // return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    // eslint-disable-next-line camelcase
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
    //  };
}

// const remoteComponentInfo = {
//     url: "http://localhost:3002/remoteEntry.js",
//     scope: "components",
// };

// const remoteRendererInfo = {
//     url: "http://localhost:3001/remoteEntry.js",
//     scope: "renderer",
// };

let remoteComponentInfo = null;

let remoteRendererInfo = null;

const CONFIG_URL = `/cosy/mfConfig${process.env.NODE_ENV === "development" ? "?mode=development" : ""}`;

async function loadRemoteConfig() {
    const res = await fetch(CONFIG_URL);
    const json = await res.json();
    if (json.status == 200) {
        const { data } = json;
        remoteComponentInfo = data.remoteComponentInfo;
        remoteRendererInfo = data.remoteRendererInfo;
        window.loadedDynamicComponentConfig = { remoteComponentInfo, remoteRendererInfo };
    }
}

async function loadLocalConfig(loadedDynamicComponentConfig) {
    remoteComponentInfo = loadedDynamicComponentConfig.remoteComponentInfo;
    remoteRendererInfo = loadedDynamicComponentConfig.remoteRendererInfo;
}

async function loadScript(url) {
    return new Promise((r) => {
        // load script
        const element = document.createElement("script");
        element.src = url;
        element.type = "text/javascript";
        element.async = true;

        element.onload = () => {
            console.log(`Dynamic Script Loaded: ${url}`);
            r();
        };

        element.onerror = () => {
            console.error(`Dynamic Script Error: ${url}`);
        };

        document.head.appendChild(element);
    });
}

async function loadAllScript() {
    await loadRemoteConfig();
    await loadScript(remoteComponentInfo.url);
    await loadScript(remoteRendererInfo.url);
}

// 看看本地是否已经加载过配置了 ，加载过就直接使用
const { loadedDynamicComponentConfig } = window;
const loadAllScriptPromise = loadedDynamicComponentConfig ? loadLocalConfig(loadedDynamicComponentConfig) : loadAllScript();

const loadedComponentConfig = {};
const loadedComponentRender = {};
let loadedRenderer = null;

/**
 * 加载远程组件配置
 * @param {*} type
 * @param {*} version
 * @returns
 */
export const loadRemoteComponentConfig = async (type, version) => {
    const module = `./${type}/${version}/config`;
    const config = loadedComponentConfig[module];
    if (config) {
        return config;
    }
    await loadAllScriptPromise;
    const loadedConfig = await loadComponent(remoteComponentInfo.scope, module);
    loadedComponentConfig[module] = loadedConfig.default;
    return loadedConfig.default;
};

/**
 * 加载远程组件
 * @param {*} type
 * @param {*} version
 * @returns
 */
export const loadRemoteComponentRender = (type, version) => {
    const module = `./${type}/${version}/render`;
    const render = loadedComponentRender[module];
    if (render) {
        return render;
    }
    const s = async () => {
        await loadAllScriptPromise;
        const loadedRender = await loadComponent(remoteComponentInfo.scope, module);
        return loadedRender;
    };
    const comp = React.lazy(s);
    loadedComponentRender[module] = comp;
    return comp;
};

/**
 * 加载远程渲染器
 * @param {*} type
 * @param {*} version
 * @returns
 */
export const loadRemoteRenderer = () => {
    if (loadedRenderer) {
        return loadedRenderer;
    }
    const module = `./renderer`;
    const s = async () => {
        await loadAllScriptPromise;
        const loadedRendererTemp = await loadComponent(remoteRendererInfo.scope, module);
        return loadedRendererTemp;
    };
    const comp = React.lazy(s);
    loadedRenderer = comp;
    return comp;
};

// export const loadDynamicComponent = async (module) => {
//     const asyncComp = loadedComponents[module];
//     if (asyncComp) {
//         return asyncComp;
//     }
//     // cache
//     await loadScriptPromise;
//     const loadedAsyncComp = await loadComponent(loadConfig.scope, module);
//     loadedComponents[module] = loadedAsyncComp.default;
//     return loadedAsyncComp.default;
// };

// export default loadDynamicComponent;

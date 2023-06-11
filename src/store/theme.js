import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

// 系统选择主题
const media = window.matchMedia("(prefers-color-scheme:dark)");
const systemDefaultSelectedTheme = media.matches ? "dark" : "light";
const userDefaultSelectedTheme = "system";

export const useThemeStore = create(
    subscribeWithSelector((set) => ({
        systemSelectedTheme: systemDefaultSelectedTheme,
        userSelectedTheme: userDefaultSelectedTheme,
        // setSystemSelectedTheme: (theme) => set(() => ({ systemSelectedThem: theme })),
        setUserSelectedTheme: (theme) => set(() => ({ userSelectedTheme: theme })),
    }))
);

media.onchange = (m) => {
    useThemeStore.setState({ systemSelectedTheme: m.matches ? "dark" : "light" });
};

// 计算应该使用的主题
const calculateUsedTheme = (systemSelectedTheme, userSelectedTheme) => {
    if (userSelectedTheme == "system") {
        return systemSelectedTheme;
    } else {
        return userSelectedTheme;
    }
};

// 获取当前在使用的主题
export const useUsedTheme = () => {
    return useThemeStore(({ systemSelectedTheme, userSelectedTheme }) => {
        return calculateUsedTheme(systemSelectedTheme, userSelectedTheme);
    });
};

// 订阅状态
useThemeStore.subscribe(
    ({ systemSelectedTheme, userSelectedTheme }) => [systemSelectedTheme, userSelectedTheme],
    ([systemSelectedTheme, userSelectedTheme]) => {
        document.documentElement.setAttribute("data-theme", calculateUsedTheme(systemSelectedTheme, userSelectedTheme));
    },
    { equalityFn: shallow }
);

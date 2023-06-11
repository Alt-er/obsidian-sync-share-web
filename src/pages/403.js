import { Button, Result } from "antd";
import React from "react";

const NoAuth = () => {

    return (
        <Result
            status="403"
            title="访问失败！"
            subTitle="对不起，当前登陆的用户暂无此页面的访问权限。"
            extra={
                <Button type="primary" onClick={() => window.location.href = "/logout"}>
                    退出登录
                </Button>
            }
        />
    );
};

export default NoAuth;

// 无用！！！



import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Screen from "./Screen";

const Renderer = (props) => {
    // 获取浏览器参数
    const [treeData, setTreeData] = useState();
    const params = useParams();
    useEffect(() => {
        // 页面刷新加载组件数据
        const id = parseInt(params.id, 10);
        if (id > 0) {
            (async () => {
                const res = await fetch("/cosy/getScreen", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8;",
                    },
                    body: JSON.stringify({ id }),
                });
                const json = await res.json();
                if (json.status === 200) {
                    setTreeData(JSON.parse(json.data.mainData));
                }
            })();
        }
    }, [params.id]);

    // return treeData ? <Screen treeData={treeData} /> : <div>loading</div>;
};

export default Renderer;

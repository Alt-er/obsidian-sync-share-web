import request from "@/utils/request";

// export async function getMenuTest2() {
//     return request({
//         url: "/cosy/menuTest2",
//         method: "post",
//         data: {
//             name: 1,
//         },
//     });
// }

// export default null;

export default async function getMenuTest2(url, method, headers, data) {
    console.log(url, method, headers, data);
    return request({
        url,
        method,
        headers,
        data,
    });
}

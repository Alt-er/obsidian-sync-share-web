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

export default async function getNoteContent(username, shareLinkId, link) {
    return fetch(`/api/share/content/${username}/${shareLinkId}${link ? "?link=" + link : ""}`, { method: "GET" }).then(async (res) => [
        decodeURIComponent(res.headers.get("title")),
        await res.text(),
    ]);
}

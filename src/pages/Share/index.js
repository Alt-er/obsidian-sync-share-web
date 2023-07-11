import getNoteContent from "@/services/share";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useUsedTheme } from "@/store/theme";

const Image = ({ src, alt }) => {
    if (src && (src.endsWith("jpg") || src.endsWith("png") || src.endsWith("gif") || src.endsWith("webp") || src.endsWith("bmp"))) {
        return <img src={src} alt={alt}></img>;
    } else {
        return (
            // <a className="link" href={src}>
            //     {decodeURIComponent(src.split("?link=").pop())}
            // </a>
            <button
                className="btn btn-block btn-sm m-1"
                onClick={() => {
                    window.open(src);
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                </svg>

                {decodeURIComponent(src.split("?link=").pop().split("/").pop())}
            </button>
        );
    }
};
function createTree(outlineOrigin) {
    const outline = [...outlineOrigin];
    const tree = [];

    function addToTree(i, pi, children) {
        if (i >= outline.length) {
            return -1;
        }
        const item = outline[i];
        const parent = outline[pi];
        const newItem = { text: item.text, children: [], position: item.position, delete: item.delete };
        if (!parent) {
            children.push(newItem);
        } else {
            if (item.depth > parent.depth) {
                children.push(newItem);
            } else {
                return i;
            }
        }

        const index = addToTree(i + 1, i, newItem.children);
        if (index != -1) {
            return addToTree(index, pi, children)
        }
        return -1;
    }

    if (outline.length <= 0) {
        return tree;
    }

    addToTree(0, -1, tree);
    return tree;
}
function createMenuItem(tree) {


    return tree.map(t => {
        const id = "outline-" + t.position.start.offset + "-" + t.position.end.offset
        const click = (e) => {
            e.preventDefault();
            const href = "#id-" + t.position.start.offset + "-" + t.position.end.offset
            setTimeout(() => {
                location.href = href;
                const classList = document.querySelector(href).classList
                classList.add("bg-yellow-400");
                classList.add("transition-all");
                setTimeout(() => {
                    classList.remove("bg-yellow-400");
                    classList.remove("transition-all")
                }, 1200);
            }, 0)
        }
        const text = t.delete ? <del>{t.text}</del> : t.text
        return t.children.length === 0 ? <li key={id}><a id={id} onClick={click}>{text}</a></li> : <li key={id}>
            <details open>
                <summary id={id}><a onClick={click}>{text}</a></summary>
                <ul className=" flex-nowrap [&>li>*]:auto-cols-auto [&>li>details>summary]:auto-cols-auto [&>li>details>summary>a]:whitespace-normal [&>li>a]:whitespace-normal ">
                    {createMenuItem(t.children)}
                </ul>
            </details>
        </li>
    })

}


function Outline({ outline }) {
    const tree = useMemo(() => createTree(outline), [outline]);

    // console.info(tree)
    useEffect(() => {
        const headings = outline.map((t) => {
            const id = "#id-" + t.position.start.offset + "-" + t.position.end.offset
            return document.querySelector(id);
        }).filter(t => t != null);

        const handleScroll = () => {
            const isElementVisible = (el) => {
                const rect = el.getBoundingClientRect()
                const vWidth = window.innerWidth || document.documentElement.clientWidth
                const vHeight = window.innerHeight || document.documentElement.clientHeight


                if (
                    rect.right < 0 ||
                    rect.bottom < 0 ||
                    rect.left > vWidth ||
                    rect.top > vHeight
                ) {
                    return false
                }

                return true
            }
            let find = null;
            const outlines = [];

            for (let i = 0; i < headings.length; i++) {
                const element = headings[i];
                const [, s, e] = element.id.split("-")
                const id = "#outline-" + s + "-" + e;
                const outlineElement = document.querySelector(id);
                if (!find && isElementVisible(element)) {
                    find = outlineElement;
                }
                outlines.push(outlineElement);
            }

            if (find) {
                outlines.forEach(o => {
                    o.classList.remove('focus');
                })
                find.classList.add('focus')

            }

        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [outline])
    const [showOutlineOnXl, setShowOutlineOnXl] = useState(false);

    return <div>
        <label className="btn btn-circle btn-sm swap swap-rotate xl:hidden  fixed right-0 top-1/3 z-50 p-4 opacity-75 " >

            {/* this hidden checkbox controls the state */}
            <input type="checkbox" onChange={(e) => {
                setShowOutlineOnXl(e.target.checked)
            }} />

            {/* hamburger icon */}
            <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>

            {/* close icon */}
            <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>

        </label>

        <div className={`fixed right-6 ${showOutlineOnXl ? "w-60" : "w-0"} xl:w-60 z-40 rounded-md overflow-y-auto h-[calc(100%-150px)]`}>
            <ul className="menu bg-base-100 text-base-content text-xs flex-nowrap [&>li>*]:auto-cols-auto [&>li>details>summary]:auto-cols-auto [&>li>a]:whitespace-normal">
                {createMenuItem(tree)}
            </ul>
        </div>
    </div>
}



export default function Share() {
    const [searchParams] = useSearchParams();
    const link = searchParams.get("link");
    const { username, shareLinkId } = useParams();

    const [noteContent, setNoteContent] = useState();

    const [outline, setOutline] = useState([]);

    const [title, setTitle] = useState("");

    const theme = useUsedTheme();

    const isDark = theme == "dark";

    // console.info(isDark);

    useEffect(() => {
        (async () => {
            const [title, content] = await getNoteContent(username, shareLinkId, link);
            setNoteContent(content);
            setTitle(title);
            document.title = title;
        })();
    }, [username, shareLinkId, link]);

    const linkTarget = (href, children, title) => {
        return "_blank";
    };
    const transformImageUri = (src, alt, title) => {
        if (src.startsWith("http://") || src.startsWith("https://")) {
            return src;
        } else {
            return `/api/share/content/${username}/${shareLinkId}?link=${src}`;
        }
    };

    const transformLinkUri = (href, children, title) => {
        // console.info(href, children, title);
        if (href.startsWith("http://") || href.startsWith("https://")) {
            return href;
        } else {
            // 如果是md 直接预览
            if (href.endsWith(".md")) {
                return `/share/${username}/${shareLinkId}?link=${href}`;
            }
            return `/api/share/${username}/${shareLinkId}?link=${href}`;
        }
    };

    const markdown = useMemo(() => {


        const remarkOutline = () => {
            return (node) => {
                const outline = [];

                if (node.type === "root" && node.children.length > 0) {
                    node.children.forEach(n => {
                        try {
                            if (n.type === "heading") {
                                let hasDelete = false;

                                const findText = (childrens) => {
                                    return childrens.map(child => {
                                        if (child.type === "text") {
                                            return child.value;
                                        } else if (child.children) {
                                            return findText(child.children)
                                        } else {
                                            return null;
                                        }
                                    }).filter(c => c != null).join(" ");
                                }
                                const text = findText(n.children);
                                outline.push({ depth: n.depth, text, position: n.position, delete: hasDelete });
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    })
                }


                // console.info(JSON.stringify(outline));
                setTimeout(() => setOutline(temp => JSON.stringify(temp) === JSON.stringify(outline) ? temp : outline), 0)
            }
        }
        return <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkOutline]}
            rehypePlugins={[rehypeRaw]}
            linkTarget={linkTarget}
            // allowedElements={["br"]}
            transformImageUri={transformImageUri}
            transformLinkUri={transformLinkUri}
            components={{
                h1: (props) => {
                    const { start, end } = props.node.position;
                    const id = "id-" + start.offset + "-" + end.offset;
                    return <h1 className="text-4xl font-bold my-4" id={id}>{props.children}</h1>;
                },
                h2: (props) => {
                    const { start, end } = props.node.position;
                    const id = "id-" + start.offset + "-" + end.offset;
                    return <h1 className="text-3xl font-bold my-4" id={id}>{props.children}</h1>;
                },
                h3: (props) => {
                    const { start, end } = props.node.position;
                    const id = "id-" + start.offset + "-" + end.offset;
                    return <h1 className="text-2xl font-bold my-4" id={id}>{props.children}</h1>;
                },
                h4: (props) => {
                    const { start, end } = props.node.position;
                    const id = "id-" + start.offset + "-" + end.offset;
                    return <h1 className="text-xl font-bold my-4" id={id}>{props.children}</h1>;
                },
                h5: (props) => {
                    const { start, end } = props.node.position;
                    const id = "id-" + start.offset + "-" + end.offset;
                    return <h1 className="text-lg font-bold my-4" id={id}>{props.children}</h1>;
                },
                h6: (props) => {
                    const { start, end } = props.node.position;
                    const id = "id-" + start.offset + "-" + end.offset;
                    return <h1 className="text-base font-bold my-4" id={id}>{props.children}</h1>;
                },
                p: ({ children }) => {
                    return <p className="text-base my-4">{children}</p>;
                },
                ol: ({ index, ordered, className, children }) => {
                    return <ol className={`list-decimal list-inside my-4 pl-8 ${className}`}>{children}</ol>;
                },
                ul: ({ index, ordered, className, children }) => {
                    return <ul className={`list-disc list-inside my-4 pl-8 ${className}`}>{children}</ul>;
                },
                a: ({ href, children, title, target }) => {
                    return (
                        <a className="link link-primary" href={href} title={title} target={target}>
                            {children}
                        </a>
                    );
                },
                table: ({ children }) => {
                    return (
                        <div className="overflow-x-auto my-4">
                            <table className="table table-sm">{children}</table>
                        </div>
                    );
                },
                img: ({ node, src, alt }) => {
                    return <Image src={src} alt={alt}></Image>;
                },
                blockquote: ({ children }) => {
                    return <blockquote className="border-l-2 border-primary pl-4 bg-base-200">{children}</blockquote>;
                },
                // li: (node, p) => {
                //     //{ children, type, disabled, checked }
                //     console.info(node, p);
                //     const { className, children, checked } = node;
                //     return (
                //         <li className={`${className} list-none`}>
                //             <label className="align-middle cursor-pointer">{children}</label>
                //         </li>
                //     );
                //     // if (type == "checkbox") {
                //     //     return <input type={type} checked={checked} disabled={disabled} className="checkbox checkbox-xs" />;
                //     // }
                //     // return <input type={type} disabled={disabled} />;
                // },
                // input: ({ children, type, disabled, checked }) => {
                //     //{ children, type, disabled, checked }

                //     if (type == "checkbox") {
                //         return <input type={type} checked={checked} disabled={disabled} className="checkbox checkbox-xs" />;
                //     }
                //     return <input type={type} disabled={disabled} />;
                // },
                code({ node, inline, className, children, ...props }) {
                    // console.info(node, inline, className, children);
                    const match = /language-(\w+)/.exec(className || "");

                    // wrapLongLines
                    return !inline ? (
                        <div className="indicator w-full">
                            <SyntaxHighlighter className={"w-full"} showLineNumbers style={isDark ? vscDarkPlus : prism} language={match?.[1]} {...props}>
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                            <div className="indicator-item translate-x-0 translate-y-1 m-2 px-2 rounded-md 
                        bg-base-100 text-base-content border border-base-100 hover:border-base-content"
                            >
                                <CopyToClipboard
                                    text={children.join("\n").toString()}
                                // onCopy={(e, e2) => {
                                //     console.info(e, e2);
                                // }}
                                >
                                    <button
                                        onClick={(e) => {
                                            const target = e.currentTarget;
                                            const text = "Copy";
                                            target.innerText = "Copied";
                                            target.textContent = "Copied";
                                            setTimeout(() => {
                                                target.innerText = text;
                                                target.textContent = text;
                                            }, 1000);
                                        }}
                                    >
                                        Copy
                                    </button>
                                </CopyToClipboard>
                            </div>
                        </div>
                    ) : (
                        <code className={"rounded-md bg-base-300 text-base-content px-1 py-0.5"} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        >
            {noteContent}
        </ReactMarkdown>
    }, [noteContent, isDark])


    return (

        <div className={"mx-auto max-w-screen-md pt-6 px-2 min-h-screen scroll-pt-16"}>
            <Outline outline={outline}></Outline>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            {markdown}
        </div>
    );
}

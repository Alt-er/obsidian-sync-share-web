import getNoteContent from "@/services/share";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

export default function Share() {
    const [searchParams] = useSearchParams();
    const link = searchParams.get("link");
    const { username, shareLinkId } = useParams();

    const [noteContent, setNoteContent] = useState();

    const [title, setTitle] = useState("");

    const theme = useUsedTheme();

    const isDark = theme == "dark";

    console.info(isDark);

    useEffect(() => {
        (async () => {
            const [title, content] = await getNoteContent(username, shareLinkId, link);
            setNoteContent(content);
            setTitle(title);
            document.title = title;
        })();
    });

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
            return `/api/share/${username}/${shareLinkId}?link=${href}`;
        }
    };

    return (
        <div className={"mx-auto max-w-screen-md pt-6 min-h-screen"}>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // rehypePlugins={[rehypeRaw]}
                linkTarget={linkTarget}
                // allowedElements={["br"]}
                transformImageUri={transformImageUri}
                transformLinkUri={transformLinkUri}
                components={{
                    h1: ({ children }) => {
                        return <h1 className="text-4xl font-bold my-4">{children}</h1>;
                    },
                    h2: ({ children }) => {
                        return <h1 className="text-3xl font-bold my-4">{children}</h1>;
                    },
                    h3: ({ children }) => {
                        return <h1 className="text-2xl font-bold my-4">{children}</h1>;
                    },
                    h4: ({ children }) => {
                        return <h1 className="text-xl font-bold my-4">{children}</h1>;
                    },
                    h5: ({ children }) => {
                        return <h1 className="text-lg font-bold my-4">{children}</h1>;
                    },
                    h6: ({ children }) => {
                        return <h1 className="text-base font-bold my-4">{children}</h1>;
                    },
                    p: ({ children }) => {
                        return <p className="text-base my-4">{children}</p>;
                    },
                    ol: ({ index, ordered, checked, className, children }) => {
                        return <ol className="list-decimal list-inside my-4">{children}</ol>;
                    },
                    ul: ({ index, ordered, checked, className, children }) => {
                        return <ol className="list-disc list-inside my-4">{children}</ol>;
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
                    code({ node, inline, className, children, ...props }) {
                        // console.info(node, inline, className, children);
                        const match = /language-(\w+)/.exec(className || "");

                        return !inline ? (
                            <div className="indicator w-full">
                                <SyntaxHighlighter className={"w-full"} showLineNumbers style={isDark ? vscDarkPlus : prism} language={match?.[1]} {...props}>
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                                <div
                                    className="indicator-item translate-x-0 translate-y-1 m-2 px-2 rounded-md 
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
        </div>
    );
}

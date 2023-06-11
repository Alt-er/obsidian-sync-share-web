import React from "react";

const LoadingPage = () => (
    <div
        style={{
            position: `fixed`,
            top: `0`,
            left: `0`,
            width: ` 100%`,
            height: ` 100%`,
            background: `#171b22`,
            zIndex: `2`,
        }}
    >
        <a target="_blank" href="/" rel="noreferrer">
            <img
                style={{
                    position: `absolute`,
                    top: `50%`,
                    left: ` 50%`,
                    transform: `translate(-50%, -50%)`,
                }}
                width="100"
                alt="logo"
                src="/visual/designer/static/loading.gif"
            />
        </a>
    </div>
);

export default LoadingPage;

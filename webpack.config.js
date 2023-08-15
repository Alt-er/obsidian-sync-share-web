const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
// 清空dist文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const { ModuleFederationPlugin } = webpack.container;
const path = require("path");
const packageJson = require("./package.json");

module.exports = (env, argv) => {
    console.info(`${packageJson.name} -> webpack 当前的执行环境: ${process.env.NODE_ENV}`);
    return {
        entry: "./src/index",
        mode: "development",
        optimization: {
            sideEffects: true,
        },
        devServer: {
            static: {
                directory: path.join(__dirname, "static"),
                publicPath: "/static",
            },
            port: 3000,
            // 代理你的服务
            proxy: {
                "/api": {
                    // target: "http://localhost:8080",
                    // target: "https://share.alter.run",
                    target: "http://81.69.233.110:8080",
                    secure: false, // 支持https
                    changeOrigin: true, // 修改host头
                    //pathRewrite: { '^/cosy': '/cosy' }, // 重写路径
                },
            },
            historyApiFallback: true, // 单页应用使用 404时调整到主页
        },
        output: {
            publicPath: "/", // auto
            path: path.resolve(__dirname, "./dist"),
            filename: "bundle.[contenthash].js",
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
            extensions: [".tsx", ".ts", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    type: "javascript/auto",
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.jsx?$/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                    options: {
                        presets: [["@babel/preset-react", { runtime: "automatic" }]],
                        //  "plugins": ["@babel/plugin-transform-regenerator"]
                    },
                },
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: "style-loader", // creates style nodes from JS strings
                        },
                        {
                            loader: "css-loader", // translates CSS into CommonJS
                            options: {
                                modules: {
                                    localIdentName:
                                        // 不同环境显示不同的class名字
                                        argv.mode === "production" ? "[hash:base64]" : "[path][name]__[local]",
                                    exportLocalsConvention: "camelCase",
                                },
                                importLoaders: 1,
                            },
                        },
                        { loader: "postcss-loader" },
                        {
                            loader: "less-loader", // compiles Less to CSS
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    type: "asset",
                    parser: {
                        dataUrlCondition: {
                            maxSize: 4 * 1024, // 小于4k 直接内联资源 否则转为路径
                        },
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Notes Sync Share",
                template: "./template/index.html",
            }),
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                "process.env.MOCK": true, // mock 数据开关 ,不使用的时候设置为false
            }),
            new CopyPlugin({
                patterns: [{ from: "static", to: "static" }],
            }),
            new CleanWebpackPlugin(),
        ],
        // 开发环境推荐4个级别 越下面重新构建速度越快 但是效果越差
        // source-map rebuild最慢 !!! 单独文件 源码展示效果最好        172ms
        // eval-source-map rebuild较慢 !! 合并文件 源码展示效果最好 89ms
        // eval-cheap-module-source-map rebuild快 ! 合并文件 能显示源代码，但无法定位到列 81ms
        // eval-cheap-source-map rebuild快 只能显示Babel转换后的代码 ，并且无法定位到列 64ms
        devtool: process.env.NODE_ENV === "production" ? false : "eval-source-map", // "eval-source-map", // 生产环境不生成 ，开发环境显示源码
    };
};

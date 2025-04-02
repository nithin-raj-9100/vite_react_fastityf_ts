import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import "./style.css";
import typescriptLogo from "/typescript.svg";
import { Header } from "@repo/ui";
import { TodoList } from "./components/TodoList";
var App = function () { return (_jsxs("div", { className: "container", children: [_jsxs("header", { className: "app-header", children: [_jsxs("div", { className: "logo-container", children: [_jsx("a", { href: "https://vitejs.dev", target: "_blank", children: _jsx("img", { src: "/vite.svg", className: "logo", alt: "Vite logo" }) }), _jsx("a", { href: "https://www.typescriptlang.org/", target: "_blank", children: _jsx("img", { src: typescriptLogo, className: "logo vanilla", alt: "TypeScript logo" }) })] }), _jsx(Header, { title: "Todo App with Fastify Backend" })] }), _jsx("main", { className: "app-main", children: _jsx(TodoList, {}) }), _jsx("footer", { className: "app-footer", children: _jsx("p", { children: "Built with Turborepo, React, Fastify & TypeScript" }) })] })); };
createRoot(document.getElementById("app")).render(_jsx(App, {}));

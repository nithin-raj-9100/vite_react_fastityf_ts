var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
var API_URL = import.meta.env.VITE_API_URL || "/api";
export var TodoList = function () {
    var _a = useState([]), todos = _a[0], setTodos = _a[1];
    var _b = useState(""), newTodoTitle = _b[0], setNewTodoTitle = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var fetchTodos = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/todos"))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error fetching todos: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setTodos(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : String(err_1));
                    console.error("Failed to fetch todos:", err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchTodos();
    }, []);
    var handleAddTodo = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var response, newTodo, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!newTodoTitle.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/todos"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ title: newTodoTitle }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error adding todo: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    newTodo = _a.sent();
                    setTodos(__spreadArray(__spreadArray([], todos, true), [newTodo], false));
                    setNewTodoTitle("");
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : String(err_2));
                    console.error("Failed to add todo:", err_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleComplete = function (todo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, updatedTodo_1, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/todos/").concat(todo.id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ completed: !todo.completed }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error updating todo: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    updatedTodo_1 = _a.sent();
                    setTodos(todos.map(function (t) { return (t.id === updatedTodo_1.id ? updatedTodo_1 : t); }));
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    setError(err_3 instanceof Error ? err_3.message : String(err_3));
                    console.error("Failed to update todo:", err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteTodo = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("".concat(API_URL, "/todos/").concat(id), {
                            method: "DELETE",
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error deleting todo: ".concat(response.statusText));
                    }
                    setTodos(todos.filter(function (todo) { return todo.id !== id; }));
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    setError(err_4 instanceof Error ? err_4.message : String(err_4));
                    console.error("Failed to delete todo:", err_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (loading && todos.length === 0) {
        return _jsx("div", { className: "loading", children: "Loading todos..." });
    }
    if (error && todos.length === 0) {
        return (_jsxs("div", { className: "error", children: [_jsxs("p", { children: ["Error: ", error] }), _jsx("button", { onClick: fetchTodos, children: "Try Again" })] }));
    }
    return (_jsxs("div", { className: "todo-list", children: [_jsx("h2", { children: "Todo List" }), _jsxs("form", { onSubmit: handleAddTodo, className: "add-todo-form", children: [_jsx("input", { type: "text", value: newTodoTitle, onChange: function (e) { return setNewTodoTitle(e.target.value); }, placeholder: "Add a new todo...", className: "todo-input" }), _jsx("button", { type: "submit", className: "add-button", children: "Add Todo" })] }), error && _jsx("div", { className: "error-message", children: error }), _jsx("ul", { className: "todos", children: todos.map(function (todo) { return (_jsxs("li", { className: "todo-item ".concat(todo.completed ? "completed" : ""), children: [_jsx("input", { type: "checkbox", checked: todo.completed, onChange: function () { return handleToggleComplete(todo); }, className: "todo-checkbox" }), _jsx("span", { className: "todo-title", children: todo.title }), _jsx("button", { onClick: function () { return handleDeleteTodo(todo.id); }, className: "delete-button", children: "Delete" })] }, todo.id)); }) })] }));
};

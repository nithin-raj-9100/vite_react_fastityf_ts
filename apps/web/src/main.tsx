import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import typescriptLogo from "/typescript.svg";
import { Header } from "@repo/ui";
import { TodoList } from "./components/TodoList";

const App = () => (
  <div className="container">
    <header className="app-header">
      <div className="logo-container">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img
            src={typescriptLogo}
            className="logo vanilla"
            alt="TypeScript logo"
          />
        </a>
      </div>
      <Header title="Todo App with Fastify Backend" />
    </header>

    <main className="app-main">
      <TodoList />
    </main>

    <footer className="app-footer">
      <p>Built with Turborepo, React, Fastify & TypeScript</p>
    </footer>
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);

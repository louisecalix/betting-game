import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./services/SocketContext.tsx";
import "./css/index.css";
import App from "./App.tsx";


createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <SocketProvider>
        <App />
      </SocketProvider>
    </BrowserRouter>
);

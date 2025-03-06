import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./components/App";
import { UserProvider } from "./contexts/UserContext";
import { TargetMonthProvider } from "./contexts/TargetMonthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <TargetMonthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TargetMonthProvider>
    </UserProvider>
  </StrictMode>
);

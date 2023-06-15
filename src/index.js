import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import Error from "./pages/Error";
import ThemeProvider from "./context/themeContext";
import NotificationProvider from "./context/notificationContext";
import UserProvider from "./context/userContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Error />}>
      <ThemeProvider>
        <UserProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

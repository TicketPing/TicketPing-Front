import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../store";
import { Button } from "antd";
import { Logout } from "./Logout";
import "../style/AppLayout.css";

function AppLayout({ children }) {
  const navigate = useNavigate();
  const {
    store: { isAuthenticated },
  } = useAppContext();

  const { handleLogout } = Logout();

  return (
    <div className="app">
      <div className="header">
        <h1 className="page-title">
          <Button
            type="link"
            className="home-button"
            onClick={() => navigate("/")}
          >
            TicketPing
          </Button>
        </h1>

        <div className="topnav">
          <Button
            type="link"
            className="auth-button"
            onClick={() => navigate("/mypage")}
          >
            MyPage
          </Button>
          {isAuthenticated ? (
            <Button type="link" className="auth-button" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button
              type="link"
              className="auth-button"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      <div className="contents">{children}</div>

      <div className="footer">
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <div className="footer-info">
          Copyright ⓒ TicketPing Corp. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

export default AppLayout;

import React, { useEffect, useRef, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DollarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { AiOutlineDashboard } from "react-icons/ai";
import { RiCouponLine, RiUserLine } from "react-icons/ri";
import {
  FaChalkboard,
  FaCalendarAlt,
  FaQuestionCircle,
  FaBlog,
  FaBloggerB,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";
import logoImage from "../Khelo Indore Logo/logo.png";
import Userlogo from "../Khelo Indore Logo/dashboard_user.jpg";
import "../../src/MainLayout.css";
import axios from "axios";
import { API_URL } from "../utils/ApiUrl";

// Auto-logout after 15 minutes of inactivity
const useAutoLogout = () => {
  const timerRef = useRef(null);
  const navigateToLogin = () => {
    if (!localStorage.getItem("token")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };
  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!localStorage.getItem("token")) return;
      timerRef.current = setTimeout(navigateToLogin, 15 * 60 * 1000);
    };
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);
};
const { Header, Content } = Layout;

const SIDEBAR_W = 240;
const SIDEBAR_COLLAPSED_W = 72;

/* ── Sidebar menu definition ─────────────────────────────── */
const buildMenu = (role) => {
  const items = [];
  if (["Venue Admin", "Coach", "Personal Trainer"].includes(role)) {
    items.push({ key: "dashboard", icon: <AiOutlineDashboard />, label: "Dashboard" });
  }
  if (role === "Super Admin") {
    items.push(
      { key: "dashboard", icon: <AiOutlineDashboard />, label: "Dashboard" },
      { key: "enquiries", icon: <FaQuestionCircle />, label: "Enquiries" },
      { key: "blog", icon: <FaBlog />, label: "Blog" },
      { key: "events", icon: <FaCalendarAlt />, label: "Events" },
      { key: "users", icon: <RiUserLine />, label: "Users" }
    );
  }
  if (role === "Super Admin" || role === "Venue Admin") {
    items.push(
      { key: "venues", icon: <RiCouponLine />, label: "Venues" },
      { key: "venue-admin", icon: <RiUserLine />, label: "Venue Admin" }
    );
  }
  if (role === "Super Admin" || role === "Coach") {
    items.push({ key: "coaches", icon: <FaBloggerB />, label: "Coach" });
  }
  if (role === "Super Admin" || role === "Personal Trainer") {
    items.push({
      key: "personal-training",
      icon: <FaChalkboard />,
      label: "Trainers",
    });
  }
  items.push({ key: "bookings", icon: <FaCalendarAlt />, label: "Bookings" });
  items.push({ key: "earnings", icon: <DollarOutlined />, label: "Earnings" });
  return items;
};

/* ── Styles (inline, scoped to sidebar) ──────────────────── */
const S = {
  sidebar: (collapsed) => ({
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W,
    background: "#FAFAFA",
    borderRight: "1px solid #E2E8F0",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.25s ease",
    zIndex: 100,
    overflowX: "hidden",
  }),
  logoArea: {
    height: 64,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #E2E8F0",
    flexShrink: 0,
    background: "#FAFAFA",
  },
  logoImg: {
    maxHeight: 36,
    width: "auto",
    objectFit: "contain",
    transition: "all 0.25s ease",
  },
  logoSmall: {
    color: "#097e52",
    fontWeight: 800,
    fontSize: 20,
    fontFamily: "Inter,sans-serif",
  },
  nav: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "12px 10px",
  },
  navItem: (active, collapsed) => ({
    display: "flex",
    alignItems: "center",
    gap: collapsed ? 0 : 14,
    padding: collapsed ? "12px 0" : "11px 16px",
    justifyContent: collapsed ? "center" : "flex-start",
    borderRadius: 10,
    marginBottom: 4,
    cursor: "pointer",
    transition: "all 0.18s ease",
    background: active
      ? "linear-gradient(135deg,#097e52 0%,#076340 100%)"
      : "transparent",
    color: active ? "#fff" : "#475569",
    fontFamily: "Inter,sans-serif",
    fontWeight: active ? 700 : 500,
    fontSize: 14,
    boxShadow: active ? "0 4px 12px rgba(9,126,82,0.2)" : "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
  }),
  navIcon: (active) => ({
    fontSize: 18,
    color: active ? "#fff" : "#64748B",
    flexShrink: 0,
    transition: "color 0.18s",
  }),
  navLabel: {
    overflow: "hidden",
    opacity: 1,
    transition: "opacity 0.2s ease",
  },
  divider: {
    height: 1,
    background: "#E2E8F0",
    margin: "10px 0",
  },
  userBox: (collapsed) => ({
    padding: collapsed ? "14px 0" : "14px 16px",
    borderTop: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    gap: collapsed ? 0 : 12,
    justifyContent: collapsed ? "center" : "flex-start",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 0.18s ease",
  }),
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "2px solid #097e52",
    boxSizing: "border-box",
    objectFit: "cover",
    flexShrink: 0,
  },
  userName: {
    color: "#0F172A",
    fontFamily: "Inter,sans-serif",
    fontWeight: 600,
    fontSize: 13,
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  userRole: {
    color: "#64748B",
    fontFamily: "Inter,sans-serif",
    fontSize: 11,
    fontWeight: 500,
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 8,
    background: "rgba(239,68,68,0.1)",
    color: "#EF4444",
    border: "none",
    cursor: "pointer",
    fontFamily: "Inter,sans-serif",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.18s",
    width: "100%",
    justifyContent: "center",
    marginTop: 8,
  },
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Auto-logout after 15 minutes of inactivity
  useAutoLogout();
  const currentKey =
    location.pathname.split("/").filter(Boolean).pop() || "dashboard";
  const role = localStorage.getItem("role");
  const menuItems = buildMenu(role);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);
  useEffect(() => { const token = localStorage.getItem("token"); if (!token) return; const load = () => axios.get(`${API_URL}/notifications/me`, { headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => setNotifications(data.notifications || [])).catch(() => {}); load(); const timer = setInterval(load, 30000); return () => clearInterval(timer); }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navigateTo = (key) => {
    navigate(key);
    setMobileMenuOpen(false);
  };
  const openNotifications = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    const unreadIds = notifications.filter((item) => !item.is_read).map((item) => item._id);
    if (nextOpen && unreadIds.length) {
      try {
        await axios.put(`${API_URL}/notifications/read`, { ids: unreadIds }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setNotifications((items) => items.map((item) => unreadIds.includes(item._id) ? { ...item, is_read: true } : item));
      } catch (_) {}
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#097e52", fontFamily: "Inter, sans-serif" },
        components: { Layout: { bodyBg: "#F8FAFC", headerBg: "#ffffff" } },
      }}
    >
      <div className="admin-shell" style={{ display: "flex", minHeight: "100vh" }}>
        {/* ── Custom Sidebar ──────────────────────────────── */}
        {mobileMenuOpen && (
          <button
            className="admin-mobile-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        <aside
          className={`admin-sidebar${mobileMenuOpen ? " is-mobile-open" : ""}`}
          aria-label="Admin navigation"
          style={S.sidebar(collapsed)}
        >
          {/* Logo */}
          <div style={S.logoArea}>
            {collapsed ? (
              <span style={S.logoSmall}>KI</span>
            ) : (
              <img src={logoImage} alt="Khelo Indore" style={S.logoImg} />
            )}
          </div>

          {/* Navigation */}
          <nav style={S.nav}>
            {/* Section label */}
            {!collapsed && (
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94A3B8",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  padding: "4px 8px 8px",
                  fontFamily: "Inter,sans-serif",
                }}
              >
                Main Menu
              </p>
            )}

            {menuItems.map((item) => {
              const active = currentKey === item.key;
              const hovered = hoveredKey === item.key && !active;
              return (
                <button
                  type="button"
                  key={item.key}
                  style={{
                    ...S.navItem(active, collapsed),
                    background: hovered
                      ? "#E6F4EA"
                      : active
                      ? "linear-gradient(135deg,#097e52 0%,#076340 100%)"
                      : "transparent",
                    color: hovered ? "#097e52" : active ? "#fff" : "#475569",
                  }}
                  onClick={() => navigateTo(item.key)}
                  onMouseEnter={() => setHoveredKey(item.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  title={collapsed ? item.label : ""}
                >
                  <span style={S.navIcon(active || hovered)}>{item.icon}</span>
                  {!collapsed && <span style={S.navLabel}>{item.label}</span>}
                </button>
              );
            })}

            <div style={S.divider} />

            {/* Logout button inside nav */}
            <button
              type="button"
              style={{
                ...S.navItem(false, collapsed),
                color: "#EF4444",
                background: "transparent",
              }}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                e.currentTarget.style.color = "#EF4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#EF4444";
              }}
              title={collapsed ? "Sign Out" : ""}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>
                <LogoutOutlined />
              </span>
              {!collapsed && <span style={S.navLabel}>Sign Out</span>}
            </button>
          </nav>

          {/* User info at bottom */}
          <div style={S.userBox(collapsed)}>
            <img src={Userlogo} alt="User" style={S.avatar} />
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <div style={S.userName}>{role}</div>
                <div style={S.userRole}>Administrator</div>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────── */}
        <Layout
          className="admin-main-layout"
          style={{
            marginLeft: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W,
            transition: "margin-left 0.25s ease",
            background: "#F8FAFC",
          }}
        >
          {/* Top Header */}
          <Header
            className="admin-topbar"
            style={{
              background: "#fff",
              padding: "0 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
              position: "sticky",
              top: 0,
              zIndex: 99,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Collapse toggle */}
              <button
                aria-label={isMobile ? (mobileMenuOpen ? "Close navigation menu" : "Open navigation menu") : (collapsed ? "Expand navigation" : "Collapse navigation")}
                aria-expanded={isMobile ? mobileMenuOpen : !collapsed}
                onClick={() => isMobile ? setMobileMenuOpen(!mobileMenuOpen) : setCollapsed(!collapsed)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#64748B",
                  padding: "8px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E6F4EA";
                  e.currentTarget.style.color = "#097e52";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#64748B";
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
              
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#0F172A",
                letterSpacing: "-0.2px"
              }}>
                Admin Panel
              </span>
            </div>
            <div style={{ position: "relative" }}><button aria-label="Notifications" onClick={openNotifications} style={{ background: "none", border: "none", fontSize: 19, color: "#475569", cursor: "pointer" }}><BellOutlined />{notifications.filter(n => !n.is_read).length > 0 && <sup style={{ color: "#dc2626", fontWeight: 700 }}>{notifications.filter(n => !n.is_read).length}</sup>}</button>{notificationsOpen && <div style={{ position: "absolute", right: 0, top: 35, width: 330, maxHeight: 360, overflowY: "auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 12px 28px rgba(0,0,0,.15)", padding: 12 }}>{notifications.length ? notifications.map(n => <div key={n._id} style={{ padding: "9px 4px", borderBottom: "1px solid #f1f5f9" }}><b>{n.title}</b><div style={{ fontSize: 12, color: "#64748b" }}>{n.message}</div></div>) : <span className="text-muted">No notifications</span>}</div>}</div>
          </Header>

          {/* Page Content */}
          <Content
            className="admin-page-content"
            style={{
              margin: "24px",
              padding: 24,
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              minHeight: "calc(100vh - 112px)",
            }}
          >
            <ToastContainer
              position="top-right"
              autoClose={250}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              theme="light"
            />
            <Outlet />
          </Content>
        </Layout>
      </div>
    </ConfigProvider>
  );
};

export default MainLayout;

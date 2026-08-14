import React, { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, BellOutlined, MenuOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
} from "react-icons/ai";
import { RiCouponLine } from "react-icons/ri";
import { RiUserLine } from 'react-icons/ri';
import { FaChalkboard, FaThumbsUp, FaCalendarAlt, FaQuestionCircle, FaBloggerB } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";
import { Layout, Menu, theme, Popover, Badge, List, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logoImage from "../Khelo Indore Logo/Group 86.png";
import Userlogo from "../Khelo Indore Logo/dashboard_user.jpg";
import '../../src/MainLayout.css'
import axios from "axios";
import { API_URL } from "../utils/ApiUrl";

const { Header, Sider, Content, Footer } = Layout;


const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/');
  };

  const fetchPendingBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/get/booking/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.success) {
        const pending = (response.data.data || []).filter(b => b.info && b.info.verification_status === 0);
        setBookings(pending);
      } else {
        setBookings([]);
      }
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
    const interval = setInterval(fetchPendingBookings, 30000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const loadNotifications = () => axios.get(`${API_URL}/notifications/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]));
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);
  const handleVerifyBooking = async (bookingId, verifyStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.put(`${API_URL}/verify/booking/status/${bookingId}/${verifyStatus}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        toast.success(`Booking ${verifyStatus === 1 ? 'Approved' : 'Rejected'} successfully!`);
        fetchPendingBookings();
      } else {
        toast.error(response.data.message || "Failed to update booking status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const notificationContent = (
    <div style={{ width: 320, maxHeight: 400, overflowY: "auto" }}>
      <List
        loading={loading}
        dataSource={[...notifications, ...bookings]}
        renderItem={(item) => {
          if (!item.info) return <List.Item><div><strong>{item.title}</strong><div className="text-muted small">{item.message}</div></div></List.Item>;
          const customerName = item.info?.user_id 
            ? `${item.info.user_id.first_name} ${item.info.user_id.last_name}`
            : "Customer";
          const venueName = item.info?.venue_id?.name || "Venue";
          const bookingDate = item.info?.date ? new Date(item.info.date).toLocaleDateString('en-IN') : "";
          const slotsStr = (item.slots || []).map(s => `${s.startTime}-${s.endTime}`).join(", ");
          
          return (
            <List.Item style={{ padding: "12px 8px" }}>
              <div style={{ width: "100%" }}>
                <div className="d-flex justify-content-between align-items-start">
                  <strong>{customerName}</strong>
                  <span className="text-muted" style={{ fontSize: "12px" }}>₹{item.info?.total_price || item.info?.price}</span>
                </div>
                <div style={{ fontSize: "13px", margin: "4px 0" }}>
                  <div>{venueName}</div>
                  <div className="text-muted" style={{ fontSize: "12px" }}>Date: {bookingDate} | Slots: {slotsStr}</div>
                </div>
                <div className="d-flex gap-2 justify-content-end mt-2">
                  <Button size="small" type="primary" onClick={() => handleVerifyBooking(item.info?._id, 1)}>
                    Approve
                  </Button>
                  <Button size="small" danger onClick={() => handleVerifyBooking(item.info?._id, 2)}>
                    Reject
                  </Button>
                </div>
              </div>
            </List.Item>
          );
        }}
        locale={{ emptyText: "No pending booking requests" }}
      />
    </div>
  );

  return (
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="sidelogo">
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            <span className="sm-logo">KI</span>
            <img src={logoImage} alt="Khelo Indore Logo" className="lg-logo" />
            <span className="lg-logo"></span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
            } else {
              navigate(key);
            }
          }}
          items={[
            // {
            //   key: "categories",
            //   icon: <BiCategoryAlt className="fs-4" />,
            //   label: "Categories",
            // },
            {
              key: "venues/table",
              icon: <RiCouponLine className="fs-4" />,
              label: "Venues",
            },
            {
              key: "venue-admin-dashboard/crm",
              icon: <FaCalendarAlt className="fs-4" />,
              label: "Manual Bookings (CRM)",
            },
            // {
            //   key: "coaches",
            //   icon: <FaBloggerB className="fs-4" />,
            //   label: "Coach",
            // },
            // {
            //   key: "personal-training",
            //   icon: <FaChalkboard className="fs-4" />,
            //   label: "Personal Training",
            // },
            {
              key: "events",
              icon: <FaCalendarAlt className="fs-4" />,
              label: "Events",
            },
            // {
            //   key: "enquiries",
            //   icon: <FaQuestionCircle className="fs-4" />,
            //   label: "Enquiries",
            // },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            

            <div className="d-flex gap-3 align-items-center dropdown">
              
              {/* Notification alert.... */}
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <Popover
                  content={notificationContent}
                  title="Booking Requests"
                  trigger="click"
                  placement="bottomRight"
                >
                  <Badge count={bookings.length}>
                    <BellOutlined className="notification" style={{ fontSize: "20px", color: "rgb(255, 95, 21)" }} />
                  </Badge>
                </Popover>
              </div>

              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className="mb-0">
                  <img
                    id="userLogo"
                    src={Userlogo}
                    icon={faUser}
                    style={{
                      color: 'rgb(255, 95, 21)',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      padding: '1px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      width: '31px',
                      height: '32px',
                    }}
                  />
                  <span style={{ fontWeight: 'bold' }}> Venue Admin</span>
                </h5>

              </div>

              <div className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenuLink" >
                <li style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "341px" }}>
                  {/* User Logo Image */}
                  <img id="userLogo" src={Userlogo} style={{ width: "100px", height: "100px", padding: "8px", borderRadius: '50%' }} />
                </li>
                <li>
                  {/* User Name */}
                  <h6 id="userName" style={{ textAlign: "center" }}>Venue Admin</h6>
                </li>
                <li>
                  <button
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px", textAlign: "center" }}
                    onClick={handleLogout}
                  >
                    <LogoutOutlined /> Signout
                  </button>
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
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

        {/* <Footer className="footer">
          
          &copy; 2024 Khelo Indore. All rights reserved.
        </Footer> */}

      </Layout>
    </Layout>
  );
};
export default MainLayout;

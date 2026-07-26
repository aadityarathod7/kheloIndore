import React, { useState } from "react";
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
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logoImage from "../Khelo Indore Logo/Group 86.png";
import Userlogo from "../Khelo Indore Logo/dashboard_user.jpg";
import '../../src/MainLayout.css'

const { Header, Sider, Content, Footer } = Layout;


const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/');
  };

  // Function to handle new notifications
  const handleNewNotification = () => {
    setIsNewNotification(true);
    toast.success("New notification received!"); 
  };

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
              // children: [
              //   {
              //     key: "venue",
              //     icon: <ImBlog className="fs-4" />,
              //     label: "Add Venue",
              //   },
              //   {
              //     key: "venuelist",
              //     icon: <RiCouponLine className="fs-4" />,
              //     label: "Venue List",
              //   },
              // ],
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
              <div style={{ position: 'relative' }}>
                <BellOutlined className="notification" onClick={handleNewNotification} />
                {isNewNotification && <span className="badge bg-danger rounded-circle p-1" style={{ position: 'absolute' , right: '-1px'}}>1</span>}
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

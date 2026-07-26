import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import "../../style/css/custom.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { jwtDecode } from "jwt-decode";

import { COffcanvasTitle } from "@coreui/react";
import { COffcanvasHeader } from "@coreui/react";
import { COffcanvasBody } from "@coreui/react";
import { COffcanvas } from "@coreui/react";
import { CButton, CCloseButton } from "@coreui/react";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";
import axios from "axios";

interface tokenvalue {
  userID: string;
  first_name: string;
  last_name: string;
  role: string;
  iat: number;
  exp: number;
}

const Header = () => {
  const routes = all_routes;
  const location = useLocation();
  const loginToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [isActive, setIsActive] = useState(false);

  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    first_name: "",
    mobile: "",
    email: "",
    subject: "Quick Enquiry",
    comments: "",
  });

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  interface JwtPayload {
    first_name: string;
  }

  useEffect(() => {
    const getTokenFromStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserData(decodedToken);
      } else {
        return;
      }
    };
    getTokenFromStorage();
  }, []);

  const handleInputChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "first_name") {
      if (/^[a-zA-Z\s]+$/.test(value) || value === "") {
        setInput((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setError(`${name} must contain only letters`);
      }
    } else if (name === "phone") {
      if (/^\d{0,10}$/.test(value) || value === "") {
        setInput((prevState) => ({
          ...prevState,
          mobile: value,
        }));
      } else {
        setError("Mobile number must be 10 digits");
      }
    } else if (name === "email") {
      setInput((prevState) => ({
        ...prevState,
        email: value,
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleInquiries = async (e: any) => {
    e.preventDefault();
    try {
      if (!input.first_name || !input.mobile || !input.comments) {
        setError("Please fill in all required fields.");
        alert("Please fill in all required fields.");
        return;
      }

      const response = await axios
        .post(`${API_URL}/enquiry/create`, input)
        .then((response) => {
          // alert("response");
          showLoadingAlert();
          setVisible(false);
          setTimeout(function () {
            Swal.fire(
              "Success!",
              "Your enquiry has been submitted!",
              "success"
            );
          }, 1000);

          //   navigate("/");

          if (response) {
            setInput({
              first_name: "",
              mobile: "",
              email: "",
              subject: "Quick Enquiry",
              comments: "",
            });
          }
        });
    } catch (error) {
      console.error("Error:", error);

      setError("Error: " + error);
    }
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: "Loading",
      html: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close();
    }, 1000);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token2");
    localStorage.removeItem("userName");
    localStorage.removeItem("id");

    // navigate("/");
  };

  const header = [
    {
      tittle: "Home",
      showAsTab: false,
      separateRoute: true,
      routes: routes.home,
      hasSubRoute: false,
      showSubRoute: false,
    },
    {
      tittle: "Sports Venues",
      showAsTab: false,
      separateRoute: true,
      routes: routes.blogListSidebarLeft,
      hasSubRoute: false,
      showSubRoute: false,
    },
    {
      tittle: "Coaches",
      showAsTab: false,
      separateRoute: true,
      routes: routes.coachesGrid,
      hasSubRoute: true,
      showSubRoute: true,
      menu: [
        {
          menuValue: "Coaches Map",
          hasSubRoute: true,
          showSubRoute: true,
          subMenus: [
            {
              menuValue: "Coaches Map",
              routes: routes.coachesMap,
              hasSubRoute: true,
              showSubRoute: true,
              subMenus: [],
            },
            {
              menuValue: "Coaches Map Sidebar",
              routes: routes.coachesMapSidebar,
              hasSubRoute: true,
              showSubRoute: true,
              subMenus: [],
            },
          ],
        },
        {
          menuValue: "Coaches Grid",
          routes: routes.coachesGrid,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Coaches List",
          routes: routes.coachesList,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Coaches Grid Sidebar",
          routes: routes.coachesGridSidebar,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Coaches List Sidebar",
          routes: routes.coachesListSidebar,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Booking",
          hasSubRoute: true,
          showSubRoute: true,
          subMenus: [
            {
              menuValue: "Book a Court",
              routes: routes.cagedetails,
              hasSubRoute: true,
              showSubRoute: true,
              subMenus: [],
            },
            {
              menuValue: "Book a Coach",
              routes: routes.coachDetails,
              hasSubRoute: true,
              showSubRoute: true,
              subMenus: [],
            },
          ],
        },
        {
          menuValue: "Coaches Details",
          routes: routes.coachDetails,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Venue",
          hasSubRoute: true,
          showSubRoute: true,
          subMenus: [
            {
              menuValue: "Venue List",
              routes: routes.listingList,
              hasSubRoute: true,
              showSubRoute: true,
              subMenus: [],
            },
            {
              menuValue: "Venue Details",
              routes: routes.venueDetails,
              hasSubRoute: true,
              showSubRoute: true,
              subMenus: [],
            },
          ],
        },
        {
          menuValue: "Coaches Dashboard",
          routes: routes.coachDashboard,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Coach Courts",
          routes: routes.allCourt,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "List Your Cart",
          routes: routes.addCourt,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Chat",
          routes: routes.coachChat,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
      ],
    },
    {
      tittle: "Personal Trainer",
      showAsTab: false,
      separateRoute: true,
      routes: routes.blogList,
      hasSubRoute: false,
      showSubRoute: false,
      menu: [
        {
          menuValue: "User Dashboard",
          routes: routes.userDashboard,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Bookings",
          routes: routes.userBookings,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Chat",
          routes: routes.userChat,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Invoice",
          routes: routes.userInvoice,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Wallet",
          routes: routes.userWallet,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Profile Edit",
          routes: routes.wallet,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Change Password",
          routes: routes.userSettingPassword,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
        {
          menuValue: "Other Settings",
          routes: routes.settings,
          hasSubRoute: false,
          showSubRoute: false,
          subMenus: [],
        },
      ],
    },
    // {
    //   tittle: "Events",
    //   showAsTab: false,
    //   separateRoute: true,
    //   routes: routes.events,
    //   hasSubRoute: false,
    //   showSubRoute: false,
    //   menu: [
    //     {
    //       menuValue: "About Us",
    //       routes: routes.aboutUs,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //       subMenus: [],
    //     },
    //     {
    //       menuValue: "Our Team",
    //       routes: routes.ourTeams,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    //     {
    //       menuValue: "services",
    //       routes: routes.services,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    // {
    //   menuValue: "Events",
    //   routes: routes.events,
    //   hasSubRoute: false,
    //   showSubRoute: false,
    // },
    //     {
    //       menuValue: "Authentication",
    //       hasSubRoute: true,
    //       showSubRoute: true,
    //       subMenus: [
    //         {
    //           menuValue: "Signup",
    //           routes: routes.register,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //         {
    //           menuValue: "Signin",
    //           routes: routes.login,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //         {
    //           menuValue: "Forgot Password",
    //           routes: routes.forgotPasssword,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //         {
    //           menuValue: "Reset Password",
    //           routes: routes.changePassword,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //       ],
    //     },

    //     {
    //       menuValue: "Error Page",
    //       hasSubRoute: true,
    //       showSubRoute: false,
    //       subMenus: [
    //         {
    //           menuValue: "404 Error",
    //           routes: routes.error404,
    //           hasSubRoute: false,
    //           showSubRoute: false,
    //           subMenus: [],
    //         },
    //       ],
    //     },

    //     {
    //       menuValue: "Pricing",
    //       routes: routes.pricing,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    //     {
    //       menuValue: "FAQ",
    //       routes: routes.faq,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    //     {
    //       menuValue: "Gallery",
    //       routes: routes.gallery,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },

    //     {
    //       menuValue: "Testimonials",
    //       routes: routes.testimonials,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    //     {
    //       menuValue: "Terms & Conditions",
    //       routes: routes.termsCondition,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    //     {
    //       menuValue: "Privacy Policy",
    //       routes: routes.privacyPolicy,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    //     {
    //       menuValue: "Maintenance",
    //       routes: routes.maintenance,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    //     {
    //       menuValue: "Coming Soon",
    //       routes: routes.comingSoon,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //     },
    //   ],
    // },
    // {
    //   tittle: "Shop",
    //   showAsTab: false,
    //   separateRoute: true,
    //   // routes: routes.shop,
    //   hasSubRoute: false,
    //   showSubRoute: false,
    // },
    // {
    //   tittle: "Blog",
    //   showAsTab: false,
    //   separateRoute: true,
    //   routes: routes.blogGrid,
    //   hasSubRoute: false,
    //   showSubRoute: false,
    //   menu: [
    //     {
    //       menuValue: "Blog List",
    //       routes: routes.blogList,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //       subMenus: [],
    //     },

    //     {
    //       menuValue: "Blog List Sidebar",
    //       hasSubRoute: true,
    //       showSubRoute: true,
    //       subMenus: [
    //         {
    //           menuValue: "Blog List Sidebar Left",
    //           routes: routes.blogListSidebarLeft,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //         {
    //           menuValue: "Blog List Sidebar Right",
    //           routes: routes.blogListSidebarRight,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //       ],
    //     },
    // {
    //   menuValue: "Blog Grid",
    //   routes: routes.blogGrid,
    //   hasSubRoute: false,
    //   showSubRoute: false,
    // subMenus: [],
    // },
    //     {
    //       menuValue: "Blog Grid Sidebar",
    //       hasSubRoute: true,
    //       showSubRoute: true,
    //       subMenus: [
    //         {
    //           menuValue: "Blog Grid Sidebar Left",
    //           routes: routes.blogGridSidebarLeft,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //         {
    //           menuValue: "Blog Grid Sidebar Right",
    //           routes: routes.blogGridSidebarRight,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //       ],
    //     },
    //     {
    //       menuValue: "Blog Detail",
    //       routes: routes.blogDetails,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //       subMenus: [],
    //     },
    //     {
    //       menuValue: "Blog Detail Sidebar",
    //       hasSubRoute: true,
    //       showSubRoute: true,
    //       subMenus: [
    //         {
    //           menuValue: "Blog Detail Sidebar Left",
    //           routes: routes.blogDetailsSidebarLeft,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //         {
    //           menuValue: "Blog Detail Sidebar Right",
    //           routes: routes.personalTrainingDetails,
    //           hasSubRoute: true,
    //           showSubRoute: true,
    //           subMenus: [],
    //         },
    //       ],
    //     },
    //     {
    //       menuValue: "Blog Carousel",
    //       routes: routes.blogCarousel,
    //       hasSubRoute: false,
    //       showSubRoute: false,
    //       subMenus: [],
    //     },
    //   ],
    // },
    {
      tittle: "Contact Us",
      showAsTab: false,
      separateRoute: true,
      routes: routes.contactUs,
      hasSubRoute: false,
      showSubRoute: false,
    },
    {
      tittle: "Blogs",
      routes: routes.blogGrid,
      showAsTab: false,
      separateRoute: true,
      hasSubRoute: false,
      showSubRoute: false,
      // subMenus: [],
    },
  ];

  const customStyle = {
    background: location.pathname.includes(routes.home)
      ? // ? "rgb(23, 124, 130)"
        "#ffffff"
      : // ? "#ffffff"
        "#ffffff",
    borderBottom: "3px solid #ff5f1f",
  };

  const profileStyle = {
    display: loginToken ? "block" : "none",
  };

  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const toggleOffcanvas = () => {
    setOffcanvasOpen(!offcanvasOpen);
  };

  const hideOffcanvas = () => {
    setOffcanvasOpen(false);
  };

  return (
    <header
      className={
        location.pathname.includes(routes.home)
          ? "header header-trans"
          : "header header-sticky"
      }
      style={customStyle}
    >
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg header-nav">
          <div className="navbar-header">
            <div className="mobile-navbar">
              <button
                className="navbar-toggler  first-button"
                onClick={toggleOffcanvas}
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasWithBothOptions"
                aria-controls="offcanvasWithBothOptions"
              >
                {location.pathname.includes(routes.home) ? (
                  <i className="fas fa-bars"></i>
                ) : (
                  <i className="fas fa-bars"></i>
                )}
              </button>
              <div
                className={`offcanvas offcanvas-start ${offcanvasOpen ? "show" : ""}`}
                data-bs-scroll="true"
                tabIndex="-1"
                id="offcanvasWithBothOptions"
                aria-labelledby="offcanvasWithBothOptionsLabel"
              >
                <div className="offcanvas-header" style={profileStyle}>
                  <div
                    className="nav-link btn btn-white log-register"
                    style={{ width: "50%" }}
                  >
                    <a>
                      <span>
                        <i className="feather-users" />
                      </span>
                      {/* {userData?.first_name} */}
                      <i className="fas fa-chevron-down"></i>
                      <div className="lt-btn">
                        <ul className="mobile profile-dropdown">
                          <li className="ft-colr-ffff">
                            <Link
                              to={routes.userBookings}
                              onClick={hideOffcanvas}
                            >
                              <i className="fas fa-user"></i> &nbsp;
                              {userData?.first_name}
                            </Link>
                          </li>
                          {/* <li className="ft-colr-ffff">
                            <Link
                              to={routes.userProfileOtherSetting}
                              onClick={hideOffcanvas}
                            >
                              <i className="fas fa-cog"></i> Settings
                            </Link>
                          </li> */}
                          <li className="ft-colr-ffff" onClick={removeToken}>
                            <Link to={routes.home}>
                              <i className="fas fa-sign-out-alt"></i> Logout
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="offcanvas-body">
                  {/* <img src="/assets/img/plane.png" /> */}
                  <ul className="nav-list">
                    <li>
                      <Link to={routes.home} onClick={hideOffcanvas}>
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={routes.blogListSidebarLeft}
                        onClick={hideOffcanvas}
                      >
                        Sports venue
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachesGrid} onClick={hideOffcanvas}>
                        Coaches
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.blogList} onClick={hideOffcanvas}>
                        Personal Trainer
                      </Link>
                    </li>
                    {/* <li>
                      <Link to={routes.events} onClick={hideOffcanvas}>
                        Events
                      </Link>
                    </li> */}
                    <li>
                      <Link to={routes.contactUs} onClick={hideOffcanvas}>
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.blogGrid} onClick={hideOffcanvas}>
                        Blogs
                      </Link>
                    </li>
                  </ul>
                  <ul className="nav-btn-mob">
                    <li className="nav-item">
                      {/* <Link
                        className="nav-link btn btn-secondary"
                        to="http://127.0.0.1:3037/admin"
                      >
                        <span>
                          <i className="feather-check-circle" />
                        </span>
                        List Your Court
                      </Link> */}
                    </li>
                    <li
                      className="nav-item"
                      style={{ display: loginToken ? "none" : "block" }}
                    >
                      <div className="nav-link btn btn-white log-register">
                        <Link to={"/login"}>
                          <span>
                            <i className="feather-users" />
                          </span>
                          Login
                        </Link>{" "}
                      </div>
                    </li>
                    <li
                      className="nav-item"
                      style={{ display: loginToken ? "none" : "block" }}
                    >
                      <div className="nav-link btn btn-white log-register">
                        <span>
                          <i className="feather-users" />
                        </span>
                        <Link to={"/register"}>Register</Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <nav className="navbar navbar-light bg-light">
              <div className="container-fluid">
                <button className="navbar-toggler  first-button" type="button" data-mdb-collapse-init
                  data-mdb-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                  aria-expanded="false" aria-label="Toggle navigation">
                  <i className="fas fa-bars white"></i>
                </button>
              </div>
            </nav>
            <div className="collapse" id="navbarToggleExternalContent">
              <div className="bg-light shadow-3 p-4">
                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-block border-bottom m-0">Link 1</button>
                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-block border-bottom m-0">Link 2</button>
                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-block m-0">Link 3</button>
              </div>
            </div> */}

            {/* <Link id="mobile_btn" to="#">
              <span className="bar-icon">
                <span />
                <span />
                <span />
              </span>
            </Link> */}
            <Link to="/" className="navbar-brand logo">
              {/* <ImageWithBasePath src="assets/img/logo.svg" className="img-fluid" alt="Logo" /> */}

              {location.pathname.includes(routes.home) ? (
                <ImageWithBasePath
                  src="/assets/img/khelo-Indore-Logo.png"
                  className="img-fluid"
                  alt="Logo"
                />
              ) : (
                <ImageWithBasePath
                  src="/assets/img/khelo-Indore-Logo.png"
                  className="img-fluid"
                  alt="Another Image"
                />
              )}
            </Link>
          </div>
          <div className="main-menu-wrapper">
            <div className="menu-header">
              <Link to="/" className="menu-logo">
                <ImageWithBasePath
                  src="assets/img/logo-black.svg"
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
              <Link id="menu_close" className="menu-close" to="#">
                {" "}
                <i className="fas fa-times" />
              </Link>
            </div>
            <ul className="main-nav">
              {header.map((mainMenus, mainIndex) => (
                <React.Fragment key={mainIndex}>
                  {mainMenus.separateRoute ? (
                    <li
                      key={mainIndex}
                      className={
                        location.pathname.includes(mainMenus.routes)
                          ? "active"
                          : ""
                      }
                    >
                      <Link to={mainMenus.routes}>{mainMenus.tittle}</Link>
                    </li>
                  ) : (
                    <li
                      className={`has-submenu ${mainMenus?.menu?.map((item) => item?.routes).includes(location.pathname) ? "active" : ""}`}
                    >
                      <Link to="#">
                        {mainMenus.tittle}{" "}
                        <i className="fas fa-chevron-down"></i>
                      </Link>
                      <ul
                        className={`submenu ${mainMenus.showAsTab ? "d-block" : ""}`}
                      >
                        {mainMenus.menu?.map((menu, menuIndex) => (
                          <li
                            key={menuIndex}
                            className={`${menu.hasSubRoute ? "has-submenu" : ""} ${menu?.subMenus?.map((item) => item?.routes).includes(location.pathname) ? "active" : ""}`}
                          >
                            {menu.hasSubRoute ? (
                              <React.Fragment>
                                <Link to="#">{menu.menuValue}</Link>
                                <ul
                                  className={`submenu ${menu.showSubRoute ? "d-block" : ""}`}
                                >
                                  {menu.subMenus?.map(
                                    (subMenu, subMenuIndex) => (
                                      <li key={subMenuIndex}>
                                        <Link to={subMenu.routes}>
                                          {subMenu.menuValue}
                                        </Link>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </React.Fragment>
                            ) : (
                              <li
                                className={
                                  location.pathname.includes(menu.routes)
                                    ? "active"
                                    : ""
                                }
                              >
                                <Link to={menu.routes}>{menu.menuValue}</Link>
                              </li>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
          <ul className="nav header-navbar-rht">
            <li className="nav-item">
              {/* <Link
                className="nav-link btn btn-secondary"
                to="http://127.0.0.1:3037/admin"
              >
                <span>
                  <i className="feather-check-circle" />
                </span>
                List Your Court
              </Link> */}
            </li>

            <li className="nav-item">
              {loginToken ? (
                <div className="nav-link btn btn-white log-register">
                  <a>
                    <span>
                      <i className="feather-users" />
                    </span>
                    {/* {userData?.first_name} */}
                    <i className="fas fa-chevron-down"></i>
                    <div className="lt-btn">
                      <ul className="profile-dropdown">
                        <li className="ft-colr-ffff">
                          <Link to={routes.userBookings}>
                            <i className="fas fa-user"></i> &nbsp;
                            {userData?.first_name}
                          </Link>
                        </li>
                        {/* <li className="ft-colr-ffff">
                          <Link to={routes.userProfile}>
                            <i className="fas fa-cog"></i> Settings
                          </Link>
                        </li> */}
                        <li className="ft-colr-ffff" onClick={removeToken}>
                          <Link to={routes.home}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to={"/login"}>
                    <div className="nav-link btn btn-white log-register">
                      <span>
                        <i className="feather-users" />
                      </span>
                      Login
                    </div>
                  </Link>{" "}
                  <Link to={"/register"}>
                    <div className="nav-link btn btn-white log-register">
                      <span>
                        <i className="feather-users" />
                      </span>
                      Register
                    </div>
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <div className="enquiry-btn">
          <CButton
            color="primary"
            onClick={() => setVisible(true)}
            style={{
              writingMode: "vertical-lr",
              textOrientation: "upright",
              padding: "12px 10px",
            }}
          >
            ENQUIRY
          </CButton>
        </div>
        <COffcanvas
          placement="end"
          scroll={true}
          visible={visible}
          onHide={() => setVisible(false)}
        >
          <COffcanvasHeader>
            <COffcanvasTitle>ENQUIRY</COffcanvasTitle>
            <CCloseButton
              className="text-reset"
              onClick={() => setVisible(false)}
            />
          </COffcanvasHeader>
          <COffcanvasBody>
            <form className="contact-us enquiry" onSubmit={handleInquiries}>
              <div className="row">
                <div className="col mb-3">
                  {/* <label htmlFor="subject" className="form-label">
                                    Name
                                </label> */}
                  <input
                    type="text"
                    className="form-control"
                    id="full-name"
                    name="first_name"
                    placeholder=" Full Name"
                    value={input.first_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col mb-3">
                  {/* <label htmlFor="subject" className="form-label">
                                    Phone number
                                </label> */}
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={input.mobile}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col mb-3">
                  {/* <label htmlFor="subject" className="form-label">
                                    E-mail
                                </label> */}
                  <input
                    type="text"
                    className="form-control"
                    id="e-mail"
                    name="email"
                    placeholder="E-mail  Address"
                    value={input.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                {/* <label htmlFor="comments" className="form-label">
                                Comments
                            </label> */}
                <textarea
                  className="form-control"
                  id="comments"
                  name="comments"
                  rows={3}
                  placeholder="Message"
                  value={input.comments}
                  onChange={handleInputChange}
                  defaultValue={""}
                />
              </div>
              <button
                type="submit"
                className="btn btn-secondary d-flex align-items-center"
                // onClick={handleInquiries}
              >
                Submit
                <i className="feather-arrow-right-circle ms-2" />
              </button>
            </form>
          </COffcanvasBody>
        </COffcanvas>
      </div>
    </header>
  );
};

export default Header;

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      separateRoute: true,
      routes: routes.home,
    },
    {
      tittle: "Sports Venues",
      separateRoute: true,
      routes: routes.blogListSidebarLeft,
    },
    {
      tittle: "Coaches",
      separateRoute: true,
      routes: routes.coachesGrid,
    },
    {
      tittle: "Personal Trainers",
      separateRoute: true,
      routes: routes.blogList,
    },
    {
      tittle: "Blogs",
      separateRoute: true,
      routes: routes.blogGrid,
    },
    {
      tittle: "Contact Us",
      separateRoute: true,
      routes: routes.contactUs,
    },
  ];

  const profileStyle = {
    display: loginToken ? "block" : "none",
  };

  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleDocumentClick = () => {
      setIsProfileOpen(false);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const toggleOffcanvas = () => {
    setOffcanvasOpen(!offcanvasOpen);
  };

  const hideOffcanvas = () => {
    setOffcanvasOpen(false);
  };

  return (
    <>
      <header
        className={`header ${
          location.pathname.includes(routes.home) ? "header-trans" : "header-sticky"
        } ${isScrolled ? "fixed" : ""}`}
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
            <Link to="/" className="navbar-brand logo" style={{ padding: "0", display: "flex", alignItems: "center", textDecoration: "none" }}>
              <img
                src="/logo.png"
                className="img-fluid logo-navbar-3d"
                alt="Logo"
                style={{
                  maxHeight: "56px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 1px 3px rgba(67, 182, 73, 0.3))",
                  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
              />
            </Link>
          </div>
          <div className="main-menu-wrapper">
            <div className="menu-header">
              <Link to="/" className="menu-logo">
                <img
                  src="/logo.png"
                  className="img-fluid"
                  alt="Logo"
                  style={{ maxHeight: "36px" }}
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
                        mainMenus.routes === "/"
                          ? (location.pathname === "/" ? "active" : "")
                          : (location.pathname.startsWith(mainMenus.routes) ? "active" : "")
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
                <div className="user-profile-nav">
                  <div 
                    className={`profile-trigger d-flex align-items-center gap-2 cursor-pointer ${isProfileOpen ? "show" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileOpen(!isProfileOpen);
                    }}
                  >
                    <div className="avatar-circle">
                      {userData?.first_name ? userData.first_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="user-name-text">{userData?.first_name}</span>
                    <i className="fas fa-chevron-down" style={{ fontSize: "12px", opacity: 0.7 }} />
                    <div className="lt-btn">
                      <ul className="profile-dropdown">
                        <li className="ft-colr-ffff">
                          <Link to={routes.userBookings}>
                            <i className="fas fa-user"></i> &nbsp;
                            My Bookings
                          </Link>
                        </li>
                        <li className="ft-colr-ffff" onClick={removeToken}>
                          <Link to={routes.home}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to={"/login"} className="navbar-login-btn">
                    Login
                  </Link>
                  <Link to={"/register"} className="navbar-register-btn">
                    Register
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <div>
        <div className="enquiry-btn">
          <CButton
            onClick={() => setVisible(true)}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <i className="fas fa-envelope" />
            <span>Enquiry Now</span>
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
    </>
  );
};

export default Header;

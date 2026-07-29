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
            <div className="mobile-navbar d-lg-none d-flex align-items-center justify-content-between w-100 py-2 px-3">
              <Link to="/" className="navbar-brand m-0">
                <img
                  src="/logo.png"
                  className="img-fluid"
                  alt="Logo"
                  style={{ maxHeight: "40px" }}
                />
              </Link>
              <button
                className="navbar-toggler mobile-menu-btn d-flex align-items-center justify-content-center p-2 border-0 bg-transparent"
                onClick={toggleOffcanvas}
                type="button"
                aria-label="Toggle navigation"
              >
                <i className="fas fa-bars text-dark" style={{ fontSize: "20px" }} />
              </button>
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
            <Link to="/" className="navbar-brand logo d-none d-lg-flex" style={{ padding: "0", alignItems: "center", textDecoration: "none" }}>
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
          <div className="main-menu-wrapper d-none d-lg-block">
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
    {/* Standalone Full-Height Mobile Offcanvas Drawer */}
    <div
      className={`offcanvas offcanvas-start ${offcanvasOpen ? "show" : ""}`}
      tabIndex={-1}
      id="offcanvasWithBothOptions"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "290px",
        height: "100vh",
        backgroundColor: "#FFFFFF",
        zIndex: 1060,
        visibility: offcanvasOpen ? "visible" : "hidden",
        transform: offcanvasOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-in-out, visibility 0.3s ease-in-out",
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.15)"
      }}
    >
      <div className="offcanvas-header d-flex align-items-center justify-content-between p-3 border-bottom bg-white">
        <div className="d-flex align-items-center gap-2">
          <img src="/logo.png" alt="Logo" style={{ maxHeight: "36px" }} />
          <span style={{ fontWeight: "700", color: "#0F172A", fontSize: "17px" }}>Khelo Indore</span>
        </div>
        {loginToken && userData?.first_name && (
          <span className="badge bg-success-light text-success px-2 py-1" style={{ fontSize: "12px" }}>
            Hi, {userData.first_name}
          </span>
        )}
        <button 
          type="button" 
          className="btn-close text-reset" 
          onClick={hideOffcanvas}
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body p-3 bg-white">
        <ul className="list-unstyled m-0 p-0">
          <li className="border-bottom py-2">
            <Link to={routes.home} onClick={hideOffcanvas} className="d-flex align-items-center py-2 text-dark font-weight-bold text-decoration-none" style={{ fontSize: "15px" }}>
              <i className="fas fa-home me-3 text-success" style={{ width: "20px", textAlign: "center" }} /> Home
            </Link>
          </li>
          <li className="border-bottom py-2">
            <Link to={routes.blogListSidebarLeft} onClick={hideOffcanvas} className="d-flex align-items-center py-2 text-dark font-weight-bold text-decoration-none" style={{ fontSize: "15px" }}>
              <i className="fas fa-map-marker-alt me-3 text-success" style={{ width: "20px", textAlign: "center" }} /> Sports Venue
            </Link>
          </li>
          <li className="border-bottom py-2">
            <Link to={routes.coachesGrid} onClick={hideOffcanvas} className="d-flex align-items-center py-2 text-dark font-weight-bold text-decoration-none" style={{ fontSize: "15px" }}>
              <i className="fas fa-user-ninja me-3 text-success" style={{ width: "20px", textAlign: "center" }} /> Coaches
            </Link>
          </li>
          <li className="border-bottom py-2">
            <Link to={routes.blogList} onClick={hideOffcanvas} className="d-flex align-items-center py-2 text-dark font-weight-bold text-decoration-none" style={{ fontSize: "15px" }}>
              <i className="fas fa-dumbbell me-3 text-success" style={{ width: "20px", textAlign: "center" }} /> Personal Trainer
            </Link>
          </li>
          <li className="border-bottom py-2">
            <Link to={routes.contactUs} onClick={hideOffcanvas} className="d-flex align-items-center py-2 text-dark font-weight-bold text-decoration-none" style={{ fontSize: "15px" }}>
              <i className="fas fa-envelope me-3 text-success" style={{ width: "20px", textAlign: "center" }} /> Contact Us
            </Link>
          </li>
          <li className="border-bottom py-2">
            <Link to={routes.blogGrid} onClick={hideOffcanvas} className="d-flex align-items-center py-2 text-dark font-weight-bold text-decoration-none" style={{ fontSize: "15px" }}>
              <i className="fas fa-newspaper me-3 text-success" style={{ width: "20px", textAlign: "center" }} /> Blogs
            </Link>
          </li>
        </ul>

        <div className="mt-4 pt-3">
          {!loginToken ? (
            <div className="d-flex flex-column gap-2">
              <Link to="/login" className="navbar-login-btn text-center py-2 px-3 w-100" onClick={hideOffcanvas}>
                Login
              </Link>
              <Link to="/register" className="navbar-register-btn text-center py-2 px-3 w-100" onClick={hideOffcanvas}>
                Register
              </Link>
            </div>
          ) : (
            <button className="btn btn-outline-danger w-100 py-2" onClick={() => { removeToken(); hideOffcanvas(); }}>
              <i className="fas fa-sign-out-alt me-2" /> Logout
            </button>
          )}
        </div>
      </div>
    </div>
    {offcanvasOpen && (
      <div 
        className="offcanvas-backdrop fade show"
        onClick={hideOffcanvas}
        style={{ zIndex: 1050 }}
      />
    )}
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

import React from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const Error404 = () => {
  const route = all_routes;
  return (
    <div>
      {/* Main Wrapper */}
      <div className="main-wrapper error-page">
        {/* Page Content */}
        <div className="content ellipses">
          <div className="container">
            <header className="text-center mt-0">
              <Link to={route.home}>
                <ImageWithBasePath
                  src="assets/img/logo-black.svg"
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
            </header>
            <div className="errors-img">
              <ImageWithBasePath
                src="assets/img/404.png"
                className="img-fluid"
                alt="Venue"
              />
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-5 mx-auto text-center">
                <h3>
                  This site is currently <br /> under maintenance
                </h3>
                <p>
                  We apologize for the inconvenience caused We’ve almost done.
                </p>
                <Link
                  to={route.home}
                  className="btn btn-primary d-inline-flex align-items-center"
                >
                  Go to Home
                  <i className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      {/* /Main Wrapper */}
    </div>
  );
};

export default Error404;

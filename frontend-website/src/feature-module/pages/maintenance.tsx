import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from '../router/all_routes';

const Maintenance = () => {
  const routes = all_routes;
  return (
    <div>
      <div className="content ellipses maintenance">
        <div className="container">
          <div className="row vph-100 d-flex align-items-center">
            <div className="col-sm-10 col-md-10 col-lg-10 mx-auto text-center">
              {/* Header */}
              <header className="text-center">
                <Link to={routes.home}>
                  <ImageWithBasePath
                    src="assets/img/logo-black.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
              </header>
              {/* /Header */}
              <div className="text-img">
                <ImageWithBasePath
                  src="assets/img/maintenance.jpg"
                  className="img-fluid"
                  alt="Coming-Soon"
                />
              </div>
              <div className="col-sm-10 col-md-10 col-lg-10 mx-auto text-center">
                <h2>
                  This site is currently <br /> under maintenance
                </h2>
                <p>
                  We apologize for the inconvenience caused We’ve almost done.
                </p>
                <Link to={routes.home} className="btn btn-primary btn-icon">
                  Go to Home
                  <i className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;

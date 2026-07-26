import React from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const ComingSoon = () => {
  const route = all_routes;
  return (
    <div>
      {/* Page Content */}
      <div className="main-wrapper coming-soon-page">
        <div className="content ellipses">
          <div className="container">
            <section className="d-flex justify-content-center align-items-center">
              <div className="row vph-100 d-flex align-items-center">
                <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                  {/* Header */}
                  <header className="text-center">
                    <Link to={route.home}>
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
                      src="assets/img/coming-soon.png"
                      className="img-fluid"
                      alt="coming-soon"
                    />
                  </div>
                  <div className="col-sm-10 col-md-10 col-lg-10 mx-auto text-center">
                    <h3>Great things are coming soon</h3>
                    <p>
                      We are currently woking on new website , We’ll be
                      launching soon
                    </p>
                    <div className="subscribe-style">
                      <div className="subscribe-blk bg-white">
                        <div className="input-group align-items-center">
                          <i className="feather-mail" />
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email Address"
                            aria-label="email"
                          />
                          <div className="subscribe-btn-grp">
                            <input
                              type="submit"
                              className="btn btn-secondary"
                              defaultValue="Subscribe"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="play-img">
            <ImageWithBasePath
              src="assets/img/men.png"
              className="img-fluid"
              alt="Venue"
            />
          </div>
        </div>
        {/* /Page Content */}
      </div>
    </div>
  );
};

export default ComingSoon;

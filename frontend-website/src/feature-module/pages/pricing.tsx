import React from 'react'
import { Link } from "react-router-dom";
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath';
import { all_routes } from '../router/all_routes';

const Pricing = () => {
  const routes = all_routes;
  return (
    <div>
        <>
  {/* Breadcrumb */}
  <div className="breadcrumb breadcrumb-list mb-0">
    <span className="primary-right-round" />
    <div className="container">
      <h1 className="text-white">Pricing</h1>
      <ul>
        <li>
          <Link to={routes.home}>Home</Link>
        </li>
        <li>Pricing</li>
      </ul>
    </div>
  </div>
  {/* /Breadcrumb */}
  {/* Page Content */}
  <div className="content">
    {/* Featured Plans */}
    <section className="featured-plan">
      <div className="container">
        <div className="section-heading">
          <h2>We Have Excellent Plans For You.</h2>
          <p className="sub-title">
            Choose monthly or yearly plans for uninterrupted access to our
            premium badminton facilities. Join us and experience convenient
            excellence.
          </p>
        </div>
        <div className="interset-btn">
          <div className="status-toggle d-inline-flex align-items-center">
            Monthly
            <input type="checkbox" id="status_1" className="check" />
            <label htmlFor="status_1" className="checktoggle">
              checkbox
            </label>
            Yearly
          </div>
        </div>
        <div className="price-wrap">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-4 d-flex col-md-6">
              {/* Price Card */}
              <div className="price-card flex-fill ">
                <div className="price-head">
                  <ImageWithBasePath src="/assets/img/icons/price-01.svg" alt="Price" />
                  <h3>Professoinal</h3>
                </div>
                <div className="price-body">
                  <div className="per-month">
                    <h2>
                      <sup>$</sup>
                      <span>60.00</span>
                    </h2>
                    <span>Per Month</span>
                  </div>
                  <div className="features-price-list">
                    <h5>Features</h5>
                    <p>Everything in our free Upto 10 users. </p>
                    <ul>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Included : Quality checked by envato
                      </li>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Included : Future updates
                      </li>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Technical Support
                      </li>
                      <li className="inactive">
                        <i className="feather-x-circle" />
                        Add Listing{" "}
                      </li>
                      <li className="inactive">
                        <i className="feather-x-circle" />
                        Approval of Listing
                      </li>
                    </ul>
                  </div>
                  <div className="price-choose">
                    <Link to="#" className="btn viewdetails-btn">
                      Choose Plan
                    </Link>
                  </div>
                  <div className="price-footer">
                    <p className="mb-0">
                      Use, by you or one client, in a single end product which
                      end users. charged for. The total price includes the item
                      price and a buyer fee.
                    </p>
                  </div>
                </div>
              </div>
              {/* /Price Card */}
            </div>
            <div className="col-lg-4 d-flex col-md-6">
              {/* Price Card */}
              <div className="price-card flex-fill">
                <div className="price-head expert-price">
                  <ImageWithBasePath src="/assets/img/icons/price-02.svg" alt="Price" />
                  <h3>Expert</h3>
                  <span>Recommended</span>
                </div>
                <div className="price-body">
                  <div className="per-month">
                    <h2>
                      <sup>$</sup>
                      <span>60.00</span>
                    </h2>
                    <span>Per Month</span>
                  </div>
                  <div className="features-price-list">
                    <h5>Features</h5>
                    <p>Everything in our free Upto 10 users. </p>
                    <ul>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Included : Quality checked by envato
                      </li>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Included : Future updates
                      </li>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Technical Support
                      </li>
                      <li className="inactive">
                        <i className="feather-x-circle" />
                        Add Listing{" "}
                      </li>
                      <li className="inactive">
                        <i className="feather-x-circle" />
                        Approval of Listing
                      </li>
                    </ul>
                  </div>
                  <div className="price-choose active-price">
                    <Link to="#" className="btn viewdetails-btn">
                      Choose Plan
                    </Link>
                  </div>
                  <div className="price-footer">
                    <p className="mb-0">
                      Use, by you or one client, in a single end product which
                      end users. charged for. The total price includes the item
                      price and a buyer fee.
                    </p>
                  </div>
                </div>
              </div>
              {/* /Price Card */}
            </div>
            <div className="col-lg-4 d-flex col-md-6">
              {/* Price Card */}
              <div className="price-card flex-fill">
                <div className="price-head">
                  <ImageWithBasePath src="/assets/img/icons/price-03.svg" alt="Price" />
                  <h3>Enterprise</h3>
                </div>
                <div className="price-body">
                  <div className="per-month">
                    <h2>
                      <sup>$</sup>
                      <span>990.00</span>
                    </h2>
                    <span>Per Month</span>
                  </div>
                  <div className="features-price-list">
                    <h5>Features</h5>
                    <p>Everything in our free Upto 10 users. </p>
                    <ul>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Included : Quality checked by envato
                      </li>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Included : Future updates
                      </li>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Technical Support
                      </li>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Add Listing{" "}
                      </li>
                      <li className="active">
                        <i className="feather-check-circle" />
                        Approval of Listing
                      </li>
                    </ul>
                  </div>
                  <div className="price-choose">
                    <Link to="#" className="btn viewdetails-btn">
                      Choose Plan
                    </Link>
                  </div>
                  <div className="price-footer">
                    <p className="mb-0">
                      Use, by you or one client, in a single end product which
                      end users. charged for. The total price includes the item
                      price and a buyer fee.
                    </p>
                  </div>
                </div>
              </div>
              {/* /Price Card */}
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* /Featured Plans */}
  </div>
  {/* /Page Content */}
</>

    </div>
  )
}

export default Pricing
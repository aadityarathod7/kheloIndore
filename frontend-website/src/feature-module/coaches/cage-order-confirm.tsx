import React from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath'
import { all_routes } from '../router/all_routes'

const CageOrderConfirm = () => {
    const routes= all_routes;
  return (

   <div>
  {/* Breadcrumb */}
  <section className="breadcrumb mb-0">
    <span className="primary-right-round" />
    <div className="container">
      <h1 className="text-white">Book A Court</h1>
      <ul>
        <li><Link to={routes.home}>Home</Link></li>
        <li>Book A Court</li>
      </ul>
    </div>
  </section>
  {/* /Breadcrumb */}
  <section className="booking-steps py-30">
    <div className="container">
      <ul className="d-lg-flex justify-content-center align-items-center">
        <li ><h5><Link to={routes.cagedetails}><span>1</span>Book a Court</Link></h5></li>
        <li className="active"><h5><Link to={routes.cageordeconfirm}><span>2</span>Order Confirmation</Link></h5></li>
        <li><h5><Link to={routes.cagepersonalinfo}><span>3</span>Personal Information</Link></h5></li>
        <li><h5><Link to={routes.cagecheckout}><span>4</span>Payment</Link></h5></li>
      </ul>
    </div>
  </section>
  {/* Page Content */}
  <div className="content book-cage">
    <div className="container">
      <section className="card mb-40">
        <div className="text-center mb-40">
          <h3 className="mb-1">Order Confirmation</h3>
          <p className="sub-title mb-0">Thank you for your order! We&apos;re excited to fulfill it with care and efficiency.</p>
        </div>
        <div className="master-academy dull-whitesmoke-bg card">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <div className="d-sm-flex justify-content-start align-items-center">
                <Link to="#"><ImageWithBasePath src="/assets/img/master-academy.png" className="corner-radius-10"  alt="Venue" /></Link>
                <div className="info">
                  <div className="d-flex justify-content-start align-items-center mb-3">
                    <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">4.5</span>
                    <span>300 Reviews</span>
                  </div>
                  <h3 className="mb-2">Manchester Academy</h3>
                  <p>Manchester Academy: Where dreams meet excellence in sports education and training.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <ul className="d-sm-flex align-items-center justify-content-evenly">
                <li>
                  <h3 className="d-inline-block">$150</h3><span>/hr</span>
                  <p>up to 1 guests</p>
                </li>
                <li>
                  <span><i className="feather-plus" /></span>
                </li>
                <li>
                  <h3 className="d-inline-block">$5</h3><span>/hr</span>
                  <p>each additional guest <br />up to 4 guests max</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="card booking-order-confirmation">
        <h5 className="mb-3">Booking Details</h5>
        <ul className="booking-info d-lg-flex justify-content-between align-items-center">
          <li>
            <h6>Court Name</h6>
            <p>Standard Synthetic Court 1</p>
          </li>
          <li>
            <h6>Appointment Date</h6>
            <p>Mon, Jul 11</p>
          </li>
          <li>
            <h6>Appointment Start time</h6>
            <p>05:25 AM</p>
          </li>
          <li>
            <h6>Appointment End time</h6>
            <p>06:25 AM</p>
          </li>
          <li>
            <h6>Additional Guests</h6>
            <p>4</p>
          </li>
        </ul>
        <h5 className="mb-3">Contact  Information</h5>
        <ul className="contact-info d-lg-flex justify-content-start align-items-center">
          <li>
            <h6>Name</h6>
            <p>Rodick Tramliar</p>
          </li>
          <li>
            <h6>Contact Email Address</h6>
            <p>contact@example.com</p>
          </li>
          <li>
            <h6>Phone Number</h6>
            <p>+1 56565 556558</p>
          </li>
        </ul>
        <h5 className="mb-3">Payment Information</h5>
        <ul className="payment-info d-lg-flex justify-content-start align-items-center">
          <li>
            <h6>Cage Total</h6>
            <p className="primary-text">($250 * 2 hours)</p>
          </li>
          <li>
            <h6>Additional Guest total</h6>
            <p className="primary-text">(4 * $10)</p>
          </li>
          <li>
            <h6>Subtotal</h6>
            <p className="primary-text">$300.00</p>
          </li>
        </ul>
      </section>
      <div className="text-center btn-row">
        <Link className="btn btn-primary me-3 btn-icon" to={routes.cagedetails}><i className="feather-arrow-left-circle me-1" /> Back</Link>
        <Link className="btn btn-secondary btn-icon" to={routes.cagepersonalinfo}>Next <i className="feather-arrow-right-circle ms-1" /></Link>
      </div>
    </div>
    {/* /Container */}
  </div>
  {/* /Page Content */}
</div>

  )
}

export default CageOrderConfirm
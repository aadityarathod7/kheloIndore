import React from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath'
import { all_routes } from '../router/all_routes'

const CageCheckout = () => {
const routes = all_routes;
  return (


   <div>
  {/* Breadcrumb */}
  <div className="breadcrumb mb-0">
    <span className="primary-right-round" />
    <div className="container">
      <h1 className="text-white">Book A Court</h1>
      <ul className="list-unstyled">
        <li><Link to={routes.home}>Home</Link></li>
        <li>Book A Court</li>
      </ul>
    </div>
  </div>
  {/* /Breadcrumb */}
  <section className="booking-steps py-30">
    <div className="container">
      <ul className="d-lg-flex justify-content-center align-items-center">
        <li ><h5><Link to={routes.cagedetails}><span>1</span>Book a Court</Link></h5></li>
        <li><h5><Link to={routes.cageordeconfirm}><span>2</span>Order Confirmation</Link></h5></li>
        <li><h5><Link to={routes.cagepersonalinfo}><span>3</span>Personal Information</Link></h5></li>
        <li className="active"><h5><Link to={routes.cagecheckout}><span>4</span>Payment</Link></h5></li>
      </ul>
    </div>
  </section>
  {/* Page Content */}
  <div className="content">
    <div className="container">
      <section >
        <div className="text-center mb-40">
          <h3 className="mb-1">Payment</h3>
          <p className="sub-title mb-0">Secure your booking, complete payment, and enjoy our sophisticated facilities</p>
        </div>
        <div className="master-academy dull-whitesmoke-bg card mb-40">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="d-sm-flex justify-content-start align-items-center">
              <Link to="#"><ImageWithBasePath src="assets/img/master-academy.png" className="corner-radius-10"  alt="Venue" /></Link>
              <div className="info">
                <h3 className="mb-2">Manchester Academy</h3>
                <p>Manchester Academy: Where dreams meet excellence in sports education and training.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row checkout">
          <div className="col-12 col-sm-12 col-md-12 col-lg-7">
            <div className="card booking-details">
              <h3 className="border-bottom">Order Summary</h3>
              <ul className="list-unstyled">
                <li><i className="fa-regular fa-building me-2" />Standard Synthetic Court 1<span className="x-circle" /></li>
                <li><i className="feather-calendar me-2" />27, April 2023</li>
                <li><i className="feather-clock me-2" />01:00 PM to 03:00 PM</li>
                <li><i className="feather-users me-2" />2  Adults, 1 Children</li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-5">
            <aside className="card payment-modes">
              <h3 className="border-bottom">Checkout</h3>
              <h6 className="mb-3">Select Payment Gateway</h6>
              <div className="radio">
                <div className="form-check form-check-inline mb-3">
                  <input className="form-check-input default-check me-2" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultValue="Credit Card" />
                  <label className="form-check-label" htmlFor="inlineRadio1">Credit Card</label>
                </div>
                <div className="form-check form-check-inline mb-3">
                  <input className="form-check-input default-check me-2" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="Paypal" />
                  <label className="form-check-label" htmlFor="inlineRadio2">Paypal</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input default-check me-2" type="radio" name="inlineRadioOptions" id="inlineRadio3" defaultValue="Wallet" />
                  <label className="form-check-label" htmlFor="inlineRadio3">Wallet</label>
                </div>
              </div>
              <hr />
              <ul className="order-sub-total">
                <li>
                  <p>Sub total</p>
                  <h6>$250</h6>
                </li>
                <li>
                  <p>Additional Guest</p>
                  <h6>$25</h6>
                </li>
                <li>
                  <p>Service charge</p>
                  <h6>$70</h6>
                </li>
              </ul>
              <div className="order-total d-flex justify-content-between align-items-center">
                <h5>Order Total</h5>
                <h5>$450</h5>
              </div>
              <div className="form-check d-flex justify-content-start align-items-center policy">
                <div className="d-inline-block">
                  <input className="form-check-input" type="checkbox"  id="policy" />
                </div>
                <label className="form-check-label" htmlFor="policy">By clicking &apos;Send Request&apos;, I agree to Dreamsport <Link to="privacy-policy">Privacy Policy</Link> and <Link to="terms-condition">Terms of Use</Link></label>
              </div>
              <div className="d-grid btn-block">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookingconfirmModal">Proceed  $200</button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
    {/* /Container */}
  </div>
  {/* /Page Content */}


 {/* Booking Confirmed Modal */}
<div className="modal fade" id="bookingconfirmModal" tabIndex={-1} aria-labelledby="bookingconfirmModal" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header text-center d-inline-block">
        <ImageWithBasePath src="assets/img/icons/booking-confirmed.svg" alt="User" />
      </div>
      <div className="modal-body text-center">
        <h3 className="mb-3">Booking has been Confirmed</h3>
        <p>Check your email on the booking confirmation</p>
      </div>
      <div className="modal-footer text-center d-inline-block">
        <Link to={routes.userDashboard} className="btn btn-primary btn-icon"><i className="feather-arrow-left-circle me-1" />Back to Dashboard</Link>
      </div>
    </div>
  </div>
</div>
{/* /Booking Confirmed Modal */}


</div>


  
  )
}

export default CageCheckout
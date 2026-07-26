import React from 'react'
import { all_routes } from '../router/all_routes'
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath';

const LessonPayment = () => {
    const routes=all_routes;
  return (

    <div>
  {/* Breadcrumb */}
  <div className="breadcrumb mb-0">
    <span className="primary-right-round" />
    <div className="container">
      <h1 className="text-white">Book A Coach</h1>
      <ul>
        <li><Link to={routes.home}>Home</Link></li>
        <li>Book A Coach</li>
      </ul>
    </div>
  </div>
  {/* /Breadcrumb */}
  <section className="booking-steps py-30">
    <div className="container">
      <ul className="d-xl-flex justify-content-center align-items-center">
        <li><h5><Link to="coach-detailsto"><span>1</span>Type of Booking</Link></h5></li>
        <li><h5><Link to="lesson-typesto"><span>2</span>Leeson Type</Link></h5></li>
        <li><h5><Link to="lesson-timedateto"><span>3</span>Time &amp; Date</Link></h5></li>
        <li><h5><Link to="lesson-personalinfoto"><span>4</span>Personal Information</Link></h5></li>
        <li><h5><Link to="lesson-order-confirmto"><span>5</span>Order Confirmation</Link></h5></li>
        <li className="active"><h5><Link to="lesson-paymentto"><span>6</span>Payment</Link></h5></li>
      </ul>
    </div>
  </section>
  {/* Page Content */}
  <div className="content">
    <div className="container">
      <section className="mb-40">
        <div className="text-center mb-40">
          <h3 className="mb-1">Payment</h3>
          <p className="sub-title">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
        <div className="master-academy dull-whitesmoke-bg card mb-40">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-sm-flex justify-content-start align-items-center">
              <Link to="#"><ImageWithBasePath className="corner-radius-10" src="assets/img/profiles/avatar-02.png" alt="User" /></Link>
              <div className="info">
                <div className="d-flex justify-content-start align-items-center mb-3">
                  <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">4.5</span>
                  <span>300 Reviews</span>
                </div>
                <h3 className="mb-2">Kevin Anderson</h3>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row checkout">
          <div className="col-12 col-sm-12 col-md-12 col-lg-7">
            <div className="card booking-details">
              <h3 className="border-bottom">Order Summary</h3>
              <ul>
                <li>
                  <i className="me-2"><ImageWithBasePath src="assets/img/icons/lesson-types.svg" alt="Icon" /></i>27, April 2023
                </li>
                <li>
                  <i className="feather-calendar me-2" />
                  <div className="timing-points">
                    <p>Day 1  : 26, April 2023 - 7:00 PM</p>
                    <p>Day 2 : 27, April 2023 - 5:00 PM</p>
                    <p>Day 3 : 27, April 2023 - 6:00 PM</p>
                  </div>
                </li>
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
                <label className="form-check-label" htmlFor="policy">By clicking &apos;Send Request&apos;, I agree to Dreamsport <Link to="privacy-policyto">Privacy Policy</Link> and <Link to="terms-conditionto">Terms of Use</Link></label>
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
</div>


    )
}

export default LessonPayment
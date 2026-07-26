import React from 'react'
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../router/all_routes'

const Invoice = () => {
    const routes=all_routes;
  return (

    <div>
  {/* Breadcrumb */}
  <div className="breadcrumb breadcrumb-list mb-0">
    <span className="primary-right-round" />
    <div className="container">
      <h1 className="text-white">Invoice</h1>
      <ul>
        <li><Link to={routes.home}>Home</Link></li>
        <li>Invoice</li>
      </ul>
    </div>
  </div>
  {/* /Breadcrumb */}
  {/* Page Content */}
  <div className="content">
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-12 offset-md-1 col-md-10 col-lg-10">
          <div className="card">
            <div className="head d-flex justify-content-between align-items-center">
              <Link to={routes.home} className="navbar-brand logo d-flex align-items-center">
                <ImageWithBasePath src="assets/img/logo-black.svg" className="img-fluid" alt="Logo" />
              </Link>
              <div className="head-info text-end">
                <h4 className="text-uppercase">INVOICE</h4>
                <h5>KheloIndore</h5>
                <p className="mb-0">REG: 123000123000</p>
                <p className="mb-0">kheloindore@example.com | +64 123 1234 123</p>
              </div>
            </div>
            <hr />
            <div className="dull-bg from-to">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                  <h5>From </h5>
                  <p className="mb-0">Joseph</p>
                  <p className="mb-0">45, 5th Street Newyork, USA</p>
                  <p className="mb-0">LX6457</p>
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                  <h5>To </h5>
                  <p className="mb-0">Yaseer</p>
                  <p className="mb-0">778 Mittal street, Germany</p>
                  <p className="mb-0">454787</p>
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                  <table className="short-info w-100">
                    <tbody><tr>
                        <td>INVOICE NUMBER:</td>
                        <td className="text-end">INV-0002</td>
                      </tr>
                      <tr>
                        <td>INVOICE DATE:</td>
                        <td className="text-end">02 Jan 2023</td>
                      </tr>
                      <tr>
                        <td>DUE:</td>
                        <td className="text-end">20 Jan 2023</td>
                      </tr>
                    </tbody></table>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="invoice-table table table-bordered">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>GST</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Product name</td>
                    <td>1</td>
                    <td>2000.00</td>
                    <td>0.00</td>
                    <td>2,000.00</td>
                  </tr>
                  <tr>
                    <td>Product name</td>
                    <td>1</td>
                    <td>2000.00</td>
                    <td>0.00</td>
                    <td>2,000.00</td>
                  </tr>
                  <tr>
                    <td>Product name</td>
                    <td>1</td>
                    <td>2000.00</td>
                    <td>0.00</td>
                    <td>2,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Total */}
            <div className="row">
              <div className="col-sm-12 col-md-7 col-xl-7 ms-auto">
                <div className="dull-bg total-wrap table-responsive">
                  <table className="table-responsive table total">
                    <tbody>
                      <tr>
                        <td><h6>Sub Total (excl. GST)</h6></td>
                        <td className="text-end"><h6>$6,000.00</h6></td>
                      </tr>
                      <tr>
                        <td><h6>Total GST:</h6></td>
                        <td className="text-end"><h6>$0.00</h6></td>
                      </tr>
                      <tr>
                        <td><h6>Credit card fee (if using):</h6></td>
                        <td className="text-end"><h6>$92.00</h6></td>
                      </tr>
                      <tr>
                        <td><h6>Amount due on 20 Jan 2023:</h6></td>
                        <td className="text-end"><h6>6,092.00 USD</h6></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* /Total */}
            <div className="payment-detail d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-uppercase primary-text">PAYMENT INSTRUCTIONS</h6>
                <h5 className="mb-0">KheloIndore</h5>
                <p className="mb-0">Bank name: ABC Bank limited</p>
                <p className="mb-0">SWIFT/IBAN: NZ0201230012</p>
                <p>Account number: 12-1234-123456-12</p>
                <p className="mb-0">
                  Please use as INV-0002 as a reference number<br />
                  For any questions please contact us at kheloindore@example.com
                </p>
              </div>
              <div >
                <h5>Pay Online</h5>
                <Link to={routes.home} className="navbar-brand logo d-flex align-items-center justify-content-center">
                  <ImageWithBasePath src="assets/img/pay-online.jpg" className="img-fluid" alt="Scanner" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Page Content */}
</div>


  )
}

export default Invoice
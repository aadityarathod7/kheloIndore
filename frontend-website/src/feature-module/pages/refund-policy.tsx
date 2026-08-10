import React, { useEffect } from 'react'
import { all_routes } from '../router/all_routes'
import { Link } from 'react-router-dom';

export default function RefundPolicy() {

    const routes = all_routes;

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "refund-policy"
    }, [])

    return (
        <>
            <div>
                {/* Breadcrumb */}
            {/* Hero Section */}
            <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
                <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>

                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-start">
                            <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
                            <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                                Refund <span style={{ color: "#22C55E", marginLeft: "12px" }}>Policy</span>
                            </h1>
                            <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Please review our refund and cancellation policies</p>
                            <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                                <span style={{ color: "#22C55E", fontWeight: "600" }}>Refund Policy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                {/* /Breadcrumb */}
                {/* Page Content */}
                <div className="content">
                    <div className="container">
                        <h3>Refund Policy</h3>
                        {/* <h5>Last Updated: 03/07/2024</h5> */}
                        <div className="condition-details">
                            <p>
                                At <b>Khelo Indore</b> powered by <b>Mans Sports Entertainment</b>, we have customized pricing according to the services we render. The prices of the Services stated are in Indian Rupees. They include service tax, the details of which are provided to you beforehand according to the service&apos;s effort, efficiency, and output.
                            </p>
                            <p>
                                The registered User shall be able to book and/or register for a Service with any particular Service Provider only after making an advance payment of the Fees associated with the Services selected by You. Payment shall be made only through the payment gateways and modes listed on our website.
                            </p>
                            <p>
                                On receipt of the Final Confirmation from Khelo Indore, the User shall not be expected to pay any extra charges unless the nature of the transaction requires it. However, in the event of a Revised Booking, you may be required to pay the differential in the Fees of the Original Booking and the Revised Booking.
                            </p>
                            <p>
                            If you decline the alternate options proposed by us or if the fees paid for the original booking are higher than the fees payable for the Revised Booking, we shall refund the full fees or the differential fees, as the case may be, within 7 (seven) working days from the date of your decision to cancel the Provisional Confirmation or select the Revised Booking, as the case may be. Refunds will be processed within 7-10 days to your original payment methods.
                            </p>
                            <p>
                                We work hard to ensure the accuracy of pricing. Despite our efforts, pricing errors may still occur.
                            </p>
                            <p>
                                By providing a credit card or other payment method that we accept, You represent and warrant that You are authorized to use the designated payment method and that You authorize us (or our third-party payment processor) to charge Your payment for the total amount towards the Services as stated in the Final Confirmation (including any applicable taxes and other charges). If the payment method cannot be verified, is invalid, or is otherwise unacceptable, your service request may be suspended or cancelled. You must resolve any problem we encounter in order to proceed with Your service request. In the event You want to change or update payment information associated with Your Khelo Indore account, You can do so at any time by logging into Your account and editing Your payment information. You acknowledge that the amount billed may vary due to promotional offers, changes in Your preferred sessions, or changes in applicable taxes or other charges, and You authorize us (or our third-party payment processor) to charge Your payment method for the corresponding amount.
                            </p>
                            <p>
                                Prices may be adjusted at any time and for any reason (or no reason) without providing You prior notice. Services booked and paid for are subject to availability, and we reserve the right to cancel all or part of Services and to discontinue making certain Services available through Khelo Indore without prior notice.
                            </p>
                            <p>
                                It is at this moment clarified that the User shall not be permitted to cancel the Provisional Confirmation and obtain any refund against it under any circumstances, except as stated below:
                                <p className='px-4'>
                                    a. In the event Khelo Indore cannot confirm the Services for which Provisional Confirmation is generated; OR
                                </p>
                                <p className='px-4'>
                                    b. If the User is unwilling to opt for any alternate Services suggested by Khelo Indore.
                                    Please note, except as agreed to in these Terms of Use, We DO NOT ISSUE REFUNDS and any credits or corrective activity are issued at our sole discretion.
                                </p>
                            </p>
                            <h3>Contact Us</h3>
                            <p className='my-0'>If you have any questions about this Refund and Return Policy, please contact us at : <br/><b>Khelo Indore</b></p>
                            <p className='my-0'><b>Email</b>: info@kheloindore.in</p>
                            <p><b>Email</b>: manssportsentertainment@gmail.com</p>
                        </div>
                    </div>
                </div>
                {/* /Page Content */}
            </div>
        </>
    )
}

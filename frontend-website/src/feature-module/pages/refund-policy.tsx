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
                <div className="breadcrumb breadcrumb-list mb-0 top-margin">
                    <span className="primary-right-round" />
                    <div className="container">
                        <h1 className="text-white">Refund Policy</h1>
                        <ul>
                            <li>
                                <Link to={routes.home}>Home</Link>
                            </li>
                            <li>Refund Policy</li>
                        </ul>
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

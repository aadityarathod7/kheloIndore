import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { allCourt } from "../../core/data/interface/model";
import { userbookingdata } from "../../core/data/json/user_bookingdata";
import { all_routes } from "../router/all_routes";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { jwtDecode } from "jwt-decode";
import { AiFillFilePdf } from 'react-icons/ai';
import Swal from "sweetalert2";

interface JwtPayload {
  userID: number;
}
interface BookingData {
  PT: any;
  coach: any;
  venue: any;
}

interface AllBookings {
  packageType: any;
  slots: any;
  date: any;
  vendor_type: any;
  id: string,
  first_name: string,
  last_name: string,
  start_date: string,
  end_date: string,
  startTime: string,
  endTime: string,
  total_price: string,
  paymentState: string,
  name: string,
  startDate: string,
  verificationStatus: any,
  pdfUrl: any,
}

const UserBookings = () => {
  const routes = all_routes;
  const [searchInput, setSearchInput] = useState("");
  const [userDataId, setUserDataId] = useState<JwtPayload | null>(null);
  const [venueBookingData, setVenueBookingData] = useState<AllBookings[]>([])
  const [coachBookingData, setCoachBookingData] = useState<AllBookings[]>([])
  const [tarinerBookingData, setTrainerBookingData] = useState<AllBookings[]>([])
  const [bookingData, setBookingData] = useState<BookingData>()
  const [CurrentTime, setCurrentTime] = useState<BookingData>()



  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const getTokenFromStorage = () => {
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserDataId(decodedToken);
      } else {
        return;
      }
    };
    getTokenFromStorage();
  }, [token]);
  const user_id = userDataId?.userID
  const convertTo12HourFormat = (time: any) => {
    if (typeof time !== "string") return "";
    const normalized = time.trim().replace(/\s+/g, " ");
    // Slot records already use 12-hour strings such as "10:30 AM".
    if (/\b(AM|PM)\b/i.test(normalized)) return normalized;

    const [hours, minutes] = normalized.split(":");
    if (!hours || !minutes) return normalized;
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinutes = minutes.padStart(2, '0');
    return `${formattedHour}:${formattedMinutes} ${suffix}`;
  };

  const getBookingStatus = (booking: any) => {
    const refundStatus = String(booking?.refund?.refundStatus || "").toUpperCase();
    if (refundStatus === "SUCCESS" || refundStatus === "COMPLETED") return "Refunded";
    if (refundStatus === "PENDING") return "Refund Pending";
    if (booking?.cancellation_status === 1) return "Cancelled";
    if (booking?.verification_status === 1) return "Approved";
    if (booking?.verification_status === 2) return "Rejected";
    if (["COMPLETED", "SUCCESS"].includes(String(booking?.paymentState || "").toUpperCase())) {
      return "Pending Approval";
    }
    return booking?.paymentState || "Pending";
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/get/venue-coach-pt-booking/${user_id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const booking = response.data;
      setBookingData(booking);
      setCurrentTime(booking.data.formattedIST);
    } catch {
        // The request failure is handled by the surrounding UI state.
      }
  };

  useEffect(() => {
    if (user_id) {
      fetchBookings();
    }
  }, [user_id]);

  useEffect(() => {
    const ptData = bookingData?.data?.personalTrainer
    const transformed = ptData?.map((b: unknown) => {
      const booking = b as any;
      return {
        id: booking._id,
        first_name: booking?.pt_id?.first_name,
        last_name: booking?.pt_id?.last_name,
        startDate: booking?.startDate,
        endDate: booking?.endDate,
        startTime: booking?.start_time,
        endTime: booking?.end_time,
        total_price: booking?.total_price,
        paymentState: booking?.paymentState,
        pdfUrl: booking?.pdf_url,
        cancellation_status: booking?.cancellation_status,
        createdAt: booking?.createdAt,
        refund: booking?.refund,
        status: getBookingStatus(booking)
      };
    });
    setTrainerBookingData(transformed);

    const venueData = bookingData?.data?.venueAdmin
    const transformedVenue = venueData?.map((b: unknown) => {
      const booking = b as any;
      return {
        date: booking?.date,
        name: booking?.venue_id?.name,
        vendor_type: booking?.venue_id?.vendor_type,
        slots: booking?.slot_time,
        total_price: booking?.total_price,
        paymentState: booking?.paymentState,
        verificationStatus: booking?.verification_status,
        pdfUrl: booking?.pdf_url,
        id: booking?._id,
        cancellation_status: booking?.cancellation_status,
        createdAt: booking?.createdAt,
        refund: booking?.refund,
        status: getBookingStatus(booking)
      };
    });
    setVenueBookingData(transformedVenue);

    const coachData = bookingData?.data?.coach
    const transformedCoach = coachData?.map((b: unknown) => {
      const booking = b as any;
      return {
        startDate: booking?.startDate,
        endDate: booking?.endDate,
        first_name: booking?.coachId?.first_name,
        last_name: booking?.coachId?.last_name,
        packageType: booking?.packageType,
        paymentState: booking?.paymentState,
        total_price: booking?.total_price,
        startTime: booking?.start_time,
        endTime: booking?.end_time,
        pdfUrl: booking?.pdf_url,
        cancellation_status: booking?.cancellation_status,
        id: booking?._id,
        createdAt: booking?.createdAt,
        refund: booking?.refund,
        status: getBookingStatus(booking)
      };
    });
    setCoachBookingData(transformedCoach);

  }, [bookingData]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const canCancelBooking = (bookingData: any) => {
    if (bookingData?.cancellation_status === 1 || bookingData?.status === 'Rejected') {
      return false;
    }
    const bDateStr = bookingData.date || bookingData.startDate;
    if (!bDateStr) return true;

    const bDate = new Date(bDateStr);
    const today = new Date();
    const bDateOnly = new Date(bDate.getFullYear(), bDate.getMonth(), bDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (bDateOnly > todayOnly) return true;
    if (bDateOnly < todayOnly) return false;

    let startTimeStr = "";
    if (bookingData?.slots && bookingData.slots.length > 0) {
      startTimeStr = bookingData.slots[0].startTime;
    } else if (bookingData?.startTime) {
      startTimeStr = bookingData.startTime;
    }

    if (!startTimeStr) return true;

    let hours = 0;
    let minutes = 0;
    const match12 = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match12) {
      hours = parseInt(match12[1], 10);
      minutes = parseInt(match12[2], 10);
      const ampm = match12[3].toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    } else {
      const match24 = startTimeStr.split(":");
      if (match24.length >= 2) {
        hours = parseInt(match24[0], 10);
        minutes = parseInt(match24[1], 10);
      }
    }

    const bookingDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    return bookingDateTime > today;
  };

  const verifyCancellationSecurity = async (bookingId: string, bookingType: string): Promise<string | null> => {
    // 1. Generate a simple CAPTCHA question (e.g. math question like: 12 + 5 = ?)
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const captchaAnswer = num1 + num2;

    const { value: userCaptcha } = await Swal.fire({
      title: 'Security Verification',
      html: `
        <div class="mb-3">
          <label class="form-label fw-bold">Please solve the math puzzle to cancel:</label>
          <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
            <span class="fs-4 fw-bold px-3 py-1 bg-light border rounded">${num1} + ${num2} = </span>
            <input type="number" id="captcha-input" class="form-control text-center" style="width: 80px;" placeholder="?">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Verify',
      preConfirm: () => {
        const val = (document.getElementById('captcha-input') as HTMLInputElement).value;
        if (!val) {
          Swal.showValidationMessage('Please enter the answer');
          return false;
        }
        if (parseInt(val) !== captchaAnswer) {
          Swal.showValidationMessage('Incorrect answer, please try again');
          return false;
        }
        return true;
      }
    });

    if (!userCaptcha) return null;

    // 2. Request OTP from backend
    const swalSending = Swal.fire({
      title: 'Requesting OTP...',
      text: 'Sending SMS verification code to your registered mobile number.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await axios.post(
        `${API_URL}/booking/cancellation/request-otp`,
        { bookingId, bookingType },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      swalSending.close();
    } catch (error) {
      swalSending.close();
      const err = error as any;
      const errMsg = err.response?.data?.message || 'Failed to send verification OTP.';
      Swal.fire('Error', errMsg, 'error');
      return null;
    }

    // 3. Prompt user to enter the SMS OTP
    const { value: userOtp } = await Swal.fire({
      title: 'SMS Verification Required',
      text: 'Enter the 6-digit OTP code sent to your registered mobile number.',
      input: 'text',
      inputPlaceholder: 'Enter OTP code',
      inputAttributes: {
        maxlength: '6',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Verify & Cancel Booking',
      preConfirm: (value) => {
        if (!value || value.length !== 6) {
          Swal.showValidationMessage('Please enter a valid 6-digit OTP code');
          return false;
        }
        return value;
      }
    });

    return userOtp || null;
  };

  const cancelVenueBooking = async (bookingData: { id: string }) => {

    const { value: confirm } = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (confirm) {
      const otp = await verifyCancellationSecurity(bookingData.id, "venue");
      if (!otp) return;

      const swalLoading = Swal.fire({
        title: 'Cancelling...',
        text: 'Please wait while we process your request.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await axios.post(
          `${API_URL}/booking/cancellation/venue`,
          {
            bookingId: bookingData.id,
            otp,
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        fetchBookings();
        swalLoading.close();
        Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
      } catch (error) {
        fetchBookings();
        swalLoading.close();
        const err = error as any;
        const errMsg = err.response?.data?.message || 'There was an error cancelling your booking.';
        Swal.fire('Error', errMsg, 'error');
      }
    }
  };



  const cancelCoachBooking = async (bookingData: { id: string }) => {
    const { value: confirm } = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (confirm) {
      const otp = await verifyCancellationSecurity(bookingData.id, "coach");
      if (!otp) return;

      const swalLoading = Swal.fire({
        title: 'Cancelling...',
        text: 'Please wait while we process your request.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await axios.post(
          `${API_URL}/booking/cancellation/coach`,
          {
            bookingId: bookingData.id,
            otp,
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        fetchBookings();
        swalLoading.close();
        Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
      } catch (error) {
        fetchBookings();
        swalLoading.close();
        const err = error as any;
        const errMsg = err.response?.data?.message || 'There was an error cancelling your booking.';
        Swal.fire('Error', errMsg, 'error');
      }
    }
  };


  const cancelTrainerBooking = async (bookingData: { id: string }) => {
    const { value: confirm } = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (confirm) {
      const otp = await verifyCancellationSecurity(bookingData.id, "trainer");
      if (!otp) return;

      const swalLoading = Swal.fire({
        title: 'Cancelling...',
        text: 'Please wait while we process your request.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await axios.post(
          `${API_URL}/booking/cancellation/pt`,
          {
            bookingId: bookingData.id,
            otp,
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        fetchBookings();
        swalLoading.close(); // Close the loader
        Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
      } catch (error) {
        fetchBookings();
        swalLoading.close(); // Close the loader
        const err = error as any;
        const errMsg = err.response?.data?.message || 'There was an error cancelling your booking.';
        Swal.fire('Error', errMsg, 'error');
      }
    }
  };


  return (
    <>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "175px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>USER DASHBOARD</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                My <span style={{ color: "#22C55E", marginLeft: "12px" }}>Bookings</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "20px", fontWeight: "500", maxWidth: "480px" }}>Manage and track all your venue & coach bookings</p>
              
              <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                  <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="fas fa-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                  <span style={{ margin: "0 10px", color: "#64748B" }}><i className="fas fa-chevron-right" style={{ fontSize: "10px", color: "#64748B" }} /></span>
                  <span style={{ color: "#22C55E", fontWeight: "600" }}>My Bookings</span>
                </div>

                <div className="d-inline-flex align-items-center gap-2 ms-sm-2">
                  <Link to={routes.userBookings} className="ki-tab-btn active">
                    <i className="fas fa-calendar-alt me-2" />
                    <span>My Bookings</span>
                  </Link>
                  <Link to={routes.userProfile} className="ki-tab-btn">
                    <i className="fas fa-user-edit me-2" />
                    <span>Profile Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Content */}
      <div className="content court-bg">
        <div className="container">
          {/* Sort By */}
          {/* <div className="row">
            <div className="col-lg-12">
              <div className="sortby-section court-sortby-section">
                <div className="sorting-info">
                  <div className="row d-flex align-items-center">
                    <div className="col-xl-7 col-lg-7 col-sm-12 col-12">
                      <div className="coach-court-list">
                        <ul className="nav">
                          <li>
                            <Link to={routes.userBookings} className="active">
                              Upcoming
                            </Link>
                          </li>
                          <li>
                            <Link to={routes.userComplete}>Completed</Link>
                          </li>
                          <li>
                            <Link to={routes.userOngoing}>On Going</Link>
                          </li>
                          <li>
                            <Link to={routes.userCancelled}>Cancelled</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-5 col-lg-5 col-sm-12 col-12">
                      <div className="sortby-filter-group court-sortby">
                        <div className="sortbyset week-bg">
                          <div className="sorting-select">
                            <Dropdown
                              value={days}
                              onChange={(e) => setDays(e.value)}
                              options={day}
                              optionLabel="name"
                              placeholder="This Week"
                              className="select custom-select-list week-select"
                            />
                          </div>
                        </div>
                        <div className="sortbyset">
                          <span className="sortbytitle">Sort By</span>
                          <div className="sorting-select">
                            <Dropdown
                              value={price}
                              onChange={(e) => setPrice(e.value)}
                              options={sortby}
                              optionLabel="name"
                              placeholder="Relevance"
                              className="select-bg w-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* Sort By */}
          <div className="row">
            <div className="col-sm-12">
              <div className="court-tab-content">
                <div className="card card-tableset ki-bookings-card">
                  <div className="card-body">
                    <div className="coache-head-blk">
                      <div className="row align-items-center">
                        <div className="col-md-5">
                          <div className="court-table-head">
                            <h4>My Bookings</h4>
                            <p>
                              Manage and track all your bookings.
                            </p>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <div className="table-search-top">
                            <div className="dataTables_filter">
                              {/* <label>
                                <input
                                  type="text"
                                  value={searchInput}
                                  onChange={(e) =>
                                    setSearchInput(e.target.value)
                                  }
                                  placeholder="Search"
                                  className="form-control"
                                />
                              </label> */}
                            </div>
                            <div className="request-coach-list">
                              <div className="card-header-btns">
                                <nav>
                                  <div className="nav nav-tabs" role="tablist">
                                    <button
                                      className="nav-link active"
                                      id="nav-Recent-tab"
                                      data-bs-toggle="tab"
                                      data-bs-target="#nav-Recent"
                                      type="button"
                                      role="tab"
                                      aria-controls="nav-Recent"
                                      aria-selected="true"
                                    >
                                      Sports Venue
                                    </button>
                                    <button
                                      className="nav-link"
                                      id="nav-RecentCoaching-tab"
                                      data-bs-toggle="tab"
                                      data-bs-target="#nav-RecentCoaching"
                                      type="button"
                                      role="tab"
                                      aria-controls="nav-RecentCoaching"
                                      aria-selected="false"
                                    >
                                      Coaches
                                    </button>
                                    <button
                                      className="nav-link"
                                      id="nav-RecentTrainer-tab"
                                      data-bs-toggle="tab"
                                      data-bs-target="#nav-RecentTrainer"
                                      type="button"
                                      role="tab"
                                      aria-controls="nav-RecentTrainer"
                                      aria-selected="false"
                                    >
                                      Trainer
                                    </button>
                                  </div>
                                </nav>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-content">
                      <div
                        className="tab-pane fade active show"
                        id="nav-Recent"
                        role="tabpanel"
                        aria-labelledby="nav-Recent-tab"
                        tabIndex={0}
                      >
                        {(!venueBookingData || venueBookingData.length === 0) ? (
                          <div className="text-center py-5 my-3">
                            <div
                              className="d-inline-flex align-items-center justify-content-center mb-3"
                              style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" }}
                            >
                              <i className="fas fa-calendar-times fs-3" />
                            </div>
                            <h5 className="font-weight-bold text-dark mb-1">No Venue Bookings Found</h5>
                            <p className="text-muted mb-4" style={{ fontSize: "14px", maxWidth: "420px", margin: "0 auto" }}>
                              You haven&apos;t booked any sports venues yet. Explore top venues in Indore and book your slots!
                            </p>
                            <Link
                              to={routes.blogListSidebarLeft}
                              className="btn text-white px-4 py-2"
                              style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", borderRadius: "50px", fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)" }}
                            >
                              <i className="fas fa-calendar-plus me-2" /> Book a Venue Now
                            </Link>
                          </div>
                        ) : (
                          <div className="table-responsive table-datatble ki-bookings-table-wrap">
                            <table className="table datatable ki-bookings-table ki-venue-bookings-table">
                              <thead className="thead-light">
                                <tr>
                                  <th style={{ color: "#1E293B" }}>Venue Name</th>
                                  <th>Venue Type</th>
                                  <th>Date &amp; Time</th>
                                  <th>Payment</th>
                                  <th>Invoice</th>
                                  <th>Status</th>
                                  <th>Cancel Booking</th>
                                </tr>
                              </thead>
                              <tbody>
                                {venueBookingData.map((bookingData, index) => (
                                  <tr key={index}>
                                    <td>
                                      <h2 className="table-avatar">
                                        <span className="table-head-name flex-grow-1">
                                          <Link to="#" data-bs-toggle="modal" data-bs-target="#profile-coach">
                                            {bookingData?.name}
                                          </Link>
                                        </span>
                                      </h2>
                                    </td>
                                    <td>{bookingData?.vendor_type}</td>
                                    <td className="table-date-time">
                                      <div className="d-flex flex-column gap-2">
                                        <span className="fw-bold" style={{ fontSize: "14px", color: "#1E293B" }}>
                                          <i className="fas fa-calendar-alt me-2 text-success" />
                                          {formatDate(bookingData.date)}
                                        </span>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                          {bookingData?.slots?.map((slotData: any, idx: any) => (
                                            <span 
                                              key={idx} 
                                              style={{ 
                                                fontSize: "11px", 
                                                fontWeight: "600", 
                                                backgroundColor: "#F1F5F9", 
                                                color: "#334155", 
                                                border: "1px solid #CBD5E1", 
                                                padding: "4px 8px", 
                                                borderRadius: "6px",
                                                display: "inline-flex",
                                                alignItems: "center"
                                              }}
                                            >
                                              <i className="fas fa-clock me-1.5" style={{ fontSize: "10px", color: "#12AA50" }} />
                                              {convertTo12HourFormat(slotData?.startTime)} - {convertTo12HourFormat(slotData?.endTime)}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="pay-dark fs-16">{bookingData?.total_price ? "₹" : ""} {bookingData.total_price}</span>
                                    </td>
                                    <td>
                                      <a href={`${IMG_URL}${bookingData.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        <AiFillFilePdf size={24} color="#E53E3E" />
                                      </a>
                                    </td>
                                    <td className="ki-booking-status-cell">
                                      <span className={`ki-badge ${["Approved", "Completed", "Refunded"].includes(bookingData?.status) ? "confirmed" : bookingData?.status === "Pending" || bookingData?.status === "Refund Pending" || bookingData?.status === "Pending Approval" ? "pending" : "cancelled"}`}>
                                        {bookingData?.status}
                                      </span>
                                    </td>
                                    <td className="ki-booking-action-cell">
                                      {bookingData?.status === 'Rejected' ? "" : bookingData?.cancellation_status === 1 ? (
                                        <span className="btn" style={{ pointerEvents: "none", color: "#64748B", background: "#F1F5F9", border: "1px solid #CBD5E1", opacity: 1, fontWeight: 600 }}>Cancelled</span>
                                      ) : canCancelBooking(bookingData) ? (
                                        <span className="pay-dark fs-16 btn btn-primary" onClick={() => cancelVenueBooking(bookingData)}>Cancel</span>
                                      ) : ""}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-RecentCoaching"
                        role="tabpanel"
                        aria-labelledby="nav-RecentCoaching-tab"
                        tabIndex={0}
                      >
                        {(!coachBookingData || coachBookingData.length === 0) ? (
                          <div className="text-center py-5 my-3">
                            <div
                              className="d-inline-flex align-items-center justify-content-center mb-3"
                              style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" }}
                            >
                              <i className="fas fa-user-ninja fs-3" />
                            </div>
                            <h5 className="font-weight-bold text-dark mb-1">No Coach Bookings Found</h5>
                            <p className="text-muted mb-4" style={{ fontSize: "14px", maxWidth: "420px", margin: "0 auto" }}>
                              You haven&apos;t hired any coaches yet. Find certified coaches in your area and start training!
                            </p>
                            <Link
                              to={routes.coachesGrid}
                              className="btn text-white px-4 py-2"
                              style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", borderRadius: "50px", fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)" }}
                            >
                              <i className="fas fa-user-plus me-2" /> Find a Coach
                            </Link>
                          </div>
                        ) : (
                          <div className="table-responsive table-datatble ki-bookings-table-wrap">
                            <table className="table datatable ki-bookings-table ki-provider-bookings-table">
                              <thead className="thead-light">
                                <tr>
                                  <th>Coach Name</th>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Payment</th>
                                  <th>Invoice</th>
                                  <th>Status</th>
                                  <th>Cancel Booking</th>
                                </tr>
                              </thead>
                              <tbody>
                                {coachBookingData.map((bookingData, index) => (
                                  <tr key={index}>
                                    <td className="ki-booking-action-cell">
                                      <h2 className="table-avatar">
                                        <span className="table-head-name flex-grow-1">
                                          <Link to="#" data-bs-toggle="modal" data-bs-target="#profile-coach">
                                            {bookingData.first_name} {bookingData.last_name}
                                          </Link>
                                        </span>
                                      </h2>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center fw-bold" style={{ fontSize: "14px", color: "#1E293B" }}>
                                        <i className="fas fa-calendar-alt me-2 text-success" />
                                        {formatDate(bookingData.startDate)} - {formatDate(bookingData.endDate)}
                                      </div>
                                    </td>
                                    <td className="table-date-time">
                                      {bookingData?.startTime ? (
                                        <span 
                                          style={{ 
                                            fontSize: "11px", 
                                            fontWeight: "600", 
                                            backgroundColor: "#F1F5F9", 
                                            color: "#334155", 
                                            border: "1px solid #CBD5E1", 
                                            padding: "4px 8px", 
                                            borderRadius: "6px",
                                            display: "inline-flex",
                                            alignItems: "center"
                                          }}
                                        >
                                          <i className="fas fa-clock me-1.5" style={{ fontSize: "10px", color: "#12AA50" }} />
                                          {convertTo12HourFormat(bookingData.startTime)} - {convertTo12HourFormat(bookingData.endTime)}
                                        </span>
                                      ) : "-"}
                                    </td>
                                    <td>
                                      <span className="pay-dark fs-16">{bookingData?.total_price ? "₹" : ""} {bookingData.total_price}</span>
                                    </td>
                                    <td>
                                      <a href={`${IMG_URL}${bookingData.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        <AiFillFilePdf size={24} color="#E53E3E" />
                                      </a>
                                    </td>
                                    <td>
                                      <span className={`ki-badge ${["Approved", "Completed", "Refunded"].includes(bookingData?.status) ? "confirmed" : bookingData?.status === "Pending" || bookingData?.status === "Refund Pending" || bookingData?.status === "Pending Approval" ? "pending" : "cancelled"}`}>
                                        {bookingData?.status}
                                      </span>
                                    </td>
                                    <td>
                                      {bookingData?.status === 'Rejected' ? "" : bookingData?.cancellation_status === 1 ? (
                                        <span className="btn" style={{ pointerEvents: "none", color: "#64748B", background: "#F1F5F9", border: "1px solid #CBD5E1", opacity: 1, fontWeight: 600 }}>Cancelled</span>
                                      ) : canCancelBooking(bookingData) ? (
                                        <span className="pay-dark fs-16 btn btn-primary" onClick={() => cancelCoachBooking(bookingData)}>Cancel</span>
                                      ) : ""}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-RecentTrainer"
                        role="tabpanel"
                        aria-labelledby="nav-RecentTrainer-tab"
                        tabIndex={0}
                      >
                        {(!tarinerBookingData || tarinerBookingData.length === 0) ? (
                          <div className="text-center py-5 my-3">
                            <div
                              className="d-inline-flex align-items-center justify-content-center mb-3"
                              style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" }}
                            >
                              <i className="fas fa-dumbbell fs-3" />
                            </div>
                            <h5 className="font-weight-bold text-dark mb-1">No Trainer Bookings Found</h5>
                            <p className="text-muted mb-4" style={{ fontSize: "14px", maxWidth: "420px", margin: "0 auto" }}>
                              You haven&apos;t booked any trainers yet. Level up your fitness with expert trainers!
                            </p>
                            <Link
                              to={routes.blogList}
                              className="btn text-white px-4 py-2"
                              style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", borderRadius: "50px", fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)" }}
                            >
                              <i className="fas fa-dumbbell me-2" /> Explore Trainers
                            </Link>
                          </div>
                        ) : (
                          <div className="table-responsive table-datatble ki-bookings-table-wrap">
                            <table className="table datatable ki-bookings-table ki-provider-bookings-table">
                              <thead className="thead-light">
                                <tr>
                                  <th>Trainer Name</th>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Payment</th>
                                  <th>Invoice</th>
                                  <th>Status</th>
                                  <th>Cancel Booking</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tarinerBookingData.map((bookingData, index) => (
                                  <tr key={index}>
                                    <td>
                                      <h2 className="table-avatar">
                                        <span className="table-head-name flex-grow-1">
                                          <Link to="#" data-bs-toggle="modal" data-bs-target="#profile-coach">
                                            {bookingData.first_name} {bookingData.last_name}
                                          </Link>
                                        </span>
                                      </h2>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center fw-bold" style={{ fontSize: "14px", color: "#1E293B" }}>
                                        <i className="fas fa-calendar-alt me-2 text-success" />
                                        {formatDate(bookingData?.startDate)} - {formatDate(bookingData?.endDate)}
                                      </div>
                                    </td>
                                    <td className="table-date-time">
                                      {bookingData?.startTime ? (
                                        <span 
                                          style={{ 
                                            fontSize: "11px", 
                                            fontWeight: "600", 
                                            backgroundColor: "#F1F5F9", 
                                            color: "#334155", 
                                            border: "1px solid #CBD5E1", 
                                            padding: "4px 8px", 
                                            borderRadius: "6px",
                                            display: "inline-flex",
                                            alignItems: "center"
                                          }}
                                        >
                                          <i className="fas fa-clock me-1.5" style={{ fontSize: "10px", color: "#12AA50" }} />
                                          {convertTo12HourFormat(bookingData.startTime)} - {convertTo12HourFormat(bookingData.endTime)}
                                        </span>
                                      ) : "-"}
                                    </td>
                                    <td>
                                      <span className="pay-dark fs-16">{bookingData?.total_price ? "₹" : ""} {bookingData.total_price}</span>
                                    </td>
                                    <td>
                                      <a href={`${IMG_URL}${bookingData.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        <AiFillFilePdf size={24} color="#E53E3E" />
                                      </a>
                                    </td>
                                    <td>
                                      <span className={`ki-badge ${["Approved", "Completed", "Refunded"].includes(bookingData?.status) ? "confirmed" : bookingData?.status === "Pending" || bookingData?.status === "Refund Pending" || bookingData?.status === "Pending Approval" ? "pending" : "cancelled"}`}>
                                        {bookingData?.status}
                                      </span>
                                    </td>
                                    <td>
                                      {bookingData?.status === 'Rejected' ? "" : bookingData?.cancellation_status === 1 ? (
                                        <span className="btn" style={{ pointerEvents: "none", color: "#64748B", background: "#F1F5F9", border: "1px solid #CBD5E1", opacity: 1, fontWeight: 600 }}>Cancelled</span>
                                      ) : canCancelBooking(bookingData) ? (
                                        <span className="pay-dark fs-16 btn btn-primary" onClick={() => cancelTrainerBooking(bookingData)}>Cancel</span>
                                      ) : ""}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-footer">
                  <div className="row">
                    <div className="col-md-6">
                      <div id="tablelength" />
                    </div>
                    <div className="col-md-6">
                      <div id="tablepage" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* upcoming Modal */}
      <div
        className="modal custom-modal fade request-modal"
        id="upcoming-court"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-header modal-header-title">
                <h4 className="mb-0">
                  Court Booking Details
                  <span className="badge bg-info ms-2">Upcoming</span>
                </h4>
              </div>
              <Link
                to="#"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              {/* Court Request */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Court Information</h4>
                    </div>
                    <div className="appointment-info">
                      <ul className="appointmentset">
                        <li>
                          <div className="appointment-item">
                            <div className="appointment-img">
                              <ImageWithBasePath
                                src="/assets/img/booking/booking-03.jpg"
                                alt="Booking"
                              />
                            </div>
                            <div className="appointment-content">
                              <h6>Wing Sports Academy</h6>
                              <p className="color-green">Court 1</p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <h6>Booked On</h6>
                          <p>₹150 Upto 2 guests</p>
                        </li>
                        <li>
                          <h6>Price Per Guest</h6>
                          <p>₹15</p>
                        </li>
                        <li>
                          <h6>Maximum Number of Guests</h6>
                          <p>2</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Appointment Information</h4>
                    </div>
                    <div className="appointment-info appoin-border">
                      <ul className="appointmentset">
                        <li>
                          <h6>Booked On</h6>
                          <p>Mon, Jul 14</p>
                        </li>
                        <li>
                          <h6>Date &amp; Time</h6>
                          <p>Mon, Jul 14</p>
                          <p>05:00 PM - 08:00 PM</p>
                        </li>
                        <li>
                          <h6>Total Number of Hours</h6>
                          <p>2</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Payment Details</h4>
                    </div>
                    <div className="appointment-info appoin-border double-row">
                      <ul className="appointmentset">
                        <li>
                          <h6>Court Booking Amount</h6>
                          <p>₹150</p>
                        </li>
                        <li>
                          <h6>Additional Guests</h6>
                          <p>2</p>
                        </li>
                        <li>
                          <h6>Amount Additional Guests</h6>
                          <p>₹30</p>
                        </li>
                        <li>
                          <h6>Service Charge</h6>
                          <p>₹20</p>
                        </li>
                      </ul>
                    </div>
                    <div className="appointment-info appoin-border ">
                      <ul className="appointmentsetview">
                        <li>
                          <h6>Total Amount Paid</h6>
                          <p className="color-green">₹180</p>
                        </li>
                        <li>
                          <h6>Paid On</h6>
                          <p>Mon, Jul 14</p>
                        </li>
                        <li>
                          <h6>Transaction ID</h6>
                          <p>#5464164445676781641</p>
                        </li>
                        <li>
                          <h6>Payment type</h6>
                          <p>Wallet</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Court Request */}
            </div>
            <div className="modal-footer">
              <div className="table-accept-btn">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn cancel-table-btn"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /upcoming Modal */}

      {/* cancel Modal */}
      <div
        className="modal custom-modal fade request-modal"
        id="cancel-court"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-header modal-header-title">
                <h4 className="mb-0">
                  Coach Booking Details
                  <span className="badge bg-danger ms-2">Cancelled</span>
                </h4>
              </div>
              <Link
                to="#"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              {/* Court Request */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Court Information</h4>
                    </div>
                    <div className="appointment-info">
                      <ul className="appointmentset">
                        <li>
                          <div className="appointment-item">
                            <div className="appointment-img">
                              <ImageWithBasePath
                                src="/assets/img/featured/featured-06.jpg"
                                alt="Venue"
                              />
                            </div>
                            <div className="appointment-content">
                              <h6>Angela Roudrigez</h6>
                              <div className="table-rating">
                                <div className="rating-point">
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                  <span>30 Reviews</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <h6>Location</h6>
                          <p>Santa Monica, CA</p>
                        </li>
                        <li>
                          <h6>Price Per Hour</h6>
                          <p>₹200.00 / hr</p>
                        </li>
                        <li>
                          <h6>Rank</h6>
                          <p>Expert</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Appointment Information</h4>
                    </div>
                    <div className="appointment-info appoin-border">
                      <ul className="appointmentset">
                        <li>
                          <h6>Booked On</h6>
                          <p>Mon, Jul 14</p>
                        </li>
                        <li>
                          <h6>Booking Type</h6>
                          <p>Onetime</p>
                        </li>
                        <li>
                          <h6>Date &amp; Time</h6>
                          <p>
                            Mon, Jul 14
                            <span>05:00 PM - 08:00 PM</span>
                          </p>
                        </li>
                        <li>
                          <h6>Total Number of Hours</h6>
                          <p>2</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Payment Details</h4>
                    </div>
                    <div className="appointment-info appoin-border double-row">
                      <ul className="appointmentset">
                        <li>
                          <h6>Coaching Booking Amount</h6>
                          <p>₹200</p>
                        </li>
                        <li>
                          <h6>Number of Hours</h6>
                          <p>2</p>
                        </li>
                        <li>
                          <h6>Service Charge</h6>
                          <p>₹20</p>
                        </li>
                      </ul>
                    </div>
                    <div className="appointment-info appoin-border ">
                      <ul className="appointmentset">
                        <li>
                          <h6>Total Amount Paid</h6>
                          <p className="color-green">₹180</p>
                        </li>
                        <li>
                          <h6>Paid On</h6>
                          <p>Mon, Jul 14</p>
                        </li>
                        <li>
                          <h6>Transaction ID</h6>
                          <p>#5464164445676781641</p>
                        </li>
                        <li>
                          <h6>Payment type</h6>
                          <p>Wallet</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information mb-0">
                    <div className="card-header">
                      <h4>Reason for Cancellation</h4>
                    </div>
                    <div className="user-review-details">
                      <div className="user-review-content">
                        <h6 className="text-danger">Cancelled By Coach</h6>
                        <p>
                          If you are looking for a perfect place for friendly
                          matches with your friends or a competitive match, It
                          is the best place.
                        </p>
                        <h5>Sent on 11/03/2023</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Court Request */}
            </div>
            <div className="modal-footer">
              <div className="table-accept-btn table-btn-split">
                <Link to="#" className="btn initiate-table-btn">
                  Initiate Refund
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /cancel Modal */}

      {/* /Page Content */}
    </>
  );
};

export default UserBookings;

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
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinutes = minutes.padStart(2, '0');
    return `${formattedHour}:${formattedMinutes} ${suffix}`;
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
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchBookings();
    }
  }, [user_id]);

  useEffect(() => {
    const ptData = bookingData?.data?.personalTrainer
    const transformed = ptData?.map((booking: any) => ({
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
      status: booking?.cancellation_status === 1
        ? 'Cancelled'
        : booking?.verification_status === 1
          ? 'Approved'
          : booking?.verification_status === 2
            ? 'Rejected'
            : booking?.paymentState
    }));
    setTrainerBookingData(transformed);

    const venueData = bookingData?.data?.venueAdmin
    const transformedVenue = venueData?.map((booking: any) => ({
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
      status: booking?.cancellation_status === 1
        ? 'Cancelled'
        : booking?.verification_status === 1
          ? 'Approved'
          : booking?.verification_status === 2
            ? 'Rejected'
            : booking?.paymentState
    }));
    setVenueBookingData(transformedVenue);

    const coachData = bookingData?.data?.coach
    const transformedCoach = coachData?.map((booking: any) => ({
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
      status: booking?.cancellation_status === 1
        ? 'Cancelled'
        : booking?.verification_status === 1
          ? 'Approved'
          : booking?.verification_status === 2
            ? 'Rejected'
            : booking?.paymentState
    }));
    setCoachBookingData(transformedCoach);

  }, [bookingData]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const cancelVenueBooking = async (bookingData: any) => {

    const { value: confirm } = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (confirm) {
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
        const response = await axios.post(
          `${API_URL}/booking/cancellation/venue`,
          {
            bookingId: bookingData.id,
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
        console.error('Error canceling booking:', error);
        swalLoading.close();
        Swal.fire('Error', 'There was an error cancelling your booking.', 'error');
      }
    }
  };



  const cancelCoachBooking = async (bookingData: any) => {
    const { value: confirm } = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (confirm) {
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
        const response = await axios.post(
          `${API_URL}/booking/cancellation/coach`,
          {
            bookingId: bookingData.id,
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
        console.error('Error canceling booking:', error);
        swalLoading.close();
        Swal.fire('Error', 'There was an error cancelling your booking.', 'error');
      }
    }
  };


  const cancelTrainerBooking = async (bookingData: any) => {
    const { value: confirm } = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (confirm) {
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
        const response = await axios.post(
          `${API_URL}/booking/cancellation/pt`,
          {
            bookingId: bookingData.id,
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
        console.error('Error canceling booking:', error);
        swalLoading.close(); // Close the loader
        Swal.fire('Error', 'There was an error cancelling your booking.', 'error');
      }
    }
  };


  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0 top-margin">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">My Bookings</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>My Bookings</li>
          </ul>
        </div>
      </section>
      {/* /Breadcrumb */}
      {/* Dashboard Menu */}
      <div className="dashboard-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard-menu">
                <ul>
                  {/* <li>
                    <Link to={routes.userDashboard}>
                      <ImageWithBasePath
                        src="/assets/img/icons/dashboard-icon.svg"
                        alt="Icon"
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li> */}
                  <li>
                    <Link to={routes.userBookings} className="active">
                      <ImageWithBasePath
                        src="/assets/img/icons/booking-icon.svg"
                        alt="Icon"
                      />
                      <span>My Bookings</span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link to={routes.userChat}>
                      <ImageWithBasePath
                        src="/assets/img/icons/chat-icon.svg"
                        alt="Icon"
                      />
                      <span>Chat</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link to={routes.userInvoice}>
                      <ImageWithBasePath
                        src="/assets/img/icons/invoice-icon.svg"
                        alt="Icon"
                      />
                      <span>Invoices</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link to={routes.userWallet}>
                      <ImageWithBasePath
                        src="/assets/img/icons/wallet-icon.svg"
                        alt="Icon"
                      />
                      <span>Wallet</span>
                    </Link>
                  </li> */}
                  <li>
                    <Link to={routes.userProfile}>
                      <ImageWithBasePath
                        src="/assets/img/icons/profile-icon.svg"
                        alt="Icon"
                      />
                      <span>Profile Settings</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Dashboard Menu */}
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
                <div className="card card-tableset">
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
                                      Personal Trainer
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
                        <div className="table-responsive table-datatble">
                          <table className="table  datatable">
                            <thead className="thead-light">
                              <tr>
                                <th>Venue Name</th>
                                <th>Venue Type</th>
                                <th>Date &amp; Time</th>
                                <th>Payment</th>
                                <th>Invoice</th>
                                <th>Status</th>
                                <th>Cancel Booking</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              {
                                venueBookingData?.map((bookingData, index) => (
                                  <tr key={index}>
                                    <td>
                                      <h2 className="table-avatar">
                                        {/* <Link
                                          to="#"
                                          className="avatar avatar-sm flex-shrink-0"
                                        >
                                          <ImageWithBasePath
                                            className="avatar-img"
                                            src="/assets/img/featured/featured-05.jpg"
                                            alt="User"
                                          />
                                        </Link> */}
                                        <span className="table-head-name flex-grow-1">
                                          <Link
                                            to="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#profile-coach"
                                          >
                                            {bookingData?.name}
                                          </Link>
                                          {/* <span className="book-active">
                                            Booked on : 25 May 2023
                                          </span> */}
                                        </span>
                                      </h2>
                                    </td>
                                    <td>{bookingData?.vendor_type}</td>
                                    <td className="table-date-time">
                                      <h4>
                                        Date - {formatDate(bookingData.date)}
                                        {bookingData?.slots?.map((slotData: any, index: any) => (
                                          <span key={index}>Slot - {convertTo12HourFormat(slotData?.startTime)} - {convertTo12HourFormat(slotData?.endTime)}</span>
                                        ))}
                                      </h4>
                                    </td>
                                    <td>
                                      <span className="pay-dark fs-16">{bookingData?.total_price ? ("₹") : ("")} {bookingData.total_price}</span>
                                    </td>
                                    <td>
                                      <a href={`${IMG_URL}${bookingData.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        <AiFillFilePdf size={24} color="#E53E3E" />
                                      </a>
                                    </td>
                                    <td>
                                      <span className="pay-dark fs-16">
                                        {bookingData?.status}
                                        {/* {bookingData.verificationStatus === 0
                                          ? 'Pending'
                                          : bookingData.verificationStatus === 1
                                            ? 'Approved'
                                            : 'Rejected'} */}
                                      </span>
                                    </td>
                                    <td>
                                      {
                                        bookingData?.status === 'Rejected' ? (
                                          ""
                                        ) : bookingData?.cancellation_status === 1 ? (
                                          <span className="pay-dark fs-16 btn btn-secondary" style={{ pointerEvents: "none", opacity: 0.6 }}>
                                            Cancelled
                                          </span>
                                        ) : (new Date() - new Date(bookingData.createdAt)) / (1000 * 60 * 60) < 2 ? (
                                          <span className="pay-dark fs-16 btn btn-primary" onClick={() => cancelVenueBooking(bookingData)}>
                                            Cancel
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      }

                                    </td>
                                    {/* <td className="text-end">
                                  <div className="dropdown dropdown-action table-drop-action">
                                    <Link
                                      to="#"
                                      className="action-icon dropdown-toggle"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i className="fas fa-ellipsis-h" />
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-end">
                                      <Link className="dropdown-item" to="#">
                                        <i className="feather-edit" />
                                        Edit
                                      </Link>
                                      <Link className="dropdown-item" to="#">
                                        <i className="feather-trash" />
                                        Delete
                                      </Link>
                                    </div>
                                  </div>
                                </td> */}
                                  </tr>
                                ))
                              }

                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-RecentCoaching"
                        role="tabpanel"
                        aria-labelledby="nav-RecentCoaching-tab"
                        tabIndex={0}
                      >
                        <div className="table-responsive table-datatble">
                          <table className="table  datatable">
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
                              {
                                coachBookingData?.map((bookingData, index) => (
                                  <tr key={index}>
                                    <td>
                                      <h2 className="table-avatar">
                                        {/* <Link
                                          to="#"
                                          className="avatar avatar-sm flex-shrink-0"
                                        >
                                          <ImageWithBasePath
                                            className="avatar-img"
                                            src="/assets/img/featured/featured-05.jpg"
                                            alt="User"
                                          />
                                        </Link> */}
                                        <span className="table-head-name flex-grow-1">
                                          <Link
                                            to="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#profile-coach"
                                          >
                                            {bookingData.first_name} {bookingData.last_name}
                                          </Link>
                                          {/* <span className="book-active">
                                            Booked on : 25 May 2023
                                          </span> */}
                                        </span>
                                      </h2>
                                    </td>
                                    <td>{formatDate(bookingData.startDate)} - {formatDate(bookingData.endDate)}</td>
                                    <td className="table-date-time">
                                      <h4>
                                        <span>{bookingData?.startTime && convertTo12HourFormat(bookingData?.startTime)} - {bookingData?.endTime && convertTo12HourFormat(bookingData?.endTime)}</span>
                                      </h4>
                                    </td>
                                    <td>
                                      <span className="pay-dark fs-16">{bookingData?.total_price ? ("₹") : ("")} {bookingData.total_price}</span>
                                    </td>
                                    <td>
                                      <a href={`${IMG_URL}${bookingData.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        <AiFillFilePdf size={24} color="#E53E3E" />
                                      </a>
                                    </td>
                                    <td>
                                      <span className="pay-dark fs-16">{bookingData.status}</span>
                                      {/* {bookingData.paymentState} */}
                                    </td>
                                    <td>
                                      {
                                        bookingData?.status === 'Rejected' ? (
                                          ""
                                        ) : bookingData?.cancellation_status === 1 ? (
                                          <span className="pay-dark fs-16 btn btn-secondary" style={{ pointerEvents: "none", opacity: 0.6 }}>
                                            Cancelled
                                          </span>
                                        ) : (new Date() - new Date(bookingData.createdAt)) / (1000 * 60 * 60) < 2 ? (
                                          <span className="pay-dark fs-16 btn btn-primary" onClick={() => cancelCoachBooking(bookingData)}>
                                            Cancel
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      }
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-RecentTrainer"
                        role="tabpanel"
                        aria-labelledby="nav-RecentTrainer-tab"
                        tabIndex={0}
                      >
                        <div className="table-responsive table-datatble">
                          <table className="table  datatable">
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
                              {
                                tarinerBookingData?.map((bookingData, index) => (
                                  <tr key={index}>
                                    <td>
                                      <h2 className="table-avatar">
                                        <span className="table-head-name flex-grow-1">
                                          <Link
                                            to="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#profile-coach"
                                          >
                                            {bookingData.first_name} {bookingData.last_name}
                                          </Link>
                                          {/* <span className="book-active">
                                            Booked on : 25 May 2023
                                          </span> */}
                                        </span>
                                      </h2>
                                    </td>
                                    <td>{formatDate(bookingData?.startDate)} - {formatDate(bookingData?.endDate)}</td>
                                    <td className="table-date-time">
                                      <h4>
                                        <span>{bookingData?.startTime && convertTo12HourFormat(bookingData?.startTime)} - {bookingData?.endTime && convertTo12HourFormat(bookingData?.endTime)}</span>
                                      </h4>
                                    </td>
                                    <td>
                                      <span className="pay-dark fs-16">{bookingData?.total_price ? ("₹") : ("")} {bookingData.total_price}</span>
                                    </td>
                                    <td>
                                      <a href={`${IMG_URL}${bookingData.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        <AiFillFilePdf size={24} color="#E53E3E" />
                                      </a>
                                    </td>
                                    <td>
                                      {/* {bookingData.paymentState} */}
                                      <span className="pay-dark fs-16">{bookingData.status}</span>
                                    </td>
                                    <td>
                                      {
                                        bookingData?.status === 'Rejected' ? (
                                          ""
                                        ) : bookingData?.cancellation_status === 1 ? (
                                          <span className="pay-dark fs-16 btn btn-secondary" style={{ pointerEvents: "none", opacity: 0.6 }}>
                                            Cancelled
                                          </span>
                                        ) : (new Date() - new Date(bookingData.createdAt)) / (1000 * 60 * 60) < 2 ? (
                                          <span className="pay-dark fs-16 btn btn-primary" onClick={() => cancelTrainerBooking(bookingData)}>
                                            Cancel
                                          </span>
                                        ) : (
                                          ""
                                        )
                                      }
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
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
                          <p>$150 Upto 2 guests</p>
                        </li>
                        <li>
                          <h6>Price Per Guest</h6>
                          <p>$15</p>
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
                          <p>$150</p>
                        </li>
                        <li>
                          <h6>Additional Guests</h6>
                          <p>2</p>
                        </li>
                        <li>
                          <h6>Amount Additional Guests</h6>
                          <p>$30</p>
                        </li>
                        <li>
                          <h6>Service Charge</h6>
                          <p>$20</p>
                        </li>
                      </ul>
                    </div>
                    <div className="appointment-info appoin-border ">
                      <ul className="appointmentsetview">
                        <li>
                          <h6>Total Amount Paid</h6>
                          <p className="color-green">$180</p>
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
                          <p>$200.00 / hr</p>
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
                          <p>$200</p>
                        </li>
                        <li>
                          <h6>Number of Hours</h6>
                          <p>2</p>
                        </li>
                        <li>
                          <h6>Service Charge</h6>
                          <p>$20</p>
                        </li>
                      </ul>
                    </div>
                    <div className="appointment-info appoin-border ">
                      <ul className="appointmentset">
                        <li>
                          <h6>Total Amount Paid</h6>
                          <p className="color-green">$180</p>
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

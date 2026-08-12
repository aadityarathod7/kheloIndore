import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { jwtDecode} from "jwt-decode";
import { API_URL, IMG_URL } from "../../ApiUrl";
import axios from "axios";
import Swal from "sweetalert2";

interface JwtPayload {
  userID: string | number;
}

interface UserData{
  last_name: string;
  first_name: string;
  email: string;
  mobile: string;
  booking_count: number;
}

interface ApiBooking {
  _id?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  start_time?: string;
  end_time?: string;
  total_price?: number;
  paymentState?: string;
  pdf_url?: string;
  cancellation_status?: number;
  verification_status?: number;
  createdAt?: string;
  status?: string;
  refund?: { refundStatus?: string };
  venue_id?: { name?: string; vendor_type?: string };
  coachId?: { first_name?: string; last_name?: string };
  pt_id?: { first_name?: string; last_name?: string };
  slot_time?: string;
  packageType?: string;
}

interface DashboardBooking {
  id?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  vendor_type?: string;
  slots?: string;
  packageType?: string;
  total_price?: number;
  paymentState?: string;
  verificationStatus?: number;
  pdfUrl?: string;
  cancellation_status?: number;
  createdAt?: string;
  status?: string;
  refund?: { refundStatus?: string };
}

interface FavouriteVenue {
  _id?: string;
  id?: string | number;
  name?: string;
  images?: Array<{ src?: string }>;
}

const UserDashboard = () => {
  const routes = all_routes;
  const [userDataId, setUserDataId] = useState<JwtPayload | null>(null);
  const [userData,setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const getTokenFromStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserDataId(decodedToken);
      } else {
        return;
      }
    };
    getTokenFromStorage();
  }, []);

  const user_id = userDataId?.userID

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/fetch-user-by-id/${user_id}`);
        const userData = response.data.data;
        setUserData(userData);
      } catch {
        // The request failure is handled by the surrounding UI state.
      }
    };
    if (user_id) {
      fetchUser();
    }
  }, [user_id]);

  const [favouriteVenues, setFavouriteVenues] = useState<FavouriteVenue[]>([]);
  const [favLoading, setFavLoading] = useState<boolean>(true);

  const loadFavVenues = async () => {
    try {
      const favIds: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("fav_venue_") && localStorage.getItem(key) === "true") {
          const vId = key.replace("fav_venue_", "");
          if (vId) favIds.push(vId);
        }
      }

      if (favIds.length > 0) {
        const promises = favIds.map((vId) =>
          axios.get(`${API_URL}/venue/individual/${vId}`).then(res => res.data?.venue).catch(() => null)
        );
        const results = await Promise.all(promises);
        setFavouriteVenues(results.filter((v): v is FavouriteVenue => v !== null));
      } else {
        setFavouriteVenues([]);
      }
    } catch {
        // The request failure is handled by the surrounding UI state.
      } finally {
      setFavLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    loadFavVenues();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("tab") === "favourites") {
      setTimeout(() => {
        const favElem = document.getElementById("favourites-section");
        if (favElem) {
          favElem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 350);
    }
  }, [location.search]);

  const handleRemoveFav = (venueId: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem(`fav_venue_${venueId}`);
    setFavouriteVenues((prev) => prev.filter((v) => String(v.id) !== String(venueId)));
    Swal.fire({
      icon: "info",
      title: '<span style="color: #1E293B; font-size: 18px; font-weight: 500; font-family: sans-serif;">Removed from Favourites</span>',
      timer: 1500,
      showConfirmButton: false,
      background: "#FFFFFF",
    });
  };


  const [venueBookingData, setVenueBookingData] = useState<DashboardBooking[]>([]);
  const [coachBookingData, setCoachBookingData] = useState<DashboardBooking[]>([]);
  const [trainerBookingData, setTrainerBookingData] = useState<DashboardBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);

  const getDashboardBookingStatus = (booking: ApiBooking) => {
    const refundStatus = String(booking?.refund?.refundStatus || "").toUpperCase();
    if (refundStatus === "SUCCESS" || refundStatus === "COMPLETED") return "Refunded";
    if (refundStatus === "PENDING") return "Refund Pending";
    if (booking?.cancellation_status === 1) return "Cancelled";
    if (booking?.verification_status === 2) return "Rejected";
    if (booking?.verification_status === 1) return "Approved";
    return booking?.paymentState || "Pending";
  };

  const isActiveUpcomingBooking = (booking: DashboardBooking) => {
    const status = String(booking?.status || "").toLowerCase();
    return booking?.cancellation_status !== 1 && !["cancelled", "refunded", "rejected"].includes(status);
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const response = await axios.get<{ data?: { personalTrainer?: ApiBooking[]; venueAdmin?: ApiBooking[]; coach?: ApiBooking[] } }>(
        `${API_URL}/get/venue-coach-pt-booking/${user_id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const booking = response.data;
      
      const ptData = booking?.data?.personalTrainer || [];
      const transformedPt: DashboardBooking[] = ptData.map((booking) => ({
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
        status: getDashboardBookingStatus(booking)
      }));
      setTrainerBookingData(transformedPt);

      const venueData = booking?.data?.venueAdmin || [];
      const transformedVenue: DashboardBooking[] = venueData.map((booking) => ({
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
        status: getDashboardBookingStatus(booking)
      }));
      setVenueBookingData(transformedVenue);

      const coachData = booking?.data?.coach || [];
      const transformedCoach: DashboardBooking[] = coachData.map((booking) => ({
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
        status: getDashboardBookingStatus(booking)
      }));
      setCoachBookingData(transformedCoach);
    } catch {
        // The request failure is handled by the surrounding UI state.
      } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchBookings();
    }
  }, [user_id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const venueUpcoming = venueBookingData.filter(b => isActiveUpcomingBooking(b) && new Date(b.date) >= today);
    const coachUpcoming = coachBookingData.filter(b => isActiveUpcomingBooking(b) && new Date(b.startDate) >= today);
    const trainerUpcoming = trainerBookingData.filter(b => isActiveUpcomingBooking(b) && new Date(b.startDate) >= today);

    // Sort ascending by date
    venueUpcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    coachUpcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    trainerUpcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return {
      venues: venueUpcoming,
      coaches: coachUpcoming,
      trainers: trainerUpcoming,
      count: venueUpcoming.length + coachUpcoming.length + trainerUpcoming.length
    };
  };

  const totalVenuesBooked = venueBookingData.filter(b => b.cancellation_status !== 1).length;
  const totalCoachesBooked = coachBookingData.filter(b => b.cancellation_status !== 1).length;
  const totalLessons = trainerBookingData.filter(b => b.cancellation_status !== 1).length;

  const totalSpent = [...venueBookingData, ...coachBookingData, ...trainerBookingData]
    .filter(b => b.cancellation_status !== 1)
    .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

  const upcomingAppointments = getUpcomingAppointments();

  const renderUpcomingAppointment = () => {
    const firstVenue = upcomingAppointments.venues[0];
    const firstCoach = upcomingAppointments.coaches[0];
    const firstTrainer = upcomingAppointments.trainers[0];

    if (firstVenue) {
      return (
        <ul>
          <li>
            <div className="appointment-item">
              <div className="appointment-img">
                <img
                  src="/assets/img/booking/booking-01.jpg"
                  alt="Appointment"
                  style={{ width: "45px", height: "45px", borderRadius: "8px", objectFit: "cover" }}
                />
              </div>
              <div className="appointment-content">
                <h6>{firstVenue.name || 'Venue Booking'}</h6>
                <p>{firstVenue.vendor_type || 'Sports Venue'}</p>
              </div>
            </div>
          </li>
          <li>
            <h6>Appointment Date</h6>
            <p>{formatDate(firstVenue.date)}</p>
          </li>
          <li>
            <h6>Slots / Time</h6>
            <p>{firstVenue.slots?.join(', ') || 'N/A'}</p>
          </li>
          <li>
            <h6>Amount Paid</h6>
            <p>₹{firstVenue.total_price}</p>
          </li>
          <li>
            <h6>Status</h6>
            <p style={{ color: firstVenue.status === 'Approved' ? '#22C55E' : '#EAB308', fontWeight: 600 }}>{firstVenue.status}</p>
          </li>
        </ul>
      );
    } else if (firstCoach) {
      return (
        <ul>
          <li>
            <div className="appointment-item">
              <div className="appointment-img">
                <img
                  src="/assets/img/featured/featured-05.jpg"
                  alt="Appointment"
                  style={{ width: "45px", height: "45px", borderRadius: "8px", objectFit: "cover" }}
                />
              </div>
              <div className="appointment-content">
                <h6>Coach {firstCoach.first_name} {firstCoach.last_name}</h6>
                <p>{firstCoach.packageType || 'Coaching Session'}</p>
              </div>
            </div>
          </li>
          <li>
            <h6>Start Date</h6>
            <p>{formatDate(firstCoach.startDate)}</p>
          </li>
          <li>
            <h6>Time</h6>
            <p>{firstCoach.startTime} - {firstCoach.endTime}</p>
          </li>
          <li>
            <h6>Amount</h6>
            <p>₹{firstCoach.total_price}</p>
          </li>
          <li>
            <h6>Status</h6>
            <p style={{ color: firstCoach.status === 'Approved' ? '#22C55E' : '#EAB308', fontWeight: 600 }}>{firstCoach.status}</p>
          </li>
        </ul>
      );
    } else if (firstTrainer) {
      return (
        <ul>
          <li>
            <div className="appointment-item">
              <div className="appointment-img">
                <img
                  src="/assets/img/featured/featured-07.jpg"
                  alt="Appointment"
                  style={{ width: "45px", height: "45px", borderRadius: "8px", objectFit: "cover" }}
                />
              </div>
              <div className="appointment-content">
                <h6>Trainer {firstTrainer.first_name} {firstTrainer.last_name}</h6>
                <p>Training</p>
              </div>
            </div>
          </li>
          <li>
            <h6>Start Date</h6>
            <p>{formatDate(firstTrainer.startDate)}</p>
          </li>
          <li>
            <h6>Time</h6>
            <p>{firstTrainer.startTime} - {firstTrainer.endTime}</p>
          </li>
          <li>
            <h6>Amount</h6>
            <p>₹{firstTrainer.total_price}</p>
          </li>
          <li>
            <h6>Status</h6>
            <p style={{ color: firstTrainer.status === 'Approved' ? '#22C55E' : '#EAB308', fontWeight: 600 }}>{firstTrainer.status}</p>
          </li>
        </ul>
      );
    }
    return null;
  };


  const recentBookings = [
    ...venueBookingData.map((booking) => ({
      id: booking.id,
      name: booking.name || "Sports venue",
      type: booking.vendor_type || "Venue",
      date: booking.date,
      amount: booking.total_price,
      status: booking.status,
      icon: "fa-map-marker-alt",
    })),
    ...coachBookingData.map((booking) => ({
      id: booking.id,
      name: `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Coach",
      type: booking.packageType || "Coach",
      date: booking.startDate,
      amount: booking.total_price,
      status: booking.status,
      icon: "fa-user-tie",
    })),
    ...trainerBookingData.map((booking) => ({
      id: booking.id,
      name: `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Trainer",
      type: "Trainer",
      date: booking.startDate,
      amount: booking.total_price,
      status: booking.status,
      icon: "fa-dumbbell",
    })),
  ]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 5);

  const nextBooking = recentBookings
    .filter((booking) => {
      const bookingDate = new Date(booking.date);
      const status = String(booking.status || "").toLowerCase();
      return !Number.isNaN(bookingDate.getTime())
        && bookingDate >= new Date(new Date().setHours(0, 0, 0, 0))
        && !["cancelled", "refunded", "rejected"].includes(status);
    })
    .sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime())[0];

  return (
    <div className="simple-user-dashboard">
      <section className="simple-dashboard-hero">
        <div className="container">
          <div className="simple-dashboard-hero-inner">
            <div>
              <span className="simple-dashboard-eyebrow">MY ACCOUNT</span>
              <h1>Hello, {userData?.first_name || "Player"}</h1>
              <p>Everything you need to manage your Khelo Indore bookings in one place.</p>
            </div>
            <div className="simple-dashboard-actions">
              <Link to={routes.userBookings} className="simple-dashboard-primary-action">
                <i className="fas fa-calendar-alt" /> My bookings
              </Link>
              <Link to={routes.userProfile} className="simple-dashboard-secondary-action">
                <i className="fas fa-user" /> Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="simple-dashboard-content">
        <div className="container">
          <section className="simple-dashboard-stats" aria-label="Booking summary">
            <article className="simple-dashboard-stat-card">
              <span className="simple-dashboard-stat-icon venue"><i className="fas fa-map-marker-alt" /></span>
              <div><strong>{loadingBookings ? "—" : totalVenuesBooked}</strong><span>Venue bookings</span></div>
            </article>
            <article className="simple-dashboard-stat-card">
              <span className="simple-dashboard-stat-icon coach"><i className="fas fa-user-tie" /></span>
              <div><strong>{loadingBookings ? "—" : totalCoachesBooked}</strong><span>Coach sessions</span></div>
            </article>
            <article className="simple-dashboard-stat-card">
              <span className="simple-dashboard-stat-icon trainer"><i className="fas fa-dumbbell" /></span>
              <div><strong>{loadingBookings ? "—" : totalLessons}</strong><span>Trainer sessions</span></div>
            </article>
            <article className="simple-dashboard-stat-card">
              <span className="simple-dashboard-stat-icon spend"><i className="fas fa-wallet" /></span>
              <div><strong>{loadingBookings ? "—" : `₹${totalSpent.toLocaleString("en-IN")}`}</strong><span>Total spent</span></div>
            </article>
          </section>

          <section className="simple-dashboard-grid">
            <article className="simple-dashboard-panel simple-dashboard-recent-panel">
              <div className="simple-dashboard-panel-heading">
                <div><h2>Recent bookings</h2><p>Your latest reservations and sessions.</p></div>
                <Link to={routes.userBookings}>View all <i className="fas fa-arrow-right" /></Link>
              </div>
              {loadingBookings ? (
                <div className="simple-dashboard-empty"><i className="fas fa-spinner fa-spin" /> Loading bookings…</div>
              ) : recentBookings.length ? (
                <div className="simple-dashboard-booking-list">
                  {recentBookings.map((booking, index) => (
                    <div className="simple-dashboard-booking" key={`${booking.id || booking.name}-${index}`}>
                      <span className="simple-dashboard-booking-icon"><i className={`fas ${booking.icon}`} /></span>
                      <div className="simple-dashboard-booking-main"><strong>{booking.name}</strong><span>{booking.type} · {formatDate(booking.date)}</span></div>
                      <div className="simple-dashboard-booking-meta"><strong>₹{Number(booking.amount || 0).toLocaleString("en-IN")}</strong><span className={`simple-booking-status ${String(booking.status).toLowerCase().replace(/\s+/g, "-")}`}>{booking.status || "Pending"}</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="simple-dashboard-empty"><i className="fas fa-calendar-plus" /><p>No bookings yet. Find a venue, coach, or trainer to get started.</p><Link to="/venues">Explore venues</Link></div>
              )}
            </article>

            <aside className="simple-dashboard-side">
              <article className="simple-dashboard-panel simple-dashboard-next-card">
                <span className="simple-dashboard-eyebrow">UP NEXT</span>
                <h2>{nextBooking ? nextBooking.name : "No upcoming booking"}</h2>
                {nextBooking ? <><p>{nextBooking.type}</p><div className="simple-dashboard-next-date"><i className="fas fa-calendar-alt" /> {formatDate(nextBooking.date)}</div></> : <p>Your upcoming sessions will appear here.</p>}
                <Link to={routes.userBookings} className="simple-dashboard-primary-action">View schedule</Link>
              </article>
              <article id="favourites-section" className="simple-dashboard-panel simple-dashboard-favourites-card">
                <div><span className="simple-dashboard-stat-icon favourite"><i className="fas fa-heart" /></span><strong>{favLoading ? "—" : favouriteVenues.length}</strong></div>
                <div><h2>Favourite venues</h2><p>Keep your go-to places within reach.</p><Link to={`${routes.userDashboard}?tab=favourites`}>Manage favourites <i className="fas fa-arrow-right" /></Link></div>
              </article>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );

  return (
    <>
      {/* Hero Section (Matching My Bookings Header) */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "195px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>USER DASHBOARD</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                User <span style={{ color: "#22C55E", marginLeft: "12px" }}>Dashboard</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "20px", fontWeight: "500", maxWidth: "480px" }}>
                Welcome back, {userData?.first_name || 'User'} {userData?.last_name || ''} 👋
              </p>
              
              <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                  <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="fas fa-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                  <span style={{ margin: "0 10px", color: "#64748B" }}><i className="fas fa-chevron-right" style={{ fontSize: "10px", color: "#64748B" }} /></span>
                  <span style={{ color: "#22C55E", fontWeight: "600" }}>User Dashboard</span>
                </div>

                <div className="d-inline-flex align-items-center gap-2 ms-sm-2">
                  <Link to={routes.userDashboard} className="ki-tab-btn active">
                    <i className="fas fa-th-large me-2" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to={routes.userBookings} className="ki-tab-btn">
                    <i className="fas fa-calendar-alt me-2" />
                    <span>My Bookings</span>
                  </Link>
                  <a
                    href="#favourites-section"
                    className="ki-tab-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      const elem = document.getElementById("favourites-section");
                      if (elem) elem.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  >
                    <i className="fas fa-heart text-danger me-2" />
                    <span>My Favourites</span>
                  </a>
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
          <div className="row justify-content-center">
            <div className="col-xl-11 col-lg-12">
              {/* Statistics Card */}
          <div className="row">
            <div className="col-lg-12">
              <div className="my-profile-box">
                <h3 style={{ color: "#0F172A", fontWeight: "700", marginBottom: "20px" }}>My Profile</h3>
                <div className="card profile-user-view">
                  <div className="profile-groups">
                    <div className="profile-detail-box d-flex align-items-center gap-3">
                      <div className="profile-img" style={{ width: "80px", height: "80px", minWidth: "80px", minHeight: "80px", borderRadius: "50%", overflow: "hidden", border: "2px solid #22C55E" }}>
                        {userData?.profile_image?.[0]?.src ? (
                          <img
                            src={`${IMG_URL}${userData.profile_image[0].src}`}
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center bg-success text-white fw-bold h-100 w-100" style={{ fontSize: "28px" }}>
                            {(userData?.first_name || 'U')[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-profile-detail">
                        <h4 className="mb-0" style={{ fontSize: "22px", fontWeight: "700" }}>{userData?.first_name} {userData?.last_name}</h4>
                        <ul>
                          {/* <li>
                            <ImageWithBasePath
                              src="assets/img/icons/profile-icon-01.svg"
                              alt="Icon"
                            />
                            Rank : Expert
                          </li> */}
                        </ul>
                      </div>
                    </div>
                    <div className="convenient-btns">
                      <Link
                        to={routes.userProfile}
                        className="pro-btn-primary d-inline-flex align-items-center"
                        style={{ padding: "0 20px", height: "42px", width: "auto" }}
                      >
                        <i className="fas fa-user-edit me-2" />
                        Edit Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="card profile-user-view mb-4">
                  <div className="profile-info-box">
                    <h4>Contact Information</h4>
                    <div className="profile-contact-info justify-content-start gap-5">
                      <div className="contact-information">
                        <h6>Email Address</h6>
                        <span>{userData?.email}</span>
                      </div>
                      <div className="contact-information">
                        <h6>Phone Number</h6>
                        <span>{userData?.mobile}</span>
                      </div>
                      {/* <div className="contact-information">
                        <h6>Address</h6>
                        <span>1653 Davisson Street,Indianapolis, IN 46225</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card dashboard-card statistics-card">
                <div className="card-header">
                  <h4>Statistics</h4>
                  <p>Boost your game with stats and goals tailored to you</p>
                </div>
                <div className="row">
                  <div className="col-xl-3 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>{loadingBookings ? '...' : totalVenuesBooked}</h3>
                        <p>Total Court Booked</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="/assets/img/icons/statistics-01.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>{loadingBookings ? '...' : totalCoachesBooked}</h3>
                        <p>Total Coaches Booked</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="/assets/img/icons/statistics-02.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>{loadingBookings ? '...' : totalLessons}</h3>
                        <p>Total Lessons</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="/assets/img/icons/statistics-03.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>{loadingBookings ? '...' : `₹${totalSpent.toLocaleString('en-IN')}`}</h3>
                        <p>Payments</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="/assets/img/icons/statistics-04.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Statistics Card           {/* Appointment */}
          <div className="row">
            <div className="col-lg-12">
              <div className="card dashboard-card">
                <div className="card-header">
                  <h4>Upcoming Appointment</h4>
                  <p>Your Personal Schedule</p>
                </div>
                <div className="appointment-info">
                  {loadingBookings ? (
                    <div className="text-center py-4 w-100">
                      <i className="fas fa-spinner fa-spin text-success fa-2x mb-2 d-block" />
                      <span style={{ fontSize: "13px", color: "#64748B" }}>Checking schedule...</span>
                    </div>
                  ) : upcomingAppointments.count > 0 ? (
                    renderUpcomingAppointment()
                  )
                  : (
                    <div className="text-center py-4 w-100">
                      <p className="text-muted mb-0" style={{ fontSize: "14px", fontWeight: "400" }}>No upcoming appointments scheduled.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* /Appointment */}
          {/* Dashboard Table */}
          <div className="row">
            <div className="col-xl-7 col-lg-12 d-flex">
              <div className="card dashboard-card flex-fill">
                <div className="card-header card-header-info">
                  <div className="card-header-inner">
                    <h4>My Bookings</h4>
                    <p>Court Reservations Made Easy</p>
                  </div>
                  <div className="card-header-btns">
                    <nav>
                      <div className="nav nav-tabs" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-Court-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Court"
                          type="button"
                          role="tab"
                          aria-controls="nav-Court"
                          aria-selected="true"
                        >
                          Sports Venue
                        </button>
                        <button
                          className="nav-link"
                          id="nav-Coaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Coaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-Coaching"
                          aria-selected="false"
                        >
                          Coach
                        </button>
                        <button
                          className="nav-link"
                          id="nav-Coaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Coaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-Coaching"
                          aria-selected="false"
                        >
                          Trainer
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Court"
                    role="tabpanel"
                    aria-labelledby="nav-Court-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          {loadingBookings ? (
                            <tr>
                              <td colSpan={4} className="text-center py-4">
                                <i className="fas fa-spinner fa-spin text-success me-2" /> Loading venue bookings...
                              </td>
                            </tr>
                          ) : venueBookingData.length > 0 ? (
                            venueBookingData.slice(0, 5).map((b, idx) => (
                              <tr key={b.id || idx}>
                                <td>
                                  <div className="academy-info">
                                    <Link to={routes.userBookings} className="academy-img">
                                      <img
                                        src="/assets/img/booking/booking-02.jpg"
                                        alt="Booking"
                                        style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover" }}
                                      />
                                    </Link>
                                    <div className="academy-content">
                                      <h6>
                                        <Link to={routes.userBookings}>
                                          {b.name || 'Venue Reservation'}
                                        </Link>
                                      </h6>
                                      <span>{b.vendor_type || 'Sports Venue'}</span>
                                      <ul>
                                        <li>Slots: {b.slots?.length || 0}</li>
                                      </ul>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <h6>Date &amp; Time</h6>
                                  <p>{formatDate(b.date)}</p>
                                  <p style={{ fontSize: "12px", color: "#64748B" }}>{b.slots?.join(', ')}</p>
                                </td>
                                <td>
                                  <h4>₹{b.total_price}</h4>
                                </td>
                                <td>
                                  <span style={{ fontSize: "12px", fontWeight: 600, color: b.status === 'Approved' ? '#22C55E' : b.status === 'Cancelled' ? '#EF4444' : '#EAB308' }}>
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-muted">No venue bookings found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-Coaching"
                    role="tabpanel"
                    aria-labelledby="nav-Coaching-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          {loadingBookings ? (
                            <tr>
                              <td colSpan={4} className="text-center py-4">
                                <i className="fas fa-spinner fa-spin text-success me-2" /> Loading bookings...
                              </td>
                            </tr>
                          ) : [...coachBookingData, ...trainerBookingData].length > 0 ? (
                            [...coachBookingData, ...trainerBookingData].slice(0, 6).map((b, idx) => {
                              const isPT = !b.packageType;
                              const name = isPT 
                                ? `Trainer ${b.first_name} ${b.last_name}` 
                                : `Coach ${b.first_name} ${b.last_name}`;
                              const typeText = isPT ? "Trainer" : (b.packageType || "Coaching Lesson");
                              const img = isPT ? "/assets/img/featured/featured-07.jpg" : "/assets/img/featured/featured-05.jpg";
                              return (
                                <tr key={b.id || idx}>
                                  <td>
                                    <div className="academy-info">
                                      <Link to={routes.userBookings} className="academy-img">
                                        <img
                                          src={img}
                                          alt="Booking"
                                          style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover" }}
                                        />
                                      </Link>
                                      <div className="academy-content">
                                        <h6 className="mb-1">
                                          <Link to={routes.userBookings}>
                                            {name}
                                          </Link>
                                        </h6>
                                        <span className="mb-0">{typeText}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <h6>Date &amp; Time</h6>
                                    <p>{formatDate(b.startDate)} {b.endDate ? `to ${formatDate(b.endDate)}` : ''}</p>
                                    <p style={{ fontSize: "12px", color: "#64748B" }}>{b.startTime} - {b.endTime}</p>
                                  </td>
                                  <td>
                                    <h4>₹{b.total_price}</h4>
                                  </td>
                                  <td>
                                    <span style={{ fontSize: "12px", fontWeight: 600, color: b.status === 'Approved' ? '#22C55E' : b.status === 'Cancelled' ? '#EF4444' : '#EAB308' }}>
                                      {b.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-muted">No coaching bookings found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-12 d-flex flex-column">
              <div className="card payment-card ">
                <div className="payment-info ">
                  <div className="payment-content">
                    <p>Your Wallet Balance</p>
                    <h2>₹0</h2>
                  </div>
                  <div className="payment-btn">
                    <Link
                      to="#"
                      className="btn"
                      data-bs-toggle="modal"
                      data-bs-target="#add-payment"
                    >
                      Add Payment
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card dashboard-card upcoming-card">
                <div className="card-header card-header-info">
                  <div className="card-header-inner">
                    <h4>Upcoming Appointment</h4>
                    <p>Manage all your upcoming court bookings.</p>
                  </div>
                  <div className="card-header-btns">
                    <nav>
                      <div className="nav nav-tabs" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-Appointment-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Appointment"
                          type="button"
                          role="tab"
                          aria-controls="nav-Appointment"
                          aria-selected="true"
                        >
                          Court
                        </button>
                        <button
                          className="nav-link"
                          id="nav-AppointmentCoaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-AppointmentCoaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-AppointmentCoaching"
                          aria-selected="false"
                        >
                          Coaching
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Appointment"
                    role="tabpanel"
                    aria-labelledby="nav-Appointment-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          {loadingBookings ? (
                            <tr>
                              <td colSpan={2} className="text-center py-4">
                                <i className="fas fa-spinner fa-spin text-success me-2" /> Loading upcoming courts...
                              </td>
                            </tr>
                          ) : upcomingAppointments.venues.length > 0 ? (
                            upcomingAppointments.venues.slice(0, 5).map((b, idx) => (
                              <tr key={b.id || idx}>
                                <td>
                                  <div className="academy-info academy-info">
                                    <Link to={routes.userBookings} className="academy-img">
                                      <img
                                        src="/assets/img/booking/booking-02.jpg"
                                        alt="Booking"
                                        style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover" }}
                                      />
                                    </Link>
                                    <div className="academy-content">
                                      <h6>
                                        <Link to={routes.userBookings}>
                                          {b.name || 'Venue'}
                                        </Link>
                                      </h6>
                                      <ul>
                                        <li>{b.vendor_type || 'Court'}</li>
                                        <li>
                                          <i className="feather-clock" /> {formatDate(b.date)} | {b.slots?.join(', ')}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span style={{ fontSize: "11px", fontWeight: 600, color: b.status === 'Approved' ? '#22C55E' : b.status === 'Cancelled' ? '#EF4444' : '#EAB308', backgroundColor: b.status === 'Approved' ? '#DCFCE7' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF9C3', padding: "4px 8px", borderRadius: "4px" }}>
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-center py-4 text-muted">No upcoming court bookings.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-AppointmentCoaching"
                    role="tabpanel"
                    aria-labelledby="nav-AppointmentCoaching-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          {loadingBookings ? (
                            <tr>
                              <td colSpan={2} className="text-center py-4">
                                <i className="fas fa-spinner fa-spin text-success me-2" /> Loading upcoming coaching...
                              </td>
                            </tr>
                          ) : [...upcomingAppointments.coaches, ...upcomingAppointments.trainers].length > 0 ? (
                            [...upcomingAppointments.coaches, ...upcomingAppointments.trainers].slice(0, 5).map((b, idx) => {
                              const isPT = !b.packageType;
                              const name = isPT 
                                ? `Trainer ${b.first_name} ${b.last_name}` 
                                : `Coach ${b.first_name} ${b.last_name}`;
                              const typeText = isPT ? "Trainer" : (b.packageType || "Coaching Lesson");
                              const img = isPT ? "/assets/img/featured/featured-07.jpg" : "/assets/img/featured/featured-05.jpg";
                              return (
                                <tr key={b.id || idx}>
                                  <td>
                                    <div className="academy-info academy-info">
                                      <Link to={routes.userBookings} className="academy-img">
                                        <img
                                          src={img}
                                          alt="Booking"
                                          style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover" }}
                                        />
                                      </Link>
                                      <div className="academy-content">
                                        <h6>
                                          <Link to={routes.userBookings}>
                                            {name}
                                          </Link>
                                        </h6>
                                        <ul>
                                          <li>{typeText}</li>
                                          <li>
                                            <i className="feather-clock" /> {formatDate(b.startDate)} | {b.startTime} - {b.endTime}
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span style={{ fontSize: "11px", fontWeight: 600, color: b.status === 'Approved' ? '#22C55E' : b.status === 'Cancelled' ? '#EF4444' : '#EAB308', backgroundColor: b.status === 'Approved' ? '#DCFCE7' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF9C3', padding: "4px 8px", borderRadius: "4px" }}>
                                      {b.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-center py-4 text-muted">No upcoming coaching appointments.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card dashboard-card academy-card" id="favourites-section">
                <div className="card-header card-header-info">
                  <div className="card-header-inner">
                    <h4>My Favourites</h4>
                    <p>My favourite court lists </p>
                  </div>
                  <div className="card-header-btns">
                    <nav>
                      <div className="nav nav-tabs" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-Favourites-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Favourites"
                          type="button"
                          role="tab"
                          aria-controls="nav-Favourites"
                          aria-selected="true"
                        >
                          Court
                        </button>
                        <button
                          className="nav-link"
                          id="nav-FavouritesCoaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-FavouritesCoaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-FavouritesCoaching"
                          aria-selected="false"
                        >
                          Coaching
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Favourites"
                    role="tabpanel"
                    aria-labelledby="nav-Favourites-tab"
                    tabIndex={0}
                  >
                    <div className="p-3">
                      {favLoading ? (
                        <div className="text-center py-4">
                          <i className="fas fa-spinner fa-spin text-success fa-2x mb-2 d-block" />
                          <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "400" }}>Loading your saved venues...</span>
                        </div>
                      ) : favouriteVenues.length > 0 ? (
                        <div className="d-flex flex-column gap-2" style={{ maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
                          {favouriteVenues.map((v, index: number) => {
                            const venueId = v._id || v.id;
                            const imgPath = v.images && v.images[0]?.src
                              ? `${IMG_URL}${v.images[0].src}`
                              : "/assets/img/venues/venue-01.jpg";
                            return (
                              <div 
                                key={String(venueId || index)} 
                                className="d-flex align-items-center justify-content-between p-2 rounded border" 
                                style={{ borderColor: "#F1F5F9", backgroundColor: "#F8FAFC" }}
                              >
                                <div className="d-flex align-items-center gap-2 overflow-hidden">
                                  <Link to={`/coaches/venue-details/${venueId}`} className="academy-img" style={{ width: "42px", height: "42px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, display: "block" }}>
                                    <img
                                      src={imgPath}
                                      alt={String(v.name || 'Venue')}
                                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                        (e.target as HTMLImageElement).src = "/assets/img/venues/venue-01.jpg";
                                      }}
                                    />
                                  </Link>
                                  <div className="overflow-hidden">
                                    <h6 className="mb-0 text-truncate" style={{ fontSize: "12px", fontWeight: 500, color: "#1E293B" }}>
                                      <Link to={`/coaches/venue-details/${venueId}`} className="text-decoration-none" style={{ color: "#1E293B", fontWeight: 500 }}>
                                        {v.name}
                                      </Link>
                                    </h6>
                                    <p className="mb-0 text-muted text-truncate" style={{ fontSize: "10px", fontWeight: 400 }}>
                                      <i className="feather-map-pin me-1" style={{ fontSize: "10px", color: "#EF4444" }} />
                                      {v.address ? `${v.address.substring(0, 24)}${v.address.length > 24 ? '...' : ''}` : "Indore"}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="d-flex align-items-center gap-1 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => handleRemoveFav(venueId, e)}
                                    title="Remove from Favourites"
                                    className="d-flex align-items-center justify-content-center shadow-sm"
                                    style={{ width: "28px", height: "28px", borderRadius: "50%", padding: 0, border: "1px solid #FECACA", backgroundColor: "#FFFFFF", cursor: "pointer" }}
                                  >
                                    <i className="feather-trash" style={{ fontSize: "11px", color: "#EF4444" }} />
                                  </button>
                                  <Link 
                                    to={`/coaches/venue-details/${venueId}`} 
                                    className="btn btn-sm btn-success text-white rounded-pill px-2.5 py-1" 
                                    style={{ backgroundColor: "#22C55E", border: "none", fontSize: "10px", fontWeight: 500, padding: "4px 10px" }}
                                  >
                                    Book
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="fas fa-heart-broken text-muted fa-2x mb-2 d-block" />
                          <h6 style={{ fontSize: "13px", fontWeight: 500, color: "#1E293B" }}>No favourite venues saved yet</h6>
                          <p className="text-muted mb-2" style={{ fontSize: "11px", fontWeight: 400 }}>
                            Click the heart icon on any venue page to save it.
                          </p>
                          <Link to={routes.blogListSidebarLeft} className="btn btn-success text-white rounded-pill px-3 py-1" style={{ backgroundColor: "#22C55E", border: "none", fontSize: "11px", fontWeight: 500 }}>
                            Explore Sports Venues
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-FavouritesCoaching"
                    role="tabpanel"
                    aria-labelledby="nav-FavouritesCoaching-tab"
                    tabIndex={0}
                  >
                    <div className="p-3">
                      <div className="d-flex flex-column gap-2" style={{ maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
                        {[
                          { name: "Kevin Anderson", bookings: "10 Bookings", img: "/assets/img/featured/featured-05.jpg" },
                          { name: "Angela Roudrigez", bookings: "20 Bookings", img: "/assets/img/featured/featured-06.jpg" },
                          { name: "Evon Raddick", bookings: "30 Bookings", img: "/assets/img/featured/featured-07.jpg" }
                        ].map((coach, index) => (
                          <div 
                            key={index} 
                            className="d-flex align-items-center justify-content-between p-2 rounded border" 
                            style={{ borderColor: "#F1F5F9", backgroundColor: "#F8FAFC" }}
                          >
                            <div className="d-flex align-items-center gap-2 overflow-hidden">
                              <Link to={routes.userBookings} className="academy-img" style={{ width: "42px", height: "42px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, display: "block" }}>
                                <ImageWithBasePath
                                  src={coach.img}
                                  alt={coach.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </Link>
                              <div className="overflow-hidden">
                                <h6 className="mb-0 text-truncate" style={{ fontSize: "12px", fontWeight: 500, color: "#1E293B" }}>
                                  <Link to={routes.userBookings} className="text-decoration-none" style={{ color: "#1E293B", fontWeight: 500 }}>
                                    {coach.name}
                                  </Link>
                                </h6>
                                <p className="mb-0 text-muted text-truncate" style={{ fontSize: "10px", fontWeight: 400 }}>
                                  👤 {coach.bookings}
                                </p>
                              </div>
                            </div>
                            
                            <div className="d-flex align-items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                title="Remove from Favourites"
                                className="d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: "28px", height: "28px", borderRadius: "50%", padding: 0, border: "1px solid #FECACA", backgroundColor: "#FFFFFF", cursor: "pointer" }}
                              >
                                <i className="feather-trash" style={{ fontSize: "11px", color: "#EF4444" }} />
                              </button>
                              <Link 
                                to={routes.userBookings} 
                                className="btn btn-sm btn-success text-white rounded-pill px-2.5 py-1" 
                                style={{ backgroundColor: "#22C55E", border: "none", fontSize: "10px", fontWeight: 500, padding: "4px 10px" }}
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card dashboard-card mb-0">
                <div className="card-header card-header-info border-0">
                  <div className="card-header-inner">
                    <h4>Recent Invoices</h4>
                    <p>Access recent invoices related to court bookings </p>
                  </div>
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
                          Court
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
                          Coaching
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Recent"
                    role="tabpanel"
                    aria-labelledby="nav-Recent-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive table-datatble">
                      <table className="table table-borderless dashboard-card-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Court Name</th>
                            <th>Date &amp; Time</th>
                            <th>Payment</th>
                            <th>Paid On</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingBookings ? (
                            <tr>
                              <td colSpan={6} className="text-center py-4">
                                <i className="fas fa-spinner fa-spin text-success me-2" /> Loading venue invoices...
                              </td>
                            </tr>
                          ) : venueBookingData.length > 0 ? (
                            venueBookingData.slice(0, 5).map((b, idx) => (
                              <tr key={b.id || idx}>
                                <td>
                                  <h2 className="table-avatar">
                                    <Link
                                      to={routes.userBookings}
                                      className="avatar avatar-sm flex-shrink-0"
                                    >
                                      <img
                                        className="avatar-img"
                                        src="/assets/img/booking/booking-02.jpg"
                                        alt="Booking"
                                        style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
                                      />
                                    </Link>
                                    <span className="table-head-name flex-grow-1 ms-2">
                                      <Link to={routes.userBookings}>
                                        {b.name || 'Venue Reservation'}
                                      </Link>
                                      <span style={{ fontSize: "11px", color: "#64748B" }}>{b.vendor_type || 'Court'}</span>
                                    </span>
                                  </h2>
                                </td>
                                <td>
                                  <p>{formatDate(b.date)}</p>
                                  <p style={{ fontSize: "11px", color: "#64748B" }}>{b.slots?.join(', ')}</p>
                                </td>
                                <td>
                                  <h6>₹{b.total_price}</h6>
                                </td>
                                <td>{formatDate(b.createdAt || b.date)}</td>
                                <td className="paid-edit">
                                  <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, backgroundColor: b.status === 'Approved' || b.paymentState === 'Paid' ? '#DCFCE7' : '#FEE2E2', color: b.status === 'Approved' || b.paymentState === 'Paid' ? '#166534' : '#991B1B' }}>
                                    <i className="feather-check-circle me-1" /> {b.paymentState || b.status}
                                  </span>
                                </td>
                                <td>
                                  {b.pdfUrl ? (
                                    <a
                                      href={`${IMG_URL}${b.pdfUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                                      style={{ padding: "4px 8px", fontSize: "11px" }}
                                    >
                                      <i className="feather-download" /> PDF
                                    </a>
                                  ) : (
                                    <span style={{ fontSize: "11px", color: "#64748B" }}>No Invoice</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-4 text-muted">No venue invoices found.</td>
                            </tr>
                          )}
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
                      <table className="table table-borderless dashboard-card-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Date &amp; Time</th>
                            <th>Payment</th>
                            <th>Paid On</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingBookings ? (
                            <tr>
                              <td colSpan={7} className="text-center py-4">
                                <i className="fas fa-spinner fa-spin text-success me-2" /> Loading coaching invoices...
                              </td>
                            </tr>
                          ) : [...coachBookingData, ...trainerBookingData].length > 0 ? (
                            [...coachBookingData, ...trainerBookingData].slice(0, 5).map((b, idx) => {
                              const isPT = !b.packageType;
                              const name = isPT 
                                ? `Trainer ${b.first_name} ${b.last_name}` 
                                : `Coach ${b.first_name} ${b.last_name}`;
                              const typeText = isPT ? "Trainer" : (b.packageType || "Coaching Lesson");
                              const img = isPT ? "/assets/img/featured/featured-07.jpg" : "/assets/img/featured/featured-05.jpg";
                              return (
                                <tr key={b.id || idx}>
                                  <td>
                                    <h2 className="table-avatar">
                                      <Link
                                        to={routes.userBookings}
                                        className="avatar avatar-sm flex-shrink-0"
                                      >
                                        <img
                                          className="avatar-img"
                                          src={img}
                                          alt="Booking"
                                          style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
                                        />
                                      </Link>
                                      <span className="table-head-name flex-grow-1 ms-2">
                                        <Link to={routes.userBookings}>
                                          {name}
                                        </Link>
                                        <span style={{ fontSize: "11px", color: "#64748B" }}>Booked: {formatDate(b.createdAt)}</span>
                                      </span>
                                    </h2>
                                  </td>
                                  <td>{typeText}</td>
                                  <td>
                                    <p>{formatDate(b.startDate)} {b.endDate ? `to ${formatDate(b.endDate)}` : ''}</p>
                                    <p style={{ fontSize: "11px", color: "#64748B" }}>{b.startTime} - {b.endTime}</p>
                                  </td>
                                  <td>
                                    <h6>₹{b.total_price}</h6>
                                  </td>
                                  <td>{formatDate(b.createdAt || b.startDate)}</td>
                                  <td className="paid-edit">
                                    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, backgroundColor: b.status === 'Approved' || b.paymentState === 'Paid' ? '#DCFCE7' : '#FEE2E2', color: b.status === 'Approved' || b.paymentState === 'Paid' ? '#166534' : '#991B1B' }}>
                                      <i className="feather-check-circle me-1" /> {b.paymentState || b.status}
                                    </span>
                                  </td>
                                  <td>
                                    {b.pdfUrl ? (
                                      <a
                                        href={`${IMG_URL}${b.pdfUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                                        style={{ padding: "4px 8px", fontSize: "11px" }}
                                      >
                                        <i className="feather-download" /> PDF
                                      </a>
                                    ) : (
                                      <span style={{ fontSize: "11px", color: "#64748B" }}>No Invoice</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-4 text-muted">No coaching invoices found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Dashboard Table */}
        </div>
      </div>
      {/* /Page Content */}
      {/* upcoming Modal */}
      <div
        className="modal custom-modal fade request-modal"
        id="upcoming-coach"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-header modal-header-title">
                <h4 className="mb-0">
                  Coach Booking Details
                  <span className="badge bg-info ms-2">Upcoming</span>
                </h4>
              </div>
              <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
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
              <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
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
                                alt="Appointment"
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
      {/* Request Modal */}
      <div
        className="modal custom-modal fade payment-modal"
        id="add-payment"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-header modal-header-title">
                <h4 className="mb-0">Add Payment to Wallet</h4>
              </div>
              <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              <div className="wallet-wrap wallet-modal">
                <div className="wallet-amt">
                  <h5>Your Wallet Balance</h5>
                  <h2>₹4,544</h2>
                </div>
              </div>
              <form>
                <div className="input-space">
                  <label className="form-label">Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Amount"
                  />
                </div>
                <div className="or-div">
                  <h6>OR</h6>
                </div>
                <div className="add-wallet-amount form-check">
                  <ul>
                    <li className="active">
                      <div className="add-wallet-checkbox">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="value"
                          defaultChecked
                        />
                        <label htmlFor="value">Add Value 1</label>
                      </div>
                      <div className="add-wallet-price">
                        <span>+ ₹80</span>
                      </div>
                    </li>
                    <li>
                      <div className="add-wallet-checkbox">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="value1"
                        />
                        <label htmlFor="value1">Add Value 2</label>
                      </div>
                      <div className="add-wallet-price">
                        <span>+ ₹60</span>
                      </div>
                    </li>
                    <li>
                      <div className="add-wallet-checkbox">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="value2"
                        />
                        <label htmlFor="value2">Add Value 3</label>
                      </div>
                      <div className="add-wallet-price">
                        <span>+ ₹120</span>
                      </div>
                    </li>
                    <li>
                      <div className="add-wallet-checkbox">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="value3"
                        />
                        <label htmlFor="value3">Add Value 4</label>
                      </div>
                      <div className="add-wallet-price">
                        <span>+ ₹120</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="radio-setview">
                  <h6>Select Payment Gateway</h6>
                  <div className="radio">
                    <div className="form-check form-check-inline mb-3">
                      <input
                        className="form-check-input default-check me-1"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio3"
                        defaultValue="Credit Card"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio3"
                      >
                        Credit Card
                      </label>
                    </div>
                    <div className="form-check form-check-inline mb-0">
                      <input
                        className="form-check-input default-check me-1"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio4"
                        defaultValue="Paypal"
                        defaultChecked
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio4"
                      >
                        Paypal
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="table-accept-btn">
                <Link
                  to="#"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Reset
                </Link>
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Submit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Request Modal */}

      <div>
        {/* upcoming Modal */}
        <div className="modal custom-modal fade request-modal" id="upcoming-coach" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">Coach Booking Details<span className="badge bg-info ms-2">Upcoming</span></h4>
                </div>
                <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                  <span className="align-center" aria-hidden="true"><i className="feather-x" /></span>
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
                                <img src="/assets/img/featured/featured-06.jpg" alt="Venue" />
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
                            <p>Mon, Jul 14
                              <span>05:00 PM - 08:00 PM</span></p>
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
                  </div>
                </div>
                {/* /Court Request */}
              </div>
              <div className="modal-footer">
                <div className="table-accept-btn">
                  <Link to="#" data-bs-dismiss="modal" className="btn cancel-table-btn">Cancel</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /upcoming Modal */}
        {/* upcoming Modal */}
        <div className="modal custom-modal fade request-modal" id="upcoming-court" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">Court Booking Details<span className="badge bg-info ms-2">Upcoming</span></h4>
                </div>
                <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                  <span className="align-center" aria-hidden="true"><i className="feather-x" /></span>
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
                                <img src="/assets/img/booking/booking-03.jpg" alt="Appointment" />
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
                  <Link to="#" data-bs-dismiss="modal" className="btn cancel-table-btn">Cancel</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /upcoming Modal */}
        {/* Request Modal */}
        <div className="modal custom-modal fade payment-modal" id="add-payment" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">Add Payment to Wallet</h4>
                </div>
                <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                  <span className="align-center" aria-hidden="true"><i className="feather-x" /></span>
                </Link>
              </div>
              <div className="modal-body">
                <div className="wallet-wrap wallet-modal">
                  <div className="wallet-amt">
                    <h5>Your Wallet Balance</h5>
                    <h2>₹4,544</h2>
                  </div>
                </div>
                <form>
                  <div className="input-space">
                    <label className="form-label">Amount</label>
                    <input type="text" className="form-control" placeholder="Enter Amount" />
                  </div>
                  <div className="or-div">
                    <h6>OR</h6>
                  </div>
                  <div className="add-wallet-amount form-check">
                    <ul>
                      <li className="active">
                        <div className="add-wallet-checkbox">
                          <input type="checkbox" className="form-check-input" id="value" defaultChecked />
                          <label htmlFor="value">Add Value 1</label>
                        </div>
                        <div className="add-wallet-price">
                          <span>+ ₹80</span>
                        </div>
                      </li>
                      <li>
                        <div className="add-wallet-checkbox">
                          <input type="checkbox" className="form-check-input" id="value1" />
                          <label htmlFor="value1">Add Value 2</label>
                        </div>
                        <div className="add-wallet-price">
                          <span>+ ₹60</span>
                        </div>
                      </li>
                      <li>
                        <div className="add-wallet-checkbox">
                          <input type="checkbox" className="form-check-input" id="value2" />
                          <label htmlFor="value2">Add Value 3</label>
                        </div>
                        <div className="add-wallet-price">
                          <span>+ ₹120</span>
                        </div>
                      </li>
                      <li>
                        <div className="add-wallet-checkbox">
                          <input type="checkbox" className="form-check-input" id="value3" />
                          <label htmlFor="value3">Add Value 4</label>
                        </div>
                        <div className="add-wallet-price">
                          <span>+ ₹120</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="radio-setview">
                    <h6>Select Payment Gateway</h6>
                    <div className="radio">
                      <div className="form-check form-check-inline mb-3">
                        <input className="form-check-input default-check me-1" type="radio" name="inlineRadioOptions" id="inlineRadio3" defaultValue="Credit Card" />
                        <label className="form-check-label" htmlFor="inlineRadio3">Credit Card</label>
                      </div>
                      <div className="form-check form-check-inline mb-0">
                        <input className="form-check-input default-check me-1" type="radio" name="inlineRadioOptions" id="inlineRadio4" defaultValue="Paypal" defaultChecked />
                        <label className="form-check-label" htmlFor="inlineRadio4">Paypal</label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="table-accept-btn">
                  <Link to="#" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Reset</Link>
                  <Link to="#" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Submit</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </>
  );
};

export default UserDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";

interface EventData {
  event_name: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  terms_and_conditions: string;
  price?: number;
  organized_by?: string;
  category?: string;
  images?: { src?: string; alt?: string }[];
}

const imageUrl = (src?: string) =>
  src && /^https?:\/\//i.test(src) ? src : src ? `${IMG_URL}${src}` : "/assets/img/no-img.png";

const EventDetails = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<EventData>();
  const [shareCopied, setShareCopied] = useState(false);
  const [tickets, setTickets] = useState(1);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${API_URL}/event/get/${id}`)
      .then(({ data }) => setEventData(data.data))
      .catch(() => setEventData(undefined));
  }, [id]);

  if (!eventData) return <main className="pt-5 mt-5 text-center">Loading event…</main>;

  const start = new Date(eventData.start_date);
  const end = new Date(eventData.end_date);
  const eventDate = start.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 3600000));

  const shareEvent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: eventData.event_name, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1800);
    } catch {
      // Sharing can be dismissed by the user or blocked by the browser.
    }
  };

  const handleBookNow = () => {
    const targetUrl = `/events/event-confirm/${id}`;
    const bookingState = {
      eventData,
      tickets,
      totalPrice: (eventData.price || 0) * tickets,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          targetUrl,
          eventId: id,
          state: bookingState,
          type: "event",
          timestamp: Date.now(),
        })
      );

      Swal.fire({
        title: "Login to continue",
        text: "Please log in to review and confirm your event registration.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login / Register",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#22C55E",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", {
            state: {
              URL: targetUrl,
              bookingState,
              returnTo: targetUrl,
            },
          });
        }
      });
      return;
    }

    navigate(targetUrl, { state: bookingState });
  };

  return (
    <main className="ki-event-detail" style={{ background: "#f7faf8", minHeight: "100vh" }}>
      <style>{`
        .ki-event-detail { color: #17222d; }
        .ki-event-detail .hero-booking-section { min-height: 292px; background: linear-gradient(120deg, #f8fffa 0%, #e9f8ee 58%, #dff4e7 100%) !important; }
        .ki-event-detail .hero-artwork-blend { opacity: .28; }
        .ki-event-detail .event-detail-title { color: #102219 !important; font-size: clamp(32px, 4vw, 48px); letter-spacing: -1.3px; }
        .ki-event-detail .event-info-card, .ki-event-detail .event-content-card { border-color: #dce9df !important; box-shadow: 0 15px 36px rgba(20, 64, 36, .08) !important; }
        .ki-event-detail .event-content-card h2 { color: #17222d !important; font-weight: 800; }
        .ki-event-detail .event-content-card p { color: #52665a !important; }
        .ki-event-detail .event-category { background: #eaf9ee !important; color: #15803d !important; border: 1px solid #b8ecc7; }
        .ki-event-detail .event-image { min-height: 300px; max-height: 520px; object-fit: cover; }
        .ki-event-detail .event-book-button { min-height: 54px; background: linear-gradient(135deg, #20bf55, #159447) !important; border: 1px solid #159447 !important; color: #fff !important; box-shadow: 0 8px 18px rgba(32,191,85,.22); font-weight: 750; border-radius: 12px; }
        .ki-event-detail .event-share-button { min-height: 42px; color: #15803d !important; background: #fff !important; border-color: #b9e7c8 !important; border-radius: 11px !important; font-weight: 700; }
        .ki-event-detail .event-facts { display: grid; gap: 12px; }
        .ki-event-detail .event-fact { display: grid; grid-template-columns: 32px 1fr; align-items: start; padding: 12px; background: #f8fcf9; border-radius: 12px; }
        .ki-event-detail .event-fact i { color: #159447; font-size: 18px; padding-top: 2px; }
        @media (max-width: 991px) { .ki-event-detail .event-info-card { position: static !important; } }
        @media (max-width: 575px) { .ki-event-detail .hero-booking-section { min-height: 0; padding-top: 88px !important; padding-bottom: 32px !important; } .ki-event-detail .event-image { min-height: 210px; } }
      `}</style>

      <section className="hero-booking-section position-relative overflow-hidden" style={{ paddingTop: "110px", paddingBottom: "46px" }}>
        <div className="hero-artwork-blend position-absolute" style={{ right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)" }} />
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <span className="d-block mb-2" style={{ color: "#159447", fontSize: 13, fontWeight: 800, letterSpacing: "1.5px" }}>SPORTS EVENT</span>
          <h1 className="event-detail-title fw-bold mb-3">{eventData.event_name}</h1>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: 13, border: "1px solid #dce9df" }}>
              <Link to="/" className="text-decoration-none text-secondary"><i className="feather-home me-1" />Home</Link>
              <i className="feather-chevron-right mx-2" style={{ fontSize: 12 }} />
              <Link to="/events" className="text-decoration-none text-secondary">Events</Link>
              <i className="feather-chevron-right mx-2" style={{ fontSize: 12 }} />
              <span className="text-success fw-semibold">Details</span>
            </div>
            <button type="button" onClick={shareEvent} className="event-share-button btn d-inline-flex align-items-center gap-2 px-3">
              <i className={shareCopied ? "feather-check" : "feather-share-2"} />{shareCopied ? "Link copied" : "Share event"}
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="row g-4 align-items-start" style={{ marginTop: "-26px", position: "relative", zIndex: 2, paddingBottom: 64 }}>
          <section className="col-lg-8">
            <div className="bg-dark rounded-4 overflow-hidden shadow-sm">
              <img src={imageUrl(eventData.images?.[0]?.src)} alt={eventData.images?.[0]?.alt || eventData.event_name} className="event-image w-100" />
            </div>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
              <span className="event-category badge px-3 py-2">{eventData.category || "Sports"}</span>
              <span className="text-muted small"><i className="feather-users text-success me-2" />Open for registrations</span>
            </div>
            <article className="event-content-card bg-white border rounded-4 p-4 p-md-5 mt-4">
              <h2 className="h3 mb-3">About the Event</h2>
              <p className="mb-4" style={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>{eventData.description || "Event details will be shared by the organiser shortly."}</p>
              <div className="pt-4" style={{ borderTop: "1px dashed #dce7df" }}>
                <h2 className="h5 mb-2">Terms & Conditions</h2>
                <p className="mb-0">{eventData.terms_and_conditions || "Please contact the organiser for event terms and conditions."}</p>
              </div>
            </article>
          </section>

          <aside className="col-lg-4">
            <div className="event-info-card bg-white border rounded-4 p-4" style={{ position: "sticky", top: 110 }}>
              <h2 className="h4 fw-bold mb-4">Event information</h2>
              <div className="event-facts">
                <div className="event-fact"><i className="feather-calendar" /><div><strong className="d-block">Date</strong><span>{eventDate}</span></div></div>
                <div className="event-fact"><i className="feather-clock" /><div><strong className="d-block">Starts at</strong><span>{start.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span></div></div>
                <div className="event-fact"><i className="feather-hourglass" /><div><strong className="d-block">Duration</strong><span>{duration} hours</span></div></div>
                <div className="event-fact"><i className="feather-map-pin" /><div><strong className="d-block">Location</strong><span>{eventData.location || "Location to be announced"}</span></div></div>
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: "1px dashed #dce7df" }}>
                {/* Ticket quantity selector */}
                <div className="d-flex align-items-center justify-content-between mb-3 p-3 bg-light rounded-3" style={{ border: "1px solid #E2E8F0" }}>
                  <div>
                    <span className="d-block text-muted small fw-bold">Select Tickets</span>
                    <span className="small text-success fw-semibold">
                      {(eventData.price || 0) > 0 ? `₹${eventData.price} per ticket` : "Free Registration"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32, padding: 0 }}
                      disabled={tickets <= 1}
                      onClick={() => setTickets((prev) => Math.max(1, prev - 1))}
                    >
                      <i className="feather-minus" style={{ fontSize: 12 }} />
                    </button>
                    <span className="fw-bold px-2 fs-6">{tickets}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32, padding: 0 }}
                      disabled={tickets >= 10}
                      onClick={() => setTickets((prev) => Math.min(10, prev + 1))}
                    >
                      <i className="feather-plus" style={{ fontSize: 12 }} />
                    </button>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <span className="d-block text-muted small">Total Payable</span>
                    <strong className="d-block fs-3" style={{ color: "#159447" }}>
                      {(eventData.price || 0) > 0 ? `₹${(eventData.price || 0) * tickets}` : "FREE"}
                    </strong>
                  </div>
                  <span className="event-category badge px-2 py-1">Available</span>
                </div>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="event-book-button btn w-100"
                >
                  <i className="feather-calendar me-2" />
                  {(eventData.price || 0) > 0 ? "Book Tickets Now" : "Register Free Now"}
                </button>
              </div>
              {eventData.organized_by && <p className="small text-muted mt-4 mb-0">Organised by <strong>{eventData.organized_by}</strong></p>}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default EventDetails;

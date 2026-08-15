import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";

interface EventItem {
  _id: string;
  event_name: string;
  location: string;
  description: string;
  start_date: string;
  price?: number;
  category?: string;
  organized_by?: string;
  images?: { src?: string; alt?: string }[];
}

const imageUrl = (src?: string) => src && /^https?:\/\//i.test(src) ? src : src ? `${IMG_URL}${src}` : "/assets/img/no-img.png";

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [organizerFilter, setOrganizerFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${API_URL}/event/fetchAll`).then(({ data }) => setEvents(Array.isArray(data?.data) ? data.data : [])).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(events.map((event) => event.category || "Sports")))], [events]);
  const locations = useMemo(() => Array.from(new Set(events.map((event) => event.location).filter(Boolean))), [events]);
  const organizers = useMemo(() => Array.from(new Set(events.map((event) => event.organized_by).filter(Boolean))) as string[], [events]);
  const visibleEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "All" || (event.category || "Sports") === selectedCategory;
    const eventDate = new Date(event.start_date);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7);
    const matchesDate = dateFilter === "all" || (dateFilter === "week" && eventDate >= today && eventDate <= weekEnd) || (dateFilter === "month" && eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear());
    const matchesLocation = locationFilter === "all" || event.location === locationFilter;
    const matchesOrganizer = organizerFilter === "all" || event.organized_by === organizerFilter;
    const matchesPrice = priceFilter === "all" || (priceFilter === "free" && !event.price) || (priceFilter === "under500" && (event.price || 0) > 0 && (event.price || 0) < 500) || (priceFilter === "500to1000" && (event.price || 0) >= 500 && (event.price || 0) <= 1000) || (priceFilter === "above1000" && (event.price || 0) > 1000);
    const searchable = `${event.event_name} ${event.location} ${event.category || ""}`.toLowerCase();
    return matchesCategory && matchesDate && matchesLocation && matchesOrganizer && matchesPrice && searchable.includes(search.trim().toLowerCase());
  });
  const clearFilters = () => { setSelectedCategory("All"); setDateFilter("all"); setLocationFilter("all"); setPriceFilter("all"); setOrganizerFilter("all"); setSearch(""); };

  return <main className="ki-events-page" style={{ background: "#f5f7fb", minHeight: "100vh", padding: "0 0 56px" }}>
    <style>{`
      .ki-events-page { color: #17222d; }
      .ki-events-page .event-page-title { color: #17222d !important; font-size: clamp(28px, 3vw, 38px); }
      .ki-events-page .event-filter-title { color: #17222d !important; }
      .ki-events-page .event-filter-label { color: #334155 !important; }
      .ki-events-page .event-filter-card { border: 1px solid #e4eaf1; }
      .ki-events-page .event-card-image { transition: transform .25s ease; }
      .ki-events-page article:hover .event-card-image { transform: scale(1.04); }
      .ki-events-page .event-card-title { color: #17222d !important; line-height: 1.3; }
      .ki-events-page .event-filter-chip { background: #fff; border: 1px solid #d8e0e8; color: #475569; }
      .ki-events-page .event-filter-chip.is-active { background: #16a34a; border-color: #16a34a; color: #fff; }
      .ki-events-page .events-hero { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); min-height: 330px; overflow: hidden; }
      .ki-events-page .events-hero-art { position: absolute; right: -60px; top: 0; bottom: 0; width: 55%; background: url('/assets/img/bg/banner-illustration.png') left center / cover no-repeat; opacity: .84; mask-image: linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%); -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%); }
      .ki-events-page .events-hero-title { color: #0f172a !important; font-size: clamp(36px, 4vw, 52px); letter-spacing: -1.3px; }
      .ki-events-page .events-content { padding-top: 42px; position: relative; z-index: 2; }
      @media (max-width: 991px) { .ki-events-page .events-hero { min-height: 270px; } .ki-events-page .events-hero-art { opacity: .3; width: 80%; } }
      @media (max-width: 575px) { .ki-events-page .events-hero { min-height: 0; padding-top: 88px !important; padding-bottom: 50px !important; } .ki-events-page .events-hero-title { font-size: 36px; } .ki-events-page .events-content { padding-top: 28px; } .ki-events-page .event-category-scroll { flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; } .ki-events-page .event-category-scroll::-webkit-scrollbar { display: none; } .ki-events-page .event-category-scroll .event-filter-chip { white-space: nowrap; flex: 0 0 auto; } .ki-events-page .event-mobile-filter-card .form-control, .ki-events-page .event-mobile-filter-card .form-select { min-height: 44px; } }
    `}</style>
    <section className="events-hero position-relative" style={{ paddingTop: "155px", paddingBottom: "82px" }}>
      <div className="events-hero-art" />
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <span className="d-block mb-2" style={{ color: "#22c55e", fontSize: 13, fontWeight: 800, letterSpacing: "1.5px" }}>BOOK. PLAY. ENJOY</span>
        <h1 className="events-hero-title fw-bold mb-3">Sports <span style={{ color: "#22c55e" }}>Events</span> in Indore</h1>
        <p className="mb-4" style={{ color: "#64748b", fontSize: "clamp(17px, 2vw, 21px)", maxWidth: 620 }}>Find upcoming sports events, tournaments, and community activities near you.</p>
        <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: 13, border: "1px solid #e5e7eb" }}>
          <Link to="/" className="text-decoration-none text-secondary"><i className="feather-home me-1" />Home</Link><i className="feather-chevron-right mx-2" style={{ fontSize: 12 }} /><span className="text-success fw-semibold">Events</span>
        </div>
      </div>
    </section>
    <div className="container events-content">
      <div className="row g-4">
        <aside className="col-lg-3 d-none d-lg-block">
          <div className="event-filter-card bg-white rounded-4 p-4 shadow-sm" style={{ position: "sticky", top: 110 }}>
            <div className="d-flex justify-content-between align-items-center mb-4"><h2 className="event-filter-title h3 mb-0 fw-bold">Filters</h2><button onClick={clearFilters} className="btn btn-link text-success text-decoration-none p-0">Reset all</button></div>
            <div className="mb-4"><label className="event-filter-label fw-semibold mb-2"><i className="feather-search me-2 text-success" />Search events</label><input value={search} onChange={(event) => setSearch(event.target.value)} className="form-control" placeholder="Event or sport" /></div>
            <div className="border-top pt-3 mb-4"><div className="d-flex justify-content-between mb-3"><strong className="event-filter-label"><i className="feather-activity me-2 text-success" />Sports type</strong><button onClick={() => setSelectedCategory("All")} className="btn btn-link p-0 text-muted">Clear</button></div><div className="d-flex flex-wrap gap-2">{categories.filter((category) => category !== "All").map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`btn btn-sm rounded-pill event-filter-chip ${selectedCategory === category ? "is-active" : ""}`}>{category}</button>)}</div></div>
            <div className="border-top pt-3"><div className="d-flex justify-content-between mb-3"><strong className="event-filter-label"><i className="feather-calendar me-2 text-success" />Date</strong><button onClick={() => setDateFilter("all")} className="btn btn-link p-0 text-muted">Clear</button></div><select className="form-select" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}><option value="all">Any date</option><option value="week">This week</option><option value="month">This month</option></select></div>
            <div className="border-top pt-3 mt-4"><label className="event-filter-label fw-semibold mb-2"><i className="feather-map-pin me-2 text-success" />Location</label><select className="form-select" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}><option value="all">All locations</option>{locations.map((location) => <option key={location} value={location}>{location}</option>)}</select></div>
            <div className="border-top pt-3 mt-4"><label className="event-filter-label fw-semibold mb-2"><i className="feather-tag me-2 text-success" />Price</label><select className="form-select" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}><option value="all">Any price</option><option value="free">Free</option><option value="under500">Under ₹500</option><option value="500to1000">₹500 – ₹1,000</option><option value="above1000">Above ₹1,000</option></select></div>
            {organizers.length > 1 && <div className="border-top pt-3 mt-4"><label className="event-filter-label fw-semibold mb-2"><i className="feather-user me-2 text-success" />Organiser</label><select className="form-select" value={organizerFilter} onChange={(event) => setOrganizerFilter(event.target.value)}><option value="all">All organisers</option>{organizers.map((organizer) => <option key={organizer} value={organizer}>{organizer}</option>)}</select></div>}
          </div>
        </aside>
        <section className="col-lg-9">
          <div className="d-lg-none mb-3">
            <button type="button" onClick={() => setShowMobileFilters((current) => !current)} className="btn w-100 d-flex align-items-center justify-content-between bg-white border rounded-3 px-3 py-2 shadow-sm" style={{ color: "#17222d", fontWeight: 700 }} aria-expanded={showMobileFilters}>
              <span><i className="feather-sliders me-2 text-success" />Filter events</span><i className={showMobileFilters ? "feather-chevron-up" : "feather-chevron-down"} />
            </button>
            {showMobileFilters && <div className="event-mobile-filter-card bg-white rounded-3 border shadow-sm p-3 mt-2">
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="form-control mb-2" placeholder="Search events" />
              <div className="row g-2">
                <div className="col-6"><select className="form-select" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}><option value="all">Any date</option><option value="week">This week</option><option value="month">This month</option></select></div>
                <div className="col-6"><select className="form-select" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}><option value="all">All locations</option>{locations.map((location) => <option key={location} value={location}>{location}</option>)}</select></div>
                <div className="col-6"><select className="form-select" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}><option value="all">Any price</option><option value="free">Free</option><option value="under500">Under ₹500</option><option value="500to1000">₹500 – ₹1,000</option><option value="above1000">Above ₹1,000</option></select></div>
                {organizers.length > 1 && <div className="col-6"><select className="form-select" value={organizerFilter} onChange={(event) => setOrganizerFilter(event.target.value)}><option value="all">All organisers</option>{organizers.map((organizer) => <option key={organizer} value={organizer}>{organizer}</option>)}</select></div>}
                <div className="col-6"><button type="button" onClick={clearFilters} className="btn btn-outline-success w-100 h-100">Reset</button></div>
              </div>
            </div>}
          </div>
          <div className="event-category-scroll d-flex flex-wrap gap-2 mb-4">{categories.map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`btn rounded-pill px-3 event-filter-chip ${selectedCategory === category ? "is-active" : ""}`}>{category}</button>)}</div>
          {loading ? <div className="text-center p-5 bg-white rounded-4">Loading events…</div> : <div className="row g-4">{visibleEvents.map((event) => <article key={event._id} className="col-md-6 col-xl-4"><Link to={`/events/event-details/${event._id}`} className="text-decoration-none"><div className="h-100"><div className="rounded-4 overflow-hidden shadow-sm bg-dark" style={{ aspectRatio: "4 / 5" }}><img src={imageUrl(event.images?.[0]?.src)} alt={event.images?.[0]?.alt || event.event_name} className="event-card-image w-100 h-100" style={{ objectFit: "cover" }} /><div className="text-white px-3 py-2" style={{ marginTop: "-43px", position: "relative", background: "linear-gradient(transparent, rgba(0,0,0,.88))" }}>{new Date(event.start_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</div></div><div className="pt-3"><h2 className="event-card-title h5 fw-bold mb-2">{event.event_name}</h2><p className="text-muted mb-1"><i className="feather-map-pin me-1" />{event.location}</p><p className="text-muted mb-1">{event.category || "Sports"}</p><strong className="text-success">₹{event.price || 0} onwards</strong></div></div></Link></article>)}</div>}
          {!loading && !visibleEvents.length && <div className="text-center p-5 bg-white rounded-4">No events match these filters.</div>}
        </section>
      </div>
    </div>
  </main>;
};

export default Events;

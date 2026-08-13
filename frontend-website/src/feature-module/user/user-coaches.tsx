import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { all_routes } from "../router/all_routes";

type Coach = { _id: string; first_name?: string; last_name?: string; category?: string; categories?: string[]; experience?: number; price?: number; profile_picture?: Array<{ src?: string }> };
export default function UserCoaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get(`${API_URL}/web/fetch-all-coaches`).then(({ data }) => setCoaches(data.data || data.coaches || [])).finally(() => setLoading(false)); }, []);
  return <div className="content court-bg py-5"><div className="container"><nav className="mb-4 small"><Link to={all_routes.userDashboard}>Dashboard</Link><span className="mx-2">/</span>Coaches</nav><h1 className="mb-4">Coaches</h1>{loading ? <p>Loading coaches…</p> : coaches.length === 0 ? <div className="alert alert-light border">No approved coaches are available right now.</div> : <div className="row g-4">{coaches.map((coach) => { const name = `${coach.first_name || ""} ${coach.last_name || ""}`.trim() || "Coach"; const photo = coach.profile_picture?.[0]?.src; return <div className="col-md-6 col-lg-4" key={coach._id}><Link className="text-decoration-none" to={`/coaches/coach/${name.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}><article className="bg-white rounded-3 shadow-sm overflow-hidden h-100"><div style={{ height: 180, background: "#f1f5f9" }}>{photo && <img src={photo.startsWith("http") ? photo : `${IMG_URL}${photo}`} alt={name} className="w-100 h-100" style={{ objectFit: "cover" }} />}</div><div className="p-3"><h5 className="text-dark mb-1">{name}</h5><p className="text-muted mb-2">{coach.categories?.join(", ") || coach.category || "Sports coach"}</p><div className="d-flex justify-content-between text-dark"><span>{coach.experience ? `${coach.experience} yrs experience` : "Experience not listed"}</span><strong>{Number(coach.price) > 0 ? `₹${coach.price}` : "Contact"}</strong></div></div></article></Link></div>; })}</div>}</div></div>;
}

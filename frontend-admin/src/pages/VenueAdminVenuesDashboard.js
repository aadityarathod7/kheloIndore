import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/ApiUrl";

export default function VenueAdminVenuesDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ venue_admin: null, venues: [], categories: [] });
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/super-admin/venue-admin/${id}/venues`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setData(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load this Venue Admin's venues.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const visibleVenues = useMemo(() => data.venues.filter((venue) => {
    if (category === "all") return true;
    return venue.category === category || (venue.categories || []).includes(category);
  }), [data.venues, category]);

  if (loading) return <p>Loading Venue Admin dashboard...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const adminName = `${data.venue_admin?.first_name || ""} ${data.venue_admin?.last_name || ""}`.trim();
  return <div>
    <div className="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h3 className="title mb-1">{adminName}'s Venue Dashboard</h3>
        <p className="text-muted mb-0">{data.count || 0} venue{data.count === 1 ? "" : "s"} assigned to this Venue Admin.</p>
      </div>
      <Button variant="outline-secondary" onClick={() => navigate("/venue-admin")}>Back to Venue Admins</Button>
    </div>

    <Form.Group className="mb-3" style={{ maxWidth: 300 }}>
      <Form.Label>Filter by category</Form.Label>
      <Form.Select value={category} onChange={(event) => setCategory(event.target.value)}>
        <option value="all">All categories</option>
        {data.categories.map((item) => <option key={item} value={item}>{item}</option>)}
      </Form.Select>
    </Form.Group>

    <Table className="custom-table" responsive>
      <thead><tr><th>S.No.</th><th>Venue ID</th><th>Venue</th><th>Category</th><th>Address</th><th>Status</th><th>Approval</th></tr></thead>
      <tbody>
        {visibleVenues.length ? visibleVenues.map((venue, index) => <tr key={venue._id}>
          <td>{index + 1}</td><td>{venue.provider_public_id || venue._id}</td><td>{venue.name}</td>
          <td>{[venue.category, ...(venue.categories || [])].filter(Boolean).join(", ") || "—"}</td>
          <td>{[venue.address, venue.city].filter(Boolean).join(", ") || "—"}</td>
          <td style={{ color: venue.status ? "#15803d" : "#dc2626", fontWeight: 700 }}>{venue.status ? "Active" : "Inactive"}</td>
          <td>{venue.verification_status === 1 ? "Approved" : venue.verification_status === 2 ? "Rejected" : "Pending"}</td>
        </tr>) : <tr><td colSpan="7" className="text-center py-4">No venues found for this category.</td></tr>}
      </tbody>
    </Table>
  </div>;
}

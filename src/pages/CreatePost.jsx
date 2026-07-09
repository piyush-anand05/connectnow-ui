import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  Clock3,
  MapPin,
  Sparkles,
  Send,
  X,
  LocateFixed,
  IndianRupee,
  Link as LinkIcon,
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

import { createPost, updatePost } from "../api/posts";

import { searchLocation, saveUserLocation } from "../api/location";

import "../styles/home.css";

export default function CreatePost() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Local explorer",
    city: "Pune",
    active_city: "Pune",
  };

  const today = new Date().toISOString().split("T")[0];

  const categories = [
    "Technology",
    "Education",
    "Sports",
    "Business",
    "Health",
    "Food",
    "Events",
    "Community",
    "Arts",
    "Other",
  ];

  const cities = [
    "Pune",
    "Mumbai",
    "Bangalore",
    "Delhi",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Other",
  ];

  const emptyForm = {
    title: "",
    description: "",
    date: "",
    time: "",
    city: user.active_city || user.city || "Pune",
    area: "",
    venue: "",
    location: "",
    latitude: null,
    longitude: null,
    locationLabel: "",
    locationSource: "manual",

    category: "Community",
    customCategory: "",
    type: "community",
    detailed: "",
    eventPurpose: "",
    whoShouldJoin: "",
    whatWillHappen: "",
    feeType: "Free",
    priceInr: "",
    capacity: "",
    externalLink: "",
    additionalNotes: "",
    allowPrivateReplies: true,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const editingPostRaw = localStorage.getItem("editing_post");
    if (!editingPostRaw) return;

    const editingPost = JSON.parse(editingPostRaw);

    if (editingPost) {
      setEditingId(editingPost.post_id);

      setForm({
        title: editingPost.title || "",
        description: editingPost.short_description || "",
        date: editingPost.event_date || "",
        time: editingPost.event_time || "",
        city: editingPost.city || user.active_city || user.city || "Pune",
        area: editingPost.area || "",
        venue: editingPost.venue || "",
        location: editingPost.location || "",
        latitude: editingPost.latitude || null,
        longitude: editingPost.longitude || null,
        locationLabel: editingPost.location_label || editingPost.location || "",
        locationSource: editingPost.location_source || "manual",

        category: editingPost.category || "Community",
        customCategory: editingPost.custom_category || "",
        type: editingPost.post_type || "community",
        detailed: editingPost.detailed_description || "",
        eventPurpose: editingPost.event_purpose || "",
        whoShouldJoin: editingPost.who_should_join || "",
        whatWillHappen: editingPost.what_will_happen || "",
        feeType: editingPost.event_fee_type || "Free",
        priceInr: editingPost.price_inr || "",
        capacity: editingPost.event_capacity || "",
        externalLink: editingPost.external_link || "",
        additionalNotes: editingPost.additional_notes || "",
        allowPrivateReplies: editingPost.allow_private_replies !== 0,
      });

      setLocationQuery(editingPost.location_label || editingPost.location || "");
      setShowMoreDetails(true);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function titleWordCount() {
    return form.title.trim().split(/\s+/).filter(Boolean).length;
  }

  function formatTime12(timeValue) {
    if (!timeValue) return "Time";

    const [hourRaw, minute = "00"] = timeValue.split(":");
    let hour = Number(hourRaw);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  }

  async function handleLocationSearch() {
    if (!locationQuery.trim()) return;

    try {
      setLocationLoading(true);

      const result = await searchLocation(`${locationQuery} ${form.city}`);

      setLocationResults(result.data || []);
    } catch (err) {
      console.log(err);
      alert("Unable to search location.");
    } finally {
      setLocationLoading(false);
    }
  }

  function selectLocation(loc) {
    const label = loc.address || loc.name || locationQuery;

    setForm({
      ...form,
      area: loc.name || form.area,
      location: label,
      locationLabel: label,
      latitude: loc.latitude,
      longitude: loc.longitude,
      locationSource: "search",
    });

    setLocationQuery(label);
    setLocationResults([]);
  }

  async function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Location is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const result = await saveUserLocation(
            lat,
            lng,
            form.city,
            "Current location"
          );

          const data = result.data || {};
          const reverse = data.reverse || {};

          const area =
            reverse.locality ||
            data.location_label ||
            form.area ||
            "Current area";

          const city = data.active_city || reverse.city || form.city;

          const label = reverse.display_name || data.location_label || area;

          setForm({
            ...form,
            city,
            area,
            location: label,
            locationLabel: label,
            latitude: lat,
            longitude: lng,
            locationSource: "gps",
          });

          setLocationQuery(label);
        } catch (err) {
          console.log(err);
          alert("Unable to save current location.");
        }
      },
      () => {
        alert("Location permission denied.");
      }
    );
  }

  async function publishPost() {
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (titleWordCount() > 25) {
      alert("Title should be within 25 words.");
      return;
    }

    if (!form.date) {
      alert("Date is required.");
      return;
    }

    if (form.date < today) {
      alert("Please select today or a future date.");
      return;
    }

    if (!form.time) {
      alert("Time is required.");
      return;
    }

    if (!form.city.trim()) {
      alert("City is required.");
      return;
    }

    if (!form.location.trim()) {
      alert("Location is required.");
      return;
    }

    if (
      form.feeType === "Paid" &&
      (!form.priceInr || Number(form.priceInr) <= 0)
    ) {
      alert("Please enter valid price in INR.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      short_description: form.description,
      event_date: form.date,
      event_time: form.time,
      location: form.location,
      city: form.city,
      area: form.area,
      venue: form.venue,
      latitude: form.latitude,
      longitude: form.longitude,
      location_label: form.locationLabel || form.location,
      location_source: form.locationSource,

      category: form.category,
      custom_category: form.customCategory,
      post_type: form.type,
      detailed_description: form.detailed,
      event_purpose: form.eventPurpose,
      who_should_join: form.whoShouldJoin,
      what_will_happen: form.whatWillHappen,
      event_fee_type: form.feeType,
      price_inr: form.feeType === "Paid" ? Number(form.priceInr) : 0,
      event_capacity: form.capacity ? Number(form.capacity) : null,
      external_link: form.externalLink,
      additional_notes: form.additionalNotes,
      allow_private_replies: form.allowPrivateReplies ? 1 : 0,
    };

    try {
      setLoading(true);

      if (editingId) {
        await updatePost(editingId, payload);
        localStorage.removeItem("editing_post");
        alert("Post updated successfully.");
      } else {
        await createPost(payload);
        alert("Post published successfully.");
      }

      navigate("/my-posts");
    } catch (err) {
      console.log(err);
      alert("Unable to save post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cn-page create-post-v2-page">
      <div className="create-post-shell event-builder-shell">
        <div className="create-post-left">
          <div className="create-post-badge">
            <Sparkles size={18} />
            Local Pulse
          </div>

          <h2>{editingId ? "Update your post" : "Create a clean local post"}</h2>

          <p>
            Start with the basics. Add extra event details only when needed.
            This keeps your post simple but still powerful.
          </p>

          <div className="post-preview-mini premium-event-preview">
            <div className="preview-top-row">
              <span className="premium-category-chip">
                {form.category === "Other"
                  ? form.customCategory || "Other"
                  : form.category}
              </span>

              <span className="preview-price-pill">
                {form.feeType === "Paid" ? `₹${form.priceInr || 0}` : "Free"}
              </span>
            </div>

            <h3>{form.title || "Your post title appears here"}</h3>

            <p>{form.description || "Short description preview..."}</p>

            <div>
              <span>
                <MapPin size={14} color="white" />
                {form.area || form.city || "City"}
              </span>

              <span>
                <Calendar size={14} color="white" />
                {form.date || "Date"}
              </span>

              <span>
                <Clock3 size={14} color="white" />
                {formatTime12(form.time)}
              </span>
            </div>
          </div>

          <div className="creator-tips-card">
            <div>
              <Eye size={20} color="white" />
            </div>

            <h3>Preview-first posting</h3>

            <p>
              Keep the card short. Put important details in the optional section
              so the detail view feels like an invitation.
            </p>
          </div>
        </div>

        <div className="create-post-form-card premium-event-form">
          <div className="form-section-title">Required Details</div>

          <label>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Income Tax knowledge sharing event"
          />

          <small className={titleWordCount() > 25 ? "limit-danger" : ""}>
            {titleWordCount()} / 25 words
          </small>

          <label>Short Description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="A short line people will see in feed"
          />

          <div className="form-two-grid">
            <div>
              <label>Date *</label>
              <input
                type="date"
                name="date"
                min={today}
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Time *</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section-title">Location</div>

          <div className="form-two-grid">
            <div>
              <label>City *</label>
              <select name="city" value={form.city} onChange={handleChange}>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Area</label>
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Baner, Kothrud..."
              />
            </div>
          </div>

          <label>Search Location *</label>

          <div className="location-search-row">
            <input
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Search locality, venue, landmark..."
            />

            <button type="button" onClick={handleLocationSearch}>
              {locationLoading ? "..." : "Find"}
            </button>
          </div>

          {locationResults.length > 0 && (
            <div className="location-results-box">
              {locationResults.map((loc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectLocation(loc)}
                >
                  <strong>{loc.name || "Location"}</strong>
                  <span>{loc.address}</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className="use-location-btn"
            onClick={useCurrentLocation}
          >
            <LocateFixed size={16} color="white" />
            Use Current Location
          </button>

          <label>Selected Location *</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Baner, Pune"
          />

          <button
            type="button"
            className="more-details-toggle"
            onClick={() => setShowMoreDetails(!showMoreDetails)}
          >
            {showMoreDetails ? (
              <>
                <ChevronUp size={18} />
                Hide optional details
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                Add more details
              </>
            )}
          </button>

          {showMoreDetails && (
            <div className="optional-details-panel">
              <div className="form-section-title">Optional Details</div>

              <div className="form-two-grid">
                <div>
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Post Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="community">Community</option>
                    <option value="workshop">Workshop</option>
                    <option value="meetup">Meetup</option>
                    <option value="announcement">Announcement</option>
                    <option value="sponsored">Sponsored</option>
                  </select>
                </div>
              </div>

              {form.category === "Other" && (
                <>
                  <label>Custom Category</label>
                  <input
                    name="customCategory"
                    value={form.customCategory}
                    onChange={handleChange}
                    placeholder="Board Games, Gardening, Fashion..."
                  />
                </>
              )}

              <label>Venue</label>
              <input
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Community hall, café, society clubhouse..."
              />

              <div className="form-two-grid">
                <div>
                  <label>Entry Type</label>
                  <select
                    name="feeType"
                    value={form.feeType}
                    onChange={handleChange}
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div>
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="50"
                  />
                </div>
              </div>

              {form.feeType === "Paid" && (
                <>
                  <label>Price in INR</label>
                  <div className="price-input-box">
                    <IndianRupee size={16} color="white" />
                    <input
                      type="number"
                      name="priceInr"
                      min="1"
                      value={form.priceInr}
                      onChange={handleChange}
                      placeholder="199"
                    />
                  </div>
                </>
              )}

              <label>Purpose</label>
              <textarea
                name="eventPurpose"
                value={form.eventPurpose}
                onChange={handleChange}
                placeholder="What is this post/event about?"
              />

              <label>Who Should Join?</label>
              <textarea
                name="whoShouldJoin"
                value={form.whoShouldJoin}
                onChange={handleChange}
                placeholder="Students, professionals, neighbours..."
              />

              <label>What Will Happen?</label>
              <textarea
                name="whatWillHappen"
                value={form.whatWillHappen}
                onChange={handleChange}
                placeholder="Talk, Q&A, demo, networking..."
              />

              <label>Detailed Description</label>
              <textarea
                name="detailed"
                value={form.detailed}
                onChange={handleChange}
                placeholder="Explain more..."
              />

              <label>External Link</label>
              <div className="price-input-box">
                <LinkIcon size={16} color="white" />
                <input
                  name="externalLink"
                  value={form.externalLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <label>Additional Notes</label>
              <textarea
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
                placeholder="Parking, instructions, things to bring..."
              />

              <label className="event-toggle-row">
                <input
                  type="checkbox"
                  checked={form.allowPrivateReplies}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      allowPrivateReplies: e.target.checked,
                    })
                  }
                />

                <span>
                  <Users size={16} color="white" />
                  Allow private replies
                </span>
              </label>
            </div>
          )}

          <div className="create-post-actions">
            <button className="save-btn" onClick={publishPost} disabled={loading}>
              <Send size={17} color="white" />
              {loading ? "Saving..." : editingId ? "Update Post" : "Publish Post"}
            </button>

            <button
              className="secondary-btn"
              onClick={() => {
                localStorage.removeItem("editing_post");
                navigate("/my-posts");
              }}
            >
              <X size={17} color="white" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
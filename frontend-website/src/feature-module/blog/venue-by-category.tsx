import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";

interface Venues {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  amenities: string[];
  facilities: string[];
  category: string;
  _id: string;
  images: any;
  src: string;
  near_by_location: string;
  vendor_type: any;
  price_per_hr: any;
  google_location: any;
  description: any;
}

interface DropdownOption {
  value: string;
  label: string;
  shortLabel?: string;
}

interface VenueSearchNavigationState {
  selectedLocationSort?: { name?: string };
}

const getVenueImage = (images: any): string => {
  if (!images || !Array.isArray(images) || images.length === 0) return "assets/img/venues/venue-01.jpg";
  const first = images[0];
  const imgStr = typeof first === "string" ? first : (first?.src || first?.url || "");
  if (!imgStr) return "assets/img/venues/venue-01.jpg";
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) return imgStr;
  return `${IMG_URL}${imgStr}`;
};

const DATE_OPTIONS: DropdownOption[] = [
  { value: "", label: "Select Date" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this-weekend", label: "This Weekend" },
  { value: "next-7-days", label: "Next 7 Days" },
];

const SLOT_OPTIONS: DropdownOption[] = [
  { value: "all", label: "Select Time", shortLabel: "Select Time" },
  { value: "all-full", label: "All Slots (6 AM - 11 PM)", shortLabel: "All Slots" },
  { value: "morning", label: "Morning (06:00 AM - 12:00 PM)", shortLabel: "Morning" },
  { value: "afternoon", label: "Afternoon (12:00 PM - 05:00 PM)", shortLabel: "Afternoon" },
  { value: "evening", label: "Evening (05:00 PM - 09:00 PM)", shortLabel: "Evening" },
  { value: "night", label: "Night (09:00 PM - 11:00 PM)", shortLabel: "Night" },
];

// Custom Modern Theme Dropdown Component (replaces native OS select)
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  icon,
  searchable = true,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: string;
  searchable?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const query = searchTerm.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().startsWith(query));
  }, [options, searchTerm]);

  return (
    <div className="position-relative w-100" ref={dropdownRef}>
      <button
        type="button"
        className="btn w-100 d-flex align-items-center justify-content-between px-3 bg-white shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: "42px",
          fontSize: "12px",
          fontWeight: "500",
          color: selectedOption && selectedOption.value !== "" ? "#1E293B" : "#64748B",
          borderRadius: "12px",
          border: isOpen ? "1.5px solid #22C55E" : "1px solid #E2E8F0",
          boxShadow: isOpen ? "0 0 0 3px rgba(34, 197, 94, 0.15)" : "none",
          transition: "all 0.2s ease"
        }}
      >
        <span className="d-flex align-items-center text-truncate me-2">
          <i className={`${icon} text-success me-2`} style={{ fontSize: "14px", flexShrink: 0 }} />
          <span className="text-truncate">{selectedOption ? (selectedOption.shortLabel || selectedOption.label) : placeholder}</span>
        </span>
        <i
          className="feather-chevron-down ms-1 flex-shrink-0"
          style={{
            fontSize: "13px",
            color: "#22C55E",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease"
          }}
        />
      </button>

      {isOpen && (
        <div
          className="position-absolute start-0 bg-white shadow-lg border overflow-hidden"
          style={{
            zIndex: 999,
            minWidth: "100%",
            width: "max-content",
            maxWidth: "280px",
            borderColor: "#E2E8E3",
            borderRadius: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            marginTop: "4px"
          }}
        >
          {searchable && options.length > 5 && (
            <div className="p-2 border-bottom bg-white" style={{ borderColor: "#F1F5F9" }}>
              <div className="position-relative d-flex align-items-center">
                <i className="feather-search position-absolute text-muted" style={{ fontSize: "12px", left: "12px", pointerEvents: "none", zIndex: 5 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: "11px",
                    borderRadius: "8px",
                    borderColor: "#CBD5E1",
                    backgroundColor: "#F8FAFC",
                    paddingLeft: "34px",
                    paddingRight: "10px",
                    height: "34px"
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ maxHeight: "200px", overflowY: "auto", padding: "4px 0" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="btn w-100 text-start px-3 py-2 d-flex align-items-center justify-content-between gap-2"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    style={{
                      fontSize: "12px",
                      fontWeight: isSelected ? "700" : "500",
                      color: isSelected ? "#FFFFFF" : "#334155",
                      backgroundColor: isSelected ? "#166534" : "transparent",
                      transition: "background-color 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <i className="feather-check text-success flex-shrink-0" style={{ fontSize: "12px" }} />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-center text-muted" style={{ fontSize: "11px" }}>
                No matching results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Mini Calendar Dropdown Component (with greyed out past dates)
const MiniCalendarDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (dateStr: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewDate, setViewDate] = useState<Date>(() => new Date());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Days calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev.getFullYear() < today.getFullYear() || (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth())) {
      return;
    }
    setViewDate(prev);
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const isPrevDisabled = year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth());

  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  const formatDisplayLabel = (dateStr: string) => {
    if (!dateStr) return "Select Date";
    const [y, m, d] = dateStr.split("-").map(Number);
    const sel = new Date(y, m - 1, d);
    sel.setHours(0, 0, 0, 0);
    if (sel.getTime() === today.getTime()) return "Today";
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (sel.getTime() === tomorrow.getTime()) return "Tomorrow";
    return sel.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="position-relative w-100" ref={dropdownRef}>
      <button
        type="button"
        className="btn w-100 d-flex align-items-center justify-content-between px-3 bg-white shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: "42px",
          fontSize: "12px",
          fontWeight: "500",
          color: value ? "#1E293B" : "#64748B",
          borderRadius: "12px",
          border: isOpen ? "1.5px solid #22C55E" : "1px solid #E2E8F0",
          boxShadow: isOpen ? "0 0 0 3px rgba(34, 197, 94, 0.15)" : "none",
          transition: "all 0.2s ease"
        }}
      >
        <span className="d-flex align-items-center text-truncate me-2">
          <i className="feather-calendar text-success me-2" style={{ fontSize: "14px", flexShrink: 0 }} />
          <span className="text-truncate">{formatDisplayLabel(value)}</span>
        </span>
        <i
          className="feather-chevron-down ms-1 flex-shrink-0"
          style={{
            fontSize: "13px",
            color: "#22C55E",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease"
          }}
        />
      </button>

      {isOpen && (
        <div
          className="position-absolute start-0 bg-white shadow-lg border p-3 mt-1"
          style={{
            zIndex: 999,
            width: "250px",
            borderColor: "#E2E8E3",
            borderRadius: "16px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
          }}
        >
          {/* Calendar Header */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <button
              type="button"
              className="btn btn-sm p-1 text-muted"
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              style={{ opacity: isPrevDisabled ? 0.3 : 1, cursor: isPrevDisabled ? "not-allowed" : "pointer" }}
            >
              <i className="feather-chevron-left" style={{ fontSize: "13px" }} />
            </button>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#0F172A" }}>
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              className="btn btn-sm p-1 text-muted"
              onClick={handleNextMonth}
            >
              <i className="feather-chevron-right" style={{ fontSize: "13px" }} />
            </button>
          </div>

          {/* Days of week */}
          <div className="d-grid mb-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center" }}>
            {daysOfWeek.map((day) => (
              <span key={day} style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8" }}>
                {day}
              </span>
            ))}
          </div>

          {/* Date Grid */}
          <div className="d-grid gap-1" style={{ gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center" }}>
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateObj = new Date(year, month, dayNum);
              dateObj.setHours(0, 0, 0, 0);

              const isPast = dateObj.getTime() < today.getTime();
              const dateStr = formatDateStr(year, month, dayNum);
              const isSelected = value === dateStr;
              const isToday = dateObj.getTime() === today.getTime();

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onChange(dateStr);
                    setIsOpen(false);
                  }}
                  className="btn btn-sm p-0 d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: "27px",
                    height: "27px",
                    borderRadius: "7px",
                    fontSize: "11px",
                    fontWeight: isSelected ? "700" : isToday ? "700" : "500",
                    color: isPast ? "#CBD5E1" : isSelected ? "#FFFFFF" : isToday ? "#22C55E" : "#334155",
                    backgroundColor: isSelected ? "#22C55E" : "transparent",
                    border: isToday && !isSelected ? "1px solid #22C55E" : "none",
                    cursor: isPast ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isPast && !isSelected) e.currentTarget.style.backgroundColor = "#F0FDF4";
                  }}
                  onMouseLeave={(e) => {
                    if (!isPast && !isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top" style={{ borderColor: "#F1F5F9" }}>
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0"
              style={{ fontSize: "11px", fontWeight: "600", color: "#22C55E" }}
              onClick={() => {
                const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
                onChange(todayStr);
                setIsOpen(false);
              }}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-muted"
                style={{ fontSize: "11px", fontWeight: "500" }}
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
              >
                Clear
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

// Custom Multi-Select Dropdown Component (with checkboxes)
const MultiSelectDropdown = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  icon,
}: {
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  placeholder: string;
  icon: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (val: string) => {
    if (val === "any" || val === "") {
      onChange([]);
      return;
    }
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const formatButtonLabel = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const opt = options.find((o) => o.value === selectedValues[0]);
      return opt ? opt.label : placeholder;
    }
    return `${selectedValues.length} Selected`;
  };

  return (
    <div className="position-relative w-100" ref={dropdownRef}>
      <button
        type="button"
        className="btn w-100 d-flex align-items-center justify-content-between px-3 bg-white shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: "42px",
          fontSize: "12px",
          fontWeight: "500",
          color: selectedValues.length > 0 ? "#15803D" : "#64748B",
          borderRadius: "12px",
          border: isOpen ? "1.5px solid #22C55E" : selectedValues.length > 0 ? "1.5px solid #22C55E" : "1px solid #E2E8F0",
          boxShadow: isOpen ? "0 0 0 3px rgba(34, 197, 94, 0.15)" : "none",
          transition: "all 0.2s ease"
        }}
      >
        <span className="d-flex align-items-center text-truncate me-2">
          <i className={`${icon} text-success me-2`} style={{ fontSize: "14px", flexShrink: 0 }} />
          <span className="text-truncate">{formatButtonLabel()}</span>
        </span>
        <i
          className="feather-chevron-down ms-1 flex-shrink-0"
          style={{
            fontSize: "13px",
            color: "#22C55E",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease"
          }}
        />
      </button>

      {isOpen && (
        <div
          className="position-absolute start-0 bg-white shadow-lg border overflow-hidden"
          style={{
            zIndex: 999,
            minWidth: "100%",
            width: "max-content",
            maxWidth: "260px",
            borderColor: "#E2E8E3",
            borderRadius: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            marginTop: "4px"
          }}
        >
          <div style={{ maxHeight: "220px", overflowY: "auto", padding: "4px 0" }}>
            {options.map((opt) => {
              if (opt.value === "any" || opt.value === "") return null;
              const isChecked = selectedValues.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  className="px-3 py-2 d-flex align-items-center justify-content-between cursor-pointer"
                  onClick={() => handleToggle(opt.value)}
                  style={{
                    fontSize: "12px",
                    fontWeight: isChecked ? "600" : "500",
                    color: isChecked ? "#15803D" : "#334155",
                    backgroundColor: isChecked ? "#F0FDF4" : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked) e.currentTarget.style.backgroundColor = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    if (!isChecked) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "5px",
                        border: isChecked ? "none" : "1.5px solid #CBD5E1",
                        backgroundColor: isChecked ? "#22C55E" : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.15s ease"
                      }}
                    >
                      {isChecked && <i className="feather-check text-white" style={{ fontSize: "11px", fontWeight: "bold" }} />}
                    </div>
                    <span>{opt.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex align-items-center justify-content-between px-3 py-2 border-top bg-light" style={{ borderColor: "#F1F5F9" }}>
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0 text-muted"
              style={{ fontSize: "11px", fontWeight: "500" }}
              onClick={() => onChange([])}
            >
              Clear All
            </button>
            <button
              type="button"
              className="btn btn-success btn-sm py-0.5 px-2.5 rounded-pill"
              style={{ fontSize: "11px", fontWeight: "600", backgroundColor: "#22C55E", borderColor: "#22C55E" }}
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const GRASS_OPTIONS: DropdownOption[] = [
  { value: "any", label: "Any Grass" },
  { value: "box", label: "Box Cricket Turf" },
  { value: "natural", label: "Natural Grass Ground" },
  { value: "artificial", label: "Artificial Turf" },
];

// Fallback amenity list (used only when the API returns no amenity data at all).
// Values are slug keys matched against venue amenities/facilities via AMENITY_KEYWORDS.
const FALLBACK_AMENITY_OPTIONS: DropdownOption[] = [
  { value: "parking", label: "Parking" },
  { value: "washrooms", label: "Washrooms" },
  { value: "lockers", label: "Lockers" },
  { value: "food", label: "Food / Canteen" },
  { value: "water", label: "Drinking Water" },
  { value: "floodlights", label: "Floodlights / Lighting" },
  { value: "seating", label: "Seating" },
  { value: "wi-fi", label: "Wi-Fi" },
  { value: "cctv", label: "CCTV / Security" },
  { value: "first-aid", label: "First Aid" },
  { value: "shower", label: "Shower" },
  { value: "sound-system", label: "Sound System" },
];

// Keyword map used to match fallback amenity slugs against real venue data values
const AMENITY_KEYWORDS: Record<string, string[]> = {
  parking: ["parking"],
  washrooms: ["washroom", "toilet"],
  lockers: ["locker"],
  food: ["food", "canteen", "cafe", "snack"],
  water: ["drinking water", "water"],
  floodlights: ["floodlight", "lighting", "light"],
  seating: ["seating", "sit"],
  "wi-fi": ["wi-fi", "wifi", "internet"],
  cctv: ["cctv", "camera", "security"],
  "first-aid": ["first aid", "medical"],
  shower: ["shower"],
  "sound-system": ["sound", "speaker", "music"],
};

const SORT_OPTIONS: DropdownOption[] = [
  { value: "popular", label: "Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function VenueByCategory() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venues[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const thisCategory = useParams<{ type: string }>();
  const routeLocation = useLocation();
  const routeState = routeLocation.state as VenueSearchNavigationState | null;
  const categorySelected = thisCategory?.type || "";

  // Filter States
  const [selectedSport, setSelectedSport] = useState<string>(categorySelected ? categorySelected.toLowerCase() : "all");
  const [locationName, setLocationName] = useState<string>(() => routeState?.selectedLocationSort?.name || "");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("all");
  const [selectedGrassType, setSelectedGrassType] = useState<string>("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");

  useEffect(() => {
    if (categorySelected) {
      setSelectedSport(categorySelected.toLowerCase());
    }
  }, [categorySelected]);

  useEffect(() => {
    const requestedLocation = routeState?.selectedLocationSort?.name;
    if (requestedLocation) setLocationName(requestedLocation);
  }, [routeState]);

  const categoryTitle = selectedSport && selectedSport !== "all"
    ? selectedSport
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Sports";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${categoryTitle} Venues - Khelo Indore`;
  }, [categoryTitle]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        // Send active filters to the backend (all optional params). The backend
        // filters when deployed; the client re-applies the same rules below so
        // results stay correct either way.
        const params: Record<string, string> = {};
        if (selectedSport && selectedSport !== "all" && selectedSport !== "other-sports") params.sport = selectedSport;
        if (locationName) params.location = locationName;
        if (selectedGrassType && selectedGrassType !== "any") params.grassType = selectedGrassType;
        if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(",");
        if (selectedDate) params.date = selectedDate;
        if (selectedSlot && selectedSlot !== "all") params.time = selectedSlot;
        if (sortBy && sortBy !== "popular") params.sort = sortBy;
        const response = await axios.get(`${API_URL}/web/venue/getVenue`, { params });
        const venuesData = response.data.venue || [];
        const mappedData = venuesData.map((venues: any) => ({
          name: venues.name,
          address: venues.address,
          city: venues.city,
          state: venues.state,
          zipcode: venues.zipcode,
          amenities: Array.isArray(venues.amenities) ? venues.amenities : [],
          facilities: Array.isArray(venues.facilities) ? venues.facilities : [],
          images: venues.images,
          category: venues.category,
          _id: venues._id,
          near_by_location: venues.near_by_location,
          vendor_type: venues.vendor_type,
          price_per_hr: venues.price_per_hr,
          google_location: venues.google_location,
          description: venues.description || "",
        }));
        setVenues(mappedData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, [selectedSport, locationName, selectedGrassType, selectedAmenities, selectedDate, selectedSlot, sortBy]);

  // Amenity options are built from the real amenities/facilities the API returns
  // (falling back to common amenities only when the data has none).
  const amenityOptions: DropdownOption[] = useMemo(() => {
    const unique = Array.from(
      new Set(
        venues.flatMap((v) =>
          [...(v.amenities || []), ...(v.facilities || [])]
            .map((a) => String(a).trim())
            .filter(Boolean)
        )
      )
    );
    const dynamic = unique.map((a) => ({ value: a, label: a }));
    return [
      { value: "any", label: "Any Amenities" },
      ...(dynamic.length > 0 ? dynamic : FALLBACK_AMENITY_OPTIONS),
    ];
  }, [venues]);

  const toggleFavorite = (venueId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please Login First",
        text: "You need to log in to add venues to your favourites.",
        showCancelButton: true,
        confirmButtonColor: "#22C55E",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    const nextStatus = !favorites[venueId];
    localStorage.setItem(`fav_venue_${venueId}`, String(nextStatus));
    setFavorites((prev) => ({
      ...prev,
      [venueId]: nextStatus,
    }));

    Swal.fire({
      icon: nextStatus ? "success" : "info",
      title: `${nextStatus ? "Saved to Favourites!" : "Removed from Favourites"}`,
      text: `${nextStatus ? "Venue added to your favorites list." : "Venue removed from your favorites list."}`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const locationOptions: DropdownOption[] = useMemo(() => {
    const uniqueLocs = [
      ...new Set(
        venues
          .map((v) => (v.near_by_location ? String(v.near_by_location).replace(/_/g, " ").trim() : ""))
          .filter(Boolean)
      ),
    ];
    return [
      { value: "", label: "Select Location" },
      ...uniqueLocs.map((loc) => ({ value: loc, label: loc })),
    ];
  }, [venues]);

  // Unified Filtering & Sorting Engine
  const displayList = useMemo(() => {
    const result = venues.filter((t: any) => {
      // 1. Sports Filter
      if (selectedSport && selectedSport !== "all") {
        const vt = (t.vendor_type || "").toLowerCase().replace(/_/g, " ").trim();
        const cat = (t.category || "").toLowerCase().replace(/_/g, " ").trim();
        const name = (t.name || "").toLowerCase();

        if (selectedSport === "other-sports") {
          const isCricket = vt.includes("cricket") || cat.includes("cricket") || name.includes("cricket") || vt.includes("turf") || cat.includes("turf");
          const isBadminton = vt.includes("badminton") || cat.includes("badminton") || name.includes("badminton");
          const isSwimming = vt.includes("swim") || cat.includes("swim") || name.includes("swim");
          const isFootball = vt.includes("football") || cat.includes("football") || name.includes("football");
          const isPickleball = vt.includes("pickle") || cat.includes("pickle") || name.includes("pickle");
          const isTennis = (vt.includes("tennis") || cat.includes("tennis") || name.includes("tennis")) && !vt.includes("table") && !cat.includes("table") && !name.includes("table");
          const isBasketball = vt.includes("basketball") || cat.includes("basketball") || name.includes("basketball");
          const isTableTennis = vt.includes("table tennis") || cat.includes("table tennis") || name.includes("table tennis");

          if (isCricket || isBadminton || isSwimming || isFootball || isPickleball || isTennis || isBasketball || isTableTennis) {
            return false;
          }
        } else {
          const targetCat = selectedSport.replace(/-/g, " ").trim();
          const normalizedTarget = targetCat.replace(/&/g, "and");
          const matches = [vt, cat, name]
            .filter(Boolean)
            .map((field) => field.replace(/&/g, "and").replace(/-/g, " "))
            .some((field) => field.includes(normalizedTarget));
          if (!matches) return false;
        }
      }

      // 2. Location Filter
      if (locationName) {
        const formattedLocation = (t.near_by_location || "").replace(/_/g, " ").toLowerCase();
        const targetLoc = locationName.toLowerCase();
        if (!formattedLocation || !formattedLocation.includes(targetLoc)) {
          return false;
        }
      }

      // 3. Grass Type Filter (derived from the venue's vendor_type / category / name)
      if (selectedGrassType && selectedGrassType !== "any") {
        const grassText = `${t.vendor_type || ""} ${t.category || ""} ${t.name || ""}`
          .toLowerCase()
          .replace(/_/g, " ");
        const matchesGrass =
          selectedGrassType === "box"
            ? grassText.includes("box")
            : selectedGrassType === "natural"
            ? grassText.includes("ground") || grassText.includes("natural")
            : selectedGrassType === "artificial"
            ? grassText.includes("turf") || grassText.includes("astro") || grassText.includes("artificial")
            : true;
        if (!matchesGrass) return false;
      }

      // 4. Amenities Multi-Select Filter (matches real amenities + facilities fields)
      if (selectedAmenities.length > 0) {
        const venueAmenities = [...(t.amenities || []), ...(t.facilities || [])]
          .map((a) => String(a).toLowerCase());
        const hasAllAmenities = selectedAmenities.every((amenity) => {
          const keywords = AMENITY_KEYWORDS[amenity] || [amenity.replace(/-/g, " ").toLowerCase()];
          return keywords.some((kw) => venueAmenities.some((a) => a.includes(kw)));
        });
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    // Sorting logic
    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price_per_hr || 0) - Number(b.price_per_hr || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price_per_hr || 0) - Number(a.price_per_hr || 0));
    }

    return result;
  }, [venues, selectedSport, locationName, selectedGrassType, selectedAmenities, sortBy]);

  const [currentPage, setCurrentPage] = useState(1);

  // Automatically reset to page 1 whenever filter parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSport, locationName, selectedDate, selectedSlot, selectedGrassType, selectedAmenities, sortBy]);

  const handleResetFilters = () => {
    setLocationName("");
    setSelectedDate("");
    setSelectedSlot("all");
    setSelectedGrassType("any");
    setSelectedAmenities([]);
    setCurrentPage(1);
  };

  const venuesPerPage = 10; // 10 cards per page (2 rows of 5 cards each)
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;

  const currentVenues = displayList.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.max(1, Math.ceil(displayList.length / venuesPerPage));

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* Standard Hero Header Section matching other pages */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "120px", paddingBottom: "36px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "8px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "44px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "12px" }}>
                {categoryTitle} <span style={{ color: "#22C55E", marginLeft: "10px" }}>Venues</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "16px", fontWeight: "500", maxWidth: "480px" }}>
                Browse and book top-rated {categoryTitle.toLowerCase()} grounds across Indore
              </p>
              
              {/* Breadcrumb pill matching sports-venue.tsx */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <Link to="/sports-venue" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>Sports Venues</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>{categoryTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Header Section */}

      {/* Main Page Container - Left Sidebar Layout */}
      <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "28px 0 60px 0" }}>
        <div className="container-fluid px-lg-5 px-md-4 px-3">

          {/* Title & Count Row */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fw-extrabold text-dark mb-1 d-flex align-items-center gap-2" style={{ fontSize: "24px", fontWeight: "800", color: "#17222D" }}>
                <span style={{ color: "#22C55E" }}>{displayList.length}</span> {categoryTitle} Venues
              </h2>
              <p className="text-muted mb-0" style={{ fontSize: "13px", fontWeight: "500", color: "#64748B" }}>
                Book the best {categoryTitle.toLowerCase()} grounds in Indore
              </p>
            </div>

            {/* Sort Dropdown - top right */}
            <div className="d-flex align-items-center gap-2" style={{ minWidth: "200px" }}>
              <span className="text-muted flex-shrink-0" style={{ fontSize: "12px", fontWeight: "600" }}>Sort by:</span>
              <CustomDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort by"
                icon="feather-sliders"
              />
            </div>
          </div>

          {/* Two-Column Layout: Left Filters | Right Cards */}
          <div className="row g-4 align-items-start">

            {/* LEFT COLUMN - Sticky Filter Sidebar */}
            <div className="col-lg-3 col-md-4 d-none d-md-block">
              <div className="bg-white rounded-4 p-4 shadow-sm border" style={{ borderColor: "#E2E8E3", position: "sticky", top: "100px" }}>
                {/* Filter Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0" style={{ fontSize: "16px", color: "#0F172A", fontFamily: "Space Grotesk, sans-serif" }}>
                    <i className="feather-filter text-success me-2" />Filters
                  </h5>
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0"
                    style={{ fontSize: "11px", fontWeight: "600", color: "#22C55E" }}
                    onClick={handleResetFilters}
                  >
                    Reset All
                  </button>
                </div>

                <hr style={{ borderColor: "#F1F5F9", margin: "0 0 16px 0" }} />

                {/* Filter 1: Location */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark d-flex align-items-center gap-1 mb-2" style={{ fontSize: "12px", color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    <i className="feather-map-pin text-success" style={{ fontSize: "13px" }} /> Location
                  </label>
                  <CustomDropdown
                    options={locationOptions}
                    value={locationName}
                    onChange={setLocationName}
                    placeholder="Select Location"
                    icon="feather-map-pin"
                  />
                </div>

                {/* Filter 2: Date */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark d-flex align-items-center gap-1 mb-2" style={{ fontSize: "12px", color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    <i className="feather-calendar text-success" style={{ fontSize: "13px" }} /> Date
                  </label>
                  <MiniCalendarDropdown
                    value={selectedDate}
                    onChange={setSelectedDate}
                  />
                </div>

                {/* Filter 3: Time */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark d-flex align-items-center gap-1 mb-2" style={{ fontSize: "12px", color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    <i className="feather-clock text-success" style={{ fontSize: "13px" }} /> Time
                  </label>
                  <CustomDropdown
                    options={SLOT_OPTIONS}
                    value={selectedSlot}
                    onChange={setSelectedSlot}
                    placeholder="Select Time"
                    icon="feather-clock"
                  />
                </div>

                {/* Filter 4: Grass Type */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark d-flex align-items-center gap-1 mb-2" style={{ fontSize: "12px", color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    <i className="feather-layers text-success" style={{ fontSize: "13px" }} /> Grass Type
                  </label>
                  <CustomDropdown
                    options={GRASS_OPTIONS}
                    value={selectedGrassType}
                    onChange={setSelectedGrassType}
                    placeholder="Any Grass"
                    icon="feather-layers"
                  />
                </div>

                {/* Filter 5: Amenities */}
                <div className="mb-2">
                  <label className="form-label fw-bold text-dark d-flex align-items-center gap-1 mb-2" style={{ fontSize: "12px", color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    <i className="feather-grid text-success" style={{ fontSize: "13px" }} /> Amenities
                  </label>
                  <MultiSelectDropdown
                    options={amenityOptions}
                    selectedValues={selectedAmenities}
                    onChange={setSelectedAmenities}
                    placeholder="Any Amenities"
                    icon="feather-grid"
                  />
                </div>

                {/* Active Filters Summary */}
                {(locationName || selectedDate || selectedSlot !== "all" || selectedGrassType !== "any" || selectedAmenities.length > 0) && (
                  <div className="mt-4 pt-3 border-top" style={{ borderColor: "#F1F5F9" }}>
                    <p className="text-muted mb-2" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.6px" }}>Active Filters</p>
                    <div className="d-flex flex-wrap gap-1">
                      {locationName && (
                        <span className="badge rounded-pill d-inline-flex align-items-center ki-filter-badge" style={{ backgroundColor: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", fontSize: "11px", fontWeight: "600", padding: "4px 8px" }}>
                          <i className="feather-map-pin me-1" /> {locationName}
                          <button type="button" className="btn-close btn-close-sm ms-1" style={{ fontSize: "8px" }} onClick={() => setLocationName("")} aria-label="Remove" />
                        </span>
                      )}
                      {selectedDate && (
                        <span className="badge rounded-pill d-inline-flex align-items-center ki-filter-badge" style={{ backgroundColor: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", fontSize: "11px", fontWeight: "600", padding: "4px 8px" }}>
                          <i className="feather-calendar me-1" /> {selectedDate}
                          <button type="button" className="btn-close btn-close-sm ms-1" style={{ fontSize: "8px" }} onClick={() => setSelectedDate("")} aria-label="Remove" />
                        </span>
                      )}
                      {selectedAmenities.map((a) => (
                        <span key={a} className="badge rounded-pill d-inline-flex align-items-center ki-filter-badge" style={{ backgroundColor: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", fontSize: "11px", fontWeight: "600", padding: "4px 8px" }}>
                          <i className="feather-check-circle me-1" /> {a}
                          <button type="button" className="btn-close btn-close-sm ms-1" style={{ fontSize: "8px" }} onClick={() => setSelectedAmenities(selectedAmenities.filter((x) => x !== a))} aria-label="Remove" />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - Venue Cards Grid */}
            <div className="col-lg-9 col-md-8">

              {/* Mobile Filter Row (visible only on small screens) */}
              <div className="d-flex d-md-none flex-wrap gap-2 mb-3">
                <CustomDropdown options={locationOptions} value={locationName} onChange={setLocationName} placeholder="Location" icon="feather-map-pin" />
                <MiniCalendarDropdown value={selectedDate} onChange={setSelectedDate} />
                <CustomDropdown options={SLOT_OPTIONS} value={selectedSlot} onChange={setSelectedSlot} placeholder="Time" icon="feather-clock" />
                <button type="button" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" style={{ fontSize: "12px", borderRadius: "10px" }} onClick={handleResetFilters}>
                  <i className="feather-refresh-cw" style={{ fontSize: "12px" }} /> Reset
                </button>
              </div>

              {/* Cards Grid */}
              {currentVenues.length > 0 ? (
                <div className="ki-4-col-grid">
                  {currentVenues.map((venue, index) => (
                    <div key={index} className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease" }}>
                      
                      {/* Card Image Cover Header */}
                      <div className="listing-img" style={{ height: "115px", position: "relative" }}>
                        <Link
                          to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                          style={{ position: "absolute", inset: 0, display: "block" }}
                        >
                          {getVenueImage(venue?.images).startsWith("http") ? (
                            <img
                              src={getVenueImage(venue?.images)}
                              className="img-fluid"
                              alt={venue.name}
                              style={{ height: "100%", width: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <ImageWithBasePath
                              src={getVenueImage(venue?.images)}
                              className="img-fluid"
                              alt={venue.name}
                              style={{ height: "100%", width: "100%", objectFit: "cover" }}
                            />
                          )}
                        </Link>
                        
                        {/* Category Badge on Top-Left */}
                        <div style={{ position: "absolute", top: "6px", left: "6px", zIndex: 2 }}>
                          <span className="badge" style={{ backgroundColor: "#22C55E", color: "#FFFFFF", fontWeight: "700", fontSize: "9px", padding: "3px 6px", borderRadius: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {venue?.vendor_type ? venue.vendor_type.replace("_", " ") : "Venue"}
                          </span>
                        </div>

                        {/* Favorite Heart Button on Top-Right */}
                        <div style={{ position: "absolute", top: "6px", right: "6px", zIndex: 2 }}>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(venue._id);
                            }}
                            className="btn btn-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                            style={{ width: "25px", height: "25px", padding: 0, backgroundColor: "#FFFFFF", border: "none" }}
                          >
                            <i 
                              className={favorites[venue._id] ? "fas fa-heart text-danger" : "feather-heart text-muted"} 
                              style={{ fontSize: "11px" }} 
                            />
                          </button>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="listing-content news-content p-2.5" style={{ background: "#FFFFFF", padding: "10px" }}>
                        
                        {/* Rating & Standard badge */}
                        <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "10px" }}>
                          <div className="rating-wrap d-flex align-items-center gap-1">
                            <i className="fas fa-star text-warning" style={{ fontSize: "9px" }} />
                            <span style={{ fontSize: "10px", fontWeight: "700", color: "#17222D" }}>4.8</span>
                          </div>
                          <span style={{ fontSize: "9px", color: "#606D76", fontWeight: "600" }}>
                            <i className="feather-grid me-1" style={{ color: "#3CAB4B", fontSize: "9px" }} />
                            Standard
                          </span>
                        </div>

                        {/* Venue Title */}
                        <h3 className="listing-title mb-1" style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.2" }}>
                          <Link
                            to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                            className="text-truncate d-block" style={{ color: "#17222D" }}
                            title={venue.name}
                          >
                            {venue.name}
                          </Link>
                        </h3>

                        {/* Location Pin & Map Link */}
                        <div className="d-flex align-items-center justify-content-between mb-1.5" style={{ fontSize: "11px" }}>
                          <p className="mb-0 text-truncate" style={{ fontSize: "11px", color: "#606D76" }}>
                            <i className="feather-map-pin me-1" style={{ color: "#3CAB4B" }} />
                            {venue.near_by_location || "Indore"}, Indore
                          </p>
                          {venue.google_location && (
                            <a
                              href={venue.google_location.startsWith("http") ? venue.google_location : `https://${venue.google_location}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open Google Maps"
                              className="text-success ms-1 flex-shrink-0 d-inline-flex align-items-center"
                              style={{ fontSize: "10px", fontWeight: "600" }}
                            >
                              Map <i className="feather-map-pin ms-0.5" style={{ fontSize: "10px" }} />
                            </a>
                          )}
                        </div>

                        {/* Price & Book Button */}
                        <div className="d-flex align-items-center justify-content-between pt-1.5" style={{ borderTop: "1px solid #F1F5F9" }}>
                          <span style={{ fontSize: "13px", fontWeight: "800", color: "#17222D" }}>
                            {"\u20B9"}{venue.price_per_hr || "750"} <span style={{ fontSize: "9px", fontWeight: "normal", color: "#606D76" }}>/hr</span>
                          </span>
                          <Link 
                            to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                            className="btn btn-primary btn-sm rounded-pill px-2.5 py-0.5"
                            style={{ fontSize: "10px", fontWeight: "600", backgroundColor: "#22C55E", borderColor: "#22C55E" }}
                          >
                            Book Slot
                          </Link>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-12 text-center py-5 bg-white rounded-4 border" style={{ borderColor: "#E2E8E3" }}>
                  <i className="feather-alert-circle text-muted mb-2" style={{ fontSize: "32px" }} />
                  <h5 className="fw-bold text-dark">No Venues Found</h5>
                  <p className="text-muted fs-6 mb-0">Try clearing your search filters to view available facilities</p>
                </div>
              )}

              {/* Bottom Pagination & Status Subtitle */}
              <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4">
                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap justify-content-center">
                  {/* Previous Button */}
                  <button
                    type="button"
                    className="btn d-flex align-items-center justify-content-center shadow-sm"
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      color: currentPage === 1 ? "#CBD5E1" : "#334155",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <i className="feather-chevron-left" />
                  </button>

                  {/* Page Number Buttons */}
                  {(() => {
                    const items: (number | string)[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) items.push(i);
                    } else {
                      if (currentPage <= 4) {
                        items.push(1, 2, 3, 4, 5, "...", totalPages);
                      } else if (currentPage >= totalPages - 3) {
                        items.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                      } else {
                        items.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
                      }
                    }

                    return items.map((item, idx) => {
                      if (item === "...") {
                        return (
                          <span key={`dots-${idx}`} className="px-2 text-muted fw-bold" style={{ fontSize: "14px" }}>
                            ...
                          </span>
                        );
                      }
                      const pageNum = Number(item);
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className="btn d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "10px",
                            backgroundColor: isActive ? "#00B050" : "#FFFFFF",
                            border: isActive ? "none" : "1px solid #E2E8F0",
                            color: isActive ? "#FFFFFF" : "#334155",
                            fontWeight: "700",
                            fontSize: "14px",
                            transition: "all 0.2s ease"
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}

                  {/* Next Button */}
                  <button
                    type="button"
                    className="btn d-flex align-items-center justify-content-center shadow-sm"
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      color: currentPage === totalPages ? "#CBD5E1" : "#334155",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <i className="feather-chevron-right" />
                  </button>
                </div>

                {/* Subtitle text */}
                <p className="mb-0" style={{ fontSize: "14px", color: "#64748B", fontWeight: "500", marginTop: "8px" }}>
                  Showing <span style={{ color: "#1E293B", fontWeight: "700" }}>{displayList.length > 0 ? indexOfFirstVenue + 1 : 0}</span> to <span style={{ color: "#1E293B", fontWeight: "700" }}>{Math.min(indexOfLastVenue, displayList.length)}</span> of <span style={{ color: "#1E293B", fontWeight: "700" }}>{displayList.length}</span> venues
                </p>
              </div>

            </div>
            {/* /RIGHT COLUMN */}

          </div>
          {/* /Two-Column Layout */}

        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
}

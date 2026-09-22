
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../css/FilterModal.css";
import "react-input-range/lib/css/index.css";
import InputRange from "react-input-range";

const MIN_PRICE = 600;
const MAX_PRICE = 30000;

const FilterModal = ({ selectedFilters, onFilterChange, onClose }) => {
  const [priceRange, setPriceRange] = useState({
    min: selectedFilters.minPrice || MIN_PRICE,
    max: selectedFilters.maxPrice || MAX_PRICE,
  });

  const [propertyType, setPropertyType] = useState(
    selectedFilters.propertyType || ""
  );

  const [roomType, setRoomType] = useState(
    selectedFilters.roomType || ""
  );

  const [amenities, setAmenities] = useState(
    selectedFilters.amenities || []
  );

  useEffect(() => {
    setPriceRange({
      min: Number(selectedFilters.minPrice) || MIN_PRICE,
      max: Number(selectedFilters.maxPrice) || MAX_PRICE,
    });

    setPropertyType(selectedFilters.propertyType || "");
    setRoomType(selectedFilters.roomType || "");
    setAmenities(selectedFilters.amenities || []);
  }, [
    selectedFilters.minPrice,
    selectedFilters.maxPrice,
    selectedFilters.propertyType,
    selectedFilters.roomType,
    selectedFilters.amenities,
  ]);

  const handlePriceRangeChange = (value) => {
    if (
      value &&
      Number.isFinite(value.min) &&
      Number.isFinite(value.max)
    ) {
      setPriceRange({
        min: Math.max(MIN_PRICE, Math.min(value.min, MAX_PRICE)),
        max: Math.min(MAX_PRICE, Math.max(value.max, MIN_PRICE)),
      });
    }
  };

  const handleMinInputChange = (e) => {
    const value = Number(e.target.value);

    if (!Number.isFinite(value)) return;

    setPriceRange((prev) => ({
      min: Math.max(MIN_PRICE, Math.min(value, prev.max)),
      max: prev.max,
    }));
  };

  const handleMaxInputChange = (e) => {
    const value = Number(e.target.value);

    if (!Number.isFinite(value)) return;

    setPriceRange((prev) => ({
      min: prev.min,
      max: Math.min(MAX_PRICE, Math.max(value, prev.min)),
    }));
  };

  // APPLY FILTERS
  const handleFilterChange = () => {
    console.log("APPLY FILTER CLICKED");
    console.log("PRICE:", priceRange);
    console.log("PROPERTY TYPE:", propertyType);
    console.log("ROOM TYPE:", roomType);
    console.log("AMENITIES:", amenities);

    onFilterChange("minPrice", priceRange.min);
    onFilterChange("maxPrice", priceRange.max);
    onFilterChange("propertyType", propertyType);
    onFilterChange("roomType", roomType);
    onFilterChange("amenities", amenities);

    onClose();
  };

  const propertyTypeOptions = [
    { value: "house", label: "House", icon: "home" },
    { value: "Flat", label: "Flat", icon: "apartment" },
    { value: "guest-house", label: "Guest House", icon: "hotel" },
    { value: "hotel", label: "Hotel", icon: "meeting_room" },
  ];

  const roomTypeOptions = [
    { value: "Entire Home", label: "Entire Home", icon: "hotel" },
    { value: "Room", label: "Room", icon: "meeting_room" },
    { value: "Anytype", label: "Any Type", icon: "apartment" },
  ];

  const amenitiesOptions = [
    { value: "Wifi", label: "Wi-Fi", icon: "wifi" },
    { value: "Kitchen", label: "Kitchen", icon: "kitchen" },
    { value: "Ac", label: "AC", icon: "ac_unit" },
    {
      value: "Washing Machine",
      label: "Washing Machine",
      icon: "local_laundry_service",
    },
    { value: "Tv", label: "TV", icon: "tv" },
    { value: "Pool", label: "Pool", icon: "pool" },
    {
      value: "Free Parking",
      label: "Free Parking",
      icon: "local_parking",
    },
  ];

  // CLEAR FILTERS
  const handleClearFilters = () => {
    setPriceRange({
      min: MIN_PRICE,
      max: MAX_PRICE,
    });

    setPropertyType("");
    setRoomType("");
    setAmenities([]);

    onFilterChange("minPrice", MIN_PRICE);
    onFilterChange("maxPrice", MAX_PRICE);
    onFilterChange("propertyType", "");
    onFilterChange("roomType", "");
    onFilterChange("amenities", []);
  };

  const handleAmenitiesChange = (selectedAmenity) => {
    setAmenities((prevAmenities) =>
      prevAmenities.includes(selectedAmenity)
        ? prevAmenities.filter((item) => item !== selectedAmenity)
        : [...prevAmenities, selectedAmenity]
    );
  };

  const handlePropertyTypeChange = (selectedType) => {
    setPropertyType((prevType) =>
      prevType === selectedType ? "" : selectedType
    );
  };

  const handleRoomTypeChange = (selectedType) => {
    setRoomType((prevType) =>
      prevType === selectedType ? "" : selectedType
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h4>
          Filters <hr />
        </h4>

        <button className="close-button" onClick={onClose}>
          <span>&times;</span>
        </button>

        <div className="modal-filters-container">
          <div className="filter-section">
            <label>Price Range:</label>

            <InputRange
              minValue={MIN_PRICE}
              maxValue={MAX_PRICE}
              value={priceRange}
              onChange={handlePriceRangeChange}
            />

            <div className="range-inputs">
              <input
                type="number"
                min={MIN_PRICE}
                max={MAX_PRICE}
                value={priceRange.min}
                onChange={handleMinInputChange}
              />

              <span>-</span>

              <input
                type="number"
                min={MIN_PRICE}
                max={MAX_PRICE}
                value={priceRange.max}
                onChange={handleMaxInputChange}
              />
            </div>
          </div>

          <div className="filter-section">
            <label>Property Type:</label>

            <div className="icon-box">
              {propertyTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`selectable-box ${
                    propertyType === option.value ? "selected" : ""
                  }`}
                  onClick={() =>
                    handlePropertyTypeChange(option.value)
                  }
                >
                  <span className="material-icons">
                    {option.icon}
                  </span>

                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label>Room Type:</label>

            <div className="icon-box">
              {roomTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`selectable-box ${
                    roomType === option.value ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleRoomTypeChange(option.value)
                  }
                >
                  <span className="material-icons">
                    {option.icon}
                  </span>

                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label>Amenities:</label>

            <div className="amenities-checkboxes">
              {amenitiesOptions.map((option) => (
                <div
                  key={option.value}
                  className="amenity-checkbox"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={amenities.includes(option.value)}
                    onChange={() =>
                      handleAmenitiesChange(option.value)
                    }
                  />

                  <span className="material-icons amenitieslabel">
                    {option.icon}
                  </span>

                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className="clear-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>

            <button onClick={handleFilterChange}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FilterModal.propTypes = {
  selectedFilters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterModal;

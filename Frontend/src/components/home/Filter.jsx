
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FilterModal from "./FilterModal";
import { propertyAction } from "../../store/Property/property-slice";

const Filter = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    roomType: "",
    amenities: [],
  });

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (filterName, value) => {
    console.log("FILTER CHANGE:", filterName, value);

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  useEffect(() => {
    console.log("FILTER SELECTED:", selectedFilters);

    dispatch(
      propertyAction.updateSearchParams(selectedFilters)
    );
  }, [selectedFilters, dispatch]);

  return (
    <>
      <span
        className="material-symbols-outlined filter"
        onClick={handleShowAllPhotos}
      >
        tune
      </span>

      {isModalOpen && (
        <FilterModal
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Filter;

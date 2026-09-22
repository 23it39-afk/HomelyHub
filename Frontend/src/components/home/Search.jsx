
import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/Home.css";

import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";

const Search = () => {
  const { RangePicker } = DatePicker;

  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState({
    city: "",
    guests: "",
    dateIn: "",
    dateOut: "",
  });

  const [value, setValue] = useState([]);

  function searchHandler(e) {
    e.preventDefault();

    console.log("Search keyword:", keyword);

    dispatch(
      propertyAction.updateSearchParams({
        city: keyword.city,
        guests: keyword.guests,
        dateIn: keyword.dateIn,
        dateOut: keyword.dateOut,
        page: 1,
      })
    );

    setKeyword({
      city: "",
      guests: "",
      dateIn: "",
      dateOut: "",
    });

    setValue([]);
  }

  function returnDates(date, dateString) {
    if (!date) {
      setValue([]);
      updateKeyword("dateIn", "");
      updateKeyword("dateOut", "");
      return;
    }

    setValue([date[0], date[1]]);

    updateKeyword("dateIn", dateString[0]);
    updateKeyword("dateOut", dateString[1]);
  }

  const updateKeyword = (field, value) => {
    setKeyword((prevKeyword) => ({
      ...prevKeyword,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="searchbar">

        <input
          className="search"
          id="search_destination"
          placeholder="Search destinations"
          type="text"
          value={keyword.city}
          onChange={(e) =>
            updateKeyword("city", e.target.value)
          }
        />

        <Space direction="vertical" size={12}>
          <RangePicker
            value={value}
            format="DD-MM-YYYY"
            picker="date"
            className="date_picker"
            disabledDate={(current) => {
              return current && current.isBefore(Date.now(), "day");
            }}
            onChange={returnDates}
          />
        </Space>

        <input
          className="search"
          id="addguest"
          placeholder="Add guests"
          type="number"
          value={keyword.guests}
          onChange={(e) =>
            updateKeyword("guests", e.target.value)
          }
        />

        <span
          className="material-symbols-outlined searchicon"
          onClick={searchHandler}
        >
          search
        </span>

      </div>
    </>
  );
};

export default Search;

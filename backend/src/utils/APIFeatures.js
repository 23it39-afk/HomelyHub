// ---- APIFeatures: builds the search query, 
// The listings page has filters, a search box and pages. Doing
// all that inside the controller would make it 100 lines long.
// So we keep it here, and the controller stays clean:
//     new APIFeatures(Property.find(), req.query)
//       .filter().search().paginate()
//
// A class is a blueprint. 'new' makes one copy to work with.
class APIFeatures {
  // constructor runs once, when we say 'new APIFeatures(...)'
  // query       = the unfinished mongoose search
  // queryString = what the user asked for (req.query), the
  //               part of the address after the ? mark
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  // FILTER - the tick boxes: price, type, room, amenities

filter() {
  let filterQuery = {};
  let queryObj = { ...this.queryString };

  // PRICE FILTER
  if (queryObj.minPrice || queryObj.maxPrice) {
    filterQuery.price = {};

    if (queryObj.minPrice) {
      filterQuery.price.$gte = Number(queryObj.minPrice);
    }

    if (queryObj.maxPrice && !String(queryObj.maxPrice).includes(">")) {
      filterQuery.price.$lte = Number(queryObj.maxPrice);
    }
  }

  // PROPERTY TYPE
  if (queryObj.propertyType) {
    const propertyTypeArray = queryObj.propertyType
      .split(",")
      .map((value) => value.trim());

    filterQuery.propertyType = {
      $in: propertyTypeArray,
    };
  }

  // ROOM TYPE
  if (queryObj.roomType) {
    filterQuery.roomType = queryObj.roomType;
  }

  // AMENITIES
  if (queryObj.amenities) {
    const amenitiesArray = Array.isArray(queryObj.amenities)
      ? queryObj.amenities
      : [queryObj.amenities];

    if (amenitiesArray.length > 0) {
      filterQuery["amenities.name"] = {
        $all: amenitiesArray,
      };
    }
  }

  console.log("FILTER QUERY:", filterQuery);

  this.query = this.query.find(filterQuery);

  return this;
}


  // SEARCH - the box on top: city, guests, dates

// SEARCH - city, guests, dates
search() {
  let searchQuery = {};
  let queryObj = { ...this.queryString };

  // CITY SEARCH
  if (queryObj.city) {
    const city = queryObj.city
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-");

    searchQuery.$or = [
      { "address.city": city },
      { "address.state": city },
      { "address.area": city },
    ];
  }

  // GUEST SEARCH
  if (queryObj.guests) {
    searchQuery.maximumGuests = {
   $gte: Number(queryObj.guests),
   };
  }

  // DATE SEARCH
  if (queryObj.dateIn && queryObj.dateOut) {
    searchQuery.currentBookings = {
      $not: {
        $elemMatch: {
          $or: [
            {
              fromDate: { $lt: queryObj.dateOut },
              toDate: { $gt: queryObj.dateIn },
            },
            {
              fromDate: { $lt: queryObj.dateIn },
              toDate: { $gt: queryObj.dateIn },
            },
          ],
        },
      },
    };
  }

  console.log("SEARCH QUERY:", searchQuery);

  this.query = this.query.find(searchQuery);

  return this;
}

  // PAGINATE - show 12 at a time, not 500 at once
  paginate() {
    // * 1 turns the text '2' into the number 2.
    // || 1 means: nothing sent, so start at page 1.
    let page = this.queryString.page * 1 || 1;
    // how many per page. 12 by default.
    let limit = this.queryString.limit * 1 || 12;
    // page 1 skips 0, page 2 skips 12, page 3 skips 24
    let skip = (page - 1) * limit;

    // skip that many, then take only 'limit' of them
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}


// propertyController imports this to build the listings search
export { APIFeatures };

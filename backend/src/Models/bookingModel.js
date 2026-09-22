// which property 
// which user
// price , dates , guests, paid

import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.ObjectId,       
    ref: "Property",
    required: [true, "Booking must belong to a property!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user!"],
  },    
  price: {
    type: Number,
    required: [true, "Booking must have a price!"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  paid: {
    type: Boolean,
    default: false,
  },
  fromDate: {
  type: Date,
},

toDate: {
  type: Date,
},
  guests: { 
    type: Number,
  },
  numberOfNights: {
    type: Number,
  },

},
{ timestamps: true  }

);

bookingSchema.pre(/^find/, function () {
  this.populate("user");
  this.populate({
    path: "property",
    select:"maximumGuests  images propertyName address"
  });

});

const Booking = mongoose.model("Booking", bookingSchema);
export { Booking };
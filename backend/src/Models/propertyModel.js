import slugify from "slugify";
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: [
        true,
        "Please provide a property name",
      ],
      unique: true,
    },

    description: {
      type: String,
      required: [
        true,
        "Please provide a description",
      ],
    },

    extraInfo: {
      type: String,
      default: "checking on time. good services",
    },

    propertyType: {
      type: String,
      enum: [
        "House",
        "Flat",
        "Guest House",
        "Hotel",
      ],
      required: [
        true,
        "Please provide property type",
      ],
    },

    roomType: {
      type: String,
      enum: [
        "Anytype",
        "Entire Home",
        "Room",
      ],
      required: [
        true,
        "Please provide room type",
      ],
    },

    maximumGuests: {
      type: Number,
      required: [
        true,
        "Please provide the maximum number of guests",
      ],
    },

    amenities: [
      {
        name: {
          type: String,
          required: true,
          enum: [
            "Wifi",
            "Tv",
            "Ac",
            "Free Parking",
          ],
        },

        icon: {
          type: String,
          required: true,
        },
      },
    ],

    images: {
      type: [
        {
          public_id: {
            type: String,
            required: true,
          },

          url: {
            type: String,
            required: true,
          },
        },
      ],

      validate: {
        validator: function (arr) {
          return arr.length >= 6;
        },

        message:
          "Please provide at least 6 images for the property",
      },
    },

    price: {
      type: Number,
      required: [
        true,
        "Please provide the price per night",
      ],
      default: 500,
    },

    address: {
      area: String,
      city: String,
      state: String,
      pincode: String,
    },

    currentBookings: [
      {
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },

        fromDate: {
          type: Date,
        },

        toDate: {
          type: Date,
        },

        userId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slug: {
      type: String,
    },

    checkInTime: {
      type: String,
      default: "12:00 PM",
    },

    checkOutTime: {
      type: String,
      default: "11:00 AM",
    },
  },
  {
    timestamps: true,
  }
);

// CREATE SLUG + FORMAT CITY
propertySchema.pre("save", function () {
  this.slug = slugify(this.propertyName, {
    lower: true,
    strict: true,
  });

  if (this.address?.city) {
    this.address.city = this.address.city
      .toLowerCase()
      .replaceAll(" ", "-");
  }
});

const Property =
  mongoose.models.Property ||
  mongoose.model("Property", propertySchema);

export { Property };
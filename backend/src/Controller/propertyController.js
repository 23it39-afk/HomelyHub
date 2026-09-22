import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";

// GET ALL PROPERTIES
const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(
      Property.find(),
      req.query
    )
      .filter()
      .search()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      no_of_responses: doc.length,
      data: doc,
    });
  } catch (error) {
    console.error(
      "Error searching properties:",
      error
    );

    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};


// GET PROPERTY BY ID
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(
      req.params.id
    );

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};


// CREATE PROPERTY
const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuests,
      price,
      images,
    } = req.body;

    console.log(
      "CREATE PROPERTY BODY:",
      req.body
    );

    // Check images
    if (
      !images ||
      !Array.isArray(images) ||
      images.length < 6
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide at least 6 images for the property",
      });
    }

    const uploadedImages = [];

    for (const image of images) {
      const result = await imagekit.upload({
        file: image.url,
        fileName: `property_${Date.now()}.jpg`,
        folder: "property_images",
      });

      uploadedImages.push({
        url: result.url,
        public_id: result.fileId,
      });
    }

    const property = await Property.create({
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuests,
      price,
      images: uploadedImages,

      // Logged-in owner
      userId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      data: {
        data: property,
      },
    });

  } catch (error) {
    console.error(
      "Error creating property:",
      error
    );

    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


// GET MY PROPERTIES
const getUsersProperties = async (req, res) => {
  try {
    const userId = req.user._id;

    const property = await Property.find({
      userId,
    });

    res.status(200).json({
      status: "success",
      data: property,
    });

  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};


export {
  getProperties,
  getProperty,
  createProperty,
  getUsersProperties,
};
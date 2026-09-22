import express from "express";
import {
  getProperties,
  getProperty,
} from "../Controller/propertyController.js";

const propertyRouter = express.Router();

propertyRouter.route("/").get(getProperties);
propertyRouter.route("/:id").get(getProperty);

export default propertyRouter;
import { TripDetail } from "./tripDetail.interface";
import { Model, Schema, model } from "mongoose";

const mongoose = require("mongoose");

// Define the Activity schema
const activitySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  proTip: {
    type: String,
    required: true,
  },
});

// Define the Itinerary schema
const itinerarySchema = new mongoose.Schema({
  place: {
    type: String,
    required: true,
  },
  dayNo: {
    type: Number,
    required: true,
  },
  imageDBName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// Define the TripDetail schema
const tripDetailSchema = new mongoose.Schema({
  userId: {
    type: String, // You can also use mongoose.Schema.Types.ObjectId if it refers to a user in another collection
    required: true,
  },
  requirementsId: {
    type: String, // Same here, ObjectId can be used if referring to another collection
    required: true,
  },
  checkedItineraries: [itinerarySchema],
  suggestedActivities: [activitySchema],
});

// Create the TripDetail model
export const TripDetailModel = model<TripDetail>(
  "TripDetail",
  tripDetailSchema
);

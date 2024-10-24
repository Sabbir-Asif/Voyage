import { TripDetailModel } from "./tripDetail.model";
import {
  TripDetail,
  TripDetail as TripDetailType,
} from "./tripDetail.interface"; // Import your TripDetail type if needed
import { Document } from "mongoose";

// Service to create a new TripDetail
export const createTripDetailService = async (
  tripDetailData: TripDetailType
): Promise<Document> => {
  const newTripDetail = new TripDetailModel(tripDetailData);
  return await newTripDetail.save();
};

export const getTripDetailsService = async (): Promise<TripDetail[]> => {
  return await TripDetailModel.find(); // Fetch all trip details from the database
};

// get trip detail for specific user id
// tripDetail.service.ts

// Method to find trip details by userId
export const findTripDetailsByUserId = async (
  userId: string
): Promise<TripDetail | null> => {
  try {
    return await TripDetailModel.findOne({ userId }).exec();
  } catch (error) {
    console.error("Error fetching trip details:", error);
    throw new Error("Could not fetch trip details");
  }
};

// Service to update an existing TripDetail
export const updateTripDetailService = async (
  tripDetailId: string,
  updateData: Partial<TripDetailType>
): Promise<Document | null> => {
  return await TripDetailModel.findByIdAndUpdate(tripDetailId, updateData, {
    new: true,
  });
};

// Service to delete a TripDetail
export const deleteTripDetailService = async (
  tripDetailId: string
): Promise<Document | null> => {
  return await TripDetailModel.findByIdAndDelete(tripDetailId);
};

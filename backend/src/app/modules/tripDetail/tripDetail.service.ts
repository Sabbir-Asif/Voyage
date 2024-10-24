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

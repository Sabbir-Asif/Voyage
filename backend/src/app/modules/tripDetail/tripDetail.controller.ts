// tripDetail.controller.ts
import { Request, Response } from "express";
import {
  createTripDetailService,
  getTripDetailsService,
  updateTripDetailService,
  deleteTripDetailService,
} from "./tripDetail.service";

// Controller to create a new TripDetail
const createTripDetail = async (req: Request, res: Response) => {
  try {
    const tripDetailData = req.body; // Assumes body contains a valid TripDetail object
    const newTripDetail = await createTripDetailService(tripDetailData);
    res.status(201).json({
      success: true,
      message: "Trip detail created successfully",
      data: newTripDetail,
    });
  } catch (err) {
    console.error("Error creating trip detail:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTripDetails = async (req: Request, res: Response) => {
  try {
    const tripDetails = await getTripDetailsService();
    res.status(200).json({
      success: true,
      data: tripDetails,
    });
  } catch (err) {
    console.error("Error fetching trip details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to update an existing TripDetail
const updateTripDetail = async (req: Request, res: Response) => {
  try {
    const { tripDetailId } = req.params; // Assumes the tripDetailId is in the URL parameters
    const updateData = req.body;

    const updatedTripDetail = await updateTripDetailService(
      tripDetailId,
      updateData
    );
    if (!updatedTripDetail) {
      return res.status(404).json({ message: "Trip detail not found" });
    }

    res.status(200).json({
      success: true,
      message: "Trip detail updated successfully",
      data: updatedTripDetail,
    });
  } catch (err) {
    console.error("Error updating trip detail:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete a TripDetail
const deleteTripDetail = async (req: Request, res: Response) => {
  try {
    const { tripDetailId } = req.params; // Assumes the tripDetailId is in the URL parameters

    const deletedTripDetail = await deleteTripDetailService(tripDetailId);
    if (!deletedTripDetail) {
      return res.status(404).json({ message: "Trip detail not found" });
    }

    res.status(200).json({
      success: true,
      message: "Trip detail deleted successfully",
      data: deletedTripDetail,
    });
  } catch (err) {
    console.error("Error deleting trip detail:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const TripDetailControllers = {
  createTripDetail,
  getTripDetails,
  updateTripDetail,
  deleteTripDetail,
};

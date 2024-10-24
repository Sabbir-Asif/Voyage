import { Request, Response } from "express";
import { RequirementServices } from "./requirement.service";

// Create a new requirement
export const createRequirement = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const savedRequirement = await RequirementServices.createRequirementIntoDB(
      req.body
    );
    res.status(201).json(savedRequirement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all requirements
export const getAllRequirements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const requirements = await RequirementServices.getAllRequirements();
    res.status(200).json(requirements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get requirement by ID
export const getRequirementById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const requirement = await RequirementServices.getRequirementById({ id });
    if (!requirement) {
      res.status(404).json({ message: "Requirement not found" });
      return;
    }
    res.status(200).json(requirement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update requirement by ID
export const updateRequirementById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedRequirement = await RequirementServices.updateRequirementById(
      req.params.id,
      req.body
    );
    if (!updatedRequirement) {
      res.status(404).json({ message: "Requirement not found" });
      return;
    }
    res.status(200).json(updatedRequirement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


import { Model, Schema, model } from "mongoose";
import { Requirement } from "./requirement.interface";

const requirementSchema = new Schema<Requirement>({
  boardingPoint: { type: String, required: true },
  destination: { type: String, required: true },
  company: { type: String, required: true },
  ageConcern: { type: String, required: true },
  sinceWhen: { type: Date, required: true },
  tillWhen: { type: Date, required: true },
  budgetType: { type: String, required: true },
  preferredActivities: [{ type: String, required: true }],
  userId: { type: String, required: true },
});

export const RequirementModel = model<Requirement>(
  "Requirement",
  requirementSchema
);

import { Router } from "express";
import { TripDetailControllers } from "./tripDetail.controller";

const router: Router = Router();

router.post("/add", TripDetailControllers.createTripDetail);
router.get("/get", TripDetailControllers.getTripDetails);
router.put("/update/:tripDetailId", TripDetailControllers.updateTripDetail);
router.delete("/delete/:tripDetailId", TripDetailControllers.deleteTripDetail);

export const TripDetailRouter = router;

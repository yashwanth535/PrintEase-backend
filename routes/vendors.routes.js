import { getLocations, getVendors, getVendorById, getNearestVendors } from "../controllers/vendors.controller.js";
import express from "express";

const router = express.Router();

router.get("/locations", getLocations);
router.get("/", getVendors);
router.get("/:id", getVendorById);
router.post("/nearest", getNearestVendors);

export default router;
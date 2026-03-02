// validators/bookingValidator.ts
import { body, param } from "express-validator";

// --------------------
// Book a Tow Validation
// --------------------
export const bookTowValidation = [
  body("service")
    .notEmpty()
    .withMessage("Service is required")
    .isString()
    .withMessage("Service must be a string"),
  body("pickup")
    .notEmpty()
    .withMessage("Pickup location is required")
    .isString()
    .withMessage("Pickup must be a string"),
  body("dropoff")
    .notEmpty()
    .withMessage("Dropoff location is required")
    .isString()
    .withMessage("Dropoff must be a string"),
  body("vehicle")
    .notEmpty()
    .withMessage("Vehicle is required")
    .isString()
    .withMessage("Vehicle must be a string"),
];

// --------------------
// Update Booking Status Validation (Admin only)
// --------------------
export const updateBookingStatusValidation = [
  param("id")
    .exists()
    .withMessage("Booking ID is required")
    .isInt({ gt: 0 })
    .withMessage("Booking ID must be a positive number"),
  body("status")
    .exists()
    .withMessage("Status is required")
    .isIn(["pending", "accepted", "completed"])
    .withMessage("Status must be one of: pending, accepted, completed"),
];

// --------------------
// Assign Driver Validation (Admin only)
// --------------------
export const assignDriverValidation = [
  param("id")
    .exists()
    .withMessage("Booking ID is required")
    .isInt({ gt: 0 })
    .withMessage("Booking ID must be a positive number"),
  body("driver_id")
    .exists()
    .withMessage("Driver ID is required")
    .isInt({ gt: 0 })
    .withMessage("Driver ID must be a positive number"),
];
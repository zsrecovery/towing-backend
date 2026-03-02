import { body } from "express-validator";

export const driverRegisterValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const driverUpdateValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Must be a valid email"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

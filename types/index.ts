// types/index.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";


// --------------------
// User Roles
export type Role = "user" | "admin" | "driver";

// --------------------
// User object from database
export interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  vehicle?: string | null; // only for drivers
}

// --------------------
// JWT payload
export interface UserPayload {
  id: number;
  email: string;
  role: Role;
}

// --------------------
// Extend Express Request to include user
export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// For routes that require auth
export interface RequiredAuthRequest extends Request {
  user: UserPayload;
}

// --------------------
// Truck object (for drivers)
export interface Truck {
  id: number;
  driverId: number;       // FK to User
  plateNumber: string;
  model?: string | null;
  capacity?: string | null;
}

// --------------------
// Booking status
export type BookingStatus = "pending" | "accepted" | "completed" | "cancelled";

// --------------------
// Booking object
export interface Booking {
  id: number;
  userId: number;          // who requested the tow
  driverId?: number | null; // assigned driver
  truckId?: number | null;  // assigned truck
  location: string;
  destination?: string | null;
  status: BookingStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------
// Input types for backend routes
export interface CreateBookingInput {
  location: string;
  destination?: string;
  notes?: string;
}

export interface UpdateBookingStatusInput {
  status: BookingStatus;
}

export interface AssignDriverInput {
  driverId: number;
  truckId: number;
}

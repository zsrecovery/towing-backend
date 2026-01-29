export interface UserPayload {
  id: number,
  email: string,
  role: "user" | "admin" | "driver";
}

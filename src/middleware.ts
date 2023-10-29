import { Request } from "express";

export function authorization(req: Request): boolean {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader === undefined) {
    return false;
  }

  const token = authorizationHeader.replace("bearer ", "");

  const SECRET = process.env.SECRET || "thesecrettoken";

  try {
    if (atob(token) !== SECRET) {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
}

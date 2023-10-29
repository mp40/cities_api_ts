import { Request } from "express";

export function authorization(req: Request): boolean {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader === undefined) {
    return false;
  }

  const token = authorizationHeader.replace("bearer ", "");

  try {
    if (atob(token) !== "thesecrettoken") {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
}

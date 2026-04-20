import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { HttpError } from "../lib/http-error.js";

type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing or invalid authorization header."));
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    req.auth = {
      userId: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired authentication token."));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.auth) {
    return next(new HttpError(401, "Authentication is required."));
  }

  if (req.auth.role !== "ADMIN") {
    return next(new HttpError(403, "Admin access is required."));
  }

  return next();
}

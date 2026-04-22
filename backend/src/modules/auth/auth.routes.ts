import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middlewares/require-auth.js";
import { authController } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(authController.login));
authRouter.get("/me", requireAuth, asyncHandler(authController.me));

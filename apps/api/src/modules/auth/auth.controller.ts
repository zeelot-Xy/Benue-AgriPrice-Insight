import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import { loginSchema } from "./auth.schemas.js";

export const authController = {
  async login(req: Request, res: Response) {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload.email, payload.password);

    res.json(result);
  },

  async me(req: Request, res: Response) {
    const result = await authService.getCurrentUser(req.auth!.userId);
    res.json(result);
  },
};

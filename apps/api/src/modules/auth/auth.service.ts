import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const token = jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
        role: user.role.name,
      },
      env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role.name,
      },
    };
  },

  async getCurrentUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new HttpError(404, "Authenticated user was not found.");
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  },
};

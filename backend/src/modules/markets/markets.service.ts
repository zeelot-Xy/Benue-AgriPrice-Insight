import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

export const marketsService = {
  async list() {
    return prisma.market.findMany({
      orderBy: { name: "asc" },
    });
  },

  async getById(id: number) {
    const market = await prisma.market.findUnique({ where: { id } });

    if (!market) {
      throw new HttpError(404, "Market not found.");
    }

    return market;
  },

  async create(input: {
    name: string;
    code: string;
    localGovernmentArea: string;
    state: string;
    isActive?: boolean;
  }) {
    return prisma.market.create({
      data: {
        ...input,
        isActive: input.isActive ?? true,
      },
    });
  },

  async update(
    id: number,
    input: Partial<{
      name: string;
      code: string;
      localGovernmentArea: string;
      state: string;
      isActive: boolean;
    }>,
  ) {
    await this.getById(id);

    return prisma.market.update({
      where: { id },
      data: input,
    });
  },
};

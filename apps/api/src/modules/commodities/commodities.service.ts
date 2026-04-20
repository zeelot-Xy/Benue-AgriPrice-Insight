import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

export const commoditiesService = {
  async list() {
    return prisma.commodity.findMany({
      orderBy: { name: "asc" },
    });
  },

  async getById(id: number) {
    const commodity = await prisma.commodity.findUnique({ where: { id } });

    if (!commodity) {
      throw new HttpError(404, "Commodity not found.");
    }

    return commodity;
  },

  async create(input: {
    name: string;
    slug: string;
    defaultUnit: string;
    isActive?: boolean;
  }) {
    return prisma.commodity.create({
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
      slug: string;
      defaultUnit: string;
      isActive: boolean;
    }>,
  ) {
    await this.getById(id);

    return prisma.commodity.update({
      where: { id },
      data: input,
    });
  },
};

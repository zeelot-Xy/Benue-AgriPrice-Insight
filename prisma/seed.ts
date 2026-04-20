import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ImportStatus,
  PrismaClient,
  RoleName,
} from "@prisma/client";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

type CsvRow = Record<string, string>;

function parseCsv(filePath: string): CsvRow[] {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = headerLine.split(",");

  return lines
    .filter(Boolean)
    .map((line) => {
      const values = line.split(",");
      return headers.reduce<CsvRow>((acc, header, index) => {
        acc[header] = values[index] ?? "";
        return acc;
      }, {});
    });
}

async function main() {
  const rawDir = path.join(repoRoot, "data", "raw");
  const markets = parseCsv(path.join(rawDir, "markets.csv"));
  const commodities = parseCsv(path.join(rawDir, "commodities.csv"));
  const priceRecords = parseCsv(path.join(rawDir, "price_records_sample.csv"));

  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: { name: RoleName.ADMIN },
  });

  await prisma.role.upsert({
    where: { name: RoleName.VIEWER },
    update: {},
    create: { name: RoleName.VIEWER },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bapi.local" },
    update: {},
    create: {
      fullName: "BAPI Seed Admin",
      email: "admin@bapi.local",
      passwordHash: "seed-placeholder-hash-change-before-real-auth",
      roleId: adminRole.id,
      isActive: true,
    },
  });

  for (const market of markets) {
    await prisma.market.upsert({
      where: { code: market.code },
      update: {
        name: market.name,
        localGovernmentArea: market.local_government_area,
        state: market.state,
        isActive: market.is_active === "true",
      },
      create: {
        code: market.code,
        name: market.name,
        localGovernmentArea: market.local_government_area,
        state: market.state,
        isActive: market.is_active === "true",
      },
    });
  }

  for (const commodity of commodities) {
    await prisma.commodity.upsert({
      where: { slug: commodity.slug },
      update: {
        name: commodity.name,
        defaultUnit: commodity.default_unit,
        isActive: commodity.is_active === "true",
      },
      create: {
        slug: commodity.slug,
        name: commodity.name,
        defaultUnit: commodity.default_unit,
        isActive: commodity.is_active === "true",
      },
    });
  }

  const importBatch = await prisma.importBatch.create({
    data: {
      fileName: "price_records_sample.csv",
      status: ImportStatus.COMPLETED,
      totalRows: priceRecords.length,
      successRows: priceRecords.length,
      failedRows: 0,
      notes: "Initial Phase 5 seed import for development",
      createdById: adminUser.id,
    },
  });

  for (const row of priceRecords) {
    const market = await prisma.market.findUniqueOrThrow({
      where: { code: row.market_code },
    });

    const commodity = await prisma.commodity.findUniqueOrThrow({
      where: { slug: row.commodity_slug },
    });

    await prisma.priceRecord.upsert({
      where: {
        marketId_commodityId_priceDate_unit: {
          marketId: market.id,
          commodityId: commodity.id,
          priceDate: new Date(`${row.price_date}T00:00:00.000Z`),
          unit: row.unit,
        },
      },
      update: {
        price: row.price,
        sourceNote: row.source_note || null,
        importBatchId: importBatch.id,
        createdById: adminUser.id,
      },
      create: {
        marketId: market.id,
        commodityId: commodity.id,
        createdById: adminUser.id,
        importBatchId: importBatch.id,
        priceDate: new Date(`${row.price_date}T00:00:00.000Z`),
        price: row.price,
        unit: row.unit,
        sourceNote: row.source_note || null,
      },
    });
  }

  console.log(
    `Seeded roles, admin user, ${markets.length} markets, ${commodities.length} commodities, and ${priceRecords.length} price records.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

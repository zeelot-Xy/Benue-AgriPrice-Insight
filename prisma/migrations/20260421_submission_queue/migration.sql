-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PriceSubmissionBatch" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "sourceChannel" TEXT NOT NULL DEFAULT 'PUBLIC_UPLOAD',
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "validRows" INTEGER NOT NULL DEFAULT 0,
    "invalidRows" INTEGER NOT NULL DEFAULT 0,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceSubmissionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceSubmissionRow" (
    "id" SERIAL NOT NULL,
    "batchId" INTEGER NOT NULL,
    "marketId" INTEGER NOT NULL,
    "commodityId" INTEGER NOT NULL,
    "marketCode" TEXT NOT NULL,
    "commoditySlug" TEXT NOT NULL,
    "priceDate" DATE NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "sourceNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceSubmissionRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceSubmissionBatch_status_createdAt_idx" ON "PriceSubmissionBatch"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PriceSubmissionRow_batchId_idx" ON "PriceSubmissionRow"("batchId");

-- CreateIndex
CREATE INDEX "PriceSubmissionRow_marketId_commodityId_priceDate_idx" ON "PriceSubmissionRow"("marketId", "commodityId", "priceDate");

-- AddForeignKey
ALTER TABLE "PriceSubmissionBatch" ADD CONSTRAINT "PriceSubmissionBatch_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSubmissionRow" ADD CONSTRAINT "PriceSubmissionRow_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PriceSubmissionBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSubmissionRow" ADD CONSTRAINT "PriceSubmissionRow_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSubmissionRow" ADD CONSTRAINT "PriceSubmissionRow_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "Commodity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

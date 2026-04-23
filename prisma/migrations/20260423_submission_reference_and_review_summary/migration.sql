ALTER TABLE "PriceSubmissionBatch"
ADD COLUMN "publicReferenceCode" TEXT;

UPDATE "PriceSubmissionBatch"
SET "publicReferenceCode" = 'BAPI-' || LPAD("id"::text, 6, '0')
WHERE "publicReferenceCode" IS NULL;

ALTER TABLE "PriceSubmissionBatch"
ALTER COLUMN "publicReferenceCode" SET NOT NULL;

CREATE UNIQUE INDEX "PriceSubmissionBatch_publicReferenceCode_key"
ON "PriceSubmissionBatch"("publicReferenceCode");

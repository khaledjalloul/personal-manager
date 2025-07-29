/*
  Warnings:

  - The values [manual,auto] on the enum `ExpenseType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExpenseType_new" AS ENUM ('Manual', 'Auto');
ALTER TABLE "Expense" ALTER COLUMN "type" TYPE "ExpenseType_new" USING ("type"::text::"ExpenseType_new");
ALTER TABLE "Fund" ALTER COLUMN "type" TYPE "ExpenseType_new" USING ("type"::text::"ExpenseType_new");
ALTER TYPE "ExpenseType" RENAME TO "ExpenseType_old";
ALTER TYPE "ExpenseType_new" RENAME TO "ExpenseType";
DROP TYPE "ExpenseType_old";
COMMIT;

-- CreateTable
CREATE TABLE "JournalCategory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JournalCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalSection" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "name" TEXT NOT NULL,

    CONSTRAINT "JournalSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sectionId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JournalSection" ADD CONSTRAINT "JournalSection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JournalCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "JournalSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

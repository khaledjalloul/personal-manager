/*
  Warnings:

  - Made the column `categoryId` on table `JournalSection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JournalSection" ALTER COLUMN "categoryId" SET NOT NULL;

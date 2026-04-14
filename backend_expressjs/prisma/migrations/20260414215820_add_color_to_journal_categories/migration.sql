/*
  Warnings:

  - Added the required column `color` to the `JournalCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JournalCategory" ADD COLUMN     "color" TEXT NOT NULL,
ALTER COLUMN "order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "JournalSection" ALTER COLUMN "order" DROP DEFAULT;

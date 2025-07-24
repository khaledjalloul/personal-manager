/*
  Warnings:

  - Added the required column `type` to the `DiaryEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiaryEntryType" AS ENUM ('Daily', 'Monthly');

-- AlterTable
ALTER TABLE "DiaryEntry" ADD COLUMN     "type" "DiaryEntryType" NOT NULL;

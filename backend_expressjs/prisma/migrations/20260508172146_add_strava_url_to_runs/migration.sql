/*
  Warnings:

  - Added the required column `stravaUrl` to the `Run` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "stravaUrl" TEXT NOT NULL;

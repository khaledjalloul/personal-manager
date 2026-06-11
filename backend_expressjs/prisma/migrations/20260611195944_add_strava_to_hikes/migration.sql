/*
  Warnings:

  - You are about to drop the column `duration` on the `Hike` table. All the data in the column will be lost.
  - You are about to drop the column `durationWithBreaks` on the `Hike` table. All the data in the column will be lost.
  - Added the required column `elapsedTime` to the `Hike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mapPolyline` to the `Hike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movingTime` to the `Hike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stravaActivityId` to the `Hike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hike" DROP COLUMN "duration",
DROP COLUMN "durationWithBreaks",
ADD COLUMN     "elapsedTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mapPolyline" TEXT NOT NULL,
ADD COLUMN     "movingTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stravaActivityId" TEXT NOT NULL;

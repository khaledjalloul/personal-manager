/*
  Warnings:

  - Added the required column `hasPriority` to the `ToDoTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ToDoTask" ADD COLUMN     "hasPriority" BOOLEAN NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

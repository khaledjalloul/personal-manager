/*
  Warnings:

  - You are about to drop the `ExpensesCategoryKeyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Income` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExpensesCategoryKeyword" DROP CONSTRAINT "ExpensesCategoryKeyword_categoryId_fkey";

-- AlterTable
ALTER TABLE "ExpensesCategory" ADD COLUMN     "keywords" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fundKeywords" TEXT[];

-- DropTable
DROP TABLE "ExpensesCategoryKeyword";

-- DropTable
DROP TABLE "Income";

-- CreateTable
CREATE TABLE "Fund" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Fund_pkey" PRIMARY KEY ("id")
);

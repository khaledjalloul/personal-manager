/*
  Warnings:

  - The values [Manual,Auto] on the enum `ExpenseType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExpenseType_new" AS ENUM ('Bank_Auto', 'Bank_Manual', 'Cash');
ALTER TABLE "Expense" ALTER COLUMN "type" TYPE "ExpenseType_new" USING ("type"::text::"ExpenseType_new");
ALTER TABLE "Fund" ALTER COLUMN "type" TYPE "ExpenseType_new" USING ("type"::text::"ExpenseType_new");
ALTER TYPE "ExpenseType" RENAME TO "ExpenseType_old";
ALTER TYPE "ExpenseType_new" RENAME TO "ExpenseType";
DROP TYPE "ExpenseType_old";
COMMIT;

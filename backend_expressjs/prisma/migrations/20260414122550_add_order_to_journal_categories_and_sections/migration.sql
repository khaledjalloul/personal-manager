-- AlterTable
ALTER TABLE "JournalCategory" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "JournalSection" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
